// 工具管理器
class ToolManager {
    constructor() {
        this.currentTool = null;
        this.toolInstances = {};
        this.cleanupFunctions = [];
    }

    initTool(toolType) {
        this.cleanup();
        
        const modalBody = document.getElementById('modal-body');
        
        switch (toolType) {
            case 'pomodoro':
                this.initPomodoro(modalBody);
                break;
            case 'todo':
                this.initTodo(modalBody);
                break;
            case 'calculator':
                this.initCalculator(modalBody);
                break;
            case 'random':
                this.initRandom(modalBody);
                break;
            case 'password':
                this.initPassword(modalBody);
                break;
            case 'qr':
                this.initQR(modalBody);
                break;
            case 'converter':
                this.initConverter(modalBody);
                break;
            case 'text':
                this.initTextTools(modalBody);
                break;
            case 'time':
                this.initTimeTools(modalBody);
                break;
            case 'file':
                this.initFileTools(modalBody);
                break;
            case 'notes':
                this.initNotes(modalBody);
                break;
        }
        
        this.currentTool = toolType;
    }

    cleanup() {
        try {
            // 清理所有定时器和事件监听器
            this.cleanupFunctions.forEach(cleanup => {
                try {
                    cleanup();
                } catch (error) {
                    console.warn('清理函数执行失败:', error);
                }
            });
            this.cleanupFunctions = [];
            
            // 停止工具实例
            if (this.toolInstances[this.currentTool]) {
                this.toolInstances[this.currentTool].destroy();
                delete this.toolInstances[this.currentTool];
            }
        } catch (error) {
            console.error('工具清理失败:', error);
        }
    }

    // 番茄钟工具
    initPomodoro(container) {
        container.innerHTML = `
            <div class="tool-pomodoro">
                <div class="pomodoro-display">
                    <div class="timer-display" id="timer-display">25:00</div>
                    <div class="timer-status" id="timer-status">准备开始</div>
                    <div class="pomodoro-status-indicator" id="status-indicator"></div>
                </div>
                <div class="pomodoro-controls">
                    <button id="start-btn" class="btn btn-primary">开始</button>
                    <button id="pause-btn" class="btn btn-secondary" disabled>暂停</button>
                    <button id="reset-btn" class="btn btn-secondary">重置</button>
                </div>
                <div class="pomodoro-settings">
                    <div class="setting-group">
                        <label>工作时间 (分钟):</label>
                        <input type="number" id="work-time" value="25" min="1" max="60">
                    </div>
                    <div class="setting-group">
                        <label>休息时间 (分钟):</label>
                        <input type="number" id="break-time" value="5" min="1" max="30">
                    </div>
                </div>
                <div class="pomodoro-stats">
                    <div class="stat-item">
                        <span class="stat-label">完成番茄数:</span>
                        <span class="stat-value" id="completed-pomodoros">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">今日专注时间:</span>
                        <span class="stat-value" id="total-focus-time">0分钟</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前状态:</span>
                        <span class="stat-value" id="current-status">待机</span>
                    </div>
                </div>
            </div>
        `;

        const tool = new PomodoroTimer();
        this.toolInstances['pomodoro'] = tool;
        tool.init();
    }

    // 待办清单工具
    initTodo(container) {
        container.innerHTML = `
            <div class="tool-todo">
                <div class="todo-header">
                    <h3>待办事项清单</h3>
                    <div class="todo-stats">
                        <span id="todo-count">0</span> 个任务
                        <span id="completed-count">0</span> 已完成
                    </div>
                </div>
                <div class="todo-input">
                    <input type="text" id="todo-input" placeholder="添加新的待办事项...">
                    <button id="add-todo-btn" class="btn btn-primary">添加</button>
                </div>
                <div class="todo-filters">
                    <button class="filter-btn active" data-filter="all">全部</button>
                    <button class="filter-btn" data-filter="active">进行中</button>
                    <button class="filter-btn" data-filter="completed">已完成</button>
                    <button class="filter-btn" data-filter="priority">高优先级</button>
                </div>
                <div class="todo-list" id="todo-list">
                    <!-- 待办事项将在这里动态生成 -->
                </div>
                <div class="todo-actions">
                    <button id="clear-completed-btn" class="btn btn-secondary">清除已完成</button>
                    <button id="export-todos-btn" class="btn btn-secondary">导出</button>
                    <button id="import-todos-btn" class="btn btn-secondary">导入</button>
                </div>
            </div>
        `;

        const tool = new TodoList();
        this.toolInstances['todo'] = tool;
        tool.init();
    }

    // 计算器工具
    initCalculator(container) {
        container.innerHTML = `
            <div class="tool-calculator">
                <div class="calculator-mode-toggle">
                    <button id="calc-mode-toggle" class="btn btn-secondary">切换到科学计算器</button>
                </div>
                <div class="calculator-display">
                    <div class="calculator-history" id="calculator-history"></div>
                    <div class="calculator-current" id="calculator-current">0</div>
                </div>
                <div class="calculator-buttons" id="basic-calculator">
                    <button class="calc-btn calc-clear" data-action="clear">C</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="±">±</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="%">%</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="/">÷</button>
                    
                    <button class="calc-btn calc-number" data-value="7">7</button>
                    <button class="calc-btn calc-number" data-value="8">8</button>
                    <button class="calc-btn calc-number" data-value="9">9</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="*">×</button>
                    
                    <button class="calc-btn calc-number" data-value="4">4</button>
                    <button class="calc-btn calc-number" data-value="5">5</button>
                    <button class="calc-btn calc-number" data-value="6">6</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="-">-</button>
                    
                    <button class="calc-btn calc-number" data-value="1">1</button>
                    <button class="calc-btn calc-number" data-value="2">2</button>
                    <button class="calc-btn calc-number" data-value="3">3</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="+">+</button>
                    
                    <button class="calc-btn calc-number calc-zero" data-value="0">0</button>
                    <button class="calc-btn calc-number" data-value=".">.</button>
                    <button class="calc-btn calc-equals" data-action="equals">=</button>
                </div>
                <div class="calculator-buttons scientific" id="scientific-calculator" style="display: none;">
                    <button class="calc-btn calc-function" data-action="function" data-value="sin">sin</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="cos">cos</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="tan">tan</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="log">log</button>
                    
                    <button class="calc-btn calc-function" data-action="function" data-value="sqrt">√</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="pow">x²</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="exp">eˣ</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="ln">ln</button>
                    
                    <button class="calc-btn calc-number" data-value="7">7</button>
                    <button class="calc-btn calc-number" data-value="8">8</button>
                    <button class="calc-btn calc-number" data-value="9">9</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="/">÷</button>
                    
                    <button class="calc-btn calc-number" data-value="4">4</button>
                    <button class="calc-btn calc-number" data-value="5">5</button>
                    <button class="calc-btn calc-number" data-value="6">6</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="*">×</button>
                    
                    <button class="calc-btn calc-number" data-value="1">1</button>
                    <button class="calc-btn calc-number" data-value="2">2</button>
                    <button class="calc-btn calc-number" data-value="3">3</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="-">-</button>
                    
                    <button class="calc-btn calc-number" data-value="0">0</button>
                    <button class="calc-btn calc-number" data-value=".">.</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="+">+</button>
                    <button class="calc-btn calc-equals" data-action="equals">=</button>
                    
                    <button class="calc-btn calc-clear" data-action="clear">C</button>
                    <button class="calc-btn calc-operator" data-action="operator" data-value="±">±</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="pi">π</button>
                    <button class="calc-btn calc-function" data-action="function" data-value="fact">n!</button>
                </div>
            </div>
        `;

        const tool = new Calculator();
        this.toolInstances['calculator'] = tool;
        tool.init();
    }

    // 随机工具
    initRandom(container) {
        container.innerHTML = `
            <div class="tool-random">
                <div class="random-section">
                    <h3>随机数生成器</h3>
                    <div class="random-inputs">
                        <input type="number" id="min-number" placeholder="最小值" value="1">
                        <span>到</span>
                        <input type="number" id="max-number" placeholder="最大值" value="100">
                        <button id="generate-number-btn" class="btn btn-primary">生成</button>
                    </div>
                    <div class="random-result" id="random-number-result">点击生成按钮</div>
                </div>
                
                <div class="random-section">
                    <h3>随机颜色生成器</h3>
                    <div class="color-controls">
                        <button id="generate-color-btn" class="btn btn-primary">生成颜色</button>
                        <button id="copy-color-btn" class="btn btn-secondary">复制颜色值</button>
                    </div>
                    <div class="color-display" id="color-display">
                        <div class="color-preview"></div>
                        <div class="color-value">#FFFFFF</div>
                    </div>
                </div>
                
                <div class="random-section">
                    <h3>随机决策器</h3>
                    <div class="decision-inputs">
                        <textarea id="decision-options" placeholder="输入选项，每行一个&#10;例如：&#10;选项1&#10;选项2&#10;选项3"></textarea>
                        <button id="make-decision-btn" class="btn btn-primary">做决定</button>
                    </div>
                    <div class="decision-result" id="decision-result">输入选项后点击做决定</div>
                </div>
                
                <div class="random-section">
                    <h3>掷骰子</h3>
                    <div class="dice-controls">
                        <select id="dice-type">
                            <option value="6">6面骰</option>
                            <option value="12">12面骰</option>
                            <option value="20">20面骰</option>
                            <option value="100">100面骰</option>
                        </select>
                        <button id="roll-dice-btn" class="btn btn-primary">掷骰子</button>
                    </div>
                    <div class="dice-result" id="dice-result">点击掷骰子</div>
                </div>
            </div>
        `;

        const tool = new RandomTools();
        this.toolInstances['random'] = tool;
        tool.init();
    }

    // 密码生成器工具
    initPassword(container) {
        container.innerHTML = `
            <div class="tool-password">
                <div class="password-settings">
                    <h3>密码设置</h3>
                    <div class="setting-group">
                        <label>密码长度:</label>
                        <input type="number" id="password-length" value="12" min="4" max="50">
                    </div>
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="include-uppercase" checked>
                            包含大写字母 (A-Z)
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="include-lowercase" checked>
                            包含小写字母 (a-z)
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="include-numbers" checked>
                            包含数字 (0-9)
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="include-symbols" checked>
                            包含特殊字符 (!@#$%^&*)
                        </label>
                    </div>
                </div>
                <div class="password-result">
                    <h3>生成的密码</h3>
                    <div class="password-display">
                        <div id="generated-password" class="password-text"></div>
                        <button id="copy-password-btn" class="btn btn-secondary">复制</button>
                    </div>
                    <div class="password-strength">
                        <div id="password-strength" class="strength-bar"></div>
                        <div id="strength-text" class="strength-text">强度: 中等</div>
                    </div>
                </div>
                <div class="password-actions">
                    <button id="generate-password-btn" class="btn btn-primary">生成新密码</button>
                </div>
            </div>
        `;

        const tool = new PasswordGenerator();
        this.toolInstances['password'] = tool;
        tool.init();
    }

    // 二维码生成器工具
    initQR(container) {
        container.innerHTML = `
            <div class="tool-qr">
                <div class="qr-input">
                    <h3>生成二维码</h3>
                    <div class="input-group">
                        <label>文本内容:</label>
                        <textarea id="qr-text" placeholder="输入要生成二维码的文本、链接等"></textarea>
                    </div>
                    <div class="input-group">
                        <label>二维码大小:</label>
                        <input type="number" id="qr-size" value="200" min="100" max="500">
                    </div>
                    <div class="qr-actions">
                        <button id="generate-qr-btn" class="btn btn-primary">生成二维码</button>
                        <button id="download-qr-btn" class="btn btn-secondary">下载</button>
                    </div>
                </div>
                <div class="qr-output">
                    <h3>二维码预览</h3>
                    <div id="qr-container" class="qr-container">
                        <div class="qr-placeholder">
                            <div class="qr-text">请输入文本生成二维码</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const tool = new QRGenerator();
        this.toolInstances['qr'] = tool;
        tool.init();
    }

    // 单位转换器工具
    initConverter(container) {
        container.innerHTML = `
            <div class="tool-converter">
                <div class="converter-header">
                    <h3>单位转换器</h3>
                    <div class="conversion-type-selector">
                        <label>转换类型:</label>
                        <select id="conversion-type">
                            <option value="length">长度</option>
                            <option value="weight">重量</option>
                            <option value="temperature">温度</option>
                        </select>
                    </div>
                </div>
                <div class="converter-main">
                    <div class="conversion-input">
                        <label>从:</label>
                        <div class="input-group">
                            <input type="number" id="from-value" placeholder="输入数值">
                            <select id="from-unit"></select>
                        </div>
                    </div>
                    <div class="conversion-arrow">→</div>
                    <div class="conversion-output">
                        <label>到:</label>
                        <div class="output-group">
                            <div id="to-value" class="result-value">0</div>
                            <select id="to-unit"></select>
                        </div>
                    </div>
                </div>
                <div class="converter-actions">
                    <button id="convert-btn" class="btn btn-primary">转换</button>
                </div>
            </div>
        `;

        const tool = new UnitConverter();
        this.toolInstances['converter'] = tool;
        tool.init();
    }

    // 文本处理工具
    initTextTools(container) {
        container.innerHTML = `
            <div class="tool-text">
                <div class="tool-header">
                    <h3>文本处理工具</h3>
                    <p>快速处理文本内容</p>
                </div>
                <div class="tool-section">
                    <h4>📝 文本转换</h4>
                    <div class="text-input-area">
                        <textarea id="text-input" placeholder="输入要处理的文本..." rows="6"></textarea>
                    </div>
                    <div class="text-actions">
                        <button id="to-uppercase" class="btn btn-secondary">转大写</button>
                        <button id="to-lowercase" class="btn btn-secondary">转小写</button>
                        <button id="to-title-case" class="btn btn-secondary">标题格式</button>
                        <button id="reverse-text" class="btn btn-secondary">反转文本</button>
                        <button id="remove-spaces" class="btn btn-secondary">移除空格</button>
                        <button id="count-words" class="btn btn-secondary">统计字数</button>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>🔤 编码解码</h4>
                    <div class="encoding-actions">
                        <button id="encode-base64" class="btn btn-primary">Base64编码</button>
                        <button id="decode-base64" class="btn btn-primary">Base64解码</button>
                        <button id="encode-url" class="btn btn-primary">URL编码</button>
                        <button id="decode-url" class="btn btn-primary">URL解码</button>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>📊 文本统计</h4>
                    <div class="text-stats" id="text-stats">
                        <div class="stat-item">
                            <span class="stat-label">字符数</span>
                            <span class="stat-value" id="char-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">单词数</span>
                            <span class="stat-value" id="word-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">行数</span>
                            <span class="stat-value" id="line-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">段落数</span>
                            <span class="stat-value" id="paragraph-count">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const tool = new TextTools();
        this.toolInstances['text'] = tool;
        tool.init();
    }

    // 时间管理工具
    initTimeTools(container) {
        container.innerHTML = `
            <div class="tool-time">
                <div class="tool-header">
                    <h3>时间管理工具</h3>
                    <p>时间计算和转换工具</p>
                </div>
                <div class="tool-section">
                    <h4>⏰ 时间计算器</h4>
                    <div class="time-calculator">
                        <div class="time-inputs">
                            <div class="time-input-group">
                                <label>开始时间:</label>
                                <input type="datetime-local" id="start-time">
                            </div>
                            <div class="time-input-group">
                                <label>结束时间:</label>
                                <input type="datetime-local" id="end-time">
                            </div>
                        </div>
                        <button id="calculate-duration" class="btn btn-primary">计算时长</button>
                        <div class="duration-result" id="duration-result">请选择开始和结束时间</div>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>📅 日期工具</h4>
                    <div class="date-tools">
                        <div class="date-input-group">
                            <label>选择日期:</label>
                            <input type="date" id="selected-date">
                        </div>
                        <div class="date-actions">
                            <button id="get-day-of-week" class="btn btn-secondary">获取星期</button>
                            <button id="get-day-of-year" class="btn btn-secondary">年内第几天</button>
                            <button id="add-days" class="btn btn-secondary">加天数</button>
                            <button id="subtract-days" class="btn btn-secondary">减天数</button>
                        </div>
                        <div class="date-result" id="date-result">请选择日期</div>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>⏱️ 倒计时器</h4>
                    <div class="countdown-timer">
                        <div class="countdown-inputs">
                            <div class="countdown-input-group">
                                <label>小时:</label>
                                <input type="number" id="countdown-hours" min="0" max="23" value="0">
                            </div>
                            <div class="countdown-input-group">
                                <label>分钟:</label>
                                <input type="number" id="countdown-minutes" min="0" max="59" value="0">
                            </div>
                            <div class="countdown-input-group">
                                <label>秒数:</label>
                                <input type="number" id="countdown-seconds" min="0" max="59" value="0">
                            </div>
                        </div>
                        <div class="countdown-controls">
                            <button id="start-countdown" class="btn btn-primary">开始倒计时</button>
                            <button id="stop-countdown" class="btn btn-secondary" disabled>停止</button>
                            <button id="reset-countdown" class="btn btn-secondary">重置</button>
                        </div>
                        <div class="countdown-display" id="countdown-display">00:00:00</div>
                    </div>
                </div>
            </div>
        `;

        const tool = new TimeTools();
        this.toolInstances['time'] = tool;
        tool.init();
    }

    // 文件处理工具
    initFileTools(container) {
        container.innerHTML = `
            <div class="tool-file">
                <div class="tool-header">
                    <h3>文件处理工具</h3>
                    <p>文件格式转换和压缩工具</p>
                </div>
                <div class="tool-section">
                    <h4>📁 文件上传</h4>
                    <div class="file-upload-area">
                        <input type="file" id="file-input" multiple>
                        <div class="file-drop-zone" id="file-drop-zone">
                            <div class="drop-zone-content">
                                <div class="drop-zone-icon">📁</div>
                                <p>拖拽文件到这里或点击选择文件</p>
                                <small>支持多文件选择</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>📄 文件信息</h4>
                    <div class="file-info" id="file-info">
                        <p>请选择文件查看信息</p>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>🔄 文件转换</h4>
                    <div class="file-conversion">
                        <div class="conversion-options">
                            <label>转换类型:</label>
                            <select id="conversion-type">
                                <option value="text">文本提取</option>
                                <option value="base64">Base64编码</option>
                                <option value="hex">十六进制</option>
                            </select>
                        </div>
                        <button id="convert-file" class="btn btn-primary">转换文件</button>
                        <div class="conversion-result" id="conversion-result"></div>
                    </div>
                </div>
            </div>
        `;

        const tool = new FileTools();
        this.toolInstances['file'] = tool;
        tool.init();
    }

    // 笔记工具
    initNotes(container) {
        container.innerHTML = `
            <div class="tool-notes">
                <div class="tool-header">
                    <h3>智能笔记</h3>
                    <p>快速记录和整理想法</p>
                </div>
                <div class="tool-section">
                    <h4>📝 快速笔记</h4>
                    <div class="notes-input">
                        <textarea id="notes-textarea" placeholder="记录你的想法..." rows="8"></textarea>
                        <div class="notes-actions">
                            <button id="save-note" class="btn btn-primary">保存笔记</button>
                            <button id="clear-note" class="btn btn-secondary">清空</button>
                            <button id="export-notes" class="btn btn-secondary">导出</button>
                        </div>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>📚 笔记列表</h4>
                    <div class="notes-list" id="notes-list">
                        <p class="empty-notes">暂无笔记</p>
                    </div>
                </div>
                <div class="tool-section">
                    <h4>🔍 搜索笔记</h4>
                    <div class="notes-search">
                        <input type="text" id="search-notes" placeholder="搜索笔记内容...">
                        <button id="search-btn" class="btn btn-primary">搜索</button>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
            </div>
        `;

        const tool = new NotesTool();
        this.toolInstances['notes'] = tool;
        tool.init();
    }
}

// 番茄钟类
class PomodoroTimer {
    constructor() {
        this.workTime = 25;
        this.breakTime = 5;
        this.currentTime = 25 * 60;
        this.isRunning = false;
        this.isBreak = false;
        this.timer = null;
        this.completedPomodoros = 0;
        this.totalFocusTime = 0;
    }

    init() {
        this.loadStats();
        this.updateDisplay();
        this.setupEventListeners();
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        
        // 更新状态指示器
        if (this.isBreak) {
            this.updateStatusIndicator('break');
            document.getElementById('current-status').textContent = '休息中';
        } else {
            this.updateStatusIndicator('working');
            document.getElementById('current-status').textContent = '工作中';
        }
        
        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.timer);
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
    }

    reset() {
        this.pause();
        this.currentTime = this.workTime * 60;
        this.isBreak = false;
        this.updateDisplay();
        document.getElementById('timer-status').textContent = '准备开始';
        document.getElementById('current-status').textContent = '待机';
        this.updateStatusIndicator('idle');
    }

    completeSession() {
        this.pause();
        
        if (this.isBreak) {
            // 休息结束，开始工作
            this.currentTime = this.workTime * 60;
            this.isBreak = false;
            document.getElementById('timer-status').textContent = '工作时间';
            document.getElementById('current-status').textContent = '工作中';
            this.updateStatusIndicator('working');
            window.app.showNotification('休息结束，开始工作！', 'info');
        } else {
            // 工作结束，开始休息
            this.completedPomodoros++;
            this.totalFocusTime += this.workTime;
            this.currentTime = this.breakTime * 60;
            this.isBreak = true;
            document.getElementById('timer-status').textContent = '休息时间';
            document.getElementById('current-status').textContent = '休息中';
            this.updateStatusIndicator('break');
            this.saveStats();
            this.updateStats();
            window.app.showNotification('工作时间结束，开始休息！', 'success');
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStats() {
        document.getElementById('completed-pomodoros').textContent = this.completedPomodoros;
        document.getElementById('total-focus-time').textContent = `${this.totalFocusTime}分钟`;
    }

    updateStatusIndicator(status) {
        const indicator = document.getElementById('status-indicator');
        indicator.className = 'pomodoro-status-indicator';
        
        switch (status) {
            case 'working':
                indicator.classList.add('working');
                break;
            case 'break':
                indicator.classList.add('break');
                break;
            default:
                // 待机状态，不添加额外类
                break;
        }
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pause();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });

        // 设置更改
        document.getElementById('work-time').addEventListener('change', (e) => {
            this.workTime = parseInt(e.target.value);
            if (!this.isRunning && !this.isBreak) {
                this.currentTime = this.workTime * 60;
                this.updateDisplay();
            }
        });

        document.getElementById('break-time').addEventListener('change', (e) => {
            this.breakTime = parseInt(e.target.value);
        });
    }

    loadStats() {
        this.completedPomodoros = window.app.loadData('pomodoro_completed', 0);
        this.totalFocusTime = window.app.loadData('pomodoro_focus_time', 0);
        this.updateStats();
    }

    saveStats() {
        window.app.saveData('pomodoro_completed', this.completedPomodoros);
        window.app.saveData('pomodoro_focus_time', this.totalFocusTime);
    }

    destroy() {
        clearInterval(this.timer);
    }
}

// 待办清单类
class TodoList {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
    }

    init() {
        this.loadTodos();
        this.renderTodos();
        this.setupEventListeners();
    }

    addTodo(text) {
        if (!text.trim()) return;
        
        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            priority: 'normal', // normal, high, low
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.renderTodos();
    }

    filterTodos(filter) {
        this.currentFilter = filter;
        this.renderTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        const todoCount = document.getElementById('todo-count');
        const completedCount = document.getElementById('completed-count');
        
        let filteredTodos = this.todos;
        if (this.currentFilter === 'active') {
            filteredTodos = this.todos.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTodos = this.todos.filter(t => t.completed);
        } else if (this.currentFilter === 'priority') {
            filteredTodos = this.todos.filter(t => t.priority === 'high');
        }
        
        todoCount.textContent = this.todos.length;
        completedCount.textContent = this.todos.filter(t => t.completed).length;
        
        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''} ${todo.priority === 'high' ? 'priority' : ''}" data-id="${todo.id}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="todo-priority" data-priority="${todo.priority}">${this.getPriorityIcon(todo.priority)}</button>
                    <button class="todo-edit">✏️</button>
                    <button class="todo-delete">×</button>
                </div>
            </div>
        `).join('');
        
        // 更新过滤器按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${this.currentFilter}"]`).classList.add('active');
    }

    getPriorityIcon(priority) {
        switch (priority) {
            case 'high': return '🔴';
            case 'normal': return '🟡';
            case 'low': return '🟢';
            default: return '🟡';
        }
    }

    setupEventListeners() {
        document.getElementById('add-todo-btn').addEventListener('click', () => {
            const input = document.getElementById('todo-input');
            this.addTodo(input.value);
            input.value = '';
        });

        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('todo-input');
                this.addTodo(input.value);
                input.value = '';
            }
        });

        document.getElementById('todo-list').addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;
            
            const id = parseInt(todoItem.dataset.id);
            
            if (e.target.type === 'checkbox') {
                this.toggleTodo(id);
            } else if (e.target.classList.contains('todo-delete')) {
                this.deleteTodo(id);
            } else if (e.target.classList.contains('todo-priority')) {
                this.togglePriority(id);
            } else if (e.target.classList.contains('todo-edit')) {
                this.editTodo(id);
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTodos(e.target.dataset.filter);
            });
        });

        document.getElementById('clear-completed-btn').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('export-todos-btn').addEventListener('click', () => {
            this.exportTodos();
        });

        document.getElementById('import-todos-btn').addEventListener('click', () => {
            this.importTodos();
        });
    }

    togglePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const priorities = ['low', 'normal', 'high'];
            const currentIndex = priorities.indexOf(todo.priority);
            todo.priority = priorities[(currentIndex + 1) % priorities.length];
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.renderTodos();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const newText = prompt('编辑待办事项:', todo.text);
            if (newText !== null && newText.trim() !== '') {
                todo.text = newText.trim();
                todo.updatedAt = new Date().toISOString();
                this.saveTodos();
                this.renderTodos();
            }
        }
    }

    importTodos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.todos && Array.isArray(data.todos)) {
                            this.todos = data.todos;
                            this.saveTodos();
                            this.renderTodos();
                            window.app.showNotification('待办事项导入成功', 'success');
                        } else {
                            window.app.showNotification('文件格式不正确', 'error');
                        }
                    } catch (error) {
                        window.app.showNotification('文件解析失败', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportTodos() {
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.app.showNotification('待办事项已导出', 'success');
    }

    loadTodos() {
        this.todos = window.app.loadData('todos', []);
    }

    saveTodos() {
        window.app.saveData('todos', this.todos);
    }

    destroy() {
        // 清理事件监听器
    }
}

// 计算器类
class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetScreen = false;
        this.isScientificMode = false;
    }

    init() {
        this.setupEventListeners();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentValue = number;
            this.shouldResetScreen = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        this.updateDisplay();
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentValue = '0.';
            this.shouldResetScreen = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentValue === '') return;
        if (this.previousValue !== null) {
            this.compute();
        }
        this.operation = operation;
        this.previousValue = this.currentValue;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentValue = computation.toString();
        this.operation = null;
        this.previousValue = null;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    toggleSign() {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('calculator-current').textContent = this.currentValue;
        
        if (this.operation != null && this.previousValue != null) {
            document.getElementById('calculator-history').textContent = 
                `${this.previousValue} ${this.operation}`;
        } else {
            document.getElementById('calculator-history').textContent = '';
        }
    }

    setupEventListeners() {
        // 模式切换
        document.getElementById('calc-mode-toggle').addEventListener('click', () => {
            this.toggleMode();
        });

        // 基础计算器按钮
        document.querySelectorAll('#basic-calculator .calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
            });
        });

        // 科学计算器按钮
        document.querySelectorAll('#scientific-calculator .calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
            });
        });
    }

    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        if (action === 'clear') {
            this.clear();
        } else if (action === 'operator') {
            if (value === '±') {
                this.toggleSign();
            } else {
                this.chooseOperation(value);
            }
        } else if (action === 'function') {
            this.handleScientificFunction(value);
        } else if (action === 'equals') {
            this.compute();
        } else if (value === '.') {
            this.appendDecimal();
        } else {
            this.appendNumber(value);
        }
    }

    toggleMode() {
        this.isScientificMode = !this.isScientificMode;
        const basicCalc = document.getElementById('basic-calculator');
        const scientificCalc = document.getElementById('scientific-calculator');
        const toggleBtn = document.getElementById('calc-mode-toggle');
        
        if (this.isScientificMode) {
            basicCalc.style.display = 'none';
            scientificCalc.style.display = 'grid';
            toggleBtn.textContent = '切换到基础计算器';
        } else {
            basicCalc.style.display = 'grid';
            scientificCalc.style.display = 'none';
            toggleBtn.textContent = '切换到科学计算器';
        }
    }

    handleScientificFunction(func) {
        const value = parseFloat(this.currentValue);
        if (isNaN(value)) return;
        
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'fact':
                result = this.factorial(value);
                break;
            default:
                return;
        }
        
        this.currentValue = result.toString();
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    factorial(n) {
        if (n < 0 || n !== Math.floor(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    destroy() {
        // 清理事件监听器
    }
}

// 随机工具类
class RandomTools {
    constructor() {
        this.currentColor = '#FFFFFF';
    }

    init() {
        this.setupEventListeners();
    }

    generateNumber() {
        const min = parseInt(document.getElementById('min-number').value) || 1;
        const max = parseInt(document.getElementById('max-number').value) || 100;
        
        if (min > max) {
            window.app.showNotification('最小值不能大于最大值', 'error');
            return;
        }
        
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        document.getElementById('random-number-result').textContent = `随机数: ${result}`;
    }

    generateColor() {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.currentColor = color;
        
        document.querySelector('.color-preview').style.backgroundColor = color;
        document.querySelector('.color-value').textContent = color;
    }

    copyColor() {
        navigator.clipboard.writeText(this.currentColor).then(() => {
            window.app.showNotification('颜色值已复制到剪贴板', 'success');
        }).catch(() => {
            window.app.showNotification('复制失败', 'error');
        });
    }

    makeDecision() {
        const optionsText = document.getElementById('decision-options').value;
        const options = optionsText.split('\n').filter(option => option.trim() !== '');
        
        if (options.length < 2) {
            window.app.showNotification('请至少输入两个选项', 'error');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * options.length);
        const result = options[randomIndex];
        document.getElementById('decision-result').textContent = `决定: ${result}`;
    }

    rollDice() {
        const sides = parseInt(document.getElementById('dice-type').value);
        const result = Math.floor(Math.random() * sides) + 1;
        document.getElementById('dice-result').textContent = `掷出了: ${result}`;
    }

    setupEventListeners() {
        document.getElementById('generate-number-btn').addEventListener('click', () => {
            this.generateNumber();
        });

        document.getElementById('generate-color-btn').addEventListener('click', () => {
            this.generateColor();
        });

        document.getElementById('copy-color-btn').addEventListener('click', () => {
            this.copyColor();
        });

        document.getElementById('make-decision-btn').addEventListener('click', () => {
            this.makeDecision();
        });

        document.getElementById('roll-dice-btn').addEventListener('click', () => {
            this.rollDice();
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 密码生成器工具类
class PasswordGenerator {
    constructor() {
        this.generatedPassword = '';
    }

    init() {
        this.setupEventListeners();
        this.generatePassword();
    }

    generatePassword() {
        const length = parseInt(document.getElementById('password-length').value) || 12;
        const includeUppercase = document.getElementById('include-uppercase').checked;
        const includeLowercase = document.getElementById('include-lowercase').checked;
        const includeNumbers = document.getElementById('include-numbers').checked;
        const includeSymbols = document.getElementById('include-symbols').checked;

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = '';
        if (includeUppercase) chars += uppercase;
        if (includeLowercase) chars += lowercase;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        if (chars === '') {
            window.app.showNotification('请至少选择一种字符类型', 'error');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        this.generatedPassword = password;
        document.getElementById('generated-password').textContent = password;
        this.updateStrengthIndicator(password);
    }

    updateStrengthIndicator(password) {
        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthBar = document.getElementById('password-strength');
        const strengthText = document.getElementById('strength-text');

        strengthBar.className = 'strength-bar';
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            feedback = '弱';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            feedback = '中等';
        } else {
            strengthBar.classList.add('strong');
            feedback = '强';
        }

        strengthText.textContent = `强度: ${feedback}`;
    }

    copyPassword() {
        if (this.generatedPassword) {
            navigator.clipboard.writeText(this.generatedPassword).then(() => {
                window.app.showNotification('密码已复制到剪贴板', 'success');
            }).catch(() => {
                window.app.showNotification('复制失败', 'error');
            });
        }
    }

    setupEventListeners() {
        document.getElementById('generate-password-btn').addEventListener('click', () => {
            this.generatePassword();
        });

        document.getElementById('copy-password-btn').addEventListener('click', () => {
            this.copyPassword();
        });

        // 实时更新密码强度
        ['password-length', 'include-uppercase', 'include-lowercase', 'include-numbers', 'include-symbols'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.generatePassword();
            });
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 二维码生成器工具类
class QRGenerator {
    constructor() {
        this.currentQR = null;
    }

    init() {
        this.setupEventListeners();
    }

    generateQR() {
        const text = document.getElementById('qr-text').value.trim();
        if (!text) {
            window.app.showNotification('请输入要生成二维码的文本', 'error');
            return;
        }

        const size = parseInt(document.getElementById('qr-size').value) || 200;
        const qrContainer = document.getElementById('qr-container');
        
        // 显示加载状态
        qrContainer.innerHTML = '<div class="qr-loading">生成中...</div>';
        
        // 使用QR Server API生成二维码
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=2`;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            qrContainer.innerHTML = `
                <img src="${qrUrl}" alt="二维码" style="max-width: 100%; height: auto;" id="qr-image">
                <div class="qr-info">
                    <p>内容: ${text}</p>
                    <p>大小: ${size}x${size}px</p>
                </div>
            `;
            this.currentQR = qrUrl;
        };
        
        img.onerror = () => {
            // 如果API失败，使用备用方案
            this.generateQRFallback(text, size, qrContainer);
        };
        
        img.src = qrUrl;
    }

    generateQRFallback(text, size, container) {
        // 备用方案：使用Canvas生成简单的二维码样式
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = size;
        canvas.height = size;
        
        // 绘制背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // 绘制边框
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, size - 20, size - 20);
        
        // 绘制文本
        ctx.fillStyle = '#000000';
        ctx.font = `${Math.max(12, size / 20)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 文本换行处理
        const maxWidth = size - 40;
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
        
        for (let word of words) {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        // 绘制多行文本
        const lineHeight = Math.max(16, size / 15);
        const totalHeight = lines.length * lineHeight;
        const startY = (size - totalHeight) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), size / 2, startY + index * lineHeight);
        });
        
        container.innerHTML = `
            <img src="${canvas.toDataURL()}" alt="二维码" style="max-width: 100%; height: auto;" id="qr-image">
            <div class="qr-info">
                <p>内容: ${text}</p>
                <p>大小: ${size}x${size}px</p>
                <p class="qr-note">(使用备用方案生成)</p>
            </div>
        `;
        
        this.currentQR = canvas.toDataURL();
        window.app.showNotification('使用备用方案生成二维码', 'info');
    }

    downloadQR() {
        if (!this.currentQR) {
            window.app.showNotification('请先生成二维码', 'error');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = this.currentQR;
            link.click();
            window.app.showNotification('二维码下载成功', 'success');
        } catch (error) {
            window.app.showNotification('下载失败，请重试', 'error');
        }
    }

    setupEventListeners() {
        document.getElementById('generate-qr-btn').addEventListener('click', () => {
            this.generateQR();
        });

        document.getElementById('download-qr-btn').addEventListener('click', () => {
            this.downloadQR();
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 单位转换器工具类
class UnitConverter {
    constructor() {
        this.conversionTypes = {
            length: {
                units: ['米', '千米', '厘米', '毫米', '英里', '英尺', '英寸', '码'],
                conversions: {
                    '米': 1,
                    '千米': 1000,
                    '厘米': 0.01,
                    '毫米': 0.001,
                    '英里': 1609.344,
                    '英尺': 0.3048,
                    '英寸': 0.0254,
                    '码': 0.9144
                }
            },
            weight: {
                units: ['千克', '克', '毫克', '磅', '盎司', '吨'],
                conversions: {
                    '千克': 1,
                    '克': 0.001,
                    '毫克': 0.000001,
                    '磅': 0.45359237,
                    '盎司': 0.028349523125,
                    '吨': 1000
                }
            },
            temperature: {
                units: ['摄氏度', '华氏度', '开尔文'],
                conversions: null // 温度转换需要特殊处理
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.updateUnitOptions('length');
    }

    updateUnitOptions(type) {
        const fromSelect = document.getElementById('from-unit');
        const toSelect = document.getElementById('to-unit');
        const units = this.conversionTypes[type].units;

        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        units.forEach(unit => {
            const fromOption = document.createElement('option');
            fromOption.value = unit;
            fromOption.textContent = unit;
            fromSelect.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = unit;
            toOption.textContent = unit;
            toSelect.appendChild(toOption);
        });

        // 设置不同的默认值
        if (toSelect.options.length > 1) {
            toSelect.selectedIndex = 1;
        }
    }

    convert() {
        const type = document.getElementById('conversion-type').value;
        const fromUnit = document.getElementById('from-unit').value;
        const toUnit = document.getElementById('to-unit').value;
        const value = parseFloat(document.getElementById('from-value').value);

        if (isNaN(value)) {
            window.app.showNotification('请输入有效的数值', 'error');
            return;
        }

        let result;
        if (type === 'temperature') {
            result = this.convertTemperature(value, fromUnit, toUnit);
        } else {
            result = this.convertStandard(value, fromUnit, toUnit, type);
        }

        document.getElementById('to-value').textContent = result.toFixed(6);
    }

    convertStandard(value, fromUnit, toUnit, type) {
        const conversions = this.conversionTypes[type].conversions;
        const baseValue = value * conversions[fromUnit];
        return baseValue / conversions[toUnit];
    }

    convertTemperature(value, fromUnit, toUnit) {
        let celsius;
        
        // 转换为摄氏度
        switch (fromUnit) {
            case '摄氏度':
                celsius = value;
                break;
            case '华氏度':
                celsius = (value - 32) * 5/9;
                break;
            case '开尔文':
                celsius = value - 273.15;
                break;
        }
        
        // 从摄氏度转换到目标单位
        switch (toUnit) {
            case '摄氏度':
                return celsius;
            case '华氏度':
                return celsius * 9/5 + 32;
            case '开尔文':
                return celsius + 273.15;
        }
    }

    setupEventListeners() {
        document.getElementById('conversion-type').addEventListener('change', (e) => {
            this.updateUnitOptions(e.target.value);
        });

        document.getElementById('convert-btn').addEventListener('click', () => {
            this.convert();
        });

        // 实时转换
        ['from-value', 'from-unit', 'to-unit'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                if (document.getElementById('from-value').value) {
                    this.convert();
                }
            });
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 文本处理工具类
class TextTools {
    constructor() {
        this.currentText = '';
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        const textInput = document.getElementById('text-input');
        textInput.addEventListener('input', () => {
            this.currentText = textInput.value;
            this.updateStats();
        });

        // 文本转换按钮
        document.getElementById('to-uppercase').addEventListener('click', () => {
            this.transformText(text => text.toUpperCase());
        });

        document.getElementById('to-lowercase').addEventListener('click', () => {
            this.transformText(text => text.toLowerCase());
        });

        document.getElementById('to-title-case').addEventListener('click', () => {
            this.transformText(text => this.toTitleCase(text));
        });

        document.getElementById('reverse-text').addEventListener('click', () => {
            this.transformText(text => text.split('').reverse().join(''));
        });

        document.getElementById('remove-spaces').addEventListener('click', () => {
            this.transformText(text => text.replace(/\s+/g, ''));
        });

        document.getElementById('count-words').addEventListener('click', () => {
            this.updateStats();
        });

        // 编码解码按钮
        document.getElementById('encode-base64').addEventListener('click', () => {
            this.transformText(text => btoa(unescape(encodeURIComponent(text))));
        });

        document.getElementById('decode-base64').addEventListener('click', () => {
            try {
                this.transformText(text => decodeURIComponent(escape(atob(text))));
            } catch (e) {
                window.app.showNotification('Base64解码失败', 'error');
            }
        });

        document.getElementById('encode-url').addEventListener('click', () => {
            this.transformText(text => encodeURIComponent(text));
        });

        document.getElementById('decode-url').addEventListener('click', () => {
            try {
                this.transformText(text => decodeURIComponent(text));
            } catch (e) {
                window.app.showNotification('URL解码失败', 'error');
            }
        });
    }

    transformText(transformFn) {
        const textInput = document.getElementById('text-input');
        const transformedText = transformFn(this.currentText);
        textInput.value = transformedText;
        this.currentText = transformedText;
        this.updateStats();
    }

    toTitleCase(text) {
        return text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    updateStats() {
        const text = this.currentText;
        document.getElementById('char-count').textContent = text.length;
        document.getElementById('word-count').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('line-count').textContent = text.split('\n').length;
        document.getElementById('paragraph-count').textContent = text.split('\n\n').filter(p => p.trim()).length;
    }

    destroy() {
        // 清理事件监听器
    }
}

// 时间管理工具类
class TimeTools {
    constructor() {
        this.countdownTimer = null;
        this.countdownInterval = null;
    }

    init() {
        this.setupEventListeners();
        this.setDefaultTimes();
    }

    setupEventListeners() {
        // 时间计算器
        document.getElementById('calculate-duration').addEventListener('click', () => {
            this.calculateDuration();
        });

        // 日期工具
        document.getElementById('get-day-of-week').addEventListener('click', () => {
            this.getDayOfWeek();
        });

        document.getElementById('get-day-of-year').addEventListener('click', () => {
            this.getDayOfYear();
        });

        document.getElementById('add-days').addEventListener('click', () => {
            this.addDays();
        });

        document.getElementById('subtract-days').addEventListener('click', () => {
            this.subtractDays();
        });

        // 倒计时器
        document.getElementById('start-countdown').addEventListener('click', () => {
            this.startCountdown();
        });

        document.getElementById('stop-countdown').addEventListener('click', () => {
            this.stopCountdown();
        });

        document.getElementById('reset-countdown').addEventListener('click', () => {
            this.resetCountdown();
        });
    }

    setDefaultTimes() {
        const now = new Date();
        const startTime = new Date(now.getTime() - 60 * 60 * 1000); // 1小时前
        const endTime = now;

        document.getElementById('start-time').value = this.formatDateTimeLocal(startTime);
        document.getElementById('end-time').value = this.formatDateTimeLocal(endTime);
        document.getElementById('selected-date').value = this.formatDate(now);
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    calculateDuration() {
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (!startTime || !endTime) {
            window.app.showNotification('请选择开始和结束时间', 'error');
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = end - start;

        if (duration < 0) {
            window.app.showNotification('结束时间不能早于开始时间', 'error');
            return;
        }

        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);

        document.getElementById('duration-result').textContent = 
            `时长: ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    }

    getDayOfWeek() {
        const date = document.getElementById('selected-date').value;
        if (!date) {
            window.app.showNotification('请选择日期', 'error');
            return;
        }

        const selectedDate = new Date(date);
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayOfWeek = days[selectedDate.getDay()];

        document.getElementById('date-result').textContent = `${date} 是 ${dayOfWeek}`;
    }

    getDayOfYear() {
        const date = document.getElementById('selected-date').value;
        if (!date) {
            window.app.showNotification('请选择日期', 'error');
            return;
        }

        const selectedDate = new Date(date);
        const start = new Date(selectedDate.getFullYear(), 0, 0);
        const diff = selectedDate - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

        document.getElementById('date-result').textContent = `${date} 是 ${selectedDate.getFullYear()}年的第${dayOfYear}天`;
    }

    addDays() {
        const days = prompt('请输入要加的天数:', '1');
        if (days === null) return;

        const numDays = parseInt(days);
        if (isNaN(numDays)) {
            window.app.showNotification('请输入有效的天数', 'error');
            return;
        }

        const date = document.getElementById('selected-date').value;
        if (!date) {
            window.app.showNotification('请选择日期', 'error');
            return;
        }

        const selectedDate = new Date(date);
        selectedDate.setDate(selectedDate.getDate() + numDays);
        
        document.getElementById('selected-date').value = this.formatDate(selectedDate);
        document.getElementById('date-result').textContent = `加${numDays}天后: ${this.formatDate(selectedDate)}`;
    }

    subtractDays() {
        const days = prompt('请输入要减的天数:', '1');
        if (days === null) return;

        const numDays = parseInt(days);
        if (isNaN(numDays)) {
            window.app.showNotification('请输入有效的天数', 'error');
            return;
        }

        const date = document.getElementById('selected-date').value;
        if (!date) {
            window.app.showNotification('请选择日期', 'error');
            return;
        }

        const selectedDate = new Date(date);
        selectedDate.setDate(selectedDate.getDate() - numDays);
        
        document.getElementById('selected-date').value = this.formatDate(selectedDate);
        document.getElementById('date-result').textContent = `减${numDays}天后: ${this.formatDate(selectedDate)}`;
    }

    startCountdown() {
        const hours = parseInt(document.getElementById('countdown-hours').value) || 0;
        const minutes = parseInt(document.getElementById('countdown-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdown-seconds').value) || 0;

        this.countdownTimer = hours * 3600 + minutes * 60 + seconds;

        if (this.countdownTimer <= 0) {
            window.app.showNotification('请输入有效的倒计时时间', 'error');
            return;
        }

        document.getElementById('start-countdown').disabled = true;
        document.getElementById('stop-countdown').disabled = false;

        this.countdownInterval = setInterval(() => {
            this.countdownTimer--;
            this.updateCountdownDisplay();

            if (this.countdownTimer <= 0) {
                this.stopCountdown();
                window.app.showNotification('倒计时结束！', 'success');
            }
        }, 1000);
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }

        document.getElementById('start-countdown').disabled = false;
        document.getElementById('stop-countdown').disabled = true;
    }

    resetCountdown() {
        this.stopCountdown();
        this.countdownTimer = 0;
        document.getElementById('countdown-hours').value = 0;
        document.getElementById('countdown-minutes').value = 0;
        document.getElementById('countdown-seconds').value = 0;
        document.getElementById('countdown-display').textContent = '00:00:00';
    }

    updateCountdownDisplay() {
        const hours = Math.floor(this.countdownTimer / 3600);
        const minutes = Math.floor((this.countdownTimer % 3600) / 60);
        const seconds = this.countdownTimer % 60;

        const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('countdown-display').textContent = display;
    }

    destroy() {
        this.stopCountdown();
    }
}

// 文件处理工具类
class FileTools {
    constructor() {
        this.selectedFiles = [];
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('file-input');
        const dropZone = document.getElementById('file-drop-zone');

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // 拖拽上传
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // 点击上传区域
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // 文件转换
        document.getElementById('convert-file').addEventListener('click', () => {
            this.convertFile();
        });
    }

    handleFiles(files) {
        this.selectedFiles = Array.from(files);
        this.displayFileInfo();
    }

    displayFileInfo() {
        const fileInfo = document.getElementById('file-info');
        
        if (this.selectedFiles.length === 0) {
            fileInfo.innerHTML = '<p>请选择文件查看信息</p>';
            return;
        }

        const infoHtml = this.selectedFiles.map(file => `
            <div class="file-item">
                <h4>${file.name}</h4>
                <p>大小: ${this.formatFileSize(file.size)}</p>
                <p>类型: ${file.type || '未知'}</p>
                <p>修改时间: ${new Date(file.lastModified).toLocaleString()}</p>
            </div>
        `).join('');

        fileInfo.innerHTML = infoHtml;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async convertFile() {
        if (this.selectedFiles.length === 0) {
            window.app.showNotification('请先选择文件', 'error');
            return;
        }

        const conversionType = document.getElementById('conversion-type').value;
        const file = this.selectedFiles[0];
        const resultDiv = document.getElementById('conversion-result');

        try {
            let result;
            const fileContent = await this.readFileAsText(file);

            switch (conversionType) {
                case 'text':
                    result = fileContent;
                    break;
                case 'base64':
                    result = btoa(unescape(encodeURIComponent(fileContent)));
                    break;
                case 'hex':
                    result = Array.from(fileContent).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                    break;
                default:
                    result = '不支持的转换类型';
            }

            resultDiv.innerHTML = `
                <h4>转换结果:</h4>
                <textarea readonly rows="10" style="width: 100%; font-family: monospace;">${result}</textarea>
                <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${result}')">复制结果</button>
            `;
        } catch (error) {
            resultDiv.innerHTML = `<p style="color: var(--error-color);">转换失败: ${error.message}</p>`;
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 笔记工具类
class NotesTool {
    constructor() {
        this.notes = [];
        this.currentNote = '';
    }

    init() {
        this.loadNotes();
        this.setupEventListeners();
        this.renderNotes();
    }

    setupEventListeners() {
        const textarea = document.getElementById('notes-textarea');
        textarea.addEventListener('input', (e) => {
            this.currentNote = e.target.value;
        });

        document.getElementById('save-note').addEventListener('click', () => {
            this.saveNote();
        });

        document.getElementById('clear-note').addEventListener('click', () => {
            this.clearNote();
        });

        document.getElementById('export-notes').addEventListener('click', () => {
            this.exportNotes();
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            this.searchNotes();
        });

        document.getElementById('search-notes').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchNotes();
            }
        });
    }

    saveNote() {
        if (!this.currentNote.trim()) {
            window.app.showNotification('请输入笔记内容', 'error');
            return;
        }

        const note = {
            id: Date.now(),
            content: this.currentNote.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(note);
        this.saveNotesToStorage();
        this.renderNotes();
        this.clearNote();
        window.app.showNotification('笔记保存成功', 'success');
    }

    clearNote() {
        document.getElementById('notes-textarea').value = '';
        this.currentNote = '';
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotesToStorage();
        this.renderNotes();
        window.app.showNotification('笔记已删除', 'success');
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('notes-textarea').value = note.content;
            this.currentNote = note.content;
        }
    }

    searchNotes() {
        const query = document.getElementById('search-notes').value.toLowerCase();
        const results = this.notes.filter(note => 
            note.content.toLowerCase().includes(query)
        );

        const resultsDiv = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>未找到匹配的笔记</p>';
            return;
        }

        const resultsHtml = results.map(note => `
            <div class="search-result-item">
                <h4>${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</h4>
                <p>创建时间: ${new Date(note.createdAt).toLocaleString()}</p>
                <div class="result-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.toolInstances.notes.editNote(${note.id})">编辑</button>
                    <button class="btn btn-sm btn-secondary" onclick="window.toolInstances.notes.deleteNote(${note.id})">删除</button>
                </div>
            </div>
        `).join('');

        resultsDiv.innerHTML = resultsHtml;
    }

    renderNotes() {
        const notesList = document.getElementById('notes-list');
        
        if (this.notes.length === 0) {
            notesList.innerHTML = '<p class="empty-notes">暂无笔记</p>';
            return;
        }

        const notesHtml = this.notes.map(note => `
            <div class="note-item">
                <div class="note-content">
                    <h4>${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</h4>
                    <p class="note-meta">创建时间: ${new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <div class="note-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.toolInstances.notes.editNote(${note.id})">编辑</button>
                    <button class="btn btn-sm btn-secondary" onclick="window.toolInstances.notes.deleteNote(${note.id})">删除</button>
                </div>
            </div>
        `).join('');

        notesList.innerHTML = notesHtml;
    }

    saveNotesToStorage() {
        window.app.saveData('notes', this.notes);
    }

    loadNotes() {
        this.notes = window.app.loadData('notes', []);
    }

    exportNotes() {
        if (this.notes.length === 0) {
            window.app.showNotification('没有笔记可导出', 'error');
            return;
        }

        const data = {
            notes: this.notes,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.app.showNotification('笔记导出成功', 'success');
    }

    destroy() {
        // 清理事件监听器
    }
}

// 初始化工具管理器
window.ToolManager = new ToolManager();
