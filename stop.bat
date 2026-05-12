@echo off
chcp 65001 >nul
echo.
echo   🌙 夜语 · 已停止
echo.
REM 查找占用 8000 端口的进程并结束
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)
