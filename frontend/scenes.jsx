/* ============================================
   夜语 — 场景 A：进入页 / 主页 / 解梦 / 今日签
   ============================================ */

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useMemo: useMemoA } = React;

/* -------------------------------------------
   场景 1 · 进入页
   ------------------------------------------- */
function WelcomeScene({ onEnter }) {
  const [mouseTilt, setMouseTilt] = useStateA({ x: 0, y: 0 });

  useEffectA(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseTilt({ x, y });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const px = mouseTilt.x;
  const py = mouseTilt.y;

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1200px",
      overflow: "hidden",
    }}>

      {/* 远景云雾层 */}
      <div style={{
        position: "absolute", inset: -100,
        background: "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(106,139,191,0.10), transparent 70%)",
        transform: `translate(${px * -10}px, ${py * -10}px)`,
        transition: "transform 0.6s ease-out",
      }} />

      {/* 月 —— 主视觉 */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) translate(${px * -16}px, ${py * -10}px)`,
        transition: "transform 0.5s ease-out",
        animation: "breath 8s ease-in-out infinite",
      }}>
        <Moon size={420} phase={0.55} />
      </div>

      {/* 山影 —— 远景 */}
      <svg
        viewBox="0 0 1440 300" preserveAspectRatio="none"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          width: "100%", height: "26vh",
          transform: `translateY(${py * 6}px)`,
          opacity: 0.55,
        }}
      >
        <path d="M0,300 L0,180 L120,140 L260,200 L380,120 L520,170 L680,90 L820,160 L960,110 L1100,170 L1240,130 L1440,180 L1440,300 Z"
          fill="#0a1424" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
      </svg>
      <svg
        viewBox="0 0 1440 200" preserveAspectRatio="none"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          width: "100%", height: "18vh",
          transform: `translateY(${py * 12}px)`,
          opacity: 0.85,
        }}
      >
        <path d="M0,200 L0,140 L160,90 L300,140 L480,70 L640,130 L820,80 L1000,140 L1180,90 L1320,130 L1440,100 L1440,200 Z"
          fill="#050a14" />
      </svg>

      {/* 标题 */}
      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        transform: `translate(${px * 8}px, ${py * 4}px)`,
        transition: "transform 0.5s ease-out",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.6em",
          color: "var(--text-tertiary)", marginBottom: 32,
          animation: "fadeIn 1.5s ease 0.3s both",
        }}>
          NIGHT  ·  WHISPER
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 14vw, 200px)",
          fontWeight: 400,
          letterSpacing: "0.15em",
          lineHeight: 1,
          color: "var(--moon-white)",
          textShadow: "0 0 40px rgba(244,236,216,0.15), 0 0 80px rgba(201,169,110,0.10)",
          marginBottom: 28,
          animation: "fadeInUp 1.6s cubic-bezier(0.16,1,0.3,1) 0.5s both",
        }}>
          夜<span style={{ color: "var(--gold-soft)", margin: "0 0.12em" }}>·</span>语
        </h1>

        <div style={{
          margin: "0 auto 36px",
          animation: "fadeIn 1.5s ease 1.2s both",
        }}>
          <OrnateDivider width={280} />
        </div>

        <p style={{
          fontFamily: "var(--font-hand)",
          fontSize: 22, letterSpacing: "0.3em",
          color: "var(--moon-cream)",
          lineHeight: 1.8,
          animation: "fadeInUp 1.6s ease 1.4s both",
        }}>
          一面镜子，映出你心底的潮汐
        </p>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.4em", color: "var(--text-tertiary)",
          marginTop: 14,
          animation: "fadeIn 1.6s ease 1.8s both",
        }}>
          A MIRROR  ·  TO  ·  YOUR  ·  INNER  ·  TIDES
        </p>

        <button
          onClick={onEnter}
          className="btn-ink"
          style={{
            marginTop: 64,
            animation: "fadeInUp 1.4s ease 2.1s both",
          }}
        >
          <span>推 门 而 入</span>
        </button>

        <div style={{
          marginTop: 24,
          fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: "0.3em", color: "var(--text-faint)",
          animation: "fadeIn 2s ease 2.4s both",
        }}>
          今夜  ·  辰月初七  ·  月相  上弦
        </div>
      </div>

      {/* 四角古纹装饰 */}
      <div style={{ position: "absolute", top: 32, left: 32, animation: "fadeIn 2s ease 2s both" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 0 L60 0 L60 1 L1 1 L1 60 L0 60 Z" fill="var(--gold)" opacity="0.5" />
          <circle cx="8" cy="8" r="2" fill="var(--gold)" opacity="0.6" />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 32, right: 32, animation: "fadeIn 2s ease 2s both" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M60 0 L0 0 L0 1 L59 1 L59 60 L60 60 Z" fill="var(--gold)" opacity="0.5" />
          <circle cx="52" cy="8" r="2" fill="var(--gold)" opacity="0.6" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: 32, animation: "fadeIn 2s ease 2s both" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L60 60 L60 59 L1 59 L1 0 L0 0 Z" fill="var(--gold)" opacity="0.5" />
          <circle cx="8" cy="52" r="2" fill="var(--gold)" opacity="0.6" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 32, right: 32, animation: "fadeIn 2s ease 2s both" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M60 60 L0 60 L0 59 L59 59 L59 0 L60 0 Z" fill="var(--gold)" opacity="0.5" />
          <circle cx="52" cy="52" r="2" fill="var(--gold)" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------
   场景 2 · 主页 (Dashboard)
   ------------------------------------------- */
function HomeScene({ onNav }) {
  const tiles = [
    { id: "dream",    name: "解  梦",   sub: "DREAM",       desc: "述说你今晚的梦境，听见心底的回响。",   icon: "moon",     accent: "var(--moonglow)" },
    { id: "fortune",  name: "今日签", sub: "DAILY · SIGN", desc: "十五意象之中，抽一签照见今日。",     icon: "lamp",     accent: "var(--gold)" },
    { id: "portrait", name: "画  像",   sub: "PORTRAIT",    desc: "星座与人格之深处，藏着一张自己。",   icon: "mirror",   accent: "var(--jade)" },
    { id: "lantern",  name: "河  灯",   sub: "LANTERN",     desc: "把心事写进河灯，看见别人也在放灯。", icon: "lantern",  accent: "#d68f5c" },
    { id: "calendar", name: "月  历",   sub: "CALENDAR",    desc: "整个月的梦与签，连成一片潮汐。",     icon: "calendar", accent: "#9bb0c4" },
    { id: "symbols",  name: "星  图",   sub: "CONSTELLATION", desc: "梦里反复出现的物，连成你的星座。",  icon: "stars",    accent: "#d4a574" },
    { id: "scroll",   name: "卷  轴",   sub: "SCROLLS",     desc: "翻开过往的梦与签，一卷夜话。",       icon: "scroll",   accent: "#a8a0c4" },
    { id: "tonight",  name: "今  夜",   sub: "TONIGHT",     desc: "",                                   icon: "sky",      accent: "#7b9ab8", display: true },
  ];

  const greeting = window.YY_GREETING();
  // 替换 tonight 的描述为时段感知
  tiles[7].desc = greeting.hour + " · " + greeting.phrase;

  return (
    <div style={{
      position: "fixed", inset: 0,
      paddingTop: 96, paddingBottom: 30, paddingLeft: 40, paddingRight: 40,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* 顶部 hero */}
      <header style={{ textAlign: "center", marginBottom: 22, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 }}>
          <OrnateDivider width={120} />
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "var(--moon-white)", letterSpacing: "0.3em" }}>夜话</span>
          <OrnateDivider width={120} />
        </div>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--text-secondary)", letterSpacing: "0.18em", marginTop: 4 }}>
          {greeting.phrase}
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-faint)", marginTop: 6 }}>
          {greeting.en}
        </p>
      </header>

      {/* 卡片网格 —— 4列2行 */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "1fr 1fr",
        gap: 18,
        maxWidth: 1480,
        width: "100%",
        margin: "0 auto",
        minHeight: 0,
      }}>
        {tiles.map((t, i) => (
          <HomeTile key={t.id} tile={t} delay={i * 0.06} onClick={() => !t.display && onNav(t.id)} idx={i} />
        ))}
      </div>

      <div style={{
        marginTop: 14, textAlign: "center",
        fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: "0.4em", color: "var(--text-faint)",
        animation: "fadeIn 1.2s ease 0.8s both",
      }}>
        若 有 所 思  ·  便 有 所 语  ·  IF  YOU  HAVE  THOUGHTS,  YOU  HAVE  WORDS
      </div>
    </div>
  );
}

function HomeTile({ tile, delay, onClick, idx }) {
  const ref = useRefA(null);
  const [tilt, setTilt] = useStateA({ x: 0, y: 0 });
  const [hover, setHover] = useStateA(false);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setTilt({ x, y });
  };
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setHover(false); };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: "relative",
        borderRadius: 4,
        cursor: tile.display ? "default" : "pointer",
        animation: `fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
        transformStyle: "preserve-3d",
        transform: `perspective(900px) rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 4}deg) translateZ(0)`,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="glass" style={{
        height: "100%",
        padding: "22px 22px 20px",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 170,
        background: hover
          ? "linear-gradient(135deg, rgba(244,236,216,0.07) 0%, rgba(201,169,110,0.04) 100%)"
          : "rgba(244,236,216,0.035)",
        borderColor: hover ? "var(--glass-border-strong)" : "var(--glass-border)",
        transition: "all 0.5s ease",
        overflow: "hidden",
      }}>
        <CornerDeco />

        {/* 光晕跟随 */}
        {hover && (
          <div style={{
            position: "absolute",
            width: 240, height: 240, borderRadius: "50%",
            background: `radial-gradient(circle, ${tile.accent}30 0%, transparent 70%)`,
            top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translate(${tilt.x * 60}px, ${tilt.y * 60}px)`,
            pointerEvents: "none",
            filter: "blur(10px)",
          }} />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div style={{ width: 42, height: 42 }}>
            <TileIcon name={tile.icon} color={tile.accent} />
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: "0.3em", color: "var(--text-tertiary)",
            paddingTop: 6,
          }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 30, letterSpacing: "0.15em",
            color: "var(--moon-white)",
            marginBottom: 4,
            fontWeight: 400,
          }}>
            {tile.name}
          </h2>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: "0.35em", color: tile.accent,
            opacity: 0.85, marginBottom: 10,
          }}>
            {tile.sub}
          </div>
          <p style={{
            fontFamily: "var(--font-serif)", fontSize: 12.5,
            color: "var(--text-secondary)", lineHeight: 1.7,
            letterSpacing: "0.04em",
          }}>
            {tile.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// 简单的 icon 组件
function TileIcon({ name, color }) {
  const s = 52;
  const stroke = color || "var(--gold)";
  switch (name) {
    case "moon":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <circle cx="26" cy="26" r="18" stroke={stroke} strokeWidth="1" opacity="0.4" />
          <path d="M34 16 A18 18 0 1 0 34 36 A12 12 0 1 1 34 16 Z" fill={stroke} opacity="0.85" />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <path d="M26 10 L26 16 M22 16 L30 16 M19 16 L19 22 L33 22 L33 16 Z" stroke={stroke} strokeWidth="1" />
          <path d="M17 22 L35 22 L33 40 L19 40 Z" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.15" />
          <circle cx="26" cy="32" r="3" fill={stroke} opacity="0.8" />
          <path d="M22 42 L30 42 M24 45 L28 45" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "mirror":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <ellipse cx="26" cy="22" rx="14" ry="16" stroke={stroke} strokeWidth="1" />
          <ellipse cx="26" cy="22" rx="10" ry="12" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <path d="M22 38 L30 38 L28 46 L24 46 Z" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.1" />
          <path d="M20 48 L32 48" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <path d="M22 8 L30 8 M26 8 L26 12" stroke={stroke} strokeWidth="1" />
          <ellipse cx="26" cy="26" rx="14" ry="12" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.12" />
          <line x1="14" y1="26" x2="38" y2="26" stroke={stroke} strokeWidth="0.5" opacity="0.6" />
          <path d="M22 40 L30 40 L28 46 L24 46 Z" stroke={stroke} strokeWidth="1" />
          <path d="M10 30 Q 18 34, 14 38" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <path d="M42 30 Q 34 34, 38 38" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        </svg>
      );
    case "scroll":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <rect x="12" y="14" width="28" height="24" stroke={stroke} strokeWidth="1" />
          <circle cx="12" cy="14" r="3" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.2" />
          <circle cx="40" cy="14" r="3" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.2" />
          <circle cx="12" cy="38" r="3" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.2" />
          <circle cx="40" cy="38" r="3" stroke={stroke} strokeWidth="1" fill={stroke} fillOpacity="0.2" />
          <line x1="18" y1="22" x2="34" y2="22" stroke={stroke} strokeWidth="0.5" opacity="0.7" />
          <line x1="18" y1="26" x2="34" y2="26" stroke={stroke} strokeWidth="0.5" opacity="0.7" />
          <line x1="18" y1="30" x2="28" y2="30" stroke={stroke} strokeWidth="0.5" opacity="0.7" />
        </svg>
      );
    case "sky":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <circle cx="18" cy="20" r="8" stroke={stroke} strokeWidth="1" opacity="0.6" />
          <circle cx="22" cy="20" r="8" fill={stroke} fillOpacity="0.5" />
          <circle cx="36" cy="14" r="1" fill={stroke} />
          <circle cx="40" cy="24" r="1.2" fill={stroke} />
          <circle cx="32" cy="32" r="0.8" fill={stroke} />
          <path d="M8 42 Q 18 38, 26 42 T 44 42" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          <rect x="8" y="12" width="36" height="32" stroke={stroke} strokeWidth="1" />
          <line x1="8" y1="20" x2="44" y2="20" stroke={stroke} strokeWidth="0.7" />
          <line x1="16" y1="8" x2="16" y2="14" stroke={stroke} strokeWidth="1" />
          <line x1="36" y1="8" x2="36" y2="14" stroke={stroke} strokeWidth="1" />
          {/* mini moons */}
          <circle cx="16" cy="28" r="2.5" stroke={stroke} strokeWidth="0.6" fill={stroke} fillOpacity="0.3" />
          <circle cx="26" cy="28" r="2.5" fill={stroke} fillOpacity="0.8" />
          <circle cx="36" cy="28" r="2.5" stroke={stroke} strokeWidth="0.6" />
          <circle cx="16" cy="36" r="2" fill={stroke} fillOpacity="0.5" />
          <circle cx="26" cy="36" r="2" fill={stroke} fillOpacity="0.6" />
        </svg>
      );
    case "stars":
      return (
        <svg viewBox="0 0 52 52" width={s} height={s} fill="none">
          {/* constellation pattern */}
          <line x1="12" y1="14" x2="24" y2="22" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <line x1="24" y1="22" x2="36" y2="16" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <line x1="24" y1="22" x2="30" y2="38" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <line x1="30" y1="38" x2="42" y2="36" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <line x1="30" y1="38" x2="14" y2="40" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          {/* stars */}
          <circle cx="12" cy="14" r="2.2" fill={stroke} />
          <circle cx="24" cy="22" r="3.5" fill={stroke} />
          <circle cx="36" cy="16" r="2" fill={stroke} />
          <circle cx="30" cy="38" r="2.8" fill={stroke} />
          <circle cx="42" cy="36" r="1.8" fill={stroke} />
          <circle cx="14" cy="40" r="2" fill={stroke} />
          {/* glow on largest */}
          <circle cx="24" cy="22" r="5" fill={stroke} fillOpacity="0.2" />
        </svg>
      );
    default: return null;
  }
}

/* -------------------------------------------
   场景 3 · 解梦
   ------------------------------------------- */
function DreamScene({ globalStyle }) {
  const [dream, setDream] = useStateA("");
  const [style, setStyle] = useStateA(globalStyle || "gentle");
  const [stage, setStage] = useStateA("input"); // input | analyzing | result
  const [resultKey, setResultKey] = useStateA(0);
  const [apiResult, setApiResult] = useStateA(null);
  const [errMsg, setErrMsg]       = useStateA("");

  useEffectA(() => { if (globalStyle) setStyle(globalStyle); }, [globalStyle]);

  const onInterpret = async () => {
    if (!dream.trim()) return;
    setErrMsg("");
    setStage("analyzing");
    const start = Date.now();
    try {
      const data = await window.YY_API("/api/dream", {
        dream:        dream.trim(),
        style,
        user_context: window.YY_CTX.forApi(),
      });
      // 至少 1.6s 的"沉淀"，避免接口太快导致动画一闪而过
      const elapsed = Date.now() - start;
      if (elapsed < 1600) await new Promise(r => setTimeout(r, 1600 - elapsed));
      // 防御性补齐（AI 偶尔会漏字段）
      const safe = {
        title:      data.title      || "夜里的影子",
        stanzas:    Array.isArray(data.stanzas) && data.stanzas.length
                      ? data.stanzas
                      : ["梦没有说完。", "你也没有说完。", "今夜先停在这。", "其余留给明天的醒。"],
        psychology: data.psychology || "—",
        symbolism:  data.symbolism  || "—",
        keywords:   data.keywords   || [],
        symbols:    data.symbols    || [],
        moodColor:  data.moodColor  || "#5B7E9C",
        quote:      data.quote      || data.share_quote || "夜还长，慢慢走。",
        _mock:      data._mock      || false,
      };
      window.YY_CTX.recordDream({ ...safe, mood_color: safe.moodColor });
      setApiResult(safe);
      setStage("result");
      setResultKey(k => k + 1);
    } catch (e) {
      console.warn("[夜语] 接口失败，回退本地：", e);
      setErrMsg("接口暂不可达，先用本地之声陪你。");
      const elapsed = Date.now() - start;
      if (elapsed < 1600) await new Promise(r => setTimeout(r, 1600 - elapsed));
      setApiResult(window.YY_DATA.dreamResults[style] || window.YY_DATA.dreamResults.gentle);
      setStage("result");
      setResultKey(k => k + 1);
    }
  };

  const result = apiResult || window.YY_DATA.dreamResults[style];

  // AI 语义响应：当处于 result 状态时，让背景 / 粒子贴近本次梦的情绪
  const activeMood = stage === "result" ? result.moodColor : null;
  const activeSymbols = stage === "result" ? result.symbols : null;

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 100, paddingBottom: 40, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <MoodAura moodColor={activeMood} intensity={0.35} active={!!activeMood} />
      <SymbolDrift symbols={activeSymbols} />

      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 8 }}>
          DREAM  ·  INTERPRETATION
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          解  梦
        </h2>
      </div>

      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: stage === "result" ? "0.9fr 1.4fr" : "1fr",
        gap: 28, maxWidth: 1340, width: "100%", margin: "0 auto",
        transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
        minHeight: 0,
      }}>

        {/* 输入面板 */}
        <div className="glass gold-frame" style={{
          padding: 36, display: "flex", flexDirection: "column",
          animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
          minHeight: 0,
        }}>
          <CornerDeco />
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--moon-white)", letterSpacing: "0.2em" }}>
              述说你今晚的梦
            </span>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.3em", marginTop: 4 }}>
              TELL  ·  THE  ·  DREAM
            </div>
          </label>

          <textarea
            value={dream}
            onChange={e => setDream(e.target.value)}
            placeholder={"梦见自己在追一辆车，跑得很快但永远赶不上…"}
            style={{
              flex: 1, minHeight: 200,
              background: "rgba(8,17,31,0.4)",
              border: "1px solid var(--glass-border)",
              padding: 22,
              fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.9,
              color: "var(--moon-white)",
              outline: "none", resize: "none",
              letterSpacing: "0.05em",
              borderRadius: 2,
            }}
          />

          <div style={{ marginTop: 28, paddingBottom: 6 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--text-tertiary)", marginBottom: 14 }}>
              选  ·  风  ·  格
            </div>
            <StyleSelector value={style} onChange={setStyle} />
          </div>

          <button
            onClick={onInterpret}
            disabled={!dream.trim() || stage === "analyzing"}
            className="btn-ink"
            style={{
              marginTop: 36,
              opacity: dream.trim() ? 1 : 0.35,
              cursor: dream.trim() ? "pointer" : "not-allowed",
            }}
          >
            <span>{stage === "analyzing" ? "解  读  中…" : "解  读  此  梦"}</span>
          </button>

          {/* 示例提示 */}
          <button
            onClick={() => setDream("梦见自己一直在跑，去赶一辆夜行的车。车开得很慢，但我跑再快也追不上。月光照在铁轨上，发出像水一样的反光。")}
            style={{
              marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.2em", color: "var(--text-faint)", textAlign: "left",
              transition: "color 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold-soft)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
          >
            ↳ 试一段示例梦境
          </button>
        </div>

        {/* 结果面板 */}
        {stage !== "input" && (
          <div key={resultKey} className="glass gold-frame" style={{
            padding: "40px 40px 36px", position: "relative",
            display: "flex", flexDirection: "column",
            animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) both",
            overflow: "hidden", minHeight: 0,
          }}>
            <CornerDeco />

            {stage === "analyzing" && (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 24,
              }}>
                <div style={{ animation: "spin-slow 12s linear infinite" }}>
                  <Moon size={120} phase={0.5} />
                </div>
                <Whisper text="意象正在沉淀⋯" speed={140}
                  className=""
                  as="div"
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em", color: "var(--text-tertiary)" }}>
                  INTERPRETING  ·  THE  ·  WHISPER
                </div>
              </div>
            )}

            {stage === "result" && <DreamResult result={result} userDream={dream} />}
          </div>
        )}
      </div>
    </div>
  );
}

function DreamResult({ result, userDream }) {
  const [tab, setTab] = useStateA("verses");
  const [showOriginal, setShowOriginal] = useStateA(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--text-tertiary)" }}>
              DREAM  ·  TITLE
            </span>
            {userDream && (
              <button onClick={() => setShowOriginal(s => !s)} style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.25em",
                color: "var(--gold-soft)", padding: "2px 8px",
                border: "1px solid var(--gold-faint)",
              }}>
                {showOriginal ? "收 起" : "原 文"}
              </button>
            )}
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, letterSpacing: "0.12em", color: "var(--moon-white)", lineHeight: 1.2 }}>
            {result.title}
          </h3>
          {showOriginal && userDream && (
            <div style={{
              marginTop: 14, padding: "12px 16px",
              background: "rgba(8,17,31,0.5)", border: "1px solid var(--glass-border)",
              fontFamily: "var(--font-hand)", fontSize: 16, lineHeight: 1.9,
              color: "var(--text-secondary)", letterSpacing: "0.06em",
              animation: "fadeInUp 0.4s ease both",
            }}>
              <span style={{ color: "var(--gold-soft)", marginRight: 8 }}>"</span>
              {userDream}
              <span style={{ color: "var(--gold-soft)", marginLeft: 8 }}>"</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${result.moodColor}cc, ${result.moodColor}33)`,
            boxShadow: `0 0 20px ${result.moodColor}66`,
          }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-tertiary)", letterSpacing: "0.2em" }}>
            {result.moodColor}
          </span>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 28, marginBottom: 22, borderBottom: "1px solid var(--glass-border)", paddingBottom: 12 }}>
        {[
          { id: "verses",     label: "签语" },
          { id: "psychology", label: "心理学" },
          { id: "symbolism",  label: "象征学" },
          { id: "echo",       label: "回声" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              fontFamily: "var(--font-serif)", fontSize: 14, letterSpacing: "0.3em",
              color: tab === t.id ? "var(--gold-soft)" : "var(--text-tertiary)",
              position: "relative", paddingBottom: 8,
              transition: "color 0.3s",
            }}>
            {t.label}
            {tab === t.id && <span style={{
              position: "absolute", left: 0, right: 0, bottom: -13,
              height: 1, background: "var(--gold)",
            }}></span>}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", overflowX: "hidden", paddingRight: 8 }}>
        {tab === "verses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {result.stanzas.map((s, i) => (
              <Whisper
                key={i}
                text={s}
                delay={i * 800}
                speed={75}
                className="verse-line"
                as="p"
              />
            ))}
          </div>
        )}
        {tab === "psychology" && (
          <p style={{
            fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 2.0,
            letterSpacing: "0.05em", color: "var(--text-secondary)",
            animation: "fadeIn 0.6s ease both",
          }}>
            {result.psychology}
          </p>
        )}
        {tab === "symbolism" && (
          <p style={{
            fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 2.0,
            letterSpacing: "0.05em", color: "var(--text-secondary)",
            animation: "fadeIn 0.6s ease both",
          }}>
            {result.symbolism}
          </p>
        )}
        {tab === "echo" && (
          <div style={{ animation: "fadeIn 0.6s ease both" }}>
            <div style={{
              padding: 28, border: "1px solid var(--gold-faint)", borderRadius: 2,
              position: "relative", textAlign: "center",
              background: "rgba(201,169,110,0.04)",
            }}>
              <span style={{
                position: "absolute", top: 8, left: 14,
                fontFamily: "var(--font-display)", fontSize: 48,
                color: "var(--gold-soft)", opacity: 0.6, lineHeight: 1,
              }}>"</span>
              <p style={{
                fontFamily: "var(--font-hand)", fontSize: 26, lineHeight: 1.8,
                letterSpacing: "0.18em", color: "var(--moon-white)",
                padding: "12px 18px",
              }}>
                {result.quote}
              </p>
              <span style={{
                position: "absolute", bottom: -22, right: 14,
                fontFamily: "var(--font-display)", fontSize: 48,
                color: "var(--gold-soft)", opacity: 0.6, lineHeight: 1,
              }}>"</span>
            </div>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <span className="seal" style={{ animation: "seal-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>夜语之印</span>
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--glass-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {result.keywords.map(k => (
            <span key={k} style={{
              padding: "5px 12px", border: "1px solid var(--glass-border)",
              fontFamily: "var(--font-serif)", fontSize: 12,
              color: "var(--text-secondary)", letterSpacing: "0.2em",
              borderRadius: 1,
            }}>{k}</span>
          ))}
        </div>
        <button style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em",
          color: "var(--gold-soft)", padding: "8px 0", whiteSpace: "nowrap",
        }}>
          收 入 卷 轴  →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeScene, HomeScene, DreamScene });
