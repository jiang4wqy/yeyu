/* ============================================
   夜语 — 共享组件 & 工具
   ============================================ */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// 字逐字浮现
function Whisper({ text, delay = 0, speed = 60, className = "", as: As = "p", onDone }) {
  const [shown, setShown] = useState(0);
  const chars = useMemo(() => Array.from(text || ""), [text]);
  useEffect(() => {
    setShown(0);
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= chars.length) {
          clearInterval(t);
          if (onDone) onDone();
        }
      }, speed);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay, speed, chars.length]);
  return (
    <As className={className}>
      {chars.map((c, idx) => (
        <span
          key={idx}
          style={{
            opacity: idx < shown ? 1 : 0,
            filter: idx < shown ? "blur(0)" : "blur(6px)",
            transition: "opacity 0.5s ease, filter 0.5s ease",
            display: "inline-block",
            whiteSpace: "pre",
          }}
        >
          {c}
        </span>
      ))}
    </As>
  );
}

// 月相 SVG 组件 —— phase 0..1
function Moon({ size = 200, phase = 0.5, glow = true }) {
  const r = size / 2 - 4;
  // 用 path 模拟月相
  const offset = (1 - 2 * phase) * r * 1.6;
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.4,
            background: "radial-gradient(circle, rgba(244,236,216,0.18) 0%, rgba(106,139,191,0.08) 35%, transparent 70%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
      )}
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ position: "relative" }}>
        <defs>
          <radialGradient id="moon-grad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fdf6e3" />
            <stop offset="30%" stopColor="#f4ecd8" />
            <stop offset="65%" stopColor="#d4b87a" />
            <stop offset="100%" stopColor="#7a6238" />
          </radialGradient>
          <radialGradient id="moon-shadow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(8,17,31,0.95)" />
            <stop offset="100%" stopColor="rgba(8,17,31,1)" />
          </radialGradient>
          <filter id="moon-blur"><feGaussianBlur stdDeviation="0.6" /></filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="url(#moon-grad)" />
        {/* 阴影遮罩，根据 phase 偏移 */}
        <circle cx={size/2 + offset} cy={size/2} r={r} fill="url(#moon-shadow)" opacity={phase === 0.5 ? 0 : 0.92} />
        {/* 环形高光 */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(244,236,216,0.3)" strokeWidth="0.5" />
        {/* 月海斑点 */}
        <circle cx={size*0.65} cy={size*0.30} r={size*0.04} fill="rgba(40,30,10,0.18)" filter="url(#moon-blur)" />
        <circle cx={size*0.30} cy={size*0.60} r={size*0.03} fill="rgba(40,30,10,0.16)" filter="url(#moon-blur)" />
        <circle cx={size*0.50} cy={size*0.75} r={size*0.05} fill="rgba(40,30,10,0.14)" filter="url(#moon-blur)" />
      </svg>
    </div>
  );
}

// 装饰角
function CornerDeco() {
  return (
    <>
      <span className="corner-deco tl"></span>
      <span className="corner-deco tr"></span>
      <span className="corner-deco bl"></span>
      <span className="corner-deco br"></span>
    </>
  );
}

// 横排分隔（中式·飞檐云纹简化）
function OrnateDivider({ width = 240 }) {
  return (
    <svg width={width} height="14" viewBox="0 0 240 14" fill="none" style={{ display: "block" }}>
      <line x1="0" y1="7" x2="92" y2="7" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5" />
      <line x1="148" y1="7" x2="240" y2="7" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5" />
      <circle cx="120" cy="7" r="3.5" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
      <circle cx="120" cy="7" r="1" fill="var(--gold)" />
      <line x1="100" y1="7" x2="110" y2="7" stroke="var(--gold)" strokeWidth="0.5" opacity="0.7" />
      <line x1="130" y1="7" x2="140" y2="7" stroke="var(--gold)" strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}

// 竖排标题（古典）
function VerticalTitle({ text, size = 22, className = "", color }) {
  return (
    <div
      className={className}
      style={{
        writingMode: "vertical-rl",
        fontFamily: "var(--font-display)",
        fontSize: size,
        letterSpacing: "0.3em",
        lineHeight: 1.4,
        color: color || "var(--moon-white)",
      }}
    >
      {text}
    </div>
  );
}

// 顶部导航
function TopNav({ current, onNav, onHome }) {
  const items = [
    { id: "home",     label: "夜话" },
    { id: "dream",    label: "解梦" },
    { id: "fortune",  label: "今日签" },
    { id: "portrait", label: "画像" },
    { id: "lantern",  label: "河灯" },
    { id: "calendar", label: "月历" },
    { id: "symbols",  label: "星图" },
    { id: "scroll",   label: "卷轴" },
  ];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "22px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, rgba(8,17,31,0.6) 0%, transparent 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div onClick={onHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 26, height: 26 }}>
          <Moon size={26} phase={0.6} glow={false} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.3em", color: "var(--moon-white)" }}>夜语</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em", color: "var(--text-tertiary)", marginTop: 4 }}>NIGHT · WHISPER</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2 }}>
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              padding: "10px 16px",
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              letterSpacing: "0.22em",
              color: current === it.id ? "var(--moon-white)" : "var(--text-tertiary)",
              position: "relative",
              transition: "color 0.3s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--moon-white)"}
            onMouseLeave={e => e.currentTarget.style.color = current === it.id ? "var(--moon-white)" : "var(--text-tertiary)"}
          >
            {it.label}
            {current === it.id && (
              <span style={{
                position: "absolute", left: "50%", bottom: 2, transform: "translateX(-50%)",
                width: 4, height: 4, borderRadius: "50%", background: "var(--gold)",
                boxShadow: "0 0 8px var(--gold)",
              }}></span>
            )}
          </button>
        ))}
      </div>

      <div style={{ width: 90, textAlign: "right" }}>
        <TimeIndicator />
      </div>
    </nav>
  );
}

function TimeIndicator() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const g = window.YY_GREETING();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--moon-cream)", letterSpacing: "0.25em" }}>
        {g.hour}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.2em" }}>
        {hh}:{mm}
      </span>
    </div>
  );
}

// 风格选择器
const STYLE_OPTIONS = [
  { id: "gentle",   label: "温柔派", desc: "比喻多，语气柔" },
  { id: "sharp",    label: "锐利派", desc: "直指痛点" },
  { id: "mystic",   label: "玄学派", desc: "东方意象重" },
  { id: "modern",   label: "现代派", desc: "心理学为主" },
];

function StyleSelector({ value, onChange, compact = false }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {STYLE_OPTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          style={{
            padding: compact ? "6px 14px" : "10px 18px",
            border: `1px solid ${value === s.id ? "var(--gold)" : "var(--glass-border)"}`,
            background: value === s.id ? "rgba(201,169,110,0.08)" : "transparent",
            color: value === s.id ? "var(--moon-white)" : "var(--text-secondary)",
            fontFamily: "var(--font-serif)",
            fontSize: compact ? 12 : 13,
            letterSpacing: "0.2em",
            transition: "all 0.3s",
            position: "relative",
          }}
        >
          {s.label}
          {!compact && (
            <div style={{
              position: "absolute",
              bottom: -22,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--text-faint)",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              opacity: value === s.id ? 1 : 0,
              transition: "opacity 0.3s",
            }}>
              {s.desc}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// 暴露给其他文件
Object.assign(window, {
  Whisper, Moon, CornerDeco, OrnateDivider, VerticalTitle, TopNav, TimeIndicator, StyleSelector, STYLE_OPTIONS,
});
