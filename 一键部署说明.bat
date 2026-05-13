@echo off
chcp 65001 >nul
echo =============================================================
echo   天翼云报价工具 - 快速部署工具
echo =============================================================
echo.
echo 请依次执行以下步骤（复制粘贴到PowerShell中）：
echo.
echo ══════════ Step 1: 上传文件 ══════════
echo    cd d:\CTYUN
echo    scp -o StrictHostKeyChecking=no css js images *.html server.js Dockerfile docker-compose.yml Ubuntu@159.75.243.119:/opt/ctyun-quote/
echo.
echo ══════════ Step 2: SSH到服务器执行部署 ══════════
echo    ssh Ubuntu@159.75.243.119
echo.
echo    然后在服务器上依次执行：
echo.
echo    # 安装Docker
echo    sudo apt update ^&^& sudo apt install -y docker.io docker-compose-v2
echo    sudo usermod -aG docker Ubuntu
echo.
echo    # 构建启动
echo    cd /opt/ctyun-quote
echo    sudo docker compose up -d --build
echo.
echo    # 查看状态
echo    sudo docker compose ps
echo.
echo =============================================================
pause
