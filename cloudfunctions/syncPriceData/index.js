const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 价格数据 - 基于天翼云官方文档最新价格
// 通用型 s8e: vCPU 46元/核/月 + 内存 17元/G/月，年付8折，三年付7.5折
// 计算型 c8: vCPU 74元/核/月 + 内存 14元/G/月，年付8折，三年付7.5折
// 内存型 m7: vCPU 58.43元/核/月 + 内存 14元/G/月，年付8折，三年付7.5折
const PRICE_DATA = {
    compute: {
        name: "计算资源",
        products: {
            // 通用型 s8e
            "云主机_s8e_2核4G": { name: "云主机套餐", spec: "通用型 s8e | 2核4G", monthlyPrice: 160, yearlyPrice: 1536, threeYearPrice: 4320, unit: "月" },
            "云主机_s8e_2核8G": { name: "云主机套餐", spec: "通用型 s8e | 2核8G", monthlyPrice: 228, yearlyPrice: 2189, threeYearPrice: 6156, unit: "月" },
            "云主机_s8e_4核8G": { name: "云主机套餐", spec: "通用型 s8e | 4核8G", monthlyPrice: 320, yearlyPrice: 3072, threeYearPrice: 8640, unit: "月" },
            "云主机_s8e_4核16G": { name: "云主机套餐", spec: "通用型 s8e | 4核16G", monthlyPrice: 456, yearlyPrice: 4378, threeYearPrice: 12312, unit: "月" },
            "云主机_s8e_8核16G": { name: "云主机套餐", spec: "通用型 s8e | 8核16G", monthlyPrice: 640, yearlyPrice: 6144, threeYearPrice: 17280, unit: "月" },
            "云主机_s8e_8核32G": { name: "云主机套餐", spec: "通用型 s8e | 8核32G", monthlyPrice: 912, yearlyPrice: 8755, threeYearPrice: 24624, unit: "月" },
            "云主机_s8e_16核32G": { name: "云主机套餐", spec: "通用型 s8e | 16核32G", monthlyPrice: 1280, yearlyPrice: 12288, threeYearPrice: 34560, unit: "月" },
            "云主机_s8e_16核64G": { name: "云主机套餐", spec: "通用型 s8e | 16核64G", monthlyPrice: 1824, yearlyPrice: 17510, threeYearPrice: 49248, unit: "月" },
            "云主机_s8e_32核64G": { name: "云主机套餐", spec: "通用型 s8e | 32核64G", monthlyPrice: 2560, yearlyPrice: 24576, threeYearPrice: 69120, unit: "月" },
            "云主机_s8e_32核128G": { name: "云主机套餐", spec: "通用型 s8e | 32核128G", monthlyPrice: 3648, yearlyPrice: 35021, threeYearPrice: 98304, unit: "月" },
            // 计算型 c8
            "云主机_c8_2核4G": { name: "云主机套餐", spec: "计算型 c8 | 2核4G", monthlyPrice: 204, yearlyPrice: 1958, threeYearPrice: 5508, unit: "月" },
            "云主机_c8_2核8G": { name: "云主机套餐", spec: "计算型 c8 | 2核8G", monthlyPrice: 260, yearlyPrice: 2496, threeYearPrice: 7020, unit: "月" },
            "云主机_c8_4核8G": { name: "云主机套餐", spec: "计算型 c8 | 4核8G", monthlyPrice: 408, yearlyPrice: 3917, threeYearPrice: 11016, unit: "月" },
            "云主机_c8_4核16G": { name: "云主机套餐", spec: "计算型 c8 | 4核16G", monthlyPrice: 520, yearlyPrice: 4992, threeYearPrice: 14040, unit: "月" },
            "云主机_c8_8核16G": { name: "云主机套餐", spec: "计算型 c8 | 8核16G", monthlyPrice: 816, yearlyPrice: 7834, threeYearPrice: 22032, unit: "月" },
            "云主机_c8_8核32G": { name: "云主机套餐", spec: "计算型 c8 | 8核32G", monthlyPrice: 1040, yearlyPrice: 9984, threeYearPrice: 28080, unit: "月" },
            "云主机_c8_16核32G": { name: "云主机套餐", spec: "计算型 c8 | 16核32G", monthlyPrice: 1632, yearlyPrice: 15667, threeYearPrice: 44064, unit: "月" },
            "云主机_c8_16核64G": { name: "云主机套餐", spec: "计算型 c8 | 16核64G", monthlyPrice: 2080, yearlyPrice: 19968, threeYearPrice: 56160, unit: "月" },
            "云主机_c8_32核64G": { name: "云主机套餐", spec: "计算型 c8 | 32核64G", monthlyPrice: 3264, yearlyPrice: 31334, threeYearPrice: 88128, unit: "月" },
            "云主机_c8_32核128G": { name: "云主机套餐", spec: "计算型 c8 | 32核128G", monthlyPrice: 4160, yearlyPrice: 39936, threeYearPrice: 112320, unit: "月" },
            // 内存型 m7
            "云主机_m7_2核4G": { name: "云主机套餐", spec: "内存型 m7 | 2核4G", monthlyPrice: 173, yearlyPrice: 1661, threeYearPrice: 4671, unit: "月" },
            "云主机_m7_2核8G": { name: "云主机套餐", spec: "内存型 m7 | 2核8G", monthlyPrice: 229, yearlyPrice: 2198, threeYearPrice: 6183, unit: "月" },
            "云主机_m7_4核8G": { name: "云主机套餐", spec: "内存型 m7 | 4核8G", monthlyPrice: 346, yearlyPrice: 3322, threeYearPrice: 9342, unit: "月" },
            "云主机_m7_4核16G": { name: "云主机套餐", spec: "内存型 m7 | 4核16G", monthlyPrice: 458, yearlyPrice: 4397, threeYearPrice: 12366, unit: "月" },
            "云主机_m7_8核16G": { name: "云主机套餐", spec: "内存型 m7 | 8核16G", monthlyPrice: 691, yearlyPrice: 6634, threeYearPrice: 18657, unit: "月" },
            "云主机_m7_8核32G": { name: "云主机套餐", spec: "内存型 m7 | 8核32G", monthlyPrice: 915, yearlyPrice: 8784, threeYearPrice: 24705, unit: "月" },
            "云主机_m7_16核32G": { name: "云主机套餐", spec: "内存型 m7 | 16核32G", monthlyPrice: 1383, yearlyPrice: 13277, threeYearPrice: 37341, unit: "月" },
            "云主机_m7_16核64G": { name: "云主机套餐", spec: "内存型 m7 | 16核64G", monthlyPrice: 1831, yearlyPrice: 17578, threeYearPrice: 49437, unit: "月" },
            "云主机_m7_32核64G": { name: "云主机套餐", spec: "内存型 m7 | 32核64G", monthlyPrice: 2766, yearlyPrice: 26554, threeYearPrice: 74682, unit: "月" },
            "云主机_m7_32核128G": { name: "云主机套餐", spec: "内存型 m7 | 32核128G", monthlyPrice: 3662, yearlyPrice: 35155, threeYearPrice: 98874, unit: "月" }
        }
    },
    storage: {
        name: "存储资源",
        products: {
            "云硬盘_SATA_40G": { name: "云硬盘", spec: "SATA | 40GB", monthlyPrice: 4, yearlyPrice: 40, threeYearPrice: 104, unit: "月" },
            "云硬盘_SATA_100G": { name: "云硬盘", spec: "SATA | 100GB", monthlyPrice: 10, yearlyPrice: 100, threeYearPrice: 260, unit: "月" },
            "云硬盘_SSD_40G": { name: "云硬盘", spec: "通用SSD | 40GB", monthlyPrice: 8, yearlyPrice: 80, threeYearPrice: 208, unit: "月" },
            "云硬盘_SSD_100G": { name: "云硬盘", spec: "通用SSD | 100GB", monthlyPrice: 20, yearlyPrice: 200, threeYearPrice: 520, unit: "月" },
            "云硬盘_超高IO_40G": { name: "云硬盘", spec: "超高IO SSD | 40GB", monthlyPrice: 12, yearlyPrice: 120, threeYearPrice: 312, unit: "月" },
            "云硬盘_超高IO_100G": { name: "云硬盘", spec: "超高IO SSD | 100GB", monthlyPrice: 30, yearlyPrice: 300, threeYearPrice: 780, unit: "月" }
        }
    },
    network: {
        name: "网络资源",
        products: {
            "弹性IP_5M": { name: "弹性IP EIP", spec: "5Mbps", monthlyPrice: 100, yearlyPrice: 1020, threeYearPrice: 1800, unit: "月" },
            "弹性IP_10M": { name: "弹性IP EIP", spec: "10Mbps", monthlyPrice: 280, yearlyPrice: 2856, threeYearPrice: 5040, unit: "月" },
            "弹性IP_20M": { name: "弹性IP EIP", spec: "20Mbps", monthlyPrice: 640, yearlyPrice: 6528, threeYearPrice: 11520, unit: "月" },
            "弹性IP_50M": { name: "弹性IP EIP", spec: "50Mbps", monthlyPrice: 1720, yearlyPrice: 17544, threeYearPrice: 30960, unit: "月" },
            "负载均衡_标准型I": { name: "负载均衡 ELB", spec: "性能保障型 | 标准型I", monthlyPrice: 360, yearlyPrice: 3600, threeYearPrice: 9360, unit: "月" },
            "NAT网关_小型": { name: "NAT网关", spec: "小型 | 最大并发1万", monthlyPrice: 306, yearlyPrice: 3121.2, threeYearPrice: 5508, unit: "月" }
        }
    },
    security: {
        name: "安全产品",
        products: {
            "主机安全_企业版50": { name: "主机安全 HSS", spec: "企业版 v2.0 | 50个主机", monthlyPrice: 3000, yearlyPrice: 30600, threeYearPrice: 54000, unit: "月" },
            "防火墙_1G": { name: "防火墙 AF", spec: "标准版 v2.0 | 1Gbps", monthlyPrice: 1879, yearlyPrice: 22546, threeYearPrice: 67644, unit: "月" },
            "WAF_3000QPS": { name: "WAF Web防火墙", spec: "SaaS版 标准版 v2.0 | 3000QPS", monthlyPrice: 3880, yearlyPrice: 39576, threeYearPrice: 69840, unit: "月" },
            "堡垒机_10资产": { name: "堡垒机 BH", spec: "v2.0 | 10个资产", monthlyPrice: 1020, yearlyPrice: 10404, threeYearPrice: 18360, unit: "月" }
        }
    },
    gpu: {
        name: "GPU云主机",
        products: {
            "GPU_pi7_4xlarge": { name: "GPU云主机", spec: "A10计算加速型 | 16核64G | 1×A10", monthlyPrice: 4447.43, yearlyPrice: 4447.43 * 12 * 0.85, threeYearPrice: 4447.43 * 36 * 0.5, unit: "月" },
            "GPU_pi2_2xlarge": { name: "GPU云主机", spec: "T4计算加速型 | 8核32G | 1×T4", monthlyPrice: 3515, yearlyPrice: 3515 * 12 * 0.85, threeYearPrice: 3515 * 36 * 0.5, unit: "月" },
            "GPU_pn8s_5xlarge": { name: "GPU云主机", spec: "L40S计算加速型 | 20核74G | 1×L40S", monthlyPrice: 15012, yearlyPrice: 15012 * 12, threeYearPrice: 15012 * 36, unit: "月" }
        }
    }
};

// 同步价格数据
async function syncPriceData(source = 'all') {
    const categories = source === 'all' ? Object.keys(PRICE_DATA) : [source];
    let totalCount = 0;

    for (const catId of categories) {
        const category = PRICE_DATA[catId];
        if (!category || !category.products) continue;

        for (const [productKey, product] of Object.entries(category.products)) {
            try {
                const existing = await db.collection('price_products')
                    .where({ category_id: catId, product_key: productKey })
                    .limit(1)
                    .get();

                const now = new Date();
                const doc = {
                    category_id: catId,
                    product_key: productKey,
                    name: product.name,
                    spec: product.spec,
                    monthly_price: product.monthlyPrice,
                    yearly_price: product.yearlyPrice,
                    three_year_price: product.threeYearPrice,
                    unit: product.unit || '月',
                    remark: product.remark || '',
                    last_checked: now,
                    updated_at: now
                };

                if (existing.data.length > 0) {
                    await db.collection('price_products').doc(existing.data[0]._id).update({
                        data: doc
                    });
                } else {
                    await db.collection('price_products').add({
                        data: doc
                    });
                }
                totalCount++;
            } catch (e) {
                console.error(`同步失败 [${catId}][${productKey}]:`, e);
            }
        }
    }

    return { success: true, count: totalCount };
}

exports.main = async (event, context) => {
    try {
        const source = event.source || 'all';
        const result = await syncPriceData(source);
        return result;
    } catch (e) {
        console.error('同步价格数据失败:', e);
        return { success: false, message: e.message };
    }
};
