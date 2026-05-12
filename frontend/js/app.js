/**
 * 夜语 (Night Whisper) — 前端交互
 */

// ── 粒子背景 ──────────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            this.fadingIn = Math.random() > 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.fadingIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.55) this.fadingIn = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.1) this.fadingIn = true;
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
})();

// ── DOM 查询 ──────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const tabs = $$('.tab-btn');
const panels = $$('.tab-panel');
const loadingOverlay = $('#loading-overlay');
const resultOverlay = $('#result-overlay');
const resultCard = $('#result-card');
const resultTitle = $('#result-title');
const resultKeywords = $('#result-keywords');
const resultBody = $('#result-body');
const shareCard = $('#share-card');
const shareQuote = $('#share-quote');
const closeResult = $('#close-result');
const copyBtn = $('#copy-share');

// ── 状态 ──────────────────────────────────────────────────────────
let currentMoodColor = '#5B6E8C';
let currentShareQuote = '';

// ── 本地存储 ──────────────────────────────────────────────────────
function getSettings() {
    try {
        return JSON.parse(localStorage.getItem('yeyu_settings') || '{}');
    } catch { return {}; }
}
function saveSettings(obj) {
    const s = getSettings();
    Object.assign(s, obj);
    localStorage.setItem('yeyu_settings', JSON.stringify(s));
}

// 初始化设置
(function initSettings() {
    const s = getSettings();
    if (s.apiKey) $('#api-key-input').value = s.apiKey;
    if (s.apiUrl) $('#api-url-input').value = s.apiUrl;
})();

// ── Tab 切换 ──────────────────────────────────────────────────────
tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => p.classList.remove('active'));
        $(`#panel-${target}`).classList.add('active');
    });
});

// ── 风格选择 ──────────────────────────────────────────────────────
function getSelectedStyle() {
    const checked = document.querySelector('input[name="style"]:checked');
    return checked ? checked.value : '温柔派';
}

// ── 按钮事件 ──────────────────────────────────────────────────────
$$('.submit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const action = btn.dataset.action;
        if (action === 'save-settings') {
            saveSettings({
                apiKey: $('#api-key-input').value.trim(),
                apiUrl: $('#api-url-input').value.trim() || '/api',
            });
            showToast('设置已保存');
            return;
        }
        if (action === 'dream') await handleDream();
        if (action === 'fortune') await handleFortune();
        if (action === 'personality') await handlePersonality();
    });
});

// ── Toast 提示 ────────────────────────────────────────────────────
function showToast(msg) {
    let toast = $('.toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// Toast 样式（动态注入）
(function injectToastStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .toast-msg {
            position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px);
            padding: 10px 24px; border-radius: 20px;
            background: rgba(167,139,250,0.2); color: #c9a96e;
            font-size: 0.88rem; z-index: 999;
            opacity: 0; transition: all 0.3s ease;
            pointer-events: none; border: 1px solid rgba(167,139,250,0.2);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .toast-msg.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(style);
})();

// ── API 调用 ──────────────────────────────────────────────────────
function getApiBase() {
    const s = getSettings();
    return s.apiUrl || '/api';
}

function getHeaders() {
    const s = getSettings();
    const headers = { 'Content-Type': 'application/json' };
    // 如果用户配置了直连 API Key，走前端直连模式
    if (s.apiKey && s.apiUrl && !s.apiUrl.startsWith('/')) {
        headers['Authorization'] = `Bearer ${s.apiKey}`;
    }
    return headers;
}

async function apiCall(endpoint, body) {
    const settings = getSettings();
    const base = settings.apiUrl || '/api';

    // 如果配了 API Key 且是直连模式
    if (settings.apiKey && base.startsWith('http')) {
        // 直连 DeepSeek — 这里用后端代理更安全，暂不实现前端直连
    }

    // 默认走后端代理
    const resp = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => ({ detail: '请求失败' }));
        throw new Error(err.detail || `HTTP ${resp.status}`);
    }
    return resp.json();
}

// ── 解梦 ──────────────────────────────────────────────────────────
async function handleDream() {
    const dream = $('#dream-input').value.trim();
    if (!dream) { showToast('先说说你的梦吧'); return; }

    showLoading();
    try {
        const data = await apiCall('/dream', {
            dream,
            style: getSelectedStyle(),
        });
        showResult(data);
    } catch (e) {
        showToast(e.message || '解读失败，请稍后再试');
    } finally {
        hideLoading();
    }
}

// ── 今日签 ────────────────────────────────────────────────────────
async function handleFortune() {
    const question = $('#fortune-input').value.trim();

    showLoading();
    try {
        const data = await apiCall('/fortune', {
            question,
            style: getSelectedStyle(),
        });
        showResult(data);
    } catch (e) {
        showToast(e.message || '抽取失败，请稍后再试');
    } finally {
        hideLoading();
    }
}

// ── 性格解读 ──────────────────────────────────────────────────────
async function handlePersonality() {
    const userType = $('#type-input').value.trim();
    if (!userType) { showToast('请输入你的星座或 MBTI 类型'); return; }
    const aspect = $('#aspect-select').value;

    showLoading();
    try {
        const data = await apiCall('/personality', {
            user_type: userType,
            aspect,
            style: getSelectedStyle(),
        });
        showResult(data);
    } catch (e) {
        showToast(e.message || '解读失败，请稍后再试');
    } finally {
        hideLoading();
    }
}

// ── 加载状态 ──────────────────────────────────────────────────────
function showLoading() { loadingOverlay.classList.add('visible'); }
function hideLoading() { loadingOverlay.classList.remove('visible'); }

// ── 显示结果 ──────────────────────────────────────────────────────
function showResult(data) {
    // 标题
    resultTitle.textContent = data.title || '夜语';

    // 关键词
    const keywords = data.keywords || [];
    resultKeywords.innerHTML = keywords.map(k => `<span>${escapeHtml(k)}</span>`).join('');

    // 正文 — 渲染 ✦ 格式
    const content = data.main_content || '';
    resultBody.innerHTML = formatContent(content);

    // 配色
    currentMoodColor = data.mood_color || '#5B6E8C';
    resultCard.style.borderColor = currentMoodColor + '33';
    shareCard.style.background = `linear-gradient(135deg, ${currentMoodColor}15, ${currentMoodColor}08)`;
    shareCard.style.borderColor = currentMoodColor + '22';

    // 分享语
    currentShareQuote = data.share_quote || '';
    shareQuote.textContent = currentShareQuote || '夜语 · 你的心灵镜子';
    if (!currentShareQuote) shareCard.style.display = 'none';
    else shareCard.style.display = '';

    // 显示
    resultOverlay.classList.add('visible');
    resultOverlay.scrollTop = 0;
}

function formatContent(text) {
    // 把 ✦ xxx 变成带样式的段落
    let html = escapeHtml(text);
    // 处理 ✦ 分节符
    html = html.replace(/✦\s*(.+?)(?=\n|$)/g, '<p class="section-head">✦ $1</p>');
    // 处理双换行为段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    // 清理多余空段落
    html = html.replace(/<p>\s*<\/p>/g, '');
    // 处理单个换行
    html = html.replace(/\n/g, '<br>');
    return html;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── 关闭结果 ──────────────────────────────────────────────────────
closeResult.addEventListener('click', () => {
    resultOverlay.classList.remove('visible');
});

resultOverlay.addEventListener('click', (e) => {
    if (e.target === resultOverlay) {
        resultOverlay.classList.remove('visible');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        resultOverlay.classList.remove('visible');
    }
});

// ── 复制分享卡片 ──────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
    const text = `🌙 夜语\n\n"${currentShareQuote}"\n\n—— 你的心灵解读 · 夜语`;
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '✓ 已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = '📋 复制分享卡片';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch {
        showToast('复制失败，请手动复制');
    }
});

// ── 键盘快捷提交 ──────────────────────────────────────────────────
$('#dream-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleDream();
});
