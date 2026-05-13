// 天翼云标准价格数据库 - 支持云主机套餐和独立存储

// 云硬盘（系统盘/数据盘/独立云硬盘）- 2026年最新价格
const DISK_PRICES = {
    // 普通IO（SATA）- 0.3元/GB/月，1年8.5折、2年7折、3年5折
    "SATA_40GB": { type: "SATA", size: "40GB", price: 12, yearlyPrice: 122, threeYearPrice: 180 },
    "SATA_100GB": { type: "SATA", size: "100GB", price: 30, yearlyPrice: 306, threeYearPrice: 450 },
    "SATA_200GB": { type: "SATA", size: "200GB", price: 60, yearlyPrice: 612, threeYearPrice: 900 },
    "SATA_500GB": { type: "SATA", size: "500GB", price: 150, yearlyPrice: 1530, threeYearPrice: 2250 },
    "SATA_1TB": { type: "SATA", size: "1TB", price: 300, yearlyPrice: 3060, threeYearPrice: 4500 },
    "SATA_2TB": { type: "SATA", size: "2TB", price: 600, yearlyPrice: 6120, threeYearPrice: 9000 },
    "SATA_4TB": { type: "SATA", size: "4TB", price: 1200, yearlyPrice: 12240, threeYearPrice: 18000 },
    // 高IO（SAS）- 0.4元/GB/月，1年8.5折、2年7折、3年5折
    "SAS_40GB": { type: "SAS", size: "40GB", price: 16, yearlyPrice: 163, threeYearPrice: 240 },
    "SAS_100GB": { type: "SAS", size: "100GB", price: 40, yearlyPrice: 408, threeYearPrice: 600 },
    "SAS_200GB": { type: "SAS", size: "200GB", price: 80, yearlyPrice: 816, threeYearPrice: 1200 },
    "SAS_500GB": { type: "SAS", size: "500GB", price: 200, yearlyPrice: 2040, threeYearPrice: 3000 },
    "SAS_1TB": { type: "SAS", size: "1TB", price: 400, yearlyPrice: 4080, threeYearPrice: 6000 },
    "SAS_2TB": { type: "SAS", size: "2TB", price: 800, yearlyPrice: 8160, threeYearPrice: 12000 },
    // 通用SSD - 0.7元/GB/月，1年8.5折、2年7折、3年6折
    "SSD_40GB": { type: "SSD", size: "40GB", price: 28, yearlyPrice: 286, threeYearPrice: 504 },
    "SSD_100GB": { type: "SSD", size: "100GB", price: 70, yearlyPrice: 714, threeYearPrice: 1260 },
    "SSD_200GB": { type: "SSD", size: "200GB", price: 140, yearlyPrice: 1428, threeYearPrice: 2520 },
    "SSD_500GB": { type: "SSD", size: "500GB", price: 350, yearlyPrice: 3570, threeYearPrice: 6300 },
    "SSD_1TB": { type: "SSD", size: "1TB", price: 700, yearlyPrice: 7140, threeYearPrice: 12600 },
    "SSD_2TB": { type: "SSD", size: "2TB", price: 1400, yearlyPrice: 14280, threeYearPrice: 25200 },
    "SSD_4TB": { type: "SSD", size: "4TB", price: 2800, yearlyPrice: 28560, threeYearPrice: 50400 },
    // 超高IO SSD - 1.2元/GB/月，1年8.5折、2年7折、3年6折
    "超高IO_40GB": { type: "超高IO SSD", size: "40GB", price: 48, yearlyPrice: 490, threeYearPrice: 864 },
    "超高IO_100GB": { type: "超高IO SSD", size: "100GB", price: 120, yearlyPrice: 1224, threeYearPrice: 2160 },
    "超高IO_200GB": { type: "超高IO SSD", size: "200GB", price: 240, yearlyPrice: 2448, threeYearPrice: 4320 },
    "超高IO_500GB": { type: "超高IO SSD", size: "500GB", price: 600, yearlyPrice: 6120, threeYearPrice: 10800 },
    "超高IO_1TB": { type: "超高IO SSD", size: "1TB", price: 1200, yearlyPrice: 12240, threeYearPrice: 21600 },
    "超高IO_2TB": { type: "超高IO SSD", size: "2TB", price: 2400, yearlyPrice: 24480, threeYearPrice: 43200 },
    "超高IO_4TB": { type: "超高IO SSD", size: "4TB", price: 4800, yearlyPrice: 48960, threeYearPrice: 86400 },
    // 极速SSD - 2元/GB/月，1年8.5折、2年7折、3年5折
    "极速SSD_40GB": { type: "极速SSD", size: "40GB", price: 80, yearlyPrice: 816, threeYearPrice: 1440 },
    "极速SSD_100GB": { type: "极速SSD", size: "100GB", price: 200, yearlyPrice: 2040, threeYearPrice: 3600 },
    "极速SSD_200GB": { type: "极速SSD", size: "200GB", price: 400, yearlyPrice: 4080, threeYearPrice: 7200 },
    "极速SSD_500GB": { type: "极速SSD", size: "500GB", price: 1000, yearlyPrice: 10200, threeYearPrice: 18000 },
    "极速SSD_1TB": { type: "极速SSD", size: "1TB", price: 2000, yearlyPrice: 20400, threeYearPrice: 36000 },
    "极速SSD_2TB": { type: "极速SSD", size: "2TB", price: 4000, yearlyPrice: 40800, threeYearPrice: 72000 },
    "极速SSD_4TB": { type: "极速SSD", size: "4TB", price: 8000, yearlyPrice: 81600, threeYearPrice: 144000 }
};

// 系统盘容量选项（支持选择类型）
const SYSTEM_DISK_SIZES = [
    { key: "SYS_40GB", name: "40GB", price: 0, defaultType: "SSD" },
    { key: "SYS_100GB", name: "100GB", price: 0, defaultType: "SSD" },
    { key: "SYS_200GB", name: "200GB", price: 0, defaultType: "SSD" },
    { key: "SYS_500GB", name: "500GB", price: 0, defaultType: "SSD" }
];

// 数据盘容量选项（支持选择类型）
const DATA_DISK_SIZES = [
    { key: "DATA_0", name: "无需数据盘", price: 0 },
    { key: "DATA_100GB", name: "100GB", price: 0 },
    { key: "DATA_200GB", name: "200GB", price: 0 },
    { key: "DATA_500GB", name: "500GB", price: 0 },
    { key: "DATA_1TB", name: "1TB", price: 0 },
    { key: "DATA_2TB", name: "2TB", price: 0 }
];

const PRICE_DATA = {
    // ==================== 计算类 - 云主机套餐 ====================
    compute: {
        name: "计算资源",
        icon: "🖥️",
        products: {
            // 通用型云主机 s8e (vCPU:46元/核/月, 内存:17元/G/月)
            "云主机_s8e_2核4G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 2核4G",
                monthlyPrice: 160,
                yearlyPrice: 1536,
                threeYearPrice: 4320,
                unit: "月"
            },
            "云主机_s8e_2核8G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 2核8G",
                monthlyPrice: 228,
                yearlyPrice: 2189,
                threeYearPrice: 6156,
                unit: "月"
            },
            "云主机_s8e_4核8G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 4核8G",
                monthlyPrice: 320,
                yearlyPrice: 3072,
                threeYearPrice: 8640,
                unit: "月"
            },
            "云主机_s8e_4核16G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 4核16G",
                monthlyPrice: 456,
                yearlyPrice: 4378,
                threeYearPrice: 12312,
                unit: "月"
            },
            "云主机_s8e_8核16G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 8核16G",
                monthlyPrice: 640,
                yearlyPrice: 6144,
                threeYearPrice: 17280,
                unit: "月"
            },
            "云主机_s8e_8核32G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 8核32G",
                monthlyPrice: 912,
                yearlyPrice: 8755,
                threeYearPrice: 24624,
                unit: "月"
            },
            "云主机_s8e_16核32G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 16核32G",
                monthlyPrice: 1280,
                yearlyPrice: 12288,
                threeYearPrice: 34560,
                unit: "月"
            },
            "云主机_s8e_16核64G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 16核64G",
                monthlyPrice: 1824,
                yearlyPrice: 17510,
                threeYearPrice: 49248,
                unit: "月"
            },
            "云主机_s8e_32核64G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 32核64G",
                monthlyPrice: 2560,
                yearlyPrice: 24576,
                threeYearPrice: 69120,
                unit: "月"
            },
            "云主机_s8e_32核128G": {
                name: "云主机套餐",
                spec: "通用型 s8e | 32核128G",
                monthlyPrice: 3648,
                yearlyPrice: 35021,
                threeYearPrice: 98304,
                unit: "月"
            },
            // 计算型云主机 c8 (vCPU:74元/核/月, 内存:14元/G/月)
            "云主机_c8_2核4G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 2核4G",
                monthlyPrice: 204,
                yearlyPrice: 1958,
                threeYearPrice: 5508,
                unit: "月"
            },
            "云主机_c8_2核8G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 2核8G",
                monthlyPrice: 260,
                yearlyPrice: 2496,
                threeYearPrice: 7020,
                unit: "月"
            },
            "云主机_c8_4核8G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 4核8G",
                monthlyPrice: 408,
                yearlyPrice: 3917,
                threeYearPrice: 11016,
                unit: "月"
            },
            "云主机_c8_4核16G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 4核16G",
                monthlyPrice: 520,
                yearlyPrice: 4992,
                threeYearPrice: 14040,
                unit: "月"
            },
            "云主机_c8_8核16G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 8核16G",
                monthlyPrice: 816,
                yearlyPrice: 7834,
                threeYearPrice: 22032,
                unit: "月"
            },
            "云主机_c8_8核32G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 8核32G",
                monthlyPrice: 1040,
                yearlyPrice: 9984,
                threeYearPrice: 28080,
                unit: "月"
            },
            "云主机_c8_16核32G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 16核32G",
                monthlyPrice: 1632,
                yearlyPrice: 15667,
                threeYearPrice: 44064,
                unit: "月"
            },
            "云主机_c8_16核64G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 16核64G",
                monthlyPrice: 2080,
                yearlyPrice: 19968,
                threeYearPrice: 56160,
                unit: "月"
            },
            "云主机_c8_32核64G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 32核64G",
                monthlyPrice: 3264,
                yearlyPrice: 31334,
                threeYearPrice: 88128,
                unit: "月"
            },
            "云主机_c8_32核128G": {
                name: "云主机套餐",
                spec: "计算型 c8 | 32核128G",
                monthlyPrice: 4160,
                yearlyPrice: 39936,
                threeYearPrice: 112320,
                unit: "月"
            },
            // 内存型云主机 m7 (vCPU:58.43元/核/月, 内存:14元/G/月)
            "云主机_m7_2核4G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 2核4G",
                monthlyPrice: 173,
                yearlyPrice: 1661,
                threeYearPrice: 4671,
                unit: "月"
            },
            "云主机_m7_2核8G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 2核8G",
                monthlyPrice: 229,
                yearlyPrice: 2198,
                threeYearPrice: 6183,
                unit: "月"
            },
            "云主机_m7_4核8G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 4核8G",
                monthlyPrice: 346,
                yearlyPrice: 3322,
                threeYearPrice: 9342,
                unit: "月"
            },
            "云主机_m7_4核16G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 4核16G",
                monthlyPrice: 458,
                yearlyPrice: 4397,
                threeYearPrice: 12366,
                unit: "月"
            },
            "云主机_m7_8核16G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 8核16G",
                monthlyPrice: 691,
                yearlyPrice: 6634,
                threeYearPrice: 18657,
                unit: "月"
            },
            "云主机_m7_8核32G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 8核32G",
                monthlyPrice: 915,
                yearlyPrice: 8784,
                threeYearPrice: 24705,
                unit: "月"
            },
            "云主机_m7_16核32G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 16核32G",
                monthlyPrice: 1383,
                yearlyPrice: 13277,
                threeYearPrice: 37341,
                unit: "月"
            },
            "云主机_m7_16核64G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 16核64G",
                monthlyPrice: 1831,
                yearlyPrice: 17578,
                threeYearPrice: 49437,
                unit: "月"
            },
            "云主机_m7_32核64G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 32核64G",
                monthlyPrice: 2766,
                yearlyPrice: 26554,
                threeYearPrice: 74682,
                unit: "月"
            },
            "云主机_m7_32核128G": {
                name: "云主机套餐",
                spec: "内存型 m7 | 32核128G",
                monthlyPrice: 3662,
                yearlyPrice: 35155,
                threeYearPrice: 98874,
                unit: "月"
            },
            // ========== 鲲鹏通用型 ks2x (vCPU:52元/核/月, 内存:15元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_ks2x_2核4G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 2核4G",
                monthlyPrice: 164,
                yearlyPrice: 1870,
                threeYearPrice: 5002,
                unit: "月"
            },
            "云主机_ks2x_2核8G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 2核8G",
                monthlyPrice: 224,
                yearlyPrice: 2554,
                threeYearPrice: 6840,
                unit: "月"
            },
            "云主机_ks2x_4核8G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 4核8G",
                monthlyPrice: 328,
                yearlyPrice: 3740,
                threeYearPrice: 10006,
                unit: "月"
            },
            "云主机_ks2x_4核16G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 4核16G",
                monthlyPrice: 448,
                yearlyPrice: 5107,
                threeYearPrice: 13679,
                unit: "月"
            },
            "云主机_ks2x_8核16G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 8核16G",
                monthlyPrice: 656,
                yearlyPrice: 7478,
                threeYearPrice: 20010,
                unit: "月"
            },
            "云主机_ks2x_8核32G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 8核32G",
                monthlyPrice: 896,
                yearlyPrice: 10214,
                threeYearPrice: 27359,
                unit: "月"
            },
            "云主机_ks2x_16核32G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 16核32G",
                monthlyPrice: 1312,
                yearlyPrice: 14957,
                threeYearPrice: 40022,
                unit: "月"
            },
            "云主机_ks2x_16核64G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 16核64G",
                monthlyPrice: 1792,
                yearlyPrice: 20429,
                threeYearPrice: 54718,
                unit: "月"
            },
            "云主机_ks2x_32核64G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 32核64G",
                monthlyPrice: 2624,
                yearlyPrice: 29914,
                threeYearPrice: 80041,
                unit: "月"
            },
            "云主机_ks2x_32核128G": {
                name: "云主机套餐",
                spec: "鲲鹏通用型 ks2x | 32核128G",
                monthlyPrice: 3584,
                yearlyPrice: 40858,
                threeYearPrice: 109437,
                unit: "月"
            },
            // ========== 鲲鹏计算型 kc2x (vCPU:104元/核/月, 内存:15元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_kc2x_2核4G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 2核4G",
                monthlyPrice: 268,
                yearlyPrice: 3055,
                threeYearPrice: 8184,
                unit: "月"
            },
            "云主机_kc2x_2核8G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 2核8G",
                monthlyPrice: 328,
                yearlyPrice: 3739,
                threeYearPrice: 10015,
                unit: "月"
            },
            "云主机_kc2x_4核8G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 4核8G",
                monthlyPrice: 496,
                yearlyPrice: 5654,
                threeYearPrice: 15139,
                unit: "月"
            },
            "云主机_kc2x_4核16G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 4核16G",
                monthlyPrice: 616,
                yearlyPrice: 7022,
                threeYearPrice: 18810,
                unit: "月"
            },
            "云主机_kc2x_8核16G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 8核16G",
                monthlyPrice: 896,
                yearlyPrice: 10214,
                threeYearPrice: 27359,
                unit: "月"
            },
            "云主机_kc2x_8核32G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 8核32G",
                monthlyPrice: 1216,
                yearlyPrice: 13862,
                threeYearPrice: 37129,
                unit: "月"
            },
            "云主机_kc2x_16核32G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 16核32G",
                monthlyPrice: 1792,
                yearlyPrice: 20429,
                threeYearPrice: 54718,
                unit: "月"
            },
            "云主机_kc2x_16核64G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 16核64G",
                monthlyPrice: 2432,
                yearlyPrice: 27725,
                threeYearPrice: 74277,
                unit: "月"
            },
            "云主机_kc2x_32核64G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 32核64G",
                monthlyPrice: 3296,
                yearlyPrice: 37574,
                threeYearPrice: 100669,
                unit: "月"
            },
            "云主机_kc2x_32核128G": {
                name: "云主机套餐",
                spec: "鲲鹏计算型 kc2x | 32核128G",
                monthlyPrice: 4512,
                yearlyPrice: 51437,
                threeYearPrice: 137816,
                unit: "月"
            },
            // ========== 鲲鹏内存型 km2x (vCPU:104元/核/月, 内存:15元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_km2x_2核4G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 2核4G",
                monthlyPrice: 268,
                yearlyPrice: 3055,
                threeYearPrice: 8184,
                unit: "月"
            },
            "云主机_km2x_2核8G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 2核8G",
                monthlyPrice: 328,
                yearlyPrice: 3739,
                threeYearPrice: 10015,
                unit: "月"
            },
            "云主机_km2x_4核8G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 4核8G",
                monthlyPrice: 496,
                yearlyPrice: 5654,
                threeYearPrice: 15139,
                unit: "月"
            },
            "云主机_km2x_4核16G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 4核16G",
                monthlyPrice: 616,
                yearlyPrice: 7022,
                threeYearPrice: 18810,
                unit: "月"
            },
            "云主机_km2x_8核16G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 8核16G",
                monthlyPrice: 896,
                yearlyPrice: 10214,
                threeYearPrice: 27359,
                unit: "月"
            },
            "云主机_km2x_8核32G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 8核32G",
                monthlyPrice: 1216,
                yearlyPrice: 13862,
                threeYearPrice: 37129,
                unit: "月"
            },
            "云主机_km2x_16核32G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 16核32G",
                monthlyPrice: 1792,
                yearlyPrice: 20429,
                threeYearPrice: 54718,
                unit: "月"
            },
            "云主机_km2x_16核64G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 16核64G",
                monthlyPrice: 2432,
                yearlyPrice: 27725,
                threeYearPrice: 74277,
                unit: "月"
            },
            "云主机_km2x_32核64G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 32核64G",
                monthlyPrice: 3296,
                yearlyPrice: 37574,
                threeYearPrice: 100669,
                unit: "月"
            },
            "云主机_km2x_32核128G": {
                name: "云主机套餐",
                spec: "鲲鹏内存型 km2x | 32核128G",
                monthlyPrice: 4512,
                yearlyPrice: 51437,
                threeYearPrice: 137816,
                unit: "月"
            },
            // ========== 海光通用型 hs3x (vCPU:45元/核/月, 内存:16元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_hs3x_2核4G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 2核4G",
                monthlyPrice: 154,
                yearlyPrice: 1756,
                threeYearPrice: 4702,
                unit: "月"
            },
            "云主机_hs3x_2核8G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 2核8G",
                monthlyPrice: 218,
                yearlyPrice: 2485,
                threeYearPrice: 6650,
                unit: "月"
            },
            "云主机_hs3x_4核8G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 4核8G",
                monthlyPrice: 308,
                yearlyPrice: 3511,
                threeYearPrice: 9398,
                unit: "月"
            },
            "云主机_hs3x_4核16G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 4核16G",
                monthlyPrice: 436,
                yearlyPrice: 4970,
                threeYearPrice: 13303,
                unit: "月"
            },
            "云主机_hs3x_8核16G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 8核16G",
                monthlyPrice: 616,
                yearlyPrice: 7022,
                threeYearPrice: 18796,
                unit: "月"
            },
            "云主机_hs3x_8核32G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 8核32G",
                monthlyPrice: 872,
                yearlyPrice: 9941,
                threeYearPrice: 26598,
                unit: "月"
            },
            "云主机_hs3x_16核32G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 16核32G",
                monthlyPrice: 1232,
                yearlyPrice: 14045,
                threeYearPrice: 37592,
                unit: "月"
            },
            "云主机_hs3x_16核64G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 16核64G",
                monthlyPrice: 1744,
                yearlyPrice: 19882,
                threeYearPrice: 53219,
                unit: "月"
            },
            "云主机_hs3x_32核64G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 32核64G",
                monthlyPrice: 2464,
                yearlyPrice: 28090,
                threeYearPrice: 75187,
                unit: "月"
            },
            "云主机_hs3x_32核128G": {
                name: "云主机套餐",
                spec: "海光通用型 hs3x | 32核128G",
                monthlyPrice: 3488,
                yearlyPrice: 39764,
                threeYearPrice: 106434,
                unit: "月"
            },
            // ========== 海光计算型 hc3x (vCPU:89元/核/月, 内存:14元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_hc3x_2核4G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 2核4G",
                monthlyPrice: 234,
                yearlyPrice: 2668,
                threeYearPrice: 7143,
                unit: "月"
            },
            "云主机_hc3x_2核8G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 2核8G",
                monthlyPrice: 290,
                yearlyPrice: 3306,
                threeYearPrice: 8854,
                unit: "月"
            },
            "云主机_hc3x_4核8G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 4核8G",
                monthlyPrice: 460,
                yearlyPrice: 5244,
                threeYearPrice: 14043,
                unit: "月"
            },
            "云主机_hc3x_4核16G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 4核16G",
                monthlyPrice: 580,
                yearlyPrice: 6612,
                threeYearPrice: 17705,
                unit: "月"
            },
            "云主机_hc3x_8核16G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 8核16G",
                monthlyPrice: 800,
                yearlyPrice: 9120,
                threeYearPrice: 24420,
                unit: "月"
            },
            "云主机_hc3x_8核32G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 8核32G",
                monthlyPrice: 1060,
                yearlyPrice: 12084,
                threeYearPrice: 32355,
                unit: "月"
            },
            "云主机_hc3x_16核32G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 16核32G",
                monthlyPrice: 1600,
                yearlyPrice: 18240,
                threeYearPrice: 48840,
                unit: "月"
            },
            "云主机_hc3x_16核64G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 16核64G",
                monthlyPrice: 2200,
                yearlyPrice: 25080,
                threeYearPrice: 67155,
                unit: "月"
            },
            "云主机_hc3x_32核64G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 32核64G",
                monthlyPrice: 3040,
                yearlyPrice: 34656,
                threeYearPrice: 92814,
                unit: "月"
            },
            "云主机_hc3x_32核128G": {
                name: "云主机套餐",
                spec: "海光计算型 hc3x | 32核128G",
                monthlyPrice: 4080,
                yearlyPrice: 46512,
                threeYearPrice: 124530,
                unit: "月"
            },
            // ========== 海光内存型 hm3x (vCPU:89元/核/月, 内存:14元/G/月, 1年9.5折/2年9折/3年8.5折) ==========
            "云主机_hm3x_2核4G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 2核4G",
                monthlyPrice: 234,
                yearlyPrice: 2668,
                threeYearPrice: 7143,
                unit: "月"
            },
            "云主机_hm3x_2核8G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 2核8G",
                monthlyPrice: 290,
                yearlyPrice: 3306,
                threeYearPrice: 8854,
                unit: "月"
            },
            "云主机_hm3x_4核8G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 4核8G",
                monthlyPrice: 460,
                yearlyPrice: 5244,
                threeYearPrice: 14043,
                unit: "月"
            },
            "云主机_hm3x_4核16G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 4核16G",
                monthlyPrice: 580,
                yearlyPrice: 6612,
                threeYearPrice: 17705,
                unit: "月"
            },
            "云主机_hm3x_8核16G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 8核16G",
                monthlyPrice: 800,
                yearlyPrice: 9120,
                threeYearPrice: 24420,
                unit: "月"
            },
            "云主机_hm3x_8核32G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 8核32G",
                monthlyPrice: 1060,
                yearlyPrice: 12084,
                threeYearPrice: 32355,
                unit: "月"
            },
            "云主机_hm3x_16核32G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 16核32G",
                monthlyPrice: 1600,
                yearlyPrice: 18240,
                threeYearPrice: 48840,
                unit: "月"
            },
            "云主机_hm3x_16核64G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 16核64G",
                monthlyPrice: 2200,
                yearlyPrice: 25080,
                threeYearPrice: 67155,
                unit: "月"
            },
            "云主机_hm3x_32核64G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 32核64G",
                monthlyPrice: 3040,
                yearlyPrice: 34656,
                threeYearPrice: 92814,
                unit: "月"
            },
            "云主机_hm3x_32核128G": {
                name: "云主机套餐",
                spec: "海光内存型 hm3x | 32核128G",
                monthlyPrice: 4080,
                yearlyPrice: 46512,
                threeYearPrice: 124530,
                unit: "月"
            }
        }
    },
    
    // ==================== 存储类 ====================
    storage: {
        name: "存储资源",
        icon: "💾",
        products: {
            // 云硬盘（独立使用）
            "云硬盘_SATA_40G": {
                name: "云硬盘",
                spec: "SATA | 40GB",
                monthlyPrice: 4,
                yearlyPrice: 40,
                threeYearPrice: 104,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_100G": {
                name: "云硬盘",
                spec: "SATA | 100GB",
                monthlyPrice: 10,
                yearlyPrice: 100,
                threeYearPrice: 260,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_200G": {
                name: "云硬盘",
                spec: "SATA | 200GB",
                monthlyPrice: 20,
                yearlyPrice: 200,
                threeYearPrice: 520,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_500G": {
                name: "云硬盘",
                spec: "SATA | 500GB",
                monthlyPrice: 50,
                yearlyPrice: 500,
                threeYearPrice: 1300,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_1T": {
                name: "云硬盘",
                spec: "SATA | 1TB",
                monthlyPrice: 100,
                yearlyPrice: 1000,
                threeYearPrice: 2600,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_2T": {
                name: "云硬盘",
                spec: "SATA | 2TB",
                monthlyPrice: 200,
                yearlyPrice: 2000,
                threeYearPrice: 5200,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SATA_4T": {
                name: "云硬盘",
                spec: "SATA | 4TB",
                monthlyPrice: 400,
                yearlyPrice: 4000,
                threeYearPrice: 10400,
                unit: "月",
                storageType: "cloudDisk"
            },
            // 云硬盘 通用SSD
            "云硬盘_SSD_40G": {
                name: "云硬盘",
                spec: "通用SSD | 40GB",
                monthlyPrice: 8,
                yearlyPrice: 80,
                threeYearPrice: 208,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_100G": {
                name: "云硬盘",
                spec: "通用SSD | 100GB",
                monthlyPrice: 20,
                yearlyPrice: 200,
                threeYearPrice: 520,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_200G": {
                name: "云硬盘",
                spec: "通用SSD | 200GB",
                monthlyPrice: 40,
                yearlyPrice: 400,
                threeYearPrice: 1040,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_500G": {
                name: "云硬盘",
                spec: "通用SSD | 500GB",
                monthlyPrice: 100,
                yearlyPrice: 1000,
                threeYearPrice: 2600,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_1T": {
                name: "云硬盘",
                spec: "通用SSD | 1TB",
                monthlyPrice: 200,
                yearlyPrice: 2000,
                threeYearPrice: 5200,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_2T": {
                name: "云硬盘",
                spec: "通用SSD | 2TB",
                monthlyPrice: 400,
                yearlyPrice: 4000,
                threeYearPrice: 10400,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_SSD_4T": {
                name: "云硬盘",
                spec: "通用SSD | 4TB",
                monthlyPrice: 800,
                yearlyPrice: 8000,
                threeYearPrice: 20800,
                unit: "月",
                storageType: "cloudDisk"
            },
            // 云硬盘 超高IO
            "云硬盘_超高IO_40G": {
                name: "云硬盘",
                spec: "超高IO SSD | 40GB",
                monthlyPrice: 12,
                yearlyPrice: 120,
                threeYearPrice: 312,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_100G": {
                name: "云硬盘",
                spec: "超高IO SSD | 100GB",
                monthlyPrice: 30,
                yearlyPrice: 300,
                threeYearPrice: 780,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_200G": {
                name: "云硬盘",
                spec: "超高IO SSD | 200GB",
                monthlyPrice: 60,
                yearlyPrice: 600,
                threeYearPrice: 1560,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_500G": {
                name: "云硬盘",
                spec: "超高IO SSD | 500GB",
                monthlyPrice: 150,
                yearlyPrice: 1500,
                threeYearPrice: 3900,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_1T": {
                name: "云硬盘",
                spec: "超高IO SSD | 1TB",
                monthlyPrice: 300,
                yearlyPrice: 3000,
                threeYearPrice: 7800,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_2T": {
                name: "云硬盘",
                spec: "超高IO SSD | 2TB",
                monthlyPrice: 600,
                yearlyPrice: 6000,
                threeYearPrice: 15600,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_超高IO_4T": {
                name: "云硬盘",
                spec: "超高IO SSD | 4TB",
                monthlyPrice: 1200,
                yearlyPrice: 12000,
                threeYearPrice: 31200,
                unit: "月",
                storageType: "cloudDisk"
            },
            // 云硬盘 极速SSD
            "云硬盘_极速SSD_40G": {
                name: "云硬盘",
                spec: "极速SSD | 40GB",
                monthlyPrice: 16,
                yearlyPrice: 160,
                threeYearPrice: 416,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_100G": {
                name: "云硬盘",
                spec: "极速SSD | 100GB",
                monthlyPrice: 40,
                yearlyPrice: 400,
                threeYearPrice: 1040,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_200G": {
                name: "云硬盘",
                spec: "极速SSD | 200GB",
                monthlyPrice: 80,
                yearlyPrice: 800,
                threeYearPrice: 2080,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_500G": {
                name: "云硬盘",
                spec: "极速SSD | 500GB",
                monthlyPrice: 200,
                yearlyPrice: 2000,
                threeYearPrice: 5200,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_1T": {
                name: "云硬盘",
                spec: "极速SSD | 1TB",
                monthlyPrice: 400,
                yearlyPrice: 4000,
                threeYearPrice: 10400,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_2T": {
                name: "云硬盘",
                spec: "极速SSD | 2TB",
                monthlyPrice: 800,
                yearlyPrice: 8000,
                threeYearPrice: 20800,
                unit: "月",
                storageType: "cloudDisk"
            },
            "云硬盘_极速SSD_4T": {
                name: "云硬盘",
                spec: "极速SSD | 4TB",
                monthlyPrice: 1600,
                yearlyPrice: 16000,
                threeYearPrice: 41600,
                unit: "月",
                storageType: "cloudDisk"
            },
            // 共享盘
            "共享盘_SATA_100G": {
                name: "共享盘",
                spec: "SATA | 100GB",
                monthlyPrice: 60,
                yearlyPrice: 600,
                threeYearPrice: 1560,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SATA_500G": {
                name: "共享盘",
                spec: "SATA | 500GB",
                monthlyPrice: 280,
                yearlyPrice: 2800,
                threeYearPrice: 7280,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SATA_1T": {
                name: "共享盘",
                spec: "SATA | 1TB",
                monthlyPrice: 520,
                yearlyPrice: 5200,
                threeYearPrice: 13520,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SATA_2T": {
                name: "共享盘",
                spec: "SATA | 2TB",
                monthlyPrice: 980,
                yearlyPrice: 9800,
                threeYearPrice: 25480,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SSD_100G": {
                name: "共享盘",
                spec: "SSD | 100GB",
                monthlyPrice: 120,
                yearlyPrice: 1200,
                threeYearPrice: 3120,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SSD_500G": {
                name: "共享盘",
                spec: "SSD | 500GB",
                monthlyPrice: 520,
                yearlyPrice: 5200,
                threeYearPrice: 13520,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SSD_1T": {
                name: "共享盘",
                spec: "SSD | 1TB",
                monthlyPrice: 980,
                yearlyPrice: 9800,
                threeYearPrice: 25480,
                unit: "月",
                storageType: "sharedDisk"
            },
            "共享盘_SSD_2T": {
                name: "共享盘",
                spec: "SSD | 2TB",
                monthlyPrice: 1800,
                yearlyPrice: 18000,
                threeYearPrice: 46800,
                unit: "月",
                storageType: "sharedDisk"
            },
            // ==================== 对象存储 ZOS ====================
            // 单AZ存储容量包 - 标准存储
            "对象存储_存储包_标准_40G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ标准 | 40GB/月",
                monthlyPrice: 3.6,
                yearlyPrice: 36.72,
                threeYearPrice: 64.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_标准_100G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ标准 | 100GB/月",
                monthlyPrice: 9,
                yearlyPrice: 91.8,
                threeYearPrice: 162,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_标准_1T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ标准 | 1TB/月",
                monthlyPrice: 92.16,
                yearlyPrice: 940.03,
                threeYearPrice: 1658.88,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_标准_50T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ标准 | 50TB/月",
                monthlyPrice: 4608,
                yearlyPrice: 47001.6,
                threeYearPrice: 82944,
                unit: "月",
                storageType: "objectStorage"
            },
            // 单AZ存储容量包 - 低频存储
            "对象存储_存储包_低频_40G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ低频 | 40GB/月",
                monthlyPrice: 2.8,
                yearlyPrice: 28.56,
                threeYearPrice: 50.4,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_低频_100G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ低频 | 100GB/月",
                monthlyPrice: 7,
                yearlyPrice: 71.4,
                threeYearPrice: 126,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_低频_1T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ低频 | 1TB/月",
                monthlyPrice: 71.68,
                yearlyPrice: 731.14,
                threeYearPrice: 1290.24,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_低频_50T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ低频 | 50TB/月",
                monthlyPrice: 3584,
                yearlyPrice: 36556.8,
                threeYearPrice: 64512,
                unit: "月",
                storageType: "objectStorage"
            },
            // 单AZ存储容量包 - 归档存储
            "对象存储_存储包_归档_40G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ归档 | 40GB/月",
                monthlyPrice: 1.2,
                yearlyPrice: 14.4,
                threeYearPrice: 43.2,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_归档_100G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ归档 | 100GB/月",
                monthlyPrice: 3,
                yearlyPrice: 36,
                threeYearPrice: 108,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_归档_1T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ归档 | 1TB/月",
                monthlyPrice: 30.72,
                yearlyPrice: 368.64,
                threeYearPrice: 1105.92,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_归档_50T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 单AZ归档 | 50TB/月",
                monthlyPrice: 1536,
                yearlyPrice: 18432,
                threeYearPrice: 55296,
                unit: "月",
                storageType: "objectStorage"
            },
            // 多AZ存储容量包 - 标准存储
            "对象存储_存储包_多AZ标准_40G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ标准 | 40GB/月",
                monthlyPrice: 4.8,
                yearlyPrice: 48.96,
                threeYearPrice: 86.4,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ标准_100G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ标准 | 100GB/月",
                monthlyPrice: 12,
                yearlyPrice: 122.4,
                threeYearPrice: 216,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ标准_1T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ标准 | 1TB/月",
                monthlyPrice: 122.88,
                yearlyPrice: 1253.38,
                threeYearPrice: 2211.84,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ标准_50T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ标准 | 50TB/月",
                monthlyPrice: 6144,
                yearlyPrice: 62668.8,
                threeYearPrice: 110592,
                unit: "月",
                storageType: "objectStorage"
            },
            // 多AZ存储容量包 - 低频存储
            "对象存储_存储包_多AZ低频_40G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ低频 | 40GB/月",
                monthlyPrice: 3.6,
                yearlyPrice: 36.72,
                threeYearPrice: 64.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ低频_100G": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ低频 | 100GB/月",
                monthlyPrice: 9,
                yearlyPrice: 91.8,
                threeYearPrice: 162,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ低频_1T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ低频 | 1TB/月",
                monthlyPrice: 92.16,
                yearlyPrice: 940.03,
                threeYearPrice: 1658.88,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_存储包_多AZ低频_50T": {
                name: "对象存储 ZOS",
                spec: "存储包 | 多AZ低频 | 50TB/月",
                monthlyPrice: 4608,
                yearlyPrice: 47001.6,
                threeYearPrice: 82944,
                unit: "月",
                storageType: "objectStorage"
            },
            // 公网流出流量包 - 标准
            "对象存储_流量包_标准_50G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 标准 | 50GB/月",
                monthlyPrice: 25,
                yearlyPrice: 255,
                threeYearPrice: 450,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_标准_100G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 标准 | 100GB/月",
                monthlyPrice: 50,
                yearlyPrice: 510,
                threeYearPrice: 900,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_标准_1T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 标准 | 1TB/月",
                monthlyPrice: 512,
                yearlyPrice: 5222.4,
                threeYearPrice: 9216,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_标准_50T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 标准 | 50TB/月",
                monthlyPrice: 25600,
                yearlyPrice: 261120,
                threeYearPrice: 460800,
                unit: "月",
                storageType: "objectStorage"
            },
            // 公网流出流量包 - 低频
            "对象存储_流量包_低频_50G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 低频 | 50GB/月",
                monthlyPrice: 20,
                yearlyPrice: 204,
                threeYearPrice: 360,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_低频_100G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 低频 | 100GB/月",
                monthlyPrice: 40,
                yearlyPrice: 408,
                threeYearPrice: 720,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_低频_1T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 低频 | 1TB/月",
                monthlyPrice: 409.6,
                yearlyPrice: 4177.92,
                threeYearPrice: 7372.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_低频_50T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 低频 | 50TB/月",
                monthlyPrice: 20480,
                yearlyPrice: 208896,
                threeYearPrice: 368640,
                unit: "月",
                storageType: "objectStorage"
            },
            // 公网流出流量包 - 归档
            "对象存储_流量包_归档_50G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 归档 | 50GB/月",
                monthlyPrice: 20,
                yearlyPrice: 204,
                threeYearPrice: 360,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_归档_100G": {
                name: "对象存储 ZOS",
                spec: "流量包 | 归档 | 100GB/月",
                monthlyPrice: 40,
                yearlyPrice: 408,
                threeYearPrice: 720,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_归档_1T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 归档 | 1TB/月",
                monthlyPrice: 409.6,
                yearlyPrice: 4177.92,
                threeYearPrice: 7372.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_流量包_归档_50T": {
                name: "对象存储 ZOS",
                spec: "流量包 | 归档 | 50TB/月",
                monthlyPrice: 20480,
                yearlyPrice: 208896,
                threeYearPrice: 368640,
                unit: "月",
                storageType: "objectStorage"
            },
            // 请求次数包 - 标准
            "对象存储_请求次数_标准_1万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 标准 | 1万次/月",
                monthlyPrice: 0.01,
                yearlyPrice: 0.102,
                threeYearPrice: 0.18,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_标准_5万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 标准 | 5万次/月",
                monthlyPrice: 0.05,
                yearlyPrice: 0.51,
                threeYearPrice: 0.9,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_标准_10万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 标准 | 10万次/月",
                monthlyPrice: 0.1,
                yearlyPrice: 1.02,
                threeYearPrice: 1.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_标准_100万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 标准 | 100万次/月",
                monthlyPrice: 1,
                yearlyPrice: 10.2,
                threeYearPrice: 18,
                unit: "月",
                storageType: "objectStorage"
            },
            // 请求次数包 - 低频
            "对象存储_请求次数_低频_1万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 低频 | 1万次/月",
                monthlyPrice: 0.1,
                yearlyPrice: 1.02,
                threeYearPrice: 1.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_低频_5万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 低频 | 5万次/月",
                monthlyPrice: 0.5,
                yearlyPrice: 5.1,
                threeYearPrice: 9,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_低频_10万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 低频 | 10万次/月",
                monthlyPrice: 1,
                yearlyPrice: 10.2,
                threeYearPrice: 18,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_低频_100万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 低频 | 100万次/月",
                monthlyPrice: 10,
                yearlyPrice: 102,
                threeYearPrice: 180,
                unit: "月",
                storageType: "objectStorage"
            },
            // 请求次数包 - 归档
            "对象存储_请求次数_归档_1万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 归档 | 1万次/月",
                monthlyPrice: 0.1,
                yearlyPrice: 1.02,
                threeYearPrice: 1.8,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_归档_5万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 归档 | 5万次/月",
                monthlyPrice: 0.5,
                yearlyPrice: 5.1,
                threeYearPrice: 9,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_归档_10万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 归档 | 10万次/月",
                monthlyPrice: 1,
                yearlyPrice: 10.2,
                threeYearPrice: 18,
                unit: "月",
                storageType: "objectStorage"
            },
            "对象存储_请求次数_归档_100万": {
                name: "对象存储 ZOS",
                spec: "请求次数包 | 归档 | 100万次/月",
                monthlyPrice: 10,
                yearlyPrice: 102,
                threeYearPrice: 180,
                unit: "月",
                storageType: "objectStorage"
            },
            // 取回流量包 - 低频
            "对象存储_取回流量_低频_1G": {
                name: "对象存储 ZOS",
                spec: "取回流量包 | 低频 | 1GB/月",
                monthlyPrice: 0.03,
                yearlyPrice: 0.306,
                threeYearPrice: 0.54,
                unit: "月",
                storageType: "objectStorage"
            },
            // 取回流量包 - 归档
            "对象存储_取回流量_归档_1G": {
                name: "对象存储 ZOS",
                spec: "取回流量包 | 归档 | 1GB/月",
                monthlyPrice: 0.06,
                yearlyPrice: 0.612,
                threeYearPrice: 1.08,
                unit: "月",
                storageType: "objectStorage"
            }
        }
    },
    
    // ==================== 网络类 ====================
    network: {
        name: "网络资源",
        icon: "🌐",
        products: {
            // 弹性IP EIP（按带宽计费，来源：https://www.ctyun.cn/document/10026753/10027021）
            // 计费公式：0-5Mbps 20元/M/月，5Mbps以上 36元/M/月；年付8.5折，三年付5折
            "弹性IP_5M": {
                name: "弹性IP EIP",
                spec: "5Mbps",
                monthlyPrice: 100,
                yearlyPrice: 1020,
                threeYearPrice: 1800,
                unit: "月"
            },
            "弹性IP_10M": {
                name: "弹性IP EIP",
                spec: "10Mbps",
                monthlyPrice: 280,
                yearlyPrice: 2856,
                threeYearPrice: 5040,
                unit: "月"
            },
            "弹性IP_20M": {
                name: "弹性IP EIP",
                spec: "20Mbps",
                monthlyPrice: 640,
                yearlyPrice: 6528,
                threeYearPrice: 11520,
                unit: "月"
            },
            "弹性IP_50M": {
                name: "弹性IP EIP",
                spec: "50Mbps",
                monthlyPrice: 1720,
                yearlyPrice: 17544,
                threeYearPrice: 30960,
                unit: "月"
            },
            "弹性IP_100M": {
                name: "弹性IP EIP",
                spec: "100Mbps",
                monthlyPrice: 3520,
                yearlyPrice: 35904,
                threeYearPrice: 63360,
                unit: "月"
            },
            "弹性IP_200M": {
                name: "弹性IP EIP",
                spec: "200Mbps",
                monthlyPrice: 7120,
                yearlyPrice: 72624,
                threeYearPrice: 128160,
                unit: "月"
            },
            "弹性IP_500M": {
                name: "弹性IP EIP",
                spec: "500Mbps",
                monthlyPrice: 17920,
                yearlyPrice: 182784,
                threeYearPrice: 322560,
                unit: "月"
            },
            "弹性IP_1000M": {
                name: "弹性IP EIP",
                spec: "1000Mbps",
                monthlyPrice: 35920,
                yearlyPrice: 366384,
                threeYearPrice: 646560,
                unit: "月"
            },
            // 性能保障型负载均衡（包年/包月价格，来源：https://www.ctyun.cn/document/10026756/10032089）
            "负载均衡_标准型I": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 标准型I | 最大连接数5万 | 新建连接数5000 | CPS 5000",
                monthlyPrice: 360,
                yearlyPrice: 3600,
                threeYearPrice: 9360,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_标准型II": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 标准型II | 最大连接数20万 | 新建连接数10000 | CPS 10000",
                monthlyPrice: 720,
                yearlyPrice: 7200,
                threeYearPrice: 18720,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_增强型I": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 增强型I | 最大连接数50万 | 新建连接数30000 | CPS 20000",
                monthlyPrice: 1000,
                yearlyPrice: 10000,
                threeYearPrice: 26000,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_增强型II": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 增强型II | 最大连接数100万 | 新建连接数50000 | CPS 30000",
                monthlyPrice: 1300,
                yearlyPrice: 13000,
                threeYearPrice: 33800,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_高阶型I": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 高阶型I | 最大连接数200万 | 新建连接数100000 | CPS 50000",
                monthlyPrice: 1800,
                yearlyPrice: 18000,
                threeYearPrice: 46800,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_高阶型II": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 高阶型II | 最大连接数500万 | 新建连接数200000 | CPS 100000",
                monthlyPrice: 2500,
                yearlyPrice: 25000,
                threeYearPrice: 65000,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_超强型I": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 超强型I | 最大连接数1000万 | 新建连接数500000 | CPS 200000",
                monthlyPrice: 4500,
                yearlyPrice: 45000,
                threeYearPrice: 117000,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_超强型II": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 超强型II | 最大连接数2000万 | 新建连接数1000000 | CPS 500000",
                monthlyPrice: 10000,
                yearlyPrice: 100000,
                threeYearPrice: 260000,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_超强型II应用型": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 超强型II-应用型 | 最大连接数2000万 | 新建连接数1000000 | CPS 500000",
                monthlyPrice: 13750,
                yearlyPrice: 137500,
                threeYearPrice: 357500,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_超强型III": {
                name: "负载均衡 ELB",
                spec: "性能保障型 | 超强型III | 最大连接数5000万 | 新建连接数2000000 | CPS 1000000",
                monthlyPrice: 20000,
                yearlyPrice: 200000,
                threeYearPrice: 520000,
                unit: "月",
                networkType: "elb"
            },
            "负载均衡_经典型": {
                name: "负载均衡 ELB",
                spec: "经典型 | 免费（需搭配弹性IP）",
                monthlyPrice: 0,
                yearlyPrice: 0,
                threeYearPrice: 0,
                unit: "月",
                networkType: "elb"
            },
            // 公网NAT网关（来源：https://www.ctyun.cn/document/10026759/10033185）
            // 年付8.5折，三年付5折（三年付页面未明确，参照其他产品折扣）
            "NAT网关_小型": {
                name: "NAT网关",
                spec: "小型 | 最大并发连接数1万",
                monthlyPrice: 306,
                yearlyPrice: 3121.2,
                threeYearPrice: 5508,
                unit: "月",
                networkType: "nat"
            },
            "NAT网关_中型": {
                name: "NAT网关",
                spec: "中型 | 最大并发连接数5万",
                monthlyPrice: 586.5,
                yearlyPrice: 5982.3,
                threeYearPrice: 10557,
                unit: "月",
                networkType: "nat"
            },
            "NAT网关_大型": {
                name: "NAT网关",
                spec: "大型 | 最大并发连接数20万",
                monthlyPrice: 1147.5,
                yearlyPrice: 11704.5,
                threeYearPrice: 20655,
                unit: "月",
                networkType: "nat"
            },
            "NAT网关_超大型": {
                name: "NAT网关",
                spec: "超大型 | 最大并发连接数100万",
                monthlyPrice: 2040,
                yearlyPrice: 20808,
                threeYearPrice: 36720,
                unit: "月",
                networkType: "nat"
            }
        }
    },
    
    // ==================== 安全类 ====================
    // 价格来源：https://www.ctyun.cn/document/10076018/10108243（云等保专区）
    security: {
        name: "安全产品",
        icon: "🛡️",
        products: {
            // 主机安全 HSS v2.0（按主机个数计费）
            "主机安全_企业版50": {
                name: "主机安全 HSS",
                spec: "企业版 v2.0 | 50个主机 | 安全概览、资产管理、入侵检测、漏洞扫描、基线管理",
                monthlyPrice: 3000,
                yearlyPrice: 30600,
                threeYearPrice: 54000,
                unit: "月",
                remark: "按主机个数计费，60元/主机/月；包年85折、2年7折、3-5年5折"
            },
            "主机安全_企业版200": {
                name: "主机安全 HSS",
                spec: "企业版 v2.0 | 200个主机",
                monthlyPrice: 12000,
                yearlyPrice: 122400,
                threeYearPrice: 216000,
                unit: "月",
                remark: "按主机个数计费，60元/主机/月；包年85折、2年7折、3-5年5折"
            },
            "主机安全_旗舰版50": {
                name: "主机安全 HSS",
                spec: "旗舰版 v2.0 | 50个主机 | 功能更全面",
                monthlyPrice: 9000,
                yearlyPrice: 91800,
                threeYearPrice: 162000,
                unit: "月",
                remark: "按主机个数计费，180元/主机/月；包年85折、2年7折、3-5年5折"
            },
            "主机安全_旗舰版200": {
                name: "主机安全 HSS",
                spec: "旗舰版 v2.0 | 200个主机",
                monthlyPrice: 36000,
                yearlyPrice: 367200,
                threeYearPrice: 648000,
                unit: "月",
                remark: "按主机个数计费，180元/主机/月；包年85折、2年7折、3-5年5折"
            },
            "主机安全_防篡改版10": {
                name: "主机安全 HSS",
                spec: "网页防篡改版 v2.0 | 10个主机 | 防页面篡改、挂马、暗链等",
                monthlyPrice: 9800,
                yearlyPrice: 99960,
                threeYearPrice: 176400,
                unit: "月",
                remark: "按主机个数计费，980元/主机/月；包年85折、2年7折、3-5年5折"
            },
            // 下一代防火墙 AF v2.0
            "防火墙_1G": {
                name: "防火墙 AF",
                spec: "标准版 v2.0 | 1Gbps防护带宽 | 200,000 PPS",
                monthlyPrice: 1879,
                yearlyPrice: 22546,
                threeYearPrice: 67644,
                unit: "月",
                remark: "1Gbps公网流量峰值处理能力"
            },
            "防火墙_2G": {
                name: "防火墙 AF",
                spec: "高级版 v2.0 | 2Gbps防护带宽 | 400,000 PPS",
                monthlyPrice: 3406,
                yearlyPrice: 40872,
                threeYearPrice: 122616,
                unit: "月",
                remark: "2Gbps公网流量峰值处理能力"
            },
            "防火墙_4G": {
                name: "防火墙 AF",
                spec: "企业版 v2.0 | 4Gbps防护带宽 | 2,500,000 PPS",
                monthlyPrice: 5673,
                yearlyPrice: 68079,
                threeYearPrice: 204237,
                unit: "月",
                remark: "4Gbps公网流量峰值处理能力"
            },
            // Web应用防火墙 WAF v2.0
            "WAF_3000QPS": {
                name: "WAF Web防火墙",
                spec: "SaaS版 标准版 v2.0 | 20域名 | 3000QPS",
                monthlyPrice: 3880,
                yearlyPrice: 39576,
                threeYearPrice: 69840,
                unit: "月",
                remark: "业务请求峰值3000QPS；当前享受8折优惠，包年优惠不同享"
            },
            "WAF_6000QPS": {
                name: "WAF Web防火墙",
                spec: "SaaS版 v2.0 | 40域名 | 6000QPS",
                monthlyPrice: 7760,
                yearlyPrice: 79152,
                threeYearPrice: 139680,
                unit: "月",
                remark: "业务请求峰值6000QPS；当前享受8折优惠"
            },
            "WAF_10000QPS": {
                name: "WAF Web防火墙",
                spec: "独享版 单机版 v2.0 | 100域名 | 10000QPS | 0-1Gbps",
                monthlyPrice: 9457,
                yearlyPrice: 96494,
                threeYearPrice: 170226,
                unit: "月",
                remark: "独享版单节点实例，100域名/IP，支持弹性扩展QPS"
            },
            // 堡垒机 BH v2.0（按资产数计费）
            "堡垒机_10资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 10个资产",
                monthlyPrice: 1020,
                yearlyPrice: 10404,
                threeYearPrice: 18360,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_20资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 20个资产",
                monthlyPrice: 1280,
                yearlyPrice: 13056,
                threeYearPrice: 23040,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_50资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 50个资产",
                monthlyPrice: 2600,
                yearlyPrice: 26520,
                threeYearPrice: 46800,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_100资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 100个资产",
                monthlyPrice: 4600,
                yearlyPrice: 46920,
                threeYearPrice: 82800,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_200资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 200个资产",
                monthlyPrice: 6200,
                yearlyPrice: 63240,
                threeYearPrice: 111600,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_500资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 500个资产",
                monthlyPrice: 9200,
                yearlyPrice: 93840,
                threeYearPrice: 165600,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            "堡垒机_1000资产": {
                name: "堡垒机 BH",
                spec: "v2.0 | 1000个资产",
                monthlyPrice: 14170,
                yearlyPrice: 144534,
                threeYearPrice: 255060,
                unit: "月",
                remark: "包年85折、2年7折、3-5年5折"
            },
            // 日志审计 LAS v2.0（按日志源/资产数计费）
            "日志审计_10源": {
                name: "日志审计 LAS",
                spec: "v2.0 | 10个日志源",
                monthlyPrice: 1107,
                yearlyPrice: 11291,
                threeYearPrice: 16378,
                unit: "月",
                remark: "每个日志源对应一个IP；包年85折、2年75折、3-5年65折"
            },
            "日志审计_20源": {
                name: "日志审计 LAS",
                spec: "v2.0 | 20个日志源",
                monthlyPrice: 1582,
                yearlyPrice: 16136,
                threeYearPrice: 23412,
                unit: "月",
                remark: "包年85折、2年75折、3-5年65折"
            },
            "日志审计_50源": {
                name: "日志审计 LAS",
                spec: "v2.0 | 50个日志源",
                monthlyPrice: 3219,
                yearlyPrice: 32834,
                threeYearPrice: 47641,
                unit: "月",
                remark: "包年85折、2年75折、3-5年65折"
            },
            "日志审计_100源": {
                name: "日志审计 LAS",
                spec: "v2.0 | 100个日志源",
                monthlyPrice: 4599,
                yearlyPrice: 46910,
                threeYearPrice: 68065,
                unit: "月",
                remark: "包年85折、2年75折、3-5年65折"
            },
            // 数据库审计 DAS v2.0（按资产/实例数计费）
            "数据库审计_4实例": {
                name: "数据库审计 DAS",
                spec: "v2.0 | 4个数据库实例",
                monthlyPrice: 3333,
                yearlyPrice: 33330,
                threeYearPrice: 119988,
                unit: "月",
                remark: "包年8.33折"
            },
            "数据库审计_8实例": {
                name: "数据库审计 DAS",
                spec: "v2.0 | 8个数据库实例",
                monthlyPrice: 6250,
                yearlyPrice: 62500,
                threeYearPrice: 225000,
                unit: "月",
                remark: "包年8.33折"
            },
            "数据库审计_16实例": {
                name: "数据库审计 DAS",
                spec: "v2.0 | 16个数据库实例",
                monthlyPrice: 11667,
                yearlyPrice: 116670,
                threeYearPrice: 420012,
                unit: "月",
                remark: "包年8.33折"
            },
            "数据库审计_32实例": {
                name: "数据库审计 DAS",
                spec: "v2.0 | 32个数据库实例",
                monthlyPrice: 22400,
                yearlyPrice: 224000,
                threeYearPrice: 806400,
                unit: "月",
                remark: "包年8.33折"
            }
        }
    },
    
    // ==================== 备份类 ====================
    backup: {
        name: "备份服务",
        icon: "🔄",
        products: {} // CBR按GB计费，由getCBRPrice动态计算
    },
    // ==================== 数据库类 ====================
    database: {
        name: "数据库",
        icon: "🗄️",
        products: {} // 数据库按规格计费，由getMySQLPrice动态计算
    },
    // ==================== GPU类 ====================
    gpu: {
        name: "GPU云主机",
        icon: "🎮",
        products: {} // GPU按规格计费，由getGPUPrice动态计算
    }
};

// MySQL数据库实例系列
const MYSQL_SERIES = [
    { key: "general", name: "通用型", icon: "⚙️", discountYear: 0.65, discount2Year: 0.55, discount3Year: 0.45, remark: "共享计算资源，性价比高" },
    { key: "exclusive", name: "独享型", icon: "💎", discountYear: 0.65, discount2Year: 0.55, discount3Year: 0.45, remark: "独享计算资源，性能稳定" },
    { key: "domestic_exclusive", name: "国产化独享型", icon: "🇨🇳", discountYear: 0.85, discount2Year: 0.7, discount3Year: 0.5, remark: "国产化芯片，独享资源" },
    { key: "domestic_general", name: "国产化通用型", icon: "🇨🇳", discountYear: 0.85, discount2Year: 0.7, discount3Year: 0.5, remark: "国产化芯片，共享资源" }
];

// MySQL数据库实例规格（Ⅱ类型资源池）
const MYSQL_SPECS = {
    // 通用型
    general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 406, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 520, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 805, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1000, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 1575, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 2000, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 2897, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 3768, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 5684, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 7761, remark: "32核128G" }
    ],
    // 独享型
    exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 550, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 700, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 860, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1080, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1390, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 1720, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2160, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 2700, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 3440, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 4320, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 5300, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 6880, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 8616, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 10500, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 13760, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 17280, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 21000, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 27000, remark: "64核512G" }
    ],
    // 国产化独享型
    domestic_exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 693, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 1008, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 1290, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1365, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1859, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 2580, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2730, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 3686, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 5160, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 5460, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 7308, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 10320, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 10917, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 14585, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 20640, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 21834, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 29169, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 38842, remark: "64核512G" }
    ],
    // 国产化通用型
    domestic_general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 654, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 908, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1208, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1500, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2363, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 3000, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 4346, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 5652, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 8526, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 11642, remark: "32核128G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 18307, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 23664, remark: "64核256G" }
    ]
};

// 获取MySQL实例价格
// 数据库实例类型
const DB_INSTANCE_TYPES = [
    { key: "standalone", name: "单机实例", icon: "💻", remark: "基础架构，适用于开发测试" },
    { key: "ha", name: "主备实例", icon: "🔄", remark: "高可用架构，自动故障切换" }
];

// 数据库单机实例规格（Ⅱ类型资源池，MySQL/PostgreSQL共用）
const DB_SINGLE_SPECS = {
    // 通用型
    general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 150, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 185, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 360, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 480, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 730, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 960, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 1620, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 2110, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 3885, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 4940, remark: "32核128G" }
    ],
    // 独享型
    exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 275, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 350, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 430, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 540, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 695, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 860, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 1080, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 1350, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 1720, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 2160, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 2650, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 3440, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 4320, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 5250, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 6880, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 8640, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 10500, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 13500, remark: "64核512G" }
    ],
    // 国产化独享型
    domestic_exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 347, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 633, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 897, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 683, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 930, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 1793, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 1365, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 1844, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 3585, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 2730, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 3654, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 7170, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 5459, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 7293, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 20640, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 10917, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 14586, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 28680, remark: "64核512G" }
    ],
    // 国产化通用型
    domestic_general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 275, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 375, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 548, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 720, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 1097, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 1440, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 2250, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 3143, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 4524, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 6282, remark: "32核128G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 17540, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 23558, remark: "64核256G" }
    ]
};

// 获取数据库实例价格（通用函数，支持MySQL/PostgreSQL的单机和主备）
function getDBPrice(dbType, instanceType, seriesKey, specKey) {
    const series = (dbType === 'postgresql' ? PG_SERIES : MYSQL_SERIES).find(s => s.key === seriesKey);
    if (!series) return null;
    
    const specs = instanceType === 'standalone' 
        ? DB_SINGLE_SPECS[seriesKey] 
        : (dbType === 'postgresql' ? PG_SPECS[seriesKey] : MYSQL_SPECS[seriesKey]);
    if (!specs) return null;
    
    const spec = specs.find(s => s.key === specKey);
    if (!spec) return null;
    
    const monthlyPrice = spec.monthlyPrice;
    const yearlyPrice = Math.round(monthlyPrice * 12 * series.discountYear);
    const threeYearPrice = Math.round(monthlyPrice * 12 * series.discount3Year * 3);
    
    const dbTypeName = dbType === 'postgresql' ? 'PostgreSQL' : 'MySQL';
    const instanceTypeName = instanceType === 'standalone' ? '单机' : '主备';
    
    return {
        name: `关系数据库 ${dbTypeName}`,
        spec: `${instanceTypeName} | ${series.name} | ${spec.cpu}核${spec.memory}G`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: threeYearPrice,
        unit: "月",
        remark: series.remark
    };
}

function getMySQLPrice(seriesKey, specKey) {
    const series = MYSQL_SERIES.find(s => s.key === seriesKey);
    if (!series) return null;
    const specs = MYSQL_SPECS[seriesKey];
    if (!specs) return null;
    const spec = specs.find(s => s.key === specKey);
    if (!spec) return null;
    
    const monthlyPrice = spec.monthlyPrice;
    const yearlyPrice = Math.round(monthlyPrice * 12 * series.discountYear);
    const threeYearPrice = Math.round(monthlyPrice * 12 * series.discount3Year * 3);
    
    return {
        name: "关系数据库 MySQL",
        spec: `主备 | ${series.name} | ${spec.cpu}核${spec.memory}G`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: threeYearPrice,
        unit: "月",
        remark: series.remark
    };
}

// PostgreSQL数据库实例系列（折扣与MySQL相同）
const PG_SERIES = [
    { key: "general", name: "通用型", icon: "⚙️", discountYear: 0.65, discount2Year: 0.55, discount3Year: 0.45, remark: "共享计算资源，性价比高" },
    { key: "exclusive", name: "独享型", icon: "💎", discountYear: 0.65, discount2Year: 0.55, discount3Year: 0.45, remark: "独享计算资源，性能稳定" },
    { key: "domestic_exclusive", name: "国产化独享型", icon: "🇨🇳", discountYear: 0.85, discount2Year: 0.7, discount3Year: 0.5, remark: "国产化芯片，独享资源" },
    { key: "domestic_general", name: "国产化通用型", icon: "🇨🇳", discountYear: 0.85, discount2Year: 0.7, discount3Year: 0.5, remark: "国产化芯片，共享资源" }
];

// PostgreSQL数据库实例规格（Ⅱ类型资源池 - 主备实例）
const PG_SPECS = {
    // 通用型
    general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 406, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 520, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 805, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1000, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 1575, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 2000, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 2897, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 3768, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 5684, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 7761, remark: "32核128G" }
    ],
    // 独享型（含大规格96/128/192核）
    exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 550, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 700, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 860, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1080, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1390, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 1720, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2160, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 2700, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 3440, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 4320, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 5300, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 6880, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 8616, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 10500, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 13760, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 17280, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 21000, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 27000, remark: "64核512G" },
        { key: "96c192g", cpu: 96, memory: 192, monthlyPrice: 23195, remark: "96核192G" },
        { key: "96c384g", cpu: 96, memory: 384, monthlyPrice: 31343, remark: "96核384G" },
        { key: "96c768g", cpu: 96, memory: 768, monthlyPrice: 40716, remark: "96核768G" },
        { key: "128c256g", cpu: 128, memory: 256, monthlyPrice: 32565, remark: "128核256G" },
        { key: "128c512g", cpu: 128, memory: 512, monthlyPrice: 40765, remark: "128核512G" },
        { key: "128c1024g", cpu: 128, memory: 1024, monthlyPrice: 54000, remark: "128核1024G" },
        { key: "192c384g", cpu: 192, memory: 384, monthlyPrice: 46389, remark: "192核384G" },
        { key: "192c768g", cpu: 192, memory: 768, monthlyPrice: 61150, remark: "192核768G" },
        { key: "192c1536g", cpu: 192, memory: 1536, monthlyPrice: 91853, remark: "192核1536G" }
    ],
    // 国产化独享型
    domestic_exclusive: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 693, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 1008, remark: "2核8G" },
        { key: "2c16g", cpu: 2, memory: 16, monthlyPrice: 1290, remark: "2核16G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1365, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1859, remark: "4核16G" },
        { key: "4c32g", cpu: 4, memory: 32, monthlyPrice: 2580, remark: "4核32G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2730, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 3686, remark: "8核32G" },
        { key: "8c64g", cpu: 8, memory: 64, monthlyPrice: 5160, remark: "8核64G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 5460, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 7308, remark: "16核64G" },
        { key: "16c128g", cpu: 16, memory: 128, monthlyPrice: 10320, remark: "16核128G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 10917, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 14585, remark: "32核128G" },
        { key: "32c256g", cpu: 32, memory: 256, monthlyPrice: 20640, remark: "32核256G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 21834, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 29169, remark: "64核256G" },
        { key: "64c512g", cpu: 64, memory: 512, monthlyPrice: 38842, remark: "64核512G" }
    ],
    // 国产化通用型
    domestic_general: [
        { key: "2c4g", cpu: 2, memory: 4, monthlyPrice: 654, remark: "2核4G" },
        { key: "2c8g", cpu: 2, memory: 8, monthlyPrice: 908, remark: "2核8G" },
        { key: "4c8g", cpu: 4, memory: 8, monthlyPrice: 1208, remark: "4核8G" },
        { key: "4c16g", cpu: 4, memory: 16, monthlyPrice: 1500, remark: "4核16G" },
        { key: "8c16g", cpu: 8, memory: 16, monthlyPrice: 2363, remark: "8核16G" },
        { key: "8c32g", cpu: 8, memory: 32, monthlyPrice: 3000, remark: "8核32G" },
        { key: "16c32g", cpu: 16, memory: 32, monthlyPrice: 4346, remark: "16核32G" },
        { key: "16c64g", cpu: 16, memory: 64, monthlyPrice: 5652, remark: "16核64G" },
        { key: "32c64g", cpu: 32, memory: 64, monthlyPrice: 8526, remark: "32核64G" },
        { key: "32c128g", cpu: 32, memory: 128, monthlyPrice: 11642, remark: "32核128G" },
        { key: "64c128g", cpu: 64, memory: 128, monthlyPrice: 18307, remark: "64核128G" },
        { key: "64c256g", cpu: 64, memory: 256, monthlyPrice: 23664, remark: "64核256G" }
    ]
};

// 获取PostgreSQL实例价格
function getPGPrice(seriesKey, specKey) {
    const series = PG_SERIES.find(s => s.key === seriesKey);
    if (!series) return null;
    const specs = PG_SPECS[seriesKey];
    if (!specs) return null;
    const spec = specs.find(s => s.key === specKey);
    if (!spec) return null;
    
    const monthlyPrice = spec.monthlyPrice;
    const yearlyPrice = Math.round(monthlyPrice * 12 * series.discountYear);
    const threeYearPrice = Math.round(monthlyPrice * 12 * series.discount3Year * 3);
    
    return {
        name: "关系数据库 PostgreSQL",
        spec: `主备 | ${series.name} | ${spec.cpu}核${spec.memory}G`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: threeYearPrice,
        unit: "月",
        remark: series.remark
    };
}

// 云服务备份(CBR)存储库类型
const CBR_TYPES = [
    { key: "ecs", name: "云主机备份存储库", icon: "🖥️", pricePerGBMonth: 0.2, pricePerGBYear: 2.04, pricePerGB3Year: 3.6, remark: "备份云主机整机数据" },
    { key: "evs", name: "云硬盘备份存储库", icon: "💿", pricePerGBMonth: 0.1, pricePerGBYear: 1.02, pricePerGB3Year: 1.8, remark: "备份云硬盘数据" },
    { key: "sfs", name: "SFS Turbo备份存储库", icon: "📂", pricePerGBMonth: 0.35, pricePerGBYear: 3.57, pricePerGB3Year: 6.3, remark: "备份SFS Turbo文件系统" },
    { key: "db", name: "数据库服务器备份存储库", icon: "🗄️", pricePerGBMonth: 0.4, pricePerGBYear: 4.08, pricePerGB3Year: 7.2, remark: "备份数据库服务器" },
    { key: "hybrid", name: "混合云备份存储库", icon: "☁️", pricePerGBMonth: 0.35, pricePerGBYear: 3.486, pricePerGB3Year: 6.3, remark: "本地数据中心上云备份" },
    { key: "ecs_maz", name: "云主机备份多AZ存储库", icon: "🖥️🔄", pricePerGBMonth: 0.3, pricePerGBYear: 3, pricePerGB3Year: 5.4, remark: "跨可用区冗余备份，可靠性更高" },
    { key: "sfs_maz", name: "SFS Turbo备份多AZ存储库", icon: "📂🔄", pricePerGBMonth: 0.39, pricePerGBYear: 3.88, pricePerGB3Year: 7.02, remark: "跨可用区冗余备份" },
    { key: "db_maz", name: "数据库服务器备份多AZ存储库", icon: "🗄️🔄", pricePerGBMonth: 0.44, pricePerGBYear: 4.38, pricePerGB3Year: 7.92, remark: "跨可用区冗余备份" },
    { key: "hybrid_maz", name: "混合云备份多AZ存储库", icon: "☁️🔄", pricePerGBMonth: 0.39, pricePerGBYear: 3.88, pricePerGB3Year: 7.02, remark: "跨可用区冗余备份" }
];

// 获取CBR备份价格（按容量GB计算）
function getCBRPrice(typeKey, capacityGB) {
    const cbrType = CBR_TYPES.find(t => t.key === typeKey);
    if (!cbrType || !capacityGB || capacityGB <= 0) return null;
    const monthlyPrice = Math.round(cbrType.pricePerGBMonth * capacityGB * 100) / 100;
    const yearlyPrice = Math.round(cbrType.pricePerGBYear * capacityGB * 100) / 100;
    const threeYearPrice = Math.round(cbrType.pricePerGB3Year * capacityGB * 100) / 100;
    return {
        name: "云服务备份 CBR",
        spec: `${cbrType.name} | ${capacityGB}GB`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: threeYearPrice,
        unit: "月",
        remark: cbrType.remark
    };
}

// 获取所有分类
function getCategories() {
    return Object.keys(PRICE_DATA).map(key => ({
        id: key,
        name: PRICE_DATA[key].name,
        icon: PRICE_DATA[key].icon
    }));
}

// 获取某分类下的所有产品
function getProductsByCategory(categoryId) {
    const category = PRICE_DATA[categoryId];
    if (!category) return [];
    return Object.keys(category.products).map(key => ({
        key: key,
        ...category.products[key]
    }));
}

// 获取产品详情
function getProductDetail(categoryId, productKey) {
    const category = PRICE_DATA[categoryId];
    if (!category) return null;
    return category.products[productKey] || null;
}

// 获取分类名称
function getCategoryName(categoryId) {
    return PRICE_DATA[categoryId]?.name || '';
}

// 云硬盘类型和容量选项（用于下拉选择）
const CLOUD_DISK_TYPES = [
    { key: "SATA", name: "SATA（普通盘）", icon: "💿", remark: "最大IOPS 500，适用于日志存储、备份等低IO场景" },
    { key: "SSD", name: "通用SSD", icon: "💾", remark: "最大IOPS 3000，适用于Web服务器、数据库等中IO场景" },
    { key: "超高IO", name: "超高IO SSD", icon: "⚡", remark: "最大IOPS 20000，适用于高性能数据库、核心业务系统" },
    { key: "极速SSD", name: "极速SSD", icon: "🚀", remark: "最大IOPS 128000，适用于超高性能数据库、AI计算等极致场景" }
];

const CLOUD_DISK_SIZES = [
    { key: "40GB", name: "40GB" },
    { key: "100GB", name: "100GB" },
    { key: "200GB", name: "200GB" },
    { key: "500GB", name: "500GB" },
    { key: "1TB", name: "1TB" },
    { key: "2TB", name: "2TB" },
    { key: "4TB", name: "4TB" }
];

// 获取云硬盘价格（根据类型和容量）
function getCloudDiskPrice(type, size) {
    const key = `${type}_${size}`;
    return DISK_PRICES[key] || null;
}

// 共享盘类型选项
const SHARED_DISK_TYPES = [
    { key: "SATA", name: "SATA", icon: "💿", remark: "高性价比共享存储，适用于共享文件、日志等" },
    { key: "SSD", name: "SSD", icon: "💾", remark: "高性能共享存储，适用于集群数据库、高可用应用" }
];

const SHARED_DISK_SIZES = [
    { key: "100G", name: "100GB" },
    { key: "500G", name: "500GB" },
    { key: "1T", name: "1TB" },
    { key: "2T", name: "2TB" }
];

// 获取共享盘价格
function getSharedDiskPrice(type, size) {
    const key = `共享盘_${type}_${size}`;
    const product = PRICE_DATA.storage?.products?.[key];
    return product || null;
}

// 对象存储类型选项
const OOS_TYPES = [
    { key: "存储包", name: "存储容量包", icon: "📦" },
    { key: "流量包", name: "公网流出流量包", icon: "📊" },
    { key: "请求次数", name: "请求次数包", icon: "🔢" },
    { key: "取回流量", name: "取回流量包", icon: "🔄" }
];

// 对象存储存储类型
const OOS_STORAGE_CLASSES = [
    { key: "标准", name: "标准存储", icon: "🔵", remark: "低延迟高吞吐，适用于频繁访问的热数据" },
    { key: "低频", name: "低频存储", icon: "🟢", remark: "存储费用低，访问频率低但需快速读取" },
    { key: "归档", name: "归档存储", icon: "🟡", remark: "存储费用最低，适用于长期归档，恢复需数小时" }
];

const OOS_STORAGE_CLASSES_MULTI_AZ = [
    { key: "多AZ标准", name: "多AZ标准存储", icon: "🔵", remark: "跨可用区冗余，适用于高可用标准存储需求" },
    { key: "多AZ低频", name: "多AZ低频存储", icon: "🟢", remark: "跨可用区冗余，适用于高可用低频存储需求" }
];

// 存储包规格
const OOS_STORAGE_PACKAGES = [
    { key: "40G", name: "40GB/月" },
    { key: "100G", name: "100GB/月" },
    { key: "1T", name: "1TB/月" },
    { key: "50T", name: "50TB/月" }
];

// 流量包规格
const OOS_TRAFFIC_PACKAGES = [
    { key: "50G", name: "50GB/月" },
    { key: "100G", name: "100GB/月" },
    { key: "1T", name: "1TB/月" },
    { key: "50T", name: "50TB/月" }
];

// 请求次数包规格
const OOS_REQUEST_PACKAGES = [
    { key: "1万", name: "1万次/月" },
    { key: "5万", name: "5万次/月" },
    { key: "10万", name: "10万次/月" },
    { key: "100万", name: "100万次/月" }
];

// 取回流量包规格
const OOS_RETRIEVAL_PACKAGES = [
    { key: "1G", name: "1GB/月" }
];

// 获取对象存储价格
function getOOSPrice(type, storageClass, size) {
    const key = `对象存储_${type}_${storageClass}_${size}`;
    const product = PRICE_DATA.storage?.products?.[key];
    return product || null;
}

// ==================== 网络资源常量 ====================

// 弹性IP带宽选项
const EIP_BANDWIDTH_OPTIONS = [
    { key: "5M", name: "5Mbps", remark: "适用于管理访问、小型网站" },
    { key: "10M", name: "10Mbps", remark: "适用于中小型Web应用" },
    { key: "20M", name: "20Mbps", remark: "适用于中大型Web应用、API服务" },
    { key: "50M", name: "50Mbps", remark: "适用于大流量业务、视频流媒体" },
    { key: "100M", name: "100Mbps", remark: "适用于高并发业务、下载分发" },
    { key: "200M", name: "200Mbps", remark: "适用于大型业务系统、CDN源站" },
    { key: "500M", name: "500Mbps", remark: "适用于超大流量业务场景" },
    { key: "1000M", name: "1000Mbps", remark: "适用于超大规模业务、专线接入" }
];

// 获取弹性IP价格
function getEIPPrice(bandwidth) {
    const key = `弹性IP_${bandwidth}`;
    const product = PRICE_DATA.network?.products?.[key];
    return product || null;
}

// 负载均衡类型选项
const ELB_TYPES = [
    { key: "经典型", name: "经典型", desc: "免费", icon: "🆓", remark: "免费提供，需搭配弹性IP，适合测试和小流量场景" },
    { key: "标准型I", name: "标准型I", desc: "最大连接数5万", icon: "🔵", remark: "适合中小型Web应用、内部系统" },
    { key: "标准型II", name: "标准型II", desc: "最大连接数20万", icon: "🔵", remark: "适合中大型Web应用、企业OA" },
    { key: "增强型I", name: "增强型I", desc: "最大连接数50万", icon: "🟢", remark: "适合高并发业务、电商平台" },
    { key: "增强型II", name: "增强型II", desc: "最大连接数100万", icon: "🟢", remark: "适合大规模业务、核心交易系统" },
    { key: "高阶型I", name: "高阶型I", desc: "最大连接数200万", icon: "🟡", remark: "适合超高并发场景（需提工单）" },
    { key: "高阶型II", name: "高阶型II", desc: "最大连接数500万", icon: "🟡", remark: "适合金融级业务（需提工单）" },
    { key: "超强型I", name: "超强型I", desc: "最大连接数1000万", icon: "🔴", remark: "适合超大规模业务（需提工单）" },
    { key: "超强型II", name: "超强型II", desc: "最大连接数2000万", icon: "🔴", remark: "适合极致性能场景（需提工单）" },
    { key: "超强型II应用型", name: "超强型II-应用型", desc: "最大连接数2000万（应用型）", icon: "🔴", remark: "HTTP/HTTPS深度优化（需提工单）" },
    { key: "超强型III", name: "超强型III", desc: "最大连接数5000万", icon: "🔴", remark: "顶级规格，海量连接（需提工单）" }
];

// 获取负载均衡价格
function getELBPrice(type) {
    const key = `负载均衡_${type}`;
    const product = PRICE_DATA.network?.products?.[key];
    return product || null;
}

// NAT网关规格选项
const NAT_TYPES = [
    { key: "小型", name: "小型", desc: "最大并发1万", icon: "🔵", remark: "适用于小型业务、开发测试环境" },
    { key: "中型", name: "中型", desc: "最大并发5万", icon: "🟢", remark: "适用于中大型业务、企业办公" },
    { key: "大型", name: "大型", desc: "最大并发20万", icon: "🟡", remark: "适用于高并发业务、大规模应用" },
    { key: "超大型", name: "超大型", desc: "最大并发100万", icon: "🔴", remark: "适用于超大流量业务场景" }
];

// 获取NAT网关价格
function getNATPrice(type) {
    const key = `NAT网关_${type}`;
    const product = PRICE_DATA.network?.products?.[key];
    return product || null;
}

// ==================== 安全产品常量 ====================

// 主机安全版本选项
const HSS_VERSIONS = [
    { key: "企业版", name: "企业版 v2.0", icon: "🟢", unitPrice: 60, yearlyUnitPrice: 612, desc: "安全概览、资产管理、入侵检测、漏洞扫描、基线管理", remark: "按主机个数计费；包年85折、2年7折、3-5年5折" },
    { key: "旗舰版", name: "旗舰版 v2.0", icon: "🟡", unitPrice: 180, yearlyUnitPrice: 1836, desc: "功能更全面", remark: "按主机个数计费；包年85折、2年7折、3-5年5折" },
    { key: "防篡改版", name: "网页防篡改版 v2.0", icon: "🔴", unitPrice: 980, yearlyUnitPrice: 9996, desc: "防页面篡改、挂马、暗链", remark: "按主机个数计费；包年85折、2年7折、3-5年5折" }
];

// 主机安全节点数选项
const HSS_NODE_OPTIONS = [
    { key: "1", name: "1个主机" },
    { key: "10", name: "10个主机" },
    { key: "50", name: "50个主机" },
    { key: "100", name: "100个主机" },
    { key: "200", name: "200个主机" },
    { key: "500", name: "500个主机" }
];

// 获取主机安全价格
function getHSSPrice(version, nodes) {
    const hssVer = HSS_VERSIONS.find(v => v.key === version);
    if (!hssVer) return null;
    const n = parseInt(nodes);
    const monthlyPrice = hssVer.unitPrice * n;
    const yearlyPrice = hssVer.yearlyUnitPrice * n;
    // 包年折扣：1年85折、3年5折
    const threeYearPrice = monthlyPrice * 36 * 0.5;
    return {
        name: "主机安全 HSS",
        spec: `${hssVer.name} | ${n}个主机 | ${hssVer.desc}`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: Math.round(threeYearPrice * 100) / 100,
        unit: "月"
    };
}

// 防火墙规格选项
const AF_SPECS = [
    { key: "1G", name: "标准版 | 1Gbps | 200,000 PPS", icon: "🔵", remark: "1Gbps公网流量峰值处理能力" },
    { key: "2G", name: "高级版 | 2Gbps | 400,000 PPS", icon: "🟢", remark: "2Gbps公网流量峰值处理能力" },
    { key: "4G", name: "企业版 | 4Gbps | 2,500,000 PPS", icon: "🔴", remark: "4Gbps公网流量峰值处理能力" }
];

// 获取防火墙价格
function getAFPrice(spec) {
    const key = `防火墙_${spec}`;
    const product = PRICE_DATA.security?.products?.[key];
    return product || null;
}

// WAF规格选项
const WAF_SPECS = [
    { key: "3000QPS", name: "SaaS标准版 | 20域名 | 3000QPS", icon: "🔵", remark: "业务请求峰值3000QPS；当前8折优惠" },
    { key: "6000QPS", name: "SaaS版 | 40域名 | 6000QPS", icon: "🟢", remark: "业务请求峰值6000QPS；当前8折优惠" },
    { key: "10000QPS", name: "独享版单机版 | 100域名 | 10000QPS", icon: "🔴", remark: "独享单节点实例，支持弹性扩展QPS" }
];

// 获取WAF价格
function getWAFPrice(spec) {
    const key = `WAF_${spec}`;
    const product = PRICE_DATA.security?.products?.[key];
    return product || null;
}

// 堡垒机规格选项
const BH_SPECS = [
    { key: "10资产", name: "10个资产", icon: "🔵", remark: "包年85折、2年7折、3-5年5折" },
    { key: "20资产", name: "20个资产", icon: "🔵", remark: "包年85折、2年7折、3-5年5折" },
    { key: "50资产", name: "50个资产", icon: "🟢", remark: "包年85折、2年7折、3-5年5折" },
    { key: "100资产", name: "100个资产", icon: "🟢", remark: "包年85折、2年7折、3-5年5折" },
    { key: "200资产", name: "200个资产", icon: "🟡", remark: "包年85折、2年7折、3-5年5折" },
    { key: "500资产", name: "500个资产", icon: "🟡", remark: "包年85折、2年7折、3-5年5折" },
    { key: "1000资产", name: "1000个资产", icon: "🔴", remark: "包年85折、2年7折、3-5年5折" }
];

// 获取堡垒机价格
function getBHPrice(spec) {
    const key = `堡垒机_${spec}`;
    const product = PRICE_DATA.security?.products?.[key];
    return product || null;
}

// 日志审计规格选项
const LAS_SPECS = [
    { key: "10源", name: "10个日志源", icon: "🔵", remark: "每个日志源对应一个IP；包年85折、2年75折、3-5年65折" },
    { key: "20源", name: "20个日志源", icon: "🔵", remark: "包年85折、2年75折、3-5年65折" },
    { key: "50源", name: "50个日志源", icon: "🟢", remark: "包年85折、2年75折、3-5年65折" },
    { key: "100源", name: "100个日志源", icon: "🟡", remark: "包年85折、2年75折、3-5年65折" }
];

// 获取日志审计价格
function getLASPrice(spec) {
    const key = `日志审计_${spec}`;
    const product = PRICE_DATA.security?.products?.[key];
    return product || null;
}

// 数据库审计规格选项
const DAS_SPECS = [
    { key: "4实例", name: "4个数据库实例", icon: "🔵", remark: "包年8.33折" },
    { key: "8实例", name: "8个数据库实例", icon: "🟢", remark: "包年8.33折" },
    { key: "16实例", name: "16个数据库实例", icon: "🟡", remark: "包年8.33折" },
    { key: "32实例", name: "32个数据库实例", icon: "🔴", remark: "包年8.33折" }
];

// 获取数据库审计价格
function getDASPrice(spec) {
    const key = `数据库审计_${spec}`;
    const product = PRICE_DATA.security?.products?.[key];
    return product || null;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PRICE_DATA, 
        getCategories, 
        getProductsByCategory, 
        getProductDetail, 
        getCategoryName,
        getDiskPrice,
        SYSTEM_DISK_SIZES,
        DATA_DISK_SIZES,
        DISK_PRICES,
        CLOUD_DISK_TYPES,
        CLOUD_DISK_SIZES,
        getCloudDiskPrice,
        SHARED_DISK_TYPES,
        SHARED_DISK_SIZES,
        getSharedDiskPrice,
        OOS_TYPES,
        OOS_STORAGE_CLASSES,
        OOS_STORAGE_CLASSES_MULTI_AZ,
        OOS_STORAGE_PACKAGES,
        OOS_TRAFFIC_PACKAGES,
        OOS_REQUEST_PACKAGES,
        OOS_RETRIEVAL_PACKAGES,
        getOOSPrice,
        EIP_BANDWIDTH_OPTIONS,
        getEIPPrice,
        ELB_TYPES,
        getELBPrice,
        NAT_TYPES,
        getNATPrice,
        HSS_VERSIONS,
        HSS_NODE_OPTIONS,
        getHSSPrice,
        AF_SPECS,
        getAFPrice,
        WAF_SPECS,
        getWAFPrice,
        BH_SPECS,
        getBHPrice,
        LAS_SPECS,
        getLASPrice,
        DAS_SPECS,
        getDASPrice,
        CBR_TYPES,
        getCBRPrice,
        MYSQL_SERIES,
        MYSQL_SPECS,
        getMySQLPrice,
        PG_SERIES,
        PG_SPECS,
        getPGPrice,
        DB_INSTANCE_TYPES,
        DB_SINGLE_SPECS,
        getDBPrice
    };
}
