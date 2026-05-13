const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 集合名
const LICENSES_COLLECTION = 'licenses';
const STATS_COLLECTION = 'usage_stats';

/**
 * 注册码验证与统计云函数
 * 
 * action=verify    - 验证注册码，记录使用统计
 * action=stats     - 获取使用统计数据（管理员用）
 * action=addCode   - 添加注册码（管理员用）
 * action=batchAdd  - 批量添加注册码（管理员用）
 */
exports.main = async (event, context) => {
    const { action } = event;

    try {
        switch (action) {
            case 'verify':
                return await verifyLicense(event);
            case 'stats':
                return await getStats();
            case 'addCode':
                return await addSingleCode(event);
            case 'batchAdd':
                return await batchAddCodes(event);
            default:
                return { success: false, message: '未知操作' };
        }
    } catch (e) {
        console.error('verifyLicense error:', e);
        return { success: false, message: e.message };
    }
};

// 统一默认注册码（公众号粉丝通用）
const DEFAULT_LICENSE_CODE = '20262026';

// 验证注册码
async function verifyLicense(evt) {
    const code = evt?.code;
    if (!code || !code.trim()) {
        return { success: false, message: '请输入注册码' };
    }

    const cleanCode = code.trim();

    // 优先检查默认注册码（不限制使用次数）
    if (cleanCode === DEFAULT_LICENSE_CODE) {
        // 默认码也记录统计（可选）
        try { await updateStats(); } catch(e) {}
        return { success: true, message: '验证成功！' };
    }

    // 查询数据库中的注册码（大写匹配）
    const upperCode = cleanCode.toUpperCase();
    const result = await db.collection(LICENSES_COLLECTION)
        .where({ code: upperCode })
        .limit(1)
        .get();

    if (result.data.length === 0) {
        return { success: false, message: '注册码无效，请检查后重试' };
    }

    const license = result.data[0];

    // 检查是否已使用
    if (license.used) {
        return { success: false, message: '该注册码已被使用，每个注册码仅限一次' };
    }

    // 标记为已使用
    const now = new Date();
    await db.collection(LICENSES_COLLECTION).doc(license._id).update({
        data: {
            used: true,
            used_at: now,
            // 可选：记录用户信息（IP、UA等）
            user_info: evt?.userInfo || {}
        }
    });

    // 更新统计数据
    await updateStats();

    return { 
        success: true, 
        message: '验证成功！' 
    };
}

// 更新/初始化统计数据
async function updateStats() {
    const now = new Date();
    
    // 使用 upsert 模式：查找或创建统计文档
    const existing = await db.collection(STATS_COLLECTION)
        .where({ type: 'summary' })
        .limit(1)
        .get();

    if (existing.data.length > 0) {
        // 更新已有统计
        const stat = existing.data[0];
        await db.collection(STATS_COLLECTION).doc(stat._id).update({
            data: {
                total_users: _.inc(1),
                total_downloads: _.inc(1),
                last_used_at: now,
                updated_at: now
            }
        });
    } else {
        // 创建初始统计
        await db.collection(STATS_COLLECTION).add({
            data: {
                type: 'summary',
                total_users: 1,
                total_downloads: 1,
                created_at: now,
                last_used_at: now,
                updated_at: now
            }
        });
    }
}

// 获取统计数据
async function getStats() {
    const result = await db.collection(STATS_COLLECTION)
        .where({ type: 'summary' })
        .limit(1)
        .get();

    if (result.data.length > 0) {
        return { success: true, data: result.data[0] };
    }

    return { 
        success: true, 
        data: { 
            total_users: 0, 
            total_downloads: 0, 
            message: '暂无使用数据' 
        } 
    };
}

// 添加单个注册码
async function addSingleCode({ code, note }) {
    if (!code || !code.trim()) {
        return { success: false, message: '注册码不能为空' };
    }

    const cleanCode = code.trim().toUpperCase();
    const now = new Date();

    // 检查是否已存在
    const existing = await db.collection(LICENSES_COLLECTION)
        .where({ code: cleanCode })
        .limit(1)
        .get();

    if (existing.data.length > 0) {
        return { success: false, message: '该注册码已存在' };
    }

    await db.collection(LICENSES_COLLECTION).add({
        data: {
            code: cleanCode,
            note: note || '',
            used: false,
            used_at: null,
            created_at: now,
            created_by: event.userInfo?.openId || 'admin'
        }
    });

    return { success: true, message: `注册码 ${cleanCode} 创建成功` };
}

// 批量添加注册码（生成指定数量的随机码）
async function batchAddCodes({ count, prefix, note }) {
    const num = parseInt(count) || 10;
    const pfx = prefix || 'CTYUN';
    const now = new Date();
    let added = 0;
    let duplicates = 0;
    const codes = [];

    for (let i = 0; i < num; i++) {
        // 生成8位随机码
        const randomPart = generateRandomCode(8);
        const fullCode = `${pfx}${randomPart}`;

        // 去重检查
        const existing = await db.collection(LICENSES_COLLECTION)
            .where({ code: fullCode })
            .limit(1)
            .get();

        if (existing.data.length === 0) {
            await db.collection(LICENSES_COLLECTION).add({
                data: {
                    code: fullCode,
                    note: note || '',
                    used: false,
                    used_at: null,
                    created_at: now,
                    batch_id: now.getTime().toString()
                }
            });
            codes.push(fullCode);
            added++;
        } else {
            duplicates++;
        }
    }

    return {
        success: true,
        message: `成功添加 ${added} 个注册码`,
        data: { added, duplicates, codes }
    };
}

// 生成随机注册码（大写字母+数字）
function generateRandomCode(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符 I, O, 0, 1
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
