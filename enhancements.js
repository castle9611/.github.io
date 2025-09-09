// 功能增强模块
class EnhancementManager {
    constructor() {
        this.enhancements = {};
        this.init();
    }

    init() {
        this.setupGlobalEnhancements();
        this.setupKeyboardShortcuts();
        this.setupPerformanceOptimizations();
    }

    setupGlobalEnhancements() {
        // 添加全局搜索功能
        this.addGlobalSearch();
        
        // 添加数据导出功能
        this.addDataExport();
        
        // 添加主题自定义功能
        this.addThemeCustomization();
        
        // 添加统计面板
        this.addStatisticsPanel();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+S: 打开统计面板
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.showStatisticsPanel();
            }
            
            // Ctrl+Shift+E: 导出数据
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                this.exportAllData();
            }
            
            // Ctrl+Shift+T: 打开主题设置
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.showThemeSettings();
            }
        });
    }

    setupPerformanceOptimizations() {
        // 图片懒加载
        this.setupLazyLoading();
        
        // 防抖优化
        this.setupDebouncing();
        
        // 缓存优化
        this.setupCaching();
    }

    addGlobalSearch() {
        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.className = 'global-search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="global-search" placeholder="搜索功能..." />
                <button id="search-btn">🔍</button>
            </div>
            <div id="search-results" class="search-results"></div>
        `;
        
        // 插入到页面
        const header = document.querySelector('.header');
        header.appendChild(searchContainer);
        
        // 搜索功能
        const searchInput = document.getElementById('global-search');
        const searchBtn = document.getElementById('search-btn');
        const searchResults = document.getElementById('search-results');
        
        const searchFunctions = [
            { name: '2048游戏', category: '游戏', action: () => window.app.openGame('2048') },
            { name: '记忆配对', category: '游戏', action: () => window.app.openGame('memory') },
            { name: '贪吃蛇', category: '游戏', action: () => window.app.openGame('snake') },
            { name: '俄罗斯方块', category: '游戏', action: () => window.app.openGame('tetris') },
            { name: '扫雷', category: '游戏', action: () => window.app.openGame('minesweeper') },
            { name: '番茄钟', category: '工具', action: () => window.app.openTool('pomodoro') },
            { name: '待办清单', category: '工具', action: () => window.app.openTool('todo') },
            { name: '计算器', category: '工具', action: () => window.app.openTool('calculator') },
            { name: '密码生成器', category: '工具', action: () => window.app.openTool('password') },
            { name: '二维码生成器', category: '工具', action: () => window.app.openTool('qr') },
            { name: '单位转换器', category: '工具', action: () => window.app.openTool('converter') },
            { name: '英语学习', category: '学习', action: () => window.app.openLearning('english') },
            { name: '古诗词学习', category: '学习', action: () => window.app.openLearning('poetry') },
            { name: '美文阅读', category: '学习', action: () => window.app.openLearning('prose') }
        ];
        
        const performSearch = (query) => {
            if (!query.trim()) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            const results = searchFunctions.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );
            
            if (results.length > 0) {
                searchResults.innerHTML = results.map(item => `
                    <div class="search-result-item" onclick="window.enhancementManager.executeSearchAction('${item.name}')">
                        <span class="result-name">${item.name}</span>
                        <span class="result-category">${item.category}</span>
                    </div>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="no-results">未找到相关功能</div>';
                searchResults.style.display = 'block';
            }
        };
        
        searchInput.addEventListener('input', this.debounce(performSearch, 300));
        searchBtn.addEventListener('click', () => performSearch(searchInput.value));
        
        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    executeSearchAction(functionName) {
        const searchFunctions = [
            { name: '2048游戏', action: () => window.app.openGame('2048') },
            { name: '记忆配对', action: () => window.app.openGame('memory') },
            { name: '贪吃蛇', action: () => window.app.openGame('snake') },
            { name: '俄罗斯方块', action: () => window.app.openGame('tetris') },
            { name: '扫雷', action: () => window.app.openGame('minesweeper') },
            { name: '番茄钟', action: () => window.app.openTool('pomodoro') },
            { name: '待办清单', action: () => window.app.openTool('todo') },
            { name: '计算器', action: () => window.app.openTool('calculator') },
            { name: '密码生成器', action: () => window.app.openTool('password') },
            { name: '二维码生成器', action: () => window.app.openTool('qr') },
            { name: '单位转换器', action: () => window.app.openTool('converter') },
            { name: '英语学习', action: () => window.app.openLearning('english') },
            { name: '古诗词学习', action: () => window.app.openLearning('poetry') },
            { name: '美文阅读', action: () => window.app.openLearning('prose') }
        ];
        
        const functionItem = searchFunctions.find(item => item.name === functionName);
        if (functionItem) {
            functionItem.action();
            document.getElementById('search-results').style.display = 'none';
            document.getElementById('global-search').value = '';
        }
    }

    addDataExport() {
        this.exportAllData = () => {
            const allData = {
                settings: JSON.parse(localStorage.getItem('officeFishSettings') || '{}'),
                learningData: JSON.parse(localStorage.getItem('officeFish_learningData') || '{}'),
                gameData: this.getGameData(),
                toolData: this.getToolData(),
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `office-fish-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            window.app.showNotification('数据导出成功', 'success');
        };
    }

    getGameData() {
        const gameData = {};
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('officeFish_game_')) {
                gameData[key] = localStorage.getItem(key);
            }
        });
        return gameData;
    }

    getToolData() {
        const toolData = {};
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('officeFish_tool_')) {
                toolData[key] = localStorage.getItem(key);
            }
        });
        return toolData;
    }

    addThemeCustomization() {
        this.showThemeSettings = () => {
            const modalBody = document.getElementById('modal-body');
            const modalTitle = document.getElementById('modal-title');
            
            modalTitle.textContent = '主题设置';
            modalBody.innerHTML = `
                <div class="theme-settings">
                    <div class="theme-section">
                        <h3>基础主题</h3>
                        <div class="theme-options">
                            <button class="theme-option" data-theme="light">浅色主题</button>
                            <button class="theme-option" data-theme="dark">深色主题</button>
                            <button class="theme-option" data-theme="auto">跟随系统</button>
                        </div>
                    </div>
                    <div class="theme-section">
                        <h3>自定义颜色</h3>
                        <div class="color-options">
                            <div class="color-option">
                                <label>主色调</label>
                                <input type="color" id="accent-color" value="#3b82f6">
                            </div>
                            <div class="color-option">
                                <label>成功色</label>
                                <input type="color" id="success-color" value="#10b981">
                            </div>
                            <div class="color-option">
                                <label>警告色</label>
                                <input type="color" id="warning-color" value="#f59e0b">
                            </div>
                            <div class="color-option">
                                <label>错误色</label>
                                <input type="color" id="error-color" value="#ef4444">
                            </div>
                        </div>
                    </div>
                    <div class="theme-controls">
                        <button class="btn btn-primary" id="apply-theme">应用设置</button>
                        <button class="btn btn-secondary" id="reset-theme">重置默认</button>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').classList.add('active');
            
            this.setupThemeEventListeners();
        };
    }

    setupThemeEventListeners() {
        // 主题选项
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // 应用主题
        document.getElementById('apply-theme').addEventListener('click', () => {
            const selectedTheme = document.querySelector('.theme-option.active').dataset.theme;
            const accentColor = document.getElementById('accent-color').value;
            const successColor = document.getElementById('success-color').value;
            const warningColor = document.getElementById('warning-color').value;
            const errorColor = document.getElementById('error-color').value;
            
            this.applyCustomTheme(selectedTheme, accentColor, successColor, warningColor, errorColor);
            window.app.closeModal();
        });
        
        // 重置主题
        document.getElementById('reset-theme').addEventListener('click', () => {
            this.resetTheme();
            window.app.closeModal();
        });
    }

    applyCustomTheme(theme, accentColor, successColor, warningColor, errorColor) {
        const root = document.documentElement;
        
        // 设置主题
        root.setAttribute('data-theme', theme);
        
        // 设置自定义颜色
        root.style.setProperty('--accent-color', accentColor);
        root.style.setProperty('--success-color', successColor);
        root.style.setProperty('--warning-color', warningColor);
        root.style.setProperty('--error-color', errorColor);
        
        // 保存设置
        const settings = JSON.parse(localStorage.getItem('officeFishSettings') || '{}');
        settings.theme = theme;
        settings.customColors = { accentColor, successColor, warningColor, errorColor };
        localStorage.setItem('officeFishSettings', JSON.stringify(settings));
        
        window.app.showNotification('主题设置已应用', 'success');
    }

    resetTheme() {
        const root = document.documentElement;
        root.removeAttribute('style');
        root.setAttribute('data-theme', 'light');
        
        const settings = JSON.parse(localStorage.getItem('officeFishSettings') || '{}');
        delete settings.customColors;
        localStorage.setItem('officeFishSettings', JSON.stringify(settings));
        
        window.app.showNotification('主题已重置', 'success');
    }

    addStatisticsPanel() {
        this.showStatisticsPanel = () => {
            const modalBody = document.getElementById('modal-body');
            const modalTitle = document.getElementById('modal-title');
            
            modalTitle.textContent = '使用统计';
            modalBody.innerHTML = `
                <div class="statistics-panel">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>游戏统计</h3>
                            <div class="stat-content">
                                <p>2048最高分: <span id="2048-best">0</span></p>
                                <p>记忆游戏最佳时间: <span id="memory-best">-</span></p>
                                <p>贪吃蛇最高分: <span id="snake-best">0</span></p>
                                <p>俄罗斯方块最高分: <span id="tetris-best">0</span></p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <h3>工具使用</h3>
                            <div class="stat-content">
                                <p>番茄钟完成次数: <span id="pomodoro-count">0</span></p>
                                <p>待办事项总数: <span id="todo-count">0</span></p>
                                <p>密码生成次数: <span id="password-count">0</span></p>
                                <p>二维码生成次数: <span id="qr-count">0</span></p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <h3>学习进度</h3>
                            <div class="stat-content">
                                <p>英语词汇掌握: <span id="english-progress">0%</span></p>
                                <p>诗词收藏数量: <span id="poetry-favorites">0</span></p>
                                <p>文章阅读数量: <span id="prose-read">0</span></p>
                                <p>笔记数量: <span id="notes-count">0</span></p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <h3>使用时长</h3>
                            <div class="stat-content">
                                <p>今日使用: <span id="today-usage">0分钟</span></p>
                                <p>本周使用: <span id="week-usage">0分钟</span></p>
                                <p>本月使用: <span id="month-usage">0分钟</span></p>
                                <p>总使用时长: <span id="total-usage">0分钟</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="stats-actions">
                        <button class="btn btn-primary" onclick="window.enhancementManager.exportStatistics()">导出统计</button>
                        <button class="btn btn-secondary" onclick="window.enhancementManager.resetStatistics()">重置统计</button>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').classList.add('active');
            this.loadStatistics();
        };
    }

    loadStatistics() {
        // 加载游戏统计
        const gameData = this.getGameData();
        document.getElementById('2048-best').textContent = gameData['officeFish_game_2048_best'] || '0';
        document.getElementById('snake-best').textContent = gameData['officeFish_game_snake_best'] || '0';
        document.getElementById('tetris-best').textContent = gameData['officeFish_game_tetris_best'] || '0';
        
        // 加载工具统计
        const toolData = this.getToolData();
        document.getElementById('pomodoro-count').textContent = toolData['officeFish_tool_pomodoro_count'] || '0';
        document.getElementById('todo-count').textContent = this.getTodoCount();
        document.getElementById('password-count').textContent = toolData['officeFish_tool_password_count'] || '0';
        document.getElementById('qr-count').textContent = toolData['officeFish_tool_qr_count'] || '0';
        
        // 加载学习统计
        const learningData = JSON.parse(localStorage.getItem('officeFish_learningData') || '{}');
        const englishProgress = learningData.english?.progress?.vocabulary || 0;
        document.getElementById('english-progress').textContent = `${englishProgress}%`;
        document.getElementById('poetry-favorites').textContent = learningData.poetry?.favorites?.length || '0';
        document.getElementById('prose-read').textContent = learningData.prose?.progress?.read || '0';
        document.getElementById('notes-count').textContent = learningData.prose?.notes?.length || '0';
        
        // 加载使用时长统计
        this.loadUsageStatistics();
    }

    getTodoCount() {
        const todos = JSON.parse(localStorage.getItem('officeFish_tool_todos') || '[]');
        return todos.length;
    }

    loadUsageStatistics() {
        const usageData = JSON.parse(localStorage.getItem('officeFish_usage') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        document.getElementById('today-usage').textContent = `${usageData[today] || 0}分钟`;
        document.getElementById('week-usage').textContent = `${this.getWeekUsage(usageData)}分钟`;
        document.getElementById('month-usage').textContent = `${this.getMonthUsage(usageData)}分钟`;
        document.getElementById('total-usage').textContent = `${this.getTotalUsage(usageData)}分钟`;
    }

    getWeekUsage(usageData) {
        const today = new Date();
        let weekTotal = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            weekTotal += usageData[dateStr] || 0;
        }
        return weekTotal;
    }

    getMonthUsage(usageData) {
        const today = new Date();
        let monthTotal = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            monthTotal += usageData[dateStr] || 0;
        }
        return monthTotal;
    }

    getTotalUsage(usageData) {
        return Object.values(usageData).reduce((sum, time) => sum + time, 0);
    }

    exportStatistics() {
        const stats = {
            games: {
                '2048_best': document.getElementById('2048-best').textContent,
                'snake_best': document.getElementById('snake-best').textContent,
                'tetris_best': document.getElementById('tetris-best').textContent
            },
            tools: {
                'pomodoro_count': document.getElementById('pomodoro-count').textContent,
                'todo_count': document.getElementById('todo-count').textContent,
                'password_count': document.getElementById('password-count').textContent,
                'qr_count': document.getElementById('qr-count').textContent
            },
            learning: {
                'english_progress': document.getElementById('english-progress').textContent,
                'poetry_favorites': document.getElementById('poetry-favorites').textContent,
                'prose_read': document.getElementById('prose-read').textContent,
                'notes_count': document.getElementById('notes-count').textContent
            },
            usage: {
                'today': document.getElementById('today-usage').textContent,
                'week': document.getElementById('week-usage').textContent,
                'month': document.getElementById('month-usage').textContent,
                'total': document.getElementById('total-usage').textContent
            },
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `statistics-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        window.app.showNotification('统计报告已导出', 'success');
    }

    resetStatistics() {
        if (confirm('确定要重置所有统计数据吗？此操作不可恢复。')) {
            // 清除游戏数据
            const gameKeys = Object.keys(localStorage).filter(key => key.startsWith('officeFish_game_'));
            gameKeys.forEach(key => localStorage.removeItem(key));
            
            // 清除工具数据
            const toolKeys = Object.keys(localStorage).filter(key => key.startsWith('officeFish_tool_'));
            toolKeys.forEach(key => localStorage.removeItem(key));
            
            // 清除学习数据
            localStorage.removeItem('officeFish_learningData');
            
            // 清除使用统计
            localStorage.removeItem('officeFish_usage');
            
            window.app.showNotification('统计数据已重置', 'success');
            this.loadStatistics();
        }
    }

    setupLazyLoading() {
        // 图片懒加载
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    setupDebouncing() {
        // 防抖函数
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }

    setupCaching() {
        // 简单的缓存系统
        this.cache = new Map();
        
        this.getCached = (key) => {
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < 300000) { // 5分钟缓存
                return cached.data;
            }
            return null;
        };
        
        this.setCached = (key, data) => {
            this.cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
        };
    }

    // 使用时长跟踪
    startUsageTracking() {
        const startTime = Date.now();
        
        const trackUsage = () => {
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 60000); // 转换为分钟
            
            if (duration > 0) {
                const today = new Date().toISOString().split('T')[0];
                const usageData = JSON.parse(localStorage.getItem('officeFish_usage') || '{}');
                usageData[today] = (usageData[today] || 0) + duration;
                localStorage.setItem('officeFish_usage', JSON.stringify(usageData));
            }
        };
        
        // 页面卸载时记录使用时长
        window.addEventListener('beforeunload', trackUsage);
        
        // 页面隐藏时记录使用时长
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                trackUsage();
            }
        });
    }
}

// 初始化增强管理器
window.enhancementManager = new EnhancementManager();

// 启动使用时长跟踪
window.enhancementManager.startUsageTracking();
