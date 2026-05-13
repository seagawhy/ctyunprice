const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    host: '159.75.243.119',
    port: 22,
    username: 'ubuntu',
    password: '*why2026#',
    remotePath: '/opt/ctyun-quote/',
};

function log(msg) { console.log(`[deploy] ${msg}`); }

async function runCmd(conn, cmd) {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let out = '';
            stream.on('data', d => { out += d.toString(); process.stdout.write(d); })
                  .stderr.on('data', d => process.stderr.write(d))
                  .on('close', code => resolve({ code, out }));
        });
    });
}

async function deploy() {
    const conn = new Client();

    await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(CONFIG));
    log('SSH连接成功');

    const sftp = await new Promise((res, rej) => conn.sftp((e, s) => e ? rej(e) : res(s)));

    // Step 1: 创建远程目录
    log('创建远程目录...');
    await runCmd(conn, `mkdir -p ${CONFIG.remotePath}{css,js,images,cloudfunctions}`);

    // Step 2: 上传文件
    const files = ['index.html','verify.html','getcode.html','admin.html','server.js','Dockerfile','docker-compose.yml'];
    if (fs.existsSync('.env')) files.push('.env');

    for (const f of files) {
        const localPath = path.join(__dirname, f);
        if (!fs.existsSync(localPath)) { log(`跳过(不存在): ${f}`); continue; }
        log(`上传: ${f}`);
        await new Promise((res) => sftp.fastPut(localPath, CONFIG.remotePath + f, () => res()));
        log(`  ✓ ${f}`);
    }

    // Step 3: 上传目录
    for (const dir of ['css', 'js', 'images', 'cloudfunctions']) {
        const localDir = path.join(__dirname, dir);
        if (!fs.existsSync(localDir)) continue;
        const items = fs.readdirSync(localDir).filter(i => !fs.statSync(path.join(localDir, i)).isDirectory());
        log(`上传: ${dir}/ (${items.length}个文件)`);
        let count = 0;
        for (const item of items) {
            const localItem = path.join(dir, item);
            const remotePath = CONFIG.remotePath + dir + '/' + item;
            await new Promise((res) => sftp.fastPut(path.join(__dirname, localItem), remotePath, () => res()));
            count++;
        }
        log(`  ✓ ${dir}/ (${count}个文件)`);
    }

    sftp.end();

    // Step 4: Docker重建
    log('\n重建Docker容器...');
    await runCmd(conn, `cd ${CONFIG.remotePath} && sudo docker compose up -d --build 2>&1`);

    log('\n等待服务启动...');
    await new Promise(r => setTimeout(r, 5000));

    const h = await runCmd(conn, "curl -s http://localhost:3000/api/health");
    conn.end();
    
    if (h.out.includes('ok')) {
        log('\n✅ 部署成功！线上地址: http://159.75.243.119:3000');
    } else {
        log(`\n⚠️ 健康检查: ${h.out.trim()}`);
        log('请手动访问确认');
    }
}

deploy().catch(e => { console.error('\n部署失败:', e.message || e); process.exit(1); });
