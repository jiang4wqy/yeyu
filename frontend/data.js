/* ============================================
   夜语 — 场景模拟数据
   ============================================ */

window.YY_DATA = {
  // ─── 解梦示例 ───────────────────────────────
  dreamResults: {
    gentle: {
      title: "追不上的车",
      stanzas: [
        "你跑得很急，可车始终不停。",
        "也许不是你慢，是它从未真正属于你。",
        "夜色里，错过的车都开往不同的明天。",
        "你坐在站台上听见自己呼吸 —— 那也是一种抵达。",
      ],
      psychology: "梦中追逐的意象常映照「失控感」。当我们清醒时无法把握节奏，潜意识便以「追不上」的形式还原焦虑。",
      symbolism: "车，行也。中国古训「君子如车，行止有度」。错过的车，恰是天意留给你的喘息。",
      keywords: ["失控感", "节奏", "错过", "等待"],
      symbols: ["车", "光", "影"],
      moodColor: "#5B7E9C",
      quote: "有些车错过了，会有下一班；有些人，错过了便是月。",
    },
    sharp: {
      title: "你不是没追上，是你不敢上",
      stanzas: [
        "你说你追不上，可你脚下穿的鞋是新的。",
        "你怕的不是赶不上，是上了车后无处可去。",
        "梦只是借口，借口里藏着真问题。",
        "醒来问自己：你究竟想去哪？",
      ],
      psychology: "回避型决策。",
      symbolism: "车是机会，错过的反复出现说明你心里一直没放下。",
      keywords: ["回避", "借口", "未决", "出发"],
      symbols: ["车", "门", "钥匙"],
      moodColor: "#8B4A4A",
      quote: "不敢上车的人，永远在站台讨论时刻表。",
    },
    mystic: {
      title: "驿马星动 · 行止两难",
      stanzas: [
        "驿马在野，车不应你。",
        "此乃辰时之兆，主迁动而未发。",
        "夜车不息，皆为虚行。",
        "宜静观月光，待月圆而后行。",
      ],
      psychology: "—",
      symbolism: "古书《周公解梦》载「梦车不及，主有迁徙未决」。子时之梦尤甚，宜静守三日。",
      keywords: ["驿马", "迁徙", "迟疑", "守静"],
      symbols: ["车", "月", "光"],
      moodColor: "#4A6B7C",
      quote: "车若不来，月自来。",
    },
    modern: {
      title: "未完成的行动循环",
      stanzas: [
        "你的大脑在用梦补完一段被打断的执行。",
        "白天搁置的任务，正在向夜晚追讨。",
        "潜意识把「未达成」具象化为追车场景。",
        "醒来后，先完成那件小事 —— 任意一件。",
      ],
      psychology: "蔡格尼克效应（未完成的事更被记得）。当一项行动被中断，神经回路保持激活，夜间以梦的形式继续推演。",
      symbolism: "—",
      keywords: ["未竟", "执行", "回路", "释放"],
      symbols: ["车", "路", "光"],
      moodColor: "#3D6B6B",
      quote: "完成它，比解释它更重要。",
    },
  },

  // ─── 15 签 ──────────────────────────────────
  fortuneSigns: [
    { id: 1,  sign: "山", level: "中平", title: "立山观远", line: "云开时见远峰青", meaning: "近事宜守，远事可期。" },
    { id: 2,  sign: "河", level: "上吉", title: "顺水而下", line: "顺流九曲入江海", meaning: "时机已至，放手去做。" },
    { id: 3,  sign: "灯", level: "上吉", title: "一灯破暗", line: "孤灯虽小破暮云", meaning: "微小坚持终见光。" },
    { id: 4,  sign: "镜", level: "中吉", title: "明镜照心", line: "镜中花影本无尘", meaning: "看清自己，便已半生。" },
    { id: 5,  sign: "舟", level: "中平", title: "夜泊待潮", line: "孤舟一系故园心", meaning: "暂泊勿急，潮来自往。" },
    { id: 6,  sign: "风", level: "中吉", title: "御风而行", line: "长风万里送秋雁", meaning: "顺势借力，可远行。" },
    { id: 7,  sign: "石", level: "中平", title: "石上听溪", line: "千年石上听流声", meaning: "守住根本，余事可缓。" },
    { id: 8,  sign: "桥", level: "上吉", title: "渡而后通", line: "板桥霜满月初斜", meaning: "过此一关，前路豁然。" },
    { id: 9,  sign: "井", level: "中平", title: "古井无澜", line: "古井寒泉照影深", meaning: "深处自有清音。" },
    { id: 10, sign: "火", level: "上吉", title: "薪火相续", line: "炉中一焰彻五更", meaning: "热忱不灭，水到渠成。" },
    { id: 11, sign: "雪", level: "中平", title: "雪覆寒梅", line: "雪压枝头梅自香", meaning: "困境正是磨砺时。" },
    { id: 12, sign: "雾", level: "下平", title: "雾里看花", line: "山色空蒙雨亦奇", meaning: "近期勿决断，待雾散。" },
    { id: 13, sign: "桃", level: "上吉", title: "桃花未谢", line: "人面桃花相映红", meaning: "缘分在近，敞开心。" },
    { id: 14, sign: "烛", level: "中吉", title: "短烛长夜", line: "红烛秋光照画屏", meaning: "情至深处，言不必多。" },
    { id: 15, sign: "月", level: "上上", title: "月满中天", line: "天涯共此时",      meaning: "圆满之兆，可大有为。" },
  ],

  // ─── MBTI · 16 型完整（颜色 + 元素是「壳」，core/love/shadow 是 AI 生成的占位） ─────────
  mbtiTypes: [
    // 分析家 NT —— 冷月青系
    { id: "INTJ", title: "夜筑造梦者", element: "凛冬之月", color: "#5b7eb8",
      core: "你像一座深夜里独自运行的天文台 —— 沉默地观察，精确地推算。",
      love: "你不轻易动心，一旦认定，便用一生的精度去对齐对方的轨道。",
      shadow: "警惕把人变成「项目」。情感不需要被优化，它需要被在场。" },
    { id: "INTP", title: "山中辩士",   element: "雾林之思", color: "#6b8aab",
      core: "你的脑子是一座永不打烊的辩论厅，所有命题都在那里互相质问。",
      love: "你需要的不是激情，是一个能跟你下到第七层抽象的人。",
      shadow: "想清楚再爱，常常变成想了一辈子也没去爱。" },
    { id: "ENTJ", title: "执剑统帅",   element: "破晓之锋", color: "#4a8aab",
      core: "你天生用结构看世界。混乱让你不适，目标让你呼吸。",
      love: "你爱起来像规划一场战役 —— 高效，且令人安心。",
      shadow: "停下来时学会做副驾。不是所有人都想被组织。" },
    { id: "ENTP", title: "辩论星火",   element: "电光石火", color: "#7a9ab8",
      core: "你以反方观点为乐。一句话能开十扇门。",
      love: "你需要的是势均力敌的对手，不是听众。",
      shadow: "辩赢之后，那个人也许就走了。" },

    // 外交家 NF —— 温暖紫金
    { id: "INFJ", title: "月下守梦人", element: "雾中之灯", color: "#7b9ab8",
      core: "你能听见别人没说出口的那一半 —— 这是天赋，也是负担。",
      love: "你爱得深，却常常等不到等同的回应；你需要的是被看见，而非被需要。",
      shadow: "学会留一盏灯给自己。你不必照亮所有人。" },
    { id: "INFP", title: "梦河浣纱者", element: "晚云之水", color: "#a578b8",
      core: "你的心里有一条河，你常常蹲在岸边和自己说话。",
      love: "你爱的从来不是某个人，是这个人身上的诗。",
      shadow: "别把幻象错认作真人。也别把真人逼成幻象。" },
    { id: "ENFJ", title: "暖灯引路人", element: "炉边之火", color: "#c89074",
      core: "你天生记得每个人的生日，也天生忘了自己的。",
      love: "你以付出为爱，但请记得 —— 被爱也是要练习的。",
      shadow: "你不是救世主，你只是温柔的人。" },
    { id: "ENFP", title: "晨星点火者", element: "破晓之火", color: "#d4a578",
      core: "你身体里住着一群小孩，他们轮流叫醒你说「我们去看看那个吧」。",
      love: "热烈，跳跃，像萤火虫的求偶舞 —— 你需要的伴是能跟上你节奏的火苗。",
      shadow: "你不需要时刻燃烧。允许自己有一段是灰的。" },

    // 守卫者 SJ —— 静土沉色
    { id: "ISTJ", title: "石上观潮",   element: "礁石之恒", color: "#7a8a9a",
      core: "你像海边那块千年的石头 —— 风浪都改不了你的轮廓。",
      love: "你不说我爱你，你做我爱你能做的所有事。",
      shadow: "偶尔松一寸，世界不会塌。" },
    { id: "ISFJ", title: "月泉守护者", element: "深泉之静", color: "#6b8a9a",
      core: "你是这世上少数能让「日常」显得庄重的人。",
      love: "你以照顾为爱，但请记得 —— 你也值得被照顾。",
      shadow: "拒绝不是不爱，是先爱自己。" },
    { id: "ESTJ", title: "城墙之守",   element: "正午之钟", color: "#8a8070",
      core: "你坚信秩序能拯救人。事实上 —— 它救过你很多次。",
      love: "你爱得稳，稳到对方有时怀疑你是不是还在爱。",
      shadow: "记得把规则里的「人」放在最前面。" },
    { id: "ESFJ", title: "灯下司礼",   element: "团圆之灯", color: "#c89888",
      core: "你能让一桌陌生人在二十分钟内变成朋友。",
      love: "你爱整个家，包括家里那只猫的猫粮品牌。",
      shadow: "你也可以不在场。这世界不会因为你缺席而散场。" },

    // 探险家 SP —— 浪信明色
    { id: "ISTP", title: "孤鹰猎手",   element: "孤崖之风", color: "#7a9ab0",
      core: "你不说话，但你看见的比说话的人多得多。",
      love: "你的爱是行动 —— 修好那扇门，比说一百句「我在」更像你。",
      shadow: "情绪也是工具，别只把它放在抽屉里。" },
    { id: "ISFP", title: "野径吟者",   element: "野花之色", color: "#b88aa8",
      core: "你心里住着一个艺术家，从不公开作品，但每天都在创作。",
      love: "你爱得安静，深得连自己都听不见。",
      shadow: "说出来的爱，对方才接得住。" },
    { id: "ESTP", title: "踏浪行旅",   element: "潮信之风", color: "#b8a578",
      core: "你不擅长等待。等待对你而言，就是一种慢性的失败。",
      love: "你的爱像浪 —— 来得快，但每一次都货真价实。",
      shadow: "有些事，慢一点才看得清。" },
    { id: "ESFP", title: "星光走班",   element: "灯下之舞", color: "#d68f9a",
      core: "你天生知道怎么让人笑出来 —— 也包括你自己。",
      love: "你的爱热闹、明亮、像节日的烟花。",
      shadow: "热闹散场后，记得留一盏灯给自己。" },
  ],

  // ─── 星座 · 12 完整（同样：壳固定，line/解读 由 AI 生成） ─────────
  zodiacs: [
    { id: "aries",      title: "白羊 · 春雷", symbol: "♈", color: "#d68f5c", word: "破",
      line: "你像第一声春雷，所有人都在等你先动。",
      element: "火", dates: "03.21 - 04.19" },
    { id: "taurus",     title: "金牛 · 沃土", symbol: "♉", color: "#a8a070", word: "守",
      line: "你慢，但你慢得稳 —— 急的人总有一天要回头找你。",
      element: "土", dates: "04.20 - 05.20" },
    { id: "gemini",     title: "双子 · 风信", symbol: "♊", color: "#b8b078", word: "游",
      line: "你脑子里同时住着六个版本的你，他们轮流值班。",
      element: "风", dates: "05.21 - 06.20" },
    { id: "cancer",     title: "巨蟹 · 夜潮", symbol: "♋", color: "#7ba8c4", word: "藏",
      line: "你把柔软藏在硬壳里，因为你早就尝过被刺穿的滋味。",
      element: "水", dates: "06.21 - 07.22" },
    { id: "leo",        title: "狮子 · 金乌", symbol: "♌", color: "#d4a050", word: "燃",
      line: "你不是要被看见 —— 你是天生就发光。",
      element: "火", dates: "07.23 - 08.22" },
    { id: "virgo",      title: "处女 · 秋穗", symbol: "♍", color: "#8aa078", word: "精",
      line: "你在意每一粒米的位置 —— 因为你知道，细节是真的爱。",
      element: "土", dates: "08.23 - 09.22" },
    { id: "libra",      title: "天秤 · 月衡", symbol: "♎", color: "#c9a96e", word: "衡",
      line: "你不是难以决断，你只是不想让任何一边失望。",
      element: "风", dates: "09.23 - 10.22" },
    { id: "scorpio",    title: "天蝎 · 渊海", symbol: "♏", color: "#8a4a6a", word: "深",
      line: "你看人的眼神，能让人怀疑自己是不是被读完了。",
      element: "水", dates: "10.23 - 11.21" },
    { id: "sagittarius",title: "射手 · 远箭", symbol: "♐", color: "#c87858", word: "远",
      line: "你的家不在哪个房子里 —— 在下一程路上。",
      element: "火", dates: "11.22 - 12.21" },
    { id: "capricorn",  title: "摩羯 · 老山", symbol: "♑", color: "#6a6a78", word: "登",
      line: "你不是慢热，你只是把每一步都算到了山顶。",
      element: "土", dates: "12.22 - 01.19" },
    { id: "aquarius",   title: "水瓶 · 远星", symbol: "♒", color: "#7898b8", word: "异",
      line: "你不是合群不来，你只是住在十年后的世界。",
      element: "风", dates: "01.20 - 02.18" },
    { id: "pisces",     title: "双鱼 · 渊海", symbol: "♓", color: "#8a9bc4", word: "梦",
      line: "你游在所有人都看不见的水底，那里星河比天上还亮。",
      element: "水", dates: "02.19 - 03.20" },
  ],

  // ─── 卷轴历史 ───────────────────────────────
  history: [
    { id: 1, type: "梦", date: "辰月 初七", title: "追不上的车",        excerpt: "你跑得很急，可车始终不停。也许不是你慢，是它从未真正属于你⋯⋯", color: "#5B7E9C" },
    { id: 2, type: "签", date: "辰月 初六", title: "月满中天 · 上上签", excerpt: "天涯共此时。圆满之兆，可大有为。",                              color: "#c9a96e" },
    { id: 3, type: "像", date: "辰月 初五", title: "INFJ · 月下守梦人", excerpt: "你能听见别人没说出口的那一半 —— 这是天赋，也是负担⋯⋯",         color: "#7b9ab8" },
    { id: 4, type: "梦", date: "辰月 初三", title: "无门的房间",        excerpt: "你在一个明亮的房间里，却找不到门。墙是新刷的⋯⋯",              color: "#8b6a4a" },
    { id: 5, type: "签", date: "辰月 初二", title: "雾里看花 · 下平签", excerpt: "山色空蒙雨亦奇。近期勿决断，待雾散。",                          color: "#6b6b6b" },
    { id: 6, type: "灯", date: "辰月 初一", title: "你放的河灯",        excerpt: "想告诉那年的自己 —— 你后来过得不算坏。",                       color: "#d4b87a" },
  ],

  // ─── 月相日历事件（当月 1..30 日） ─────────
  calendarEvents: {
    1:  [{ type: "灯", title: "你放的河灯",         color: "#d4b87a" }],
    2:  [{ type: "签", title: "雾里看花",            color: "#6b6b6b" }],
    3:  [{ type: "梦", title: "无门的房间",          color: "#8b6a4a" }],
    5:  [{ type: "像", title: "INFJ · 月下守梦人",  color: "#7b9ab8" }],
    6:  [{ type: "签", title: "月满中天",            color: "#c9a96e" }],
    7:  [{ type: "梦", title: "追不上的车",          color: "#5B7E9C" },
         { type: "签", title: "桃花未谢",            color: "#d68f5c" }],
    9:  [{ type: "梦", title: "海底的钢琴",          color: "#3d6b6b" }],
    11: [{ type: "签", title: "薪火相续",            color: "#d68f5c" }],
    13: [{ type: "梦", title: "山顶的电话",          color: "#7b8aab" }],
    15: [{ type: "签", title: "月满中天",            color: "#c9a96e" }],
    16: [{ type: "梦", title: "回到外婆家",          color: "#a08550" }],
    18: [{ type: "灯", title: "想告诉外婆的话",    color: "#d4b87a" }],
    19: [{ type: "签", title: "板桥渡而后通",       color: "#9bb0c4" }],
    21: [{ type: "梦", title: "无尽的图书馆",       color: "#6a4a8a" }],
    23: [{ type: "签", title: "雪覆寒梅",            color: "#aab8c4" }],
    25: [{ type: "梦", title: "学校的旧操场",       color: "#7c8a6a" }],
    27: [{ type: "梦", title: "未发出的信",          color: "#8a6a7c" }],
    29: [{ type: "签", title: "御风而行",            color: "#a8a578" }],
  },

  // ─── 意象图谱 ───────────────────────────────
  symbolGraph: {
    nodes: [
      { id: "水",   weight: 9, mood: "#5B7E9C", verse: "水至柔而无形，常映情绪流动。" },
      { id: "门",   weight: 7, mood: "#a08550", verse: "门是抉择，是入与出。你的门常常没有钥匙。" },
      { id: "月",   weight: 8, mood: "#d4b87a", verse: "月光下你最坦诚。月也最常在你梦里。" },
      { id: "车",   weight: 6, mood: "#5B7E9C", verse: "车是节奏。你常常追，少有人载。" },
      { id: "高楼", weight: 4, mood: "#7c8a9a", verse: "高处是野心，也是孤独。" },
      { id: "信",   weight: 3, mood: "#8a6a7c", verse: "未发出的信，写给的人是自己。" },
      { id: "镜",   weight: 5, mood: "#aab8c4", verse: "镜中那个人，比你温柔。" },
      { id: "桥",   weight: 3, mood: "#9bb0c4", verse: "桥是过渡。过完，回不去了。" },
      { id: "母亲", weight: 4, mood: "#c8a070", verse: "母亲常以年轻的样子出现。" },
      { id: "雨",   weight: 5, mood: "#6a8aaa", verse: "雨是积压。下完会轻一点。" },
      { id: "电话", weight: 2, mood: "#7b9ab8", verse: "电话总是接不通。你有话没说。" },
      { id: "钥匙", weight: 2, mood: "#d4a574", verse: "钥匙总是找不到。" },
      { id: "海",   weight: 3, mood: "#3d6b8a", verse: "海是更深的水，是不可控。" },
      { id: "光",   weight: 4, mood: "#e8d5a0", verse: "光常从你够不到的地方来。" },
      { id: "影",   weight: 3, mood: "#5a5a6a", verse: "你常梦见影子比身体先走。" },
    ],
    links: [
      ["水", "月", 4], ["水", "镜", 3], ["水", "海", 3], ["水", "雨", 5],
      ["门", "钥匙", 2], ["门", "镜", 1],
      ["月", "光", 3], ["月", "影", 2], ["月", "桥", 1],
      ["车", "桥", 2], ["车", "高楼", 1],
      ["高楼", "光", 2], ["高楼", "影", 1],
      ["信", "母亲", 2], ["信", "电话", 1],
      ["母亲", "雨", 2], ["母亲", "电话", 1],
      ["镜", "影", 3], ["光", "影", 2],
    ],
  },

  // ─── 时段问候 ───────────────────────────────
  timeGreetings: [
    { from: 0,  to: 4,  hour: "丑时", phrase: "夜深了，今晚的梦还没开始。", en: "STILL  ·  EARLY  ·  HOURS" },
    { from: 4,  to: 7,  hour: "卯时", phrase: "天将亮，是回想梦的时候。",     en: "DAWN  ·  REMEMBERING" },
    { from: 7,  to: 11, hour: "辰时", phrase: "晨起，梦还留着尾巴。",         en: "MORNING  ·  AFTERTASTE" },
    { from: 11, to: 14, hour: "午时", phrase: "日正，潜意识小憩。",           en: "NOON  ·  PAUSE" },
    { from: 14, to: 18, hour: "申时", phrase: "光斜了，影子开始说话。",       en: "AFTERNOON  ·  SHADOWS" },
    { from: 18, to: 21, hour: "酉时", phrase: "暮色已至，宜静思一日。",       en: "DUSK  ·  REFLECT" },
    { from: 21, to: 24, hour: "戌时", phrase: "夜来了，意识开始落水。",       en: "NIGHT  ·  DESCENT" },
  ],

  // ─── 河灯（共鸣池） ─────────────────────────
  lanterns: [
    { id: "l1", text: "想告诉那年的自己 —— 你后来过得不算坏。",        echo: 142, distance: 0.12 },
    { id: "l2", text: "梦见外婆在揉面，醒来才记起她已经不在了。",     echo: 89,  distance: 0.34 },
    { id: "l3", text: "如果当时上了那班地铁，我们会不会还在一起？",   echo: 230, distance: 0.55 },
    { id: "l4", text: "我喜欢的那个人 —— 在另一个城市，做着另一份梦。", echo: 67,  distance: 0.20 },
    { id: "l5", text: "把「再等等」从字典里删掉。",                    echo: 312, distance: 0.78 },
    { id: "l6", text: "今晚做了一个很安静的梦，没有声音，只有月光。", echo: 45,  distance: 0.42 },
    { id: "l7", text: "她说「祝你好梦」的时候，我哭了，但她不知道。", echo: 178, distance: 0.62 },
    { id: "l8", text: "终于敢一个人吃火锅了。",                       echo: 198, distance: 0.28 },
  ],
};

// ─── 工具函数 ─────────────────────────────────

// 月相计算（简化版，精度够日历用）
window.YY_MOON_PHASE = function(date) {
  const synodic = 29.530588853;
  const known = new Date("2000-01-06T18:14:00Z");
  const days = (date - known) / 86400000;
  return ((days % synodic) + synodic) % synodic / synodic; // 0..1
};

// 取当前时段问候
window.YY_GREETING = function() {
  const h = new Date().getHours();
  return window.YY_DATA.timeGreetings.find(g => h >= g.from && h < g.to) || window.YY_DATA.timeGreetings[6];
};

// ─── 用户身份（用于 AI 上下文个性化） ─────────────
window.YY_UID = (() => {
  let uid = localStorage.getItem("yy_uid");
  if (!uid) {
    uid = "u_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    localStorage.setItem("yy_uid", uid);
  }
  return uid;
})();

// 同源即可；如需跨域，设置 localStorage.yy_api_base = "http://localhost:8000"
window.YY_API_BASE = localStorage.getItem("yy_api_base") || "";

// ─── 用户最近上下文（最近 N 次的意象 + 情绪） ──────
window.YY_CTX = {
  read() {
    try { return JSON.parse(localStorage.getItem("yy_ctx") || "{}"); }
    catch { return {}; }
  },
  recordDream(result) {
    const ctx = this.read();
    const syms = result.symbols || [];
    const kws  = result.keywords || [];
    ctx.recent_symbols  = [...syms, ...((ctx.recent_symbols  || []).filter(s => !syms.includes(s)))].slice(0, 10);
    ctx.recent_keywords = [...kws,  ...((ctx.recent_keywords || []).filter(s => !kws.includes(s)))].slice(0, 10);
    const mood = result.mood_color || result.moodColor;
    if (mood) ctx.recent_moods = [mood, ...(ctx.recent_moods || []).filter(m => m !== mood)].slice(0, 5);
    ctx.last_seen_at = new Date().toISOString();
    localStorage.setItem("yy_ctx", JSON.stringify(ctx));
  },
  forApi() {
    const ctx = this.read();
    return {
      recent_symbols:  ctx.recent_symbols  || [],
      recent_keywords: ctx.recent_keywords || [],
      recent_moods:    ctx.recent_moods    || [],
      hour:            new Date().getHours(),
      hour_label:      window.YY_GREETING().hour,
    };
  },
};

// ─── 通用 API 调用 + 字段名规整（snake → camel） ──
window.YY_API = async function(path, body) {
  const url = (window.YY_API_BASE || "") + path;
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "X-User-Id": window.YY_UID },
    body:    JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  // 前端组件用 camelCase（moodColor / quote）
  if (data.mood_color  && !data.moodColor) data.moodColor = data.mood_color;
  if (data.share_quote && !data.quote)     data.quote     = data.share_quote;
  return data;
};
