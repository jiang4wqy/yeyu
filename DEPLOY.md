# 🌙 夜语 · 部署全流程详解

> 本文档记录从本地项目到线上部署的每一步操作及其背后的原理。

---

## 总览：一条线串起来

```
你的电脑（本地代码）
    ↓  git init + commit
Git 仓库（本地版本管理）
    ↓  git push
GitHub（云端代码仓库）
    ↓  Render 自动拉取
Render（云端服务器，24h 在线）
    ↓  浏览器访问
你的朋友（手机/电脑直接用）
```

---

## 第一步：.gitignore — 什么能上传，什么不能

### 做了什么

在项目根目录创建了 `F:\claude-output\dream\.gitignore` 文件。

### 文件内容

```
backend/.env          ← 含你的 DeepSeek API Key，绝对不能上传
__pycache__/          ← Python 自动生成的缓存，上传了浪费空间
venv/                 ← 本地虚拟环境，每人环境不同
.vscode/              ← 你的编辑器个人设置
ngrok.exe             ← 临时工具
```

### 为什么重要

`.gitignore` 告诉 Git **「这些文件不要管」**。

你之前所有的痛都来自这一个核心事实：
> **API Key 一旦上传到 GitHub 公仓，任何人在互联网上都能搜到它，你的 Key 会被盗刷。**

有了 `.gitignore`，Git 会自动跳过 `backend/.env`，你永远不用手动操心。

### 验证方法

```powershell
git status
```

输出里不会出现 `backend/.env`，说明保护生效。

---

## 第二步：git init — 把文件夹变成 Git 仓库

### 做了什么

```powershell
cd F:\claude-output\dream
git init
```

### 这行干了什么

在你的项目文件夹里建了一个隐藏目录 `.git`，里面存着：
- 文件快照
- 变更历史
- 分支信息

从此，这个文件夹就是一个 **Git 仓库**——你可以记录每一次修改、回退到任意历史版本。

类比：就像一个游戏存档系统，你每完成一个关卡就存一次档，死了可以读档重来。

---

## 第三步：git add — 选择要存档的文件

### 做了什么

```powershell
git add .
```

### 这行干了什么

`.` 代表「当前目录下所有文件」。Git 把你选中的文件从 **工作区** 移到 **暂存区**。

这步只是 **挑选**，还没有真的存档。

类比：你在超市购物车里放好了要买的东西，但还没结账。

### 验证方法

```powershell
git status
```

输出显示 `Changes to be committed`，列出了所有准备提交的文件。你一眼就能确认有没有误选不该上传的文件。

---

## 第四步：git commit — 正式存档

### 做了什么

```powershell
git commit -m "🌙 夜语 · 初始版本 — 解梦/运势/性格解读"
```

### 这行干了什么

把暂存区的内容永久保存为一个 **版本**，并附上一条说明（`-m` 后面的文字）。

`-m` 是 message 的缩写。每次提交都要写一句话说清楚「这次改了什么」，将来翻历史的时候能看懂。

### 输出解读

```
[master (root-commit) 76f7ab6] 🌙 夜语 · 初始版本
 11 files changed, 2304 insertions(+)
```

- `master`：当前分支名（主分支）
- `root-commit`：这是仓库的第一个提交
- `76f7ab6`：这个提交的 ID（全球唯一，以后可以用它回退）
- `11 files changed`：共 11 个文件被记录

---

## 第五步：GitHub 上创建仓库

### 做了什么

在浏览器里打开 https://github.com/new，填入：
- 仓库名：`yeyu`
- 描述：🌙 夜语 — 融合东方玄学与现代心理学的 AI 解读服务
- 可见性：Public（公开，Render 才能免费克隆）

点 Create repository。

### 为什么选 Public

Render 免费套餐只能从公开仓库拉代码。Private 仓库需要额外授权步骤。

仓库的最终地址：`https://github.com/jiang4wqy/yeyu`

---

## 第六步：git remote — 告诉本地仓库「远程在哪」

### 做了什么

```powershell
git remote add origin https://github.com/jiang4wqy/yeyu.git
```

### 这行干了什么

给本地 Git 仓库设置了一个 **远端地址**，并起名 `origin`。

- `remote`：远端的意思，指不在你电脑上的 Git 仓库
- `origin`：远端仓库的别名（习惯叫 origin，你也可以叫别的）
- 后面是 GitHub 仓库的 URL

现在你的电脑知道「把代码推到哪去」了。

### 验证方法

```powershell
git remote -v
```

输出：
```
origin  https://github.com/jiang4wqy/yeyu.git (fetch)
origin  https://github.com/jiang4wqy/yeyu.git (push)
```

`fetch` = 从哪里拉取  
`push` = 推送到哪里

---

## 第七步：git push — 推送代码

### 做了什么

```powershell
git push -u origin master
```

### 这行干了什么

把本地 `master` 分支的代码上传到 `origin`（也就是 GitHub）。

- `push`：推送
- `-u`：建立追踪关系，以后只用 `git push` 就行
- `origin`：目的地
- `master`：推送哪个分支

### 输出解读

```
Enumerating objects: 17, done.
Writing objects: 100% (17/17), 32.04 KiB | 1.28 MiB/s, done.
To https://github.com/jiang4wqy/yeyu.git
 * [new branch]      master -> master
```

意思是 17 个文件包被打包上传了，大小 32KB，速度 1.28MB/s。

### 🐛 遇到的坑：gitclone 代理

你的电脑全局 Git 配置里有一条：
```
url.https://gitclone.com/github.com/.insteadof=https://github.com/
```

这会让所有 `https://github.com/` 的请求自动变成 `https://gitclone.com/github.com/`。这是国内加速 GitHub 的常用手段，但它会导致带 token 的认证失败。

**解决方法**：
```powershell
git config --global --unset url.https://gitclone.com/github.com/.insteadof
```

然后重新设置 remote 为直连 GitHub 地址。

### 🐛 遇到的坑：token 内嵌在 URL 里

为了让 GitHub 识别你的身份，在推送时把 token 嵌入了 URL：
```
https://ghp_xxx...@github.com/jiang4wqy/yeyu.git
```

`@` 前面是用户名（token），后面是仓库地址。GitHub 收到请求后验证 token → 确认是仓库主人 → 允许推送。

⚠️ 推送完成后记得换回干净的地址：
```powershell
git remote set-url origin https://github.com/jiang4wqy/yeyu.git
```

---

## 第八步：Render 部署 — 从代码到网站

### 做了什么

1. 注册 Render（用 GitHub 一键登录）
2. 选择 New Web Service
3. 填入仓库地址 `https://github.com/jiang4wqy/yeyu.git`

### 配置参数及含义

| 配置项 | 填入的值 | 含义 |
|--------|----------|------|
| Name | `yeyu` | 服务名称 |
| Language | Python 3 | 运行环境 |
| Branch | `master` | 用哪个分支的代码 |
| Root Directory | `backend` | 代码子目录（因为后端在 backend/ 里） |
| Build Command | `pip install -r requirements.txt` | 部署前装依赖 |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` | 启动命令，`$PORT` 是 Render 自动分配的端口号 |
| Instance Type | Free | 免费套餐 |
| DEEPSEEK_API_KEY | `sk-xxx...` | 你的 API Key（在 Render 环境变量里设，安全） |
| PYTHON_VERSION | `3.11` | 指定 Python 版本 |

### Render 部署流程（自动的）

```
1. 从 GitHub 克隆代码
2. 检测为 Python 项目
3. 安装 Python 3.11
4. 运行 pip install -r requirements.txt
5. 运行 uvicorn main:app（启动服务）
6. 分配一个公网域名 https://yeyu-snu7.onrender.com
```

### 环境变量为什么重要

`DEEPSEEK_API_KEY` 存在 Render 的环境变量里，**不经过 GitHub、不暴露在代码中**。

- 你的代码里用 `os.getenv("DEEPSEEK_API_KEY")` 读取
- Render 在启动时自动注入
- 任何访问网站的人（包括你朋友）都看不到这个值
- 所有 API 请求走你的 Key、扣你的额度

### 🐛 遇到的坑：pydantic 编译失败

第一次部署失败，日志显示：
```
pydantic-core==2.27.2 需要 Rust 编译
→ 编译失败（Read-only file system）
```

**原因**：Render 默认用了 Python 3.14，而 pydantic-core 没有 Python 3.14 的预编译包，只能从源码编译——需要 Rust 工具链，Render 免费环境不支持。

**解决方法**：加了一个环境变量 `PYTHON_VERSION=3.11`，让 Render 用 Python 3.11。3.11 有 pydantic-core 的预编译 wheel 包（`.whl` 文件），直接下载安装就行，不需要编译。

验证日志：
```
# 修复前（Python 3.14）：
Downloading pydantic_core-2.27.2.tar.gz  ← 源码，需要编译
→ Build failed 😞

# 修复后（Python 3.11）：
Downloading pydantic_core-2.27.2-cp311-cp311-manylinux...whl  ← 预编译包
→ Successfully installed ✅
```

---

## 最终交付物

| 是什么 | 地址 |
|--------|------|
| 🌐 线上网站（朋友用这个） | https://yeyu-snu7.onrender.com |
| 📦 GitHub 源码 | https://github.com/jiang4wqy/yeyu |
| 🔧 后台管理 | https://dashboard.render.com |

---

## 日常更新流程

假如你以后改了代码，更新线上只需要：

```powershell
cd F:\claude-output\dream
git add .
git commit -m "描述你改了什么"
git push
```

Render 检测到 GitHub 有新提交 → **自动重新部署**。你什么都不用做。

---

## 概念速查表

| 概念 | 一句话解释 |
|------|----------|
| Git | 版本管理工具，记录文件的每次修改 |
| GitHub | 存 Git 仓库的网站，代码的「云盘」 |
| commit | 一次存档，包含改动内容 + 说明 |
| push | 把本地存档上传到 GitHub |
| remote | 远端仓库地址 |
| Render | 云服务器平台，把你的代码跑成网站 |
| 环境变量 | 在服务器上存储的配置（如 Key），不写进代码 |
| .gitignore | 告诉 Git 哪些文件不要管 |
| wheel (.whl) | Python 预编译包，下载即用，不需要编译 |
