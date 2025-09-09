// 娱乐管理器
class EntertainmentManager {
    constructor() {
        this.currentEntertainment = null;
        this.entertainmentInstances = {};
        this.cleanupFunctions = [];
    }

    initEntertainment(entertainmentType) {
        this.cleanup();
        
        const modalBody = document.getElementById('modal-body');
        
        switch (entertainmentType) {
            case 'matrix':
                this.initMatrix(modalBody);
                break;
            case 'particles':
                this.initParticles(modalBody);
                break;
            case 'visualizer':
                this.initVisualizer(modalBody);
                break;
            case 'colors':
                this.initColors(modalBody);
                break;
            case 'typing':
                this.initTyping(modalBody);
                break;
            case 'maze':
                this.initMaze(modalBody);
                break;
            case 'pixel':
                this.initPixel(modalBody);
                break;
            case 'meditation':
                this.initMeditation(modalBody);
                break;
            case 'breathing':
                this.initBreathing(modalBody);
                break;
            case 'whitenoise':
                this.initWhiteNoise(modalBody);
                break;
            case 'coloring':
                this.initColoring(modalBody);
                break;
            case 'mandala':
                this.initMandala(modalBody);
                break;
            case 'kaleidoscope':
                this.initKaleidoscope(modalBody);
                break;
        }
        
        this.currentEntertainment = entertainmentType;
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
            
            // 清理迷宫生成超时
            if (this.entertainmentInstances['maze'] && this.entertainmentInstances['maze'].generationTimeout) {
                clearTimeout(this.entertainmentInstances['maze'].generationTimeout);
                this.entertainmentInstances['maze'].generationTimeout = null;
            }
            
            // 停止娱乐实例
            if (this.entertainmentInstances[this.currentEntertainment]) {
                this.entertainmentInstances[this.currentEntertainment].destroy();
                delete this.entertainmentInstances[this.currentEntertainment];
            }
        } catch (error) {
            console.error('娱乐清理失败:', error);
        }
    }

    // 数字雨效果
    initMatrix(container) {
        container.innerHTML = `
            <div class="entertainment-matrix">
                <div class="matrix-controls">
                    <button id="matrix-start-btn" class="btn btn-primary">开始数字雨</button>
                    <button id="matrix-stop-btn" class="btn btn-secondary" disabled>停止</button>
                    <div class="matrix-settings">
                        <label>速度: <input type="range" id="matrix-speed" min="1" max="20" value="10"></label>
                        <label>密度: <input type="range" id="matrix-density" min="1" max="10" value="5"></label>
                    </div>
                </div>
                <canvas id="matrix-canvas" width="800" height="600"></canvas>
            </div>
        `;

        const entertainment = new MatrixRain();
        this.entertainmentInstances['matrix'] = entertainment;
        entertainment.init();
    }

    // 粒子动画
    initParticles(container) {
        container.innerHTML = `
            <div class="entertainment-particles">
                <div class="particle-controls">
                    <button id="particle-start-btn" class="btn btn-primary">开始粒子动画</button>
                    <button id="particle-stop-btn" class="btn btn-secondary" disabled>停止</button>
                    <button id="particle-clear-btn" class="btn btn-secondary">清空</button>
                </div>
                <div class="particle-settings">
                    <div class="setting-group">
                        <label>粒子数量: <span id="particle-count-display">50</span></label>
                        <input type="range" id="particle-count" min="10" max="300" value="50">
                    </div>
                    <div class="setting-group">
                        <label>连接距离: <span id="particle-distance-display">100</span></label>
                        <input type="range" id="particle-distance" min="50" max="300" value="100">
                    </div>
                    <div class="setting-group">
                        <label>粒子速度: <span id="particle-speed-display">1</span></label>
                        <input type="range" id="particle-speed" min="0.1" max="3" step="0.1" value="1">
                    </div>
                    <div class="setting-group">
                        <label>粒子大小: <span id="particle-size-display">2</span></label>
                        <input type="range" id="particle-size" min="1" max="8" value="2">
                    </div>
                    <div class="setting-group">
                        <label>颜色模式:</label>
                        <select id="particle-color-mode">
                            <option value="rainbow" selected>彩虹</option>
                            <option value="monochrome">单色</option>
                            <option value="fire">火焰</option>
                            <option value="ocean">海洋</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>交互模式:</label>
                        <select id="particle-interaction">
                            <option value="mouse" selected>鼠标跟随</option>
                            <option value="gravity">重力吸引</option>
                            <option value="repel">排斥</option>
                            <option value="none">无交互</option>
                        </select>
                    </div>
                </div>
                <canvas id="particle-canvas" width="800" height="600"></canvas>
                <div class="particle-info">
                    <p>移动鼠标与粒子交互，调整设置改变动画效果</p>
                </div>
            </div>
        `;

        const entertainment = new ParticleAnimation();
        this.entertainmentInstances['particles'] = entertainment;
        entertainment.init();
    }

    // 音乐可视化
    initVisualizer(container) {
        container.innerHTML = `
            <div class="entertainment-visualizer">
                <div class="visualizer-controls">
                    <button id="visualizer-start-btn" class="btn btn-primary">开始可视化</button>
                    <button id="visualizer-stop-btn" class="btn btn-secondary" disabled>停止</button>
                    <div class="visualizer-info">
                        <p>模拟音频可视化效果，可调节音量和频率</p>
                    </div>
                </div>
                <canvas id="visualizer-canvas" width="800" height="400"></canvas>
                <div class="visualizer-settings">
                    <div class="setting-group">
                        <label>可视化类型: 
                            <select id="visualizer-type">
                                <option value="bars">柱状图</option>
                                <option value="wave">波形图</option>
                                <option value="circle">圆形频谱</option>
                            </select>
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>音量: <input type="range" id="visualizer-volume" min="0" max="100" value="50"></label>
                        <span id="volume-value">50%</span>
                    </div>
                    <div class="setting-group">
                        <label>频率: <input type="range" id="visualizer-frequency" min="1" max="10" value="5"></label>
                        <span id="frequency-value">5</span>
                    </div>
                </div>
            </div>
        `;

        const entertainment = new MusicVisualizer();
        this.entertainmentInstances['visualizer'] = entertainment;
        entertainment.init();
    }

    // 颜色生成器
    initColors(container) {
        container.innerHTML = `
            <div class="entertainment-colors">
                <div class="color-controls">
                    <button id="color-generate-btn" class="btn btn-primary">生成新颜色</button>
                    <button id="color-copy-btn" class="btn btn-secondary">复制颜色值</button>
                    <div class="color-settings">
                        <label>生成模式: 
                            <select id="color-mode">
                                <option value="random">随机颜色</option>
                                <option value="gradient">渐变色彩</option>
                                <option value="palette">配色方案</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="color-display-area">
                    <div class="color-main" id="color-main">
                        <div class="color-info">
                            <div class="color-hex" id="color-hex">#FFFFFF</div>
                            <div class="color-rgb" id="color-rgb">RGB(255, 255, 255)</div>
                            <div class="color-hsl" id="color-hsl">HSL(0°, 0%, 100%)</div>
                        </div>
                    </div>
                    <div class="color-palette" id="color-palette">
                        <!-- 配色方案将在这里显示 -->
                    </div>
                </div>
                <div class="color-history" id="color-history">
                    <!-- 颜色历史记录 -->
                </div>
            </div>
        `;

        const entertainment = new ColorGenerator();
        this.entertainmentInstances['colors'] = entertainment;
        entertainment.init();
    }

    // 打字练习
    initTyping(container) {
        container.innerHTML = `
            <div class="entertainment-typing">
                <div class="typing-header">
                    <h3>打字练习</h3>
                    <div class="typing-category-selector">
                        <label>选择主题: 
                            <select id="typing-category">
                                <option value="工作">工作</option>
                                <option value="生活">生活</option>
                                <option value="科技">科技</option>
                                <option value="教育">教育</option>
                                <option value="环境">环境</option>
                            </select>
                        </label>
                        <label style="margin-left: 12px;">难度: 
                            <select id="typing-difficulty">
                                <option value="easy">简单</option>
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="expert">专家</option>
                            </select>
                        </label>
                    </div>
                    <div class="typing-stats">
                        <div class="stat-item">
                            <span>时间: <span id="typing-timer">0.0</span>秒</span>
                        </div>
                        <div class="stat-item">
                            <span>速度: <span id="typing-speed">0</span>字/分钟</span>
                        </div>
                        <div class="stat-item">
                            <span>准确率: <span id="typing-accuracy">0%</span></span>
                        </div>
                    </div>
                </div>
                <div class="typing-content">
                    <div class="typing-text" id="typing-text"></div>
                    <textarea id="typing-input" placeholder="开始输入..." class="typing-input"></textarea>
                </div>
                <div class="typing-controls">
                    <button id="typing-new-btn" class="btn btn-primary">新文本</button>
                    <button id="typing-reset-btn" class="btn btn-secondary">重置</button>
                </div>
            </div>
        `;

        const entertainment = new TypingPractice();
        this.entertainmentInstances['typing'] = entertainment;
        entertainment.init();
    }

    // 迷宫生成器
    initMaze(container) {
        container.innerHTML = `
            <div class="entertainment-maze">
                <div class="maze-header">
                    <h3>复杂迷宫游戏</h3>
                    <div class="maze-controls">
                        <div class="control-group">
                            <label>迷宫大小: 
                                <select id="maze-size">
                                    <option value="15">15x15 (简单)</option>
                                    <option value="21">21x21 (中等)</option>
                                    <option value="25">25x25 (困难)</option>
                                    <option value="31">31x31 (专家)</option>
                                    <option value="35">35x35 (大师)</option>
                                </select>
                            </label>
                            <label>生成算法: 
                                <select id="maze-algorithm">
                                    <option value="dfs">深度优先搜索</option>
                                    <option value="prim">Prim算法</option>
                                    <option value="kruskal">Kruskal算法</option>

                                    <option value="binary">二叉树算法</option>
                                </select>
                            </label>
                            <label>复杂度: 
                                <select id="maze-complexity">
                                    <option value="simple">简单</option>
                                    <option value="normal">普通</option>
                                    <option value="complex">复杂</option>
                                </select>
                            </label>
                        </div>
                        <div class="control-group">
                            <label>特殊功能: 
                                <select id="maze-features">
                                    <option value="none">无</option>
                                    <option value="teleporters">传送门</option>
                                    <option value="oneway">单向通道</option>
                                </select>
                            </label>
                            <label>迷宫主题: 
                                <select id="maze-theme">
                                    <option value="classic">经典</option>
                                    <option value="forest">森林</option>
                                    <option value="cave">洞穴</option>
                                    <option value="tech">科技</option>
                                    <option value="fantasy">奇幻</option>
                                </select>
                            </label>
                            <label>游戏模式: 
                                <select id="maze-mode">
                                    <option value="view">仅查看</option>
                                    <option value="play">可玩模式</option>
                                </select>
                            </label>
                        </div>
                        <div class="control-buttons">
                            <button id="maze-generate-btn" class="btn btn-primary">生成新迷宫</button>
                            <button id="maze-solve-btn" class="btn btn-secondary">显示路径</button>
                            <button id="maze-reset-btn" class="btn btn-secondary">重置游戏</button>
                            <button id="maze-hint-btn" class="btn btn-secondary">提示</button>
                        </div>
                    </div>
                    <div class="maze-stats">
                        <div class="stat-item">
                            <span>步数: <span id="maze-steps">0</span></span>
                        </div>
                        <div class="stat-item">
                            <span>时间: <span id="maze-time">0</span>秒</span>
                        </div>
                        <div class="stat-item">
                            <span>状态: <span id="maze-status">准备开始</span></span>
                        </div>
                        <div class="stat-item">
                            <span>难度: <span id="maze-difficulty">-</span></span>
                        </div>
                    </div>
                </div>
                <div class="maze-display">
                    <canvas id="maze-canvas" width="600" height="600"></canvas>
                    <div class="maze-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #4CAF50;"></div>
                            <span>起点</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #F44336;"></div>
                            <span>终点</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #2196F3;"></div>
                            <span>玩家</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #FF9800;"></div>
                            <span>路径</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #9C27B0;"></div>
                            <span>传送门</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #FF5722;"></div>
                            <span>单向通道</span>
                        </div>
                    </div>
                </div>
                <div class="maze-instructions">
                    <p><strong>游戏说明:</strong> 在可玩模式下，使用方向键或WASD键移动蓝色玩家方块到达红色终点。按空格键显示最短路径提示。H键获取提示。</p>
                    <p><strong>鼠标控制:</strong> 点击目标位置直接移动，拖拽显示移动路径预览，支持触摸设备。</p>
                    <p><strong>特殊功能:</strong> 传送门可以瞬间传送，单向通道只能单向通过。</p>
                    <p><strong>注意:</strong> 迷宫大小已优化，最大支持35x35，避免电脑卡死。如果生成时间过长，请选择较小的迷宫尺寸。</p>
                </div>
            </div>
        `;

        const entertainment = new MazeGenerator();
        this.entertainmentInstances['maze'] = entertainment;
        entertainment.init();
    }

    // 像素画板
    initPixel(container) {
        container.innerHTML = `
            <div class="entertainment-pixel">
                <div class="pixel-header">
                    <h3>像素画板</h3>
                    <div class="pixel-controls">
                        <label>颜色: <input type="color" id="pixel-color" value="#000000"></label>
                        <button id="pixel-clear-btn" class="btn btn-secondary">清空</button>
                        <button id="pixel-save-btn" class="btn btn-primary">保存</button>
                    </div>
                </div>
                <div class="pixel-canvas-container">
                    <canvas id="pixel-canvas" width="400" height="400"></canvas>
                </div>
                <div class="pixel-instructions">
                    <p>点击或拖拽在网格上绘制像素艺术</p>
                </div>
            </div>
        `;

        const entertainment = new PixelCanvas();
        this.entertainmentInstances['pixel'] = entertainment;
        entertainment.init();
    }

    // 冥想功能
    initMeditation(container) {
        container.innerHTML = `
            <div class="entertainment-meditation">
                <div class="meditation-header">
                    <h3>冥想引导</h3>
                    <p>放松身心，专注当下</p>
                </div>
                <div class="meditation-controls">
                    <button id="meditation-start" class="btn btn-primary">开始冥想</button>
                    <button id="meditation-stop" class="btn btn-secondary" disabled>停止</button>
                    <button id="meditation-reset" class="btn btn-secondary">重置</button>
                </div>
                <div class="meditation-settings">
                    <div class="setting-group">
                        <label for="breathing-rhythm">呼吸节奏:</label>
                        <select id="breathing-rhythm">
                            <option value="slow">慢速 (6秒)</option>
                            <option value="normal" selected>正常 (4秒)</option>
                            <option value="fast">快速 (2秒)</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label for="background-sound">背景音:</label>
                        <select id="background-sound">
                            <option value="none">无</option>
                            <option value="nature">自然音</option>
                            <option value="ocean">海浪声</option>
                            <option value="rain">雨声</option>
                        </select>
                    </div>
                </div>
                <div class="meditation-display">
                    <div class="breathing-guide">
                        <div id="breathing-circle" class="breathing-circle"></div>
                        <div id="breathing-instruction" class="breathing-instruction">准备开始</div>
                    </div>
                    <canvas id="meditation-canvas" width="400" height="300"></canvas>
                </div>
                <div class="meditation-status">
                    <p id="meditation-status">准备开始冥想</p>
                </div>
            </div>
        `;

        const entertainment = new MeditationGuide();
        this.entertainmentInstances['meditation'] = entertainment;
        entertainment.init();
    }

    // 呼吸练习
    initBreathing(container) {
        container.innerHTML = `
            <div class="entertainment-breathing">
                <div class="breathing-header">
                    <h3>呼吸练习</h3>
                    <p>调节呼吸，缓解压力</p>
                </div>
                <div class="breathing-controls">
                    <button id="breathing-start" class="btn btn-primary">开始练习</button>
                    <button id="breathing-stop" class="btn btn-secondary" disabled>停止</button>
                    <button id="breathing-reset" class="btn btn-secondary">重置</button>
                </div>
                <div class="breathing-settings">
                    <div class="setting-group">
                        <label for="breathing-pattern">呼吸模式:</label>
                        <select id="breathing-pattern">
                            <option value="4-4-4-4" selected>4-4-4-4 (平衡)</option>
                            <option value="4-7-8-0">4-7-8 (放松)</option>
                            <option value="6-2-6-2">6-2-6-2 (专注)</option>
                            <option value="5-5-5-5">5-5-5-5 (稳定)</option>
                        </select>
                    </div>
                </div>
                <div class="breathing-display">
                    <div class="breathing-guide">
                        <div id="breathing-circle" class="breathing-circle"></div>
                        <div id="breathing-instruction" class="breathing-instruction">准备开始</div>
                        <div id="breathing-phase" class="breathing-phase">阶段 1/4</div>
                    </div>
                </div>
                <div class="breathing-instructions">
                    <h4>练习说明:</h4>
                    <ul>
                        <li>跟随圆圈的大小变化进行呼吸</li>
                        <li>圆圈变大时吸气，变小时呼气</li>
                        <li>保持自然舒适的节奏</li>
                        <li>专注于呼吸，让思绪平静</li>
                    </ul>
                </div>
            </div>
        `;

        const entertainment = new BreathingExercise();
        this.entertainmentInstances['breathing'] = entertainment;
        entertainment.init();
    }

    // 白噪音
    initWhiteNoise(container) {
        container.innerHTML = `
            <div class="entertainment-whitenoise">
                <div class="whitenoise-header">
                    <h3>白噪音</h3>
                    <p>专注工作，屏蔽干扰</p>
                </div>
                <div class="whitenoise-controls">
                    <button id="noise-play" class="btn btn-primary">播放</button>
                    <div class="whitenoise-status">
                        <span id="noise-status">已停止</span>
                    </div>
                </div>
                <div class="whitenoise-settings">
                    <div class="setting-group">
                        <label for="noise-type">噪音类型:</label>
                        <select id="noise-type">
                            <option value="white" selected>白噪音</option>
                            <option value="pink">粉红噪音</option>
                            <option value="brown">棕噪音</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label for="noise-volume">音量: <span id="volume-display">50</span>%</label>
                        <input type="range" id="noise-volume" min="0" max="100" value="50">
                    </div>
                    <div class="setting-group">
                        <label for="noise-frequency">频率: <span id="frequency-display">1000</span>Hz</label>
                        <input type="range" id="noise-frequency" min="100" max="2000" value="1000">
                    </div>
                </div>
                <div class="whitenoise-info">
                    <h4>噪音类型说明:</h4>
                    <ul>
                        <li><strong>白噪音:</strong> 所有频率均匀分布，适合专注工作</li>
                        <li><strong>粉红噪音:</strong> 低频更多，类似雨声，有助睡眠</li>
                        <li><strong>棕噪音:</strong> 低频占主导，类似雷声，深度放松</li>
                    </ul>
                </div>
            </div>
        `;

        const entertainment = new WhiteNoiseGenerator();
        this.entertainmentInstances['whitenoise'] = entertainment;
        entertainment.init();
    }

    // 涂色书
    initColoring(container) {
        container.innerHTML = `
            <div class="entertainment-coloring">
                <div class="coloring-header">
                    <h3>数字涂色书</h3>
                    <p>放松心情，发挥创意</p>
                </div>
                <div class="coloring-controls">
                    <input type="color" id="coloring-color" value="#ff6b6b">
                    <button id="coloring-clear" class="btn btn-secondary">清空</button>
                    <button id="coloring-save" class="btn btn-primary">保存</button>
                    <button id="coloring-new" class="btn btn-secondary">新图案</button>
                </div>
                <div class="coloring-patterns">
                    <h4>选择图案:</h4>
                    <div class="pattern-grid">
                        <div class="pattern-option" data-pattern="mandala">曼陀罗</div>
                        <div class="pattern-option" data-pattern="flower">花朵</div>
                        <div class="pattern-option" data-pattern="animal">动物</div>
                        <div class="pattern-option" data-pattern="geometric">几何</div>
                    </div>
                </div>
                <div class="coloring-canvas-container">
                    <canvas id="coloring-canvas" width="400" height="400"></canvas>
                </div>
                <div class="coloring-instructions">
                    <p>点击区域进行涂色，选择不同图案开始创作</p>
                </div>
            </div>
        `;

        const entertainment = new ColoringBook();
        this.entertainmentInstances['coloring'] = entertainment;
        entertainment.init();
    }

    // 曼陀罗生成器
    initMandala(container) {
        container.innerHTML = `
            <div class="entertainment-mandala">
                <div class="mandala-header">
                    <h3>曼陀罗生成器</h3>
                    <p>创造美丽的对称图案</p>
                </div>
                <div class="mandala-controls">
                    <button id="mandala-generate" class="btn btn-primary">生成新图案</button>
                    <button id="mandala-save" class="btn btn-secondary">保存图片</button>
                </div>
                <div class="mandala-settings">
                    <div class="setting-group">
                        <label for="mandala-complexity">复杂度: <span id="mandala-complexity-display">6</span></label>
                        <input type="range" id="mandala-complexity" min="3" max="12" value="6">
                    </div>
                    <div class="setting-group">
                        <label for="mandala-colors">颜色模式:</label>
                        <select id="mandala-colors">
                            <option value="rainbow" selected>彩虹</option>
                            <option value="monochrome">单色</option>
                            <option value="pastel">粉彩</option>
                            <option value="dark">深色</option>
                        </select>
                    </div>
                </div>
                <div class="mandala-canvas-container">
                    <canvas id="mandala-canvas" width="500" height="500"></canvas>
                </div>
            </div>
        `;

        const entertainment = new MandalaGenerator();
        this.entertainmentInstances['mandala'] = entertainment;
        entertainment.init();
    }

    // 万花筒
    initKaleidoscope(container) {
        container.innerHTML = `
            <div class="entertainment-kaleidoscope">
                <div class="kaleidoscope-header">
                    <h3>数字万花筒</h3>
                    <p>移动鼠标创造美丽图案</p>
                </div>
                <div class="kaleidoscope-controls">
                    <button id="kaleidoscope-start" class="btn btn-primary">开始</button>
                    <button id="kaleidoscope-stop" class="btn btn-secondary" disabled>停止</button>
                    <button id="kaleidoscope-clear" class="btn btn-secondary">清空</button>
                </div>
                <div class="kaleidoscope-settings">
                    <div class="setting-group">
                        <label for="kaleidoscope-symmetry">对称数: <span id="kaleidoscope-symmetry-display">6</span></label>
                        <input type="range" id="kaleidoscope-symmetry" min="3" max="12" value="6">
                    </div>
                    <div class="setting-group">
                        <label for="kaleidoscope-speed">速度: <span id="kaleidoscope-speed-display">5</span></label>
                        <input type="range" id="kaleidoscope-speed" min="1" max="10" value="5">
                    </div>
                </div>
                <div class="kaleidoscope-canvas-container">
                    <canvas id="kaleidoscope-canvas" width="500" height="500"></canvas>
                </div>
                <div class="kaleidoscope-instructions">
                    <p>移动鼠标在画布上绘制，观察美丽的对称图案</p>
                </div>
            </div>
        `;

        const entertainment = new Kaleidoscope();
        this.entertainmentInstances['kaleidoscope'] = entertainment;
        entertainment.init();
    }
    
    destroy() {
        // 清理迷宫生成超时
        if (this.generationTimeout) {
            clearTimeout(this.generationTimeout);
            this.generationTimeout = null;
        }
        
        // 清理键盘事件监听器
        document.removeEventListener('keydown', this.keyHandler);
    }
}

// 数字雨类
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.drops = [];
        this.speed = 10;
        this.density = 5;
    }

    init() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 确保canvas尺寸正确
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.setupEventListeners();
        this.initDrops();
        
        // 初始化背景
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initDrops() {
        this.drops = [];
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('matrix-start-btn').disabled = true;
        document.getElementById('matrix-stop-btn').disabled = false;
        
        this.animate();
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        document.getElementById('matrix-start-btn').disabled = false;
        document.getElementById('matrix-stop-btn').disabled = true;
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = '16px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            if (Math.random() < this.density / 100) {
                const text = this.characters[Math.floor(Math.random() * this.characters.length)];
                this.ctx.fillText(text, i * 20, this.drops[i] * 1);
                
                if (this.drops[i] * 1 > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                
                this.drops[i] += this.speed / 1.5;
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        document.getElementById('matrix-start-btn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('matrix-stop-btn').addEventListener('click', () => {
            this.stop();
        });

        document.getElementById('matrix-speed').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
        });

        document.getElementById('matrix-density').addEventListener('input', (e) => {
            this.density = parseInt(e.target.value);
        });
    }

    destroy() {
        this.stop();
    }
}

// 粒子动画类
class ParticleAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        this.particleCount = 50;
        this.connectionDistance = 100;
        this.particleSpeed = 1;
        this.particleSize = 2;
        this.colorMode = 'rainbow';
        this.interactionMode = 'mouse';
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
    }

    init() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.initParticles();
        this.updateDisplayValues();
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2 * this.particleSpeed,
                vy: (Math.random() - 0.5) * 2 * this.particleSpeed,
                size: Math.random() * this.particleSize + 1,
                hue: Math.random() * 360,
                originalHue: Math.random() * 360,
                life: 1,
                maxLife: 1
            });
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        document.getElementById('particle-start-btn').disabled = true;
        document.getElementById('particle-stop-btn').disabled = false;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        document.getElementById('particle-start-btn').disabled = false;
        document.getElementById('particle-stop-btn').disabled = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;

        // 更新粒子位置
        this.particles.forEach((particle, index) => {
            // 应用交互效果
            this.applyInteraction(particle);

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检测和反弹
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // 更新生命周期
            particle.life -= 0.001;
            if (particle.life <= 0) {
                this.resetParticle(particle);
            }

            // 绘制粒子
            this.drawParticle(particle);
        });

        // 绘制连接线
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    applyInteraction(particle) {
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        switch (this.interactionMode) {
            case 'mouse':
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += dx * force * 0.01;
                    particle.vy += dy * force * 0.01;
                }
                break;
            case 'gravity':
                if (distance < 200) {
                    const force = 0.1 / (distance + 1);
                    particle.vx += dx * force;
                    particle.vy += dy * force;
                }
                break;
            case 'repel':
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx -= dx * force * 0.02;
                    particle.vy -= dy * force * 0.02;
                }
                break;
        }

        // 限制速度
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > 5) {
            particle.vx = (particle.vx / speed) * 5;
            particle.vy = (particle.vy / speed) * 5;
        }
    }

    drawParticle(particle) {
        const color = this.getParticleColor(particle);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = particle.life;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    getParticleColor(particle) {
        switch (this.colorMode) {
            case 'rainbow':
                return `hsl(${(particle.hue + this.time * 50) % 360}, 70%, 50%)`;
            case 'monochrome':
                return `hsl(0, 0%, ${50 + Math.sin(this.time + particle.x * 0.01) * 30}%)`;
            case 'fire':
                return `hsl(${20 + Math.sin(this.time + particle.x * 0.01) * 20}, 100%, ${50 + Math.sin(this.time * 2) * 20}%)`;
            case 'ocean':
                return `hsl(${180 + Math.sin(this.time + particle.y * 0.01) * 30}, 70%, ${40 + Math.sin(this.time * 1.5) * 20}%)`;
            default:
                return `hsl(${particle.hue}, 70%, 50%)`;
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    const color = this.getConnectionColor(i, j);
                    this.ctx.strokeStyle = color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    getConnectionColor(i, j) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        const avgHue = (particle1.hue + particle2.hue) / 2;
        return `hsl(${avgHue}, 70%, 50%)`;
    }

    resetParticle(particle) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.vx = (Math.random() - 0.5) * 2 * this.particleSpeed;
        particle.vy = (Math.random() - 0.5) * 2 * this.particleSpeed;
        particle.size = Math.random() * this.particleSize + 1;
        particle.hue = Math.random() * 360;
        particle.originalHue = particle.hue;
        particle.life = 1;
    }

    updateDisplayValues() {
        document.getElementById('particle-count-display').textContent = this.particleCount;
        document.getElementById('particle-distance-display').textContent = this.connectionDistance;
        document.getElementById('particle-speed-display').textContent = this.particleSpeed;
        document.getElementById('particle-size-display').textContent = this.particleSize;
    }

    setupEventListeners() {
        document.getElementById('particle-start-btn').addEventListener('click', () => this.start());
        document.getElementById('particle-stop-btn').addEventListener('click', () => this.stop());
        document.getElementById('particle-clear-btn').addEventListener('click', () => this.clear());

        document.getElementById('particle-count').addEventListener('input', (e) => {
            this.particleCount = parseInt(e.target.value);
            this.updateDisplayValues();
            this.initParticles();
        });

        document.getElementById('particle-distance').addEventListener('input', (e) => {
            this.connectionDistance = parseInt(e.target.value);
            this.updateDisplayValues();
        });

        document.getElementById('particle-speed').addEventListener('input', (e) => {
            this.particleSpeed = parseFloat(e.target.value);
            this.updateDisplayValues();
            this.particles.forEach(particle => {
                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > 0) {
                    particle.vx = (particle.vx / speed) * this.particleSpeed;
                    particle.vy = (particle.vy / speed) * this.particleSpeed;
                }
            });
        });

        document.getElementById('particle-size').addEventListener('input', (e) => {
            this.particleSize = parseInt(e.target.value);
            this.updateDisplayValues();
        });

        document.getElementById('particle-color-mode').addEventListener('change', (e) => {
            this.colorMode = e.target.value;
        });

        document.getElementById('particle-interaction').addEventListener('change', (e) => {
            this.interactionMode = e.target.value;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    destroy() {
        this.stop();
    }
}

// 音乐可视化类
class MusicVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        this.audioData = [];
        this.visualizationType = 'bars';
        this.volume = 50;
        this.frequency = 5;
        this.time = 0;
    }

    init() {
        this.canvas = document.getElementById('visualizer-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.generateAudioData();
    }

    generateAudioData() {
        this.audioData = [];
        for (let i = 0; i < 128; i++) {
            // 生成更真实的音频数据，基于正弦波和噪声
            const frequency = (i / 128) * this.frequency * 10;
            const wave = Math.sin(this.time * 0.01 + frequency) * 0.5 + 0.5;
            const noise = (Math.random() - 0.5) * 0.3;
            const value = (wave + noise) * (this.volume / 100) * 255;
            this.audioData.push(Math.max(0, Math.min(255, value)));
        }
        this.time++;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('visualizer-start-btn').disabled = true;
        document.getElementById('visualizer-stop-btn').disabled = false;
        
        this.animate();
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        document.getElementById('visualizer-start-btn').disabled = false;
        document.getElementById('visualizer-stop-btn').disabled = true;
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 生成新的音频数据
        this.generateAudioData();
        
        // 根据类型绘制可视化
        switch (this.visualizationType) {
            case 'bars':
                this.drawBars();
                break;
            case 'wave':
                this.drawWave();
                break;
            case 'circle':
                this.drawCircle();
                break;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawBars() {
        const barWidth = this.canvas.width / this.audioData.length;
        
        this.audioData.forEach((value, index) => {
            const height = (value / 255) * this.canvas.height;
            const x = index * barWidth;
            const y = this.canvas.height - height;
            
            const hue = (index / this.audioData.length) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            this.ctx.fillRect(x, y, barWidth - 1, height);
        });
    }

    drawWave() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        
        this.audioData.forEach((value, index) => {
            const x = (index / this.audioData.length) * this.canvas.width;
            const y = this.canvas.height / 2 + (value - 128) / 128 * (this.canvas.height / 2);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawCircle() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.audioData.forEach((value, index) => {
            const angle = (index / this.audioData.length) * Math.PI * 2;
            const height = (value / 255) * 100;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + height);
            const y2 = centerY + Math.sin(angle) * (radius + height);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = `hsl(${(index / this.audioData.length) * 360}, 70%, 60%)`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        });
    }

    setupEventListeners() {
        document.getElementById('visualizer-start-btn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('visualizer-stop-btn').addEventListener('click', () => {
            this.stop();
        });

        document.getElementById('visualizer-type').addEventListener('change', (e) => {
            this.visualizationType = e.target.value;
        });

        document.getElementById('visualizer-volume').addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value);
            document.getElementById('volume-value').textContent = this.volume + '%';
        });

        document.getElementById('visualizer-frequency').addEventListener('input', (e) => {
            this.frequency = parseInt(e.target.value);
            document.getElementById('frequency-value').textContent = this.frequency;
        });
    }

    destroy() {
        this.stop();
    }
}

// 颜色生成器类
class ColorGenerator {
    constructor() {
        this.currentColor = '#FFFFFF';
        this.colorHistory = [];
        this.maxHistory = 10;
    }

    init() {
        this.setupEventListeners();
        this.generateColor();
    }

    generateColor() {
        const mode = document.getElementById('color-mode').value;
        
        switch (mode) {
            case 'random':
                this.currentColor = this.generateRandomColor();
                break;
            case 'gradient':
                this.currentColor = this.generateGradientColor();
                break;
            case 'palette':
                this.generateColorPalette();
                return;
        }
        
        this.updateColorDisplay();
        this.addToHistory(this.currentColor);
    }

    generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    generateGradientColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 70;
        const lightness = Math.floor(Math.random() * 30) + 40;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    generateColorPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const palette = [];
        
        // 生成5个协调的颜色
        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + i * 72) % 360;
            const saturation = Math.floor(Math.random() * 30) + 70;
            const lightness = Math.floor(Math.random() * 30) + 40;
            palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        this.displayColorPalette(palette);
    }

    displayColorPalette(palette) {
        const paletteContainer = document.getElementById('color-palette');
        paletteContainer.innerHTML = '';
        
        palette.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'palette-color';
            colorBox.style.backgroundColor = color;
            colorBox.style.width = '60px';
            colorBox.style.height = '60px';
            colorBox.style.borderRadius = '8px';
            colorBox.style.margin = '5px';
            colorBox.style.cursor = 'pointer';
            colorBox.title = color;
            
            colorBox.addEventListener('click', () => {
                this.currentColor = color;
                this.updateColorDisplay();
                this.addToHistory(color);
            });
            
            paletteContainer.appendChild(colorBox);
        });
    }

    updateColorDisplay() {
        const mainColor = document.getElementById('color-main');
        const hexDisplay = document.getElementById('color-hex');
        const rgbDisplay = document.getElementById('color-rgb');
        const hslDisplay = document.getElementById('color-hsl');
        
        mainColor.style.backgroundColor = this.currentColor;
        
        // 转换颜色格式
        const hex = this.currentColor;
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        hexDisplay.textContent = hex;
        rgbDisplay.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslDisplay.textContent = `HSL(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    addToHistory(color) {
        this.colorHistory.unshift(color);
        if (this.colorHistory.length > this.maxHistory) {
            this.colorHistory.pop();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('color-history');
        historyContainer.innerHTML = '<h4>颜色历史</h4>';
        
        this.colorHistory.forEach(color => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-color';
            historyItem.style.backgroundColor = color;
            historyItem.style.width = '30px';
            historyItem.style.height = '30px';
            historyItem.style.borderRadius = '4px';
            historyItem.style.margin = '2px';
            historyItem.style.cursor = 'pointer';
            historyItem.title = color;
            
            historyItem.addEventListener('click', () => {
                this.currentColor = color;
                this.updateColorDisplay();
            });
            
            historyContainer.appendChild(historyItem);
        });
    }

    copyColor() {
        navigator.clipboard.writeText(this.currentColor).then(() => {
            window.app.showNotification('颜色值已复制到剪贴板', 'success');
        }).catch(() => {
            window.app.showNotification('复制失败', 'error');
        });
    }

    setupEventListeners() {
        document.getElementById('color-generate-btn').addEventListener('click', () => {
            this.generateColor();
        });

        document.getElementById('color-copy-btn').addEventListener('click', () => {
            this.copyColor();
        });

        document.getElementById('color-mode').addEventListener('change', () => {
            this.generateColor();
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 打字练习类
class TypingPractice {
    constructor() {
        this.currentText = '';
        this.userInput = '';
        this.startTime = null;
        this.isActive = false;
        this.textCategories = {
            '工作': [
                '我 今天 要 完成 这个 重要 的 项目 报告。',
                '团队 合作 很 关键，我们 需要 互相 支持。',
                '时间 管理 是 提高 效率 的 基础。',
                '创新 思维 能 推动 企业 发展 和 进步。',
                '责任 心 和 专业 素养 是 职场 必备 品质。',
                '目标 要 具体 可 衡量，计划 要 详细 可行。',
                '沟通 技巧 对 工作 成功 非常 重要。',
                '学习 新 技能 能 保持 竞争 优势。',
                '主动 承担 责任 会 获得 更多 机会。',
                '工作 质量 比 速度 更 重要。'
            ],
            '生活': [
                '健康 的 生活 方式 包括 规律 作息。',
                '阅读 是 获取 知识 的 重要 途径。',
                '旅行 能 开阔 视野，体验 不同 文化。',
                '音乐 能 陶冶 情操，丰富 精神 世界。',
                '家庭 是 人生 的 重要 支柱。',
                '运动 对 身体 健康 很 有益。',
                '朋友 之间 要 互相 理解 和 支持。',
                '美食 能 带来 快乐 和 满足。',
                '睡眠 质量 影响 一天 的 状态。',
                '爱好 能 让 生活 更加 丰富 多彩。'
            ],
            '科技': [
                '人工智能 技术 正在 快速 发展。',
                '互联网 连接 了 整个 世界。',
                '云计算 提供 强大 的 计算 能力。',
                '移动 设备 成为 生活 必需品。',
                '区块链 技术 具有 去 中心化 特点。',
                '大数据 分析 帮助 企业 做 决策。',
                '5G 网络 将 改变 通信 方式。',
                '虚拟 现实 技术 应用 广泛。',
                '物联网 连接 各种 智能 设备。',
                '量子 计算 是 未来 的 方向。'
            ],
            '教育': [
                '终身 学习 是 现代 社会 的 要求。',
                '教育 不仅 是 知识 的 传授。',
                '在线 教育 平台 提供 灵活 学习 方式。',
                '实践 是 检验 真理 的 唯一 标准。',
                '个性化 教育 能 满足 不同 需求。',
                '批判性 思维 很 重要。',
                '创新 能力 需要 培养。',
                '学习 兴趣 是 最好 的 老师。',
                '知识 获取 变得 更加 便捷。',
                '理论 结合 实践 效果 更好。'
            ],
            '环境': [
                '环境 保护 是 全人类 的 共同 责任。',
                '减少 碳排放 有助于 应对 气候变化。',
                '可持续发展 理念 强调 平衡。',
                '垃圾分类 是 环保 的 重要 措施。',
                '清洁 能源 技术 不断 发展。',
                '太阳能 和 风能 是 可再生 能源。',
                '生物多样性 保护 维护 生态 平衡。',
                '绿色 技术 推动 产业 转型。',
                '循环 利用 资源 能 减少 污染。',
                '人与自然 和谐 共生 是 目标。'
            ]
        };
        this.currentCategory = '工作';
        this.difficulty = 'normal';
    }

    init() {
        this.generateNewText();
        this.setupEventListeners();
    }

    generateNewText() {
        const category = this.currentCategory;
        const texts = this.textCategories[category];
        // 基于难度控制长度：easy取短句，hard/expert拼接多句
        const pick = () => texts[Math.floor(Math.random() * texts.length)];
        let text = pick();
        if (this.difficulty === 'easy') {
            // 尽量取较短句
            text = texts.slice().sort((a,b)=>a.length-b.length)[0];
        } else if (this.difficulty === 'normal') {
            // 随机一句
            text = pick();
        } else if (this.difficulty === 'hard') {
            // 两句合并
            text = pick() + ' ' + pick();
        } else if (this.difficulty === 'expert') {
            // 三句合并
            text = pick() + ' ' + pick() + ' ' + pick();
        }
        this.currentText = text;
        document.getElementById('typing-text').textContent = this.currentText;
        document.getElementById('typing-input').value = '';
        this.userInput = '';
        this.resetTimer();
    }

    changeCategory(category) {
        this.currentCategory = category;
        this.generateNewText();
    }

    changeDifficulty(level) {
        this.difficulty = level;
        this.generateNewText();
    }

    startTimer() {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.isActive = true;
        }
    }

    resetTimer() {
        this.startTime = null;
        this.isActive = false;
        document.getElementById('typing-timer').textContent = '0.0';
        document.getElementById('typing-speed').textContent = '0';
        document.getElementById('typing-accuracy').textContent = '0%';
    }

    calculateStats() {
        if (!this.startTime || !this.isActive) return;

        const endTime = Date.now();
        const timeElapsed = (endTime - this.startTime) / 1000;
        const wordsTyped = this.userInput.trim().split(/\s+/).length;
        const speed = Math.round((wordsTyped / timeElapsed) * 60);

        const accuracy = this.calculateAccuracy();

        document.getElementById('typing-timer').textContent = timeElapsed.toFixed(1);
        document.getElementById('typing-speed').textContent = speed;
        document.getElementById('typing-accuracy').textContent = accuracy + '%';
    }

    calculateAccuracy() {
        if (this.currentText.length === 0) return 0;
        
        let correct = 0;
        const minLength = Math.min(this.currentText.length, this.userInput.length);
        
        for (let i = 0; i < minLength; i++) {
            if (this.currentText[i] === this.userInput[i]) {
                correct++;
            }
        }
        
        return Math.round((correct / this.currentText.length) * 100);
    }

    checkCompletion() {
        if (this.userInput.trim() === this.currentText.trim()) {
            this.calculateStats();
            this.isActive = false;
            if (window.app && window.app.showNotification) {
                window.app.showNotification('恭喜完成！', 'success');
            } else {
                alert('恭喜完成打字练习！');
            }
        }
    }

    setupEventListeners() {
        const input = document.getElementById('typing-input');
        
        input.addEventListener('input', (e) => {
            this.userInput = e.target.value;
            this.startTimer();
            this.calculateStats();
            this.checkCompletion();
        });

        document.getElementById('typing-new-btn').addEventListener('click', () => {
            this.generateNewText();
        });

        document.getElementById('typing-reset-btn').addEventListener('click', () => {
            this.resetTimer();
            input.value = '';
            this.userInput = '';
        });

        document.getElementById('typing-category').addEventListener('change', (e) => {
            this.changeCategory(e.target.value);
        });

        const diffEl = document.getElementById('typing-difficulty');
        if (diffEl) {
            diffEl.addEventListener('change', (e) => {
                this.changeDifficulty(e.target.value);
            });
        }
    }

    destroy() {
        // 清理事件监听器
    }
}

// 复杂迷宫生成器类
class MazeGenerator {
    constructor() {
        this.size = 15;
        this.maze = [];
        this.canvas = null;
        this.ctx = null;
        this.player = { x: 1, y: 1 };
        this.gameMode = 'view';
        this.isPlaying = false;
        this.steps = 0;
        this.startTime = null;
        this.gameTimer = null;
        this.showPath = false;
        this.solutionPath = [];
        this.keyHandlers = {};
        
        // 新增复杂功能属性
        this.algorithm = 'dfs';
        this.complexity = 'normal';
        this.features = 'none';
        this.theme = 'classic';
        this.teleporters = [];
        this.oneWayPassages = [];
        this.hintCount = 3;
        this.difficulty = 1;
        
        // 添加超时保护
        this.generationTimeout = null;
        this.maxGenerationTime = 5000; // 5秒超时
        
        // 迷宫单元格类型
        this.CELL_TYPES = {
            WALL: 1,
            PATH: 0,
            START: 2,
            END: 3,
            PLAYER: 4,
            TELEPORTER: 5,
            ONE_WAY_UP: 6,
            ONE_WAY_DOWN: 7,
            ONE_WAY_LEFT: 8,
            ONE_WAY_RIGHT: 9
        };
    }

    init() {
        this.canvas = document.getElementById('maze-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadSettings();
        this.generateMaze();
        this.setupEventListeners();
        this.setupKeyboardControls();
    }

    loadSettings() {
        this.size = parseInt(document.getElementById('maze-size').value);
        this.algorithm = document.getElementById('maze-algorithm').value;
        this.complexity = document.getElementById('maze-complexity').value;
        this.features = document.getElementById('maze-features').value;
        this.theme = document.getElementById('maze-theme').value;
        this.gameMode = document.getElementById('maze-mode').value;
        
        // 计算难度系数
        this.calculateDifficulty();
    }

    calculateDifficulty() {
        let difficulty = 1;
        
        // 基于大小
        difficulty += (this.size - 15) / 10;
        
        // 基于算法
        const algorithmMultiplier = {
            'dfs': 1,
            'prim': 1.2,
            'kruskal': 1.3,
            'recursive': 1.5,
            'binary': 1.1
        };
        difficulty *= algorithmMultiplier[this.algorithm] || 1;
        
        // 基于复杂度
        const complexityMultiplier = {
            'simple': 0.8,
            'normal': 1,
            'complex': 1.5
        };
        difficulty *= complexityMultiplier[this.complexity] || 1;
        
        // 基于特殊功能
        const featureMultiplier = {
            'none': 1,
            'teleporters': 1.3,
            'oneway': 1.4
        };
        difficulty *= featureMultiplier[this.features] || 1;
        
        this.difficulty = Math.round(difficulty * 10) / 10;
        document.getElementById('maze-difficulty').textContent = this.difficulty;
    }

    generateMaze() {
        this.loadSettings();
        
        // 限制迷宫大小，防止卡死
        if (this.size > 35) {
            this.size = 35;
            console.warn('迷宫大小已限制为35x35，避免电脑卡死');
        }
        
        // 确保迷宫大小为奇数
        if (this.size % 2 === 0) {
            this.size += 1;
        }
        
        // 使用统一的迷宫生成方法，确保兼容性
        this.generateUnifiedMaze();
        
        // 根据复杂度添加额外通道
        this.addComplexityFeatures();
        
        // 添加特殊功能
        this.addSpecialFeatures();
        
        // 重置游戏状态
        this.resetGame();
        
        // 绘制迷宫
        this.drawMaze();
        
        // 最终验证迷宫状态
        console.log('迷宫生成完成，最终状态:');
        console.log('起点 (1,1):', this.maze[1][1]);
        console.log('终点 (', this.size - 2, ',', this.size - 2, '):', this.maze[this.size - 2][this.size - 2]);
        console.log('玩家位置:', this.player);
    }
    
    // 统一的迷宫生成方法
    generateUnifiedMaze() {
        // 初始化迷宫，所有奇数位置为路径，偶数位置为墙壁
        this.maze = Array(this.size).fill().map(() => Array(this.size).fill(1));
        
        // 先创建基础网格结构
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                this.maze[y][x] = this.CELL_TYPES.PATH;
            }
        }
        
        // 根据选择的算法生成迷宫
        switch (this.algorithm) {
            case 'dfs':
                this.generateDFSUnified();
                break;
            case 'prim':
                this.generatePrimUnified();
                break;
            case 'kruskal':
                this.generateKruskalUnified();
                break;
            case 'binary':
                this.generateBinaryUnified();
                break;
            default:
                this.generateDFSUnified();
        }
        
        // 确保起点到终点有路径
        this.ensureStartEndPath();
    }
    
    // 确保起点到终点有路径
    ensureStartEndPath() {
        // 使用A*算法找到从起点到终点的路径
        const path = this.findPathAStar(1, 1, this.size - 2, this.size - 2);
        
        if (path.length > 0) {
            // 确保路径上的所有点都是通道
            for (const pos of path) {
                if (this.maze[pos.y][pos.x] === this.CELL_TYPES.WALL) {
                    this.maze[pos.y][pos.x] = this.CELL_TYPES.PATH;
                }
            }
            console.log('起点到终点路径已确保');
        } else {
            console.warn('无法找到起点到终点的路径，使用备用方法');
            this.createGuaranteedPath();
        }
        
        // 确保起点和终点位置正确
        this.maze[1][1] = this.CELL_TYPES.START;
        this.maze[this.size - 2][this.size - 2] = this.CELL_TYPES.END;
        
        // 验证起点和终点是否可达
        console.log('起点状态:', this.maze[1][1], '终点状态:', this.maze[this.size - 2][this.size - 2]);
        console.log('起点周围:', {
            up: this.maze[0][1],
            down: this.maze[2][1],
            left: this.maze[1][0],
            right: this.maze[1][2]
        });
    }
    
    // 创建保证可达的路径
    createGuaranteedPath() {
        console.log('创建保证可达的路径');
        
        // 创建一条从起点到终点的L形路径
        const startX = 1, startY = 1;
        const endX = this.size - 2, endY = this.size - 2;
        
        // 水平路径
        for (let x = startX; x <= endX; x++) {
            this.maze[startY][x] = this.CELL_TYPES.PATH;
        }
        
        // 垂直路径
        for (let y = startY; y <= endY; y++) {
            this.maze[y][endX] = this.CELL_TYPES.PATH;
        }
        
        // 确保起点和终点可达
        this.maze[startY][startX] = this.CELL_TYPES.START;
        this.maze[endY][endX] = this.CELL_TYPES.END;
    }
    
    // A*算法寻找路径
    findPathAStar(startX, startY, endX, endY) {
        const openSet = [{x: startX, y: startY, g: 0, h: 0, f: 0, parent: null}];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        gScore.set(`${startX},${startY}`, 0);
        fScore.set(`${startX},${startY}`, this.heuristic(startX, startY, endX, endY));
        
        while (openSet.length > 0) {
            // 找到f值最小的节点
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();
            
            if (current.x === endX && current.y === endY) {
                // 重建路径
                return this.reconstructPath(cameFrom, current);
            }
            
            closedSet.add(`${current.x},${current.y}`);
            
            const directions = [
                {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
            ];
            
            for (const dir of directions) {
                const neighbor = {
                    x: current.x + dir.dx,
                    y: current.y + dir.dy
                };
                
                if (neighbor.x < 0 || neighbor.x >= this.size || 
                    neighbor.y < 0 || neighbor.y >= this.size) {
                    continue;
                }
                
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (closedSet.has(neighborKey)) {
                    continue;
                }
                
                // 检查是否可以移动（墙壁不能通过）
                if (this.maze[neighbor.y][neighbor.x] === this.CELL_TYPES.WALL) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;
                
                if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }
                
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor.x, neighbor.y, endX, endY));
            }
        }
        
        return [];
    }

    // 统一的DFS算法
    generateDFSUnified() {
        const stack = [{x: 1, y: 1}];
        const visited = new Set();
        visited.add('1,1');
        
        const directions = [
            {dx: 0, dy: -2}, {dx: 2, dy: 0}, {dx: 0, dy: 2}, {dx: -2, dy: 0}
        ];
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
            let found = false;
            
            for (const dir of shuffledDirections) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && 
                    this.maze[ny][nx] === this.CELL_TYPES.PATH && 
                    !visited.has(`${nx},${ny}`)) {
                    
                    // 打通中间的墙
                    const wallX = (current.x + nx) / 2;
                    const wallY = (current.y + ny) / 2;
                    this.maze[wallY][wallX] = this.CELL_TYPES.PATH;
                    
                    visited.add(`${nx},${ny}`);
                    stack.push({x: nx, y: ny});
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                stack.pop();
            }
        }
    }
    
    // 原始的DFS算法（保留用于兼容性）
    generateDFS() {
        const stack = [{x: 1, y: 1}];
        this.maze[1][1] = this.CELL_TYPES.PATH;
        
        const directions = [
            {dx: 0, dy: -2}, {dx: 2, dy: 0}, {dx: 0, dy: 2}, {dx: -2, dy: 0}
        ];
        
        let iterations = 0;
        const maxIterations = this.size * this.size * 3; // 增加迭代次数
        
        while (stack.length > 0 && iterations < maxIterations) {
            iterations++;
            
            const current = stack[stack.length - 1];
            const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
            let found = false;
            
            for (const dir of shuffledDirections) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && 
                    this.maze[ny][nx] === this.CELL_TYPES.WALL) {
                    this.maze[nx][ny] = this.CELL_TYPES.PATH;
                    this.maze[(current.x + nx) / 2][(current.y + ny) / 2] = this.CELL_TYPES.PATH;
                    stack.push({x: nx, y: ny});
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                stack.pop();
            }
        }
        
        // 确保迷宫连通性
        this.ensureConnectivity();
        
        if (iterations >= maxIterations) {
            console.warn('DFS算法达到最大迭代次数，已使用连通性修复');
        }
    }
    
    // 确保迷宫连通性
    ensureConnectivity() {
        const visited = new Set();
        const components = [];
        
        // 找到所有连通分量
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                if (this.maze[y][x] === this.CELL_TYPES.PATH && !visited.has(`${x},${y}`)) {
                    const component = [];
                    this.floodFill(x, y, visited, component);
                    components.push(component);
                }
            }
        }
        
        // 如果只有一个连通分量，迷宫已经连通
        if (components.length <= 1) {
            return;
        }
        
        // 连接不同的连通分量
        for (let i = 0; i < components.length - 1; i++) {
            const current = components[i];
            const next = components[i + 1];
            
            // 找到两个分量之间的最短路径
            const connection = this.findShortestConnection(current, next);
            if (connection) {
                // 打通连接路径
                for (const pos of connection) {
                    this.maze[pos.y][pos.x] = this.CELL_TYPES.PATH;
                }
            }
        }
    }
    
    // 洪水填充算法找到连通分量
    floodFill(x, y, visited, component) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size || 
            this.maze[y][x] !== this.CELL_TYPES.PATH || visited.has(`${x},${y}`)) {
            return;
        }
        
        visited.add(`${x},${y}`);
        component.push({x, y});
        
        const directions = [
            {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
        ];
        
        for (const dir of directions) {
            this.floodFill(x + dir.dx, y + dir.dy, visited, component);
        }
    }
    
    // 找到两个连通分量之间的最短连接
    findShortestConnection(comp1, comp2) {
        let minDistance = Infinity;
        let bestConnection = null;
        
        for (const pos1 of comp1) {
            for (const pos2 of comp2) {
                const distance = Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestConnection = this.createPath(pos1, pos2);
                }
            }
        }
        
        return bestConnection;
    }
    
    // 创建两点之间的路径
    createPath(start, end) {
        const path = [];
        let current = {x: start.x, y: start.y};
        
        // 先水平移动
        while (current.x !== end.x) {
            const nextX = current.x + (end.x > current.x ? 1 : -1);
            path.push({x: nextX, y: current.y});
            current.x = nextX;
        }
        
        // 再垂直移动
        while (current.y !== end.y) {
            const nextY = current.y + (end.y > current.y ? 1 : -1);
            path.push({x: current.x, y: nextY});
            current.y = nextY;
        }
        
        return path;
    }

    // 统一的Prim算法
    generatePrimUnified() {
        const walls = new Set();
        const visited = new Set();
        
        // 初始化所有墙壁位置
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                visited.add(`${x},${y}`);
                
                // 添加相邻的墙壁
                const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
                for (const dir of directions) {
                    const wx = x + dir.dx;
                    const wy = y + dir.dy;
                    if (wx > 0 && wx < this.size - 1 && wy > 0 && wy < this.size - 1) {
                        walls.add(`${wx},${wy}`);
                    }
                }
            }
        }
        
        while (walls.size > 0) {
            const wallArray = Array.from(walls);
            const randomWall = wallArray[Math.floor(Math.random() * wallArray.length)];
            const [wx, wy] = randomWall.split(',').map(Number);
            
            walls.delete(randomWall);
            
            // 检查这面墙连接的两个单元格
            const neighbors = [];
            const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
            
            for (const dir of directions) {
                const nx = wx + dir.dx;
                const ny = wy + dir.dy;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    neighbors.push({x: nx, y: ny});
                }
            }
            
            // 如果只有一个邻居被访问过，则打通这面墙
            const visitedNeighbors = neighbors.filter(n => visited.has(`${n.x},${n.y}`));
            if (visitedNeighbors.length === 1) {
                this.maze[wy][wx] = this.CELL_TYPES.PATH;
                const unvisitedNeighbor = neighbors.find(n => !visited.has(`${n.x},${n.y}`));
                if (unvisitedNeighbor) {
                    visited.add(`${unvisitedNeighbor.x},${unvisitedNeighbor.y}`);
                    
                    // 添加新的墙壁
                    for (const dir of directions) {
                        const newWx = unvisitedNeighbor.x + dir.dx;
                        const newWy = unvisitedNeighbor.y + dir.dy;
                        if (newWx > 0 && newWx < this.size - 1 && newWy > 0 && newWy < this.size - 1) {
                            walls.add(`${newWx},${newWy}`);
                        }
                    }
                }
            }
        }
    }
    
    // 原始的Prim算法（保留用于兼容性）
    generatePrim() {
        const walls = new Set();
        const visited = new Set();
        
        // 初始化所有墙壁位置
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                this.maze[y][x] = this.CELL_TYPES.PATH;
                visited.add(`${x},${y}`);
                
                // 添加相邻的墙壁
                const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
                for (const dir of directions) {
                    const wx = x + dir.dx;
                    const wy = y + dir.dy;
                    if (wx > 0 && wx < this.size - 1 && wy > 0 && wy < this.size - 1) {
                        walls.add(`${wx},${wy}`);
                    }
                }
            }
        }
        
        let iterations = 0;
        const maxIterations = this.size * this.size * 3; // 防止无限循环
        
        while (walls.size > 0 && iterations < maxIterations) {
            iterations++;
            
            const wallArray = Array.from(walls);
            const randomWall = wallArray[Math.floor(Math.random() * wallArray.length)];
            const [wx, wy] = randomWall.split(',').map(Number);
            
            walls.delete(randomWall);
            
            // 检查这面墙连接的两个单元格
            const neighbors = [];
            const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
            
            for (const dir of directions) {
                const nx = wx + dir.dx;
                const ny = wy + dir.dy;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    neighbors.push({x: nx, y: ny});
                }
            }
            
            // 如果只有一个邻居被访问过，则打通这面墙
            const visitedNeighbors = neighbors.filter(n => visited.has(`${n.x},${n.y}`));
            if (visitedNeighbors.length === 1) {
                this.maze[wy][wx] = this.CELL_TYPES.PATH;
                const unvisitedNeighbor = neighbors.find(n => !visited.has(`${n.x},${n.y}`));
                if (unvisitedNeighbor) {
                    this.maze[unvisitedNeighbor.y][unvisitedNeighbor.x] = this.CELL_TYPES.PATH;
                    visited.add(`${unvisitedNeighbor.x},${unvisitedNeighbor.y}`);
                    
                    // 添加新的墙壁
                    for (const dir of directions) {
                        const newWx = unvisitedNeighbor.x + dir.dx;
                        const newWy = unvisitedNeighbor.y + dir.dy;
                        if (newWx > 0 && newWx < this.size - 1 && newWy > 0 && newWy < this.size - 1) {
                            walls.add(`${newWx},${newWy}`);
                        }
                    }
                }
            }
        }
        
        // 确保迷宫连通性
        this.ensureConnectivity();
        
        if (iterations >= maxIterations) {
            console.warn('Prim算法达到最大迭代次数，已使用连通性修复');
        }
    }

    // 统一的Kruskal算法
    generateKruskalUnified() {
        // 初始化所有单元格为独立的集合
        const sets = new Map();
        const edges = [];
        
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                sets.set(`${x},${y}`, new Set([`${x},${y}`]));
                
                // 收集所有可能的边
                if (x + 2 < this.size - 1) {
                    edges.push({x1: x, y1: y, x2: x + 2, y2: y, wallX: x + 1, wallY: y});
                }
                if (y + 2 < this.size - 1) {
                    edges.push({x1: x, y1: y, x2: x, y2: y + 2, wallX: x, wallY: y + 1});
                }
            }
        }
        
        // 随机打乱边的顺序
        edges.sort(() => Math.random() - 0.5);
        
        for (const edge of edges) {
            const set1 = sets.get(`${edge.x1},${edge.y1}`);
            const set2 = sets.get(`${edge.x2},${edge.y2}`);
            
            if (set1 !== set2) {
                // 合并集合
                const union = new Set([...set1, ...set2]);
                for (const cell of union) {
                    sets.set(cell, union);
                }
                
                // 打通墙壁
                this.maze[edge.wallY][edge.wallX] = this.CELL_TYPES.PATH;
            }
        }
    }
    
    // 统一的二叉树算法
    generateBinaryUnified() {
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                // 随机选择向右或向下
                if (Math.random() < 0.5 && x + 2 < this.size - 1) {
                    this.maze[y][x + 1] = this.CELL_TYPES.PATH;
                } else if (y + 2 < this.size - 1) {
                    this.maze[y + 1][x] = this.CELL_TYPES.PATH;
                }
            }
        }
    }
    
    // 原始的Kruskal算法（保留用于兼容性）
    generateKruskal() {
        // 初始化所有单元格为独立的集合
        const sets = new Map();
        const edges = [];
        
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                this.maze[y][x] = this.CELL_TYPES.PATH;
                sets.set(`${x},${y}`, new Set([`${x},${y}`]));
                
                // 收集所有可能的边
                if (x + 2 < this.size - 1) {
                    edges.push({x1: x, y1: y, x2: x + 2, y2: y, wallX: x + 1, wallY: y});
                }
                if (y + 2 < this.size - 1) {
                    edges.push({x1: x, y1: y, x2: x, y2: y + 2, wallX: x, wallY: y + 1});
                }
            }
        }
        
        // 随机打乱边的顺序
        edges.sort(() => Math.random() - 0.5);
        
        let iterations = 0;
        const maxIterations = edges.length * 2; // 防止无限循环
        
        for (const edge of edges) {
            iterations++;
            if (iterations > maxIterations) break;
            
            const set1 = sets.get(`${edge.x1},${edge.y1}`);
            const set2 = sets.get(`${edge.x2},${edge.y2}`);
            
            if (set1 !== set2) {
                // 合并集合
                const union = new Set([...set1, ...set2]);
                for (const cell of union) {
                    sets.set(cell, union);
                }
                
                // 打通墙壁
                this.maze[edge.wallY][edge.wallX] = this.CELL_TYPES.PATH;
            }
        }
        
        // 确保迷宫连通性
        this.ensureConnectivity();
        
        if (iterations >= maxIterations) {
            console.warn('Kruskal算法达到最大迭代次数，已使用连通性修复');
        }
    }

    generateRecursive() {
        this.recursiveDivision(0, 0, this.size, this.size);
    }

    recursiveDivision(x, y, width, height, depth = 0) {
        // 限制递归深度，防止栈溢出
        if (depth > 20 || width < 3 || height < 3) return;
        
        // 随机选择一个点作为分割点
        const wallX = x + 1 + Math.floor(Math.random() * (width - 2));
        const wallY = y + 1 + Math.floor(Math.random() * (height - 2));
        
        // 在分割点上开一个洞
        this.maze[wallY][wallX] = this.CELL_TYPES.PATH;
        
        // 递归分割四个象限
        this.recursiveDivision(x, y, wallX - x, wallY - y, depth + 1);
        this.recursiveDivision(wallX + 1, y, x + width - wallX - 1, wallY - y, depth + 1);
        this.recursiveDivision(x, wallY + 1, wallX - x, y + height - wallY - 1, depth + 1);
        this.recursiveDivision(wallX + 1, wallY + 1, x + width - wallX - 1, y + height - wallY - 1, depth + 1);
    }

    generateBinary() {
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                this.maze[y][x] = this.CELL_TYPES.PATH;
                
                // 随机选择向右或向下
                if (Math.random() < 0.5 && x + 2 < this.size - 1) {
                    this.maze[y][x + 1] = this.CELL_TYPES.PATH;
                    this.maze[y][x + 2] = this.CELL_TYPES.PATH;
                } else if (y + 2 < this.size - 1) {
                    this.maze[y + 1][x] = this.CELL_TYPES.PATH;
                    this.maze[y + 2][x] = this.CELL_TYPES.PATH;
                }
            }
        }
    }

    addComplexityFeatures() {
        const complexitySettings = {
            'simple': { extraPassages: 0, deadEnds: 0 },
            'normal': { extraPassages: Math.floor(this.size / 8), deadEnds: 0 },
            'complex': { extraPassages: Math.floor(this.size / 4), deadEnds: Math.floor(this.size / 6) }
        };
        
        const settings = complexitySettings[this.complexity] || complexitySettings['normal'];
        
        // 添加额外通道
        for (let i = 0; i < settings.extraPassages; i++) {
            const x = 1 + Math.floor(Math.random() * (this.size - 2));
            const y = 1 + Math.floor(Math.random() * (this.size - 2));
            if (this.maze[y][x] === this.CELL_TYPES.WALL) {
                this.maze[y][x] = this.CELL_TYPES.PATH;
            }
        }
        
        // 添加死胡同
        for (let i = 0; i < settings.deadEnds; i++) {
            const x = 1 + Math.floor(Math.random() * (this.size - 2));
            const y = 1 + Math.floor(Math.random() * (this.size - 2));
            if (this.maze[y][x] === this.CELL_TYPES.PATH) {
                // 随机封死一个方向
                const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                if (nx > 0 && nx < this.size - 1 && ny > 0 && ny < this.size - 1) {
                    this.maze[ny][nx] = this.CELL_TYPES.WALL;
                }
            }
        }
    }

    addSpecialFeatures() {
        this.teleporters = [];
        this.oneWayPassages = [];
        
        if (this.features === 'none') return;
        
        const featureCount = Math.floor(this.size / 6);
        
        if (this.features === 'teleporters') {
            // 添加传送门
            for (let i = 0; i < featureCount; i++) {
                const x = 1 + Math.floor(Math.random() * (this.size - 2));
                const y = 1 + Math.floor(Math.random() * (this.size - 2));
                if (this.maze[y][x] === this.CELL_TYPES.PATH) {
                    this.maze[y][x] = this.CELL_TYPES.TELEPORTER;
                    this.teleporters.push({x, y, id: i});
                }
            }
        }
        
        if (this.features === 'oneway') {
            // 添加单向通道
            for (let i = 0; i < featureCount; i++) {
                const x = 1 + Math.floor(Math.random() * (this.size - 2));
                const y = 1 + Math.floor(Math.random() * (this.size - 2));
                if (this.maze[y][x] === this.CELL_TYPES.PATH) {
                    const direction = Math.floor(Math.random() * 4);
                    this.maze[y][x] = this.CELL_TYPES.ONE_WAY_UP + direction;
                    this.oneWayPassages.push({x, y, direction});
                }
            }
        }
    }
    
    // 验证迷宫是否有解
    verifyMazeSolvability() {
        const start = {x: 1, y: 1};
        const end = {x: this.size - 2, y: this.size - 2};
        
        // 使用BFS检查路径是否存在
        const visited = new Set();
        const queue = [start];
        visited.add(`${start.x},${start.y}`);
        
        const directions = [
            {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // 检查是否到达终点
            if (current.x === end.x && current.y === end.y) {
                return true;
            }
            
            // 检查四个方向
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                const key = `${nx},${ny}`;
                
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && 
                    !visited.has(key) && this.maze[ny][nx] !== this.CELL_TYPES.WALL) {
                    visited.add(key);
                    queue.push({x: nx, y: ny});
                }
            }
        }
        
        return false;
    }
    
    // 备用迷宫生成算法（保证有解）
    generateFallbackMaze() {
        console.log('使用备用迷宫生成算法');
        
        // 重置迷宫
        this.maze = Array(this.size).fill().map(() => Array(this.size).fill(1));
        
        // 使用简单的路径生成算法
        this.generateSimplePath();
        
        // 设置起点和终点
        this.maze[1][1] = this.CELL_TYPES.START;
        this.maze[this.size - 2][this.size - 2] = this.CELL_TYPES.END;
        
        // 验证是否有解
        if (!this.verifyMazeSolvability()) {
            console.error('备用算法也失败，强制生成简单路径');
            this.forceGeneratePath();
        }
    }
    
    // 生成简单路径
    generateSimplePath() {
        // 创建一条从起点到终点的基本路径
        const path = this.findPath(1, 1, this.size - 2, this.size - 2);
        
        if (path.length > 0) {
            // 将路径标记为通道
            for (const pos of path) {
                this.maze[pos.y][pos.x] = this.CELL_TYPES.PATH;
            }
            
            // 添加一些随机分支
            this.addRandomBranches();
        }
    }
    
    // 寻找路径（A*算法简化版）
    findPath(startX, startY, endX, endY) {
        const openSet = [{x: startX, y: startY, g: 0, h: 0, f: 0, parent: null}];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        gScore.set(`${startX},${startY}`, 0);
        fScore.set(`${startX},${startY}`, this.heuristic(startX, startY, endX, endY));
        
        while (openSet.length > 0) {
            // 找到f值最小的节点
            openSet.sort((a, b) => a.f - b.f);
            let current = openSet.shift();
            
            if (current.x === endX && current.y === endY) {
                // 重建路径
                return this.reconstructPath(cameFrom, current);
            }
            
            closedSet.add(`${current.x},${current.y}`);
            
            const directions = [
                {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
            ];
            
            for (const dir of directions) {
                const neighbor = {
                    x: current.x + dir.dx,
                    y: current.y + dir.dy
                };
                
                if (neighbor.x < 0 || neighbor.x >= this.size || 
                    neighbor.y < 0 || neighbor.y >= this.size) {
                    continue;
                }
                
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (closedSet.has(neighborKey)) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;
                
                if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }
                
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor.x, neighbor.y, endX, endY));
            }
        }
        
        return [];
    }
    
    // 启发式函数（曼哈顿距离）
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    
    // 重建路径
    reconstructPath(cameFrom, current) {
        const path = [];
        let currentPos = current;
        
        while (currentPos) {
            path.unshift(currentPos);
            currentPos = cameFrom.get(`${currentPos.x},${currentPos.y}`);
        }
        
        return path;
    }
    
    // 添加随机分支
    addRandomBranches() {
        const branchCount = Math.floor(this.size / 4);
        
        for (let i = 0; i < branchCount; i++) {
            const x = 1 + Math.floor(Math.random() * (this.size - 2));
            const y = 1 + Math.floor(Math.random() * (this.size - 2));
            
            if (this.maze[y][x] === this.CELL_TYPES.WALL) {
                // 检查是否可以通过打通道连接到主路径
                const directions = [
                    {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
                ];
                
                for (const dir of directions) {
                    const nx = x + dir.dx;
                    const ny = y + dir.dy;
                    
                    if (nx > 0 && nx < this.size - 1 && ny > 0 && ny < this.size - 1 &&
                        this.maze[ny][nx] === this.CELL_TYPES.PATH) {
                        this.maze[y][x] = this.CELL_TYPES.PATH;
                        break;
                    }
                }
            }
        }
    }
    
    // 强制生成路径（最后的备用方案）
    forceGeneratePath() {
        console.log('强制生成简单路径');
        
        // 创建一条直线路径
        for (let i = 1; i < this.size - 1; i++) {
            this.maze[1][i] = this.CELL_TYPES.PATH;
        }
        for (let i = 1; i < this.size - 2; i++) {
            this.maze[i][this.size - 2] = this.CELL_TYPES.PATH;
        }
        
        // 确保起点和终点可达
        this.maze[1][1] = this.CELL_TYPES.START;
        this.maze[this.size - 2][this.size - 2] = this.CELL_TYPES.END;
    }

    drawMaze() {
        const cellSize = this.canvas.width / this.size;
        
        // 根据主题设置背景
        this.drawBackground();
        
        // 绘制网格线
        this.drawGrid(cellSize);
        
        // 绘制迷宫单元格
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = this.maze[y][x];
                const px = x * cellSize;
                const py = y * cellSize;
                
                this.drawCell(cell, px, py, cellSize, x, y);
            }
        }

        // 绘制路径提示
        if (this.showPath && this.solutionPath.length > 0) {
            this.drawSolutionPath(cellSize);
        }

        // 绘制玩家
        if (this.gameMode === 'play') {
            this.drawPlayer(cellSize);
        }
    }

    drawBackground() {
        const themes = {
            'classic': { bg: '#f8f9fa', grid: '#e9ecef' },
            'forest': { bg: '#e8f5e8', grid: '#c8e6c9' },
            'cave': { bg: '#2c3e50', grid: '#34495e' },
            'tech': { bg: '#0a0a0a', grid: '#1a1a1a' },
            'fantasy': { bg: '#f0e6ff', grid: '#d4b3ff' }
        };
        
        const theme = themes[this.theme] || themes['classic'];
        this.ctx.fillStyle = theme.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentGridColor = theme.grid;
    }

    drawGrid(cellSize) {
        this.ctx.strokeStyle = this.currentGridColor;
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.size; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * cellSize, 0);
            this.ctx.lineTo(i * cellSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * cellSize);
            this.ctx.lineTo(this.canvas.width, i * cellSize);
            this.ctx.stroke();
        }
    }

    drawCell(cell, px, py, cellSize, x, y) {
        const themes = {
            'classic': {
                wall: ['#495057', '#343a40'],
                path: '#f8f9fa',
                start: ['#28a745', '#20c997'],
                end: ['#dc3545', '#c82333'],
                teleporter: ['#9C27B0', '#7B1FA2'],
                oneway: ['#FF5722', '#E64A19'],
                moving: ['#FF9800', '#F57C00']
            },
            'forest': {
                wall: ['#2E7D32', '#1B5E20'],
                path: '#E8F5E8',
                start: ['#4CAF50', '#388E3C'],
                end: ['#F44336', '#D32F2F'],
                teleporter: ['#8E24AA', '#6A1B9A'],
                oneway: ['#FF7043', '#E64A19'],
                moving: ['#FFB74D', '#FF9800']
            },
            'cave': {
                wall: ['#424242', '#212121'],
                path: '#424242',
                start: ['#4CAF50', '#388E3C'],
                end: ['#F44336', '#D32F2F'],
                teleporter: ['#9C27B0', '#7B1FA2'],
                oneway: ['#FF5722', '#E64A19'],
                moving: ['#FF9800', '#F57C00']
            },
            'tech': {
                wall: ['#00BCD4', '#0097A7'],
                path: '#0a0a0a',
                start: ['#4CAF50', '#388E3C'],
                end: ['#F44336', '#D32F2F'],
                teleporter: ['#9C27B0', '#7B1FA2'],
                oneway: ['#FF5722', '#E64A19'],
                moving: ['#FF9800', '#F57C00']
            },
            'fantasy': {
                wall: ['#7B1FA2', '#6A1B9A'],
                path: '#f0e6ff',
                start: ['#4CAF50', '#388E3C'],
                end: ['#F44336', '#D32F2F'],
                teleporter: ['#9C27B0', '#7B1FA2'],
                oneway: ['#FF5722', '#E64A19'],
                moving: ['#FF9800', '#F57C00']
            }
        };
        
        const theme = themes[this.theme] || themes['classic'];
        
        switch (cell) {
            case this.CELL_TYPES.WALL:
                this.drawWall(px, py, cellSize, theme.wall);
                break;
            case this.CELL_TYPES.PATH:
                this.ctx.fillStyle = theme.path;
                this.ctx.fillRect(px, py, cellSize, cellSize);
                break;
            case this.CELL_TYPES.START:
                this.drawSpecialCell(px, py, cellSize, theme.start, 'S');
                break;
            case this.CELL_TYPES.END:
                this.drawSpecialCell(px, py, cellSize, theme.end, 'E');
                break;
            case this.CELL_TYPES.TELEPORTER:
                this.drawSpecialCell(px, py, cellSize, theme.teleporter, 'T');
                break;
            case this.CELL_TYPES.ONE_WAY_UP:
                this.drawOneWayCell(px, py, cellSize, theme.oneway, '↑');
                break;
            case this.CELL_TYPES.ONE_WAY_DOWN:
                this.drawOneWayCell(px, py, cellSize, theme.oneway, '↓');
                break;
            case this.CELL_TYPES.ONE_WAY_LEFT:
                this.drawOneWayCell(px, py, cellSize, theme.oneway, '←');
                break;
            case this.CELL_TYPES.ONE_WAY_RIGHT:
                this.drawOneWayCell(px, py, cellSize, theme.oneway, '→');
                break;
            case this.CELL_TYPES.MOVING_WALL:
                this.drawMovingWall(px, py, cellSize, theme.moving);
                break;
        }
    }

    drawWall(px, py, cellSize, colors) {
        const gradient = this.ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        
        // 添加阴影效果
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawSpecialCell(px, py, cellSize, colors, symbol) {
        const gradient = this.ctx.createRadialGradient(
            px + cellSize/2, py + cellSize/2, 0,
            px + cellSize/2, py + cellSize/2, cellSize/2
        );
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        
        // 添加符号
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${cellSize/3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(symbol, px + cellSize/2, py + cellSize/2);
    }

    drawOneWayCell(px, py, cellSize, colors, arrow) {
        const gradient = this.ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        
        // 添加箭头
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${cellSize/2}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(arrow, px + cellSize/2, py + cellSize/2);
    }

    drawMovingWall(px, py, cellSize, colors) {
        const time = Date.now() / 1000;
        const alpha = 0.5 + 0.5 * Math.sin(time * 2);
        
        this.ctx.globalAlpha = alpha;
        const gradient = this.ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        this.ctx.globalAlpha = 1;
    }

    drawSolutionPath(cellSize) {
        this.ctx.fillStyle = 'rgba(255, 152, 0, 0.3)';
        this.solutionPath.forEach(pos => {
            const px = pos.x * cellSize;
            const py = pos.y * cellSize;
            this.ctx.fillRect(px, py, cellSize, cellSize);
        });
    }

    drawPlayer(cellSize) {
        const px = this.player.x * cellSize;
        const py = this.player.y * cellSize;
        
        // 玩家 - 蓝色渐变
        const gradient = this.ctx.createRadialGradient(
            px + cellSize/2, py + cellSize/2, 0,
            px + cellSize/2, py + cellSize/2, cellSize/2
        );
        gradient.addColorStop(0, '#2196F3');
        gradient.addColorStop(1, '#1976D2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px, py, cellSize, cellSize);
        
        // 添加玩家标记
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${cellSize/3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('P', px + cellSize/2, py + cellSize/2);
    }

    setupEventListeners() {
        document.getElementById('maze-generate-btn').addEventListener('click', () => {
            this.generateMazeWithLoading();
        });

        document.getElementById('maze-size').addEventListener('change', () => {
            this.generateMazeWithLoading();
        });

        document.getElementById('maze-algorithm').addEventListener('change', () => {
            this.generateMazeWithLoading();
        });

        document.getElementById('maze-complexity').addEventListener('change', () => {
            this.generateMazeWithLoading();
        });

        document.getElementById('maze-features').addEventListener('change', () => {
            this.generateMazeWithLoading();
        });

        document.getElementById('maze-theme').addEventListener('change', () => {
            this.loadSettings();
            this.drawMaze();
        });

        document.getElementById('maze-mode').addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.resetGame();
        });

        document.getElementById('maze-solve-btn').addEventListener('click', () => {
            this.togglePath();
        });

        document.getElementById('maze-reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('maze-hint-btn').addEventListener('click', () => {
            this.showHint();
        });
    }

    generateMazeWithLoading() {
        const btn = document.getElementById('maze-generate-btn');
        const originalText = btn.textContent;
        btn.textContent = '生成中...';
        btn.disabled = true;
        
        // 设置超时保护
        this.generationTimeout = setTimeout(() => {
            console.warn('迷宫生成超时，强制停止');
            this.showError('迷宫生成超时，请选择较小的迷宫尺寸');
            btn.textContent = originalText;
            btn.disabled = false;
        }, this.maxGenerationTime);
        
        // 使用requestAnimationFrame来避免阻塞UI
        requestAnimationFrame(() => {
            try {
                this.generateMaze();
                // 清除超时
                if (this.generationTimeout) {
                    clearTimeout(this.generationTimeout);
                    this.generationTimeout = null;
                }
            } catch (error) {
                console.error('迷宫生成错误:', error);
                this.showError('迷宫生成失败，请重试');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    showError(message) {
        // 在画布上显示错误信息
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#F44336';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
    }

    setupKeyboardControls() {
        this.keyHandlers = {
            'ArrowUp': () => this.movePlayer(0, -1),
            'ArrowDown': () => this.movePlayer(0, 1),
            'ArrowLeft': () => this.movePlayer(-1, 0),
            'ArrowRight': () => this.movePlayer(1, 0),
            'KeyW': () => this.movePlayer(0, -1),
            'KeyS': () => this.movePlayer(0, 1),
            'KeyA': () => this.movePlayer(-1, 0),
            'KeyD': () => this.movePlayer(1, 0),
            'Space': () => this.togglePath(),
            'KeyH': () => this.showHint()
        };

        this.keyHandler = (e) => {
            // 只在游戏模态框打开时响应键盘事件
            if (!window.app || !window.app.currentModal) return;
            if (this.gameMode === 'play' && this.keyHandlers[e.code]) {
                e.preventDefault();
                this.keyHandlers[e.code]();
            }
        };

        document.addEventListener('keydown', this.keyHandler);
        
        // 初始化鼠标控制
        this.initMouseControl();
    }
    
    // 初始化鼠标控制
    initMouseControl() {
        let isDragging = false;
        let dragStartPos = null;
        let dragPath = [];
        
        // 鼠标点击移动
        this.canvas.addEventListener('click', (e) => {
            if (this.gameMode !== 'play') return;
            
            const pos = this.getMousePosition(e);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                console.log(`鼠标点击位置: (${pos.x}, ${pos.y})`);
                this.moveToPosition(pos.x, pos.y);
            }
        });
        
        // 鼠标按下开始拖拽
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.gameMode !== 'play') return;
            
            const pos = this.getMousePosition(e);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                isDragging = true;
                dragStartPos = { x: this.player.x, y: this.player.y };
                dragPath = [];
                console.log(`开始拖拽，起始位置: (${dragStartPos.x}, ${dragStartPos.y})`);
            }
        });
        
        // 鼠标移动时预览路径
        this.canvas.addEventListener('mousemove', (e) => {
            if (!isDragging || this.gameMode !== 'play') return;
            
            const pos = this.getMousePosition(e);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                // 计算拖拽路径
                dragPath = this.calculateDragPath(dragStartPos, pos);
                this.drawMazeWithPath(dragPath);
            }
        });
        
        // 鼠标释放完成拖拽
        this.canvas.addEventListener('mouseup', (e) => {
            if (!isDragging || this.gameMode !== 'play') return;
            
            const pos = this.getMousePosition(e);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                console.log(`拖拽结束，目标位置: (${pos.x}, ${pos.y})`);
                
                // 尝试沿路径移动
                if (this.moveAlongPath(dragPath)) {
                    console.log('拖拽移动成功');
                } else {
                    console.log('拖拽移动失败，路径不可达');
                }
            }
            
            isDragging = false;
            dragStartPos = null;
            dragPath = [];
            this.drawMaze(); // 清除路径预览
        });
        
        // 触摸设备支持
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.gameMode !== 'play') return;
            
            e.preventDefault();
            const touch = e.touches[0];
            const pos = this.getMousePosition(touch);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                isDragging = true;
                dragStartPos = { x: this.player.x, y: this.player.y };
                dragPath = [];
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (!isDragging || this.gameMode !== 'play') return;
            
            e.preventDefault();
            const touch = e.touches[0];
            const pos = this.getMousePosition(touch);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                dragPath = this.calculateDragPath(dragStartPos, pos);
                this.drawMazeWithPath(dragPath);
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!isDragging || this.gameMode !== 'play') return;
            
            e.preventDefault();
            const touch = e.changedTouches[0];
            const pos = this.getMousePosition(touch);
            if (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size) {
                if (this.moveAlongPath(dragPath)) {
                    console.log('触摸拖拽移动成功');
                }
            }
            
            isDragging = false;
            dragStartPos = null;
            dragPath = [];
            this.drawMaze();
        });
    }
    
    // 获取鼠标在迷宫中的位置
    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / (this.canvas.width / this.size));
        const y = Math.floor((event.clientY - rect.top) / (this.canvas.width / this.size));
        return { x, y };
    }
    
    // 移动到指定位置
    moveToPosition(x, y) {
        if (!this.isPlaying) {
            this.startGame();
        }
        
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        
        if (this.canMoveTo(x, y, 0, 0)) {
            this.player.x = x;
            this.player.y = y;
            this.steps++;
            
            // 处理特殊单元格
            this.handleSpecialCell(x, y);
            
            this.updateStats();
            this.drawMaze();
            
            // 检查是否到达终点
            if (this.player.x === this.size - 2 && this.player.y === this.size - 2) {
                this.gameWon();
            }
            
            return true;
        }
        return false;
    }
    
    // 计算拖拽路径
    calculateDragPath(start, end) {
        // 使用可玩路径（A* 且遵守 canMoveTo 规则）用于预览
        const path = this.findPathAStarPlayable(start.x, start.y, end.x, end.y);
        return path.length > 0 ? path : [start];
    }
    
    // 沿路径移动（逐步移动，防止"瞬移"与穿墙）
    moveAlongPath(path) {
        if (!path || path.length < 2) return false;
        
        let stepIndex = 1; // 从下一个节点开始
        const stepThrough = () => {
            if (stepIndex >= path.length) return; // 完成
            const next = path[stepIndex];
            const dx = Math.sign(next.x - this.player.x);
            const dy = Math.sign(next.y - this.player.y);
            
            // 只允许相邻单步
            if (Math.abs(next.x - this.player.x) + Math.abs(next.y - this.player.y) !== 1) {
                return; // 非法路径，终止
            }
            
            if (this.canMoveTo(next.x, next.y, dx, dy)) {
                this.player.x = next.x;
                this.player.y = next.y;
                this.steps++;
                this.handleSpecialCell(next.x, next.y);
                this.updateStats();
                this.drawMaze();
                
                if (this.player.x === this.size - 2 && this.player.y === this.size - 2) {
                    this.gameWon();
                    return;
                }
                stepIndex++;
                // 使用微小延迟让移动可见，且不阻塞UI
                setTimeout(stepThrough, 20);
            }
        };
        stepThrough();
        return true;
    }
    
    // 移动到指定位置（点击或程序调用）
    moveToPosition(x, y) {
        if (!this.isPlaying) this.startGame();
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
        
        // 若是相邻一格，则按方向移动一次
        const manhattan = Math.abs(x - this.player.x) + Math.abs(y - this.player.y);
        if (manhattan === 1) {
            const dx = x - this.player.x;
            const dy = y - this.player.y;
            if (this.canMoveTo(x, y, dx, dy)) {
                this.player.x = x;
                this.player.y = y;
                this.steps++;
                this.handleSpecialCell(x, y);
                this.updateStats();
                this.drawMaze();
                if (this.player.x === this.size - 2 && this.player.y === this.size - 2) this.gameWon();
                return true;
            }
            return false;
        }
        
        // 非相邻：计算合法路径并逐步移动
        const path = this.findPathAStarPlayable(this.player.x, this.player.y, x, y);
        if (path.length > 0) {
            this.moveAlongPath(path);
            return true;
        }
        return false;
    }
    
    // A* 寻路（遵守 canMoveTo 规则，不能穿墙与违反单向）
    findPathAStarPlayable(startX, startY, endX, endY) {
        const openSet = [{ x: startX, y: startY, g: 0, f: 0 }];
        const cameFrom = new Map();
        const gScore = new Map();
        const key = (x, y) => `${x},${y}`;
        gScore.set(key(startX, startY), 0);
        
        const directions = [
            {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
        ];
        
        const heuristic = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();
            if (current.x === endX && current.y === endY) {
                return this.reconstructPath(cameFrom, current);
            }
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                if (nx < 0 || nx >= this.size || ny < 0 || ny >= this.size) continue;
                
                // 使用 canMoveTo 来判断从 current -> neighbor 是否可行
                if (!this.canMoveTo(nx, ny, dir.dx, dir.dy)) continue;
                
                const neighborK = key(nx, ny);
                const tentativeG = (gScore.get(key(current.x, current.y)) ?? Infinity) + 1;
                if (tentativeG < (gScore.get(neighborK) ?? Infinity)) {
                    cameFrom.set(neighborK, current);
                    gScore.set(neighborK, tentativeG);
                    const f = tentativeG + heuristic(nx, ny, endX, endY);
                    const existing = openSet.find(n => n.x === nx && n.y === ny);
                    if (existing) {
                        existing.g = tentativeG;
                        existing.f = f;
                    } else {
                        openSet.push({ x: nx, y: ny, g: tentativeG, f });
                    }
                }
            }
        }
        return [];
    }

    movePlayer(dx, dy) {
        console.log(`尝试移动玩家: dx=${dx}, dy=${dy}, 当前位置: (${this.player.x}, ${this.player.y})`);
        
        if (!this.isPlaying) {
            console.log('开始游戏');
            this.startGame();
        }

        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        console.log(`目标位置: (${newX}, ${newY})`);

        // 检查边界
        if (newX < 0 || newX >= this.size || newY < 0 || newY >= this.size) {
            console.log('无法移动：超出边界');
            return;
        }

        const targetCell = this.maze[newY][newX];
        console.log(`目标单元格类型: ${targetCell}`);

        // 检查是否可以移动
        if (this.canMoveTo(newX, newY, dx, dy)) {
            console.log('移动成功');
            this.player.x = newX;
            this.player.y = newY;
            this.steps++;
            
            // 处理特殊单元格
            this.handleSpecialCell(newX, newY);
            
            this.updateStats();
            this.drawMaze();

            // 检查是否到达终点
            if (this.player.x === this.size - 2 && this.player.y === this.size - 2) {
                this.gameWon();
            }
        } else {
            console.log('移动失败');
        }
    }

    canMoveTo(x, y, dx, dy) {
        const cell = this.maze[y][x];
        
        // 调试信息
        console.log(`尝试移动到 (${x}, ${y}), 单元格类型: ${cell}, 墙壁类型: ${this.CELL_TYPES.WALL}`);
        
        // 墙壁不能通过
        if (cell === this.CELL_TYPES.WALL) {
            console.log('无法移动：墙壁');
            return false;
        }
        
        // 检查单向通道
        if (cell === this.CELL_TYPES.ONE_WAY_UP && dy >= 0) {
            console.log('无法移动：单向通道限制');
            return false;
        }
        if (cell === this.CELL_TYPES.ONE_WAY_DOWN && dy <= 0) {
            console.log('无法移动：单向通道限制');
            return false;
        }
        if (cell === this.CELL_TYPES.ONE_WAY_LEFT && dx >= 0) {
            console.log('无法移动：单向通道限制');
            return false;
        }
        if (cell === this.CELL_TYPES.ONE_WAY_RIGHT && dx <= 0) {
            console.log('无法移动：单向通道限制');
            return false;
        }
        
        console.log('可以移动');
        return true;
    }

    handleSpecialCell(x, y) {
        const cell = this.maze[y][x];
        
        switch (cell) {
            case this.CELL_TYPES.TELEPORTER:
                this.handleTeleporter(x, y);
                break;
            case this.CELL_TYPES.MOVING_WALL:
                // 移动墙壁会在定时器中处理
                break;
        }
    }

    handleTeleporter(x, y) {
        // 找到另一个传送门
        const otherTeleporters = this.teleporters.filter(t => t.x !== x || t.y !== y);
        if (otherTeleporters.length > 0) {
            const target = otherTeleporters[Math.floor(Math.random() * otherTeleporters.length)];
            this.player.x = target.x;
            this.player.y = target.y;
            
            // 显示传送效果
            window.app.showNotification('传送门激活！', 'info');
        }
    }

    startGame() {
        this.isPlaying = true;
        this.startTime = Date.now();
        this.gameTimer = setInterval(() => {
            this.updateStats();
        }, 1000);
        document.getElementById('maze-status').textContent = '游戏中';
    }

    gameWon() {
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        document.getElementById('maze-status').textContent = '胜利！';
        
        window.app.showNotification(
            `恭喜通关！用时${timeElapsed}秒，步数${this.steps}步`, 
            'success'
        );
    }

    resetGame() {
        this.player = { x: 1, y: 1 };
        this.isPlaying = false;
        this.steps = 0;
        this.startTime = null;
        this.showPath = false;
        this.hintCount = 3;
        clearInterval(this.gameTimer);
        this.updateStats();
        this.drawMaze();
        document.getElementById('maze-status').textContent = '准备开始';
    }

    showHint() {
        if (this.hintCount <= 0) {
            window.app.showNotification('提示次数已用完！', 'warning');
            return;
        }
        
        this.hintCount--;
        
        // 找到从当前位置到终点的下一步
        const nextStep = this.findNextStep();
        if (nextStep) {
            const cellSize = this.canvas.width / this.size;
            const px = nextStep.x * cellSize;
            const py = nextStep.y * cellSize;
            
            // 高亮显示提示
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.fillRect(px, py, cellSize, cellSize);
            
            window.app.showNotification(`提示：下一步移动到 (${nextStep.x}, ${nextStep.y})，剩余提示：${this.hintCount}`, 'info');
        } else {
            window.app.showNotification('无法找到路径！', 'error');
        }
    }

    findNextStep() {
        // 使用BFS找到从当前位置到终点的最短路径
        const queue = [{x: this.player.x, y: this.player.y, path: []}];
        const visited = new Set();
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (current.x === this.size - 2 && current.y === this.size - 2) {
                return current.path[0] || null;
            }
            
            const directions = [
                {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
            ];
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && 
                    this.canMoveTo(nx, ny, dir.dx, dir.dy)) {
                    const newPath = [...current.path, {x: nx, y: ny}];
                    queue.push({x: nx, y: ny, path: newPath});
                }
            }
        }
        
        return null;
    }

    togglePath() {
        this.showPath = !this.showPath;
        if (this.showPath) {
            this.findSolution();
        }
        this.drawMaze();
    }

    findSolution() {
        // 使用广度优先搜索找到最短路径
        const queue = [{x: 1, y: 1, path: []}];
        const visited = new Set();
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (current.x === this.size - 2 && current.y === this.size - 2) {
                this.solutionPath = current.path;
                return;
            }
            
            const directions = [
                {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}
            ];
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && 
                    this.maze[ny][nx] !== 1) {
                    const newPath = [...current.path, {x: nx, y: ny}];
                    queue.push({x: nx, y: ny, path: newPath});
                }
            }
        }
    }

    updateStats() {
        document.getElementById('maze-steps').textContent = this.steps;
        
        if (this.startTime && this.isPlaying) {
            const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('maze-time').textContent = timeElapsed;
        }
    }

    destroy() {
        clearInterval(this.gameTimer);
        clearInterval(this.wallTimer);
        document.removeEventListener('keydown', this.keyHandlers);
    }
}

// 像素画板类
class PixelCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentColor = '#000000';
        this.gridSize = 20;
        this.canvasSize = 400;
    }

    init() {
        this.canvas = document.getElementById('pixel-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.canvasSize; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasSize);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvasSize; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasSize, y);
            this.ctx.stroke();
        }
    }

    getGridPosition(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        const gridX = Math.floor(canvasX / this.gridSize) * this.gridSize;
        const gridY = Math.floor(canvasY / this.gridSize) * this.gridSize;
        
        return {x: gridX, y: gridY};
    }

    drawPixel(x, y) {
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
        this.drawGrid();
    }

    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawGrid();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            const pos = this.getGridPosition(e.clientX, e.clientY);
            this.drawPixel(pos.x, pos.y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                const pos = this.getGridPosition(e.clientX, e.clientY);
                this.drawPixel(pos.x, pos.y);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });

        document.getElementById('pixel-color').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });

        document.getElementById('pixel-clear-btn').addEventListener('click', () => {
            this.clearCanvas();
        });

        document.getElementById('pixel-save-btn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'pixel-art.png';
            link.href = this.canvas.toDataURL();
            link.click();
        });
    }

    destroy() {
        // 清理事件监听器
    }
}

// 冥想功能类
class MeditationGuide {
    constructor() {
        this.isActive = false;
        this.currentSession = null;
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.breathingPhase = 'inhale'; // inhale, hold, exhale, pause
        this.phaseDuration = 4000; // 4秒
        this.phaseProgress = 0;
        this.sessionDuration = 300000; // 5分钟
        this.sessionStartTime = 0;
        this.visualization = null;
    }

    init() {
        this.setupAudioContext();
        this.setupEventListeners();
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('音频上下文创建失败:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('meditation-start').addEventListener('click', () => this.startSession());
        document.getElementById('meditation-stop').addEventListener('click', () => this.stopSession());
        document.getElementById('meditation-reset').addEventListener('click', () => this.resetSession());
        
        // 呼吸节奏设置
        document.getElementById('breathing-rhythm').addEventListener('change', (e) => {
            this.setBreathingRhythm(e.target.value);
        });
        
        // 背景音设置
        document.getElementById('background-sound').addEventListener('change', (e) => {
            this.setBackgroundSound(e.target.value);
        });
    }

    startSession() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.sessionStartTime = Date.now();
        this.startBreathingGuide();
        this.startVisualization();
        // 只有在用户选择了背景音时才播放
        const backgroundSound = document.getElementById('background-sound').value;
        if (backgroundSound !== 'none') {
            this.playBackgroundSound();
        }
        
        document.getElementById('meditation-start').disabled = true;
        document.getElementById('meditation-stop').disabled = false;
        
        // 更新状态显示
        this.updateStatus('冥想进行中...');
    }

    stopSession() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.stopBreathingGuide();
        this.stopVisualization();
        this.stopBackgroundSound();
        
        document.getElementById('meditation-start').disabled = false;
        document.getElementById('meditation-stop').disabled = true;
        
        this.updateStatus('冥想已停止');
    }

    resetSession() {
        this.stopSession();
        this.phaseProgress = 0;
        this.updateBreathingDisplay();
        this.updateStatus('准备开始冥想');
    }

    startBreathingGuide() {
        this.breathingInterval = setInterval(() => {
            this.updateBreathingCycle();
        }, 50);
    }

    stopBreathingGuide() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
    }

    updateBreathingCycle() {
        this.phaseProgress += 50;
        
        if (this.phaseProgress >= this.phaseDuration) {
            this.phaseProgress = 0;
            this.cycleBreathingPhase();
        }
        
        this.updateBreathingDisplay();
    }

    cycleBreathingPhase() {
        switch (this.breathingPhase) {
            case 'inhale':
                this.breathingPhase = 'hold';
                break;
            case 'hold':
                this.breathingPhase = 'exhale';
                break;
            case 'exhale':
                this.breathingPhase = 'pause';
                break;
            case 'pause':
                this.breathingPhase = 'inhale';
                break;
        }
    }

    updateBreathingDisplay() {
        const progress = this.phaseProgress / this.phaseDuration;
        const circle = document.getElementById('breathing-circle');
        const instruction = document.getElementById('breathing-instruction');
        
        if (circle && instruction) {
            // 更新圆圈大小
            const size = 100 + (progress * 100);
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            
            // 更新指令文本
            const phaseText = {
                'inhale': '吸气',
                'hold': '保持',
                'exhale': '呼气',
                'pause': '暂停'
            };
            instruction.textContent = phaseText[this.breathingPhase];
            
            // 更新颜色
            const colors = {
                'inhale': '#4CAF50',
                'hold': '#FF9800',
                'exhale': '#2196F3',
                'pause': '#9C27B0'
            };
            circle.style.backgroundColor = colors[this.breathingPhase];
        }
    }

    startVisualization() {
        const canvas = document.getElementById('meditation-canvas');
        if (!canvas) return;
        
        this.visualization = new MeditationVisualization(canvas);
        this.visualization.start();
    }

    stopVisualization() {
        if (this.visualization) {
            this.visualization.stop();
            this.visualization = null;
        }
    }

    playBackgroundSound() {
        if (!this.audioContext) return;
        
        try {
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();
            
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            this.oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            this.oscillator.start();
        } catch (error) {
            console.warn('背景音播放失败:', error);
        }
    }

    stopBackgroundSound() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }
    }

    setBreathingRhythm(rhythm) {
        const rhythms = {
            'slow': 6000,
            'normal': 4000,
            'fast': 2000
        };
        this.phaseDuration = rhythms[rhythm] || 4000;
    }

    setBackgroundSound(sound) {
        // 停止当前背景音
        this.stopBackgroundSound();
        
        // 如果正在冥想且选择了背景音，则播放
        if (this.isActive && sound !== 'none') {
            this.playBackgroundSound();
        }
        
        console.log('设置背景音:', sound);
    }

    updateStatus(message) {
        const statusElement = document.getElementById('meditation-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    destroy() {
        this.stopSession();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// 冥想可视化类
class MeditationVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.particles = [];
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.time = 0;
        
        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 360
            });
        }
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 0.01;
        
        // 绘制粒子
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // 绘制粒子
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = `hsl(${particle.hue + this.time * 10}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // 绘制中心圆
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = `hsl(${this.time * 50}, 70%, 50%)`;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 50 + Math.sin(this.time) * 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        requestAnimationFrame(() => this.animate());
    }
}

// 呼吸练习类
class BreathingExercise {
    constructor() {
        this.isActive = false;
        this.currentPattern = '4-4-4-4'; // 吸气-保持-呼气-暂停
        this.phaseDuration = 4000;
        this.phaseProgress = 0;
        this.currentPhase = 0;
        this.phases = ['inhale', 'hold', 'exhale', 'pause'];
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.getElementById('breathing-start').addEventListener('click', () => this.start());
        document.getElementById('breathing-stop').addEventListener('click', () => this.stop());
        document.getElementById('breathing-reset').addEventListener('click', () => this.reset());
        
        document.getElementById('breathing-pattern').addEventListener('change', (e) => {
            this.setPattern(e.target.value);
        });
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startCycle();
        document.getElementById('breathing-start').disabled = true;
        document.getElementById('breathing-stop').disabled = false;
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.stopCycle();
        document.getElementById('breathing-start').disabled = false;
        document.getElementById('breathing-stop').disabled = true;
    }

    reset() {
        this.stop();
        this.currentPhase = 0;
        this.phaseProgress = 0;
        this.updateDisplay();
    }

    setPattern(pattern) {
        const patterns = {
            '4-4-4-4': [4000, 4000, 4000, 4000],
            '4-7-8-0': [4000, 7000, 8000, 0],
            '6-2-6-2': [6000, 2000, 6000, 2000],
            '5-5-5-5': [5000, 5000, 5000, 5000]
        };
        
        this.pattern = patterns[pattern] || patterns['4-4-4-4'];
        this.phaseDuration = this.pattern[this.currentPhase];
    }

    startCycle() {
        this.cycleInterval = setInterval(() => {
            this.updateCycle();
        }, 50);
    }

    stopCycle() {
        if (this.cycleInterval) {
            clearInterval(this.cycleInterval);
            this.cycleInterval = null;
        }
    }

    updateCycle() {
        this.phaseProgress += 50;
        
        if (this.phaseProgress >= this.phaseDuration) {
            this.nextPhase();
        }
        
        this.updateDisplay();
    }

    nextPhase() {
        this.currentPhase = (this.currentPhase + 1) % this.phases.length;
        this.phaseProgress = 0;
        this.phaseDuration = this.pattern[this.currentPhase];
        
        if (this.phaseDuration === 0) {
            this.nextPhase();
        }
    }

    updateDisplay() {
        const progress = this.phaseDuration > 0 ? this.phaseProgress / this.phaseDuration : 0;
        const circle = document.getElementById('breathing-circle');
        const instruction = document.getElementById('breathing-instruction');
        const phaseName = document.getElementById('breathing-phase');
        
        if (circle && instruction && phaseName) {
            const phase = this.phases[this.currentPhase];
            const size = 50 + (progress * 150);
            
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            
            const phaseTexts = {
                'inhale': '吸气',
                'hold': '保持',
                'exhale': '呼气',
                'pause': '暂停'
            };
            
            instruction.textContent = phaseTexts[phase];
            phaseName.textContent = `阶段 ${this.currentPhase + 1}/4`;
            
            const colors = {
                'inhale': '#4CAF50',
                'hold': '#FF9800',
                'exhale': '#2196F3',
                'pause': '#9C27B0'
            };
            
            circle.style.backgroundColor = colors[phase];
        }
    }

    destroy() {
        this.stop();
    }
}

// 白噪音生成器类
class WhiteNoiseGenerator {
    constructor() {
        this.audioContext = null;
        this.noiseNode = null;
        this.gainNode = null;
        this.filterNode = null;
        this.isPlaying = false;
        this.currentType = 'white';
    }

    init() {
        this.setupAudioContext();
        this.setupEventListeners();
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('音频上下文创建失败:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('noise-play').addEventListener('click', () => this.toggle());
        document.getElementById('noise-type').addEventListener('change', (e) => this.setType(e.target.value));
        document.getElementById('noise-volume').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('noise-frequency').addEventListener('input', (e) => this.setFrequency(e.target.value));
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.audioContext || this.isPlaying) return;
        
        try {
            this.createNoise();
            this.isPlaying = true;
            document.getElementById('noise-play').textContent = '停止';
            document.getElementById('noise-play').classList.add('playing');
            document.getElementById('noise-status').textContent = '播放中';
        } catch (error) {
            console.error('播放失败:', error);
        }
    }

    stop() {
        if (!this.isPlaying) return;
        
        if (this.noiseNode) {
            this.noiseNode.stop();
            this.noiseNode = null;
        }
        
        this.isPlaying = false;
        document.getElementById('noise-play').textContent = '播放';
        document.getElementById('noise-play').classList.remove('playing');
        document.getElementById('noise-status').textContent = '已停止';
    }

    createNoise() {
        const bufferSize = 4096;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        this.noiseNode = this.audioContext.createBufferSource();
        this.noiseNode.buffer = buffer;
        this.noiseNode.loop = true;
        
        this.gainNode = this.audioContext.createGain();
        this.filterNode = this.audioContext.createBiquadFilter();
        
        this.noiseNode.connect(this.filterNode);
        this.filterNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        this.applySettings();
        this.noiseNode.start();
    }

    setType(type) {
        this.currentType = type;
        if (this.isPlaying) {
            this.stop();
            this.play();
        }
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume / 100;
        }
        document.getElementById('volume-display').textContent = volume;
    }

    setFrequency(frequency) {
        if (this.filterNode) {
            this.filterNode.frequency.value = frequency;
        }
        document.getElementById('frequency-display').textContent = frequency;
    }

    applySettings() {
        const volume = document.getElementById('noise-volume').value;
        const frequency = document.getElementById('noise-frequency').value;
        
        this.setVolume(volume);
        this.setFrequency(frequency);
        
        // 根据类型设置滤波器
        if (this.filterNode) {
            switch (this.currentType) {
                case 'white':
                    this.filterNode.type = 'lowpass';
                    this.filterNode.frequency.value = 20000;
                    break;
                case 'pink':
                    this.filterNode.type = 'lowpass';
                    this.filterNode.frequency.value = 1000;
                    break;
                case 'brown':
                    this.filterNode.type = 'lowpass';
                    this.filterNode.frequency.value = 500;
                    break;
            }
        }
    }

    destroy() {
        this.stop();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// 涂色书类
class ColoringBook {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentColor = '#ff6b6b';
        this.currentPattern = 'mandala';
        this.patterns = {};
    }

    init() {
        this.canvas = document.getElementById('coloring-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.generatePattern('mandala');
    }

    setupEventListeners() {
        document.getElementById('coloring-color').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });

        document.getElementById('coloring-clear').addEventListener('click', () => {
            this.clearCanvas();
        });

        document.getElementById('coloring-save').addEventListener('click', () => {
            this.saveCanvas();
        });

        document.getElementById('coloring-new').addEventListener('click', () => {
            this.generatePattern(this.currentPattern);
        });

        document.querySelectorAll('.pattern-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.currentPattern = e.target.dataset.pattern;
                this.generatePattern(this.currentPattern);
                document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        this.canvas.addEventListener('click', (e) => {
            this.colorArea(e);
        });
    }

    generatePattern(patternType) {
        this.clearCanvas();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;

        switch (patternType) {
            case 'mandala':
                this.drawMandalaPattern();
                break;
            case 'flower':
                this.drawFlowerPattern();
                break;
            case 'animal':
                this.drawAnimalPattern();
                break;
            case 'geometric':
                this.drawGeometricPattern();
                break;
        }
    }

    drawMandalaPattern() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 20;

        // 绘制同心圆
        for (let r = 20; r < maxRadius; r += 30) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // 绘制花瓣
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x1 = centerX + Math.cos(angle) * 20;
            const y1 = centerY + Math.sin(angle) * 20;
            const x2 = centerX + Math.cos(angle) * maxRadius;
            const y2 = centerY + Math.sin(angle) * maxRadius;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    drawFlowerPattern() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 绘制花瓣
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x = centerX + Math.cos(angle) * 80;
            const y = centerY + Math.sin(angle) * 80;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // 绘制花心
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawAnimalPattern() {
        // 简单的动物轮廓
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 猫头轮廓
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        this.ctx.stroke();

        // 耳朵
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 40, centerY - 40);
        this.ctx.lineTo(centerX - 20, centerY - 60);
        this.ctx.lineTo(centerX, centerY - 40);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(centerX + 40, centerY - 40);
        this.ctx.lineTo(centerX + 20, centerY - 60);
        this.ctx.lineTo(centerX, centerY - 40);
        this.ctx.stroke();

        // 眼睛
        this.ctx.beginPath();
        this.ctx.arc(centerX - 20, centerY - 10, 8, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(centerX + 20, centerY - 10, 8, 0, Math.PI * 2);
        this.ctx.stroke();

        // 鼻子
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawGeometricPattern() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 绘制六边形
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x = centerX + Math.cos(angle) * 60;
            const y = centerY + Math.sin(angle) * 60;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();

        // 绘制内部三角形
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const x = centerX + Math.cos(angle) * 30;
            const y = centerY + Math.sin(angle) * 30;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    colorArea(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 简单的区域填充（这里只是示例）
        this.ctx.fillStyle = this.currentColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'coloring-art.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    destroy() {
        // 清理事件监听器
    }
}

// 曼陀罗生成器类
class MandalaGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.complexity = 6;
        this.colorMode = 'rainbow';
    }

    init() {
        this.canvas = document.getElementById('mandala-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.generateMandala();
    }

    setupEventListeners() {
        document.getElementById('mandala-generate').addEventListener('click', () => {
            this.generateMandala();
        });

        document.getElementById('mandala-save').addEventListener('click', () => {
            this.saveMandala();
        });

        document.getElementById('mandala-complexity').addEventListener('input', (e) => {
            this.complexity = parseInt(e.target.value);
            document.getElementById('mandala-complexity-display').textContent = this.complexity;
            this.generateMandala();
        });

        document.getElementById('mandala-colors').addEventListener('change', (e) => {
            this.colorMode = e.target.value;
            this.generateMandala();
        });
    }

    generateMandala() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 20;

        // 绘制同心圆
        for (let r = 20; r < maxRadius; r += 30) {
            this.ctx.strokeStyle = this.getColor(r / maxRadius);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // 绘制放射线
        for (let i = 0; i < this.complexity; i++) {
            const angle = (i * Math.PI * 2) / this.complexity;
            const x = centerX + Math.cos(angle) * maxRadius;
            const y = centerY + Math.sin(angle) * maxRadius;

            this.ctx.strokeStyle = this.getColor(i / this.complexity);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }

        // 绘制装饰图案
        this.drawDecorations(centerX, centerY, maxRadius);
    }

    drawDecorations(centerX, centerY, maxRadius) {
        for (let r = 40; r < maxRadius; r += 40) {
            for (let i = 0; i < this.complexity; i++) {
                const angle = (i * Math.PI * 2) / this.complexity;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;

                this.ctx.fillStyle = this.getColor((r + i) / (maxRadius + this.complexity));
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    getColor(ratio) {
        switch (this.colorMode) {
            case 'rainbow':
                return `hsl(${ratio * 360}, 70%, 50%)`;
            case 'monochrome':
                return `hsl(0, 0%, ${ratio * 100}%)`;
            case 'pastel':
                return `hsl(${ratio * 360}, 30%, 80%)`;
            case 'dark':
                return `hsl(${ratio * 360}, 70%, 20%)`;
            default:
                return `hsl(${ratio * 360}, 70%, 50%)`;
        }
    }

    saveMandala() {
        const link = document.createElement('a');
        link.download = 'mandala.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    destroy() {
        // 清理事件监听器
    }
}

// 万花筒类
class Kaleidoscope {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isActive = false;
        this.symmetry = 6;
        this.speed = 5;
        this.points = [];
        this.animationId = null;
    }

    init() {
        this.canvas = document.getElementById('kaleidoscope-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('kaleidoscope-start').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('kaleidoscope-stop').addEventListener('click', () => {
            this.stop();
        });

        document.getElementById('kaleidoscope-clear').addEventListener('click', () => {
            this.clear();
        });

        document.getElementById('kaleidoscope-symmetry').addEventListener('input', (e) => {
            this.symmetry = parseInt(e.target.value);
            document.getElementById('kaleidoscope-symmetry-display').textContent = this.symmetry;
        });

        document.getElementById('kaleidoscope-speed').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('kaleidoscope-speed-display').textContent = this.speed;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isActive) {
                this.addPoint(e);
            }
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.addPoint(e);
        });
    }

    start() {
        this.isActive = true;
        document.getElementById('kaleidoscope-start').disabled = true;
        document.getElementById('kaleidoscope-stop').disabled = false;
        this.animate();
    }

    stop() {
        this.isActive = false;
        document.getElementById('kaleidoscope-start').disabled = false;
        document.getElementById('kaleidoscope-stop').disabled = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clear() {
        this.points = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addPoint(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.points.push({
            x: x,
            y: y,
            time: Date.now(),
            color: this.getRandomColor()
        });

        // 限制点数
        if (this.points.length > 100) {
            this.points.shift();
        }
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const time = Date.now() * 0.001;

        // 绘制万花筒效果
        for (let i = 0; i < this.symmetry; i++) {
            const angle = (i * Math.PI * 2) / this.symmetry;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(angle);
            
            // 绘制点
            this.points.forEach(point => {
                const age = (Date.now() - point.time) * 0.001;
                const alpha = Math.max(0, 1 - age * this.speed * 0.01);
                
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = point.color;
                this.ctx.beginPath();
                this.ctx.arc(point.x - centerX, point.y - centerY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            this.ctx.restore();
        }

        // 清理过期点
        this.points = this.points.filter(point => (Date.now() - point.time) < 10000);

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.stop();
    }
}

// 初始化娱乐管理器
window.EntertainmentManager = new EntertainmentManager();
