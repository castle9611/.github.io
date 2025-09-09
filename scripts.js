// 主要应用逻辑
class OfficeFishApp {
    constructor() {
        this.currentTab = 'games';
        this.currentModal = null;
        this.isHidden = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.setupKeyboardShortcuts();
        console.log('工作助手已启动 🎯');
    }

    setupEventListeners() {
        // 导航标签切换
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        // 游戏卡片点击和键盘事件
        document.querySelectorAll('.game-card').forEach(card => {
            const handleActivation = () => {
                const gameType = card.dataset.game;
                this.openGame(gameType);
            };
            
            card.addEventListener('click', handleActivation);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleActivation();
                }
            });
        });

        // 工具卡片点击和键盘事件
        document.querySelectorAll('.tool-card').forEach(card => {
            const handleActivation = () => {
                const toolType = card.dataset.tool;
                this.openTool(toolType);
            };
            
            card.addEventListener('click', handleActivation);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleActivation();
                }
            });
        });

        // 娱乐卡片点击和键盘事件
        document.querySelectorAll('.entertainment-card').forEach(card => {
            const handleActivation = () => {
                const entertainmentType = card.dataset.entertainment;
                this.openEntertainment(entertainmentType);
            };
            
            card.addEventListener('click', handleActivation);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleActivation();
                }
            });
        });


        // 模态框关闭
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        // 主题切换
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // 全屏切换
        document.getElementById('fullscreen-toggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+H: 隐藏/显示应用
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                this.toggleVisibility();
            }

            // Esc: 关闭模态框或返回
            if (e.key === 'Escape') {
                if (this.currentModal) {
                    this.closeModal();
                }
            }

            // 弹窗开启时，阻止方向键引起的页面滚动/位移
            if (this.currentModal && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                return;
            }

            // 数字键快速切换标签
            if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.altKey) {
                const tabs = ['games', 'tools', 'entertainment', 'links'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) {
                    this.switchTab(tabs[tabIndex]);
                }
            }

            // 方向键导航（模态框开启时不触发）
            if (!this.currentModal && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                const tabs = ['games', 'tools', 'entertainment', 'links'];
                const currentIndex = tabs.indexOf(this.currentTab);
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }
                
                this.switchTab(tabs[newIndex]);
                e.preventDefault();
            }
        });
    }

    switchTab(tabName) {
        // 更新导航标签状态
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');

        // 更新内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // 特殊处理：初始化links模块
        if (tabName === 'links' && window.LinksManager && !window.linksManager) {
            window.linksManager = new window.LinksManager();
        }

        this.currentTab = tabName;
        this.saveSettings();
    }

    openGame(gameType) {
        const gameTitles = {
            '2048': '2048 数字游戏',
            'memory': '记忆配对游戏',
            'guess': '数字猜谜游戏',
            'snake': '贪吃蛇游戏',
            'tetris': '俄罗斯方块',
            'minesweeper': '扫雷游戏',
            'puzzle': '滑块拼图',
            'link': '连连看',
            'shooter': '雷霆战机'
        };

        this.openModal(gameTitles[gameType], () => {
            // 游戏内容将在games.js中处理
            if (window.GameManager) {
                window.GameManager.initGame(gameType);
            }
        });
    }

    openTool(toolType) {
        const toolTitles = {
            'pomodoro': '番茄钟计时器',
            'todo': '待办事项清单',
            'calculator': '计算器',
            'random': '随机工具'
        };

        this.openModal(toolTitles[toolType], () => {
            // 工具内容将在tools.js中处理
            if (window.ToolManager) {
                window.ToolManager.initTool(toolType);
            }
        });
    }

    openEntertainment(entertainmentType) {
        const entertainmentTitles = {
            'matrix': '数字雨效果',
            'particles': '粒子动画',
            'visualizer': '音乐可视化',
            'colors': '颜色生成器'
        };

        this.openModal(entertainmentTitles[entertainmentType], () => {
            // 娱乐内容将在entertainment.js中处理
            if (window.EntertainmentManager) {
                window.EntertainmentManager.initEntertainment(entertainmentType);
            }
        });
    }


    openModal(title, callback) {
        const modalContainer = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = title;
        modalBody.innerHTML = '<div class="text-center"><div class="loading"></div><p style="margin-top: 1rem;">加载中...</p></div>';
        
        modalContainer.classList.add('active');
        this.currentModal = true;

        // 执行回调函数
        if (callback) {
            // 使用 requestAnimationFrame 确保DOM更新后再执行
            requestAnimationFrame(() => {
                setTimeout(callback, 50);
            });
        }
    }

    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.remove('active');
        this.currentModal = null;

        // 清理模态框内容
        document.getElementById('modal-body').innerHTML = '';

        // 停止所有动画和定时器
        if (window.GameManager) {
            window.GameManager.cleanup();
        }
        if (window.ToolManager) {
            window.ToolManager.cleanup();
        }
        if (window.EntertainmentManager) {
            window.EntertainmentManager.cleanup();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 更新主题图标
        const themeIcon = document.querySelector('#theme-toggle .control-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        this.saveSettings();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('全屏模式请求失败:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleVisibility() {
        const container = document.querySelector('.container');
        const shortcutHint = document.getElementById('shortcut-hint');
        
        if (this.isHidden) {
            container.style.display = 'flex';
            shortcutHint.style.display = 'block';
            this.isHidden = false;
        } else {
            container.style.display = 'none';
            shortcutHint.style.display = 'none';
            this.isHidden = true;
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('officeFishSettings') || '{}');
            
            // 加载主题设置
            if (settings.theme) {
                document.documentElement.setAttribute('data-theme', settings.theme);
                const themeIcon = document.querySelector('#theme-toggle .control-icon');
                themeIcon.textContent = settings.theme === 'dark' ? '☀️' : '🌙';
            }

            // 加载当前标签
            if (settings.currentTab) {
                this.switchTab(settings.currentTab);
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                theme: document.documentElement.getAttribute('data-theme') || 'light',
                currentTab: this.currentTab
            };
            localStorage.setItem('officeFishSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    }

    // 工具方法
    showNotification(message, type = 'info') {
        // 移除现有的通知
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            document.body.removeChild(notification);
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // 数据存储工具
    saveData(key, data) {
        try {
            localStorage.setItem(`officeFish_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    loadData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`officeFish_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('加载数据失败:', error);
            return defaultValue;
        }
    }

    // 工具函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OfficeFishApp();
});

// 导出到全局
window.OfficeFishApp = OfficeFishApp;
