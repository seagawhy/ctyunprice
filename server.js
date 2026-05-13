// 天翼云报价工具 - Docker/生产服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DEFAULT_LICENSE_CODE = process.env.DEFAULT_LICENSE_CODE || '20262026';

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// CORS 头
function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// JSON 响应
function json(res, data, status = 200) {
    setCors(res);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

// 静态文件服务
function serveStatic(filePath, res) {
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            }
        } else {
            setCors(res);
            // JS/CSS 文件加缓存控制
            if ('.js.css'.includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// 解析 POST body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { resolve({}); }
        });
        req.on('error', reject);
    });
}

// API 路由
async function handleAPI(req, res, urlPath) {
    setCors(res);

    // OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return true;
    }

    // 注册码验证接口
    if (urlPath === '/api/verify-license' && req.method === 'POST') {
        const body = await parseBody(req);
        const code = (body.code || '').trim();

        if (!code) {
            json(res, { success: false, message: '请输入注册码' }, 400);
            return true;
        }

        if (code === DEFAULT_LICENSE_CODE) {
            console.log(`[${new Date().toISOString()}] ✅ 验证成功: ${code}`);
            json(res, { success: true, message: '验证成功！' });
            return true;
        } else {
            console.log(`[${new Date().toISOString()}] ❌ 验证失败: ${code}`);
            json(res, { success: false, message: '注册码无效，请检查后重试' }, 200);
            return true;
        }
    }

    // 健康检查
    if (urlPath === '/api/health') {
        json(res, { status: 'ok', time: new Date().toISOString() });
        return true;
    }

    return false;
}

// 主服务器
const server = http.createServer(async (req, res) => {
    const timestamp = new Date().toISOString();
    let urlPath = req.url.split('?')[0]; // 去掉查询参数

    console.log(`[${timestamp}] ${req.method} ${req.url}`);

    // API 路由
    if (urlPath.startsWith('/api/')) {
        const handled = await handleAPI(req, res, urlPath);
        if (handled) return;
    }

    // 静态文件服务
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(__dirname, urlPath);

    // 安全检查：防止路径穿越
    const safePath = path.normalize(filePath).replace(/\.\./g, '');
    if (!safePath.startsWith(path.join(__dirname))) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('Forbidden');
        return;
    }

    serveStatic(safePath, res);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🖥️  天翼云报价工具 - 生产服务器                      ║
║                                                      ║
║   地址: http://0.0.0.0:${PORT}                         ║
║   报价工具: http://localhost:${PORT}/                   ║
║   注册码: ${DEFAULT_LICENSE_CODE}                              ║
║                                                      ║
║   按 Ctrl+C 停止服务器                                ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
    `);
});

process.on('SIGINT', () => { console.log('\n服务器已停止'); process.exit(); });
process.on('SIGTERM', () => { console.log('\n服务器已停止'); process.exit(); });
