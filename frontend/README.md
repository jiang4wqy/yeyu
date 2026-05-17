# 🌙 夜语 · Night Whisper

> 一面镜子，映出你心底的潮汐。
>
> 融合东方玄学与现代心理学的 AI 解读 · 前端高保真原型

---

## 目录

- [它是什么](#它是什么)
- [设计系统](#设计系统)
- [文件结构](#文件结构)
- [九个场景详解](#九个场景详解)
- [氛围层与全局效果](#氛围层与全局效果)
- [Tweaks 实时调节](#tweaks-实时调节)
- [如何接入你的 FastAPI 后端](#如何接入你的-fastapi-后端)
- [扩展指南](#扩展指南)

---

## 它是什么

一个完整的 **HTML 单页原型** ——

- ✅ 9 个互联场景（含 2 个新增高级功能）
- ✅ 月光琉璃视觉系统：靛青 + 月白 + 雾面玻璃 + 微金
- ✅ 手写飘逸 + 明朝体的中文字体组合
- ✅ 鼠标月晕、飞蛾粒子、偶发流星、点击金涟漪、签语字逐字浮现等丰富交互
- ✅ 4 套配色 + 4 种解读风格的 Tweaks 面板
- ✅ 真实月相计算 + 时段感知问候
- ✅ 零后端依赖，纯前端 mock 数据（可一行替换为 fetch）

打开 `夜语.html` 即可运行 —— 不需要 build、不需要 npm。

---

## 设计系统

### 配色（CSS 变量在 `styles.css`）

| 角色 | 默认 (moonglow) | 用途 |
|---|---|---|
| `--ink-deep` | `#08111f` | 最深底色（夜空） |
| `--indigo` | `#1c2a4a` | 卡片基底 |
| `--gold` | `#c9a96e` | 描金边、主强调 |
| `--moon-white` | `#f4ecd8` | 主文字 |
| `--moon-cream` | `#ede4ca` | 签文 / 手写体 |
| `--moonglow` | `#6a8bbf` | 蓝紫月晕 |

四套主题（Tweaks 面板可切换）：
- **月光琉璃**（默认） · 靛青 + 微金
- **破晓玫瑰** · 紫调 + 暖金
- **深林墨绿** · 深森林 + 浅金
- **暗夜暖煻** · 暗红酒 + 橙金

### 字体（Google Fonts）

| CSS 变量 | 字体 | 用途 |
|---|---|---|
| `--font-serif` | Noto Serif SC | 正文 |
| `--font-hand` | Ma Shan Zheng | 签语 / 手写引言 |
| `--font-display` | ZCOOL XiaoWei | 标题 |
| `--font-mono` | JetBrains Mono | 英文标签 |

### 质感细节

- **雾面玻璃** `.glass` —— `backdrop-filter: blur(20px) saturate(140%)`
- **金箔描边** `.gold-frame` —— 内描第二层 1px 金线
- **宣纸噪点** `.paper-noise` —— SVG fractalNoise 叠加，mix-blend-mode: overlay
- **中式四角** `.corner-deco` —— 卡片四角的 L 型金线
- **鼠标月晕** `#cursor-halo` —— 480px 模糊金蓝径向渐变，60fps 缓动跟随
- **印章** `.seal` —— 朱砂红方框 + 手写"夜语之印"，旋转 -3°

---

## 文件结构

```
夜语/
├── 夜语.html              # 入口（所有 <script> 引入处）
├── styles.css            # 全局样式 + 关键帧动画
├── data.js               # 全部模拟数据 + 工具函数
├── components.jsx        # 共享：月相 Moon / 字逐字 Whisper / 顶导 / 分隔线 / 印章
├── scenes.jsx            # 场景 1-3：进入页 / 主页 / 解梦
├── features.jsx          # 场景 4-7：今日签 / 自我画像 / 河灯 / 卷轴
├── extras.jsx            # 场景 8-9：月相日历 / 意象星图 + 氛围层
├── tweaks-panel.jsx      # Tweaks 面板组件库
├── app.jsx               # 路由 + Tweaks 状态 + 主入口
└── README.md             # 此文件
```

加载顺序很重要 —— `data.js` 先 → 公共组件 → 各场景 → Tweaks → app（详见 `夜语.html`）。

---

## 九个场景详解

### 1. 进入页 (Welcome)

- 巨型月相 + 3D 视差山影 + 鼠标轻微跟随
- 标题分段入场：英文 → 中文标题 → 分隔线 → slogan → 按钮
- 四角古纹金线装饰
- 底部显示"今夜 · 辰月初七 · 月相 上弦"
- 按 **推门而入** 进入主页

### 2. 夜话 / 主页 (Home)

- **8 张卡片**，4 列 2 行，对应 8 个入口
- **顶部 hero** 自动显示当前时段问候（"夜来了，意识开始落水"等 7 种）
- 每张卡片：
  - 自定义 SVG 图标（moon / lamp / mirror / lantern / calendar / stars / scroll / sky）
  - 标题（中）+ 副标（英文 mono）+ 一句描述
  - 鼠标悬浮：**3D 倾斜 + 跟随光晕**
  - 右上角编号 `01`–`08`

### 3. 解梦 (Dream)

输入区：
- 大尺寸 textarea（雾面玻璃）
- **风格选择器**：温柔 / 锐利 / 玄学 / 现代（联动主 Tweaks）
- "试一段示例梦境" 一键填充

解读中：
- 月轮缓慢自转
- "意象正在沉淀⋯" 字逐字浮现

**结果时 AI 真的会"重画"页面**：
- `mood_color` → 整页背景下方升起呼吸色雾（`<MoodAura>`）
- `symbols` → 巨大半透明意象字从底部漂浮上升（`<SymbolDrift>`）
- 不同梦 → 不同氛围

结果区（左右分栏）：
- 标题 + 心情色光球（含 hex code）
- **「原文」按钮** —— 折叠显示用户原话，强化"映出"的概念
- 4 个 tab：
  - **签语** —— 4 行手写字逐字浮现
  - **心理学** —— 蔡格尼克效应、回避型决策等专业解读
  - **象征学** —— 周公解梦、君子如车等东方意象
  - **回声** —— 金句卡片 + 落下盖章动画
- 底部关键词 + "收入卷轴 →"

### 4. 今日签 (Fortune)

- **真实签筒**：木质渐变 + 描金箍 + 6 根金签
- 摇签：签摆动 + 按钮变文案
- **签卡 Y 轴 180° 翻转出现**
- 15 种意象（山/河/灯/镜/舟/风/石/桥/井/火/雪/雾/桃/烛/月）
- 显示：编号 / 签级（上上/上吉/中吉/中平/下平）/ 大字意象 / 标题 / 签文（字逐字）/ 释义 / 印章

### 5. 自我画像 (Portrait)

- 顶部切换：**MBTI 16 型 / 星座 12 宫**
- 卡片网格（4 列 × 4/3 行），点击展开右侧详情
- **维度切换器** —— 核 · 爱 · 影（可扩展到事业 / 成长 / 金钱）
- **「AI 重写」按钮** —— 同一 type 同一 aspect，每次结果都新鲜（前端预留入口）
- 详情区：意象头像 + 称谓 + 维度文字（字逐字浮现）+ 印章 + 收入卷轴

### 6. 河灯 (Lantern) · **原创新功能**

- 浮动河面 + 12 道水波纹 SVG 流动
- 月光在水中倒影
- 8 盏匿名河灯飘过（含倒影），不同节奏漂流
- **点击任一河灯** —— 显示低语全文 + 被回响次数
- **放一盏灯** —— 60 字以内匿名心事，立即漂入夜河

### 7. 月历 (Calendar) · 🆕

- **真实月相计算** —— synodic period 算法精准渲染每天月相
- 7 列日格，每格显示：日期 / 当日月相 / 事件圆点
- 中文月份名（正/二/三/.../腊月）
- 中文初几（初一、初十、廿五等）
- 右侧大月相 + 月相文字（朔/蛾眉/上弦/盈凸/望/亏凸/下弦/残）
- 底部统计："这个月 · 你与潜意识相会 N 次"

### 8. 星图 (Symbols) · 🆕 **专属意象图谱**

- 15 个意象节点，按出现频率分三层圆环排布
- 节点：色光 + 心跳脉动 + 文字标签
- **关系连线** —— 共现越多越粗
- 点击节点：
  - **暗化非相关节点**
  - 高亮所有共现连线
  - 右侧显示：该意象出现次数 + 诗意解读 + 共现意象列表（可继续跳转）
- 右下角图例说明

### 9. 卷轴 (Scroll)

- 真实"卷轴"外观：左右木轴 + 中间竖纹卷面
- 横向滚动展示历史
- 每个条目卡片：类型角标（梦/签/像/灯）+ 日期 + 标题 + 摘录 + 编号
- 末尾"续 · 写"占位

---

## 氛围层与全局效果

定义在 `extras.jsx` 的 `AmbientLayer` 中：

### 飞蛾粒子 `<MothSwarm>`
- 4 个发光点（金白径向渐变）
- 横向飘移 + 上下颤动 22-36s 一个周期

### 偶发流星 `<Meteors>`
- 每 12-30s 一次
- 右上角斜射 25-40°
- 1.6s 完整生命周期

### 点击金涟漪 `<ClickRipple>`
- 点击页面任意空白处
- 金色描边圆环放射 1.4s
- 忽略按钮 / 输入框（不干扰交互）

### 始终在线
- **鼠标月晕** `#cursor-halo` —— 480px 模糊光晕缓动跟随
- **宣纸噪点** `.paper-noise` —— 全局叠加
- **闪烁星空** `.night-sky::before` —— 10 颗星 8s 缓慢明暗

---

## Tweaks 实时调节

按 **右下角 ⚙ 按钮** 或顶部工具栏 Tweaks 切换开关，可实时调节：

### 主题
- 4 套配色（点击色板或下方文字按钮）

### 解读风格
- 段控件：温柔 / 锐利 / 玄学 / 现代
- 联动到解梦场景（其它场景也可扩展）

### 氛围
- 鼠标月晕 / 宣纸噪点 / 飞蛾粒子 / 偶发流星 / 点击金涟漪 / 第二轮月（角落）

### 快速导航
- 9 个场景一键跳转

---

## 如何接入你的 FastAPI 后端

现有的 mock 数据全部集中在 `data.js`，每个场景的 fetch 替换点很清晰。

**👉 完整的 AI 提示词写在 [`prompts.md`](./prompts.md)。** 那份文件给你所有 API 的：
- 系统级 system prompt
- 每个接口的请求体 / 响应体格式
- 4 种风格的语气定义
- 16 MBTI × 12 星座 × 6 维度的 prompt 模板
- 前端如何用每个返回字段（让 AI 真的"重画"页面）

### 1. 解梦

**位置**：`scenes.jsx` → `DreamScene` → `onInterpret`

```js
// 当前
const onInterpret = () => {
  setStage("analyzing");
  setTimeout(() => { setStage("result"); setResultKey(k => k+1); }, 2200);
};

// 改为
const [apiResult, setApiResult] = useState(null);
const onInterpret = async () => {
  setStage("analyzing");
  const res = await fetch("http://localhost:8000/api/dream", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Id": getUid() },
    body: JSON.stringify({ dream, style: styleMap[style] }),
  });
  const data = await res.json();
  setApiResult(data);
  setStage("result");
  setResultKey(k => k+1);
};

// 然后把 const result = window.YY_DATA.dreamResults[style] 改成 const result = apiResult;
```

样式映射（`style` 字段）：

```js
const styleMap = {
  gentle: "温柔派", sharp: "锐利派",
  mystic: "玄学派", modern: "现代派",
};
```

### 2. 今日签 / 自我画像

同上 —— 在 `features.jsx` 的 `FortuneScene.draw()` 和 `PortraitReading` 里把对应 mock 换 fetch 即可。

### 3. 用户 ID（持久化、月历、星图需要）

```js
// 加到 data.js 末尾
window.YY_UID = (() => {
  let uid = localStorage.getItem("yy_uid");
  if (!uid) { uid = crypto.randomUUID(); localStorage.setItem("yy_uid", uid); }
  return uid;
})();
```

### 4. 后端需新增的接口（参考）

```python
# backend/main.py 补丁
GET  /api/calendar?year=2026&month=5   →  { days: { 1: [...], 7: [...] } }
GET  /api/portrait/symbols              →  { nodes: [...], links: [...] }
POST /api/lantern                       →  { id, text }   # 放灯
GET  /api/lantern/feed?limit=20         →  [ {...lantern} ]
POST /api/lantern/echo/{id}             →  { echo: 143 }  # 点亮回响
```

让 DeepSeek 在解梦时**额外返回 `symbols` 字段**（3-5 个原子意象名词），存库后供 `/api/portrait/symbols` 聚合。

数据库建议：SQLite + SQLModel，30 行代码搞定（参考之前的 chat 讨论）。

---

## 扩展指南

### 加新场景
1. 在 `extras.jsx`（或新建 `more.jsx`）写组件
2. `Object.assign(window, { YourScene })`
3. 在 `app.jsx` 加路由：`{scene === "yours" && <YourScene />}`
4. 在 `components.jsx` 的 `TopNav` items 加导航项
5. 在 `app.jsx` 的 `Tweaks → 快速导航` 加按钮

### 加新主题色
1. 在 `styles.css` 加 `[data-theme="yours"] { --indigo-deep: ...; }`
2. 在 `app.jsx` 的 `TweakColor.options` 数组加色板

### 加新关键帧
- 全在 `styles.css` 末尾
- 已有：`fadeInUp / fadeIn / breath / drift / spin-slow / moth-fly / meteor-fall / ripple / seal-drop / twinkle`

### 移动端
- 当前 1440 桌面优化
- 后续可外包到 `mobile.html` + iOS frame starter，或加 `@media` 适配（grid 改 1 列、字号阶梯下调）

---

## 工艺备注

- **零依赖** —— 只用 unpkg CDN 加载 React 18.3.1 + Babel 7.29
- **零构建** —— 所有 `.jsx` 由 Babel in-browser 转译（生产建议 precompile）
- **零追踪** —— 没有埋点、没有外部 API（除字体 CDN）
- **离线可用** —— 字体替换为本地后即可全断网运行

---

## 后续路线建议

> 按优先级 ——

1. **后端：用户 ID + SQLite 持久化** （30 行代码，解锁月历、星图、卷轴的真实数据）
2. **诗签卡分享** —— 解完梦自动生成 9:16 长图（html-to-image），可发朋友圈
3. **回响 · 河灯链** —— 别人点亮你的灯，形成沉默的安慰链
4. **节气感应** —— 24 节气随时间微调 UI 细节
5. **晨曦模式** —— 日间自动切换到浅色配色，把"夜语"延伸成全天陪伴
6. **梦境共时性** —— 解完梦显示"今夜还有 47 人也梦见了车"

---

夜深了，去做梦吧。 🌙
