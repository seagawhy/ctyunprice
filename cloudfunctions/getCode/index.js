const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 集合名
const LICENSES_COLLECTION = 'licenses';
const STATS_COLLECTION = 'usage_stats';

/**
 * 自动分配注册码云函数
 * 
 * action=allocate  - 分配一个未使用的注册码（原子操作）
 * action=stats    - 获取统计数据
 */
exports.main = async (event, context) => {
    const { action } = event;

    try {
        switch (action) {
            case 'allocate':
                return await allocateCode(event);
            case 'stats':
                return await getStats();
            case 'init':
                return await initBatch();
            default:
                return await allocateCode(event); // 默认就是分配
        }
    } catch (e) {
        console.error('getCode error:', e);
        return { success: false, message: e.message };
    }
};

// 原子分配一个未使用注册码
async function allocateCode(evt) {
    const now = new Date();
    const evtData = evt || {};

    // 查询第一个未使用的注册码
    const result = await db.collection(LICENSES_COLLECTION)
        .where({
            used: false
        })
        .orderBy('created_at', 'asc')
        .limit(1)
        .get();

    if (result.data.length === 0) {
        return { 
            success: false, 
            message: '注册码已发完，请联系管理员补充',
            code: -1 
        };
    }

    const license = result.data[0];

    // 只返回码，不标记为已用（由verifyLicense验证时统一标记）
    // 更新统计
    await incrementStats(now);

    return {
        success: true,
        code: license.code,
        message: '注册码获取成功'
    };
}

// 更新统计计数
async function incrementStats(now) {
    now = now || new Date();
    
    const existing = await db.collection(STATS_COLLECTION)
        .where({ type: 'summary' })
        .limit(1)
        .get();

    if (existing.data.length > 0) {
        await db.collection(STATS_COLLECTION).doc(existing.data[0]._id).update({
            data: {
                total_users: _.inc(1),
                total_codes_allocated: _.inc(1),
                last_alloc_at: now,
                updated_at: now
            }
        });
    } else {
        await db.collection(STATS_COLLECTION).add({
            data: {
                type: 'summary',
                total_users: 0,
                total_downloads: 0,
                total_codes_allocated: 1,
                created_at: now,
                updated_at: now
            }
        });
    }
}

// 获取统计
async function getStats() {
    // 总码数
    const totalResult = await db.collection(LICENSES_COLLECTION).count();
    // 已用码数
    const usedResult = await db.collection(LICENSES_COLLECTION)
        .where({ used: true })
        .count();
    // 未用码数
    const availResult = await db.collection(LICENSES_COLLECTION)
        .where({ used: false })
        .count();
    
    // 统计记录
    const statResult = await db.collection(STATS_COLLECTION)
        .where({ type: 'summary' })
        .limit(1)
        .get();

    return {
        success: true,
        data: {
            total_codes: totalResult.total,
            used_codes: usedResult.total,
            available_codes: availResult.total,
            stats: statResult.data[0] || null
        }
    };
}

// 初始化：从预生成的JSON导入注册码（首次部署时调用）
async function initBatch() {
    // 检查是否已有数据
    const existing = await db.collection(LICENSES_COLLECTION).count();
    if (existing.total > 0) {
        return { 
            success: true, 
            message: `已存在 ${existing.total} 个注册码，跳过初始化`,
            count: existing.total
        };
    }

    // 生成500个注册码
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const PREFIX = 'CTYUN';
    const COUNT = 500;
    const now = new Date();
    let added = 0;

    for (let i = 0; i < COUNT; i++) {
        let code = '';
        for (let j = 0; j < 8; j++) code += chars[Math.floor(Math.random() * chars.length)];
        code = PREFIX + code;

        try {
            await db.collection(LICENSES_COLLECTION).add({
                data: {
                    code: code,
                    note: '',
                    used: false,
                    used_at: null,
                    created_at: now,
                    init_batch: true
                }
            });
            added++;
        } catch(e) {}
    }

    // 初始化统计记录
    await db.collection(STATS_COLLECTION).add({
        data: {
            type: 'summary',
            total_users: 0,
            total_downloads: 0,
            total_codes_allocated: 0,
            created_at: now,
            updated_at: now
        }
    });

    return {
        success: true,
        message: `初始化完成，共生成 ${added} 个注册码`,
        count: added
    };
}
