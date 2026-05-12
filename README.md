# 🌙 夜语 (Night Whisper)

融合东方玄学与现代心理学的 AI 解读服务。

> "一面镜子，映出你心底的潮汐"

---

## 场景

| 场景 | 说明 |
|------|------|
| 🌌 **解梦** | 描述梦境 → 意象拆解 + 心理学 & 象征学双重视角解读 |
| 🔮 **今日签** | 15 种东方意象随机抽取（山/河/灯/镜/舟/风/石/桥/井/火/雪/雾/桃/烛/月） |
| ⭐ **自我画像** | 星座 / MBTI 深度性格解读（6 种 MBTI + 4 种星座预设 + AI 实时生成） |

---

## 快速开始

### 方式一：双击启动（推荐）

```
双击 start.bat
```

自动检查依赖 → 启动服务 → 浏览器打开 http://localhost:8000

### 方式二：命令行

```powershell
cd backend
pip install -r requirements.txt
$env:PYTHONPATH = "F:\claude-output\dream\backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

停止服务：双击 `stop.bat` 或按 `Ctrl+C`

---

## 配置 API Key

编辑 `backend\.env`：

```
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

| 状态 | 效果 |
|------|------|
| **有 Key** | 调用 DeepSeek AI 实时生成个性化解读 |
| **无 Key** | 自动切换本地模拟模式（解梦 7 种 + 运势 15 签 + 性格 10 类预设） |

---

## 项目结构

```
dream/
├── backend/
│   ├── main.py            # FastAPI 服务（含模拟模式）
│   ├── requirements.txt   # Python 依赖
│   ├── .env               # API Key 配置（不提交 Git）
│   └── .env.example       # 配置模板
├── frontend/
│   ├── index.html         # 单页应用
│   ├── css/style.css      # 暗色神秘主题 + 粒子背景
│   └── js/app.js          # Tab 切换 / API 调用 / 结果渲染
├── start.bat              # 一键启动（Windows）
├── stop.bat               # 停止服务
└── README.md
```

## API

| 方法 | 路径 | 请求体 |
|------|------|--------|
| POST | `/api/dream` | `{"dream":"...", "style":"温柔派"}` |
| POST | `/api/fortune` | `{"question":"...", "style":"玄学派"}` |
| POST | `/api/personality` | `{"user_type":"INTJ", "aspect":"爱情", "style":"现代派"}` |
| GET | `/api/health` | — |

所有端点返回统一 JSON：

```json
{
  "title": "追不上的车",
  "main_content": "✦ 梦的低语\n...",
  "keywords": ["掌控感", "擦肩", "独自承受"],
  "mood_color": "#5B7E9C",
  "share_quote": "有些车错过了，会有下一班"
}
```

## 风格选项

| 风格 | 效果 |
|------|------|
| 🌙 温柔派 | 语气柔，多用比喻 |
| 🪞 锐利派 | 直指痛点，不刻薄 |
| 📜 玄学派 | 多东方意象，少心理学术语 |
| ☕ 现代派 | 心理学为主，神秘学点缀 |

## 技术栈

- **后端**: Python / FastAPI / DeepSeek API
- **前端**: 原生 HTML + CSS + JS（零框架依赖）
- **风格**: 暗色主题 + 粒子动画 + 毛玻璃卡片

## 技术栈

- **后端**: Python / FastAPI / DeepSeek API
- **前端**: 原生 HTML + CSS + JavaScript（零框架依赖）
- **风格**: 暗色神秘主题，粒子背景，毛玻璃卡片
