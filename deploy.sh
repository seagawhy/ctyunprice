#!/bin/bash
# ============================================================
#  天翼云报价工具 - 一键部署脚本 (Ubuntu Server 24.04)
#  目标: 159.75.243.119
# ============================================================

set -e
echo "============================================="
echo "  天翼云报价工具 - 开始部署"
echo "============================================="

# ---- 1. 安装 Docker ----
echo ""
echo "[1/5] 安装 Docker..."
apt update -qq
apt install -y -qq docker.io docker-compose-v2 > /dev/null 2>&1
systemctl enable --now docker
echo "✅ Docker 安装完成: $(docker --version)"

# ---- 2. 创建项目目录 ----
echo ""
echo "[2/5] 创建项目目录..."
mkdir -p /opt/ctyun-quote
chown -R Ubuntu:Ubuntu /opt/ctyun-quote 2>/dev/null || true
echo "✅ 目录已创建: /opt/ctyun-quote"

# ---- 3. 上传文件提示 ----
echo ""
echo "[3/5] ⚠️  需要上传项目文件！"
echo "    请在本地 PowerShell 执行:"
echo ""
echo "    cd d:\\CTYUN"
echo "    scp -r * root@159.75.243.119:/opt/ctyun-quote/"
echo ""
echo "    或者使用 rsync（推荐）:"
echo ""
echo "    rsync -avz --exclude='node_modules' --exclude='cloudfunctions' --exclude='js-sdk-temp' --exclude='js-sdk.tar' d:\\CTYUN\\ root@159.75.243.119:/opt/ctyun-quote/"
echo ""

# 检查文件是否已存在
if [ -f "/opt/ctyun-quote/server.js" ]; then
    echo "✅ 检测到 server.js 已存在，跳过上传步骤"
else
    echo "❌ 项目文件尚未上传！"
    echo "    请先在本地执行上面的 scp/rsync 命令"
    echo "    然后重新运行此脚本:"
    echo "    bash deploy.sh"
    exit 1
fi

# ---- 4. 构建并启动容器 ----
echo ""
echo "[4/5] 构建并启动 Docker 容器..."
cd /opt/ctyun-quote
docker compose down 2>/dev/null || true
docker compose up -d --build
echo "✅ 容器已启动"

# ---- 5. 验证 ----
echo ""
echo "[5/5] 验证服务..."
sleep 3

# 健康检查
HEALTH=$(curl -s http://localhost:3000/api/health 2>/dev/null || echo '{"status":"fail"}')
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    echo "✅ 健康检查通过: $HEALTH"
else
    echo "⚠️  健康检查未响应，查看日志:"
    docker compose logs --tail=20
fi

# 显示状态
echo ""
docker compose ps

echo ""
echo "============================================="
echo "  🎉 部署完成!"
echo "============================================="
echo ""
echo "  访问地址: http://159.75.243.119:3000"
echo "  健康检查: http://159.75.243.119:3000/api/health"
echo ""
echo "  常用命令:"
echo "    查看日志: cd /opt/ctyun-quote && docker compose logs -f"
echo "    重启服务: cd /opt/ctyun-quote && docker compose restart"
echo "    停止服务: cd /opt/ctyun-quote && docker compose down"
echo ""
echo "============================================="
