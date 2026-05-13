# 天翼云报价工具 - Docker 镜像
FROM node:20-alpine

WORKDIR /app

# 复制 server.js 和 package.json
COPY server.js ./
COPY package.json* ./

# 安装依赖（如果有）
RUN npm install --omit=dev 2>/dev/null || true

# 创建必要目录
RUN mkdir -p /app/css /app/js /app/images /app/admin

# 复制所有项目文件（自动跳过不存在的文件）
COPY . .

# 清理不需要的文件
RUN rm -f /app/Dockerfile /app/docker-compose.yml /app/.dockerignore /app/deploy.sh /app/deploy.ps1 2>/dev/null || true

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
