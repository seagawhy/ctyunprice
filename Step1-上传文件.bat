@echo off
chcp 65001 >nul
echo =============================================================
echo   天翼云报价工具 - Step 1: 配置免密登录 + 上传文件
echo =============================================================
echo.
echo 正在生成SSH密钥（如果还没有的话）...
echo.

powershell -Command "if (!(Test-Path '$env:USERPROFILE\.ssh\id_rsa')) { ssh-keygen -t rsa -b 4096 -f '$env:USERPROFILE\.ssh\id_rsa' -N '""' } else { echo '密钥已存在，跳过' }"

echo.
echo 上传公钥到服务器...
echo 请输入密码: *why2026#
echo.

powershell -Command "type '$env:USERPROFILE\.ssh\id_rsa.pub' | ssh -o StrictHostKeyChecking=no Ubuntu@159.75.243.119 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo === 密钥配置成功 ==='"

echo.
echo =============================================================
echo   现在执行上传文件（免密）：
echo =============================================================
echo.

cd /d d:\CTYUN
scp -o StrictHostKeyChecking=no css js images *.html server.js Dockerfile docker-compose.yml Ubuntu@159.75.243.119:/opt/ctyun-quote/

echo.
if %ERRORLEVEL%==0 (
    echo ✅ 上传完成！现在请执行 Step 2：
    echo    ssh Ubuntu@159.75.243.119
) else (
    echo ❌ 上传失败，请检查错误信息
)

pause
