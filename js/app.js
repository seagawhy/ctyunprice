// 天翼云报价工具 - 主应用逻辑
// 支持云主机套餐（云主机+系统盘+数据盘）和独立存储配置

// ==================== 注册码配置 ====================
const LICENSE_CONFIG = {
    // 公众号二维码图片 - 替换为你自己的公众号二维码
    qrCodeUrl: 'images/wechat-qr.jpg',
    // 云函数环境ID
    envId: 'ctyunprice-1gskqexee5ae249e'
};

class CloudQuoteApp {
    constructor() {
        this.quoteList = [];
        this.currentCategory = 'compute';
        this.projectName = '';
        this.date = new Date().toLocaleDateString('zh-CN');
        
        this.init();
    }
    
    init() {
        this.renderCategories();
        this.renderProducts();
        this.renderQuoteList();
        this.bindEvents();
        this.updateDate();
    }
    
    updateDate() {
        document.getElementById('quoteDate').value = this.date;
    }
    
    bindEvents() {
        // 项目名称
        document.getElementById('projectName').addEventListener('input', (e) => {
            this.projectName = e.target.value;
        });
        
        // 清空报价单
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearQuote();
        });
        
        // 导出Excel
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportExcel();
        });
        
        // 计算资源的按钮在renderProducts时绑定
    }
    
    bindStorageEvents() {
        // 云硬盘类型变更
        const cloudDiskType = document.getElementById('cloudDiskTypeSelect');
        if (cloudDiskType) {
            cloudDiskType.addEventListener('change', () => {
                const type = cloudDiskType.value;
                const sizeSelect = document.getElementById('cloudDiskSizeSelect');
                const priceDisplay = document.getElementById('cloudDiskPriceDisplay');
                
                if (!type) {
                    sizeSelect.innerHTML = '<option value="">-- 先选类型 --</option>';
                    sizeSelect.disabled = true;
                    priceDisplay.value = '';
                    return;
                }
                
                // 填充容量选项
                sizeSelect.innerHTML = '<option value="">-- 选择容量 --</option>' +
                    CLOUD_DISK_SIZES.map(s => `<option value="${s.key}">${s.name}</option>`).join('');
                sizeSelect.disabled = false;
            });
            
            // 云硬盘容量变更
            document.getElementById('cloudDiskSizeSelect')?.addEventListener('change', (e) => {
                const type = cloudDiskType.value;
                const size = e.target.value;
                const priceDisplay = document.getElementById('cloudDiskPriceDisplay');
                
                if (!type || !size) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getCloudDiskPrice(type, size);
                if (price) {
                    priceDisplay.value = `¥${price.price}/月 | ¥${price.yearlyPrice}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加云硬盘
            document.getElementById('addCloudDiskBtn')?.addEventListener('click', () => {
                this.addCloudDisk();
            });
        }
        
        // 共享盘类型变更
        const sharedDiskType = document.getElementById('sharedDiskTypeSelect');
        if (sharedDiskType) {
            sharedDiskType.addEventListener('change', () => {
                const type = sharedDiskType.value;
                const size = document.getElementById('sharedDiskSizeSelect')?.value;
                const priceDisplay = document.getElementById('sharedDiskPriceDisplay');
                
                if (!type || !size) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getSharedDiskPrice(type, size);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice}/月 | ¥${price.yearlyPrice}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 共享盘容量变更
            document.getElementById('sharedDiskSizeSelect')?.addEventListener('change', (e) => {
                const type = sharedDiskType.value;
                const size = e.target.value;
                const priceDisplay = document.getElementById('sharedDiskPriceDisplay');
                
                if (!type || !size) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getSharedDiskPrice(type, size);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice}/月 | ¥${price.yearlyPrice}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加共享盘
            document.getElementById('addSharedDiskBtn')?.addEventListener('click', () => {
                this.addSharedDisk();
            });
        }
        
        // 对象存储类型变更
        const oosType = document.getElementById('oosTypeSelect');
        if (oosType) {
            oosType.addEventListener('change', () => {
                const type = oosType.value;
                const classSelect = document.getElementById('oosClassSelect');
                const specSelect = document.getElementById('oosSpecSelect');
                const priceDisplay = document.getElementById('oosPriceDisplay');
                
                if (!type) {
                    classSelect.innerHTML = '<option value="">-- 先选产品类型 --</option>';
                    classSelect.disabled = true;
                    specSelect.innerHTML = '<option value="">-- 先选存储类型 --</option>';
                    specSelect.disabled = true;
                    priceDisplay.value = '';
                    return;
                }
                
                // 根据产品类型显示可选存储类型
                let classes;
                switch(type) {
                    case '存储包': classes = [...OOS_STORAGE_CLASSES, ...OOS_STORAGE_CLASSES_MULTI_AZ]; break;
                    case '流量包': classes = OOS_STORAGE_CLASSES; break;
                    case '请求次数': classes = OOS_STORAGE_CLASSES; break;
                    case '取回流量': classes = [{ key: '低频', name: '低频存储', icon: '🟢' }, { key: '归档', name: '归档存储', icon: '🟡' }]; break;
                    default: classes = [];
                }
                
                classSelect.innerHTML = '<option value="">-- 选择存储类型 --</option>' +
                    classes.map(c => `<option value="${c.key}">${c.icon} ${c.name}</option>`).join('');
                classSelect.disabled = false;
                specSelect.innerHTML = '<option value="">-- 先选存储类型 --</option>';
                specSelect.disabled = true;
                priceDisplay.value = '';
            });
            
            // 对象存储存储类型变更
            document.getElementById('oosClassSelect')?.addEventListener('change', () => {
                const type = oosType.value;
                const storageClass = document.getElementById('oosClassSelect').value;
                const specSelect = document.getElementById('oosSpecSelect');
                const priceDisplay = document.getElementById('oosPriceDisplay');
                
                if (!type || !storageClass) {
                    specSelect.innerHTML = '<option value="">-- 先选存储类型 --</option>';
                    specSelect.disabled = true;
                    priceDisplay.value = '';
                    return;
                }
                
                // 根据产品类型显示规格选项
                let packages;
                switch(type) {
                    case '存储包': packages = OOS_STORAGE_PACKAGES; break;
                    case '流量包': packages = OOS_TRAFFIC_PACKAGES; break;
                    case '请求次数': packages = OOS_REQUEST_PACKAGES; break;
                    case '取回流量': packages = OOS_RETRIEVAL_PACKAGES; break;
                    default: packages = [];
                }
                
                specSelect.innerHTML = '<option value="">-- 选择规格 --</option>' +
                    packages.map(p => `<option value="${p.key}">${p.name}</option>`).join('');
                specSelect.disabled = false;
                priceDisplay.value = '';
            });
            
            // 对象存储规格变更
            document.getElementById('oosSpecSelect')?.addEventListener('change', (e) => {
                const type = oosType.value;
                const storageClass = document.getElementById('oosClassSelect').value;
                const size = e.target.value;
                const priceDisplay = document.getElementById('oosPriceDisplay');
                
                if (!type || !storageClass || !size) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getOOSPrice(type, storageClass, size);
                if (price) {
                    const priceText = price.monthlyPrice > 0 ? `¥${price.monthlyPrice}/月` : `¥${price.yearlyPrice}/年`;
                    priceDisplay.value = priceText;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加对象存储
            document.getElementById('addOOSBtn')?.addEventListener('click', () => {
                this.addOOS();
            });
        }
    }
    
    bindOtherEvents() {
        // 添加其他产品按钮
        const addOtherBtn = document.getElementById('addOtherBtn');
        if (addOtherBtn) {
            addOtherBtn.addEventListener('click', () => {
                this.addOtherProduct();
            });
        }
    }
    
    bindBackupEvents() {
        // CBR存储库类型选择变更 - 显示单价
        const cbrTypeSelect = document.getElementById('cbrTypeSelect');
        const cbrCapacity = document.getElementById('cbrCapacity');
        const cbrPriceDisplay = document.getElementById('cbrPriceDisplay');
        
        const updateCBRPrice = () => {
            const typeKey = cbrTypeSelect?.value;
            const capacityTB = parseFloat(cbrCapacity?.value) || 0;
            const capacityGB = capacityTB * 1024;
            if (!typeKey || capacityGB <= 0) {
                cbrPriceDisplay.value = '--';
                return;
            }
            const cbrType = CBR_TYPES.find(t => t.key === typeKey);
            if (cbrType) {
                const monthly = Math.round(cbrType.pricePerGBMonth * capacityGB * 100) / 100;
                cbrPriceDisplay.value = `¥${monthly.toLocaleString()}/月`;
            }
        };
        
        cbrTypeSelect?.addEventListener('change', updateCBRPrice);
        cbrCapacity?.addEventListener('input', updateCBRPrice);
        
        // 添加CBR按钮
        const addCBRBtn = document.getElementById('addCBRBtn');
        if (addCBRBtn) {
            addCBRBtn.addEventListener('click', () => {
                this.addCBR();
            });
        }
    }
    
    bindDatabaseEvents() {
        // 数据库类型和实例类型选择
        const dbTypeSelect = document.getElementById('dbTypeSelect');
        const dbInstanceTypeSelect = document.getElementById('dbInstanceTypeSelect');
        const dbSeriesSelect = document.getElementById('dbSeriesSelect');
        const dbSpecSelect = document.getElementById('dbSpecSelect');
        const dbPriceDisplay = document.getElementById('dbPriceDisplay');
        
        const getCurrentSeries = () => {
            const dbType = dbTypeSelect?.value || 'mysql';
            return dbType === 'postgresql' ? PG_SERIES : MYSQL_SERIES;
        };
        
        const getCurrentSpecs = () => {
            const dbType = dbTypeSelect?.value || 'mysql';
            const instanceType = dbInstanceTypeSelect?.value || 'ha';
            const seriesKey = dbSeriesSelect?.value;
            if (!seriesKey) return null;
            
            if (instanceType === 'standalone') {
                return DB_SINGLE_SPECS[seriesKey];
            }
            return dbType === 'postgresql' ? PG_SPECS[seriesKey] : MYSQL_SPECS[seriesKey];
        };
        
        const updateSeriesOptions = () => {
            const seriesList = getCurrentSeries();
            dbSeriesSelect.innerHTML = '<option value="">-- 选择系列 --</option>';
            seriesList.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.key;
                opt.textContent = `${s.icon} ${s.name}`;
                dbSeriesSelect.appendChild(opt);
            });
            dbSpecSelect.innerHTML = '<option value="">-- 先选系列 --</option>';
            dbSpecSelect.disabled = true;
            dbPriceDisplay.value = '';
        };
        
        const updateSpecOptions = () => {
            const specs = getCurrentSpecs();
            dbSpecSelect.innerHTML = '<option value="">-- 选择规格 --</option>';
            dbPriceDisplay.value = '';
            
            if (!specs) {
                dbSpecSelect.disabled = true;
                return;
            }
            
            dbSpecSelect.disabled = false;
            specs.forEach(spec => {
                const opt = document.createElement('option');
                opt.value = spec.key;
                opt.textContent = `${spec.cpu}核${spec.memory}G`;
                dbSpecSelect.appendChild(opt);
            });
        };
        
        const updatePrice = () => {
            const dbType = dbTypeSelect?.value || 'mysql';
            const instanceType = dbInstanceTypeSelect?.value || 'ha';
            const seriesKey = dbSeriesSelect?.value;
            const specKey = dbSpecSelect?.value;
            if (!seriesKey || !specKey) {
                dbPriceDisplay.value = '';
                return;
            }
            const price = getDBPrice(dbType, instanceType, seriesKey, specKey);
            if (price) {
                dbPriceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月`;
            }
        };
        
        dbTypeSelect?.addEventListener('change', () => {
            updateSeriesOptions();
        });
        dbInstanceTypeSelect?.addEventListener('change', () => {
            updateSeriesOptions();
        });
        dbSeriesSelect?.addEventListener('change', () => {
            updateSpecOptions();
        });
        dbSpecSelect?.addEventListener('change', updatePrice);
        
        // 添加数据库按钮
        const addDBBtn = document.getElementById('addDBBtn');
        if (addDBBtn) {
            addDBBtn.addEventListener('click', () => {
                this.addDatabase();
            });
        }
    }
    
    renderCategories() {
        const container = document.getElementById('categoryNav');
        const categories = getCategories();
        
        container.innerHTML = `
            <h3>产品分类</h3>
            ${categories.map(cat => `
                <div class="category-item ${cat.id === this.currentCategory ? 'active' : ''}" 
                     data-category="${cat.id}">
                    <span class="icon">${cat.icon}</span>
                    <span>${cat.name}</span>
                    <span class="count" id="count-${cat.id}">${this.getCategoryCount(cat.id)}</span>
                </div>
            `).join('')}
        `;
        
        // 绑定分类切换事件
        container.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                this.switchCategory(item.dataset.category);
            });
        });
    }
    
    getCategoryCount(categoryId) {
        return this.quoteList.filter(item => item.categoryId === categoryId).length;
    }
    
    switchCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // 更新导航高亮
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === categoryId);
        });
        
        // 更新面板标题
        const category = PRICE_DATA[categoryId];
        document.getElementById('currentCategoryTitle').textContent = category.icon + ' ' + category.name;
        
        this.renderProducts();
    }
    
    renderProducts() {
        const products = getProductsByCategory(this.currentCategory);
        const container = document.getElementById('productList');
        
        if (this.currentCategory === 'compute') {
            // 计算资源 - 显示云主机套餐表单
            container.innerHTML = this.renderComputePanel(products);
            this.initComputeForm();
            this.updateComputePrice();
        } else if (this.currentCategory === 'storage') {
            // 存储资源 - 显示云硬盘/共享盘/对象存储
            container.innerHTML = this.renderStoragePanel(products);
            // 渲染后立即绑定存储产品事件
            setTimeout(() => this.bindStorageEvents(), 50);
        } else if (this.currentCategory === 'network') {
            // 网络资源 - 显示弹性IP/负载均衡/NAT网关
            container.innerHTML = this.renderNetworkPanel(products);
            // 渲染后立即绑定网络产品事件
            setTimeout(() => this.bindNetworkEvents(), 50);
        } else if (this.currentCategory === 'security') {
            // 安全产品 - 显示主机安全/防火墙/WAF/堡垒机/日志审计/数据库审计
            container.innerHTML = this.renderSecurityPanel(products);
            // 渲染后立即绑定安全产品事件
            setTimeout(() => this.bindSecurityEvents(), 50);
        } else if (this.currentCategory === 'backup') {
            // 备份服务 - 显示CBR云服务备份
            container.innerHTML = this.renderBackupPanel(products);
            // 渲染后立即绑定备份产品事件
            setTimeout(() => this.bindBackupEvents(), 50);
        } else if (this.currentCategory === 'database') {
            // 数据库 - 显示MySQL等数据库实例
            container.innerHTML = this.renderDatabasePanel(products);
            // 渲染后立即绑定数据库产品事件
            setTimeout(() => this.bindDatabaseEvents(), 50);
        } else if (this.currentCategory === 'gpu') {
            // GPU云主机 - 显示GPU规格选择
            container.innerHTML = this.renderGPUPanel(products);
            // 渲染后立即绑定GPU产品事件
            setTimeout(() => this.bindGPUEvents(), 50);
        } else {
            // 其他分类 - 显示产品列表和添加表单
            container.innerHTML = this.renderOtherPanel(products);
            // 渲染后绑定其他产品事件
            setTimeout(() => this.bindOtherEvents(), 50);
        }
    }
    
    initComputeForm() {
        // 绑定系统盘类型变更
        const sysDiskTypeSelect = document.getElementById('sysDiskTypeSelect');
        const sysDiskSelect = document.getElementById('systemDiskSelect');
        const sysDiskPriceDisplay = document.getElementById('sysDiskPriceDisplay');
        
        const updateSysDiskPrice = () => {
            const type = sysDiskTypeSelect.value;
            const sizeKey = sysDiskSelect.value;
            const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sizeKey);
            
            // 从DISK_PRICES获取实际价格
            const sizeName = sysDisk ? sysDisk.name : '40GB';
            const diskKey = `${type}_${sizeName}`;
            const price = DISK_PRICES[diskKey];
            
            if (price) {
                sysDiskPriceDisplay.value = `¥${price.price}/月`;
            } else {
                sysDiskPriceDisplay.value = '-';
            }
            
            this.updateComputePrice();
        };
        
        sysDiskTypeSelect?.addEventListener('change', updateSysDiskPrice);
        sysDiskSelect?.addEventListener('change', updateSysDiskPrice);
        
        // 绑定数据盘类型和容量变更
        const dataDiskTypeSelect = document.getElementById('dataDiskTypeSelect');
        const dataDiskSelect = document.getElementById('dataDiskSelect');
        const dataDiskPriceDisplay = document.getElementById('dataDiskPriceDisplay');
        
        const updateDataDiskPrice = () => {
            const type = dataDiskTypeSelect.value;
            const sizeKey = dataDiskSelect.value;
            
            if (sizeKey === 'DATA_0') {
                dataDiskPriceDisplay.value = '¥0';
                this.updateComputePrice();
                return;
            }
            
            // 从DATA_DISK_SIZES获取容量名称
            const disk = DATA_DISK_SIZES.find(d => d.key === sizeKey);
            const sizeName = disk ? disk.name : '100GB';
            const diskKey = `${type}_${sizeName}`;
            const price = DISK_PRICES[diskKey];
            
            if (price) {
                dataDiskPriceDisplay.value = `¥${price.price}/月`;
            } else {
                dataDiskPriceDisplay.value = '-';
            }
            
            this.updateComputePrice();
        };
        
        dataDiskTypeSelect?.addEventListener('change', updateDataDiskPrice);
        dataDiskSelect?.addEventListener('change', updateDataDiskPrice);
        
        // 绑定云主机规格变更
        const computeSelect = document.getElementById('computeSelect');
        computeSelect?.addEventListener('change', () => {
            this.updateComputePrice();
        });
        
        // 绑定添加云主机套餐按钮
        const addComputeBtn = document.getElementById('addComputeBtn');
        addComputeBtn?.addEventListener('click', () => {
            this.addComputePackage();
        });
        
        // 强制显示套餐合计 - 延迟确保DOM完全渲染
        setTimeout(() => {
            const el = document.getElementById('totalPriceDisplayWrapper');
            if (el) {
                el.innerHTML = '云主机：¥0 + 系统盘：¥0 + 数据盘：¥0 = <span style="font-size:18px;color:#c41e3a;font-weight:700">¥0/月</span>';
                el.classList.add('compute-total-display');
            }
        }, 100);
    }
    
    renderComputePanel(products) {
        // 按类型分组云主机
        const grouped = {};
        products.forEach(p => {
            let type = '';
            if (p.spec.includes('s8e')) type = '通用型 s8e';
            else if (p.spec.includes('c8')) type = '计算型 c8';
            else if (p.spec.includes('m7')) type = '内存型 m7';
            else if (p.spec.includes('ks2x')) type = '鲲鹏通用型 ks2x';
            else if (p.spec.includes('kc2x')) type = '鲲鹏计算型 kc2x';
            else if (p.spec.includes('km2x')) type = '鲲鹏内存型 km2x';
            else if (p.spec.includes('hs3x')) type = '海光通用型 hs3x';
            else if (p.spec.includes('hc3x')) type = '海光计算型 hc3x';
            else if (p.spec.includes('hm3x')) type = '海光内存型 hm3x';
            else type = '其他规格';
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(p);
        });
        
        // 过滤出数据盘容量（排除"无需数据盘"选项）
        const dataDiskSizeOptions = DATA_DISK_SIZES.filter(s => s.key !== 'DATA_0');
        
        return `
            <div class="compute-package-form">
                <div class="form-tip">
                    💡 云主机必须绑定系统盘（默认40GB SSD），可额外选配数据盘作为套餐一同添加
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>云主机规格</label>
                        <select id="computeSelect">
                            <option value="">-- 选择规格 --</option>
                            ${Object.entries(grouped).map(([type, items]) => `
                                <optgroup label="${type}">
                                    ${items.map(p => `
                                        <option value="${p.key}">${p.spec}</option>
                                    `).join('')}
                                </optgroup>
                            `).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- 系统盘选择 -->
                <div class="disk-config-section">
                    <div class="disk-config-title">
                        <span class="disk-badge">系统盘</span>
                        <span class="disk-config-tip">必选</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>类型</label>
                            <select id="sysDiskTypeSelect">
                                <option value="SSD" selected>💾 通用SSD (0.7元/GB)</option>
                                <option value="超高IO">⚡ 超高IO SSD (1.2元/GB)</option>
                                <option value="极速SSD">🚀 极速SSD (2元/GB)</option>
                                <option value="SATA">💿 普通IO SATA (0.3元/GB)</option>
                                <option value="SAS">📀 高IO SAS (0.4元/GB)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>容量</label>
                            <select id="systemDiskSelect">
                                ${SYSTEM_DISK_SIZES.map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>价格</label>
                            <input type="text" id="sysDiskPriceDisplay" class="price-display" readonly value="¥8/月">
                        </div>
                    </div>
                </div>
                
                <!-- 数据盘选择 -->
                <div class="disk-config-section">
                    <div class="disk-config-title">
                        <span class="disk-badge data">数据盘</span>
                        <span class="disk-config-tip">可选，高性能数据存储</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>类型</label>
                            <select id="dataDiskTypeSelect">
                                <option value="SSD" selected>💾 通用SSD (0.7元/GB)</option>
                                <option value="超高IO">⚡ 超高IO SSD (1.2元/GB)</option>
                                <option value="极速SSD">🚀 极速SSD (2元/GB)</option>
                                <option value="SATA">💿 普通IO SATA (0.3元/GB)</option>
                                <option value="SAS">📀 高IO SAS (0.4元/GB)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>容量</label>
                            <select id="dataDiskSelect">
                                <option value="DATA_0">无需数据盘</option>
                                ${dataDiskSizeOptions.map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>价格</label>
                            <input type="text" id="dataDiskPriceDisplay" class="price-display" readonly placeholder="¥0">
                        </div>
                    </div>
                </div>
                
                <!-- 数量、按钮和合计 - 紧凑一行 -->
                <div style="margin-top: 12px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <div class="form-group" style="min-width: 80px; margin-bottom: 0;">
                        <label>数量</label>
                        <input type="number" id="computeQty" value="1" min="1" style="padding: 8px 10px;">
                    </div>
                    <button class="btn btn-primary btn-lg" id="addComputeBtn" style="margin-left: auto;">
                        ➕ 添加云主机套餐
                    </button>
                </div>

                <!-- 套餐合计 -->
                <div id="totalPriceDisplayWrapper" class="compute-total-display">
                    云主机：¥0 + 系统盘：¥0 + 数据盘：¥0 = <span style="font-size:18px;color:#c41e3a;font-weight:700">¥0/月</span>
                </div>
            </div>
            
            <div class="product-list-section">
                <h3 class="section-title">📋 可选云主机规格参考</h3>
                ${Object.entries(grouped).map(([type, items]) => `
                    <div class="product-group">
                        <div class="product-group-header">
                            <span class="product-group-name">${type}</span>
                            <span class="product-group-count">${items.length}个规格</span>
                        </div>
                        <div class="product-group-items">
                            ${items.map(item => `
                                <div class="product-item">
                                    <div class="product-spec">${item.spec}</div>
                                    <div class="product-price">
                                        <span>¥${item.monthlyPrice}/月</span>
                                        <span>¥${item.yearlyPrice}/年</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderStoragePanel(products) {
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加独立存储产品</h4>
                
                <!-- 云硬盘选择 -->
                <div class="storage-type-section" id="cloudDiskSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge cloudDisk">🖥️ 云硬盘</span>
                        <span class="storage-type-desc">独立使用的数据盘</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>类型</label>
                            <select id="cloudDiskTypeSelect">
                                <option value="">-- 选择类型 --</option>
                                ${CLOUD_DISK_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>容量</label>
                            <select id="cloudDiskSizeSelect" disabled>
                                <option value="">-- 先选类型 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="cloudDiskPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="cloudDiskQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addCloudDiskBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 共享盘选择 -->
                <div class="storage-type-section" id="sharedDiskSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge sharedDisk">🔗 共享盘</span>
                        <span class="storage-type-desc">多云主机共享的高性能存储</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>类型</label>
                            <select id="sharedDiskTypeSelect">
                                <option value="">-- 选择类型 --</option>
                                ${SHARED_DISK_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>容量</label>
                            <select id="sharedDiskSizeSelect">
                                <option value="">-- 选择容量 --</option>
                                ${SHARED_DISK_SIZES.map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="sharedDiskPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="sharedDiskQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addSharedDiskBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 对象存储选择 -->
                <div class="storage-type-section" id="oosSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge objectStorage">📦 对象存储 ZOS</span>
                        <span class="storage-type-desc">大容量对象存储服务（资源包模式）</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>产品类型</label>
                            <select id="oosTypeSelect">
                                <option value="">-- 选择类型 --</option>
                                ${OOS_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>存储类型</label>
                            <select id="oosClassSelect" disabled>
                                <option value="">-- 先选产品类型 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>规格</label>
                            <select id="oosSpecSelect" disabled>
                                <option value="">-- 先选存储类型 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="oosPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="oosQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addOOSBtn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 云硬盘价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 云硬盘价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>类型</th>
                                ${CLOUD_DISK_SIZES.map(s => `<th>${s.name}</th>`).join('')}
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${CLOUD_DISK_TYPES.map(type => `
                                <tr>
                                    <td class="type-cell">${type.icon} ${type.name}</td>
                                    ${CLOUD_DISK_SIZES.map(size => {
                                        const price = getCloudDiskPrice(type.key, size.key);
                                        return `<td>${price ? '¥' + price.price : '-'}</td>`;
                                    }).join('')}
                                    <td class="remark-cell">${type.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 共享盘价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 共享盘价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>类型</th>
                                ${SHARED_DISK_SIZES.map(s => `<th>${s.name}</th>`).join('')}
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${SHARED_DISK_TYPES.map(type => `
                                <tr>
                                    <td class="type-cell">${type.icon} ${type.name}</td>
                                    ${SHARED_DISK_SIZES.map(size => {
                                        const price = getSharedDiskPrice(type.key, size.key);
                                        return `<td>${price ? '¥' + price.monthlyPrice : '-'}</td>`;
                                    }).join('')}
                                    <td class="remark-cell">${type.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 对象存储价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 对象存储 ZOS 价格参考表</h3>
                
                <!-- 存储容量包 -->
                <div class="price-table-wrapper" style="margin-bottom: 16px;">
                    <div class="price-table-subtitle">存储容量包（元/月）</div>
                    <table class="price-table oos-table">
                        <thead>
                            <tr>
                                <th>存储类型</th>
                                ${OOS_STORAGE_PACKAGES.map(s => `<th>${s.name}</th>`).join('')}
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[...OOS_STORAGE_CLASSES, ...OOS_STORAGE_CLASSES_MULTI_AZ].map(cls => `
                                <tr>
                                    <td class="type-cell">${cls.icon} ${cls.name}</td>
                                    ${OOS_STORAGE_PACKAGES.map(pkg => {
                                        const price = getOOSPrice('存储包', cls.key, pkg.key);
                                        return `<td>${price ? '¥' + price.monthlyPrice : '-'}</td>`;
                                    }).join('')}
                                    <td class="remark-cell">${cls.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- 流量包 -->
                <div class="price-table-wrapper" style="margin-bottom: 16px;">
                    <div class="price-table-subtitle">公网流出流量包（元/月）</div>
                    <table class="price-table oos-table">
                        <thead>
                            <tr>
                                <th>存储类型</th>
                                ${OOS_TRAFFIC_PACKAGES.map(s => `<th>${s.name}</th>`).join('')}
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${OOS_STORAGE_CLASSES.map(cls => `
                                <tr>
                                    <td class="type-cell">${cls.icon} ${cls.name}</td>
                                    ${OOS_TRAFFIC_PACKAGES.map(pkg => {
                                        const price = getOOSPrice('流量包', cls.key, pkg.key);
                                        return `<td>${price ? '¥' + price.monthlyPrice : '-'}</td>`;
                                    }).join('')}
                                    <td class="remark-cell">外网流出流量，${cls.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- 请求次数包 -->
                <div class="price-table-wrapper" style="margin-bottom: 16px;">
                    <div class="price-table-subtitle">请求次数包（元/月）</div>
                    <table class="price-table oos-table">
                        <thead>
                            <tr>
                                <th>存储类型</th>
                                ${OOS_REQUEST_PACKAGES.map(s => `<th>${s.name}</th>`).join('')}
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${OOS_STORAGE_CLASSES.map(cls => `
                                <tr>
                                    <td class="type-cell">${cls.icon} ${cls.name}</td>
                                    ${OOS_REQUEST_PACKAGES.map(pkg => {
                                        const price = getOOSPrice('请求次数', cls.key, pkg.key);
                                        return `<td>${price ? '¥' + price.monthlyPrice : '-'}</td>`;
                                    }).join('')}
                                    <td class="remark-cell">API调用次数，${cls.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- 取回流量包 -->
                <div class="price-table-wrapper">
                    <div class="price-table-subtitle">取回流量包（元/月）</div>
                    <table class="price-table oos-table">
                        <thead>
                            <tr>
                                <th>存储类型</th>
                                <th>1GB</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="type-cell">🟢 低频存储</td>
                                <td>¥0.03</td>
                                <td class="remark-cell">低频数据取回费用，读取时产生</td>
                            </tr>
                            <tr>
                                <td class="type-cell">🟡 归档存储</td>
                                <td>¥0.06</td>
                                <td class="remark-cell">归档数据解冻取回费用，恢复需数小时</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    renderSecurityPanel(products) {
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加安全产品</h4>
                
                <!-- 主机安全选择 -->
                <div class="storage-type-section" id="hssSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge hss">🛡️ 主机安全 HSS</span>
                        <span class="storage-type-desc">主机安全防护（按主机个数计费）</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>版本</label>
                            <select id="hssVersionSelect">
                                <option value="">-- 选择版本 --</option>
                                ${HSS_VERSIONS.map(v => `<option value="${v.key}">${v.icon} ${v.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>主机数</label>
                            <select id="hssNodeSelect" disabled>
                                <option value="">-- 先选版本 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="hssPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="hssQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addHSSBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 防火墙选择 -->
                <div class="storage-type-section" id="afSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge af">🔥 下一代防火墙 AF</span>
                        <span class="storage-type-desc">公网流量安全防护</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格</label>
                            <select id="afSpecSelect">
                                <option value="">-- 选择规格 --</option>
                                ${AF_SPECS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="afPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="afQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addAFBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- WAF选择 -->
                <div class="storage-type-section" id="wafSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge waf">🌐 WAF Web防火墙</span>
                        <span class="storage-type-desc">Web应用安全防护</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格</label>
                            <select id="wafSpecSelect">
                                <option value="">-- 选择规格 --</option>
                                ${WAF_SPECS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="wafPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="wafQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addWAFBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 堡垒机选择 -->
                <div class="storage-type-section" id="bhSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge bh">🔐 堡垒机 BH</span>
                        <span class="storage-type-desc">运维安全审计</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格</label>
                            <select id="bhSpecSelect">
                                <option value="">-- 选择规格 --</option>
                                ${BH_SPECS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="bhPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="bhQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addBHBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 日志审计选择 -->
                <div class="storage-type-section" id="lasSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge las">📋 日志审计 LAS</span>
                        <span class="storage-type-desc">日志采集与审计分析</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格</label>
                            <select id="lasSpecSelect">
                                <option value="">-- 选择规格 --</option>
                                ${LAS_SPECS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="lasPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="lasQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addLASBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 数据库审计选择 -->
                <div class="storage-type-section" id="dasSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge das">🗄️ 数据库审计 DAS</span>
                        <span class="storage-type-desc">数据库操作审计</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格</label>
                            <select id="dasSpecSelect">
                                <option value="">-- 选择规格 --</option>
                                ${DAS_SPECS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="dasPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="dasQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addDASBtn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 主机安全价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 主机安全 HSS v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>版本</th>
                                <th>单价（元/主机/月）</th>
                                <th>年价（元/主机/年）</th>
                                <th>50主机月价</th>
                                <th>200主机月价</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${HSS_VERSIONS.map(ver => {
                                return `
                                    <tr>
                                        <td class="type-cell">${ver.icon} ${ver.name}</td>
                                        <td>¥${ver.unitPrice}</td>
                                        <td>¥${ver.yearlyUnitPrice.toLocaleString()}</td>
                                        <td>¥${(ver.unitPrice * 50).toLocaleString()}</td>
                                        <td>¥${(ver.unitPrice * 200).toLocaleString()}</td>
                                        <td class="remark-cell">${ver.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 防火墙价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 下一代防火墙 AF v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AF_SPECS.map(spec => {
                                const price = getAFPrice(spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.icon} ${spec.name}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${spec.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- WAF价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 WAF Web防火墙 v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${WAF_SPECS.map(spec => {
                                const price = getWAFPrice(spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.icon} ${spec.name}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${spec.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 堡垒机价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 堡垒机 BH v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${BH_SPECS.map(spec => {
                                const price = getBHPrice(spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.icon} ${spec.name}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${spec.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 日志审计价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 日志审计 LAS v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${LAS_SPECS.map(spec => {
                                const price = getLASPrice(spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.icon} ${spec.name}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${spec.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 数据库审计价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 数据库审计 DAS v2.0 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DAS_SPECS.map(spec => {
                                const price = getDASPrice(spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.icon} ${spec.name}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${spec.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    renderOtherPanel(products) {
        // 按产品名称分组
        const grouped = {};
        products.forEach(p => {
            const baseName = p.name;
            if (!grouped[baseName]) grouped[baseName] = [];
            grouped[baseName].push(p);
        });
        
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加产品</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>选择规格</label>
                        <select id="otherProductSelect">
                            <option value="">-- 选择产品规格 --</option>
                            ${Object.entries(grouped).map(([name, items]) => `
                                <optgroup label="${name}">
                                    ${items.map(p => `<option value="${p.key}">${p.spec}</option>`).join('')}
                                </optgroup>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>数量</label>
                        <input type="number" id="otherQty" value="1" min="1">
                    </div>
                    <div class="form-group">
                        <label>备注</label>
                        <input type="text" id="otherRemark" placeholder="选填">
                    </div>
                    <div class="form-group" style="justify-content: flex-end;">
                        <button class="btn btn-primary" id="addOtherBtn">添加</button>
                    </div>
                </div>
            </div>
            
            <!-- 产品列表 -->
            ${Object.entries(grouped).map(([name, items]) => `
                <div class="product-group">
                    <div class="product-group-header">
                        <span class="product-group-name">${name}</span>
                        <span class="product-group-count">${items.length}个规格</span>
                    </div>
                    <div class="product-group-items">
                        ${items.map(item => `
                            <div class="product-item">
                                <div class="product-spec">${item.spec}</div>
                                <div class="product-price">
                                    <span>¥${item.monthlyPrice}/${item.unit}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    renderBackupPanel(products) {
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加备份服务</h4>
                
                <!-- CBR备份存储库选择 -->
                <div class="storage-type-section" id="cbrSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge cbr">🔄 云服务备份 CBR</span>
                        <span class="storage-type-desc">按存储容量计费</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>存储库类型</label>
                            <select id="cbrTypeSelect">
                                <option value="">-- 选择存储库类型 --</option>
                                ${CBR_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>容量(TB)</label>
                            <input type="number" id="cbrCapacity" value="1" min="1" step="1" placeholder="输入容量">
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="cbrPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="cbrQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addCBRBtn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- CBR价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 云服务备份 CBR 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>存储库类型</th>
                                <th>月价（元/GB/月）</th>
                                <th>年价（元/GB/年）</th>
                                <th>三年价（元/GB/3年）</th>
                                <th>1TB月价参考</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${CBR_TYPES.map(t => {
                                return `
                                    <tr>
                                        <td class="type-cell">${t.icon} ${t.name}</td>
                                        <td>¥${t.pricePerGBMonth}</td>
                                        <td>¥${t.pricePerGBYear}</td>
                                        <td>¥${t.pricePerGB3Year}</td>
                                        <td>¥${(t.pricePerGBMonth * 1024).toFixed(1)}/月</td>
                                        <td class="remark-cell">${t.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    renderDatabasePanel(products) {
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加数据库实例</h4>
                
                <!-- 数据库实例选择 -->
                <div class="storage-type-section" id="dbSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge db">🗄️ 关系数据库</span>
                        <span class="storage-type-desc">MySQL / PostgreSQL 实例</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>数据库类型</label>
                            <select id="dbTypeSelect">
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>实例类型</label>
                            <select id="dbInstanceTypeSelect">
                                ${DB_INSTANCE_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>系列</label>
                            <select id="dbSeriesSelect">
                                <option value="">-- 选择系列 --</option>
                                ${MYSQL_SERIES.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>规格</label>
                            <select id="dbSpecSelect" disabled>
                                <option value="">-- 先选系列 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="dbPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="dbQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addDBBtn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 单机实例价格参考表（MySQL/PostgreSQL共用） -->
            <div class="product-list-section">
                <h3 class="section-title">📋 单机实例 通用型 价格参考表（MySQL/PostgreSQL）</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB_SINGLE_SPECS.general.map(spec => {
                                const price = getDBPrice('mysql', 'standalone', 'general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="product-list-section">
                <h3 class="section-title">📋 单机实例 独享型 价格参考表（MySQL/PostgreSQL）</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB_SINGLE_SPECS.exclusive.map(spec => {
                                const price = getDBPrice('mysql', 'standalone', 'exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="product-list-section">
                <h3 class="section-title">📋 单机实例 国产化系列 价格参考表（MySQL/PostgreSQL）</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>类型</th>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB_SINGLE_SPECS.domestic_general.map(spec => {
                                const price = getDBPrice('mysql', 'standalone', 'domestic_general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化通用型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                            ${DB_SINGLE_SPECS.domestic_exclusive.map(spec => {
                                const price = getDBPrice('mysql', 'standalone', 'domestic_exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化独享型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- MySQL主备通用型价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 MySQL 主备实例 通用型 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${MYSQL_SPECS.general.map(spec => {
                                const price = getMySQLPrice('general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- MySQL独享型价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 MySQL 主备实例 独享型 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${MYSQL_SPECS.exclusive.map(spec => {
                                const price = getMySQLPrice('exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- MySQL国产化价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 MySQL 主备实例 国产化系列 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>类型</th>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${MYSQL_SPECS.domestic_general.map(spec => {
                                const price = getMySQLPrice('domestic_general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化通用型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                            ${MYSQL_SPECS.domestic_exclusive.map(spec => {
                                const price = getMySQLPrice('domestic_exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化独享型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- PostgreSQL通用型价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 PostgreSQL 主备实例 通用型 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${PG_SPECS.general.map(spec => {
                                const price = getPGPrice('general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- PostgreSQL独享型价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 PostgreSQL 主备实例 独享型 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${PG_SPECS.exclusive.map(spec => {
                                const price = getPGPrice('exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年65折/3年45折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- PostgreSQL国产化价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 PostgreSQL 主备实例 国产化系列 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>类型</th>
                                <th>规格</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${PG_SPECS.domestic_general.map(spec => {
                                const price = getPGPrice('domestic_general', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化通用型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                            ${PG_SPECS.domestic_exclusive.map(spec => {
                                const price = getPGPrice('domestic_exclusive', spec.key);
                                if (!price) return '';
                                return `
                                    <tr>
                                        <td class="type-cell">国产化独享型</td>
                                        <td>${spec.remark}</td>
                                        <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">1年85折/3年5折</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    updateComputePrice() {
        const display = document.getElementById('totalPriceDisplayWrapper');
        if (!display) return;
        
        const computeKey = document.getElementById('computeSelect')?.value;
        const sysDiskType = document.getElementById('sysDiskTypeSelect')?.value;
        const sysDiskKey = document.getElementById('systemDiskSelect')?.value;
        const dataDiskType = document.getElementById('dataDiskTypeSelect')?.value;
        const dataDiskKey = document.getElementById('dataDiskSelect')?.value;
        
        if (!computeKey) {
            display.innerHTML = '云主机：¥0 + 系统盘：¥0 + 数据盘：¥0 = <span style="font-size:18px;color:#c41e3a;font-weight:700">¥0/月</span>';
            return;
        }
        
        // 云主机价格
        const computeProduct = getProductDetail('compute', computeKey);
        const computePrice = computeProduct ? computeProduct.monthlyPrice : 0;
        
        // 系统盘价格（根据类型和容量计算）
        const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sysDiskKey);
        const sysSizeName = sysDisk ? sysDisk.name : '40GB';
        const sysDiskKey2 = `${sysDiskType}_${sysSizeName}`;
        const sysDiskPriceData = DISK_PRICES[sysDiskKey2];
        let sysDiskPrice = sysDiskPriceData ? sysDiskPriceData.price : 0;
        
        // 数据盘价格（根据类型和容量计算）
        let dataDiskPrice = 0;
        if (dataDiskKey && dataDiskKey !== 'DATA_0') {
            const dataDisk = DATA_DISK_SIZES.find(d => d.key === dataDiskKey);
            const dataSizeName = dataDisk ? dataDisk.name : '100GB';
            const dataDiskKey2 = `${dataDiskType}_${dataSizeName}`;
            const dataDiskPriceData = DISK_PRICES[dataDiskKey2];
            if (dataDiskPriceData) {
                dataDiskPrice = dataDiskPriceData.price;
            }
        }
        
        // 合计 - 用纯文本写入
        const total = computePrice + sysDiskPrice + dataDiskPrice;
        display.innerHTML = `云主机：¥${computePrice} + 系统盘：¥${sysDiskPrice} + 数据盘：¥${dataDiskPrice} = <span style="font-size:18px;color:#c41e3a;font-weight:700">¥${total}/月</span>`;
    }
    
    addComputePackage() {
        const computeKey = document.getElementById('computeSelect').value;
        const sysDiskType = document.getElementById('sysDiskTypeSelect').value;
        const sysDiskKey = document.getElementById('systemDiskSelect').value;
        const dataDiskType = document.getElementById('dataDiskTypeSelect').value;
        const dataDiskKey = document.getElementById('dataDiskSelect').value;
        const qty = parseInt(document.getElementById('computeQty').value) || 1;
        
        if (!computeKey) {
            alert('请选择云主机规格');
            return;
        }
        
        const computeProduct = getProductDetail('compute', computeKey);
        if (!computeProduct) return;
        
        // 系统盘信息（根据类型和容量查找）
        const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sysDiskKey);
        const sysSizeName = sysDisk ? sysDisk.name : '40GB';
        const sysDiskPriceKey = `${sysDiskType}_${sysSizeName}`;
        const sysDiskInfo = DISK_PRICES[sysDiskPriceKey];
        
        // 数据盘信息（根据类型和容量查找）
        const dataDisk = DATA_DISK_SIZES.find(d => d.key === dataDiskKey);
        let dataDiskInfo = null;
        if (dataDiskKey && dataDiskKey !== 'DATA_0') {
            const dataSizeName = dataDisk ? dataDisk.name : '100GB';
            const dataDiskPriceKey = `${dataDiskType}_${dataSizeName}`;
            dataDiskInfo = DISK_PRICES[dataDiskPriceKey];
        }
        
        // 计算系统盘价格
        let sysDiskMonthly = sysDiskInfo ? sysDiskInfo.price : 0;
        let sysDiskYearly = sysDiskInfo ? sysDiskInfo.yearlyPrice : 0;
        let sysDiskThreeYear = sysDiskInfo ? sysDiskInfo.threeYearPrice : 0;
        
        // 计算数据盘价格
        let dataDiskMonthly = 0;
        let dataDiskYearly = 0;
        let dataDiskThreeYear = 0;
        if (dataDiskInfo) {
            dataDiskMonthly = dataDiskInfo.price;
            dataDiskYearly = dataDiskInfo.yearlyPrice;
            dataDiskThreeYear = dataDiskInfo.threeYearPrice;
        }
        
        // 计算套餐总价
        const monthlyPrice = computeProduct.monthlyPrice + sysDiskMonthly + dataDiskMonthly;
        const yearlyPrice = computeProduct.yearlyPrice + sysDiskYearly + dataDiskYearly;
        const threeYearPrice = computeProduct.threeYearPrice + sysDiskThreeYear + dataDiskThreeYear;
        
        // 构建套餐名称
        let packageName = computeProduct.spec;
        // 显示系统盘类型和容量
        const diskTypeName = sysDiskType === 'SSD' ? '通用SSD' : 
                            sysDiskType === '超高IO' ? '超高IO SSD' : 
                            sysDiskType === '极速SSD' ? '极速SSD' : 'SATA';
        packageName += ` | 系统盘${diskTypeName} ${sysSizeName}`;
        
        // 数据盘类型名称（需要在if块外定义，以便后面使用）
        let dataDiskTypeName = '';
        if (dataDiskKey && dataDiskKey !== 'DATA_0' && dataDisk) {
            dataDiskTypeName = dataDiskType === 'SSD' ? '通用SSD' : 
                              dataDiskType === '超高IO' ? '超高IO SSD' : 
                              dataDiskType === '极速SSD' ? '极速SSD' : 'SATA';
            packageName += ` | 数据盘${dataDiskTypeName} ${dataDisk.name}`;
        }
        
        const item = {
            id: Date.now(),
            categoryId: 'compute',
            categoryName: '计算资源',
            productKey: computeKey,
            name: '云主机套餐',
            spec: packageName,
            monthlyPrice: monthlyPrice,
            yearlyPrice: yearlyPrice,
            threeYearPrice: threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: true,
            packageDetails: {
                compute: {
                    name: computeProduct.name,
                    spec: computeProduct.spec,
                    monthlyPrice: computeProduct.monthlyPrice,
                    yearlyPrice: computeProduct.yearlyPrice,
                    threeYearPrice: computeProduct.threeYearPrice
                },
                systemDisk: {
                    name: '系统盘',
                    spec: diskTypeName + ' ' + sysSizeName,
                    monthlyPrice: sysDiskMonthly,
                    yearlyPrice: sysDiskYearly,
                    threeYearPrice: sysDiskThreeYear
                },
                dataDisk: dataDiskInfo ? {
                    name: '数据盘',
                    spec: dataDiskTypeName + ' ' + dataDisk.name,
                    monthlyPrice: dataDiskMonthly,
                    yearlyPrice: dataDiskYearly,
                    threeYearPrice: dataDiskThreeYear
                } : null
            }
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('computeQty').value = 1;
        document.getElementById('dataDiskSelect').value = 'DATA_0';
        this.updateComputePrice();
    }
    
    addStorageProduct() {
        const productKey = document.getElementById('storageProductSelect').value;
        const qty = parseInt(document.getElementById('storageQty').value) || 1;
        const remark = document.getElementById('storageRemark').value.trim();
        
        if (!productKey) {
            alert('请选择存储产品规格');
            return;
        }
        
        const product = getProductDetail('storage', productKey);
        if (!product) return;
        
        this.addToQuoteList(product, qty, remark);
        
        // 重置表单
        document.getElementById('storageRemark').value = '';
    }
    
    // 添加云硬盘
    addCloudDisk() {
        const type = document.getElementById('cloudDiskTypeSelect')?.value;
        const size = document.getElementById('cloudDiskSizeSelect')?.value;
        const qty = parseInt(document.getElementById('cloudDiskQty')?.value) || 1;
        
        if (!type || !size) {
            alert('请选择云硬盘类型和容量');
            return;
        }
        
        const price = getCloudDiskPrice(type, size);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const diskType = CLOUD_DISK_TYPES.find(t => t.key === type);
        const diskSize = CLOUD_DISK_SIZES.find(s => s.key === size);
        
        const item = {
            id: Date.now(),
            categoryId: 'storage',
            categoryName: '存储资源',
            productKey: `云硬盘_${type}_${size}`,
            name: '云硬盘',
            spec: `${diskType.name} | ${diskSize.name}`,
            monthlyPrice: price.price,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('cloudDiskTypeSelect').value = '';
        document.getElementById('cloudDiskSizeSelect').innerHTML = '<option value="">-- 先选类型 --</option>';
        document.getElementById('cloudDiskSizeSelect').disabled = true;
        document.getElementById('cloudDiskPriceDisplay').value = '';
    }
    
    // 添加共享盘
    addSharedDisk() {
        const type = document.getElementById('sharedDiskTypeSelect')?.value;
        const size = document.getElementById('sharedDiskSizeSelect')?.value;
        const qty = parseInt(document.getElementById('sharedDiskQty')?.value) || 1;
        
        if (!type || !size) {
            alert('请选择共享盘类型和容量');
            return;
        }
        
        const price = getSharedDiskPrice(type, size);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const diskType = SHARED_DISK_TYPES.find(t => t.key === type);
        const diskSize = SHARED_DISK_SIZES.find(s => s.key === size);
        
        const item = {
            id: Date.now(),
            categoryId: 'storage',
            categoryName: '存储资源',
            productKey: `共享盘_${type}_${size}`,
            name: '共享盘',
            spec: `${diskType.name} | ${diskSize.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('sharedDiskTypeSelect').value = '';
        document.getElementById('sharedDiskSizeSelect').value = '';
        document.getElementById('sharedDiskPriceDisplay').value = '';
    }
    
    // 添加对象存储
    addOOS() {
        const type = document.getElementById('oosTypeSelect')?.value;
        const storageClass = document.getElementById('oosClassSelect')?.value;
        const spec = document.getElementById('oosSpecSelect')?.value;
        const qty = parseInt(document.getElementById('oosQty')?.value) || 1;
        
        if (!type || !storageClass || !spec) {
            alert('请选择对象存储的产品类型、存储类型和规格');
            return;
        }
        
        const price = getOOSPrice(type, storageClass, spec);
        if (!price) {
            alert('未找到对应价格，请检查选择');
            return;
        }
        
        const oosTypeItem = OOS_TYPES.find(t => t.key === type);
        
        // 获取存储类型名称
        let className;
        const allClasses = [...OOS_STORAGE_CLASSES, ...OOS_STORAGE_CLASSES_MULTI_AZ];
        const classItem = allClasses.find(c => c.key === storageClass);
        if (classItem) {
            className = classItem.name;
        } else if (storageClass === '低频') {
            className = '低频存储';
        } else if (storageClass === '归档') {
            className = '归档存储';
        } else {
            className = storageClass;
        }
        
        // 获取规格名称
        let specName;
        switch(type) {
            case '存储包': specName = OOS_STORAGE_PACKAGES.find(p => p.key === spec)?.name; break;
            case '流量包': specName = OOS_TRAFFIC_PACKAGES.find(p => p.key === spec)?.name; break;
            case '请求次数': specName = OOS_REQUEST_PACKAGES.find(p => p.key === spec)?.name; break;
            case '取回流量': specName = OOS_RETRIEVAL_PACKAGES.find(p => p.key === spec)?.name; break;
            default: specName = spec;
        }
        
        const item = {
            id: Date.now(),
            categoryId: 'storage',
            categoryName: '存储资源',
            productKey: `对象存储_${type}_${storageClass}_${spec}`,
            name: '对象存储 ZOS',
            spec: `${oosTypeItem.name} | ${className} | ${specName}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('oosTypeSelect').value = '';
        document.getElementById('oosClassSelect').innerHTML = '<option value="">-- 先选产品类型 --</option>';
        document.getElementById('oosClassSelect').disabled = true;
        document.getElementById('oosSpecSelect').innerHTML = '<option value="">-- 先选存储类型 --</option>';
        document.getElementById('oosSpecSelect').disabled = true;
        document.getElementById('oosPriceDisplay').value = '';
    }
    
    // ==================== 网络资源面板 ====================
    
    renderNetworkPanel(products) {
        return `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加网络产品</h4>
                
                <!-- 弹性IP选择 -->
                <div class="storage-type-section" id="eipSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge eip">🌐 弹性IP EIP</span>
                        <span class="storage-type-desc">可独立申请的公网IP</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>带宽</label>
                            <select id="eipBandwidthSelect">
                                <option value="">-- 选择带宽 --</option>
                                ${EIP_BANDWIDTH_OPTIONS.map(b => `<option value="${b.key}">${b.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="eipPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="eipQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addEIPBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- 负载均衡选择 -->
                <div class="storage-type-section" id="elbSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge elb">⚖️ 负载均衡 ELB</span>
                        <span class="storage-type-desc">流量分发服务（性能保障型）</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格类型</label>
                            <select id="elbTypeSelect">
                                <option value="">-- 选择规格 --</option>
                                ${ELB_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name} - ${t.desc}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="elbPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="elbQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addELBBtn">添加</button>
                        </div>
                    </div>
                </div>
                
                <!-- NAT网关选择 -->
                <div class="storage-type-section" id="natSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge nat">🔀 NAT网关</span>
                        <span class="storage-type-desc">公网NAT网关，为VPC内资源提供公网访问</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>规格类型</label>
                            <select id="natTypeSelect">
                                <option value="">-- 选择规格 --</option>
                                ${NAT_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name} - ${t.desc}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单价</label>
                            <input type="text" id="natPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="natQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addNATBtn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 弹性IP价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 弹性IP EIP 价格参考表</h3>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>带宽</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${EIP_BANDWIDTH_OPTIONS.map(bw => {
                                const price = getEIPPrice(bw.key);
                                return price ? `
                                    <tr>
                                        <td class="type-cell">${bw.name}</td>
                                        <td>¥${price.monthlyPrice}</td>
                                        <td>¥${price.yearlyPrice}</td>
                                        <td>¥${price.threeYearPrice}</td>
                                        <td class="remark-cell">${bw.remark}</td>
                                    </tr>
                                ` : '';
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 负载均衡价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 负载均衡 ELB 价格参考表（性能保障型）</h3>
                <div class="form-tip" style="margin-bottom: 12px;">
                    💡 经典型负载均衡免费提供，关联的弹性IP/带宽等需按各自标准收费。高阶型II、超强型I/II/II-应用型/III默认不支持创建，需提工单申请。
                </div>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格类型</th>
                                <th>最大连接数</th>
                                <th>新建连接数</th>
                                <th>CPS</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ELB_TYPES.map(type => {
                                const price = getELBPrice(type.key);
                                if (!price) return '';
                                const spec = price.spec;
                                // 解析spec中的参数
                                const maxConn = spec.match(/最大连接数([^\|]+)/)?.[1]?.trim() || '-';
                                const newConn = spec.match(/新建连接数([^\|]+)/)?.[1]?.trim() || '-';
                                const cps = spec.match(/CPS\s*([^\|]+)/)?.[1]?.trim() || '-';
                                return `
                                    <tr>
                                        <td class="type-cell">${type.icon} ${type.name}</td>
                                        <td>${maxConn}</td>
                                        <td>${newConn}</td>
                                        <td>${cps}</td>
                                        <td>${price.monthlyPrice === 0 ? '免费' : '¥' + price.monthlyPrice}</td>
                                        <td>${price.yearlyPrice === 0 ? '免费' : '¥' + price.yearlyPrice.toLocaleString()}</td>
                                        <td>${price.threeYearPrice === 0 ? '免费' : '¥' + price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${type.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- NAT网关价格参考表 -->
            <div class="product-list-section">
                <h3 class="section-title">📋 公网NAT网关 价格参考表</h3>
                <div class="form-tip" style="margin-bottom: 12px;">
                    💡 NAT网关为VPC内资源提供SNAT/DNAT公网访问能力，需配合弹性IP使用。中型/大型/超大型规格仅在部分资源池支持，具体以购买页面显示为准。年付8.5折，三年付5折。
                </div>
                <div class="price-table-wrapper">
                    <table class="price-table">
                        <thead>
                            <tr>
                                <th>规格类型</th>
                                <th>最大并发连接数</th>
                                <th>月租（元/月）</th>
                                <th>年租（元/年）</th>
                                <th>三年（元）</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${NAT_TYPES.map(type => {
                                const price = getNATPrice(type.key);
                                if (!price) return '';
                                const maxConn = price.spec.match(/最大并发连接数([^\|]+)/)?.[1]?.trim() || '-';
                                return `
                                    <tr>
                                        <td class="type-cell">${type.icon} ${type.name}</td>
                                        <td>${maxConn}</td>
                                        <td>¥${price.monthlyPrice}</td>
                                        <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                        <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                        <td class="remark-cell">${type.remark}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    bindNetworkEvents() {
        // 弹性IP带宽变更
        const eipSelect = document.getElementById('eipBandwidthSelect');
        if (eipSelect) {
            eipSelect.addEventListener('change', () => {
                const bandwidth = eipSelect.value;
                const priceDisplay = document.getElementById('eipPriceDisplay');
                
                if (!bandwidth) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getEIPPrice(bandwidth);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice}/月 | ¥${price.yearlyPrice}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加弹性IP
            document.getElementById('addEIPBtn')?.addEventListener('click', () => {
                this.addEIP();
            });
        }
        
        // 负载均衡类型变更
        const elbSelect = document.getElementById('elbTypeSelect');
        if (elbSelect) {
            elbSelect.addEventListener('change', () => {
                const type = elbSelect.value;
                const priceDisplay = document.getElementById('elbPriceDisplay');
                
                if (!type) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getELBPrice(type);
                if (price) {
                    if (price.monthlyPrice === 0) {
                        priceDisplay.value = '免费';
                    } else {
                        priceDisplay.value = `¥${price.monthlyPrice}/月 | ¥${price.yearlyPrice}/年`;
                    }
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加负载均衡
            document.getElementById('addELBBtn')?.addEventListener('click', () => {
                this.addELB();
            });
        }
        
        // NAT网关类型变更
        const natSelect = document.getElementById('natTypeSelect');
        if (natSelect) {
            natSelect.addEventListener('change', () => {
                const type = natSelect.value;
                const priceDisplay = document.getElementById('natPriceDisplay');
                
                if (!type) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getNATPrice(type);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice}/月 | ¥${price.yearlyPrice}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            // 添加NAT网关
            document.getElementById('addNATBtn')?.addEventListener('click', () => {
                this.addNAT();
            });
        }
    }
    
    // 添加弹性IP
    addEIP() {
        const bandwidth = document.getElementById('eipBandwidthSelect')?.value;
        const qty = parseInt(document.getElementById('eipQty')?.value) || 1;
        
        if (!bandwidth) {
            alert('请选择弹性IP带宽');
            return;
        }
        
        const price = getEIPPrice(bandwidth);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const bwItem = EIP_BANDWIDTH_OPTIONS.find(b => b.key === bandwidth);
        
        const item = {
            id: Date.now(),
            categoryId: 'network',
            categoryName: '网络资源',
            productKey: `弹性IP_${bandwidth}`,
            name: '弹性IP EIP',
            spec: `${bwItem.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('eipBandwidthSelect').value = '';
        document.getElementById('eipPriceDisplay').value = '';
    }
    
    // 添加负载均衡
    addELB() {
        const type = document.getElementById('elbTypeSelect')?.value;
        const qty = parseInt(document.getElementById('elbQty')?.value) || 1;
        
        if (!type) {
            alert('请选择负载均衡规格');
            return;
        }
        
        const price = getELBPrice(type);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const elbType = ELB_TYPES.find(t => t.key === type);
        
        const item = {
            id: Date.now(),
            categoryId: 'network',
            categoryName: '网络资源',
            productKey: `负载均衡_${type}`,
            name: '负载均衡 ELB',
            spec: `${elbType.name}${type !== '经典型' ? ' | 性能保障型' : ' | 经典型'}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('elbTypeSelect').value = '';
        document.getElementById('elbPriceDisplay').value = '';
    }
    
    // 添加NAT网关
    addNAT() {
        const type = document.getElementById('natTypeSelect')?.value;
        const qty = parseInt(document.getElementById('natQty')?.value) || 1;
        
        if (!type) {
            alert('请选择NAT网关规格');
            return;
        }
        
        const price = getNATPrice(type);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const natType = NAT_TYPES.find(t => t.key === type);
        
        const item = {
            id: Date.now(),
            categoryId: 'network',
            categoryName: '网络资源',
            productKey: `NAT网关_${type}`,
            name: 'NAT网关',
            spec: `${natType.name} | 最大并发${natType.desc.replace('最大并发', '')}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('natTypeSelect').value = '';
        document.getElementById('natPriceDisplay').value = '';
    }
    
    // ==================== 安全产品事件绑定 ====================
    
    bindSecurityEvents() {
        // 主机安全 - 版本变更
        const hssVersion = document.getElementById('hssVersionSelect');
        if (hssVersion) {
            hssVersion.addEventListener('change', () => {
                const version = hssVersion.value;
                const nodeSelect = document.getElementById('hssNodeSelect');
                const priceDisplay = document.getElementById('hssPriceDisplay');
                
                if (!version) {
                    nodeSelect.innerHTML = '<option value="">-- 先选版本 --</option>';
                    nodeSelect.disabled = true;
                    priceDisplay.value = '';
                    return;
                }
                
                // 填充节点选项
                nodeSelect.innerHTML = '<option value="">-- 选择主机数 --</option>' +
                    HSS_NODE_OPTIONS.map(n => `<option value="${n.key}">${n.name}</option>`).join('');
                nodeSelect.disabled = false;
                priceDisplay.value = '';
            });
            
            // 主机安全 - 节点数变更
            document.getElementById('hssNodeSelect')?.addEventListener('change', () => {
                const version = hssVersion.value;
                const nodes = document.getElementById('hssNodeSelect').value;
                const priceDisplay = document.getElementById('hssPriceDisplay');
                
                if (!version || !nodes) {
                    priceDisplay.value = '';
                    return;
                }
                
                const price = getHSSPrice(version, nodes);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            
            document.getElementById('addHSSBtn')?.addEventListener('click', () => {
                this.addHSS();
            });
        }
        
        // 防火墙规格变更
        const afSelect = document.getElementById('afSpecSelect');
        if (afSelect) {
            afSelect.addEventListener('change', () => {
                const spec = afSelect.value;
                const priceDisplay = document.getElementById('afPriceDisplay');
                
                if (!spec) { priceDisplay.value = ''; return; }
                
                const price = getAFPrice(spec);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            document.getElementById('addAFBtn')?.addEventListener('click', () => { this.addAF(); });
        }
        
        // WAF规格变更
        const wafSelect = document.getElementById('wafSpecSelect');
        if (wafSelect) {
            wafSelect.addEventListener('change', () => {
                const spec = wafSelect.value;
                const priceDisplay = document.getElementById('wafPriceDisplay');
                
                if (!spec) { priceDisplay.value = ''; return; }
                
                const price = getWAFPrice(spec);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            document.getElementById('addWAFBtn')?.addEventListener('click', () => { this.addWAF(); });
        }
        
        // 堡垒机规格变更
        const bhSelect = document.getElementById('bhSpecSelect');
        if (bhSelect) {
            bhSelect.addEventListener('change', () => {
                const spec = bhSelect.value;
                const priceDisplay = document.getElementById('bhPriceDisplay');
                
                if (!spec) { priceDisplay.value = ''; return; }
                
                const price = getBHPrice(spec);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            document.getElementById('addBHBtn')?.addEventListener('click', () => { this.addBH(); });
        }
        
        // 日志审计规格变更
        const lasSelect = document.getElementById('lasSpecSelect');
        if (lasSelect) {
            lasSelect.addEventListener('change', () => {
                const spec = lasSelect.value;
                const priceDisplay = document.getElementById('lasPriceDisplay');
                
                if (!spec) { priceDisplay.value = ''; return; }
                
                const price = getLASPrice(spec);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            document.getElementById('addLASBtn')?.addEventListener('click', () => { this.addLAS(); });
        }
        
        // 数据库审计规格变更
        const dasSelect = document.getElementById('dasSpecSelect');
        if (dasSelect) {
            dasSelect.addEventListener('change', () => {
                const spec = dasSelect.value;
                const priceDisplay = document.getElementById('dasPriceDisplay');
                
                if (!spec) { priceDisplay.value = ''; return; }
                
                const price = getDASPrice(spec);
                if (price) {
                    priceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月 | ¥${price.yearlyPrice.toLocaleString()}/年`;
                } else {
                    priceDisplay.value = '';
                }
            });
            document.getElementById('addDASBtn')?.addEventListener('click', () => { this.addDAS(); });
        }
    }
    
    // 添加主机安全
    addHSS() {
        const version = document.getElementById('hssVersionSelect')?.value;
        const nodes = document.getElementById('hssNodeSelect')?.value;
        const qty = parseInt(document.getElementById('hssQty')?.value) || 1;
        
        if (!version || !nodes) {
            alert('请选择主机安全版本和主机数');
            return;
        }
        
        const price = getHSSPrice(version, nodes);
        if (!price) {
            alert('未找到对应价格');
            return;
        }
        
        const hssVer = HSS_VERSIONS.find(v => v.key === version);
        const nodeOpt = HSS_NODE_OPTIONS.find(n => n.key === nodes);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `主机安全_${version}${nodes}`,
            name: '主机安全 HSS',
            spec: `${hssVer.name} | ${nodeOpt.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: hssVer.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('hssVersionSelect').value = '';
        document.getElementById('hssNodeSelect').innerHTML = '<option value="">-- 先选版本 --</option>';
        document.getElementById('hssNodeSelect').disabled = true;
        document.getElementById('hssPriceDisplay').value = '';
    }
    
    // 添加防火墙
    addAF() {
        const spec = document.getElementById('afSpecSelect')?.value;
        const qty = parseInt(document.getElementById('afQty')?.value) || 1;
        
        if (!spec) { alert('请选择防火墙规格'); return; }
        
        const price = getAFPrice(spec);
        if (!price) { alert('未找到对应价格'); return; }
        
        const afSpec = AF_SPECS.find(s => s.key === spec);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `防火墙_${spec}`,
            name: '防火墙 AF',
            spec: `${afSpec.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: afSpec.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        document.getElementById('afSpecSelect').value = '';
        document.getElementById('afPriceDisplay').value = '';
    }
    
    // 添加WAF
    addWAF() {
        const spec = document.getElementById('wafSpecSelect')?.value;
        const qty = parseInt(document.getElementById('wafQty')?.value) || 1;
        
        if (!spec) { alert('请选择WAF规格'); return; }
        
        const price = getWAFPrice(spec);
        if (!price) { alert('未找到对应价格'); return; }
        
        const wafSpec = WAF_SPECS.find(s => s.key === spec);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `WAF_${spec}`,
            name: 'WAF Web防火墙',
            spec: `${wafSpec.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: wafSpec.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        document.getElementById('wafSpecSelect').value = '';
        document.getElementById('wafPriceDisplay').value = '';
    }
    
    // 添加堡垒机
    addBH() {
        const spec = document.getElementById('bhSpecSelect')?.value;
        const qty = parseInt(document.getElementById('bhQty')?.value) || 1;
        
        if (!spec) { alert('请选择堡垒机规格'); return; }
        
        const price = getBHPrice(spec);
        if (!price) { alert('未找到对应价格'); return; }
        
        const bhSpec = BH_SPECS.find(s => s.key === spec);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `堡垒机_${spec}`,
            name: '堡垒机 BH',
            spec: `v2.0 | ${bhSpec.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: bhSpec.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        document.getElementById('bhSpecSelect').value = '';
        document.getElementById('bhPriceDisplay').value = '';
    }
    
    // 添加日志审计
    addLAS() {
        const spec = document.getElementById('lasSpecSelect')?.value;
        const qty = parseInt(document.getElementById('lasQty')?.value) || 1;
        
        if (!spec) { alert('请选择日志审计规格'); return; }
        
        const price = getLASPrice(spec);
        if (!price) { alert('未找到对应价格'); return; }
        
        const lasSpec = LAS_SPECS.find(s => s.key === spec);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `日志审计_${spec}`,
            name: '日志审计 LAS',
            spec: `v2.0 | ${lasSpec.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: lasSpec.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        document.getElementById('lasSpecSelect').value = '';
        document.getElementById('lasPriceDisplay').value = '';
    }
    
    // 添加数据库审计
    addDAS() {
        const spec = document.getElementById('dasSpecSelect')?.value;
        const qty = parseInt(document.getElementById('dasQty')?.value) || 1;
        
        if (!spec) { alert('请选择数据库审计规格'); return; }
        
        const price = getDASPrice(spec);
        if (!price) { alert('未找到对应价格'); return; }
        
        const dasSpec = DAS_SPECS.find(s => s.key === spec);
        
        const item = {
            id: Date.now(),
            categoryId: 'security',
            categoryName: '安全产品',
            productKey: `数据库审计_${spec}`,
            name: '数据库审计 DAS',
            spec: `v2.0 | ${dasSpec.name}`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: dasSpec.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        document.getElementById('dasSpecSelect').value = '';
        document.getElementById('dasPriceDisplay').value = '';
    }
    
    // 添加数据库实例（MySQL/PostgreSQL）
    addDatabase() {
        const dbType = document.getElementById('dbTypeSelect')?.value || 'mysql';
        const instanceType = document.getElementById('dbInstanceTypeSelect')?.value || 'ha';
        const seriesKey = document.getElementById('dbSeriesSelect')?.value;
        const specKey = document.getElementById('dbSpecSelect')?.value;
        const qty = parseInt(document.getElementById('dbQty')?.value) || 1;
        
        if (!seriesKey) { alert('请选择系列'); return; }
        if (!specKey) { alert('请选择规格'); return; }
        
        const price = getDBPrice(dbType, instanceType, seriesKey, specKey);
        if (!price) { alert('未找到对应价格'); return; }
        
        const dbTypeName = dbType === 'postgresql' ? 'PostgreSQL' : 'MySQL';
        
        const item = {
            id: Date.now(),
            categoryId: 'database',
            categoryName: '数据库',
            productKey: `${dbTypeName}_${instanceType}_${seriesKey}_${specKey}`,
            name: price.name,
            spec: price.spec,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: price.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('dbSeriesSelect').value = '';
        document.getElementById('dbSpecSelect').innerHTML = '<option value="">-- 先选系列 --</option>';
        document.getElementById('dbSpecSelect').disabled = true;
        document.getElementById('dbPriceDisplay').value = '';
    }
    
    // GPU面板渲染
    renderGPUPanel(products) {
        // 按系列分组规格族
        const groupedBySeries = {};
        GPU_SERIES.forEach(series => {
            const families = getGPUFamiliesBySeries(series.key);
            if (families.length > 0) {
                groupedBySeries[series.key] = { series, families };
            }
        });
        
        let html = `
            <!-- 添加表单 -->
            <div class="storage-add-section">
                <h4>➕ 添加GPU云主机</h4>
                
                <div class="storage-type-section" id="gpuSection">
                    <div class="storage-type-header">
                        <span class="storage-type-badge gpu">🎮 GPU云主机</span>
                        <span class="storage-type-desc">NVIDIA / 昇腾 / 寒武纪 GPU实例</span>
                    </div>
                    
                    <!-- GPU规格选择 -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>系列</label>
                            <select id="gpuSeriesSelect">
                                <option value="">-- 选择系列 --</option>
                                ${GPU_SERIES.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>规格族</label>
                            <select id="gpuFamilySelect" disabled>
                                <option value="">-- 先选系列 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>规格</label>
                            <select id="gpuSpecSelect" disabled>
                                <option value="">-- 先选规格族 --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GPU单价</label>
                            <input type="text" id="gpuPriceDisplay" class="price-display" readonly placeholder="--">
                        </div>
                    </div>
                    
                    <!-- 系统盘选择 -->
                    <div class="disk-config-section">
                        <div class="disk-config-title">
                            <span class="disk-badge">系统盘</span>
                            <span class="disk-config-tip">必选</span>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>类型</label>
                                <select id="gpuSysDiskTypeSelect">
                                    <option value="SSD" selected>💾 通用SSD (0.7元/GB)</option>
                                    <option value="超高IO">⚡ 超高IO SSD (1.2元/GB)</option>
                                    <option value="极速SSD">🚀 极速SSD (2元/GB)</option>
                                    <option value="SATA">💿 普通IO SATA (0.3元/GB)</option>
                                    <option value="SAS">📀 高IO SAS (0.4元/GB)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>容量</label>
                                <select id="gpuSystemDiskSelect">
                                    ${SYSTEM_DISK_SIZES.map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>价格</label>
                                <input type="text" id="gpuSysDiskPriceDisplay" class="price-display" readonly value="¥8/月">
                            </div>
                        </div>
                    </div>
                    
                    <!-- 数据盘选择 -->
                    <div class="disk-config-section">
                        <div class="disk-config-title">
                            <span class="disk-badge data">数据盘</span>
                            <span class="disk-config-tip">可选，高性能数据存储</span>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>类型</label>
                                <select id="gpuDataDiskTypeSelect">
                                    <option value="SSD" selected>💾 通用SSD (0.7元/GB)</option>
                                    <option value="超高IO">⚡ 超高IO SSD (1.2元/GB)</option>
                                    <option value="极速SSD">🚀 极速SSD (2元/GB)</option>
                                    <option value="SATA">💿 普通IO SATA (0.3元/GB)</option>
                                    <option value="SAS">📀 高IO SAS (0.4元/GB)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>容量</label>
                                <select id="gpuDataDiskSelect">
                                    <option value="DATA_0">无需数据盘</option>
                                    ${DATA_DISK_SIZES.filter(s => s.key !== 'DATA_0').map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>价格</label>
                                <input type="text" id="gpuDataDiskPriceDisplay" class="price-display" readonly placeholder="¥0">
                            </div>
                        </div>
                    </div>

                    <!-- 合计与数量 -->
                    <div class="form-row" style="margin-top: 12px;">
                        <div class="form-group">
                            <label><strong>套餐合计</strong></label>
                            <input type="text" id="gpuTotalPrice" class="price-display price-total" readonly value="¥0">
                        </div>
                        <div class="form-group">
                            <label>数量</label>
                            <input type="number" id="gpuQty" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="addGPUBtn">添加到报价单</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 按系列显示价格参考表
        Object.values(groupedBySeries).forEach(({ series, families }) => {
            families.forEach(family => {
                const instances = getGPUInstancesByFamily(family.key);
                if (instances.length === 0) return;
                
                html += `
                    <div class="product-list-section">
                        <h3 class="section-title">${family.icon} ${family.name} 价格参考</h3>
                        <div class="price-table-wrapper">
                            <table class="price-table">
                                <thead>
                                    <tr>
                                        <th>规格</th>
                                        <th>vCPU</th>
                                        <th>内存</th>
                                        <th>GPU</th>
                                        <th>显存</th>
                                        <th>月租（元/月）</th>
                                        <th>年租（元/年）</th>
                                        <th>三年（元）</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${instances.map(inst => {
                                        const price = getGPUPrice(inst.key);
                                        if (!price) return '';
                                        const gpuInfo = typeof inst.gpu === 'number' ? `${inst.gpu}×${family.gpuModel}` : `${inst.gpu} ${family.gpuModel}`;
                                        return `
                                            <tr>
                                                <td class="type-cell">${inst.name}</td>
                                                <td>${inst.vcpu}核</td>
                                                <td>${inst.memory}G</td>
                                                <td>${gpuInfo}</td>
                                                <td>${inst.vram}GB</td>
                                                <td>¥${price.monthlyPrice.toLocaleString()}</td>
                                                <td>¥${price.yearlyPrice.toLocaleString()}</td>
                                                <td>¥${price.threeYearPrice.toLocaleString()}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="discount-tip">${series.remark}</div>
                    </div>
                `;
            });
        });
        
        return html;
    }
    
    // GPU事件绑定
    bindGPUEvents() {
        const gpuSeriesSelect = document.getElementById('gpuSeriesSelect');
        const gpuFamilySelect = document.getElementById('gpuFamilySelect');
        const gpuSpecSelect = document.getElementById('gpuSpecSelect');
        const gpuPriceDisplay = document.getElementById('gpuPriceDisplay');
        
        // 系统盘/数据盘元素
        const gpuSysDiskTypeSelect = document.getElementById('gpuSysDiskTypeSelect');
        const gpuSysDiskSelect = document.getElementById('gpuSystemDiskSelect');
        const gpuSysDiskPriceDisplay = document.getElementById('gpuSysDiskPriceDisplay');
        const gpuDataDiskTypeSelect = document.getElementById('gpuDataDiskTypeSelect');
        const gpuDataDiskSelect = document.getElementById('gpuDataDiskSelect');
        const gpuDataDiskPriceDisplay = document.getElementById('gpuDataDiskPriceDisplay');
        const gpuTotalPrice = document.getElementById('gpuTotalPrice');

        // 更新GPU套餐总价
        const updateGPUPackagePrice = () => {
            let total = 0;
            const gpuText = gpuPriceDisplay.value.replace(/[^0-9.]/g, '');
            if (gpuText) total += parseFloat(gpuText) || 0;
            const sysText = gpuSysDiskPriceDisplay.value.replace(/[^0-9.]/g, '');
            if (sysText) total += parseFloat(sysText) || 0;
            const dataText = gpuDataDiskPriceDisplay.value.replace(/[^0-9.]/g, '');
            if (dataText) total += parseFloat(dataText) || 0;
            gpuTotalPrice.value = `¥${total}`;
        };
        
        // 系列变更 -> 更新规格族选项
        gpuSeriesSelect?.addEventListener('change', () => {
            const seriesKey = gpuSeriesSelect.value;
            gpuPriceDisplay.value = '';
            
            if (!seriesKey) {
                gpuFamilySelect.innerHTML = '<option value="">-- 先选系列 --</option>';
                gpuFamilySelect.disabled = true;
                gpuSpecSelect.innerHTML = '<option value="">-- 先选规格族 --</option>';
                gpuSpecSelect.disabled = true;
                return;
            }
            
            const families = getGPUFamiliesBySeries(seriesKey);
            gpuFamilySelect.innerHTML = '<option value="">-- 选择规格族 --</option>' +
                families.map(f => `<option value="${f.key}">${f.icon} ${f.name}</option>`).join('');
            gpuFamilySelect.disabled = false;
            gpuSpecSelect.innerHTML = '<option value="">-- 先选规格族 --</option>';
            gpuSpecSelect.disabled = true;
        });
        
        // 规格族变更 -> 更新规格选项
        gpuFamilySelect?.addEventListener('change', () => {
            const familyKey = gpuFamilySelect.value;
            gpuPriceDisplay.value = '';
            
            if (!familyKey) {
                gpuSpecSelect.innerHTML = '<option value="">-- 先选规格族 --</option>';
                gpuSpecSelect.disabled = true;
                return;
            }
            
            const instances = getGPUInstancesByFamily(familyKey);
            const family = GPU_SPECS_FAMILY[familyKey];
            gpuSpecSelect.innerHTML = '<option value="">-- 选择规格 --</option>' +
                instances.map(inst => {
                    const gpuInfo = typeof inst.gpu === 'number' ? `${inst.gpu}×${family.gpuModel}` : `${inst.gpu} ${family.gpuModel}`;
                    return `<option value="${inst.key}">${inst.vcpu}核${inst.memory}G | ${gpuInfo} | 显存${inst.vram}GB</option>`;
                }).join('');
            gpuSpecSelect.disabled = false;
        });
        
        // 规格变更 -> 显示价格
        gpuSpecSelect?.addEventListener('change', () => {
            const instanceKey = gpuSpecSelect.value;
            if (!instanceKey) {
                gpuPriceDisplay.value = '';
                updateGPUPackagePrice();
                return;
            }
            const price = getGPUPrice(instanceKey);
            if (price) {
                gpuPriceDisplay.value = `¥${price.monthlyPrice.toLocaleString()}/月`;
            } else {
                gpuPriceDisplay.value = '';
            }
            updateGPUPackagePrice();
        });

        // GPU系统盘类型变更
        gpuSysDiskTypeSelect?.addEventListener('change', () => {
            const type = gpuSysDiskTypeSelect.value;
            const sizeKey = gpuSysDiskSelect.value;
            const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sizeKey);
            const sizeName = sysDisk ? sysDisk.name : '40GB';
            const diskKey = `${type}_${sizeName}`;
            const diskPrice = DISK_PRICES[diskKey];
            if (diskPrice) {
                gpuSysDiskPriceDisplay.value = `¥${diskPrice.price}/月`;
            } else {
                gpuSysDiskPriceDisplay.value = '-';
            }
            updateGPUPackagePrice();
        });
        
        // GPU系统盘容量变更
        gpuSysDiskSelect?.addEventListener('change', () => {
            const type = gpuSysDiskTypeSelect.value;
            const sizeKey = gpuSysDiskSelect.value;
            const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sizeKey);
            const sizeName = sysDisk ? sysDisk.name : '40GB';
            const diskKey = `${type}_${sizeName}`;
            const diskPrice = DISK_PRICES[diskKey];
            if (diskPrice) {
                gpuSysDiskPriceDisplay.value = `¥${diskPrice.price}/月`;
            } else {
                gpuSysDiskPriceDisplay.value = '-';
            }
            updateGPUPackagePrice();
        });

        // GPU数据盘类型变更
        gpuDataDiskTypeSelect?.addEventListener('change', () => {
            const type = gpuDataDiskTypeSelect.value;
            const sizeKey = gpuDataDiskSelect.value;
            if (!sizeKey || sizeKey === 'DATA_0') {
                gpuDataDiskPriceDisplay.value = '¥0';
            } else {
                const dataDisk = DATA_DISK_SIZES.find(s => s.key === sizeKey);
                const sizeName = dataDisk ? dataDisk.name : '100GB';
                const diskKey = `${type}_${sizeName}`;
                const diskPrice = DISK_PRICES[diskKey];
                if (diskPrice) {
                    gpuDataDiskPriceDisplay.value = `¥${diskPrice.price}/月`;
                } else {
                    gpuDataDiskPriceDisplay.value = '-';
                }
            }
            updateGPUPackagePrice();
        });

        // GPU数据盘容量变更
        gpuDataDiskSelect?.addEventListener('change', () => {
            const type = gpuDataDiskTypeSelect.value;
            const sizeKey = gpuDataDiskSelect.value;
            if (!sizeKey || sizeKey === 'DATA_0') {
                gpuDataDiskPriceDisplay.value = '¥0';
            } else {
                const dataDisk = DATA_DISK_SIZES.find(s => s.key === sizeKey);
                const sizeName = dataDisk ? dataDisk.name : '100GB';
                const diskKey = `${type}_${sizeName}`;
                const diskPrice = DISK_PRICES[diskKey];
                if (diskPrice) {
                    gpuDataDiskPriceDisplay.value = `¥${diskPrice.price}/月`;
                } else {
                    gpuDataDiskPriceDisplay.value = '-';
                }
            }
            updateGPUPackagePrice();
        });
        
        // 添加GPU按钮
        document.getElementById('addGPUBtn')?.addEventListener('click', () => {
            this.addGPUPackage();
        });
    }
    
    // 添加GPU云主机（套餐模式：GPU + 系统盘 + 数据盘）
    addGPUPackage() {
        const instanceKey = document.getElementById('gpuSpecSelect')?.value;
        const qty = parseInt(document.getElementById('gpuQty')?.value) || 1;
        const sysDiskType = document.getElementById('gpuSysDiskTypeSelect')?.value;
        const sysDiskKey = document.getElementById('gpuSystemDiskSelect')?.value;
        const dataDiskType = document.getElementById('gpuDataDiskTypeSelect')?.value;
        const dataDiskKey = document.getElementById('gpuDataDiskSelect')?.value;
        
        if (!instanceKey) { alert('请选择GPU规格'); return; }
        
        const gpuPrice = getGPUPrice(instanceKey);
        if (!gpuPrice) { alert('未找到对应价格'); return; }
        
        // 系统盘信息
        const sysDisk = SYSTEM_DISK_SIZES.find(s => s.key === sysDiskKey);
        const sysSizeName = sysDisk ? sysDisk.name : '40GB';
        const sysDiskPriceKey = `${sysDiskType}_${sysSizeName}`;
        const sysDiskInfo = DISK_PRICES[sysDiskPriceKey];
        const sysMonthly = sysDiskInfo ? sysDiskInfo.price : 0;
        const sysYearly = sysDiskInfo ? sysDiskInfo.yearlyPrice : 0;
        const sysThreeYear = sysDiskInfo ? sysDiskInfo.threeYearPrice : 0;

        // 数据盘信息
        let dataDiskInfoObj = null;
        let dataMonthly = 0, dataYearly = 0, dataThreeYear = 0;
        if (dataDiskKey && dataDiskKey !== 'DATA_0') {
            const dataDisk = DATA_DISK_SIZES.find(d => d.key === dataDiskKey);
            const dataSizeName = dataDisk ? dataDisk.name : '100GB';
            const dataDiskPriceKey = `${dataDiskType}_${dataSizeName}`;
            dataDiskInfoObj = DISK_PRICES[dataDiskPriceKey];
            if (dataDiskInfoObj) {
                dataMonthly = dataDiskInfoObj.price;
                dataYearly = dataDiskInfoObj.yearlyPrice;
                dataThreeYear = dataDiskInfoObj.threeYearPrice;
            }
        }

        // 套餐合计
        const monthlyPrice = gpuPrice.monthlyPrice + sysMonthly + dataMonthly;
        const yearlyPrice = gpuPrice.yearlyPrice + sysYearly + dataYearly;
        const threeYearPrice = gpuPrice.threeYearPrice + sysThreeYear + dataThreeYear;

        const diskTypeNameMap = { 'SSD': '通用SSD', '超高IO': '超高IO SSD', '极速SSD': '极速SSD', 'SATA': 'SATA', 'SAS': 'SAS' };

        // 套餐名称
        const packageName = `${gpuPrice.spec} | 系统${diskTypeNameMap[sysDiskType]||sysDiskType}${sysSizeName}${
            dataDiskInfoObj ? ` | 数据${diskTypeNameMap[dataDiskType]||dataDiskType}${(DATA_DISK_SIZES.find(d=>d.key===dataDiskKey)||{}).name||''}` : ''
        }`;

        const item = {
            id: Date.now(),
            categoryId: 'gpu',
            categoryName: 'GPU云主机',
            productKey: instanceKey,
            name: 'GPU云主机套餐',
            spec: packageName,
            monthlyPrice: monthlyPrice,
            yearlyPrice: yearlyPrice,
            threeYearPrice: threeYearPrice,
            unit: '月',
            qty: qty,
            remark: '',
            isPackage: true,
            packageDetails: {
                compute: {
                    name: 'GPU实例',
                    spec: gpuPrice.spec,
                    monthlyPrice: gpuPrice.monthlyPrice,
                    yearlyPrice: gpuPrice.yearlyPrice,
                    threeYearPrice: gpuPrice.threeYearPrice
                },
                systemDisk: {
                    name: '系统盘',
                    spec: (diskTypeNameMap[sysDiskType]||sysDiskType) + ' ' + sysSizeName,
                    monthlyPrice: sysMonthly,
                    yearlyPrice: sysYearly,
                    threeYearPrice: sysThreeYear
                },
                ...(dataDiskInfoObj ? {
                    dataDisk: {
                        name: '数据盘',
                        spec: (diskTypeNameMap[dataDiskType]||dataDiskType) + ' ' + (DATA_DISK_SIZES.find(d=>d.key===dataDiskKey)||{}).name,
                        monthlyPrice: dataMonthly,
                        yearlyPrice: dataYearly,
                        threeYearPrice: dataThreeYear
                    }
                } : {})
            }
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('gpuSpecSelect').value = '';
        document.getElementById('gpuPriceDisplay').value = '';
    }
    
    // 添加CBR云服务备份
    addCBR() {
        const typeKey = document.getElementById('cbrTypeSelect')?.value;
        const capacityTB = parseFloat(document.getElementById('cbrCapacity')?.value) || 0;
        const capacityGB = capacityTB * 1024;
        const qty = parseInt(document.getElementById('cbrQty')?.value) || 1;
        
        if (!typeKey) { alert('请选择存储库类型'); return; }
        if (capacityTB <= 0) { alert('请输入有效的容量（TB）'); return; }
        
        const price = getCBRPrice(typeKey, capacityGB);
        if (!price) { alert('未找到对应价格'); return; }
        
        const item = {
            id: Date.now(),
            categoryId: 'backup',
            categoryName: '备份服务',
            productKey: `CBR_${typeKey}_${capacityTB}TB`,
            name: price.name,
            spec: `${price.spec.split('|')[0]}| ${capacityTB}TB`,
            monthlyPrice: price.monthlyPrice,
            yearlyPrice: price.yearlyPrice,
            threeYearPrice: price.threeYearPrice,
            unit: '月',
            qty: qty,
            remark: price.remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
        
        // 重置表单
        document.getElementById('cbrTypeSelect').value = '';
        document.getElementById('cbrPriceDisplay').value = '';
    }
    
    addOtherProduct() {
        const productKey = document.getElementById('otherProductSelect').value;
        const qty = parseInt(document.getElementById('otherQty').value) || 1;
        const remark = document.getElementById('otherRemark').value.trim();
        
        if (!productKey) {
            alert('请选择产品规格');
            return;
        }
        
        const product = getProductDetail(this.currentCategory, productKey);
        if (!product) return;
        
        this.addToQuoteList(product, qty, remark);
        
        // 重置表单
        document.getElementById('otherRemark').value = '';
    }
    
    addToQuoteList(product, qty, remark) {
        const item = {
            id: Date.now(),
            categoryId: this.currentCategory,
            categoryName: getCategoryName(this.currentCategory),
            productKey: product.key,
            name: product.name,
            spec: product.spec,
            monthlyPrice: product.monthlyPrice,
            yearlyPrice: product.yearlyPrice,
            threeYearPrice: product.threeYearPrice,
            unit: product.unit,
            qty: qty,
            remark: remark,
            isPackage: false
        };
        
        this.quoteList.push(item);
        this.renderQuoteList();
        this.updateCategoryCounts();
    }
    
    updateCategoryCounts() {
        const categories = getCategories();
        categories.forEach(cat => {
            const count = this.getCategoryCount(cat.id);
            document.getElementById(`count-${cat.id}`).textContent = count;
        });
    }
    
    renderQuoteList() {
        const container = document.getElementById('quoteTableBody');
        
        if (this.quoteList.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        <div class="icon">📋</div>
                        <p>报价清单为空，请选择产品添加</p>
                    </td>
                </tr>
            `;
            this.renderSummary();
            return;
        }
        
        container.innerHTML = this.quoteList.map((item, index) => {
            if (item.isPackage) {
                // 云主机套餐
                return `
                    <tr class="package-row" data-id="${item.id}">
                        <td>${index + 1}</td>
                        <td>
                            <div class="package-name">${item.name}</div>
                            <div class="package-spec">${item.spec}</div>
                        </td>
                        <td colspan="3">
                            <div class="package-detail">
                                <span class="detail-item">云主机: ¥${item.packageDetails.compute.monthlyPrice}/月</span>
                                ${item.packageDetails.systemDisk ? `<span class="detail-item">系统盘: ¥${item.packageDetails.systemDisk.monthlyPrice}/月</span>` : ''}
                                ${item.packageDetails.dataDisk ? `<span class="detail-item">数据盘: ¥${item.packageDetails.dataDisk.monthlyPrice}/月</span>` : ''}
                            </div>
                        </td>
                        <td class="qty-cell">
                            <input type="number" class="qty-input" value="${item.qty}" 
                                   min="1" onchange="app.updateQty(${item.id}, this.value)">
                        </td>
                        <td class="price-cell">¥${item.monthlyPrice.toLocaleString()}</td>
                        <td class="discount-cell">
                            <input type="number" class="discount-input" value="${item.discount || 1}" 
                                   min="0" max="1" step="0.01" onchange="app.updateDiscount(${item.id}, this.value)">
                        </td>
                        <td>
                            <button class="btn-delete" onclick="app.removeItem(${item.id})" title="删除">🗑️</button>
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr data-id="${item.id}">
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td class="spec">${item.spec}</td>
                        <td class="qty-cell">
                            <input type="number" class="qty-input" value="${item.qty}" 
                                   min="1" onchange="app.updateQty(${item.id}, this.value)">
                        </td>
                        <td class="price-cell">¥${item.monthlyPrice.toLocaleString()}</td>
                        <td class="price-cell">¥${item.yearlyPrice.toLocaleString()}</td>
                        <td class="price-cell">¥${item.threeYearPrice.toLocaleString()}</td>
                        <td class="discount-cell">
                            <input type="number" class="discount-input" value="${item.discount || 1}" 
                                   min="0" max="1" step="0.01" onchange="app.updateDiscount(${item.id}, this.value)">
                        </td>
                        <td>
                            <button class="btn-delete" onclick="app.removeItem(${item.id})" title="删除">🗑️</button>
                        </td>
                    </tr>
                `;
            }
        }).join('');
        
        this.renderSummary();
    }
    
    renderSummary() {
        const container = document.getElementById('summaryContent');
        
        // 计算合计
        let totalMonthly = 0;
        let totalYearly = 0;
        let totalThreeYear = 0;
        let totalDiscMonthly = 0;
        let totalDiscYearly = 0;
        let totalDiscThreeYear = 0;
        
        this.quoteList.forEach(item => {
            const d = item.discount || 1;
            totalMonthly += item.monthlyPrice * item.qty;
            totalYearly += item.yearlyPrice * item.qty;
            totalThreeYear += item.threeYearPrice * item.qty;
            totalDiscMonthly += d * item.monthlyPrice * item.qty;
            totalDiscYearly += d * item.yearlyPrice * item.qty;
            totalDiscThreeYear += d * item.threeYearPrice * item.qty;
        });
        
        const count = this.quoteList.length;
        
        container.innerHTML = `
            <div class="summary-title">💡 费用汇总</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">标准月租合计</span>
                    <span class="summary-value">¥${totalMonthly.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">折扣月租合计</span>
                    <span class="summary-value highlight">¥${totalDiscMonthly.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">标准年租合计</span>
                    <span class="summary-value">¥${totalYearly.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">折扣年租合计</span>
                    <span class="summary-value highlight">¥${totalDiscYearly.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">标准三年合计</span>
                    <span class="summary-value">¥${totalThreeYear.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">折扣三年合计</span>
                    <span class="summary-value highlight">¥${totalDiscThreeYear.toLocaleString()}</span>
                </div>
                <div class="summary-item total">
                    <span class="summary-label">产品/套餐数量</span>
                    <span class="summary-value">${count} 个</span>
                </div>
            </div>
        `;
    }
    
    updateQty(id, value) {
        const qty = parseInt(value) || 1;
        const item = this.quoteList.find(i => i.id === id);
        if (item) {
            item.qty = Math.max(1, qty);
            this.renderSummary();
        }
    }
    
    updateDiscount(id, value) {
        let discount = parseFloat(value);
        if (isNaN(discount)) discount = 1;
        discount = Math.min(1, Math.max(0, discount));
        const item = this.quoteList.find(i => i.id === id);
        if (item) {
            item.discount = discount;
            this.renderSummary();
        }
    }
    
    removeItem(id) {
        this.quoteList = this.quoteList.filter(item => item.id !== id);
        this.renderQuoteList();
        this.updateCategoryCounts();
    }
    
    clearQuote() {
        if (this.quoteList.length === 0) return;
        
        if (confirm('确定要清空当前报价单吗？')) {
            this.quoteList = [];
            this.renderQuoteList();
            this.updateCategoryCounts();
        }
    }
    
    async exportExcel() {
        if (this.quoteList.length === 0) {
            alert('请先添加产品到报价单');
            return;
        }

        // 注册码验证
        const licensed = await this.checkLicense();
        if (!licensed) {
            // 跳转到独立验证页面（100%可靠，不依赖任何CSS/弹窗）
            window.location.href = 'verify.html';
            return;
        }
        
        this.doExportExcel();
    }

    // 每次导出都通过云端验证注册码（不依赖本地缓存）
    async checkLicense() {
        const DEFAULT_CODE = '20262026';
        try {
            const savedCode = localStorage.getItem('ctyun_license_code');
            if (!savedCode) return false;
            
            // 默认注册码：本地直接放行，不走网络
            if (savedCode === DEFAULT_CODE) return true;
            
            // 非默认码：每次都调云端校验，防止绕过
            const result = await window.callCloudFunction('verifyLicense', {action:'verify', code: savedCode});
            if (result && result.success) return true;
            
            // 云端验证失败，清除缓存
            localStorage.removeItem('ctyun_license_verified');
            localStorage.removeItem('ctyun_license_code');
            return false;
        } catch(e) {
            // 网络异常时仅保留默认码的授权
            console.warn('License verify network error:', e);
            const savedCode = localStorage.getItem('ctyun_license_code') || '';
            if (savedCode !== DEFAULT_CODE) {
                localStorage.removeItem('ctyun_license_verified');
                localStorage.removeItem('ctyun_license_code');
            }
            return savedCode === DEFAULT_CODE;
        }
    }


    // 注意：注册码验证已改为跳转到 verify.html 独立页面，不再使用弹窗
    async callVerifyAPI(code) {
        // 使用全局 callCloudFunction HTTP API（无外部依赖）
        if (typeof window.callCloudFunction === 'function') {
            return await window.callCloudFunction('verifyLicense', {action:'verify', code});
        }
        throw new Error('验证接口不可用');
    }

    // 执行实际导出
    async doExportExcel() {
        const projectName = this.projectName || '未命名项目';
        const dateStr = this.date.replace(/\//g, '-');
        
        // 产品大类颜色映射
        const CATEGORY_COLORS = {
            '计算资源': { data: 'FFDDEBF7', sub: 'FFBDD7EE', border: 'FF9BC2E6' },
            '存储资源': { data: 'FFFCE4D6', sub: 'FFF8CBAD', border: 'FFED7D31' },
            '网络资源': { data: 'FFE2EFDA', sub: 'FFC6E0B4', border: 'FF70AD47' },
            '安全产品': { data: 'FFFFF2CC', sub: 'FFFFE699', border: 'FFFFC000' },
            '备份服务': { data: 'FFE4DFEC', sub: 'FFD5DCE4', border: 'FF7030A0' },
            'GPU云主机': { data: 'FFFBE5D6', sub: 'FFF4B183', border: 'FFC55A11' }
        };

        if (typeof ExcelJS === 'undefined') {
            alert('Excel导出库未加载，请刷新页面重试');
            return;
        }

        const wb = new ExcelJS.Workbook();
        wb.creator = '天翼云报价工具';
        wb.created = new Date();
        const ws = wb.addWorksheet('天翼云报价单');

        // 列定义
        ws.columns = [
            { width: 6 },   // A 序号
            { width: 14 },  // B 产品大类
            { width: 22 },  // C 产品名称
            { width: 42 },  // D 规格配置
            { width: 6 },   // E 数量
            { width: 15 },  // F 月租单价
            { width: 15 },  // G 年租单价
            { width: 15 },  // H 三年单价
            { width: 15 },  // I 月租总价
            { width: 15 },  // J 年租总价
            { width: 15 },  // K 三年总价
            { width: 8 },   // L 折扣
            { width: 15 },  // M 折扣月租总价
            { width: 15 },  // N 折扣年租总价
            { width: 15 },  // O 折扣三年总价
            { width: 22 }   // P 备注
        ];

        // 通用边框
        const thinBorder = { style: 'thin' };
        const makeBorder = (color) => ({
            top: { ...thinBorder, color: { argb: color } },
            bottom: { ...thinBorder, color: { argb: color } },
            left: { ...thinBorder, color: { argb: color } },
            right: { ...thinBorder, color: { argb: color } }
        });

        // 第1行：标题
        ws.mergeCells('A1:P1');
        const titleCell = ws.getCell('A1');
        titleCell.value = `天翼云报价单 — ${projectName}`;
        titleCell.font = { name: '微软雅黑', size: 18, bold: true, color: { argb: 'FF1F4E79' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } };
        titleCell.border = makeBorder('FF8DB4E2');
        ws.getRow(1).height = 36;

        // 第2行：副标题
        ws.mergeCells('A2:P2');
        const subCell = ws.getCell('A2');
        subCell.value = `报价日期：${this.date}`;
        subCell.font = { name: '微软雅黑', size: 10, color: { argb: 'FF4472C4' } };
        subCell.alignment = { horizontal: 'left', vertical: 'middle' };
        subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } };
        subCell.border = makeBorder('FF8DB4E2');
        ws.getRow(2).height = 22;

        // 第3行：空行
        ws.getRow(3).height = 8;

        // 第4行：表头
        const headers = [
            '序号', '产品大类', '产品名称', '规格配置', '数量',
            '标准月租单价', '标准年租单价', '标准三年单价',
            '标准月租总价', '标准年租总价', '标准三年总价',
            '折扣', '折扣月租总价', '折扣年租总价', '折扣三年总价', '备注'
        ];
        const headerRow = ws.getRow(4);
        headerRow.height = 26;
        headers.forEach((h, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = h;
            const isDiscountCol = i === 11;
            const isDiscountSection = i >= 12;
            cell.font = { name: '微软雅黑', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isDiscountCol || isDiscountSection ? 'FF2E75B6' : 'FF4472C4' } };
            cell.border = makeBorder('FF2F5496');
        });

        // 按分类汇总
        const categories = getCategories();
        let serialNum = 1;
        let currentRow = 5;
        const priceNumFmt = '#,##0.00';
        const discountNumFmt = '0%';

        // 记录每个分类的数据行范围（用于小计SUM公式）
        const catRowRanges = {};
        // 记录所有小计行号（用于总合计SUM公式）
        const subtotalRows = [];

        categories.forEach(cat => {
            const catItems = this.quoteList.filter(item => item.categoryId === cat.id);
            if (catItems.length === 0) return;
            
            const colors = CATEGORY_COLORS[cat.name] || { data: 'FFFFFFFF', sub: 'FFD6E4F0', border: 'FFD9D9D9' };
            catRowRanges[cat.name] = { dataRows: [], detailRows: [] };

            // 分类标题行
            const catRow = ws.getRow(currentRow);
            ws.mergeCells(currentRow, 1, currentRow, 16);
            const catCell = catRow.getCell(1);
            catCell.value = cat.name;
            catCell.font = { name: '微软雅黑', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
            catCell.alignment = { horizontal: 'left', vertical: 'middle' };
            catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.sub } };
            catCell.border = makeBorder(colors.border);
            for (let c = 2; c <= 16; c++) {
                const mc = catRow.getCell(c);
                mc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.sub } };
                mc.border = makeBorder(colors.border);
            }
            catRow.height = 22;
            currentRow++;

            catItems.forEach(item => {
                const discount = item.discount || 1;
                const r = currentRow; // 当前数据行号

                // 设置单元格值的辅助函数
                const setCell = (col, value, opts = {}) => {
                    const cell = ws.getCell(`${col}${r}`);
                    cell.value = value;
                    if (opts.font) cell.font = opts.font;
                    if (opts.alignment) cell.alignment = opts.alignment;
                    if (opts.fill) cell.fill = opts.fill;
                    if (opts.border) cell.border = opts.border;
                    if (opts.numFmt) cell.numFmt = opts.numFmt;
                };

                const dataFont = { name: '微软雅黑', size: 10, color: { argb: 'FF333333' } };
                const dataFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.data } };
                const dataBorder = makeBorder(colors.border);
                const centerAlign = { horizontal: 'center', vertical: 'middle' };
                const rightAlign = { horizontal: 'right', vertical: 'middle' };
                const leftAlign = { horizontal: 'left', vertical: 'middle' };

                // A 序号
                setCell('A', serialNum++, { font: dataFont, alignment: centerAlign, fill: dataFill, border: dataBorder });
                // B 产品大类
                setCell('B', item.categoryName, { font: dataFont, alignment: centerAlign, fill: dataFill, border: dataBorder });
                // C 产品名称
                setCell('C', item.name, { font: dataFont, alignment: leftAlign, fill: dataFill, border: dataBorder });
                // D 规格配置
                setCell('D', item.spec, { font: dataFont, alignment: leftAlign, fill: dataFill, border: dataBorder });
                // E 数量
                setCell('E', item.qty, { font: dataFont, alignment: centerAlign, fill: dataFill, border: dataBorder });
                // F 月租单价
                setCell('F', item.monthlyPrice, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // G 年租单价
                setCell('G', item.yearlyPrice, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // H 三年单价
                setCell('H', item.threeYearPrice, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // I 月租总价 = 单价×数量
                setCell('I', { formula: `F${r}*E${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // J 年租总价 = 年单价×数量
                setCell('J', { formula: `G${r}*E${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // K 三年总价 = 三年单价×数量
                setCell('K', { formula: `H${r}*E${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // L 折扣（用户可修改）
                setCell('L', discount, { font: { ...dataFont, color: { argb: 'FF0000FF' } }, alignment: centerAlign, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }, border: dataBorder, numFmt: discountNumFmt });
                // M 折扣月租总价 = 月租总价×折扣
                setCell('M', { formula: `I${r}*L${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // N 折扣年租总价 = 年租总价×折扣
                setCell('N', { formula: `J${r}*L${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // O 折扣三年总价 = 三年总价×折扣
                setCell('O', { formula: `K${r}*L${r}` }, { font: dataFont, alignment: rightAlign, fill: dataFill, border: dataBorder, numFmt: priceNumFmt });
                // P 备注
                setCell('P', item.remark || '', { font: dataFont, alignment: leftAlign, fill: dataFill, border: dataBorder });

                catRowRanges[cat.name].dataRows.push(r);
                ws.getRow(currentRow).height = 20;
                currentRow++;

                // 套餐明细行（仅展示配置说明，不重复计价）
                if (item.isPackage && item.packageDetails) {
                    const detailItems = [];
                    if (item.packageDetails.systemDisk) detailItems.push(item.packageDetails.systemDisk);
                    if (item.packageDetails.dataDisk) detailItems.push(item.packageDetails.dataDisk);
                    
                    const detailFont = { name: '微软雅黑', size: 9, italic: true, color: { argb: 'FF595959' } };
                    
                    detailItems.forEach(d => {
                        const dr = currentRow;
                        const dFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.data } };
                        const setDetail = (col, value, opts = {}) => {
                            const cell = ws.getCell(`${col}${dr}`);
                            cell.value = value;
                            if (opts.font) cell.font = opts.font;
                            if (opts.alignment) cell.alignment = opts.alignment;
                            if (opts.fill) cell.fill = opts.fill;
                            if (opts.border) cell.border = opts.border;
                            if (opts.numFmt) cell.numFmt = opts.numFmt;
                        };

                        setDetail('A', '', { font: detailFont, alignment: centerAlign, fill: dFill, border: dataBorder });
                        setDetail('B', '', { font: detailFont, alignment: centerAlign, fill: dFill, border: dataBorder });
                        setDetail('C', '  └ ' + d.name, { font: detailFont, alignment: leftAlign, fill: dFill, border: dataBorder });
                        setDetail('D', d.spec, { font: detailFont, alignment: leftAlign, fill: dFill, border: dataBorder });
                        setDetail('E', '', { font: detailFont, alignment: centerAlign, fill: dFill, border: dataBorder });
                        // 明细行：仅展示价格信息供参考，不参与计价汇总（金额列为0或留空）
                        setDetail('F', null, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder });
                        setDetail('G', null, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder });
                        setDetail('H', null, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder });
                        setDetail('I', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('J', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('K', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('L', '', { font: detailFont, alignment: centerAlign, fill: dFill, border: dataBorder });
                        setDetail('M', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('N', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('O', 0, { font: detailFont, alignment: rightAlign, fill: dFill, border: dataBorder, numFmt: priceNumFmt });
                        setDetail('P', '已包含在套餐内', { font: { ...detailFont, color: { argb: 'FF0070C0' } }, alignment: leftAlign, fill: dFill, border: dataBorder });

                        catRowRanges[cat.name].detailRows.push(dr);
                        ws.getRow(currentRow).height = 18;
                        currentRow++;
                    });
                }
            });

            // 分类小计行 - 使用SUM公式
            const allRows = [...catRowRanges[cat.name].dataRows, ...catRowRanges[cat.name].detailRows];
            const subR = currentRow;
            const subFont = { name: '微软雅黑', size: 10, bold: true, color: { argb: 'FF1F4E79' } };
            const subFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.sub } };
            const subBorder = makeBorder(colors.border);
            const subRightAlign = { horizontal: 'right', vertical: 'middle' };
            const subCenterAlign = { horizontal: 'center', vertical: 'middle' };
            const subLeftAlign = { horizontal: 'left', vertical: 'middle' };

            const setSub = (col, value, opts = {}) => {
                const cell = ws.getCell(`${col}${subR}`);
                cell.value = value;
                if (opts.font) cell.font = opts.font;
                if (opts.alignment) cell.alignment = opts.alignment;
                if (opts.fill) cell.fill = opts.fill;
                if (opts.border) cell.border = opts.border;
                if (opts.numFmt) cell.numFmt = opts.numFmt;
            };

            setSub('A', '', { font: subFont, alignment: subLeftAlign, fill: subFill, border: subBorder });
            setSub('B', `${cat.name} 小计`, { font: subFont, alignment: subLeftAlign, fill: subFill, border: subBorder });
            setSub('C', '', { font: subFont, alignment: subLeftAlign, fill: subFill, border: subBorder });
            setSub('D', '', { font: subFont, alignment: subLeftAlign, fill: subFill, border: subBorder });
            // E 数量合计
            const sumE = allRows.map(row => `E${row}`).join('+');
            setSub('E', { formula: sumE }, { font: subFont, alignment: subCenterAlign, fill: subFill, border: subBorder });
            setSub('F', '', { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder });
            setSub('G', '', { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder });
            setSub('H', '', { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder });
            // I/K/J 标准总价合计
            const sumI = allRows.map(row => `I${row}`).join('+');
            const sumJ = allRows.map(row => `J${row}`).join('+');
            const sumK = allRows.map(row => `K${row}`).join('+');
            setSub('I', { formula: sumI }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('J', { formula: sumJ }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('K', { formula: sumK }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('L', '', { font: subFont, alignment: subCenterAlign, fill: subFill, border: subBorder });
            // M/N/O 折扣总价合计
            const sumM = allRows.map(row => `M${row}`).join('+');
            const sumN = allRows.map(row => `N${row}`).join('+');
            const sumO = allRows.map(row => `O${row}`).join('+');
            setSub('M', { formula: sumM }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('N', { formula: sumN }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('O', { formula: sumO }, { font: subFont, alignment: subRightAlign, fill: subFill, border: subBorder, numFmt: priceNumFmt });
            setSub('P', '', { font: subFont, alignment: subLeftAlign, fill: subFill, border: subBorder });

            ws.getRow(currentRow).height = 22;
            subtotalRows.push(subR);
            currentRow++;
        });

        // 总合计行 - 使用SUM公式引用各小计行
        const tR = currentRow;
        const totalFont = { name: '微软雅黑', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        const totalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
        const totalBorder = makeBorder('FF1F4E79');
        const totalRightAlign = { horizontal: 'right', vertical: 'middle' };
        const totalCenterAlign = { horizontal: 'center', vertical: 'middle' };
        const totalLeftAlign = { horizontal: 'left', vertical: 'middle' };

        const setTotal = (col, value, opts = {}) => {
            const cell = ws.getCell(`${col}${tR}`);
            cell.value = value;
            if (opts.font) cell.font = opts.font;
            if (opts.alignment) cell.alignment = opts.alignment;
            if (opts.fill) cell.fill = opts.fill;
            if (opts.border) cell.border = opts.border;
            if (opts.numFmt) cell.numFmt = opts.numFmt;
        };

        // 辅助：小计行列求和公式
        const sumSubCol = (col) => subtotalRows.map(r => `${col}${r}`).join('+');

        setTotal('A', '', { font: totalFont, alignment: totalLeftAlign, fill: totalFill, border: totalBorder });
        setTotal('B', '总合计', { font: totalFont, alignment: totalLeftAlign, fill: totalFill, border: totalBorder });
        setTotal('C', '', { font: totalFont, alignment: totalLeftAlign, fill: totalFill, border: totalBorder });
        setTotal('D', '', { font: totalFont, alignment: totalLeftAlign, fill: totalFill, border: totalBorder });
        setTotal('E', { formula: sumSubCol('E') }, { font: totalFont, alignment: totalCenterAlign, fill: totalFill, border: totalBorder });
        setTotal('F', '', { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder });
        setTotal('G', '', { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder });
        setTotal('H', '', { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder });
        setTotal('I', { formula: sumSubCol('I') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('J', { formula: sumSubCol('J') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('K', { formula: sumSubCol('K') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('L', '', { font: totalFont, alignment: totalCenterAlign, fill: totalFill, border: totalBorder });
        setTotal('M', { formula: sumSubCol('M') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('N', { formula: sumSubCol('N') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('O', { formula: sumSubCol('O') }, { font: totalFont, alignment: totalRightAlign, fill: totalFill, border: totalBorder, numFmt: priceNumFmt });
        setTotal('P', '', { font: totalFont, alignment: totalLeftAlign, fill: totalFill, border: totalBorder });

        ws.getRow(currentRow).height = 28;

        // 冻结表头
        ws.views = [{ state: 'frozen', ySplit: 4 }];

        // 下载
        const filename = `天翼云报价单_${projectName}_${dateStr}.xlsx`;
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// 获取产品详情（全局函数）
function getProductDetail(categoryId, productKey) {
    const category = PRICE_DATA[categoryId];
    if (!category || !category.products) return null;
    const product = category.products[productKey];
    if (!product) return null;
    return {
        key: productKey,
        name: product.name,
        spec: product.spec || '',
        monthlyPrice: product.monthlyPrice || 0,
        yearlyPrice: product.yearlyPrice || 0,
        threeYearPrice: product.threeYearPrice || 0,
        unit: product.unit || '月'
    };
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CloudQuoteApp();
    // 从验证页返回时自动下载
    if (window.location.search.includes('download=1')) {
        setTimeout(() => app.doExportExcel(), 500);
        // 清除URL参数
        history.replaceState(null, '', window.location.pathname);
    }
});
