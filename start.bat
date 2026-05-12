@echo off
chcp 65001 >nul
title 夜语 · Night Whisper

cd /d "%~dp0backend"

echo.
echo   🌙 夜语 · 正在启动...
echo   ─────────────────────────────
echo.

REM 检查 .env 中是否配置了 API Key
set HAS_KEY=0
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    if "%%a"=="DEEPSEEK_API_KEY" if not "%%b"=="" set HAS_KEY=1
)

if %HAS_KEY%==1 (
    echo   ✅ 检测到 API Key — 使用真实 AI 解读
) else (
    echo   ⚠️  未检测到 API Key — 使用本地模拟模式
    echo   💡 编辑 backend\.env 填入 DEEPSEEK_API_KEY 即可接入 AI
)
echo   ─────────────────────────────
echo.
echo   浏览器打开 http://localhost:8000
echo   按 Ctrl+C 停止服务
echo.

set PYTHONPATH=%~dp0backend

REM 检查 Python 是否可用
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ❌ 未找到 Python，请先安装 Python 3.9+
    pause
    exit /b 1
)

REM 检查依赖
python -c "import fastapi" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo   📦 正在安装依赖...
    pip install -r requirements.txt -q
    if %ERRORLEVEL% neq 0 (
        echo   ❌ 依赖安装失败，请手动运行: pip install -r requirements.txt
        pause
        exit /b 1
    )
)

python -m uvicorn main:app --host 0.0.0.0 --port 8000

pause
