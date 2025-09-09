// 有趣网站链接管理模块
class LinksManager {
    constructor() {
        this.links = this.loadLinks();
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderLinks();
        this.addDefaultLinks();
    }

    bindEvents() {
        // 添加网站按钮
        document.getElementById('add-link-btn').addEventListener('click', () => {
            this.showAddLinkModal();
        });

        // 搜索功能
        document.getElementById('links-search').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderLinks();
        });
    }

    // 从localStorage加载链接
    loadLinks() {
        try {
            const saved = localStorage.getItem('interesting-links');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载链接失败:', error);
            return [];
        }
    }

    // 保存链接到localStorage
    saveLinks() {
        try {
            localStorage.setItem('interesting-links', JSON.stringify(this.links));
        } catch (error) {
            console.error('保存链接失败:', error);
        }
    }

    // 添加默认链接
    addDefaultLinks() {
        if (this.links.length === 0) {
            const defaultLinks = [
                {
                    id: Date.now() + 1,
                    title: 'Neal.fun',
                    url: 'https://neal.fun',
                    description: '创意互动网站集合，包含各种有趣的实验性项目',
                    tags: ['创意', '互动', '实验'],
                    favicon: '🎨',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: Date.now() + 2,
                    title: 'A Soft Murmur',
                    url: 'https://asoftmurmur.com',
                    description: '白噪音和自然声音生成器，帮助专注和放松',
                    tags: ['白噪音', '专注', '放松'],
                    favicon: '🌊',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: Date.now() + 3,
                    title: 'Coolors',
                    url: 'https://coolors.co',
                    description: '在线配色工具，生成和分享美丽的色彩搭配',
                    tags: ['设计', '配色', '工具'],
                    favicon: '🎨',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: Date.now() + 4,
                    title: 'Unsplash',
                    url: 'https://unsplash.com',
                    description: '免费高质量图片素材库，摄影师分享的美丽照片',
                    tags: ['图片', '素材', '摄影'],
                    favicon: '📸',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: Date.now() + 5,
                    title: 'Typeform',
                    url: 'https://typeform.com',
                    description: '创建美观的在线表单和调查问卷',
                    tags: ['表单', '调查', '工具'],
                    favicon: '📝',
                    dateAdded: new Date().toISOString()
                }
            ];
            this.links = defaultLinks;
            this.saveLinks();
        }
    }

    // 显示添加链接模态框
    showAddLinkModal() {
        const modal = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = '添加有趣网站';
        modalBody.innerHTML = this.getAddLinkFormHTML();
        modal.style.display = 'flex';

        // 绑定表单事件
        this.bindAddLinkFormEvents();
    }

    // 获取添加链接表单HTML
    getAddLinkFormHTML() {
        return `
            <form class="add-link-form" id="add-link-form">
                <div class="form-group">
                    <label for="link-title">网站标题 *</label>
                    <input type="text" id="link-title" name="title" required placeholder="例如：GitHub">
                </div>
                <div class="form-group">
                    <label for="link-url">网站地址 *</label>
                    <input type="url" id="link-url" name="url" required placeholder="https://github.com">
                </div>
                <div class="form-group">
                    <label for="link-description">网站描述</label>
                    <textarea id="link-description" name="description" placeholder="简单描述这个网站的功能或特色..."></textarea>
                </div>
                <div class="form-group">
                    <label for="link-tags">标签（用逗号分隔）</label>
                    <input type="text" id="link-tags" name="tags" placeholder="例如：编程,开源,工具">
                </div>
                <div class="form-group">
                    <label for="link-favicon">图标（可选）</label>
                    <input type="text" id="link-favicon" name="favicon" placeholder="例如：🐙">
                </div>
                <div class="form-actions">
                    <button type="button" class="form-btn secondary" id="cancel-add-link">取消</button>
                    <button type="submit" class="form-btn primary">添加网站</button>
                </div>
            </form>
        `;
    }

    // 绑定添加链接表单事件
    bindAddLinkFormEvents() {
        const form = document.getElementById('add-link-form');
        const cancelBtn = document.getElementById('cancel-add-link');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddLink(form);
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // 自动填充URL信息
        const urlInput = document.getElementById('link-url');
        urlInput.addEventListener('blur', () => {
            this.autoFillFromUrl(urlInput.value);
        });
    }

    // 从URL自动填充信息
    autoFillFromUrl(url) {
        if (!url) return;

        try {
            const urlObj = new URL(url);
            const titleInput = document.getElementById('link-title');
            const faviconInput = document.getElementById('link-favicon');

            // 如果标题为空，使用域名
            if (!titleInput.value) {
                titleInput.value = urlObj.hostname.replace('www.', '');
            }

            // 设置默认图标
            if (!faviconInput.value) {
                const domain = urlObj.hostname.toLowerCase();
                if (domain.includes('github')) faviconInput.value = '🐙';
                else if (domain.includes('youtube')) faviconInput.value = '📺';
                else if (domain.includes('twitter') || domain.includes('x.com')) faviconInput.value = '🐦';
                else if (domain.includes('reddit')) faviconInput.value = '🤖';
                else if (domain.includes('stackoverflow')) faviconInput.value = '📚';
                else if (domain.includes('medium')) faviconInput.value = '📝';
                else faviconInput.value = '🌐';
            }
        } catch (error) {
            console.error('URL解析失败:', error);
        }
    }

    // 处理添加链接
    handleAddLink(form) {
        const formData = new FormData(form);
        const linkData = {
            id: Date.now(),
            title: formData.get('title').trim(),
            url: formData.get('url').trim(),
            description: formData.get('description').trim(),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            favicon: formData.get('favicon').trim() || '🌐',
            dateAdded: new Date().toISOString()
        };

        // 验证必填字段
        if (!linkData.title || !linkData.url) {
            alert('请填写网站标题和地址');
            return;
        }

        // 验证URL格式
        try {
            new URL(linkData.url);
        } catch (error) {
            alert('请输入有效的网站地址');
            return;
        }

        this.links.unshift(linkData);
        this.saveLinks();
        this.renderLinks();
        this.closeModal();
    }

    // 显示编辑链接模态框
    showEditLinkModal(linkId) {
        const link = this.links.find(l => l.id === linkId);
        if (!link) return;

        const modal = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = '编辑网站';
        modalBody.innerHTML = this.getEditLinkFormHTML(link);
        modal.style.display = 'flex';

        // 绑定表单事件
        this.bindEditLinkFormEvents(linkId);
    }

    // 获取编辑链接表单HTML
    getEditLinkFormHTML(link) {
        return `
            <form class="add-link-form" id="edit-link-form">
                <div class="form-group">
                    <label for="edit-link-title">网站标题 *</label>
                    <input type="text" id="edit-link-title" name="title" required value="${link.title}">
                </div>
                <div class="form-group">
                    <label for="edit-link-url">网站地址 *</label>
                    <input type="url" id="edit-link-url" name="url" required value="${link.url}">
                </div>
                <div class="form-group">
                    <label for="edit-link-description">网站描述</label>
                    <textarea id="edit-link-description" name="description">${link.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-link-tags">标签（用逗号分隔）</label>
                    <input type="text" id="edit-link-tags" name="tags" value="${link.tags.join(', ')}">
                </div>
                <div class="form-group">
                    <label for="edit-link-favicon">图标（可选）</label>
                    <input type="text" id="edit-link-favicon" name="favicon" value="${link.favicon}">
                </div>
                <div class="form-actions">
                    <button type="button" class="form-btn secondary" id="cancel-edit-link">取消</button>
                    <button type="submit" class="form-btn primary">保存修改</button>
                </div>
            </form>
        `;
    }

    // 绑定编辑链接表单事件
    bindEditLinkFormEvents(linkId) {
        const form = document.getElementById('edit-link-form');
        const cancelBtn = document.getElementById('cancel-edit-link');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditLink(form, linkId);
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });
    }

    // 处理编辑链接
    handleEditLink(form, linkId) {
        const formData = new FormData(form);
        const linkIndex = this.links.findIndex(l => l.id === linkId);
        
        if (linkIndex === -1) return;

        const linkData = {
            ...this.links[linkIndex],
            title: formData.get('title').trim(),
            url: formData.get('url').trim(),
            description: formData.get('description').trim(),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            favicon: formData.get('favicon').trim() || '🌐'
        };

        // 验证必填字段
        if (!linkData.title || !linkData.url) {
            alert('请填写网站标题和地址');
            return;
        }

        // 验证URL格式
        try {
            new URL(linkData.url);
        } catch (error) {
            alert('请输入有效的网站地址');
            return;
        }

        this.links[linkIndex] = linkData;
        this.saveLinks();
        this.renderLinks();
        this.closeModal();
    }

    // 删除链接
    deleteLink(linkId) {
        if (confirm('确定要删除这个网站链接吗？')) {
            this.links = this.links.filter(l => l.id !== linkId);
            this.saveLinks();
            this.renderLinks();
        }
    }

    // 渲染链接列表
    renderLinks() {
        const grid = document.getElementById('links-grid');
        
        if (this.links.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // 过滤链接
        const filteredLinks = this.links.filter(link => {
            if (!this.searchTerm) return true;
            
            const searchText = `${link.title} ${link.description} ${link.tags.join(' ')} ${link.url}`.toLowerCase();
            return searchText.includes(this.searchTerm);
        });

        if (filteredLinks.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
            return;
        }

        // 渲染链接卡片
        grid.innerHTML = filteredLinks.map(link => this.getLinkCardHTML(link)).join('');
        
        // 绑定卡片事件
        this.bindLinkCardEvents();
    }

    // 获取空状态HTML
    getEmptyStateHTML() {
        return `
            <div class="link-card empty-state">
                <div class="empty-state-icon">🔗</div>
                <div class="empty-state-title">还没有收藏任何网站</div>
                <div class="empty-state-text">点击"添加网站"按钮开始收藏有趣的网站吧！</div>
            </div>
        `;
    }

    // 获取无搜索结果HTML
    getNoResultsHTML() {
        return `
            <div class="link-card empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">没有找到匹配的网站</div>
                <div class="empty-state-text">尝试使用不同的关键词搜索，或者添加新的网站链接。</div>
            </div>
        `;
    }

    // 获取链接卡片HTML
    getLinkCardHTML(link) {
        const highlightText = (text, searchTerm) => {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        };

        return `
            <div class="link-card" data-link-id="${link.id}">
                <div class="link-card-header">
                    <div class="link-favicon">${link.favicon}</div>
                    <div class="link-info">
                        <div class="link-title">${highlightText(link.title, this.searchTerm)}</div>
                        <div class="link-url">${highlightText(link.url, this.searchTerm)}</div>
                    </div>
                    <div class="link-actions">
                        <button class="link-action-btn edit-btn" data-action="edit" title="编辑">✏️</button>
                        <button class="link-action-btn" data-action="delete" title="删除">🗑️</button>
                    </div>
                </div>
                ${link.description ? `<div class="link-description">${highlightText(link.description, this.searchTerm)}</div>` : ''}
                ${link.tags.length > 0 ? `
                    <div class="link-tags">
                        ${link.tags.map(tag => `<span class="link-tag">${highlightText(tag, this.searchTerm)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 绑定链接卡片事件
    bindLinkCardEvents() {
        const cards = document.querySelectorAll('.link-card[data-link-id]');
        
        cards.forEach(card => {
            const linkId = parseInt(card.dataset.linkId);
            const link = this.links.find(l => l.id === linkId);
            
            // 点击卡片打开链接
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.link-actions')) {
                    window.open(link.url, '_blank');
                }
            });

            // 编辑按钮
            const editBtn = card.querySelector('[data-action="edit"]');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditLinkModal(linkId);
            });

            // 删除按钮
            const deleteBtn = card.querySelector('[data-action="delete"]');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLink(linkId);
            });
        });
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('modal-container');
        modal.style.display = 'none';
    }
}

// 初始化链接管理器
let linksManager;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在links页面
    const linksSection = document.getElementById('links');
    if (linksSection) {
        linksManager = new LinksManager();
    }
});

// 导出给其他模块使用
window.LinksManager = LinksManager;
