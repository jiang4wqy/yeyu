"""
夜语 (Night Whisper) — 融合东方玄学与现代心理学的 AI 解读服务

设计原则（严格遵守）：
1. 用户输入驱动一切 —— 不复述模板，每次基于用户具体描述重新生成。
2. 上下文感知 —— recent_symbols / recent_keywords / 时段 都进入 prompt，让 AI"记得你"。
3. 引用具体细节 —— 强制要求 AI 在 title/stanzas 里复用用户原文里的具体词。
4. 黑名单兜底 —— 显式禁止常见 AI 套话，让回应去模板化。
"""

import json
import logging
import os
import random
import re
import sqlite3
from datetime import date, datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

LOGGER = logging.getLogger("yeyu")

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="夜语", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DeepSeek API 配置 ──────────────────────────────────────────────
DEEPSEEK_API_KEY  = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL    = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
MOCK_MODE         = not DEEPSEEK_API_KEY

# ── 管理员日志数据库（SQLite，重启会清空）────────────────────────────
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
_DB_DIR  = Path(os.path.dirname(__file__)) / "data"
_DB_PATH = _DB_DIR / "dreams.db"


def _init_db() -> None:
    _DB_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(_DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS dreams (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at   TEXT    NOT NULL,
                user_id      TEXT,
                client_ip    TEXT,
                style        TEXT,
                dream_text   TEXT    NOT NULL,
                ai_title     TEXT,
                ai_response  TEXT
            )
        """)
        conn.commit()


_init_db()


def _log_dream(
    *,
    user_id: Optional[str],
    client_ip: Optional[str],
    style: str,
    dream_text: str,
    ai_response: dict,
) -> None:
    """Best-effort 写库；失败只 warning，不影响主响应。"""
    try:
        with sqlite3.connect(_DB_PATH) as conn:
            conn.execute(
                """INSERT INTO dreams
                   (created_at, user_id, client_ip, style, dream_text, ai_title, ai_response)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (
                    datetime.utcnow().isoformat(timespec="seconds") + "Z",
                    (user_id or "")[:64],
                    (client_ip or "")[:64],
                    (style or "")[:32],
                    dream_text[:4000],
                    str(ai_response.get("title", ""))[:120],
                    json.dumps(ai_response, ensure_ascii=False)[:8000],
                ),
            )
            conn.commit()
    except Exception as exc:
        LOGGER.warning("dream log failed: %s", exc)

XIANG_POOL = ["山", "河", "灯", "镜", "舟", "风", "石", "桥", "井", "火", "雪", "雾", "桃", "烛", "月"]
LEVEL_POOL = ["上上", "上吉", "上吉", "中吉", "中吉", "中吉", "中平", "中平", "中平", "下平"]  # 偏暖

# ── System Prompt ────────────────────────────────────────────────
SYSTEM_PROMPT = """你是「夜语」—— 一个融合东方玄学与现代心理学的解读者。

【你的本质】
你不是占卜师，是镜子。你不告诉用户答案，你帮 TA 看见自己。
每一个梦背后都有一个具体的人。你必须看见这个人，而不是套模板。

【语言底色】
- 中文为主，偶尔几个英文 mono 短句作韵律点缀。
- 有古意，但不掉书袋。
- 给得起锋利，但不刻薄。
- 信意象，也信潜意识。

【硬性禁令（违反任一条都视为失败的解读）】
- 不说"加油""相信自己""一切都会好""希望对你有帮助""作为AI"
- 不堆排比（"它代表着 X，象征着 Y，意味着 Z"）
- 不用"首先""其次""总的来说""值得注意的是""综上所述"
- 感叹号全文最多 1 个
- 不预测具体事件（不说"你下个月会遇到 X"）
- 不涉医疗/法律/财务建议
- 用户表达自伤或绝望情绪时，温柔回应并建议寻求专业帮助
- 不要包裹 markdown 代码块，直接输出 JSON

【输出契约】
- 严格合法 JSON，所有字段必填，宁可短不可空。
- 键名英文（snake_case），值中文。
"""

# 风格细则
STYLE_DEF = {
    "gentle": "比喻多，语气柔，多用「也许」「或许」「像」。少结论，多陪伴。像月光洒在肩上那样轻。",
    "sharp":  "直指痛点，但不刻薄。每段都有一句让人愣住的话。像一面擦得很亮的镜子。",
    "mystic": "多用东方意象（卦、象、气、缘、驿马、星垣）。少心理学术语。语气像翻开一本泛黄的旧书。",
    "modern": "心理学为主，可点名「蔡格尼克效应」「依恋焦虑」「未完成情结」等概念，但解释要清。像一杯温热的拿铁。",
}

# 兼容旧的中文别名
STYLE_ALIAS = {
    "温柔派": "gentle", "锐利派": "sharp", "玄学派": "mystic", "现代派": "modern",
    "gentle": "gentle", "sharp": "sharp", "mystic": "mystic", "modern": "modern",
}


# ── 请求模型 ───────────────────────────────────────────────────────
class UserContext(BaseModel):
    recent_symbols:  List[str] = []
    recent_keywords: List[str] = []
    recent_moods:    List[str] = []
    hour:            Optional[int] = None
    hour_label:      Optional[str] = None


class DreamRequest(BaseModel):
    dream:        str = Field(..., min_length=1)
    style:        Optional[str] = "gentle"
    user_context: Optional[UserContext] = None


class FortuneRequest(BaseModel):
    question:     Optional[str] = ""
    style:        Optional[str] = "gentle"
    seed_sign:    Optional[str] = None    # 前端摇签结果；空则后端随机
    seed_level:   Optional[str] = None
    user_context: Optional[UserContext] = None


class PortraitRequest(BaseModel):
    type:         str = Field(..., description="MBTI | zodiac")
    id:           str = Field(..., description="INTJ / aries 等")
    aspect:       Optional[str] = "core"   # core | love | career | shadow | growth | money
    style:        Optional[str] = "gentle"
    user_context: Optional[UserContext] = None


# ── 工具：DeepSeek 调用 ───────────────────────────────────────────
async def call_deepseek(
    system: str,
    user:   str,
    *,
    temperature: float = 0.9,
    max_tokens:  int = 900,
    expect_json: bool = True,
) -> str:
    if not DEEPSEEK_API_KEY:
        raise HTTPException(status_code=500, detail="DEEPSEEK_API_KEY 未配置")
    payload: Dict[str, Any] = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
        "temperature": temperature,
        "max_tokens":  max_tokens,
    }
    if expect_json:
        payload["response_format"] = {"type": "json_object"}

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type":  "application/json",
            },
            json=payload,
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"DeepSeek: {resp.status_code} {resp.text[:200]}")
        return resp.json()["choices"][0]["message"]["content"]


def parse_json_response(text: str) -> dict:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # 剥 markdown 代码块
    m = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    if m:
        try: return json.loads(m.group(1))
        except json.JSONDecodeError: pass
    # 取第一个完整 {...}
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try: return json.loads(m.group(0))
        except json.JSONDecodeError: pass
    raise ValueError("无法从模型输出中解析 JSON")


# ── 工具：提取用户原文里的关键名词（轻量启发式） ───────────────────
_STOP = set("我你他她它们的了在是和也都很就要会要从把被以为之地得着这那有无大小一个的".replace("的", ""))
def extract_user_phrases(text: str, k: int = 3) -> List[str]:
    """从用户输入里抓 2-3 个具体名词/动词短语，作为 'AI 必须复用的词'。"""
    # 抽汉字短语（2-4 字连续汉字），按出现先后保留首次
    found = []
    seen = set()
    for m in re.finditer(r"[一-龥]{2,4}", text):
        w = m.group(0)
        if w in seen: continue
        # 过滤纯虚词/常见副词
        if w in {"今天", "昨天", "明天", "然后", "突然", "一直", "好像", "感觉", "可能", "应该", "什么", "为什么", "怎么", "这样", "那样", "因为", "所以", "但是", "不过"}:
            continue
        seen.add(w)
        found.append(w)
        if len(found) >= k * 3: break
    # 偏好"有画面感"的（含具体名词字根）
    image_root = "车门窗山河月日雨雪风火灯桥井镜舟石海光影楼路床房屋鸟鱼花树水墙"
    found.sort(key=lambda w: -sum(1 for c in w if c in image_root))
    return found[:k]


def detect_emotion(text: str) -> str:
    """粗判情绪基调。失败时给 'mixed'。"""
    t = text
    pairs = [
        ("anxious",    ["焦虑", "紧张", "害怕", "恐惧", "担心", "怕", "心跳", "急", "逃", "躲", "追", "赶"]),
        ("grief",      ["失去", "离开", "去世", "走了", "哭", "想念", "怀念", "外婆", "爷爷", "妈妈", "妈"]),
        ("confusion",  ["雾", "看不清", "迷路", "陌生", "不知道", "找不到", "迷茫"]),
        ("longing",    ["想见", "想念", "等", "等待", "如果", "要是", "可惜", "错过"]),
        ("calm",       ["安静", "平静", "月光", "湖", "坐着", "看着", "慢"]),
        ("joy",        ["笑", "开心", "高兴", "好玩", "明亮", "好看", "美", "桃花", "光"]),
        ("anger",      ["愤怒", "生气", "吵", "打", "撕", "摔", "砸"]),
        ("melancholy", ["空", "孤独", "一个人", "回声", "落寞", "黄昏", "黑夜"]),
    ]
    score = {k: 0 for k, _ in pairs}
    for k, words in pairs:
        for w in words:
            if w in t: score[k] += 1
    best = max(score.items(), key=lambda kv: kv[1])
    return best[0] if best[1] > 0 else "mixed"


# 情绪 → 推荐基色（mood_color 兜底用）
EMOTION_COLOR = {
    "anxious":    "#5b6a8a",
    "grief":      "#5a4a6a",
    "confusion":  "#7a8090",
    "longing":    "#8c7b9e",
    "calm":       "#aeb8c8",
    "joy":        "#d4a05c",
    "anger":      "#8b3a3a",
    "melancholy": "#4a5a6a",
    "mixed":      "#5B7E9C",
}


# ── 上下文 → prompt 片段 ────────────────────────────────────────
def context_block(ctx: Optional[UserContext]) -> str:
    if not ctx:
        return "【上下文】首次来访。"
    lines = ["【上下文 —— 这是用户在此应用的轨迹，不是你能直接告诉用户的内容，但你要据此让 TA 觉得「被记住」】"]
    if ctx.recent_symbols:
        lines.append(f"• 最近梦里反复出现的意象：{ '、'.join(ctx.recent_symbols[:6]) }")
        lines.append("  → 如果此次的梦里出现了其中之一，可以自然地点出「再次」或「又一次」。")
    if ctx.recent_keywords:
        lines.append(f"• 最近的情绪关键词：{ '、'.join(ctx.recent_keywords[:6]) }")
    if ctx.recent_moods:
        lines.append(f"• 最近的情绪基色：{ '、'.join(ctx.recent_moods[:3]) }")
    if ctx.hour is not None:
        h = ctx.hour
        when = (
            "深夜（人最坦诚的时刻，可以更轻）" if 0 <= h < 5  else
            "黎明前（介于梦与醒之间）"          if h < 7       else
            "清晨（梦还留着余味）"              if h < 11      else
            "正午（理性主导，可以更直）"        if h < 14      else
            "午后（光线开始斜，影子开始说话）"  if h < 18      else
            "傍晚（适合回望）"                   if h < 21      else
            "夜（意识开始落水）"
        )
        lines.append(f"• 此刻是 {when}（{ctx.hour_label or ''} {h}:00 左右）。")
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────
#                       1. 解梦  /api/dream
# ─────────────────────────────────────────────────────────────────

DREAM_USER_TEMPLATE = """{ctx}

【用户今夜的梦】
\"\"\"
{dream}
\"\"\"

【风格】{style_name}
{style_def}

【你的思考过程（不输出，但必须做）】
1. 从原文里挑 2-3 个最具体的词（必须是用户用过的词，不是你想到的同义词）：{user_phrases}
2. 这个梦的情绪基调更接近哪一种？我的初步判断：{emotion_hint}（你可以推翻）
3. 如果用户是熟人，你最想说哪一句让 TA 愣一下的话？

【输出 JSON】严格按以下结构，禁止包裹代码块：

{{
  "title":      "4-7 字诗意标题。必须包含上面挑出的具体词或其衍生。禁用「无题/我的梦/梦境/夜的梦」这种空话。",
  "stanzas": [
    "第 1 句：用用户原文里的一个具体细节开篇（直接引用一个名词或动作）。",
    "第 2 句：把那个细节往里推一步。",
    "第 3 句：轻轻一个反问或转折。",
    "第 4 句：收束。不要给答案，给一个动作或一个允许。"
  ],
  "psychology": "1-3 句心理学层面解读。{psych_rule}",
  "symbolism":  "1-3 句东方象征学解读。{symb_rule}",
  "keywords":   ["3-4 个原子词，必须有至少 2 个直接来自用户原文"],
  "symbols":    ["3-5 个单字或双字意象，必须真实出现在用户梦里"],
  "mood_color": "#RRGGBB —— 按情绪基调选。冷蓝=失落/独处，灰紫=焦虑/迷茫，墨绿=沉稳，暖金=希望/陪伴，桃粉=喜悦/相遇，暗红=愤怒",
  "share_quote": "<=25 字的金句。脱离这个梦能单独成立。"
}}

【验收标准 —— 任何一条不满足都是失败】
- stanzas 必须 4 句。
- title / 至少 1 个 keyword / 至少 1 个 symbol 必须能在用户原文里找到原话或近义。
- 不出现禁用词（见 system）。
- 让用户读完觉得"它真的看了我这条具体的梦"，而不是"任何梦都能套这一段"。"""


def _dream_psych_rule(style: str) -> str:
    return "如果用户偏 mystic 风格，可写「—」让位给象征学。" if style == "mystic" \
        else "可点名「蔡格尼克效应」「投射」「未完成情结」「依恋焦虑」等概念，但要给出 TA 当下的具体对照。"

def _dream_symb_rule(style: str) -> str:
    return "如果用户偏 modern 风格，可写「—」让位给心理学。" \
        if style == "modern" else "可化用《周公解梦》《易经》《道德经》的句式（不必拘泥原文），落到 TA 此刻的处境。"


def _safe_dream(text: str, raw: dict, style: str) -> dict:
    """补字段、做最后清洗。"""
    emotion = detect_emotion(text)
    phrases = extract_user_phrases(text, k=3)

    stanzas = raw.get("stanzas")
    if not isinstance(stanzas, list) or len(stanzas) == 0:
        stanzas = ["夜里有一句话还没说完。", "你也还没。", "今夜停在这里。", "其余留给明天的醒。"]
    # 保证 4 句
    while len(stanzas) < 4:
        stanzas.append("—")
    stanzas = stanzas[:4]

    keywords = raw.get("keywords") or []
    if not keywords:
        keywords = phrases[:3] or ["夜", "梦", "醒"]

    symbols = raw.get("symbols") or []
    if not symbols:
        symbols = phrases[:3] or ["影"]

    mood = raw.get("mood_color") or EMOTION_COLOR.get(emotion, "#5B7E9C")
    if not re.match(r"^#[0-9a-fA-F]{6}$", mood):
        mood = EMOTION_COLOR.get(emotion, "#5B7E9C")

    return {
        "title":       (raw.get("title") or "夜里的影").strip()[:14],
        "stanzas":     [s.strip() for s in stanzas if isinstance(s, str)],
        "psychology":  (raw.get("psychology") or "—").strip(),
        "symbolism":   (raw.get("symbolism")  or "—").strip(),
        "keywords":    [k for k in keywords if k][:4],
        "symbols":     [s for s in symbols  if s][:5],
        "mood_color":  mood,
        "share_quote": (raw.get("share_quote") or "夜还长，慢慢走。").strip()[:30],
    }


@app.post("/api/dream")
async def interpret_dream(req: DreamRequest, request: Request):
    style_key = STYLE_ALIAS.get(req.style or "gentle", "gentle")
    style_name = {"gentle": "温柔派", "sharp": "锐利派", "mystic": "玄学派", "modern": "现代派"}[style_key]
    style_def  = STYLE_DEF[style_key]
    phrases    = extract_user_phrases(req.dream)
    emotion    = detect_emotion(req.dream)

    user_prompt = DREAM_USER_TEMPLATE.format(
        ctx=context_block(req.user_context),
        dream=req.dream,
        style_name=style_name,
        style_def=style_def,
        user_phrases=("、".join(phrases) if phrases else "（用户描述较短，请抓住任意一处具体细节）"),
        emotion_hint=emotion,
        psych_rule=_dream_psych_rule(style_key),
        symb_rule=_dream_symb_rule(style_key),
    )

    user_id   = request.headers.get("x-user-id", "")
    client_ip = (request.client.host if request.client else "") or request.headers.get("x-forwarded-for", "").split(",")[0].strip()

    if MOCK_MODE:
        result = _mock_dream(req.dream, style_key, phrases, emotion)
        _log_dream(user_id=user_id, client_ip=client_ip, style=style_key, dream_text=req.dream, ai_response=result)
        return result

    try:
        raw = await call_deepseek(SYSTEM_PROMPT, user_prompt, temperature=0.9, max_tokens=900)
        try:
            data = parse_json_response(raw)
        except ValueError:
            # 一次轻量重试：明确告诉模型"请直接输出 JSON"
            raw2 = await call_deepseek(SYSTEM_PROMPT, user_prompt + "\n\n再次提醒：直接输出 JSON 对象，不要任何前后文。", temperature=0.85)
            data = parse_json_response(raw2)
        result = _safe_dream(req.dream, data, style_key)
        _log_dream(user_id=user_id, client_ip=client_ip, style=style_key, dream_text=req.dream, ai_response=result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        # 兜底用 mock，但仍嵌入用户具体词
        result = _mock_dream(req.dream, style_key, phrases, emotion)
        result["_error"] = str(e)[:140]
        _log_dream(user_id=user_id, client_ip=client_ip, style=style_key, dream_text=req.dream, ai_response=result)
        return result


# ─────────────────────────────────────────────────────────────────
#                  2. 今日签  /api/fortune
# ─────────────────────────────────────────────────────────────────

FORTUNE_USER_TEMPLATE = """{ctx}

【今日抽到的签】「{sign}」字签，签级「{level}」。
【日期】{today}
【用户的小困惑】{question}

【你要做的】
为 TA 写一则签文。不要解释"我为什么选这个意象"，让它自然落下。
语气像一封写给老朋友的便签，不要像算命摊。
即使签级是「下平」，也要给出温柔的出路，不能让人绝望。

【风格】{style_name}
{style_def}

【输出 JSON】

{{
  "title":   "签题，4-5 字。例：「立山观远」「短烛长夜」",
  "line":    "签文本体，一句 5 或 7 字的古风诗。必须像古诗。",
  "meaning": "1-2 句白话，告诉问签人当下该怎么做。如果用户写了困惑，必须呼应它。",
  "advice": {{
    "宜": "2 字。例：「静守」「远行」「告白」",
    "忌": "2 字。例：「急断」「闭门」「自责」"
  }},
  "sign":    "{sign}",
  "level":   "{level}",
  "mood_color":  "#RRGGBB —— 上上=暖金 #c9a96e，上吉=月白偏金 #d4b87a，中吉=月白 #e8d5a0，中平=雾青 #9bb0c4，下平=石灰 #7c6d5a",
  "share_quote": "<=20 字金句"
}}"""


@app.post("/api/fortune")
async def daily_fortune(req: FortuneRequest):
    sign  = req.seed_sign  if req.seed_sign  in XIANG_POOL else random.choice(XIANG_POOL)
    level = req.seed_level if req.seed_level in {"上上","上吉","中吉","中平","下平"} else random.choice(LEVEL_POOL)
    style_key = STYLE_ALIAS.get(req.style or "gentle", "gentle")
    style_name = {"gentle": "温柔派", "sharp": "锐利派", "mystic": "玄学派", "modern": "现代派"}[style_key]

    if MOCK_MODE:
        return _mock_fortune(sign, level, req.question or "")

    user_prompt = FORTUNE_USER_TEMPLATE.format(
        ctx=context_block(req.user_context),
        sign=sign, level=level,
        today=date.today().strftime("%Y年%m月%d日"),
        question=req.question or "（无）",
        style_name=style_name, style_def=STYLE_DEF[style_key],
    )

    try:
        raw  = await call_deepseek(SYSTEM_PROMPT, user_prompt, temperature=0.9, max_tokens=600)
        data = parse_json_response(raw)
        # 保证两个种子字段不变
        data["sign"]  = sign
        data["level"] = level
        return data
    except Exception as e:
        result = _mock_fortune(sign, level, req.question or "")
        result["_error"] = str(e)[:140]
        return result


# ─────────────────────────────────────────────────────────────────
#                  3. 自我画像  /api/portrait
# ─────────────────────────────────────────────────────────────────

PORTRAIT_ASPECT_DEF = {
    "core":   "核心人格的诗意速写。给一个意象 + 一句直指本质的话。",
    "love":   "TA 在爱里的样子。不要说怎么追、怎么留 —— 要说 TA 自己是什么样的爱人。",
    "career": "在工作里的姿态。强项 + 暗坑 + 一句忠告。",
    "shadow": "暗面。TA 不愿承认的部分，说得克制，不羞辱。",
    "growth": "成长方向。一个意象 + 一个可执行的动作。",
    "money":  "TA 与钱的关系（不是发财建议，是关系的解读）。",
}


PORTRAIT_USER_TEMPLATE = """{ctx}

【类型】{type_label}：{id}
【维度】{aspect} —— {aspect_def}
【风格】{style_name}
{style_def}

【输出 JSON】

{{
  "title":   "给这个 type 在这个 aspect 下起一个意象化的称谓。例：「夜筑造梦者」「月下守梦人」",
  "element": "4 字元素感名词。例：「凛冬之月」「破晓之火」「孤崖之风」",
  "verse":   "解读正文。3-5 句，每句独立成行（用换行符分隔），整体有韵律。",
  "highlight": "其中最锋利那一句（必须是 verse 的一行原文）",
  "color":   "#RRGGBB —— 符合此类型气质",
  "advice":  "一句具体可做的事。例：「今天给妈妈打个电话」",
  "share_quote": "<=20 字金句"
}}

【硬性要求】
- 同 type 同 aspect 每次都要新鲜，不要套模板。
- highlight 必须能在 verse 里逐字匹配到。
- 用 "你"，不要用 "INTJ 就是..." 这种群体化标签。
"""


@app.post("/api/portrait")
async def portrait_reading(req: PortraitRequest):
    style_key  = STYLE_ALIAS.get(req.style or "gentle", "gentle")
    style_name = {"gentle": "温柔派", "sharp": "锐利派", "mystic": "玄学派", "modern": "现代派"}[style_key]
    aspect     = (req.aspect or "core").lower()
    if aspect not in PORTRAIT_ASPECT_DEF:
        aspect = "core"

    if MOCK_MODE:
        return _mock_portrait(req.type, req.id, aspect)

    user_prompt = PORTRAIT_USER_TEMPLATE.format(
        ctx=context_block(req.user_context),
        type_label=("MBTI" if req.type.lower() == "mbti" else "星座"),
        id=req.id,
        aspect=aspect,
        aspect_def=PORTRAIT_ASPECT_DEF[aspect],
        style_name=style_name, style_def=STYLE_DEF[style_key],
    )

    try:
        raw  = await call_deepseek(SYSTEM_PROMPT, user_prompt, temperature=0.95, max_tokens=700)
        data = parse_json_response(raw)
        return data
    except Exception as e:
        result = _mock_portrait(req.type, req.id, aspect)
        result["_error"] = str(e)[:140]
        return result


# ─────────────────────────────────────────────────────────────────
#                       Mock 兜底（含用户词复用）
# ─────────────────────────────────────────────────────────────────

_DREAM_MOCK_TEMPLATES = [
    {
        "title_tpl":   "追不上的{w}",
        "stanzas": [
            "你提到{w}，那是一段没追上的呼吸。",
            "你跑得很急，{w}却越走越慢。",
            "也许不是你慢 —— 是它从未真正属于你。",
            "夜色里坐下来，听见自己呼吸 —— 那也是一种抵达。",
        ],
        "psychology": "梦中「追逐」的意象常常映照失控感与未完成的执行。被中断的事，会在夜里继续跑。",
        "symbolism":  "古训「君子如车，行止有度」。错过的，恰是夜留给你的喘息。",
        "color":      "#5B7E9C",
        "quote":      "有些{w}错过了，会有下一班。",
    },
    {
        "title_tpl":   "雾里的{w}",
        "stanzas": [
            "梦里你看见{w}，但看不清。",
            "雾不是阻拦你，雾是给你一段不必看清的时间。",
            "你是不是太想「立刻知道答案」了？",
            "走过这段就清楚 —— 不是你不行，是雾还没散。",
        ],
        "psychology": "灰雾感对应认知模糊期。当大脑同时持有多个未结的判断时，会以「雾」作隐喻。",
        "symbolism":  "雾，藏机也。机藏于雾，破雾即破执。",
        "color":      "#7a8090",
        "quote":      "看不清远方时，先走脚下三步。",
    },
    {
        "title_tpl":   "空房间的{w}",
        "stanzas": [
            "你梦见{w}，回声很响。",
            "不是空了，是腾出来 —— 等新的东西进来。",
            "你最近是不是刚结束什么？",
            "空屋子，采光最好。",
        ],
        "psychology": "空房间常对应「过渡期」。前一份身份、关系、工作正在退场，新的尚未到位。",
        "symbolism":  "屋空则气流，气流则机至。空非贫。",
        "color":      "#8B8E9E",
        "quote":      "空屋子，采光最好。",
    },
]


def _mock_dream(text: str, style: str, phrases: List[str], emotion: str) -> dict:
    """无 API Key 时的兜底。每次随机选一份模板，并把用户原文里的具体词嵌入。"""
    tpl = random.choice(_DREAM_MOCK_TEMPLATES)
    w = phrases[0] if phrases else random.choice(["车", "门", "光", "影", "雨"])
    extra_kw = phrases[1:3] if len(phrases) >= 2 else []
    return {
        "title":       tpl["title_tpl"].format(w=w),
        "stanzas":     [s.format(w=w) for s in tpl["stanzas"]],
        "psychology":  tpl["psychology"] if style != "mystic" else "—",
        "symbolism":   tpl["symbolism"]  if style != "modern" else "—",
        "keywords":    list(dict.fromkeys([*extra_kw, *(["失控", "等待", "释放"] if emotion == "anxious" else ["过渡", "听见", "允许"])]))[:4],
        "symbols":     list(dict.fromkeys([w, *phrases[1:3], *(["车", "光"] if w not in {"车", "光"} else [])]))[:5],
        "mood_color":  EMOTION_COLOR.get(emotion, tpl["color"]),
        "share_quote": tpl["quote"].format(w=w),
        "_mock":       True,
    }


_FORTUNE_MOCK = {
    "山": ("立山观远", "云开时见远峰青", "近事宜守，远事可期。", "静守", "急断"),
    "河": ("顺水而下", "顺流九曲入江海", "时机已至，放手去做。", "顺势", "强求"),
    "灯": ("一灯破暗", "孤灯虽小破暮云", "微小坚持，终见光。",   "坚守", "退缩"),
    "镜": ("明镜照心", "镜中花影本无尘", "看清自己，便已半生。", "自观", "自责"),
    "舟": ("夜泊待潮", "孤舟一系故园心", "暂泊勿急，潮来自往。", "蓄势", "急行"),
    "风": ("御风而行", "长风万里送秋雁", "顺势借力，可远行。",   "远行", "拘泥"),
    "石": ("石上听溪", "千年石上听流声", "守住根本，余事可缓。", "守静", "妄动"),
    "桥": ("渡而后通", "板桥霜满月初斜", "过此一关，前路豁然。", "迈步", "回望"),
    "井": ("古井无澜", "古井寒泉照影深", "深处自有清音。",       "深思", "浮躁"),
    "火": ("薪火相续", "炉中一焰彻五更", "热忱不灭，水到渠成。", "热忱", "急功"),
    "雪": ("雪覆寒梅", "雪压枝头梅自香", "困境正是磨砺时。",     "磨砺", "怨怼"),
    "雾": ("雾里看花", "山色空蒙雨亦奇", "近期勿决断，待雾散。", "等待", "妄判"),
    "桃": ("桃花未谢", "人面桃花相映红", "缘分在近，敞开心。",   "敞开", "闭门"),
    "烛": ("短烛长夜", "红烛秋光照画屏", "情至深处，言不必多。", "陪伴", "诘问"),
    "月": ("月满中天", "天涯共此时",     "圆满之兆，可大有为。", "把握", "迟疑"),
}
_LEVEL_COLOR = {"上上": "#c9a96e", "上吉": "#d4b87a", "中吉": "#e8d5a0", "中平": "#9bb0c4", "下平": "#7c6d5a"}

def _mock_fortune(sign: str, level: str, question: str) -> dict:
    title, line, meaning, yi, ji = _FORTUNE_MOCK.get(sign, _FORTUNE_MOCK["月"])
    if question.strip():
        # 在 meaning 里轻轻提一下问题主题（取问题首 6 字）
        topic = question.strip()[:6]
        meaning = f"关于「{topic}」—— {meaning}"
    return {
        "title":   title,
        "line":    line,
        "meaning": meaning,
        "advice":  {"宜": yi, "忌": ji},
        "sign":    sign,
        "level":   level,
        "mood_color":  _LEVEL_COLOR.get(level, "#9bb0c4"),
        "share_quote": meaning[:20],
        "_mock":   True,
    }


_PORTRAIT_MOCK = {
    "INTJ": ("夜筑造梦者", "凛冬之月", [
        "你像一座深夜里独自运行的天文台。",
        "沉默地观察，精确地推算。",
        "你不轻易动心 —— 一旦认定，便用一生的精度去对齐对方的轨道。",
        "但图纸再完美，比不上一块真正垒上去的砖。",
    ], "图纸再完美，比不上一块真正垒上去的砖。", "#5b7eb8", "今天先做一件不在计划里的小事。"),
    "INFP": ("月河浣纱者", "晚云之水", [
        "你心里有一条河，你常常蹲在岸边和自己说话。",
        "你看到的世界，比别人多一层柔光。",
        "你爱的从来不是某个人，是这个人身上的诗。",
        "但别把幻象错认作真人，也别把真人逼成幻象。",
    ], "你爱的从来不是某个人，是这个人身上的诗。", "#a578b8", "今晚写三行字给自己，不要逻辑。"),
}
_PORTRAIT_DEFAULT = ("独一无二的你", "夜河之声", [
    "你是世界上唯一以这个角度看世界的人。",
    "你以为平凡的特质，在在意你的人眼里，都是光。",
    "别人的步伐快慢，是别人的季节。",
    "你不是半成品 —— 你是一个正在进行的故事。",
], "你不是半成品 —— 你是一个正在进行的故事。", "#8c7b9e", "今天对自己说一句「我可以慢一点」。")


def _mock_portrait(type_: str, id_: str, aspect: str) -> dict:
    title, element, lines, highlight, color, advice = _PORTRAIT_MOCK.get(id_.upper(), _PORTRAIT_DEFAULT)
    return {
        "title":   title,
        "element": element,
        "verse":   "\n".join(lines),
        "highlight": highlight,
        "color":   color,
        "advice":  advice,
        "share_quote": highlight[:20],
        "_mock":   True,
    }


# ─────────────────────────────────────────────────────────────────
#                            其他
# ─────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "夜语",
        "version": app.version,
        "mock_mode": MOCK_MODE,
        "model": DEEPSEEK_MODEL,
    }


# ─────────────────────────────────────────────────────────────────
#                  管理后台：只有持 ADMIN_TOKEN 的人能看
# ─────────────────────────────────────────────────────────────────

def _require_admin(authorization: Optional[str]) -> None:
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="ADMIN_TOKEN 未在后端配置")
    expected = f"Bearer {ADMIN_TOKEN}"
    if (authorization or "").strip() != expected:
        raise HTTPException(status_code=403, detail="无权访问")


@app.get("/api/admin/dreams")
async def admin_list_dreams(
    limit: int = 200,
    offset: int = 0,
    authorization: Optional[str] = Header(None),
):
    _require_admin(authorization)
    limit  = max(1, min(int(limit), 1000))
    offset = max(0, int(offset))
    with sqlite3.connect(_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.execute(
            """SELECT id, created_at, user_id, client_ip, style, dream_text, ai_title
               FROM dreams ORDER BY id DESC LIMIT ? OFFSET ?""",
            (limit, offset),
        )
        rows = [dict(r) for r in cur.fetchall()]
        total = conn.execute("SELECT COUNT(*) FROM dreams").fetchone()[0]
    return {"total": total, "returned": len(rows), "items": rows}


@app.get("/api/admin/dream/{dream_id}")
async def admin_get_dream(dream_id: int, authorization: Optional[str] = Header(None)):
    _require_admin(authorization)
    with sqlite3.connect(_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute("SELECT * FROM dreams WHERE id = ?", (dream_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="not found")
    item = dict(row)
    # ai_response 是 JSON 字符串，解开方便前端展示
    try:
        item["ai_response"] = json.loads(item["ai_response"]) if item.get("ai_response") else None
    except Exception:
        pass
    return item


# 静态前端（夜语 React 原型）
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
