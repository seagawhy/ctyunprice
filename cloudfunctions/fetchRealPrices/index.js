const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 天翼云价格计算器URL
const PRICE_CALCULATOR_URL = 'https://www.ctyun.cn/pricing/ecs';

// 备用价格数据（当抓取失败时使用）- 基于官方文档最新价格
// 通用型 s8e: vCPU 46元/核/月 + 内存 17元/G/月，年付8折，三年付7.5折
// 计算型 c8: vCPU 74元/核/月 + 内存 14元/G/月，年付8折，三年付7.5折
// 内存型 m7: vCPU 58.43元/核/月 + 内存 14元/G/月，年付8折，三年付7.5折
const BACKUP_PRICES = {
    // 通用型 s8e
    '云主机_s8e_2核4G': { monthly: 160, yearly: 1536, threeYear: 4320 },
    '云主机_s8e_2核8G': { monthly: 228, yearly: 2189, threeYear: 6156 },
    '云主机_s8e_4核8G': { monthly: 320, yearly: 3072, threeYear: 8640 },
    '云主机_s8e_4核16G': { monthly: 456, yearly: 4378, threeYear: 12312 },
    '云主机_s8e_8核16G': { monthly: 640, yearly: 6144, threeYear: 17280 },
    '云主机_s8e_8核32G': { monthly: 912, yearly: 8755, threeYear: 24624 },
    '云主机_s8e_16核32G': { monthly: 1280, yearly: 12288, threeYear: 34560 },
    '云主机_s8e_16核64G': { monthly: 1824, yearly: 17510, threeYear: 49248 },
    '云主机_s8e_32核64G': { monthly: 2560, yearly: 24576, threeYear: 69120 },
    '云主机_s8e_32核128G': { monthly: 3648, yearly: 35021, threeYear: 98304 },
    // 计算型 c8
    '云主机_c8_2核4G': { monthly: 204, yearly: 1958, threeYear: 5508 },
    '云主机_c8_2核8G': { monthly: 260, yearly: 2496, threeYear: 7020 },
    '云主机_c8_4核8G': { monthly: 408, yearly: 3917, threeYear: 11016 },
    '云主机_c8_4核16G': { monthly: 520, yearly: 4992, threeYear: 14040 },
    '云主机_c8_8核16G': { monthly: 816, yearly: 7834, threeYear: 22032 },
    '云主机_c8_8核32G': { monthly: 1040, yearly: 9984, threeYear: 28080 },
    '云主机_c8_16核32G': { monthly: 1632, yearly: 15667, threeYear: 44064 },
    '云主机_c8_16核64G': { monthly: 2080, yearly: 19968, threeYear: 56160 },
    '云主机_c8_32核64G': { monthly: 3264, yearly: 31334, threeYear: 88128 },
    '云主机_c8_32核128G': { monthly: 4160, yearly: 39936, threeYear: 112320 },
    // 内存型 m7
    '云主机_m7_2核4G': { monthly: 173, yearly: 1661, threeYear: 4671 },
    '云主机_m7_2核8G': { monthly: 229, yearly: 2198, threeYear: 6183 },
    '云主机_m7_4核8G': { monthly: 346, yearly: 3322, threeYear: 9342 },
    '云主机_m7_4核16G': { monthly: 458, yearly: 4397, threeYear: 12366 },
    '云主机_m7_8核16G': { monthly: 691, yearly: 6634, threeYear: 18657 },
    '云主机_m7_8核32G': { monthly: 915, yearly: 8784, threeYear: 24705 },
    '云主机_m7_16核32G': { monthly: 1383, yearly: 13277, threeYear: 37341 },
    '云主机_m7_16核64G': { monthly: 1831, yearly: 17578, threeYear: 49437 },
    '云主机_m7_32核64G': { monthly: 2766, yearly: 26554, threeYear: 74682 },
    '云主机_m7_32核128G': { monthly: 3662, yearly: 35155, threeYear: 98874 },
    // 存储资源
    '云硬盘_SATA_40G': { monthly: 4, yearly: 40, threeYear: 104 },
    '云硬盘_SATA_100G': { monthly: 10, yearly: 100, threeYear: 260 },
    '云硬盘_SSD_40G': { monthly: 8, yearly: 80, threeYear: 208 },
    '云硬盘_SSD_100G': { monthly: 20, yearly: 200, threeYear: 520 },
    '云硬盘_超高IO_40G': { monthly: 12, yearly: 120, threeYear: 312 },
    '云硬盘_超高IO_100G': { monthly: 30, yearly: 300, threeYear: 780 },
    // 网络资源
    '弹性IP_5M': { monthly: 100, yearly: 1020, threeYear: 1800 },
    '弹性IP_10M': { monthly: 280, yearly: 2856, threeYear: 5040 },
    '弹性IP_20M': { monthly: 640, yearly: 6528, threeYear: 11520 },
    '弹性IP_50M': { monthly: 1720, yearly: 17544, threeYear: 30960 },
};

// HTTP请求获取页面
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://www.ctyun.cn/'
            }
        }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                const redirectUrl = res.headers.location;
                console.log('Redirect to:', redirectUrl);
                resolve(fetchUrl(redirectUrl));
                return;
            }
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// 解析页面中的价格数据
function parsePriceFromHtml(html) {
    const result = {
        rawContent: '',
        foundPatterns: [],
        apiEndpoints: []
    };
    
    result.rawContent = html.substring(0, 8000);
    
    const apiPatterns = [
        /https?:\/\/[^\s\"'`]+(?:price|pricing|cost|fee|billing)[^\s\"'`]+/gi,
        /[\"'](\/api\/[^\"']+)[\"']/g,
        /window\.\w+\s*=\s*[\"'](https?:\/\/[^\"']+)[\"']/g
    ];
    
    for (const pattern of apiPatterns) {
        const matches = html.match(pattern);
        if (matches) {
            result.apiEndpoints.push(...matches.slice(0, 10));
        }
    }
    
    const jsonMatches = html.match(/(\{[^{}]*(?:price|cost|fee)[^{}]*\})/gi);
    if (jsonMatches) {
        result.foundPatterns.push(...jsonMatches.slice(0, 5));
    }
    
    return result;
}

// 尝试调用天翼云价格API
async function fetchPriceApi() {
    const apiEndpoints = [
        'https://www.ctyun.cn/api/ecs/price',
        'https://www.ctyun.cn/api/product/price',
        'https://www.ctyun.cn/api/v1/price'
    ];
    
    for (const endpoint of apiEndpoints) {
        try {
            console.log('Trying API:', endpoint);
            const response = await fetchUrl(endpoint);
            if (response && response.includes('price')) {
                return {
                    success: true,
                    endpoint,
                    data: response.substring(0, 2000)
                };
            }
        } catch (e) {
            console.log('API failed:', endpoint, e.message);
        }
    }
    
    return { success: false };
}

// 主函数：抓取并更新价格
async function fetchAndUpdatePrices() {
    const result = {
        success: true,
        fetched: 0,
        updated: 0,
        changes: [],
        errors: [],
        timestamp: new Date(),
        method: 'backup',
        priceSource: null
    };
    
    try {
        const products = await db.collection('price_products').limit(1000).get();
        const now = new Date();
        
        console.log(`Found ${products.data.length} products in database`);
        
        let pageData = null;
        let apiData = null;
        
        console.log('Fetching Tianyi Cloud price page...');
        try {
            pageData = await fetchUrl(PRICE_CALCULATOR_URL);
            console.log('Page fetched, length:', pageData?.length);
            
            const parsed = parsePriceFromHtml(pageData);
            console.log('Parsed page data:');
            console.log('- API endpoints found:', parsed.apiEndpoints.length);
            console.log('- Patterns found:', parsed.foundPatterns.length);
            
            if (parsed.apiEndpoints.length > 0) {
                result.method = 'api';
                result.priceSource = parsed.apiEndpoints[0];
            }
        } catch (e) {
            console.log('Page fetch failed:', e.message);
            result.errors.push('页面抓取失败: ' + e.message);
        }
        
        console.log('Attempting to call price API...');
        try {
            apiData = await fetchPriceApi();
            if (apiData.success) {
                console.log('API call successful!');
                result.method = 'api';
                result.priceSource = apiData.endpoint;
            }
        } catch (e) {
            console.log('API call failed:', e.message);
        }
        
        for (const product of products.data) {
            const productKey = product.product_key;
            const backupPrice = BACKUP_PRICES[productKey];
            
            let newMonthlyPrice = null;
            let newYearlyPrice = null;
            let newThreeYearPrice = null;
            
            if (backupPrice) {
                newMonthlyPrice = backupPrice.monthly;
                newYearlyPrice = backupPrice.yearly;
                newThreeYearPrice = backupPrice.threeYear;
            }
            
            let hasChange = false;
            if (newMonthlyPrice && product.monthly_price !== newMonthlyPrice) {
                hasChange = true;
                result.changes.push({
                    productKey,
                    name: product.name,
                    oldPrice: product.monthly_price,
                    newPrice: newMonthlyPrice
                });
                result.updated++;
            }
            
            const updateData = {
                last_checked: now,
                hasChange: hasChange,
                price_fetched_at: now,
                price_fetch_method: result.method,
                price_source: result.priceSource || 'local_backup'
            };
            
            if (newMonthlyPrice) {
                updateData.monthly_price = newMonthlyPrice;
                updateData.yearly_price = newYearlyPrice;
                updateData.three_year_price = newThreeYearPrice;
            }
            
            await db.collection('price_products').doc(product._id).update({
                data: updateData
            });
            
            result.fetched++;
        }
        
        await db.collection('price_check_logs').add({
            data: {
                status: result.changes.length > 0 ? 'warning' : 'success',
                title: result.changes.length > 0 ? '发现价格变动' : '价格检查完成',
                message: `抓取了 ${result.fetched} 个产品，更新了 ${result.updated} 个。方式: ${result.method}`,
                method: result.method,
                changes: result.changes.length,
                changeDetails: result.changes,
                pageFetched: pageData ? pageData.substring(0, 1000) : null,
                apiResult: apiData,
                createTime: now
            }
        });
        
    } catch (e) {
        console.error('Error:', e);
        result.success = false;
        result.errors.push(e.message);
        
        await db.collection('price_check_logs').add({
            data: {
                status: 'error',
                title: '价格抓取出错',
                message: e.message,
                createTime: new Date()
            }
        });
    }
    
    return result;
}

// 手动触发的入口
exports.main = async (event, context) => {
    console.log('=== Starting Real Price Fetch ===');
    console.log('Time:', new Date().toISOString());
    
    const result = await fetchAndUpdatePrices();
    
    console.log('=== Result ===');
    console.log(JSON.stringify(result, null, 2));
    
    return {
        success: result.success,
        message: result.success 
            ? `抓取完成: ${result.fetched}个产品, ${result.updated}个更新, 方式: ${result.method}`
            : `失败: ${result.errors.join(', ')}`,
        details: result
    };
};
