// 游戏管理器
class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameInstances = {};
        this.cleanupFunctions = [];
    }

    initGame(gameType) {
        this.cleanup();
        
        const modalBody = document.getElementById('modal-body');
        
        switch (gameType) {
            case '2048':
                this.init2048(modalBody);
                break;
            case 'puzzle':
                this.initPuzzle(modalBody);
                break;
            case 'memory':
                this.initMemory(modalBody);
                break;
            case 'guess':
                this.initGuess(modalBody);
                break;
            case 'link':
                this.initLink(modalBody);
                break;
            case 'snake':
                this.initSnake(modalBody);
                break;
            case 'tetris':
                this.initTetris(modalBody);
                break;
            case 'minesweeper':
                this.initMinesweeper(modalBody);
                break;
            case 'shooter':
                this.initShooter(modalBody);
                break;
        }
        
        this.currentGame = gameType;
    }
    // 连连看（基础版）
    initLink(container) {
        container.innerHTML = `
            <div class="game-link">
                <div class="game-header">
                    <div class="score-container">
                        <div class="moves">步数: <span id="link-moves">0</span></div>
                        <div class="time">时间: <span id="link-time">00:00</span></div>
                        <div class="difficulty-selector"><label>尺寸:
                            <select id="link-size">
                                <option value="6">6x6</option>
                                <option value="8" selected>8x8</option>
                            </select>
                        </label></div>
                        <div class="theme-selector"><label>主题:
                            <select id="link-theme">
                                <option value="fruits" selected>果蔬</option>
                                <option value="animals">动物</option>
                                <option value="emojis">表情</option>
                                <option value="symbols">符号</option>
                            </select>
                        </label></div>
                    </div>
                    <div class="control-buttons">
                        <button id="link-hint-btn" class="btn btn-secondary">提示</button>
                        <button id="link-new-btn" class="btn btn-primary">新游戏</button>
                    </div>
                </div>
                <div class="link-container"><div class="link-board" id="link-board"></div><canvas id="link-overlay"></canvas></div>
                <div class="game-controls">
                    <p>点击选择两块可连接（不超过两次拐弯）的相同方块进行消除</p>
                    <button class="btn btn-info btn-sm" id="link-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="link-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>连连看游戏，通过连接相同的方块来消除它们！</p>
                    <ul>
                        <li>点击两个相同的方块进行连接</li>
                        <li>连接路径不能超过两次拐弯</li>
                        <li>路径上不能有其他方块阻挡</li>
                        <li>使用提示功能找到可连接的方块</li>
                        <li>清空所有方块即可获胜！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new LinkGame();
        this.gameInstances['link'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('link-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('link-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 拼图（图片拼图）
    initPuzzle(container) {
        container.innerHTML = `
            <div class="game-puzzle">
                <div class="game-header">
                    <div class="score-container">
                        <div class="moves">步数: <span id="puzzle-moves">0</span></div>
                        <div class="time">时间: <span id="puzzle-time">00:00</span></div>
                        <div class="difficulty-selector"><label>尺寸:
                            <select id="puzzle-size">
                                <option value="3">3x3</option>
                                <option value="4" selected>4x4</option>
                                <option value="5">5x5</option>
                            </select>
                        </label></div>
                    </div>
                    <button id="puzzle-new-btn" class="btn btn-primary">新游戏</button>
                </div>
                <div class="puzzle-image-selector">
                    <div class="image-buttons">
                        <button id="select-pattern-btn" class="btn btn-secondary">
                            <span>🎨</span> 选择图案
                        </button>
                        <label for="puzzle-upload" class="btn btn-primary">
                            <span>📁</span> 上传图片
                        </label>
                        <input type="file" id="puzzle-upload" accept="image/*" style="display: none;">
                    </div>
                </div>
                <div class="puzzle-board" id="puzzle-board"></div>
                <div class="game-controls">
                    <p>点击相邻空格移动拼图块；方向键↑↓←→操作</p>
                    <button class="btn btn-info btn-sm" id="puzzle-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="puzzle-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>图片拼图游戏，通过移动拼图块来重新组合完整图片！</p>
                    <ul>
                        <li>选择默认图案或上传自定义图片</li>
                        <li>点击与空格相邻的拼图块来移动</li>
                        <li>使用方向键也可以控制移动</li>
                        <li>目标是重新组合成完整的图片</li>
                        <li>空格必须在右下角位置</li>
                        <li>尝试用最少的步数完成！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
                
                <!-- 图案选择弹窗 -->
                <div id="pattern-modal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>🎨 选择拼图图案</h3>
                            <button class="modal-close" id="pattern-modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="pattern-grid">
                                <div class="pattern-option" data-image="nature">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNGVhZjUwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHg9IjQ1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjOGI0NTEzIi8+CjxwYXRoIGQ9Ik0zMCA2NSBMNDAgNTUgTDUwIDY1IEw2MCA1NSBMMzAgNjVaIiBmaWxsPSIjNGVhZjUwIi8+CjxwYXRoIGQ9Ik0yMCA3NSBMMzAgNjUgTDQwIDc1IEw1MCA2NSBMNjAgNzUgTDcwIDY1IEwyMCA3NVoiIGZpbGw9IiM0ZWFmNTAiLz4KPC9zdmc+" alt="自然风景">
                                    <span>自然风景</span>
                                </div>
                                <div class="pattern-option" data-image="city">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzMzIi8+CjxyZWN0IHg9IjEwIiB5PSI0MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjcwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjUwIiB5PSIyMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjcwIiB5PSIzNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjY1IiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjE1IiB5PSI1MCIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB4PSIzNSIgeT0iNDAiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeD0iNTUiIHk9IjMwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHg9Ijc1IiB5PSI0NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=" alt="城市建筑">
                                    <span>城市建筑</span>
                                </div>
                                <div class="pattern-option" data-image="space">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSI0IiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9IjYwIiByPSIyIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==" alt="太空">
                                    <span>太空</span>
                                </div>
                                <div class="pattern-option" data-image="abstract">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjM0ZjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjOWMyN2IwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjZmZjMTA3Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjNGNhZjUwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+" alt="抽象图案">
                                    <span>抽象图案</span>
                                </div>
                                <div class="pattern-option" data-image="ocean">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA2NkZmIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjMDA0NEE2Ii8+CjxwYXRoIGQ9Ik0wIDYwIEMxMCA1NSAyMCA1MCAzMCA1NSBMNDAgNTAgTDUwIDU1IEw2MCA1MCBMNzAgNTUgTDgwIDUwIEw5MCA1NSBMMTAwIDUwIFY3MCBIMTAwIEgwIFoiIGZpbGw9IiMwMDQ0QTYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMyIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjI1IiByPSIyIiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNmZmYiLz4KPC9zdmc+" alt="海洋">
                                    <span>海洋</span>
                                </div>
                                <div class="pattern-option" data-image="sunset">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzAiIHI9IjIwIiBmaWxsPSIjRkZEMDAwIi8+CjxwYXRoIGQ9Ik0wIDYwIEMxMCA1NSAyMCA1MCAzMCA1NSBMNDAgNTAgTDUwIDU1IEw2MCA1MCBMNzAgNTUgTDgwIDUwIEw5MCA1NSBMMTAwIDUwIFY3MCBIMTAwIEgwIFoiIGZpbGw9IiNGRkE1MDAiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjM1IiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==" alt="日落">
                                    <span>日落</span>
                                </div>
                                <div class="pattern-option" data-image="forest">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA0NDAwIi8+CjxyZWN0IHg9IjEwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjcwIiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjOGI0NTEzIi8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iNjAiIHI9IjEwIiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjEyIiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9IjU1IiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNTUiIHI9IjEwIiBmaWxsPSIjMDA4MDAwIi8+Cjwvc3ZnPg==" alt="森林">
                                    <span>森林</span>
                                </div>
                                <div class="pattern-option" data-image="mountain">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjODc0RkZGIi8+CjxwYXRoIGQ9Ik0wIDgwIEwyMCA0MCBMMzAgNTAgTDQwIDMwIEw1MCA0MCBMNjAgMjAgTDcwIDMwIEw4MCA0MCBMMTAwIDYwIFY4MCBaIiBmaWxsPSIjNjY2Ii8+CjxwYXRoIGQ9Ik0wIDgwIEwyMCA0MCBMMzAgNTAgTDQwIDMwIEw1MCA0MCBMNjAgMjAgTDcwIDMwIEw4MCA0MCBMMTAwIDYwIFY4MCBaIiBmaWxsPSIjOTk5Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==" alt="山脉">
                                    <span>山脉</span>
                                </div>
                                <div class="pattern-option" data-image="geometric">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYzRjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+" alt="几何图案">
                                    <span>几何图案</span>
                                </div>
                                <div class="pattern-option" data-image="mandala">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkYzRjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM1IiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTUwIDUgTDU1IDE1IEw2NSAyMCBMNTUgMjUgTDUwIDM1IEw0NSAyNSBMMzUgMjAgTDQ1IDE1IFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTUwIDY1IEw1NSA3NSBMNjUgODAgTDU1IDg1IEw1MCA5NSBMNDUgODUgTDM1IDgwIEw0NSA3NSBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik01IDUwIEwxNSA0NSBMMjAgMzUgTDI1IDQ1IEwzNSA1MCBMMjUgNTUgTDIwIDY1IEwxNSA1NSBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik05NSA1MCBMODUgNTUgTDgwIDY1IEw3NSA1NSBMNjUgNTAgTDc1IDQ1IEw4MCAzNSBMODUgNDUgWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=" alt="曼陀罗">
                                    <span>曼陀罗</span>
                                </div>
                                <div class="pattern-option" data-image="galaxy">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjNjYwMEZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkYwMEZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9IjYwIiByPSIyIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=" alt="银河">
                                    <span>银河</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const game = new PuzzleGame();
        this.gameInstances['puzzle'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('puzzle-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('puzzle-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
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
            
            // 停止游戏实例
            if (this.gameInstances[this.currentGame]) {
                this.gameInstances[this.currentGame].destroy();
                delete this.gameInstances[this.currentGame];
            }
        } catch (error) {
            console.error('游戏清理失败:', error);
        }
    }

    // 2048游戏
    init2048(container) {
        container.innerHTML = `
            <div class="game-2048">
                <div class="game-header">
                    <div class="score-container">
                        <div class="score">分数: <span id="score">0</span></div>
                        <div class="best">最高分: <span id="best">0</span></div>
                    </div>
                    <button id="new-game-btn" class="btn btn-primary">新游戏</button>
                </div>
                <div class="game-board" id="game-board">
                    <div class="grid-container">
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                        <div class="grid-cell"></div>
                    </div>
                </div>
                <div class="game-controls">
                    <p>使用方向键或WASD控制方块移动</p>
                    <button class="btn btn-info btn-sm" id="game2048-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="game2048-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>通过移动方块，让相同数字的方块合并，目标是达到2048！</p>
                    <ul>
                        <li>使用方向键或WASD控制方块移动</li>
                        <li>相同数字的方块会合并成更大的数字</li>
                        <li>每次移动后会随机出现2或4的新方块</li>
                        <li>当无法移动且无法合并时游戏结束</li>
                        <li>尝试达到2048或更高分数！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new Game2048();
        this.gameInstances['2048'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('game2048-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('game2048-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 记忆配对游戏
    initMemory(container) {
        container.innerHTML = `
            <div class="game-memory">
                <div class="game-header">
                    <div class="memory-stats-horizontal">
                        <div class="stat-item">
                            <span class="stat-label">得分</span>
                            <span class="stat-value" id="score">0</span>
                    </div>
                        <div class="stat-item">
                            <span class="stat-label">步数</span>
                            <span class="stat-value" id="moves">0</span>
                </div>
                        <div class="stat-item">
                            <span class="stat-label">时间</span>
                            <span class="stat-value" id="time">00:00</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">连击</span>
                            <span class="stat-value" id="streak">0</span>
                        </div>
                    </div>
                    <div class="memory-best-record">
                        <div class="best-record-item">
                            <span class="best-record-label">最佳步数</span>
                            <span class="best-record-value" id="best-moves">-</span>
                        </div>
                    </div>
                    <div class="memory-controls">
                        <button id="memory-hint-btn" class="btn btn-secondary" title="使用提示消耗3步">提示</button>
                        <button id="restart-btn" class="btn btn-primary" style="display: none;">重新开始</button>
                    </div>
                </div>
                <div class="memory-settings mb-2">
                    <div class="difficulty-selector">
                        <label>难度
                            <select id="memory-difficulty">
                                <option value="easy" selected>简单 (4x4)</option>
                                <option value="medium">中等 (4x5)</option>
                                <option value="hard">困难 (5x6)</option>
                        </select>
                    </label>
                    </div>
                    <div class="theme-selector">
                        <label>主题
                            <select id="memory-theme">
                            <option value="emoji">Emoji</option>
                                <option value="animals">动物</option>
                                <option value="colors">颜色</option>
                            <option value="shapes">形状</option>
                        </select>
                    </label>
                </div>
                </div>
                <div class="game-area">
                    <div class="memory-container">
                <div class="memory-board" id="memory-board"></div>
                        <canvas id="memory-overlay" class="memory-overlay"></canvas>
                    </div>
                </div>
                <div class="game-controls">
                    <p>点击卡片翻开查看内容，找出相同的卡片对</p>
                    <button class="btn btn-info btn-sm" id="memory-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="memory-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>记忆翻牌游戏，找出所有相同的卡片对！挑战你的记忆力。</p>
                    <ul>
                        <li>点击卡片翻开查看内容</li>
                        <li>找出两张相同的卡片即可消除</li>
                        <li>连续配对可获得连击奖励</li>
                        <li>使用提示功能获得帮助</li>
                        <li>可以暂停游戏稍后继续</li>
                    </ul>
                    <h5>难度说明</h5>
                    <ul>
                        <li><strong>简单 (4×4)</strong>：16张卡片，8对配对，适合新手</li>
                        <li><strong>中等 (4×5)</strong>：20张卡片，10对配对，挑战性适中</li>
                        <li><strong>困难 (5×6)</strong>：30张卡片，15对配对，考验记忆力</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new MemoryGame();
        this.gameInstances['memory'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('memory-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('memory-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 数字猜谜游戏
    initGuess(container) {
        container.innerHTML = `
            <div class="game-guess">
                <div class="guess-header">
                    <h3>🎯 数字猜谜</h3>
                    <p>系统随机生成一个数字，通过猜测和提示来找到它！</p>
                </div>
                
                <div class="guess-container">
                    <div class="guess-settings">
                        <div class="settings-row">
                            <div class="setting-group">
                                <label>范围: <input type="number" id="guess-min" value="1" min="0" max="9999"> - <input type="number" id="guess-max" value="100" min="1" max="9999"></label>
                    </div>
                            <div class="setting-group">
                                <label><input type="checkbox" id="guess-decimal"> 允许小数</label>
                    </div>
                            <div class="setting-group">
                                <label>小数位: <select id="guess-decimals"><option value="1" selected>1位</option><option value="2">2位</option><option value="3">3位</option><option value="4">4位</option></select></label>
                            </div>
                            <button id="apply-range" class="btn btn-primary btn-sm">应用</button>
                        </div>
                    </div>
                    
                    <div class="guess-stats">
                        <div class="stat-card attempts-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-content">
                                <div class="stat-label">尝试次数</div>
                                <div id="attempts" class="stat-value">0</div>
                            </div>
                        </div>
                        <div class="stat-card range-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-content">
                                <div class="stat-label">当前范围</div>
                                <div id="range" class="stat-value">1-100</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guess-input">
                        <input type="number" id="guess-input" step="1" min="1" max="100" placeholder="输入猜测数字">
                        <button id="guess-btn" class="btn btn-primary">猜测</button>
                    </div>
                    
                    <div class="guess-result" id="guess-result"></div>
                    <button id="new-guess-btn" class="btn btn-secondary" style="display: none;">新游戏</button>
                </div>
                <div class="game-controls">
                    <p>输入你的猜测数字，系统会提示"太大"或"太小"</p>
                    <button class="btn btn-info btn-sm" id="guess-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="guess-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>猜数字游戏，系统会随机生成一个数字，你需要通过猜测来找到它！</p>
                    <ul>
                        <li>输入你的猜测数字</li>
                        <li>系统会提示"太大"或"太小"</li>
                        <li>根据提示缩小猜测范围</li>
                        <li>可以设置数字范围和是否允许小数</li>
                        <li>尝试用最少的次数猜中！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new GuessGame();
        this.gameInstances['guess'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('guess-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('guess-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 贪吃蛇游戏
    initSnake(container) {
        container.innerHTML = `
            <div class="game-snake">
                <div class="game-header">
                    <div class="snake-hud">
                        <div class="metric">分数: <span id="snake-score">0</span></div>
                        <div class="metric">最高: <span id="snake-best">0</span></div>
                        <div class="metric">长度: <span id="snake-length">1</span></div>
                        <div class="metric">速度: <span id="snake-speed">1</span></div>
                        <div class="metric">时间: <span id="snake-time">00:00</span></div>
                        </div>
                    <div class="snake-controls">
                        <div class="control-group">
                            <label>速度: 
                                <input type="range" id="snake-speed-slider" min="1" max="10" value="5">
                                <span id="snake-speed-display">5</span>
                            </label>
                    </div>
                        <div class="button-group">
                    <button id="snake-start-btn" class="btn btn-primary">开始游戏</button>
                        </div>
                    </div>
                </div>
                <div class="snake-container">
                    <canvas id="snake-canvas" width="400" height="400"></canvas>
                    <div class="snake-overlay" id="snake-overlay">
                        <div class="game-over-screen" id="snake-game-over" style="display: none;">
                            <h3>游戏结束</h3>
                            <p>最终分数: <span id="final-score">0</span></p>
                            <p>蛇的长度: <span id="final-length">1</span></p>
                            <p>游戏时间: <span id="final-time">00:00</span></p>
                            <button id="snake-restart-btn" class="btn btn-primary">重新开始</button>
                        </div>
                    </div>
                    <div class="snake-controls"><p>使用方向键控制蛇的移动</p></div>
                </div>
                <div class="game-controls">
                    <p>使用方向键控制蛇的移动方向，吃到食物增加分数</p>
                    <button class="btn btn-info btn-sm" id="snake-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="snake-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>经典贪吃蛇游戏，控制可爱的小蛇吃食物并避免撞墙或撞到自己！</p>
                    <ul>
                        <li>使用方向键控制小蛇的移动方向</li>
                        <li>长按方向键可以加速移动（速度加倍）</li>
                        <li>小蛇的眼睛会根据移动方向转动</li>
                        <li>吃到红色食物会增加分数和长度</li>
                        <li>避免撞到墙壁或蛇身</li>
                        <li>使用速度滑块调节游戏速度（1-10）</li>
                        <li>挑战你的最高分记录！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new SnakeGame();
        this.gameInstances['snake'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('snake-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('snake-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 俄罗斯方块游戏
    initTetris(container) {
        container.innerHTML = `
            <div class="game-tetris">
                <div class="game-header">
                    <div class="score-container">
                        <div class="score">分数: <span id="tetris-score">0</span></div>
                        <div class="best">最高: <span id="tetris-best">0</span></div>
                        <div class="level">等级: <span id="tetris-level">1</span></div>
                        <div class="lines">行数: <span id="tetris-lines">0</span></div>
                        <div class="time">时间: <span id="tetris-time">00:00</span></div>
                    </div>
                <div class="tetris-controls">
                        <div class="difficulty-selector">
                            <label for="tetris-difficulty">难度:</label>
                            <select id="tetris-difficulty" class="difficulty-select">
                                <option value="easy">简单 (慢速)</option>
                                <option value="normal" selected>普通 (标准)</option>
                                <option value="hard">困难 (快速)</option>
                                <option value="expert">专家 (极速)</option>
                            </select>
                        </div>
                        <div class="button-group">
                            <button id="tetris-start-btn" class="btn btn-primary">开始游戏</button>
                            <button id="tetris-pause-btn" class="btn btn-warning" disabled>暂停</button>
                            <button id="tetris-reset-btn" class="btn btn-secondary">重新开始</button>
                            <button id="tetris-sound-toggle" class="btn btn-success">🔊</button>
                        </div>
                    </div>
                </div>
                <div class="tetris-game-area">
                    <div class="tetris-sidebar">
                        <div class="next-piece">
                            <h4>下一个</h4>
                            <canvas id="tetris-next-canvas" width="120" height="120"></canvas>
                        </div>
                        <div class="hold-piece">
                            <h4>暂存</h4>
                            <canvas id="tetris-hold-canvas" width="120" height="120"></canvas>
                        </div>
                    </div>
                    <div class="tetris-main">
                <canvas id="tetris-canvas" width="300" height="600"></canvas>
                        <div class="tetris-overlay" id="tetris-overlay">
                            <div class="game-over-screen" id="tetris-game-over" style="display: none;">
                                <h3>游戏结束</h3>
                                <p>最终分数: <span id="final-tetris-score">0</span></p>
                                <p>消除行数: <span id="final-tetris-lines">0</span></p>
                                <p>达到等级: <span id="final-tetris-level">1</span></p>
                                <p>游戏时间: <span id="final-tetris-time">00:00</span></p>
                                <button id="tetris-restart-btn" class="btn btn-primary">重新开始</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="game-controls">
                    <p>方向键移动，上键旋转，空格键快速下落，C键暂存</p>
                    <button class="btn btn-info btn-sm" id="tetris-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="tetris-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>经典俄罗斯方块游戏，通过旋转和移动方块来填满整行！</p>
                    <ul>
                        <li>使用方向键左右移动方块</li>
                        <li>上键旋转方块，下键加速下落</li>
                        <li>空格键让方块瞬间下落到底部</li>
                        <li>C键暂存当前方块，再次按C取出</li>
                        <li>填满整行会消除并获得分数</li>
                        <li>方块堆积到顶部时游戏结束</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new GameTetris();
        this.gameInstances['tetris'] = game;
        game.canvas = document.getElementById('tetris-canvas');
        game.ctx = game.canvas.getContext('2d');
        game.init();
        
        // 添加按钮事件监听器
        document.getElementById('tetris-start-btn').addEventListener('click', () => {
            if (game.isRunning && !game.isPaused) {
                game.pause();
            } else if (game.isPaused) {
                game.resume();
            } else {
                game.start();
            }
        });

        document.getElementById('tetris-pause-btn').addEventListener('click', () => {
            if (game.isPaused) {
                game.resume();
            } else {
                game.pause();
            }
        });

        document.getElementById('tetris-reset-btn').addEventListener('click', () => {
            game.reset();
        });

        document.getElementById('tetris-restart-btn').addEventListener('click', () => {
            game.reset();
            game.start();
        });

        document.getElementById('tetris-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('tetris-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 雷霆战机（纵版射击简版）
    initShooter(container) {
        container.innerHTML = `
            <div class="game-shooter">
                <div class="shooter-header-compact">
                    <div class="shooter-stats">
                        <span>分数: <strong id="shooter-score">0</strong></span>
                        <span>最高: <strong id="shooter-best">0</strong></span>
                        <span>生命: <strong id="shooter-lives">3</strong></span>
                        <span>等级: <strong id="shooter-level">1</strong></span>
                        <span>火力: <strong id="shooter-power">1</strong></span>
                        <span>时间: <strong id="shooter-time">00:00</strong></span>
                    </div>
                    <div class="shooter-controls-compact">
                        <select id="shooter-difficulty" class="btn btn-sm">
                            <option value="easy">简单</option>
                            <option value="normal" selected>中等</option>
                            <option value="hard">困难</option>
                            <option value="expert">专家</option>
                        </select>
                        <button id="shooter-start-btn" class="btn btn-primary btn-sm">开始游戏</button>
                        <button id="shooter-pause-btn" class="btn btn-warning btn-sm" disabled>暂停</button>
                        <button id="shooter-end-btn" class="btn btn-danger btn-sm">结束游戏</button>
                    </div>
                </div>
                <div class="shooter-game-area">
                    <canvas id="shooter-canvas" width="360" height="600"></canvas>
                    <div class="shooter-overlay" id="shooter-overlay">
                        <div class="game-over-screen" id="shooter-game-over" style="display: none;">
                            <h3>游戏结束</h3>
                            <p>最终分数: <span id="final-shooter-score">0</span></p>
                            <p>达到等级: <span id="final-shooter-level">1</span></p>
                            <p>游戏时间: <span id="final-shooter-time">00:00</span></p>
                        </div>
                    </div>
                </div>
                <div class="shooter-instructions">
                    <small>键盘←→移动，空格射击，C键道具；鼠标移动也可控制</small>
                </div>
            </div>
        `;

        const game = new ShooterGame();
        this.gameInstances['shooter'] = game;
        game.canvas = document.getElementById('shooter-canvas');
        game.ctx = game.canvas.getContext('2d');
        // 确保canvas和ctx设置后再初始化
        if (game.canvas && game.ctx) {
            game.init();
        }
        // 事件监听器在setupEventListeners中已经设置，这里不需要重复添加
        
    }
    // 扫雷游戏
    initMinesweeper(container) {
        container.innerHTML = `
            <div class="game-minesweeper">
                <div class="game-header">
                    <div class="score-container">
                        <div class="mines-left">剩余地雷: <span id="mines-left">15</span></div>
                        <div class="timer">时间: <span id="minesweeper-timer">00:00</span></div>
                        <div class="flags">标记: <span id="flags-used">0</span></div>
                    </div>
                    <div class="minesweeper-controls">
                        <div class="control-group">
                        <label>难度: 
                            <select id="minesweeper-difficulty">
                                <option value="easy">简单 (9x9, 10雷)</option>
                                <option value="medium" selected>中等 (10x10, 15雷)</option>
                                <option value="hard">困难 (16x16, 40雷)</option>
                                <option value="expert">专家 (16x30, 99雷)</option>
                            </select>
                        </label>
                    </div>
                        <div class="button-group">
                    <button id="minesweeper-new-btn" class="btn btn-primary minesweeper-new-game">新游戏</button>
                        </div>
                    </div>
                </div>
                <div id="minesweeper-grid" class="minesweeper-grid"></div>
                <div class="game-controls">
                    <p>左键点击揭示，右键点击标记地雷</p>
                    <button class="btn btn-info btn-sm" id="minesweeper-instructions-btn">📖 游戏说明</button>
                </div>
                <div class="game-instructions" id="minesweeper-instructions" style="display: none;">
                    <h4>游戏说明</h4>
                    <p>经典扫雷游戏，通过数字提示找出所有地雷的位置！</p>
                    <ul>
                        <li>左键点击格子揭示内容</li>
                        <li>右键点击格子标记地雷</li>
                        <li>数字表示周围8个格子中地雷的数量</li>
                        <li>使用提示功能获得帮助</li>
                        <li>找出所有地雷即可获胜！</li>
                    </ul>
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.style.display='none'">关闭</button>
                </div>
            </div>
        `;

        const game = new GameMinesweeper();
        this.gameInstances['minesweeper'] = game;
        game.init();
        
        // 添加游戏说明按钮事件监听器
        document.getElementById('minesweeper-instructions-btn').addEventListener('click', () => {
            const instructions = document.getElementById('minesweeper-instructions');
            instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        });
    }
}

// 2048游戏类
class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = 0;
        this.gameOver = false;
        this.previousGrid = null;
        this.lastMoveDirection = null;
        this.spawnFourProbability = 0.2; // 难度影响 4 的概率
        this.currentTheme = 'classic'; // 当前主题
        this.moveTrails = []; // 存储移动轨迹数据
        this.themes = {
            classic: {
                name: '经典',
                colors: {
                    2: { bg: '#eee4da', color: '#776e65' },
                    4: { bg: '#ede0c8', color: '#776e65' },
                    8: { bg: '#f2b179', color: '#f9f6f2' },
                    16: { bg: '#f59563', color: '#f9f6f2' },
                    32: { bg: '#f67c5f', color: '#f9f6f2' },
                    64: { bg: '#f65e3b', color: '#f9f6f2' },
                    128: { bg: '#edcf72', color: '#f9f6f2' },
                    256: { bg: '#edcc61', color: '#f9f6f2' },
                    512: { bg: '#edc850', color: '#f9f6f2' },
                    1024: { bg: '#edc53f', color: '#f9f6f2' },
                    2048: { bg: '#edc22e', color: '#f9f6f2' }
                }
            },
            neon: {
                name: '霓虹',
                colors: {
                    2: { bg: '#1a1a2e', color: '#00d4ff' },
                    4: { bg: '#16213e', color: '#00d4ff' },
                    8: { bg: '#0f3460', color: '#00d4ff' },
                    16: { bg: '#533483', color: '#ffffff' },
                    32: { bg: '#7209b7', color: '#ffffff' },
                    64: { bg: '#f72585', color: '#ffffff' },
                    128: { bg: '#ff006e', color: '#ffffff' },
                    256: { bg: '#ffbe0b', color: '#000000' },
                    512: { bg: '#fb5607', color: '#ffffff' },
                    1024: { bg: '#ff006e', color: '#ffffff' },
                    2048: { bg: '#8338ec', color: '#ffffff' }
                }
            },
            ocean: {
                name: '海洋',
                colors: {
                    2: { bg: '#e3f2fd', color: '#01579b' },
                    4: { bg: '#bbdefb', color: '#01579b' },
                    8: { bg: '#90caf9', color: '#01579b' },
                    16: { bg: '#64b5f6', color: '#ffffff' },
                    32: { bg: '#42a5f5', color: '#ffffff' },
                    64: { bg: '#2196f3', color: '#ffffff' },
                    128: { bg: '#1e88e5', color: '#ffffff' },
                    256: { bg: '#1976d2', color: '#ffffff' },
                    512: { bg: '#1565c0', color: '#ffffff' },
                    1024: { bg: '#0d47a1', color: '#ffffff' },
                    2048: { bg: '#01579b', color: '#ffffff' }
                }
            },
            sunset: {
                name: '日落',
                colors: {
                    2: { bg: '#fff3e0', color: '#e65100' },
                    4: { bg: '#ffe0b2', color: '#e65100' },
                    8: { bg: '#ffcc80', color: '#e65100' },
                    16: { bg: '#ffb74d', color: '#ffffff' },
                    32: { bg: '#ff9800', color: '#ffffff' },
                    64: { bg: '#ff5722', color: '#ffffff' },
                    128: { bg: '#f44336', color: '#ffffff' },
                    256: { bg: '#e91e63', color: '#ffffff' },
                    512: { bg: '#9c27b0', color: '#ffffff' },
                    1024: { bg: '#673ab7', color: '#ffffff' },
                    2048: { bg: '#3f51b5', color: '#ffffff' }
                }
            }
        };
    }

    init() {
        this.loadBestScore();
        this.loadTheme();
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        // 初次渲染：将上一帧视作全空，以便触发出现动画
        this.previousGrid = Array(4).fill().map(() => Array(4).fill(0));
        this.updateDisplay();
        this.setupEventListeners();
        this.createThemeSelector();
    }

    initGrid() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const prob4 = this.spawnFourProbability; // 由难度决定
            this.grid[x][y] = Math.random() < (1 - prob4) ? 2 : 4;
        }
    }

    move(direction) {
        if (this.gameOver) return;

        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));
        this.lastMoveDirection = direction; // 记录移动方向

        switch (direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            // 保存上一帧用于动画对比
            this.previousGrid = oldGrid;
            this.lastMoveDirection = direction;
            this.addRandomTile();
            this.updateDisplay();
            this.checkGameOver();
        }
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            const newRow = row.concat(Array(4 - row.length).fill(0));
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            const newRow = Array(4 - row.length).fill(0).concat(row);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            const newColumn = column.concat(Array(4 - column.length).fill(0));
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            const newColumn = Array(4 - column.length).fill(0).concat(column);
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.grid-cell');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = cells[i * 4 + j];
                const value = this.grid[i][j];
                const prev = this.previousGrid ? this.previousGrid[i][j] : value;

                cell.textContent = value || '';
                cell.className = `grid-cell tile-${value}`;
                
                // 应用主题颜色（包括空位置的重置）
                this.applyThemeColor(cell, value);

                // 根据前后帧差异添加动画类
                if (value && prev === 0) {
                    cell.classList.add('tile-appear');
                } else if (value > prev && prev !== 0) {
                    cell.classList.add('tile-merge');
                } else if (value !== prev && value !== 0) {
                    // 检查是否有移动轨迹数据
                    const moveData = this.getMoveData(i, j, value);
                    if (moveData) {
                        this.animateTileMovement(cell, moveData);
                    } else {
                        cell.classList.add('tile-move');
                        if (this.lastMoveDirection) {
                            cell.classList.add(`tile-move-${this.lastMoveDirection}`);
                        }
                    }
                }

                // 动画结束后清理类，便于下次重放
                if (cell._tileAnimTimer) clearTimeout(cell._tileAnimTimer);
                cell._tileAnimTimer = setTimeout(() => {
                    cell.classList.remove('tile-appear', 'tile-merge', 'tile-move', 
                        'tile-move-left', 'tile-move-right', 'tile-move-up', 'tile-move-down');
                }, 300);
            }
        }
        
        document.getElementById('score').textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
        document.getElementById('best').textContent = this.bestScore;

        // 本帧成为下一次比较的上一帧
        this.previousGrid = JSON.parse(JSON.stringify(this.grid));
    }

    loadTheme() {
        this.currentTheme = window.app.loadData('game2048_theme', 'classic');
    }

    saveTheme() {
        window.app.saveData('game2048_theme', this.currentTheme);
    }

    applyThemeColor(cell, value) {
        if (value === 0) {
            // 重置空位置的样式
            cell.style.backgroundColor = '';
            cell.style.color = '';
            return;
        }
        
        const theme = this.themes[this.currentTheme];
        const colorConfig = theme.colors[value] || theme.colors[2048];
        
        cell.style.backgroundColor = colorConfig.bg;
        cell.style.color = colorConfig.color;
    }

    // 获取方块的移动轨迹数据
    getMoveData(toRow, toCol, value) {
        if (!this.previousGrid) return null;
        
        // 查找这个值在上一帧中的位置
        // 优先查找最近的位置（按距离排序）
        const candidates = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.previousGrid[i][j] === value && (i !== toRow || j !== toCol)) {
                    const distance = Math.abs(i - toRow) + Math.abs(j - toCol);
                    candidates.push({
                        fromRow: i,
                        fromCol: j,
                        toRow: toRow,
                        toCol: toCol,
                        value: value,
                        distance: distance
                    });
                }
            }
        }
        
        // 返回距离最近的位置
        if (candidates.length > 0) {
            candidates.sort((a, b) => a.distance - b.distance);
            return candidates[0];
        }
        
        return null;
    }

    // 执行方块移动动画
    animateTileMovement(cell, moveData) {
        const { fromRow, fromCol, toRow, toCol, value } = moveData;
        
        // 计算移动距离（以格子为单位）
        const deltaX = toCol - fromCol;
        const deltaY = toRow - fromRow;
        
        // 计算移动距离（以像素为单位）
        const cellSize = 70; // 每个格子的像素大小
        const moveX = deltaX * cellSize;
        const moveY = deltaY * cellSize;
        
        // 添加移动动画类
        cell.classList.add('tile-move-trail');
        
        // 设置初始位置（从原位置开始）
        cell.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        cell.style.transition = 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // 强制重排，然后移动到目标位置
        requestAnimationFrame(() => {
            cell.style.transform = 'translate(0px, 0px)';
        });
        
        // 动画结束后清理
        setTimeout(() => {
            cell.style.transform = '';
            cell.style.transition = '';
            cell.classList.remove('tile-move-trail');
        }, 250);
    }

    createThemeSelector() {
        const gameContainer = document.querySelector('.game-2048');
        if (!gameContainer) return;

        // 查找或创建主题选择器
        let themeSelector = gameContainer.querySelector('.theme-selector');
        if (!themeSelector) {
            themeSelector = document.createElement('div');
            themeSelector.className = 'theme-selector';
            themeSelector.innerHTML = `
                <label for="theme-select">主题：</label>
                <select id="theme-select">
                    ${Object.keys(this.themes).map(key => 
                        `<option value="${key}">${this.themes[key].name}</option>`
                    ).join('')}
                </select>
            `;
            
            // 插入到游戏容器中
            const scoreContainer = gameContainer.querySelector('.score-container');
            if (scoreContainer) {
                scoreContainer.parentNode.insertBefore(themeSelector, scoreContainer.nextSibling);
            } else {
                gameContainer.insertBefore(themeSelector, gameContainer.firstChild);
            }
        }

        // 设置当前主题
        const select = themeSelector.querySelector('#theme-select');
        select.value = this.currentTheme;

        // 添加事件监听器
        select.addEventListener('change', (e) => {
            this.currentTheme = e.target.value;
            this.saveTheme();
            this.updateDisplay();
        });
    }


    checkGameOver() {
        // 检查是否还有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return;
            }
        }
        
        // 检查是否还能合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                if ((i < 3 && this.grid[i + 1][j] === current) ||
                    (j < 3 && this.grid[i][j + 1] === current)) {
                    return;
                }
            }
        }
        
        this.gameOver = true;
        window.app.showNotification('游戏结束！', 'warning');
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 只在游戏模态框打开时响应键盘事件
            if (!window.app || !window.app.currentModal) return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.restart();
        });
    }

    restart() {
        this.grid = [];
        this.score = 0;
        this.gameOver = false;
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    loadBestScore() {
        this.bestScore = window.app.loadData('2048_best', 0);
    }

    saveBestScore() {
        window.app.saveData('2048_best', this.bestScore);
    }

    destroy() {
        // 清理事件监听器
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// 记忆配对游戏类
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.startTime = null;
        this.timer = null;
        this.isProcessing = false;
        this.overlay = null;
        this.ctx = null;
        this.hintUsed = false;
        this.difficulty = 'easy';
        this.theme = 'emoji';
        this.animations = [];
        this.bestRecord = this.loadBestRecord();
    }

    init() {
        this.setupOverlay();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.setupEventListeners();
        this.updateBestRecordDisplay();
        
        // 自动开始游戏
        this.startTimer();
        this.startTime = Date.now();
    }

    setupOverlay() {
        this.overlay = document.getElementById('memory-overlay');
        if (this.overlay) {
            this.ctx = this.overlay.getContext('2d');
        }
    }

    createCards() {
        const difficultySel = document.getElementById('memory-difficulty');
        const themeSel = document.getElementById('memory-theme');
        
        this.difficulty = difficultySel ? difficultySel.value : 'easy';
        this.theme = themeSel ? themeSel.value : 'emoji';
        
        const sizes = { 
            easy: { rows: 4, cols: 4 }, 
            medium: { rows: 4, cols: 5 }, 
            hard: { rows: 5, cols: 6 } 
        };
        const size = sizes[this.difficulty];
        const totalPairs = (size.rows * size.cols) / 2;
        
        const sets = {
            emoji: ['😀','😎','🤖','👻','🐱','🐶','🦊','🐼','🍎','🍊','🍋','🍉','⚽','🏀','🏈','🎲','🎯','🎮','🎪','🎨','🎭','🎪'],
            animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉'],
            colors: ['🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🟡','🔴','🟢','🔵','🟠','🟣','⚫','⚪','🟤','🔴','🟡','🟢','🔵'],
            shapes: ['▲','◆','●','■','★','☂','☀','☾','♣','♠','♥','♦','▲','◆','●','■','★','☂','☀','☾','♣','♠']
        };
        
        const pool = sets[this.theme] || sets.emoji;
        const symbols = pool.slice(0, totalPairs);
        this.cards = [];
        symbols.forEach(symbol => {
            const pairId = Math.random().toString(36).substr(2, 9);
            this.cards.push({ 
                symbol, 
                isFlipped: false, 
                isMatched: false,
                id: pairId
            });
            this.cards.push({ 
                symbol, 
                isFlipped: false, 
                isMatched: false,
                id: pairId
            });
        });
        
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderCards() {
        const board = document.getElementById('memory-board');
        board.innerHTML = '';
        const sizes = { 
            easy: { rows: 4, cols: 4 }, 
            medium: { rows: 4, cols: 5 }, 
            hard: { rows: 5, cols: 6 } 
        };
        const size = sizes[this.difficulty];
        board.style.gridTemplateColumns = `repeat(${size.cols}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${size.rows}, 1fr)`;
        board.setAttribute('data-difficulty', this.difficulty);
        
        // 移除所有hard类（8x8相关）
        board.classList.remove('hard');
        const container = board.closest('.memory-container');
        if (container) {
            container.classList.remove('hard');
        }
        const gameArea = board.closest('.game-area');
        if (gameArea) {
            gameArea.classList.remove('hard');
        }
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            
            if (card.isMatched) {
                cardElement.classList.add('matched');
                cardElement.classList.add('flipped'); // 确保匹配的卡片保持翻转状态
            } else if (card.isFlipped) {
                cardElement.classList.add('flipped');
            }
            
            cardElement.innerHTML = `
                <div class="card-front">${card.isMatched ? card.symbol : '?'}</div>
                <div class="card-back">${card.symbol}</div>
            `;
            
            board.appendChild(cardElement);
        });
        
        // 在DOM更新后更新overlay尺寸
        setTimeout(() => {
            if (this.overlay) {
                const boardRect = board.getBoundingClientRect();
                this.overlay.width = boardRect.width;
                this.overlay.height = boardRect.height;
            }
        }, 0);
    }

    flipCard(index) {
        // 如果游戏未开始、正在处理匹配或卡片已翻转/已匹配，则忽略点击
        if (this.startTime === null || this.isProcessing || this.cards[index].isFlipped || this.cards[index].isMatched) {
            return;
        }
        
        // 如果已经翻开了两张卡片，不允许继续点击
        if (this.flippedCards.length >= 2) {
            return;
        }
        
        // 翻转卡片
        this.cards[index].isFlipped = true;
        this.flippedCards.push(index);
        this.renderCards();
        
        // 如果翻开了两张卡片，检查是否匹配
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            
            setTimeout(() => {
                this.isProcessing = true;
                this.checkMatch();
            }, 1000); // 给玩家时间看到第二张卡片
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        if (card1.symbol === card2.symbol) {
            // 匹配成功
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            // 计算得分
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            const baseScore = 10;
            const streakBonus = Math.floor(this.streak / 3) * 5; // 每3连击额外5分
            const timeBonus = this.startTime ? Math.max(0, 30 - Math.floor((Date.now() - this.startTime) / 1000)) : 0;
            const scoreGained = baseScore + streakBonus + timeBonus;
            this.score += scoreGained;
            
            // 更新UI
            document.getElementById('score').textContent = this.score;
            document.getElementById('streak').textContent = this.streak;
            
            // 简单的配对成功提示
            this.showSimpleMatchEffect(index1, index2);
            
            // 检查游戏是否完成
            const totalPairs = this.cards.length / 2;
            if (this.matchedPairs === totalPairs) {
                this.gameWon();
            }
            
            // 匹配成功后也重置处理状态
            this.isProcessing = false;
        } else {
            // 匹配失败，翻转回卡片
            card1.isFlipped = false;
            card2.isFlipped = false;
            this.streak = 0; // 重置连击
            document.getElementById('streak').textContent = this.streak;
            
            // 立即重置处理状态，允许玩家继续点击
            this.isProcessing = false;
        }
        
        // 重置状态
        this.flippedCards = [];
        this.renderCards();
    }

    showSimpleMatchEffect(index1, index2) {
        // 配对成功，显示提示
        window.app.showNotification('配对成功！', 'success');
        
        // 卡片会通过CSS的matched类来显示匹配状态
        const cards = document.querySelectorAll('.memory-card');
        const card1 = Array.from(cards).find(card => parseInt(card.dataset.index) === index1);
        const card2 = Array.from(cards).find(card => parseInt(card.dataset.index) === index2);
        
        if (card1 && card2) {
            // 添加匹配成功的视觉反馈
            card1.classList.add('matched');
            card2.classList.add('matched');
        }
    }

    clearOverlay() {
        if (this.ctx && this.overlay) {
            this.ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        }
    }

    // 本地存储相关方法
    loadBestRecord() {
        try {
            const saved = localStorage.getItem('memoryGameBestRecord');
            return saved ? JSON.parse(saved) : {
                moves: Infinity,
                difficulty: 'easy',
                date: null
            };
        } catch (e) {
            return {
                moves: Infinity,
                difficulty: 'easy',
                date: null
            };
        }
    }

    getGameTime() {
        if (this.startTime === null) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    calculateScore() {
        // 计算最终得分：基础分数 + 连击奖励 + 时间奖励
        const timeElapsed = this.getGameTime();
        const timeBonus = Math.max(0, 300 - timeElapsed); // 时间越短奖励越高，最多300秒奖励
        const streakBonus = this.maxStreak * 10; // 连击奖励
        const movesBonus = Math.max(0, (this.cards.length / 2) * 10 - this.moves * 2); // 步数越少奖励越高
        
        return this.score + streakBonus + Math.floor(timeBonus) + Math.floor(movesBonus);
    }

    saveBestRecord() {
        const isNewRecord = this.moves < this.bestRecord.moves;

        if (isNewRecord) {
            this.bestRecord = {
                moves: this.moves,
                difficulty: this.difficulty,
                date: new Date().toLocaleDateString()
            };
            
            try {
                localStorage.setItem('memoryGameBestRecord', JSON.stringify(this.bestRecord));
            } catch (e) {
                console.warn('无法保存最佳记录:', e);
            }
            
            return true;
        }
        return false;
    }

    resetBestRecord() {
        this.bestRecord = {
            moves: Infinity,
            difficulty: 'easy',
            date: null
        };
        
        try {
            localStorage.removeItem('memoryGameBestRecord');
        } catch (e) {
            console.warn('无法重置最佳记录:', e);
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }


    gameWon() {
        clearInterval(this.timer);
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.startTime = null; // 重置游戏状态，防止继续翻牌
        
        const finalScore = this.calculateScore(); // 使用统一的分数计算方法
        
        // 保存最佳记录
        const isNewRecord = this.saveBestRecord();
        
        let message = `恭喜完成！\n得分: ${finalScore}\n用时: ${timeString}\n步数: ${this.moves}\n最高连击: ${this.maxStreak}`;
        
        if (isNewRecord) {
            message += `\n\n🎉 新纪录！`;
        }
        
        // 显示最佳记录信息
        const bestRecordText = this.bestRecord.moves !== Infinity ? 
            `\n\n最佳记录:\n步数: ${this.bestRecord.moves}` : 
            `\n\n这是你的第一次游戏！`;
        
        message += bestRecordText;
        
        window.app.showNotification(message, 'success');
        
        // 显示重新开始按钮
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.style.display = 'inline-block';
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateBestRecordDisplay() {
        const bestMovesEl = document.getElementById('best-moves');
        
        if (this.bestRecord.moves !== Infinity) {
            bestMovesEl.textContent = this.bestRecord.moves;
        } else {
            bestMovesEl.textContent = '-';
        }
    }

    updateStats() {
        // 更新步数显示
        const movesEl = document.getElementById('moves');
        if (movesEl) {
            movesEl.textContent = this.moves;
        }

        // 更新得分显示
        const scoreEl = document.getElementById('score');
        if (scoreEl) {
            scoreEl.textContent = this.score;
        }

        // 更新连击显示
        const streakEl = document.getElementById('streak');
        if (streakEl) {
            streakEl.textContent = this.streak;
        }

        // 更新时间显示
        const timeEl = document.getElementById('time');
        if (timeEl && this.startTime && !this.isGameOver) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            timeEl.textContent = this.formatTime(elapsed);
        }
    }


    setupEventListeners() {
        document.getElementById('memory-board').addEventListener('click', (e) => {
            if (this.isProcessing) return;
            const card = e.target.closest('.memory-card');
            if (card) {
                const index = parseInt(card.dataset.index);
                this.flipCard(index);
            }
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });


        document.getElementById('memory-hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        const difficultySel = document.getElementById('memory-difficulty');
        const themeSel = document.getElementById('memory-theme');
        const apply = () => {
            clearInterval(this.timer);
            this.moves = 0;
            this.score = 0;
            this.streak = 0;
            this.maxStreak = 0;
            this.startTime = null;
            this.isProcessing = false;
            this.hintUsed = false;
            this.clearOverlay();
            this.createCards();
            this.shuffleCards();
            this.renderCards();
            document.getElementById('moves').textContent = '0';
            document.getElementById('time').textContent = '00:00';
            document.getElementById('score').textContent = '0';
            document.getElementById('streak').textContent = '0';
            
            // 自动开始游戏
            this.startTimer();
            this.startTime = Date.now();
        };
        if (difficultySel) difficultySel.addEventListener('change', apply);
        if (themeSel) themeSel.addEventListener('change', apply);
    }


    showHint() {
        // 找到一对未匹配的相同卡片
        const symbolGroups = {};
        
        this.cards.forEach((card, index) => {
            if (!card.isMatched) {
                if (!symbolGroups[card.symbol]) {
                    symbolGroups[card.symbol] = [];
                }
                symbolGroups[card.symbol].push(index);
            }
        });

        // 找到第一对可匹配的卡片
        for (const symbol in symbolGroups) {
            if (symbolGroups[symbol].length >= 2) {
                const [index1, index2] = symbolGroups[symbol].slice(0, 2);
                
                // 消耗3步
                this.moves += 3;
                this.updateStats();
                
                this.highlightHint(index1, index2);
                this.hintUsed = true;
                
                window.app.showNotification('使用提示消耗3步！', 'info');
                return;
            }
        }

        window.app.showNotification('没有可提示的配对', 'warning');
    }

    highlightHint(index1, index2) {
        // 高亮显示提示的卡片
        const cards = document.querySelectorAll('.memory-card');
        const card1 = Array.from(cards).find(card => parseInt(card.dataset.index) === index1);
        const card2 = Array.from(cards).find(card => parseInt(card.dataset.index) === index2);
        
        if (card1 && card2) {
            card1.classList.add('hint-highlight');
            card2.classList.add('hint-highlight');
            
            // 1.5秒后自动点击第一张卡片
            setTimeout(() => {
                if (!this.cards[index1].isFlipped && !this.cards[index1].isMatched && !this.isProcessing) {
                    this.flipCard(index1);
                }
            }, 1500);
            
            // 2.5秒后自动点击第二张卡片
            setTimeout(() => {
                if (!this.cards[index2].isFlipped && !this.cards[index2].isMatched && !this.isProcessing) {
                    this.flipCard(index2);
                }
            }, 2500);
            
            // 4秒后移除高亮
            setTimeout(() => {
                card1.classList.remove('hint-highlight');
                card2.classList.remove('hint-highlight');
            }, 4000);
        }
    }



    restart() {
        clearInterval(this.timer);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.isProcessing = false;
        this.hintUsed = false;
        this.clearOverlay();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.startTimer();
        this.startTime = Date.now();
        document.getElementById('moves').textContent = '0';
        document.getElementById('time').textContent = '00:00';
        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        
        // 隐藏重新开始按钮
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.style.display = 'none';
        }
        
    }

    destroy() {
        clearInterval(this.timer);
    }
}

// 数字猜谜游戏类
class GuessGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.min = 1;
        this.max = 100;
        this.originalMin = 1;  // 保存原始最小范围
        this.originalMax = 100; // 保存原始最大范围
        this.allowDecimal = false;
        this.decimals = 1;
        this.gameOver = false;
    }

    init() {
        this.setupEventListeners();
        // 延迟执行newGame，确保DOM完全加载
        setTimeout(() => {
            this.newGame();
        }, 100);
    }

    newGame() {
        // 重置到原始范围
        this.min = this.originalMin;
        this.max = this.originalMax;
        
        if (this.allowDecimal) {
            const r = Math.random() * (this.max - this.min) + this.min;
            const factor = Math.pow(10, this.decimals);
            this.targetNumber = Math.round(r * factor) / factor;
        } else {
            this.targetNumber = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        }
        this.attempts = 0;
        this.gameOver = false;
        
        console.log('GuessGame newGame called, target:', this.targetNumber, 'min:', this.min, 'max:', this.max);
        
        // 等待DOM元素完全加载
        const updateDisplay = () => {
            const attemptsEl = document.getElementById('attempts');
            const rangeEl = document.getElementById('range');
            
            console.log('Looking for attempts element:', attemptsEl);
            console.log('Looking for range element:', rangeEl);
            
            if (attemptsEl) {
                attemptsEl.textContent = '0';
                attemptsEl.classList.add('updating');
                setTimeout(() => attemptsEl.classList.remove('updating'), 600);
                console.log('Updated attempts display to 0');
            } else {
                console.error('attempts element not found, retrying...');
                setTimeout(updateDisplay, 50);
                return;
            }
            
            if (rangeEl) {
                const rangeText = `${this.formatNum(this.min)}-${this.formatNum(this.max)}` + (this.allowDecimal ? '（小数）' : '');
                rangeEl.textContent = rangeText;
                rangeEl.classList.add('updating');
                setTimeout(() => rangeEl.classList.remove('updating'), 600);
                console.log('Updated range display to:', rangeText);
            } else {
                console.error('range element not found, retrying...');
                setTimeout(updateDisplay, 50);
                return;
            }
        };
        
        updateDisplay();
        
        const resultEl = document.getElementById('guess-result');
        if (resultEl) {
            resultEl.innerHTML = '';
        }
        
        const newBtnEl = document.getElementById('new-guess-btn');
        if (newBtnEl) {
            newBtnEl.style.display = 'none';
        }
        
        const input = document.getElementById('guess-input');
        if (input) {
        input.disabled = false;
        input.min = String(this.min);
        input.max = String(this.max);
        input.step = this.allowDecimal ? `0.${'0'.repeat(Math.max(0,this.decimals-1))}1` : '1';
        }
        
        const guessBtnEl = document.getElementById('guess-btn');
        if (guessBtnEl) {
            guessBtnEl.disabled = false;
        }
    }

    makeGuess() {
        if (this.gameOver) return;
        
        const input = document.getElementById('guess-input');
        const guess = this.allowDecimal ? parseFloat(input.value) : parseInt(input.value);
        
        if (isNaN(guess) || guess < this.min || guess > this.max) {
            window.app.showNotification(`请输入${this.min}-${this.max}之间的有效数字`, 'error');
            return;
        }
        
        this.attempts++;
        const attemptsEl = document.getElementById('attempts');
        if (attemptsEl) {
            attemptsEl.textContent = this.attempts;
            attemptsEl.classList.add('updating');
            setTimeout(() => attemptsEl.classList.remove('updating'), 600);
            console.log('Updated attempts to:', this.attempts);
        } else {
            console.error('attempts element not found in makeGuess, retrying...');
            setTimeout(() => {
                const retryEl = document.getElementById('attempts');
                if (retryEl) {
                    retryEl.textContent = this.attempts;
                    retryEl.classList.add('updating');
                    setTimeout(() => retryEl.classList.remove('updating'), 600);
                    console.log('Retry: Updated attempts to:', this.attempts);
                }
            }, 50);
        }
        
        const resultDiv = document.getElementById('guess-result');
        
        const step = this.allowDecimal ? Math.pow(10, -this.decimals) : 1;
        const equal = this.allowDecimal ? Math.abs(guess - this.targetNumber) < step / 2 : guess === this.targetNumber;
        if (equal) {
            resultDiv.innerHTML = `<div class=\"success\">恭喜！你猜对了！答案就是 ${this.targetNumber}</div>`;
            this.gameOver = true;
            document.getElementById('new-guess-btn').style.display = 'block';
            document.getElementById('guess-input').disabled = true;
            document.getElementById('guess-btn').disabled = true;
        } else if (guess < this.targetNumber) {
            this.min = Math.max(this.min, guess + step);
            resultDiv.innerHTML = `<div class="hint">太小了！试试更大的数字</div>`;
        } else {
            this.max = Math.min(this.max, guess - step);
            resultDiv.innerHTML = `<div class="hint">太大了！试试更小的数字</div>`;
        }
        
        if (this.min > this.max) {
            // 防御：确保范围不会反转
            const mid = (this.min + this.max) / 2;
            this.min = mid;
            this.max = mid;
        }
        const rangeEl = document.getElementById('range');
        if (rangeEl) {
            const rangeText = `${this.formatNum(this.min)}-${this.formatNum(this.max)}` + (this.allowDecimal ? '（小数）' : '');
            rangeEl.textContent = rangeText;
            rangeEl.classList.add('updating');
            setTimeout(() => rangeEl.classList.remove('updating'), 600);
            console.log('Updated range to:', rangeText);
        } else {
            console.error('range element not found in makeGuess, retrying...');
            setTimeout(() => {
                const retryEl = document.getElementById('range');
                if (retryEl) {
                    const rangeText = `${this.formatNum(this.min)}-${this.formatNum(this.max)}` + (this.allowDecimal ? '（小数）' : '');
                    retryEl.textContent = rangeText;
                    retryEl.classList.add('updating');
                    setTimeout(() => retryEl.classList.remove('updating'), 600);
                    console.log('Retry: Updated range to:', rangeText);
                }
            }, 50);
        }
        input.value = '';
        input.focus();
    }

    setupEventListeners() {
        document.getElementById('guess-btn').addEventListener('click', () => {
            this.makeGuess();
        });

        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });

        document.getElementById('new-guess-btn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('apply-range').addEventListener('click', () => {
            const min = parseFloat(document.getElementById('guess-min').value);
            const max = parseFloat(document.getElementById('guess-max').value);
            const decimal = document.getElementById('guess-decimal').checked;
            const decimalsSel = document.getElementById('guess-decimals');
            if (isNaN(min) || isNaN(max) || min >= max) {
                window.app.showNotification('请设置有效的最小/最大值（最小值应小于最大值）', 'error');
                return;
            }
            this.min = min;
            this.max = max;
            this.originalMin = min;  // 更新原始范围
            this.originalMax = max;  // 更新原始范围
            this.allowDecimal = decimal;
            this.decimals = decimalsSel ? parseInt(decimalsSel.value) : 1;
            this.newGame();
        });
    }

    formatNum(n) {
        if (!this.allowDecimal) return String(Math.round(n));
        return Number(n).toFixed(this.decimals);
    }

    destroy() {
        // 清理事件监听器
    }
}

// 拼图（滑块拼图）
class PuzzleGame {
    constructor() {
        this.size = 4;
        this.board = [];
        this.empty = { x: 3, y: 3 };
        this.moves = 0;
        this.timer = null;
        this.startTime = null;
        this.handleKey = this.onKeyDown.bind(this);
        this.currentImage = null;
        this.imageSrc = null;
        this.defaultImages = {
            nature: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNGVhZjUwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHg9IjQ1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjOGI0NTEzIi8+CjxwYXRoIGQ9Ik0zMCA2NSBMNDAgNTUgTDUwIDY1IEw2MCA1NSBMMzAgNjVaIiBmaWxsPSIjNGVhZjUwIi8+CjxwYXRoIGQ9Ik0yMCA3NSBMMzAgNjUgTDQwIDc1IEw1MCA2NSBMNjAgNzUgTDcwIDY1IEwyMCA3NVoiIGZpbGw9IiM0ZWFmNTAiLz4KPC9zdmc+",
            city: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzMzIi8+CjxyZWN0IHg9IjEwIiB5PSI0MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjcwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjUwIiB5PSIyMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjcwIiB5PSIzNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjY1IiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjE1IiB5PSI1MCIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB4PSIzNSIgeT0iNDAiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeD0iNTUiIHk9IjMwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHg9Ijc1IiB5PSI0NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=",
            space: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSI0IiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9IjYwIiByPSIyIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==",
            abstract: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjM0ZjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjOWMyN2IwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjZmZjMTA3Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjNGNhZjUwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+",
            ocean: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA2NkZmIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjMDA0NEE2Ii8+CjxwYXRoIGQ9Ik0wIDYwIEMxMCA1NSAyMCA1MCAzMCA1NSBMNDAgNTAgTDUwIDU1IEw2MCA1MCBMNzAgNTUgTDgwIDUwIEw5MCA1NSBMMTAwIDUwIFY3MCBIMTAwIEgwIFoiIGZpbGw9IiMwMDQ0QTYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMyIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjI1IiByPSIyIiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNmZmYiLz4KPC9zdmc+",
            sunset: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzAiIHI9IjIwIiBmaWxsPSIjRkZEMDAwIi8+CjxwYXRoIGQ9Ik0wIDYwIEMxMCA1NSAyMCA1MCAzMCA1NSBMNDAgNTAgTDUwIDU1IEw2MCA1MCBMNzAgNTUgTDgwIDUwIEw5MCA1NSBMMTAwIDUwIFY3MCBIMTAwIEgwIFoiIGZpbGw9IiNGRkE1MDAiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjM1IiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==",
            forest: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA0NDAwIi8+CjxyZWN0IHg9IjEwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjOGI0NTEzIi8+CjxyZWN0IHg9IjcwIiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjOGI0NTEzIi8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iNjAiIHI9IjEwIiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjEyIiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9IjU1IiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjMDA4MDAwIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNTUiIHI9IjEwIiBmaWxsPSIjMDA4MDAwIi8+Cjwvc3ZnPg==",
            mountain: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjODc0RkZGIi8+CjxwYXRoIGQ9Ik0wIDgwIEwyMCA0MCBMMzAgNTAgTDQwIDMwIEw1MCA0MCBMNjAgMjAgTDcwIDMwIEw4MCA0MCBMMTAwIDYwIFY4MCBaIiBmaWxsPSIjNjY2Ii8+CjxwYXRoIGQ9Ik0wIDgwIEwyMCA0MCBMMzAgNTAgTDQwIDMwIEw1MCA0MCBMNjAgMjAgTDcwIDMwIEw4MCA0MCBMMTAwIDYwIFY4MCBaIiBmaWxsPSIjOTk5Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==",
            geometric: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYzRjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
            mandala: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkYzRjU2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM1IiBmaWxsPSIjRkY2QjAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjRkYwMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTUwIDUgTDU1IDE1IEw2NSAyMCBMNTUgMjUgTDUwIDM1IEw0NSAyNSBMMzUgMjAgTDQ1IDE1IFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTUwIDY1IEw1NSA3NSBMNjUgODAgTDU1IDg1IEw1MCA5NSBMNDUgODUgTDM1IDgwIEw0NSA3NSBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik01IDUwIEwxNSA0NSBMMjAgMzUgTDI1IDQ1IEwzNSA1MCBMMjUgNTUgTDIwIDY1IEwxNSA1NSBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik05NSA1MCBMODUgNTUgTDgwIDY1IEw3NSA1NSBMNjUgNTAgTDc1IDQ1IEw4MCAzNSBMODUgNDUgWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=",
            galaxy: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjNjYwMEZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRkYwMEZGIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9IjYwIiByPSIyIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4="
        };
    }

    init() {
        const sel = document.getElementById('puzzle-size');
        if (sel) {
            sel.addEventListener('change', () => {
                this.size = parseInt(sel.value);
                this.newGame();
            });
        }
        document.getElementById('puzzle-new-btn').addEventListener('click', () => this.newGame());
        document.addEventListener('keydown', this.handleKey);
        
        // 设置默认图片选择器
        this.setupImageSelector();
        
        // 默认使用自然风景图片
        this.setImage('nature');
    }

    newGame() {
        if (!this.currentImage) return;
        
        this.buildBoard();
        this.shuffle();
        this.moves = 0;
        this.updateHeader();
        this.render();
        this.startTimer();
    }

    buildBoard() {
        this.board = [];
        let n = 1;
        for (let y = 0; y < this.size; y++) {
            const row = [];
            for (let x = 0; x < this.size; x++) {
                row.push(n);
                n++;
            }
            this.board.push(row);
        }
        this.board[this.size - 1][this.size - 1] = 0;
        this.empty = { x: this.size - 1, y: this.size - 1 };
    }

    shuffle() {
        // 通过执行合法移动打乱，确保可还原
        const dirs = [ {x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1} ];
        let steps = this.size * this.size * 20;
        while (steps--) {
            const d = dirs[Math.floor(Math.random()*dirs.length)];
            const nx = this.empty.x + d.x;
            const ny = this.empty.y + d.y;
            if (nx>=0 && nx<this.size && ny>=0 && ny<this.size) {
                this.swap(nx, ny, this.empty.x, this.empty.y);
                this.empty = { x: nx, y: ny };
            }
        }
    }

    swap(x1, y1, x2, y2) {
        const t = this.board[y1][x1];
        this.board[y1][x1] = this.board[y2][x2];
        this.board[y2][x2] = t;
    }

    render() {
        const el = document.getElementById('puzzle-board');
        el.innerHTML = '';
        el.style.display = 'grid';
        el.style.gridTemplateColumns = `repeat(${this.size}, 84px)`;
        el.style.gridTemplateRows = `repeat(${this.size}, 84px)`;
        el.style.gap = '2px';
        el.style.border = '2px solid var(--accent-color)';
        el.style.borderRadius = '8px';
        el.style.overflow = 'hidden';
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const v = this.board[y][x];
                const cell = document.createElement('div');
                cell.className = 'puzzle-cell';
                
                if (v === 0) {
                    cell.classList.add('empty');
                } else {
                    // 计算图片片段的位置
                    const pieceX = (v - 1) % this.size;
                    const pieceY = Math.floor((v - 1) / this.size);
                    
                    // 设置背景图片片段
                    const offsetX = -pieceX * 100;
                    const offsetY = -pieceY * 100;
                    
                    cell.style.backgroundImage = `url(${this.imageSrc})`;
                    cell.style.backgroundSize = `${this.size * 100}% ${this.size * 100}%`;
                    cell.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
                    cell.style.border = '1px solid rgba(255,255,255,0.3)';
                    
                    // 添加数字标识
                    const numberSpan = document.createElement('span');
                    numberSpan.className = 'puzzle-number';
                    numberSpan.textContent = v;
                    cell.appendChild(numberSpan);
                }
                
                cell.addEventListener('click', () => this.tryMove(x, y));
                el.appendChild(cell);
            }
        }
    }

    tryMove(x, y) {
        const dx = Math.abs(x - this.empty.x);
        const dy = Math.abs(y - this.empty.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            this.swap(x, y, this.empty.x, this.empty.y);
            this.empty = { x, y };
            this.moves++;
            this.updateHeader();
            this.render();
            if (this.isSolved()) {
                clearInterval(this.timer);
                window.app.showNotification(`拼图完成！步数：${this.moves}`,'success');
            }
        }
    }

    onKeyDown(e) {
        // 只在游戏模态框打开时响应键盘事件
        if (!window.app || !window.app.currentModal) return;
        
        const dirMap = { ArrowLeft:{x:1,y:0}, ArrowRight:{x:-1,y:0}, ArrowUp:{x:0,y:1}, ArrowDown:{x:0,y:-1} };
        if (!dirMap[e.key]) return;
        e.preventDefault();
        const d = dirMap[e.key];
        const nx = this.empty.x + d.x;
        const ny = this.empty.y + d.y;
        if (nx>=0 && nx<this.size && ny>=0 && ny<this.size) {
            this.tryMove(nx, ny);
        }
    }

    isSolved() {
        let n = 1;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (x === this.size - 1 && y === this.size - 1) {
                    if (this.board[y][x] !== 0) return false;
                } else if (this.board[y][x] !== n) {
                    return false;
                }
                n++;
            }
        }
        return true;
    }

    updateHeader() {
        const movesEl = document.getElementById('puzzle-moves');
        if (movesEl) movesEl.textContent = this.moves;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const m = Math.floor(elapsed/60).toString().padStart(2,'0');
            const s = (elapsed%60).toString().padStart(2,'0');
            const el = document.getElementById('puzzle-time');
            if (el) el.textContent = `${m}:${s}`;
        }, 1000);
    }

    setupImageSelector() {
        // 图案选择按钮
        const selectPatternBtn = document.getElementById('select-pattern-btn');
        if (selectPatternBtn) {
            selectPatternBtn.addEventListener('click', () => {
                this.showPatternModal();
            });
        }

        // 模态框关闭按钮
        const modalCloseBtn = document.getElementById('pattern-modal-close');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                this.hidePatternModal();
            });
        }

        // 点击模态框背景关闭
        const modal = document.getElementById('pattern-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hidePatternModal();
                }
            });
        }

        // 图案选择
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.addEventListener('click', () => {
                const imageType = option.dataset.image;
                this.setImage(imageType);
                document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.hidePatternModal();
            });
        });

        // 文件上传
        const uploadInput = document.getElementById('puzzle-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.cropAndSetImage(event.target.result);
                        document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('selected'));
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    showPatternModal() {
        const modal = document.getElementById('pattern-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hidePatternModal() {
        const modal = document.getElementById('pattern-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    setImage(imageType) {
        this.imageSrc = this.defaultImages[imageType];
        this.loadImage();
    }

    setCustomImage(imageSrc) {
        this.imageSrc = imageSrc;
        this.loadImage();
    }

    cropAndSetImage(imageSrc) {
        const img = new Image();
        img.onload = () => {
            // 创建canvas进行裁剪
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 计算裁剪尺寸（取较小的边作为正方形边长）
            const size = Math.min(img.width, img.height);
            
            // 设置canvas尺寸
            canvas.width = size;
            canvas.height = size;
            
            // 计算裁剪起始位置（居中裁剪）
            const sourceX = (img.width - size) / 2;
            const sourceY = (img.height - size) / 2;
            
            // 绘制裁剪后的图片
            ctx.drawImage(
                img,
                sourceX, sourceY, size, size,  // 源图片裁剪区域
                0, 0, size, size               // 目标canvas区域
            );
            
            // 转换为base64
            const croppedImageSrc = canvas.toDataURL('image/jpeg', 0.9);
            this.setCustomImage(croppedImageSrc);
        };
        img.src = imageSrc;
    }

    loadImage() {
        if (!this.imageSrc) return;
        
        const img = new Image();
        img.onload = () => {
            this.currentImage = img;
            this.newGame();
        };
        img.src = this.imageSrc;
    }

    destroy() {
        clearInterval(this.timer);
        document.removeEventListener('keydown', this.handleKey);
    }
}

// 连连看类
class LinkGame {
    constructor() {
        this.size = 8;
        this.grid = [];
        this.selected = null;
        this.moves = 0;
        this.timer = null;
        this.startTime = null;
        this.currentTheme = 'fruits';
        this.themes = {
            fruits: ['🍎','🍊','🍋','🍉','🍇','🍓','🍒','🥝','🥥','🥑','🌶','🍄'],
            animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'],
            emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃'],
            symbols: ['⭐','🌟','💫','✨','🔥','💎','🎯','🎪','🎨','🎭','🎪','🎲']
        };
        this.icons = this.themes[this.currentTheme];
    }

    init() {
        const sel = document.getElementById('link-size');
        if (sel) sel.addEventListener('change', () => { this.size = parseInt(sel.value); this.newGame(); });
        
        const themeSel = document.getElementById('link-theme');
        if (themeSel) {
            themeSel.addEventListener('change', () => { 
                this.currentTheme = themeSel.value; 
                this.icons = this.themes[this.currentTheme];
                this.newGame(); 
            });
        }
        
        document.getElementById('link-new-btn').addEventListener('click', () => this.newGame());
        document.getElementById('link-hint-btn').addEventListener('click', () => {
            const pair = this.findHint();
            if (!pair) { window.app.showNotification('没有可连对，试试重排。', 'warning'); return; }
            this.drawConnection(pair[0], pair[1]);
        });
        
        // 监听窗口大小变化，重新渲染以适应不同屏幕尺寸
        this.resizeHandler = () => this.render();
        window.addEventListener('resize', this.resizeHandler);
        
        this.newGame();
    }

    newGame() {
        this.buildGrid();
        this.shuffleIcons();
        this.moves = 0;
        this.updateHeader();
        this.render();
        this.startTimer();
    }

    buildGrid() {
        this.grid = Array(this.size+2).fill().map(()=>Array(this.size+2).fill(null)); // 外围留空，便于路径判断
        const pairs = (this.size * this.size) / 2;
        const pool = [];
        for (let i=0;i<pairs;i++) {
            const icon = this.icons[i % this.icons.length];
            pool.push(icon, icon);
        }
        // 随机填充到 1..size 区域
        for (let y=1;y<=this.size;y++) {
            for (let x=1;x<=this.size;x++) {
                const idx = Math.floor(Math.random()*pool.length);
                this.grid[y][x] = pool[idx];
                pool.splice(idx,1);
            }
        }
    }

    shuffleIcons() { /* 已在build中随机化，留接口便于后续“重排” */ }

    render() {
        const el = document.getElementById('link-board');
        el.innerHTML = '';
        el.style.display = 'grid';
        
        // 根据屏幕尺寸调整方块大小
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        let cellSize, gap;
        if (isSmallMobile) {
            cellSize = 60;
            gap = 4;
        } else if (isMobile) {
            cellSize = 70;
            gap = 6;
        } else {
            cellSize = 90;
            gap = 8;
        }
        
        el.style.gridTemplateColumns = `repeat(${this.size}, ${cellSize}px)`;
        el.style.gridTemplateRows = `repeat(${this.size}, ${cellSize}px)`;
        el.style.gap = `${gap}px`;
        
        // 调整覆盖画布尺寸
        const overlay = document.getElementById('link-overlay');
        const rectSize = this.size * cellSize + (this.size - 1) * gap;
        overlay.width = rectSize; overlay.height = rectSize;
        
        for (let y=1;y<=this.size;y++) {
            for (let x=1;x<=this.size;x++) {
                const v = this.grid[y][x];
                const cell = document.createElement('button');
                cell.className = 'link-cell';
                cell.textContent = v || '';
                if (!v) cell.disabled = true;
                if (this.selected && this.selected.x===x && this.selected.y===y) cell.classList.add('selected');
                cell.addEventListener('click', ()=>this.onClick(x,y));
                el.appendChild(cell);
            }
        }
    }

    onClick(x,y) {
        if (!this.grid[y][x]) return;
        if (!this.selected) {
            this.selected = {x,y};
            this.render();
            return;
        }
        if (this.selected.x===x && this.selected.y===y) {
            this.selected = null; this.render(); return;
        }
        if (this.grid[y][x] !== this.grid[this.selected.y][this.selected.x]) {
            this.selected = {x,y}; this.render(); return;
        }
        if (this.canConnect(this.selected, {x,y})) {
            this.drawConnection(this.selected, {x,y});
            // 消除
            this.grid[this.selected.y][this.selected.x] = null;
            this.grid[y][x] = null;
            this.selected = null;
            this.moves++;
            this.updateHeader();
            this.render();
            if (this.isCleared()) window.app.showNotification(`清空！步数${this.moves}`,'success');
        } else {
            this.selected = {x,y};
            this.render();
        }
    }

    drawConnection(a,b) {
        const overlay = document.getElementById('link-overlay');
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0,0,overlay.width,overlay.height);
        
        // 根据屏幕尺寸调整连接线位置
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        let cellSize, gap;
        if (isSmallMobile) {
            cellSize = 60;
            gap = 4;
        } else if (isMobile) {
            cellSize = 70;
            gap = 6;
        } else {
            cellSize = 90;
            gap = 8;
        }
        
        const cell = (p)=>({ x:(p.x-1)*(cellSize+gap)+cellSize/2, y:(p.y-1)*(cellSize+gap)+cellSize/2 });
        ctx.strokeStyle = '#3b82f6'; 
        ctx.lineWidth = isMobile ? 3 : 4; 
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const A = cell(a), B = cell(b);
        ctx.moveTo(A.x, A.y);
        // 简化：按直线或单折画，双折情况下只画直线到B（保持简洁）
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        setTimeout(()=>ctx.clearRect(0,0,overlay.width,overlay.height), 280);
    }

    findHint() {
        for (let y1=1;y1<=this.size;y1++) for (let x1=1;x1<=this.size;x1++) if (this.grid[y1][x1]) {
            for (let y2=1;y2<=this.size;y2++) for (let x2=1;x2<=this.size;x2++) if (this.grid[y2][x2]) {
                if (x1===x2 && y1===y2) continue;
                if (this.grid[y1][x1]===this.grid[y2][x2] && this.canConnect({x:x1,y:y1},{x:x2,y:y2})) {
                    return [{x:x1,y:y1},{x:x2,y:y2}];
                }
            }
        }
        return null;
    }

    canConnect(a,b) {
        // 最多两次拐弯：即 0、1、2 转角
        const passable = (x,y)=> this.grid[y][x]===null || (x===a.x&&y===a.y) || (x===b.x&&y===b.y);
        // 直线
        if (this.clearLine(a.x,a.y,b.x,b.y,passable)) return true;
        // 一折
        const p1 = {x:a.x,y:b.y};
        const p2 = {x:b.x,y:a.y};
        if (passable(p1.x,p1.y) && this.clearLine(a.x,a.y,p1.x,p1.y,passable) && this.clearLine(p1.x,p1.y,b.x,b.y,passable)) return true;
        if (passable(p2.x,p2.y) && this.clearLine(a.x,a.y,p2.x,p2.y,passable) && this.clearLine(p2.x,p2.y,b.x,b.y,passable)) return true;
        // 两折：从 a 向四周扩散到空点，再到 b
        for (let x=0;x<this.size+2;x++) {
            const pA = {x, y:a.y};
            const pB = {x, y:b.y};
            if (passable(pA.x,pA.y) && this.clearLine(a.x,a.y,pA.x,pA.y,passable) && this.clearLine(pA.x,pA.y,b.x,b.y,passable)) return true;
            if (passable(pB.x,pB.y) && this.clearLine(a.x,a.y,pB.x,pB.y,passable) && this.clearLine(pB.x,pB.y,b.x,b.y,passable)) return true;
        }
        for (let y=0;y<this.size+2;y++) {
            const pA = {x:a.x, y};
            const pB = {x:b.x, y};
            if (passable(pA.x,pA.y) && this.clearLine(a.x,a.y,pA.x,pA.y,passable) && this.clearLine(pA.x,pA.y,b.x,b.y,passable)) return true;
            if (passable(pB.x,pB.y) && this.clearLine(a.x,a.y,pB.x,pB.y,passable) && this.clearLine(pB.x,pB.y,b.x,b.y,passable)) return true;
        }
        return false;
    }

    clearLine(x1,y1,x2,y2,passable) {
        if (x1===x2) {
            const [a,b] = y1<y2 ? [y1,y2] : [y2,y1];
            for (let y=a+1; y<b; y++) if (!passable(x1,y)) return false;
            return true;
        }
        if (y1===y2) {
            const [a,b] = x1<x2 ? [x1,x2] : [x2,x1];
            for (let x=a+1; x<b; x++) if (!passable(x,y1)) return false;
            return true;
        }
        return false;
    }

    isCleared() {
        for (let y=1;y<=this.size;y++) for (let x=1;x<=this.size;x++) if (this.grid[y][x]) return false; return true;
    }

    updateHeader() {
        const movesEl = document.getElementById('link-moves');
        if (movesEl) movesEl.textContent = this.moves;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.startTime = Date.now();
        this.timer = setInterval(()=>{
            const elapsed = Math.floor((Date.now()-this.startTime)/1000);
            const m = Math.floor(elapsed/60).toString().padStart(2,'0');
            const s = (elapsed%60).toString().padStart(2,'0');
            const el = document.getElementById('link-time');
            if (el) el.textContent = `${m}:${s}`;
        },1000);
    }

    destroy() { 
        if (this.timer) clearInterval(this.timer); 
        if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    }
}

// 雷霆战机游戏类
class ShooterGame {
    constructor() {
        this.canvas = null; this.ctx = null;
        this.isRunning = false;
        this.isPaused = false;
        this.player = { x: 180, y: 540, w: 32, h: 32 };
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.score = 0; 
        this.bestScore = 0;
        this.lives = 3;
        this.level = 1;
        this.power = 1;
        this.startTime = null;
        this.timer = null;
        this.spawnInterval = 900; 
        this.bulletInterval = 250; 
        this.speed = 2.2;
        this.lastSpawn = 0; 
        this.lastShot = 0; 
        this.loop = null;
        this.handleKey = this.onKeyDown.bind(this); 
        this.handleKeyUp = this.onKeyUp.bind(this);
        this.keys = {}; 
        this.mouseMove = this.onMouseMove.bind(this);
        this.difficulty = 'normal';
        this.boss = null;
        this.bossSpawned = false;
    }

    init() {
        this.loadBestScore();
        this.setupDifficulty();
        this.setupEventListeners();
        this.updateHUD();
        this.draw();
    }

    setupDifficulty() {
        const sel = document.getElementById('shooter-difficulty');
        if (sel) {
            sel.addEventListener('change', () => {
                this.difficulty = sel.value;
                this.updateDifficulty();
            });
        }
        this.updateDifficulty();
    }

    updateDifficulty() {
        const difficulties = {
            easy: { spawnInterval: 1100, speed: 2.0, bulletInterval: 300 },
            normal: { spawnInterval: 900, speed: 2.2, bulletInterval: 250 },
            hard: { spawnInterval: 700, speed: 2.8, bulletInterval: 200 },
            expert: { spawnInterval: 500, speed: 3.5, bulletInterval: 150 }
        };
        
        const settings = difficulties[this.difficulty] || difficulties.normal;
        this.spawnInterval = settings.spawnInterval;
        this.speed = settings.speed;
        this.bulletInterval = settings.bulletInterval;
    }

    setupEventListeners() {
        document.getElementById('shooter-start-btn').addEventListener('click', () => {
            if (this.isRunning && !this.isPaused) {
                this.pause();
            } else if (this.isPaused) {
                this.resume();
            } else {
                this.start();
            }
        });

        document.getElementById('shooter-pause-btn').addEventListener('click', () => {
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        });

        document.getElementById('shooter-end-btn').addEventListener('click', () => {
            this.gameOver();
        });

        document.addEventListener('keydown', this.handleKey);
        document.addEventListener('keyup', this.handleKeyUp);
        
        // 确保canvas存在后再添加鼠标事件监听器
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', this.mouseMove);
        }
    }

    start() { 
        if (this.isRunning && !this.isPaused) return;
        
        if (this.isPaused) {
            this.resume();
            return;
        }
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.power = 1;
        this.bossSpawned = false;
        this.boss = null;
        
        // 重新加载最高分
        this.loadBestScore();
        this.powerUps = [];
        this.particles = [];
        
        document.getElementById('shooter-start-btn').textContent = '暂停';
        document.getElementById('shooter-pause-btn').disabled = false;
        document.getElementById('shooter-pause-btn').textContent = '暂停';
        document.getElementById('shooter-pause-btn').classList.remove('btn-success');
        document.getElementById('shooter-pause-btn').classList.add('btn-warning');
        document.getElementById('shooter-score').textContent = '0';
        document.getElementById('shooter-lives').textContent = '3';
        document.getElementById('shooter-level').textContent = '1';
        document.getElementById('shooter-power').textContent = '1';
        document.getElementById('shooter-time').textContent = '00:00';
        
        this.startTimer();
        this.loop = setInterval(() => this.tick(), 16);
    }

    pause() { 
        if (!this.isRunning) return;
        
        this.isPaused = true;
        clearInterval(this.loop);
        clearInterval(this.timer);
        
        document.getElementById('shooter-start-btn').textContent = '继续';
        document.getElementById('shooter-pause-btn').textContent = '继续';
        document.getElementById('shooter-pause-btn').classList.remove('btn-warning');
        document.getElementById('shooter-pause-btn').classList.add('btn-success');
    }

    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.isRunning = true;
        this.startTimer();
        this.loop = setInterval(() => this.tick(), 16);
        
        document.getElementById('shooter-start-btn').textContent = '暂停';
        document.getElementById('shooter-pause-btn').textContent = '暂停';
        document.getElementById('shooter-pause-btn').classList.remove('btn-success');
        document.getElementById('shooter-pause-btn').classList.add('btn-warning');
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isRunning || this.isPaused) return;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('shooter-time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.loop);
        clearInterval(this.timer);
        
        this.player = { x: 180, y: 540, w: 32, h: 32 };
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.power = 1;
        this.bossSpawned = false;
        this.boss = null;
        
        // 重新加载最高分
        this.loadBestScore();
        
        document.getElementById('shooter-start-btn').textContent = '开始游戏';
        document.getElementById('shooter-pause-btn').textContent = '暂停';
        document.getElementById('shooter-pause-btn').disabled = true;
        document.getElementById('shooter-pause-btn').classList.remove('btn-success');
        document.getElementById('shooter-pause-btn').classList.add('btn-warning');
        document.getElementById('shooter-score').textContent = '0';
        document.getElementById('shooter-lives').textContent = '3';
        document.getElementById('shooter-level').textContent = '1';
        document.getElementById('shooter-power').textContent = '1';
        document.getElementById('shooter-time').textContent = '00:00';
        document.getElementById('shooter-game-over').style.display = 'none';
        
        this.updateHUD();
        this.draw();
    }

    tick() {
        if (!this.isRunning || this.isPaused) return;
        
        // input
        if (this.keys['ArrowLeft']) this.player.x -= 4;
        if (this.keys['ArrowRight']) this.player.x += 4;
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.w, this.player.x));
        
        // shooting
        const now = Date.now();
        if (this.keys[' '] && now - this.lastShot > this.bulletInterval) { 
            this.shoot(); 
            this.lastShot = now; 
        }
        
        // power-up usage
        if (this.keys['c'] || this.keys['C']) {
            this.usePowerUp();
        }
        
        // spawn enemies
        if (now - this.lastSpawn > this.spawnInterval) { 
            this.spawnEnemy(); 
            this.lastSpawn = now; 
        }
        
        // spawn boss
        if (this.score > 0 && this.score % 1000 === 0 && !this.bossSpawned) {
            this.spawnBoss();
        }
        
        // update bullets
        this.bullets.forEach(b => b.y -= 6);
        this.bullets = this.bullets.filter(b => b.y + b.h > 0);
        
        // update enemies
        this.enemies.forEach(e => e.y += this.speed);
        
        // update boss
        if (this.boss) {
            this.updateBoss();
        }
        
        // update power-ups
        this.powerUps.forEach(p => p.y += 2);
        this.powerUps = this.powerUps.filter(p => p.y < this.canvas.height);
        
        // update particles
        this.updateParticles();
        
        // collisions
        this.handleCollisions();
        
        // level up
        this.checkLevelUp();
        
        // draw
        this.draw();
    }

    shoot() { 
        // 限制子弹数量，避免性能问题
        const maxBullets = 50;
        if (this.bullets.length > maxBullets) {
            this.bullets = this.bullets.slice(-maxBullets);
        }
        
        if (this.power === 1) {
            this.bullets.push({ x: this.player.x + this.player.w/2 - 2, y: this.player.y, w: 4, h: 10, type: 'normal' });
        } else if (this.power === 2) {
            this.bullets.push({ x: this.player.x + this.player.w/2 - 2, y: this.player.y, w: 4, h: 10, type: 'normal' });
            this.bullets.push({ x: this.player.x + this.player.w/2 - 6, y: this.player.y, w: 4, h: 10, type: 'normal' });
            this.bullets.push({ x: this.player.x + this.player.w/2 + 2, y: this.player.y, w: 4, h: 10, type: 'normal' });
        } else if (this.power >= 3) {
            this.bullets.push({ x: this.player.x + this.player.w/2 - 2, y: this.player.y, w: 6, h: 12, type: 'power' });
            this.bullets.push({ x: this.player.x + this.player.w/2 - 8, y: this.player.y, w: 4, h: 10, type: 'normal' });
            this.bullets.push({ x: this.player.x + this.player.w/2 + 4, y: this.player.y, w: 4, h: 10, type: 'normal' });
        }
    }
    
    spawnEnemy() { 
        const x = Math.random() * (this.canvas.width - 28); 
        this.enemies.push({ x, y: -30, w: 28, h: 28, health: 1, type: 'normal' }); 
    }
    
    spawnBoss() {
        this.boss = {
            x: this.canvas.width / 2 - 50,
            y: -100,
            w: 100,
            h: 80,
            health: 50,
            maxHealth: 50,
            type: 'boss',
            direction: 1,
            lastShot: 0
        };
        this.bossSpawned = true;
    }
    
    updateBoss() {
        if (!this.boss) return;
        
        // Boss movement
        this.boss.x += this.boss.direction * 2;
        if (this.boss.x <= 0 || this.boss.x >= this.canvas.width - this.boss.w) {
            this.boss.direction *= -1;
        }
        
        // Boss shooting
        const now = Date.now();
        if (now - this.boss.lastShot > 1000) {
            this.bossShoot();
            this.boss.lastShot = now;
        }
        
        // Boss health bar
        this.drawBossHealth();
    }
    
    bossShoot() {
        if (!this.boss) return;
        
        // Multiple bullet pattern
        for (let i = -2; i <= 2; i++) {
            this.bullets.push({
                x: this.boss.x + this.boss.w/2 + i * 15,
                y: this.boss.y + this.boss.h,
                w: 4,
                h: 10,
                type: 'enemy',
                vx: i * 0.5,
                vy: 3
            });
        }
    }
    
    usePowerUp() {
        if (this.power < 5) {
            this.power++;
            this.updateHUD();
            this.createParticles(this.player.x + this.player.w/2, this.player.y, '#00ff00', 10);
        }
    }
    
    spawnPowerUp(x, y) {
        const types = ['power', 'life', 'score'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push({ x, y, w: 20, h: 20, type });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    createParticles(x, y, color, count) {
        // 限制粒子数量，避免性能问题
        const maxParticles = 100;
        if (this.particles.length > maxParticles) {
            this.particles = this.particles.slice(-maxParticles);
        }
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 30,
                color: color
            });
        }
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.updateHUD();
            this.createParticles(this.canvas.width / 2, this.canvas.height / 2, '#ffff00', 20);
        }
    }

    handleCollisions() {
        let hudNeedsUpdate = false;
        
        // bullet vs enemy - 优化版本
        this.enemies = this.enemies.filter(e => {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const b = this.bullets[i];
                if (b.type === 'normal' || b.type === 'power') {
                    if (this.rectOverlap(b, e)) { 
                        this.bullets.splice(i, 1); 
                        this.score += 10; 
                        this.createParticles(e.x + e.w/2, e.y + e.h/2, '#ff0000', 5);
                        
                        // Chance to spawn power-up
                        if (Math.random() < 0.1) {
                            this.spawnPowerUp(e.x + e.w/2, e.y + e.h/2);
                        }
                        
                        hudNeedsUpdate = true;
                        return false; 
                    }
                }
            }
            return true;
        });
        
        // bullet vs boss
        if (this.boss) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const b = this.bullets[i];
                if (b.type === 'normal' || b.type === 'power') {
                    if (this.rectOverlap(b, this.boss)) {
                        this.bullets.splice(i, 1);
                        this.boss.health--;
                        this.createParticles(b.x, b.y, '#ff0000', 3);
                        
                        if (this.boss.health <= 0) {
                            this.score += 500;
                            this.createParticles(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, '#ffff00', 20);
                            this.boss = null;
                            this.bossSpawned = false;
                        }
                        hudNeedsUpdate = true;
                    }
                }
            }
        }
        
        // enemy bullet vs player
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            if (b.type === 'enemy' && this.rectOverlap(b, this.player)) {
                this.bullets.splice(i, 1);
                this.lives--;
                this.createParticles(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#ff0000', 10);
                hudNeedsUpdate = true;
                if (this.lives <= 0) {
                    this.gameOver();
                    break;
                }
            }
        }
        
        // enemy vs player / bottom
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (this.rectOverlap(e, this.player) || e.y > this.canvas.height) {
                this.enemies.splice(i, 1);
                if (this.rectOverlap(e, this.player)) {
                    this.lives--;
                    this.createParticles(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#ff0000', 10);
                    hudNeedsUpdate = true;
                    if (this.lives <= 0) {
                        this.gameOver();
                        break;
                    }
                }
            }
        }
        
        // power-up vs player
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const p = this.powerUps[i];
            if (this.rectOverlap(p, this.player)) {
                this.powerUps.splice(i, 1);
                this.collectPowerUp(p);
                hudNeedsUpdate = true;
            }
        }
        
        // 只在需要时更新HUD
        if (hudNeedsUpdate) {
            this.updateHUD();
        }
    }
    
    collectPowerUp(powerUp) {
        switch (powerUp.type) {
            case 'power':
                this.power = Math.min(5, this.power + 1);
                this.createParticles(powerUp.x, powerUp.y, '#00ff00', 8);
                break;
            case 'life':
                this.lives++;
                this.createParticles(powerUp.x, powerUp.y, '#ff00ff', 8);
                break;
            case 'score':
                this.score += 100;
                this.createParticles(powerUp.x, powerUp.y, '#ffff00', 8);
                break;
        }
        this.updateHUD();
    }
    
    gameOver() {
        this.pause();
        
        // Show game over screen
        const gameOverScreen = document.getElementById('shooter-game-over');
        const finalScore = document.getElementById('final-shooter-score');
        const finalLevel = document.getElementById('final-shooter-level');
        const finalTime = document.getElementById('final-shooter-time');
        
        if (gameOverScreen && finalScore && finalLevel && finalTime) {
            finalScore.textContent = this.score;
            finalLevel.textContent = this.level;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            gameOverScreen.style.display = 'block';
        }
        
        // 检查并更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
            this.updateHUD(); // 更新UI显示新的最高分
            window.app.showNotification(`新纪录！得分：${this.score}`, 'success');
        } else {
            window.app.showNotification(`游戏结束！得分：${this.score}`, 'warning');
        }
    }

    rectOverlap(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }

    draw(){
        const ctx=this.ctx; ctx.fillStyle='#0b1b2b'; ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        // 星轨背景
        const t=Date.now()/1000; ctx.save();
        for(let layer=0; layer<3; layer++){
            const speed = (layer+1)*0.5; const alpha = 0.25 + layer*0.15;
            ctx.fillStyle=`rgba(255,255,255,${alpha})`;
            for(let i=0;i<30;i++){
                const x=(i*97 + t*60*speed)%this.canvas.width; const y=(i*59 + t*40*speed)%this.canvas.height;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        ctx.restore();
        
        // 玩家
        this.drawPlayer(ctx, this.player.x, this.player.y, this.player.w, this.player.h);
        
        // 子弹
        this.bullets.forEach(b => this.drawBullet(ctx, b));
        
        // 敌机
        this.enemies.forEach(e => this.drawEnemy(ctx, e));
        
        // Boss
        if (this.boss) {
            this.drawBoss(ctx, this.boss);
        }
        
        // 道具
        this.powerUps.forEach(p => this.drawPowerUp(ctx, p));
        
        // 粒子效果
        this.particles.forEach(p => this.drawParticle(ctx, p));
    }

    drawPlayer(ctx, x, y, w, h){
        ctx.save();
        // 机身
        const grad = ctx.createLinearGradient(x, y, x, y+h);
        grad.addColorStop(0,'#7CFC9B'); grad.addColorStop(1,'#2E7D32');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x + w/2, y);              // 机头
        ctx.lineTo(x + w, y + h*0.75);       // 右尾
        ctx.lineTo(x + w*0.75, y + h);       // 右翼
        ctx.lineTo(x + w*0.25, y + h);       // 左翼
        ctx.lineTo(x, y + h*0.75);           // 左尾
        ctx.closePath(); ctx.fill();
        // 驾舱
        ctx.fillStyle='rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.ellipse(x+w/2, y+h*0.4, w*0.18, h*0.14, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }

    drawBullet(ctx, b){
        ctx.save();
        if (b.type === 'enemy') {
            ctx.shadowBlur = 6; ctx.shadowColor = '#FF5722';
            const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y+b.h);
            grad.addColorStop(0,'#FF8A65'); grad.addColorStop(1,'#D32F2F');
            ctx.fillStyle = grad; ctx.fillRect(b.x, b.y, b.w, b.h);
        } else if (b.type === 'power') {
            ctx.shadowBlur = 10; ctx.shadowColor = '#00E676';
            const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y+b.h);
            grad.addColorStop(0,'#69F0AE'); grad.addColorStop(1,'#00C853');
            ctx.fillStyle = grad; ctx.fillRect(b.x, b.y, b.w, b.h);
        } else {
        ctx.shadowBlur = 8; ctx.shadowColor = '#FFEB3B';
        const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y+b.h);
        grad.addColorStop(0,'#FFF59D'); grad.addColorStop(1,'#FFC107');
        ctx.fillStyle = grad; ctx.fillRect(b.x, b.y, b.w, b.h);
        }
        ctx.restore();
    }
    
    drawBoss(ctx, boss) {
        ctx.save();
        // Boss body
        const grad = ctx.createLinearGradient(boss.x, boss.y, boss.x, boss.y + boss.h);
        grad.addColorStop(0, '#E91E63');
        grad.addColorStop(1, '#C2185B');
        ctx.fillStyle = grad;
        ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
        
        // Boss details
        ctx.fillStyle = '#FF1744';
        ctx.fillRect(boss.x + 10, boss.y + 10, boss.w - 20, 10);
        ctx.fillRect(boss.x + 10, boss.y + boss.h - 20, boss.w - 20, 10);
        
        // Boss eyes
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(boss.x + 20, boss.y + 20, 8, 8);
        ctx.fillRect(boss.x + boss.w - 28, boss.y + 20, 8, 8);
        
        ctx.restore();
    }
    
    drawPowerUp(ctx, p) {
        ctx.save();
        ctx.shadowBlur = 6;
        
        switch (p.type) {
            case 'power':
                ctx.shadowColor = '#00E676';
                ctx.fillStyle = '#00E676';
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('P', p.x + p.w/2, p.y + p.h/2 + 4);
                break;
            case 'life':
                ctx.shadowColor = '#E91E63';
                ctx.fillStyle = '#E91E63';
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('L', p.x + p.w/2, p.y + p.h/2 + 4);
                break;
            case 'score':
                ctx.shadowColor = '#FFD700';
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#000000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('S', p.x + p.w/2, p.y + p.h/2 + 4);
                break;
        }
        
        ctx.restore();
    }
    
    drawParticle(ctx, p) {
        ctx.save();
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        ctx.restore();
    }
    
    drawBossHealth() {
        if (!this.boss) return;
        
        const ctx = this.ctx;
        const barWidth = 200;
        const barHeight = 10;
        const x = this.canvas.width / 2 - barWidth / 2;
        const y = 20;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health bar
        const healthPercent = this.boss.health / this.boss.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    drawEnemy(ctx, e){
        ctx.save();
        const grad = ctx.createLinearGradient(e.x, e.y, e.x, e.y+e.h);
        grad.addColorStop(0,'#FF8A80'); grad.addColorStop(1,'#C62828');
        ctx.fillStyle = grad;
        // 菱形敌机
        ctx.beginPath();
        ctx.moveTo(e.x + e.w/2, e.y);
        ctx.lineTo(e.x + e.w, e.y + e.h/2);
        ctx.lineTo(e.x + e.w/2, e.y + e.h);
        ctx.lineTo(e.x, e.y + e.h/2);
        ctx.closePath(); ctx.fill();
        // 眼睛/亮点
        ctx.fillStyle='rgba(255,255,255,0.8)';
        ctx.beginPath(); ctx.arc(e.x+e.w/2, e.y+e.h/2, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }

    updateHUD(){
        const s=document.getElementById('shooter-score'); if(s) s.textContent=this.score;
        const b=document.getElementById('shooter-best'); if(b) b.textContent=this.bestScore;
        const l=document.getElementById('shooter-lives'); if(l) l.textContent=this.lives;
        const level=document.getElementById('shooter-level'); if(level) level.textContent=this.level;
        const power=document.getElementById('shooter-power'); if(power) power.textContent=this.power;
    }

    onKeyDown(e){ 
        // 只在游戏模态框打开时响应键盘事件
        if (!window.app || !window.app.currentModal) return;
        if (!this.isRunning || this.isPaused) return;
        
        // 阻止默认行为，防止空格键滚动页面
        if (e.key === ' ') {
            e.preventDefault();
        }
        
        this.keys[e.key]=true;
    }
    onKeyUp(e){ 
        // 只在游戏模态框打开时响应键盘事件
        if (!window.app || !window.app.currentModal) return;
        if (!this.isRunning || this.isPaused) return;
        
        // 阻止默认行为，防止空格键滚动页面
        if (e.key === ' ') {
            e.preventDefault();
        }
        
        this.keys[e.key]=false; 
    }
    onMouseMove(e){ const rect=this.canvas.getBoundingClientRect(); const x=e.clientX-rect.left; this.player.x = x - this.player.w/2; }

    loadBestScore() {
        this.bestScore = window.app.loadData('shooter_best', 0);
    }

    saveBestScore() {
        window.app.saveData('shooter_best', this.bestScore);
    }

    destroy(){ this.pause(); document.removeEventListener('keydown', this.handleKey); document.removeEventListener('keyup', this.handleKeyUp); this.canvas.removeEventListener('mousemove', this.mouseMove); }
}

// 贪吃蛇游戏类
class SnakeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.bestScore = 0;
        this.gameLoop = null;
        this.isRunning = false;
        this.gridSize = 20;
        this.canvasSize = 400;
        this.tickMs = 150;
        this.startTime = null;
        this.timer = null;
        this.speed = 5;
        this.specialFood = null;
        this.specialFoodTimer = 0;
        this.particles = [];
        this.keysPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.baseTickMs = 150;
        
        // 帧率控制
        this.lastMoveTime = 0;
        this.animationFrame = null;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
    }

    init() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        // 加载最高分
        this.bestScore = window.app.loadData('snake_best', 0) || 0;
        const bestEl = document.getElementById('snake-best');
        if (bestEl) bestEl.textContent = this.bestScore;
        
        // 绑定难度和速度控制
        this.setupControls();
        this.setupEventListeners();
    }

    setupControls() {
        const speedSlider = document.getElementById('snake-speed-slider');
        const speedDisplay = document.getElementById('snake-speed-display');
        
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', () => {
                this.speed = parseInt(speedSlider.value);
                speedDisplay.textContent = this.speed;
                this.updateSpeed();
            });
        }
    }

    updateSpeed() {
        // 基础速度150ms，速度值1-10对应200ms-50ms
        const baseSpeed = 150;
        const speedMultiplier = this.speed / 5; // 1-10 scale to 0.2-2.0 multiplier
        this.baseTickMs = Math.max(50, baseSpeed / speedMultiplier);
        
        // 检查是否有方向键被按住，如果有则速度加倍
        const isKeyPressed = this.keysPressed.up || this.keysPressed.down || 
                           this.keysPressed.left || this.keysPressed.right;
        this.tickMs = isKeyPressed ? this.baseTickMs / 2 : this.baseTickMs;
    }
    
    // 新的游戏循环，使用 requestAnimationFrame
    gameLoopRAF(currentTime) {
        if (!this.isRunning) return;
        
        // 帧率控制
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            this.animationFrame = requestAnimationFrame((time) => this.gameLoopRAF(time));
            return;
        }
        
        this.lastFrameTime = currentTime;
        
        // 检查是否需要移动蛇
        if (currentTime - this.lastMoveTime >= this.tickMs) {
            this.update();
            this.lastMoveTime = currentTime;
        }
        
        // 每帧都重绘（提高流畅度）
        this.draw();
        
        this.animationFrame = requestAnimationFrame((time) => this.gameLoopRAF(time));
    }

    start() {
        if (this.isRunning) return;
        
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.startTime = Date.now();
        this.specialFood = null;
        this.specialFoodTimer = 0;
        this.particles = [];
        this.generateFood();
        this.isRunning = true;
        
        // 重置按键状态
        this.keysPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        document.getElementById('snake-start-btn').textContent = '游戏中...';
        document.getElementById('snake-score').textContent = '0';
        document.getElementById('snake-length').textContent = '1';
        document.getElementById('snake-speed').textContent = this.speed;
        
        this.startTimer();
        this.updateSpeed();
        
        // 启动新的游戏循环
        this.lastMoveTime = 0;
        this.lastFrameTime = 0;
        this.animationFrame = requestAnimationFrame((time) => this.gameLoopRAF(time));
    }



    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isRunning) return;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('snake-time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.isRunning = false;
        document.getElementById('snake-start-btn').textContent = '继续';
    }

    update() {
        // 检查按键状态并更新速度
        this.updateSpeed();
        
        // 更新方向
        this.direction = this.nextDirection;
        
        const head = {...this.snake[0]};
        
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }
        
        // 检查是否吃到特殊食物
        if (this.specialFood && head.x === this.specialFood.x && head.y === this.specialFood.y) {
            this.eatSpecialFood();
        }
        
        // 更新特殊食物
        if (this.specialFood) {
            this.specialFoodTimer--;
            if (this.specialFoodTimer <= 0) {
                this.specialFood = null;
            }
        }
        
        // 更新粒子效果
        this.updateParticles();
    }

    eatFood() {
        const baseScore = 10;
        const lengthBonus = Math.floor(this.snake.length / 5) * 5; // 每5节额外5分
        const speedBonus = Math.floor(this.speed / 2) * 2; // 速度越快奖励越多
        const scoreGained = baseScore + lengthBonus + speedBonus;
        
        this.score += scoreGained;
            document.getElementById('snake-score').textContent = this.score;
            document.getElementById('snake-length').textContent = this.snake.length;
        
        
        this.generateFood();
        
        // 检查是否生成特殊食物
        if (Math.random() < 0.3 && !this.specialFood) {
            this.generateSpecialFood();
        }
        
            // 撞击提示：轻微闪烁
            this.flashCanvas();
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                window.app.saveData('snake_best', this.bestScore);
                const bestEl = document.getElementById('snake-best');
                if (bestEl) bestEl.textContent = this.bestScore;
            }
    }

    eatSpecialFood() {
        this.score += 50; // 特殊食物高分
        this.specialFood = null;
        this.specialFoodTimer = 0;
        document.getElementById('snake-score').textContent = this.score;
    }

    generateSpecialFood() {
        do {
            this.specialFood = {
                x: Math.floor(Math.random() * (this.canvasSize / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvasSize / this.gridSize))
            };
        } while (this.snake.some(segment => segment.x === this.specialFood.x && segment.y === this.specialFood.y) ||
                 (this.food.x === this.specialFood.x && this.food.y === this.specialFood.y));
        
        this.specialFoodTimer = 300; // 5秒后消失
    }


    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }

    drawSnakeHead(centerX, centerY, radius) {
        // 蛇头主体 - 绿色渐变
        const gradient = this.ctx.createRadialGradient(centerX - radius/3, centerY - radius/3, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#66BB6A');
        gradient.addColorStop(0.7, '#4CAF50');
        gradient.addColorStop(1, '#2E7D32');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 蛇头边框
        this.ctx.strokeStyle = '#1B5E20';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // 根据方向绘制眼睛
        const eyeSize = radius * 0.15;
        const eyeOffset = radius * 0.3;
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        
        if (this.direction === 'right') {
            // 向右看
            this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset, centerY + eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 眼珠
            this.ctx.fillStyle = '#000000';
            this.ctx.arc(centerX + eyeOffset + 2, centerY - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset + 2, centerY + eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction === 'left') {
            // 向左看
            this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX - eyeOffset, centerY + eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 眼珠
            this.ctx.fillStyle = '#000000';
            this.ctx.arc(centerX - eyeOffset - 2, centerY - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX - eyeOffset - 2, centerY + eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction === 'up') {
            // 向上看
            this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 眼珠
            this.ctx.fillStyle = '#000000';
            this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset - 2, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset - 2, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction === 'down') {
            // 向下看
            this.ctx.arc(centerX - eyeOffset, centerY + eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset, centerY + eyeOffset, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 眼珠
            this.ctx.fillStyle = '#000000';
            this.ctx.arc(centerX - eyeOffset, centerY + eyeOffset + 2, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.arc(centerX + eyeOffset, centerY + eyeOffset + 2, eyeSize * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawSnakeBody(centerX, centerY, radius, index) {
        // 蛇身主体 - 绿色渐变
        const gradient = this.ctx.createRadialGradient(centerX - radius/4, centerY - radius/4, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#81C784');
        gradient.addColorStop(0.6, '#66BB6A');
        gradient.addColorStop(1, '#4CAF50');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 蛇身边框
        this.ctx.strokeStyle = '#388E3C';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // 绘制鳞片纹理
        this.ctx.strokeStyle = '#2E7D32';
        this.ctx.lineWidth = 0.5;
        
        // 绘制鳞片线条
        const scaleSize = radius * 0.3;
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const x1 = centerX + Math.cos(angle) * scaleSize;
            const y1 = centerY + Math.sin(angle) * scaleSize;
            const x2 = centerX + Math.cos(angle) * (radius - 2);
            const y2 = centerY + Math.sin(angle) * (radius - 2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        // 中心小圆点
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw() {
        // 使用双缓冲提高渲染性能
        this.ctx.save();
        
        // 清空画布
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // 背景网格（优化绘制）
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        this.ctx.lineWidth = 1;
            this.ctx.beginPath();
        
        // 批量绘制网格线
        for (let x = 0; x <= this.canvasSize; x += this.gridSize) {
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, this.canvasSize);
        }
        for (let y = 0; y <= this.canvasSize; y += this.gridSize) {
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(this.canvasSize, y + 0.5);
        }
        this.ctx.stroke();
        this.ctx.restore();
        
        // 绘制蛇（小蛇样式）- 添加平滑动画
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            const centerX = x + this.gridSize / 2;
            const centerY = y + this.gridSize / 2;
            const radius = this.gridSize / 2 - 1;

            this.ctx.save();
            
            // 添加轻微的动画效果
            if (index === 0) {
                // 蛇头 - 添加呼吸效果
                const breatheScale = 1 + 0.05 * Math.sin(Date.now() * 0.005);
                this.ctx.scale(breatheScale, breatheScale);
                this.ctx.translate(centerX * (1 - breatheScale), centerY * (1 - breatheScale));
                this.drawSnakeHead(centerX, centerY, radius);
            } else {
                // 蛇身 - 绘制鳞片纹理
                this.drawSnakeBody(centerX, centerY, radius, index);
            }
            
            this.ctx.restore();
        });
        
        // 绘制食物（脉冲与高光）- 添加流畅动画
        const fx = this.food.x * this.gridSize + 1;
        const fy = this.food.y * this.gridSize + 1;
        const fw = this.gridSize - 2;
        const fh = this.gridSize - 2;
        
        // 添加脉冲效果
        const pulseScale = 1 + 0.1 * Math.sin(Date.now() * 0.008);
        const centerX = fx + fw / 2;
        const centerY = fy + fh / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(pulseScale, pulseScale);
        this.ctx.translate(-centerX, -centerY);
        
        const foodGrad = this.ctx.createLinearGradient(fx, fy, fx, fy + fh);
        foodGrad.addColorStop(0, '#FF7043');
        foodGrad.addColorStop(1, '#F44336');
        this.ctx.fillStyle = foodGrad;
        const fr = Math.min(6, this.gridSize / 3);
        this.ctx.beginPath();
        this.ctx.moveTo(fx + fr, fy);
        this.ctx.lineTo(fx + fw - fr, fy);
        this.ctx.quadraticCurveTo(fx + fw, fy, fx + fw, fy + fr);
        this.ctx.lineTo(fx + fw, fy + fh - fr);
        this.ctx.quadraticCurveTo(fx + fw, fy + fh, fx + fw - fr, fy + fh);
        this.ctx.lineTo(fx + fr, fy + fh);
        this.ctx.quadraticCurveTo(fx, fy + fh, fx, fy + fh - fr);
        this.ctx.lineTo(fx, fy + fr);
        this.ctx.quadraticCurveTo(fx, fy, fx + fr, fy);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        
        // 绘制特殊食物
        if (this.specialFood) {
            const sfx = this.specialFood.x * this.gridSize + 1;
            const sfy = this.specialFood.y * this.gridSize + 1;
            const sfw = this.gridSize - 2;
            const sfh = this.gridSize - 2;
            
            // 闪烁效果
            const alpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.01);
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            const specialGrad = this.ctx.createLinearGradient(sfx, sfy, sfx, sfy + sfh);
            specialGrad.addColorStop(0, '#FFD700');
            specialGrad.addColorStop(1, '#FFA000');
            this.ctx.fillStyle = specialGrad;
            
            const sfr = Math.min(6, this.gridSize / 3);
            this.ctx.beginPath();
            this.ctx.moveTo(sfx + sfr, sfy);
            this.ctx.lineTo(sfx + sfw - sfr, sfy);
            this.ctx.quadraticCurveTo(sfx + sfw, sfy, sfx + sfw, sfy + sfr);
            this.ctx.lineTo(sfx + sfw, sfy + sfh - sfr);
            this.ctx.quadraticCurveTo(sfx + sfw, sfy + sfh, sfx + sfw - sfr, sfy + sfh);
            this.ctx.lineTo(sfx + sfr, sfy + sfh);
            this.ctx.quadraticCurveTo(sfx, sfy + sfh, sfx, sfy + sfh - sfr);
            this.ctx.lineTo(sfx, sfy + sfr);
            this.ctx.quadraticCurveTo(sfx, sfy, sfx + sfr, sfy);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 绘制星星
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('★', sfx + sfw/2, sfy + sfh/2 + 4);
            
            this.ctx.restore();
        }
        

        // 食物高光
        this.ctx.fillStyle = 'rgba(255,255,255,0.35)';
        this.ctx.beginPath();
        this.ctx.ellipse(fx + fw * 0.35, fy + fh * 0.3, fw * 0.18, fh * 0.12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 恢复画布状态
        this.ctx.restore();
    }

    flashCanvas() {
        const canvas = this.canvas;
        if (!canvas) return;
        canvas.style.boxShadow = '0 0 0 2px rgba(76,175,80,0.6) inset';
        setTimeout(() => {
            canvas.style.boxShadow = '';
        }, 120);
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * (this.canvasSize / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvasSize / this.gridSize))
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.canvasSize / this.gridSize ||
            head.y < 0 || head.y >= this.canvasSize / this.gridSize) {
            return true;
        }
        
        // 检查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    gameOver() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        clearInterval(this.timer);
        this.isRunning = false;
        
        // 显示游戏结束界面
        const gameOverScreen = document.getElementById('snake-game-over');
        const finalScore = document.getElementById('final-score');
        const finalLength = document.getElementById('final-length');
        const finalTime = document.getElementById('final-time');
        
        if (gameOverScreen && finalScore && finalLength && finalTime) {
            finalScore.textContent = this.score;
            finalLength.textContent = this.snake.length;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            gameOverScreen.style.display = 'block';
        }
        
        document.getElementById('snake-start-btn').textContent = '开始游戏';
        
        window.app.showNotification(`游戏结束！得分：${this.score}`, 'warning');
    }

    setupEventListeners() {
        document.getElementById('snake-start-btn').addEventListener('click', () => {
            if (this.isRunning) {
                // 游戏运行中，点击无效
                return;
            } else {
                this.start();
            }
        });

        document.getElementById('snake-restart-btn').addEventListener('click', () => {
            this.reset();
            this.start();
        });

        document.addEventListener('keydown', (e) => {
            // 只在游戏模态框打开时响应键盘事件
            if (!window.app || !window.app.currentModal) return;
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.keysPressed.up = true;
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.keysPressed.down = true;
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.keysPressed.left = true;
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.keysPressed.right = true;
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            // 只在游戏模态框打开时响应键盘事件
            if (!window.app || !window.app.currentModal) return;
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keysPressed.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keysPressed.down = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keysPressed.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keysPressed.right = false;
                    break;
            }
        });
    }

    reset() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        clearInterval(this.timer);
        
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.specialFood = null;
        this.specialFoodTimer = 0;
        this.particles = [];
        
        // 重置按键状态
        this.keysPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 重置时间控制
        this.lastMoveTime = 0;
        this.lastFrameTime = 0;
        
        document.getElementById('snake-start-btn').textContent = '开始游戏';
        document.getElementById('snake-score').textContent = '0';
        document.getElementById('snake-length').textContent = '1';
        document.getElementById('snake-time').textContent = '00:00';
        document.getElementById('snake-game-over').style.display = 'none';
        
        this.draw();
    }

    destroy() {
        clearInterval(this.gameLoop);
    }
}

// 俄罗斯方块游戏 - 全新简化版本
class GameTetris {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.grid = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.bestScore = 0;
        this.level = 1;
        this.lines = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoop = null;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.startTime = null;
        this.timer = null;
        this.difficulty = 'normal';
        
        // 难度设置
        this.difficultySettings = {
            easy: { baseSpeed: 2000, speedIncrease: 50, name: '简单' },
            normal: { baseSpeed: 1000, speedIncrease: 100, name: '普通' },
            hard: { baseSpeed: 500, speedIncrease: 150, name: '困难' },
            expert: { baseSpeed: 200, speedIncrease: 200, name: '专家' }
        };
        
        // 简化的方块形状定义 - 使用标准俄罗斯方块形状
        this.pieces = [
            { shape: [[1,1,1,1]], color: '#00f0f0', name: 'I' }, // I方块 - 水平
            { shape: [[1,1],[1,1]], color: '#f0f000', name: 'O' }, // O方块
            { shape: [[0,1,0],[1,1,1]], color: '#a000f0', name: 'T' }, // T方块
            { shape: [[1,0,0],[1,1,1]], color: '#f0a000', name: 'L' }, // L方块
            { shape: [[0,0,1],[1,1,1]], color: '#0000f0', name: 'J' }, // J方块
            { shape: [[0,1,1],[1,1,0]], color: '#00f000', name: 'S' }, // S方块
            { shape: [[1,1,0],[0,1,1]], color: '#f00000', name: 'Z' }  // Z方块
        ];
    }

    init() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.initGrid();
        
        // 最高分
        this.bestScore = window.app.loadData('tetris_best', 0) || 0;
        const bestEl = document.getElementById('tetris-best');
        if (bestEl) bestEl.textContent = this.bestScore;
        
        // 设置难度选择器
        this.setupDifficultySelector();
        this.updateDifficulty();
        
        // 初始化暂存功能
        this.holdPiece = null;
        this.canHold = true;
        
        this.spawnPiece();
        this.generateNextPiece();
        this.setupEventListeners();
        this.draw();
        this.drawNext();
        this.drawHold();
        
        // 不自动开始游戏，让用户手动开始
    }


    setupDifficultySelector() {
        const difficultySelect = document.getElementById('tetris-difficulty');
        if (difficultySelect) {
            // 设置默认难度
            difficultySelect.value = this.difficulty;
            
            // 添加事件监听器
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.updateDifficulty();
                
                // 如果游戏正在运行，重新计算当前速度
                if (this.isRunning) {
                    this.calculateDropSpeed();
                }
            });
        }
    }

    updateDifficulty() {
        const settings = this.difficultySettings[this.difficulty] || this.difficultySettings.normal;
        this.dropInterval = settings.baseSpeed;
    }
    
    calculateDropSpeed() {
        const settings = this.difficultySettings[this.difficulty] || this.difficultySettings.normal;
        // 根据等级调整速度
        this.dropInterval = Math.max(50, settings.baseSpeed - (this.level - 1) * settings.speedIncrease);
    }

    initGrid() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    spawnPiece() {
        if (this.nextPiece) {
            this.currentPiece = { ...this.nextPiece };
        } else {
            this.generateNextPiece();
            this.currentPiece = { ...this.nextPiece };
        }
        
        this.currentPiece.x = Math.floor(this.cols / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        this.generateNextPiece();
        this.canHold = true; // 重置暂存标志
        
        // 更新下一个方块的显示
        this.drawNext();
        
        if (this.checkCollision()) {
            this.gameOver();
        }
    }

    generateNextPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.nextPiece = { ...this.pieces[pieceIndex] };
    }

    start() {
        if (this.isRunning && !this.isPaused) return;
        
        if (this.isPaused) {
            this.resume();
            return;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        
        this.initGrid();
        this.holdPiece = null;
        this.canHold = true;
        this.generateNextPiece(); // 先生成下一个方块
        this.spawnPiece(); // 然后生成当前方块
        
        // 更新UI
        const startBtn = document.getElementById('tetris-start-btn');
        const pauseBtn = document.getElementById('tetris-pause-btn');
        const scoreEl = document.getElementById('tetris-score');
        const levelEl = document.getElementById('tetris-level');
        const linesEl = document.getElementById('tetris-lines');
        const timeEl = document.getElementById('tetris-time');
        
        if (startBtn) startBtn.textContent = '暂停';
        if (pauseBtn) pauseBtn.disabled = false;
        if (scoreEl) scoreEl.textContent = '0';
        if (levelEl) levelEl.textContent = '1';
        if (linesEl) linesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '00:00';
        
        this.startTimer();
        this.gameLoop = setInterval(() => { this.update(); this.draw(); }, 16);
        this.drawNext();
        this.drawHold();
    }

    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        
        document.getElementById('tetris-start-btn').textContent = '继续';
        document.getElementById('tetris-pause-btn').textContent = '继续';
        document.getElementById('tetris-pause-btn').classList.remove('btn-warning');
        document.getElementById('tetris-pause-btn').classList.add('btn-success');
    }

    resume() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.startTimer();
        this.gameLoop = setInterval(() => { this.update(); this.draw(); }, 16);
        
        document.getElementById('tetris-start-btn').textContent = '暂停';
        document.getElementById('tetris-pause-btn').textContent = '暂停';
        document.getElementById('tetris-pause-btn').classList.remove('btn-success');
        document.getElementById('tetris-pause-btn').classList.add('btn-warning');
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isRunning || this.isPaused) return;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('tetris-time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        
        this.initGrid();
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        
        this.generateNextPiece(); // 先生成下一个方块
        this.spawnPiece(); // 然后生成当前方块
        
        // 更新UI元素
        const startBtn = document.getElementById('tetris-start-btn');
        const pauseBtn = document.getElementById('tetris-pause-btn');
        const scoreEl = document.getElementById('tetris-score');
        const levelEl = document.getElementById('tetris-level');
        const linesEl = document.getElementById('tetris-lines');
        const timeEl = document.getElementById('tetris-time');
        const gameOverEl = document.getElementById('tetris-game-over');
        
        if (startBtn) startBtn.textContent = '开始游戏';
        if (pauseBtn) {
            pauseBtn.textContent = '暂停';
            pauseBtn.disabled = true;
            pauseBtn.classList.remove('btn-success');
            pauseBtn.classList.add('btn-warning');
        }
        if (scoreEl) scoreEl.textContent = '0';
        if (levelEl) levelEl.textContent = '1';
        if (linesEl) linesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '00:00';
        if (gameOverEl) gameOverEl.style.display = 'none';
        
        this.draw();
        this.drawNext();
        this.drawHold();
    }

    checkCollision() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const newX = this.currentPiece.x + x;
                    const newY = this.currentPiece.y + y;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.grid[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    mergePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const newX = this.currentPiece.x + x;
                    const newY = this.currentPiece.y + y;
                    if (newY >= 0) {
                        this.grid[newY][newX] = this.currentPiece.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // 重新检查这一行
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.calculateDropSpeed();
            
            document.getElementById('tetris-score').textContent = this.score;
            document.getElementById('tetris-level').textContent = this.level;
            document.getElementById('tetris-lines').textContent = this.lines;
            
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                document.getElementById('tetris-best').textContent = this.bestScore;
                window.app.saveData('tetris_best', this.bestScore);
            }
        }
    }
    

    rotatePiece() {
        const rotated = [];
        const rows = this.currentPiece.shape.length;
        const cols = this.currentPiece.shape[0].length;
        
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = this.currentPiece.shape[rows - 1 - j][i];
            }
        }
        
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }

    movePiece(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        
        if (this.checkCollision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            
            if (dy > 0) {
                this.mergePiece();
                this.clearLines();
                this.spawnPiece();
            }
        }
    }

    update() {
        if (!this.isRunning || this.isPaused) return;
        
        this.dropTime += 16;
        if (this.dropTime >= this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = 0;
        }
    }

    draw() {
        if (!this.ctx) return;
        
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.gridSize, 0);
            this.ctx.lineTo(x * this.gridSize, this.rows * this.gridSize);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.gridSize);
            this.ctx.lineTo(this.cols * this.gridSize, y * this.gridSize);
            this.ctx.stroke();
        }
        
        // 绘制已放置的方块
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x]) {
                    this.drawBlock(x, y, this.grid[y][x]);
                }
            }
        }
        
        // 绘制当前方块
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.drawBlock(
                            this.currentPiece.x + x,
                            this.currentPiece.y + y,
                            this.currentPiece.color
                        );
                    }
                }
            }
        }
    }

    drawBlock(x, y, color) {
        const blockSize = this.gridSize - 2;
        const xPos = x * this.gridSize + 1;
        const yPos = y * this.gridSize + 1;
        
        // 绘制主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(xPos, yPos, blockSize, blockSize);
        
        // 绘制边框
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos, yPos, blockSize, blockSize);
    }

    drawNext() {
        const canvas = document.getElementById('tetris-next-canvas');
        if (!canvas || !this.nextPiece) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const blockSize = 20;
        const offsetX = (canvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (canvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x]) {
                    const xPos = offsetX + x * blockSize;
                    const yPos = offsetY + y * blockSize;
                    
                    ctx.fillStyle = this.nextPiece.color;
                    ctx.fillRect(xPos, yPos, blockSize - 1, blockSize - 1);
                    
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(xPos, yPos, blockSize - 1, blockSize - 1);
                }
            }
        }
    }

    drawHold() {
        const canvas = document.getElementById('tetris-hold-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!this.holdPiece) return;
        
        const blockSize = 20;
        const offsetX = (canvas.width - this.holdPiece.shape[0].length * blockSize) / 2;
        const offsetY = (canvas.height - this.holdPiece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < this.holdPiece.shape.length; y++) {
            for (let x = 0; x < this.holdPiece.shape[y].length; x++) {
                if (this.holdPiece.shape[y][x]) {
                    const xPos = offsetX + x * blockSize;
                    const yPos = offsetY + y * blockSize;
                    
                    ctx.fillStyle = this.holdPiece.color;
                    ctx.fillRect(xPos, yPos, blockSize - 1, blockSize - 1);
                    
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(xPos, yPos, blockSize - 1, blockSize - 1);
                }
            }
        }
    }


    gameOver() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        
        // 更新最终分数显示
        const finalScoreEl = document.getElementById('final-tetris-score');
        const finalLinesEl = document.getElementById('final-tetris-lines');
        const finalLevelEl = document.getElementById('final-tetris-level');
        const finalTimeEl = document.getElementById('final-tetris-time');
        
        if (finalScoreEl) finalScoreEl.textContent = this.score;
        if (finalLinesEl) finalLinesEl.textContent = this.lines;
        if (finalLevelEl) finalLevelEl.textContent = this.level;
        if (finalTimeEl) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            finalTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // 更新按钮状态
        const startBtn = document.getElementById('tetris-start-btn');
        const pauseBtn = document.getElementById('tetris-pause-btn');
        const gameOverEl = document.getElementById('tetris-game-over');
        
        if (startBtn) startBtn.textContent = '开始游戏';
        if (pauseBtn) {
            pauseBtn.textContent = '暂停';
            pauseBtn.disabled = true;
            pauseBtn.classList.remove('btn-success');
            pauseBtn.classList.add('btn-warning');
        }
        if (gameOverEl) gameOverEl.style.display = 'block';
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 只在游戏模态框打开时响应键盘事件
            if (!window.app || !window.app.currentModal) return;
            
            if (!this.isRunning || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    this.dropPiece();
                    break;
                case 'a':
                case 'A':
                    this.movePiece(-1, 0);
                    break;
                case 'd':
                case 'D':
                    this.movePiece(1, 0);
                    break;
                case 's':
                case 'S':
                    this.movePiece(0, 1);
                    break;
                case 'w':
                case 'W':
                    this.rotatePiece();
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    this.holdCurrentPiece();
                    break;
            }
        });
    }

    holdCurrentPiece() {
        if (!this.canHold) return;
        
        if (this.holdPiece === null) {
            // 第一次暂存
            this.holdPiece = { ...this.currentPiece };
            this.spawnPiece();
        } else {
            // 交换当前方块和暂存方块
            const temp = { ...this.currentPiece };
            this.currentPiece = { ...this.holdPiece };
            this.holdPiece = temp;
            
            // 重置位置
            this.currentPiece.x = Math.floor(this.cols / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
            this.currentPiece.y = 0;
            
            if (this.checkCollision()) {
                this.gameOver();
                return;
            }
        }
        
        this.canHold = false;
        this.drawHold();
        this.drawNext(); // 确保下一个方块显示也更新
    }

    dropPiece() {
        while (!this.checkCollision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.mergePiece();
        this.clearLines();
        this.spawnPiece();
    }

    destroy() {
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
    }
}

// 扫雷游戏
class GameMinesweeper {
    constructor() {
        this.difficulty = 'medium';
        this.size = 10;
        this.mines = 15;
        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.minesLeft = this.mines;
        this.flagsUsed = 0;
        this.startTime = null;
        this.timer = null;
        this.firstClick = true;
        
        this.difficultySettings = {
            'easy': { size: 9, mines: 10 },
            'medium': { size: 10, mines: 15 },
            'hard': { size: 16, mines: 40 },
            'expert': { size: 16, mines: 99, width: 30 }
        };
    }

    init() {
        this.setDifficulty();
        this.resetGame();
        this.initGrid();
        this.setupEventListeners();
        this.updateDisplay();
    }

    resetGame() {
        this.gameOver = false;
        this.firstClick = true;
        this.flagsUsed = 0;
        this.minesLeft = this.mines;
        this.startTime = null;
        
        // 清理定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 重新初始化数组（在initGrid中会重新设置grid）
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        this.revealed = Array(this.size).fill().map(() => Array(width).fill(false));
        this.flagged = Array(this.size).fill().map(() => Array(width).fill(false));
    }

    setDifficulty() {
        const difficulty = document.getElementById('minesweeper-difficulty').value;
        this.difficulty = difficulty;
        const settings = this.difficultySettings[difficulty];
        
        this.size = settings.size;
        this.mines = settings.mines;
        this.minesLeft = this.mines;
        
        // 清理定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 重置游戏状态
        this.gameOver = false;
        this.startTime = null;
        this.firstClick = true;
        this.flagsUsed = 0;
    }

    initGrid() {
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        // 确保数组大小一致
        this.grid = Array(this.size).fill().map(() => Array(width).fill(0));
        this.revealed = Array(this.size).fill().map(() => Array(width).fill(false));
        this.flagged = Array(this.size).fill().map(() => Array(width).fill(false));
        
        // 放置地雷
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * this.size);
            if (this.grid[y][x] !== -1) {
                this.grid[y][x] = -1;
                minesPlaced++;
            }
        }
        
        // 计算数字
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < width; x++) {
                if (this.grid[y][x] !== -1) {
                    this.grid[y][x] = this.countAdjacentMines(x, y);
                }
            }
        }
    }

    countAdjacentMines(x, y) {
        let count = 0;
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const newY = y + dy;
                const newX = x + dx;
                if (newY >= 0 && newY < this.size && newX >= 0 && newX < width) {
                    if (this.grid[newY][newX] === -1) count++;
                }
            }
        }
        return count;
    }

    reveal(x, y) {
        if (this.revealed[y][x] || this.flagged[y][x] || this.gameOver) return;
        
        if (!this.startTime) {
            this.startTime = Date.now();
            this.startTimer();
        }
        
        this.revealed[y][x] = true;
        
        if (this.grid[y][x] === -1) {
            this.gameOver = true;
            this.revealAll();
            window.app.showNotification('游戏结束！', 'error');
            return;
        }
        
        if (this.grid[y][x] === 0) {
            const settings = this.difficultySettings[this.difficulty];
            const width = this.difficulty === 'expert' ? settings.width : this.size;
            
            // 使用队列避免递归调用
            const queue = [];
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = y + dy;
                    const newX = x + dx;
                    if (newY >= 0 && newY < this.size && newX >= 0 && newX < width) {
                        if (!this.revealed[newY][newX] && !this.flagged[newY][newX]) {
                            queue.push([newX, newY]);
                        }
                    }
                }
            }
            
            // 处理队列中的格子
            while (queue.length > 0) {
                const [qx, qy] = queue.shift();
                if (this.revealed[qy][qx] || this.flagged[qy][qx]) continue;
                
                this.revealed[qy][qx] = true;
                
                if (this.grid[qy][qx] === 0) {
                    // 继续扩展空区域
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const newY = qy + dy;
                            const newX = qx + dx;
                            if (newY >= 0 && newY < this.size && newX >= 0 && newX < width) {
                                if (!this.revealed[newY][newX] && !this.flagged[newY][newX]) {
                                    queue.push([newX, newY]);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        this.checkWin();
        this.updateDisplay();
    }

    toggleFlag(x, y) {
        if (this.revealed[y][x] || this.gameOver) return;
        
        if (!this.startTime) {
            this.startTime = Date.now();
            this.startTimer();
        }
        
        this.flagged[y][x] = !this.flagged[y][x];
        this.minesLeft += this.flagged[y][x] ? -1 : 1;
        this.updateDisplay();
    }

    revealAll() {
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < width; x++) {
                this.revealed[y][x] = true;
            }
        }
        this.updateDisplay();
    }

    checkWin() {
        let revealedCount = 0;
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < width; x++) {
                if (this.revealed[y][x] && this.grid[y][x] !== -1) {
                    revealedCount++;
                }
            }
        }
        
        if (revealedCount === this.size * width - this.mines) {
            this.gameOver = true;
            window.app.showNotification('恭喜获胜！', 'success');
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            if (this.startTime && !this.gameOver) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('minesweeper-timer').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    updateDisplay() {
        const container = document.getElementById('minesweeper-grid');
        container.innerHTML = '';
        
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        // 使用网格布局：直接渲染所有单元格，并设置列数
        container.style.gridTemplateColumns = `repeat(${width}, 25px)`;
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < width; x++) {
                const cell = document.createElement('div');
                cell.className = 'minesweeper-cell';
                cell.setAttribute('data-row', y);
                cell.setAttribute('data-col', x);
                
                if (this.flagged[y][x]) {
                    cell.textContent = '🚩';
                    cell.classList.add('flagged');
                } else if (this.revealed[y][x]) {
                    if (this.grid[y][x] === -1) {
                        cell.textContent = '💣';
                        cell.classList.add('mine');
                    } else if (this.grid[y][x] > 0) {
                        cell.textContent = this.grid[y][x];
                        cell.classList.add(`number-${this.grid[y][x]}`);
                    } else {
                        cell.classList.add('empty');
                    }
                }
                
                // 使用事件委托避免重复绑定
                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.reveal(x, y);
                });
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleFlag(x, y);
                });
                
                container.appendChild(cell);
            }
        }
        
        // 更新统计信息
        this.updateStats();
    }

    setupEventListeners() {
        document.getElementById('minesweeper-new-btn').addEventListener('click', () => {
            this.init();
        });
        
        document.getElementById('minesweeper-difficulty').addEventListener('change', () => {
            this.init();
        });
        
    }

    
    
    
    getNeighbors(row, col) {
        const neighbors = [];
        const settings = this.difficultySettings[this.difficulty];
        const width = this.difficulty === 'expert' ? settings.width : this.size;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < width) {
                    neighbors.push([newRow, newCol]);
                }
            }
        }
        return neighbors;
    }
    
    updateStats() {
        // 更新其他显示（计时器由startTimer()处理）
        document.getElementById('mines-left').textContent = this.minesLeft;
        document.getElementById('flags-used').textContent = this.flagsUsed;
    }

    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}

// 初始化游戏管理器
window.GameManager = new GameManager();

