// GPU云主机数据 - 价格来源：https://www.ctyun.cn/document/10029787/10047957

// GPU系列分类
const GPU_SERIES = [
    { key: "nvidia_compute", name: "NVIDIA计算加速型", icon: "🟢", discountYear: 0.85, discount2Year: 0.70, discount3Year: 0.50, remark: "1年85折、2年7折、3年5折" },
    { key: "nvidia_image", name: "NVIDIA图像加速型", icon: "🟡", discountYear: 0.85, discount2Year: 0.70, discount3Year: 0.50, remark: "1年85折、2年7折、3年5折" },
    { key: "domestic", name: "国产计算加速型", icon: "🔵", discountYear: 0.85, discount2Year: 0.85, discount3Year: 0.85, remark: "1-3年85折" },
    { key: "other", name: "其他计算加速型", icon: "⚪", discountYear: 1.0, discount2Year: 1.0, discount3Year: 1.0, remark: "无包年折扣" }
];

// GPU规格族
const GPU_SPECS_FAMILY = {
    pi7: { name: "A10计算加速型 PI7", icon: "🎯", series: "nvidia_compute", gpuModel: "A10", remark: "深度学习推理、图形渲染" },
    p8a: { name: "A100计算加速型 P8A", icon: "💎", series: "nvidia_compute", gpuModel: "A100", remark: "大规模深度学习训练" },
    p2v: { name: "V100计算加速型 P2V", icon: "🚀", series: "nvidia_compute", gpuModel: "V100", remark: "深度学习训练、科学计算" },
    p2vs: { name: "V100S计算加速型 P2VS", icon: "⚡", series: "nvidia_compute", gpuModel: "V100S", remark: "V100升级版" },
    pi2: { name: "T4计算加速型 PI2", icon: "🎮", series: "nvidia_compute", gpuModel: "T4", remark: "深度学习推理、视频处理" },
    g7: { name: "A10图像加速型 G7", icon: "🖼️", series: "nvidia_image", gpuModel: "A10", remark: "图形渲染、云游戏" },
    g6: { name: "T4图像加速型 G6", icon: "🎨", series: "nvidia_image", gpuModel: "T4", remark: "轻量级图形渲染" },
    g5: { name: "V100图像加速型 G5", icon: "🖥️", series: "nvidia_image", gpuModel: "V100", remark: "图形渲染、云游戏" },
    g5s: { name: "V100S图像加速型 G5S", icon: "✨", series: "nvidia_image", gpuModel: "V100S", remark: "V100S图形渲染" },
    pak1: { name: "昇腾计算加速型 PAK1", icon: "🇨🇳", series: "domestic", gpuModel: "Atlas 300i pro", remark: "国产AI推理加速" },
    pak2: { name: "昇腾计算加速型 PAK2", icon: "🇨🇳", series: "domestic", gpuModel: "Atlas 300I Duo", remark: "国产双芯加速" },
    pak3: { name: "昇腾计算加速型 PAK3", icon: "🇨🇳", series: "domestic", gpuModel: "Ascend 910B", remark: "国产高性能AI训练" },
    pch1: { name: "寒武纪计算加速型 PCH1", icon: "🇨🇳", series: "domestic", gpuModel: "MLU370 s4", remark: "国产AI加速" },
    pn8i: { name: "L20计算加速型 PN8I", icon: "🔥", series: "other", gpuModel: "L20", remark: "高性价比推理" },
    pn8s: { name: "L40S计算加速型 PN8S", icon: "⭐", series: "other", gpuModel: "L40S", remark: "高性能训练推理" },
    pn8r: { name: "GPU计算加速型 PN8R", icon: "💰", series: "other", gpuModel: "NVIDIA", remark: "高性价比GPU" }
};

// GPU规格详情（包月价格）
const GPU_INSTANCES = [
    // A10 PI7
    { key: "pi7.4xlarge.4", family: "pi7", name: "PI7.4xlarge.4", vcpu: 16, memory: 64, gpu: 1, vram: 24, price: 4447.43 },
    { key: "pi7.8xlarge.4", family: "pi7", name: "PI7.8xlarge.4", vcpu: 32, memory: 128, gpu: 2, vram: 48, price: 8894.85 },
    { key: "pi7.16xlarge.4", family: "pi7", name: "PI7.16xlarge.4", vcpu: 64, memory: 256, gpu: 4, vram: 96, price: 17789.69 },
    // A100 P8A
    { key: "p8a.6xlarge.4", family: "p8a", name: "P8A.6xlarge.4", vcpu: 24, memory: 96, gpu: 1, vram: 40, price: 10229.09 },
    { key: "p8a.12xlarge.4", family: "p8a", name: "P8A.12xlarge.4", vcpu: 48, memory: 192, gpu: 2, vram: 80, price: 20458.17 },
    { key: "p8a.24xlarge.4", family: "p8a", name: "P8A.24xlarge.4", vcpu: 96, memory: 384, gpu: 4, vram: 160, price: 40916.34 },
    // V100 P2V
    { key: "p2v.2xlarge.4", family: "p2v", name: "P2V.2xlarge.4", vcpu: 8, memory: 32, gpu: 1, vram: 32, price: 7377.80 },
    { key: "p2v.4xlarge.4", family: "p2v", name: "P2V.4xlarge.4", vcpu: 16, memory: 64, gpu: 2, vram: 64, price: 14755.60 },
    { key: "p2v.8xlarge.4", family: "p2v", name: "P2V.8xlarge.4", vcpu: 32, memory: 128, gpu: 4, vram: 128, price: 29511.20 },
    { key: "p2v.4xlarge.8", family: "p2v", name: "P2V.4xlarge.8", vcpu: 16, memory: 128, gpu: 1, vram: 32, price: 15780 },
    { key: "p2v.8xlarge.8", family: "p2v", name: "P2V.8xlarge.8", vcpu: 32, memory: 256, gpu: 2, vram: 64, price: 31559 },
    // V100S P2VS
    { key: "p2vs.2xlarge.4", family: "p2vs", name: "P2VS.2xlarge.4", vcpu: 8, memory: 32, gpu: 1, vram: 32, price: 7377.80 },
    { key: "p2vs.4xlarge.4", family: "p2vs", name: "P2VS.4xlarge.4", vcpu: 16, memory: 64, gpu: 2, vram: 64, price: 14755.60 },
    { key: "p2vs.8xlarge.4", family: "p2vs", name: "P2VS.8xlarge.4", vcpu: 32, memory: 128, gpu: 4, vram: 128, price: 29511.20 },
    { key: "p2vs.4xlarge.8", family: "p2vs", name: "P2VS.4xlarge.8", vcpu: 16, memory: 128, gpu: 1, vram: 32, price: 15780 },
    { key: "p2vs.8xlarge.8", family: "p2vs", name: "P2VS.8xlarge.8", vcpu: 32, memory: 256, gpu: 2, vram: 64, price: 31559 },
    // T4 PI2
    { key: "pi2.2xlarge.4", family: "pi2", name: "PI2.2xlarge.4", vcpu: 8, memory: 32, gpu: 1, vram: 16, price: 3515 },
    { key: "pi2.4xlarge.4", family: "pi2", name: "PI2.4xlarge.4", vcpu: 16, memory: 64, gpu: 2, vram: 32, price: 7030 },
    { key: "pi2.8xlarge.4", family: "pi2", name: "PI2.8xlarge.4", vcpu: 32, memory: 128, gpu: 4, vram: 64, price: 14060 },
    // A10 G7
    { key: "g7.2xlarge.4", family: "g7", name: "G7.2xlarge.4", vcpu: 8, memory: 32, gpu: "1/4", vram: 6, price: 2033.34 },
    { key: "g7.4xlarge.4", family: "g7", name: "G7.4xlarge.4", vcpu: 16, memory: 64, gpu: "1/2", vram: 12, price: 4066.68 },
    { key: "g7.8xlarge.4", family: "g7", name: "G7.8xlarge.4", vcpu: 32, memory: 128, gpu: 1, vram: 24, price: 8133.36 },
    // T4 G6
    { key: "g6.xlarge.4", family: "g6", name: "G6.xlarge.4", vcpu: 4, memory: 16, gpu: "1/4", vram: 4, price: 1173.65 },
    { key: "g6.2xlarge.4", family: "g6", name: "G6.2xlarge.4", vcpu: 8, memory: 32, gpu: "1/2", vram: 8, price: 2425.56 },
    // V100 G5
    { key: "g5.2xlarge.2.1", family: "g5", name: "G5.2xlarge.2.1", vcpu: 8, memory: 16, gpu: "1/16", vram: 2, price: 1316 },
    { key: "g5.2xlarge.2", family: "g5", name: "G5.2xlarge.2", vcpu: 8, memory: 32, gpu: "1/8", vram: 4, price: 2632 },
    { key: "g5.4xlarge.4", family: "g5", name: "G5.4xlarge.4", vcpu: 16, memory: 64, gpu: "1/4", vram: 8, price: 5263 },
    { key: "g5.2xlarge.8", family: "g5", name: "G5.2xlarge.8", vcpu: 8, memory: 64, gpu: "1/2", vram: 16, price: 7890 },
    { key: "g5.8xlarge.4", family: "g5", name: "G5.8xlarge.4", vcpu: 32, memory: 128, gpu: "1/2", vram: 16, price: 10527 },
    // V100S G5S
    { key: "g5s.2xlarge.2.1", family: "g5s", name: "G5S.2xlarge.2.1", vcpu: 8, memory: 16, gpu: "1/16", vram: 2, price: 1316 },
    { key: "g5s.2xlarge.2", family: "g5s", name: "G5S.2xlarge.2", vcpu: 8, memory: 32, gpu: "1/8", vram: 4, price: 2632 },
    { key: "g5s.4xlarge.4", family: "g5s", name: "G5S.4xlarge.4", vcpu: 16, memory: 64, gpu: "1/4", vram: 8, price: 5263 },
    { key: "g5s.2xlarge.8", family: "g5s", name: "G5S.2xlarge.8", vcpu: 8, memory: 64, gpu: "1/2", vram: 16, price: 7890 },
    { key: "g5s.8xlarge.4", family: "g5s", name: "G5S.8xlarge.4", vcpu: 32, memory: 128, gpu: "1/2", vram: 16, price: 10527 },
    // 昇腾 PAK1
    { key: "pak1.4xlarge.4", family: "pak1", name: "PAK1.4xlarge.4", vcpu: 18, memory: 72, gpu: 1, vram: 24, price: 5133.49 },
    { key: "pak1.9xlarge.4", family: "pak1", name: "PAK1.9xlarge.4", vcpu: 36, memory: 144, gpu: 2, vram: 48, price: 10266.97 },
    { key: "pak1.18xlarge.4", family: "pak1", name: "PAK1.18xlarge.4", vcpu: 72, memory: 288, gpu: 4, vram: 96, price: 20533.95 },
    // 昇腾 PAK2
    { key: "pak2.4xlarge.8", family: "pak2", name: "PAK2.4xlarge.8", vcpu: 16, memory: 128, gpu: 1, vram: 96, price: 6525 },
    { key: "pak2.4xlarge.9", family: "pak2", name: "PAK2.4xlarge.9", vcpu: 16, memory: 144, gpu: 1, vram: 96, price: 6765 },
    // 昇腾 PAK3
    { key: "pak3.4xlarge.8", family: "pak3", name: "PAK3.4xlarge.8", vcpu: 16, memory: 128, gpu: 1, vram: 64, price: 18454 },
    // 寒武纪 PCH1
    { key: "pch1.4xlarge.4", family: "pch1", name: "PCH1.4xlarge.4", vcpu: 16, memory: 64, gpu: 1, vram: 24, price: 6241.02 },
    { key: "pch1.6xlarge.4", family: "pch1", name: "PCH1.6xlarge.4", vcpu: 24, memory: 96, gpu: 1, vram: 24, price: 6934.46 },
    { key: "pch1.9xlarge.4", family: "pch1", name: "PCH1.9xlarge.4", vcpu: 36, memory: 144, gpu: 2, vram: 48, price: 12482.04 },
    { key: "pch1.12xlarge.4", family: "pch1", name: "PCH1.12xlarge.4", vcpu: 48, memory: 192, gpu: 3, vram: 72, price: 18723.05 },
    { key: "pch1.21xlarge.3", family: "pch1", name: "PCH1.21xlarge.3", vcpu: 84, memory: 252, gpu: 4, vram: 96, price: 24964.07 },
    // L20 PN8I
    { key: "pn8i.4xlarge.8", family: "pn8i", name: "PN8I.4xlarge.8", vcpu: 16, memory: 128, gpu: 1, vram: 48, price: 7545 },
    { key: "pn8i.8xlarge.8", family: "pn8i", name: "PN8I.8xlarge.8", vcpu: 32, memory: 256, gpu: 2, vram: 96, price: 15090 },
    { key: "pn8i.16xlarge.8", family: "pn8i", name: "PN8I.16xlarge.8", vcpu: 64, memory: 512, gpu: 4, vram: 192, price: 30180 },
    { key: "pn8i.32xlarge.8", family: "pn8i", name: "PN8I.32xlarge.8", vcpu: 128, memory: 1024, gpu: 8, vram: 384, price: 60361 },
    { key: "pn8i.43xlarge.8", family: "pn8i", name: "PN8I.43xlarge.8", vcpu: 172, memory: 1336, gpu: 8, vram: 384, price: 65698 },
    // L40S PN8S
    { key: "pn8s.5xlarge.4", family: "pn8s", name: "PN8S.5xlarge.4", vcpu: 20, memory: 74, gpu: 1, vram: 48, price: 15012 },
    { key: "pn8s.11xlarge.4", family: "pn8s", name: "PN8S.11xlarge.4", vcpu: 44, memory: 148, gpu: 2, vram: 96, price: 30024 },
    { key: "pn8s.22xlarge.4", family: "pn8s", name: "PN8S.22xlarge.4", vcpu: 88, memory: 296, gpu: 4, vram: 192, price: 60047 },
    { key: "pn8s.44xlarge.4", family: "pn8s", name: "PN8S.44xlarge.4", vcpu: 176, memory: 592, gpu: 8, vram: 384, price: 120095 },
    // PN8R
    { key: "pn8r.4xlarge.4", family: "pn8r", name: "PN8R.4xlarge.4", vcpu: 16, memory: 64, gpu: 1, vram: 24, price: 4211 },
    { key: "pn8r.8xlarge.4", family: "pn8r", name: "PN8R.8xlarge.4", vcpu: 32, memory: 128, gpu: 2, vram: 48, price: 8422 },
    { key: "pn8r.12xlarge.4", family: "pn8r", name: "PN8R.12xlarge.4", vcpu: 48, memory: 192, gpu: 3, vram: 72, price: 12633 },
    { key: "pn8r.16xlarge.4", family: "pn8r", name: "PN8R.16xlarge.4", vcpu: 64, memory: 256, gpu: 4, vram: 96, price: 16844 },
    { key: "pn8r.20xlarge.4", family: "pn8r", name: "PN8R.20xlarge.4", vcpu: 80, memory: 320, gpu: 5, vram: 120, price: 21055 },
    { key: "pn8r.24xlarge.4", family: "pn8r", name: "PN8R.24xlarge.4", vcpu: 96, memory: 384, gpu: 6, vram: 144, price: 25266 },
    { key: "pn8r.28xlarge.4", family: "pn8r", name: "PN8R.28xlarge.4", vcpu: 112, memory: 448, gpu: 7, vram: 168, price: 29477 },
    { key: "pn8r.32xlarge.4", family: "pn8r", name: "PN8R.32xlarge.4", vcpu: 128, memory: 512, gpu: 8, vram: 192, price: 33688 },
    { key: "pn8r.45xlarge.4", family: "pn8r", name: "PN8R.45xlarge.4", vcpu: 180, memory: 824, gpu: 8, vram: 192, price: 40473 }
];

// 获取GPU云主机价格
function getGPUPrice(instanceKey) {
    const instance = GPU_INSTANCES.find(i => i.key === instanceKey);
    if (!instance) return null;

    const family = GPU_SPECS_FAMILY[instance.family];
    if (!family) return null;

    const series = GPU_SERIES.find(s => s.key === family.series);
    if (!series) return null;

    const monthlyPrice = instance.price;
    const yearlyPrice = Math.round(monthlyPrice * 12 * series.discountYear * 100) / 100;
    const threeYearPrice = Math.round(monthlyPrice * 12 * series.discount3Year * 3 * 100) / 100;

    const gpuInfo = typeof instance.gpu === 'number' ? `${instance.gpu}×${family.gpuModel}` : `${instance.gpu} ${family.gpuModel}`;

    return {
        name: "GPU云主机",
        spec: `${family.name} | ${instance.vcpu}核${instance.memory}G | ${gpuInfo} | 显存${instance.vram}GB`,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        threeYearPrice: threeYearPrice,
        unit: "月",
        remark: series.remark
    };
}

// 获取某规格族下的所有实例
function getGPUInstancesByFamily(familyKey) {
    return GPU_INSTANCES.filter(i => i.family === familyKey);
}

// 获取某系列下的所有规格族
function getGPUFamiliesBySeries(seriesKey) {
    return Object.entries(GPU_SPECS_FAMILY)
        .filter(([_, v]) => v.series === seriesKey)
        .map(([k, v]) => ({ key: k, ...v }));
}
