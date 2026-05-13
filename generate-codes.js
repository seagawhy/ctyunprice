/**
 * 注册码生成器 - 本地运行生成500个注册码
 * 运行: node generate-codes.js
 */
const fs = require('fs');

function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const COUNT = 500;
const PREFIX = 'CTYUN';
const codes = new Set();
const now = new Date().toLocaleString('zh-CN');

// 去重生成
while (codes.size < COUNT) {
    codes.add(PREFIX + generateRandomCode(8));
}

const codeList = Array.from(codes);

// 输出格式1：纯文本（每行一个码）
const txtContent = `天翼云报价工具 - 注册码列表
生成时间: ${now}
总数量: ${COUNT} 个
前缀: ${PREFIX}
长度: 8位随机字符

===========================================
使用说明:
1. 每个注册码仅限使用一次
2. 用户关注公众号后，按顺序发放
3. 已使用的码会被标记为"已用"，不可重复使用

注册码列表:
-------------------------------------------
${codeList.join('\n')}
-------------------------------------------

共 ${COUNT} 个注册码`;

fs.writeFileSync('d:/CTYUN/license_codes.txt', txtContent, 'utf8');

// 输出格式2：JSON（用于数据库批量导入）
const jsonData = {
    generated_at: now,
    total: COUNT,
    prefix: PREFIX,
    codes: codeList.map(code => ({
        code: code,
        used: false,
        used_at: null,
        note: ''
    }))
};

fs.writeFileSync('d:/CTYUN/license_codes.json', JSON.stringify(jsonData, null, 2), 'utf8');

// 输出格式3：CSV（方便Excel查看）
let csvContent = '序号,注册码,状态\n';
codeList.forEach((code, i) => {
    csvContent += `${i + 1},${code},未使用\n`;
});
fs.writeFileSync('d:/CTYUN/license_codes.csv', csvContent, 'utf8');

console.log(`\n✅ 成功生成 ${COUNT} 个注册码!`);
console.log(`📄 纯文本: license_codes.txt`);
console.log(`📊 数据库导入: license_codes.json`);
console.log(`📈 Excel表格: license_codes.csv`);
console.log(`\n前10个预览:`);
codeList.slice(0, 10).forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
console.log(`  ...`);
