/* ============================================
   夜语 — 场景 B：今日签 / 自我画像 / 河灯 / 卷轴
   ============================================ */

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

/* -------------------------------------------
   场景 4 · 今日签
   ------------------------------------------- */
function FortuneScene() {
  const signs = window.YY_DATA.fortuneSigns;
  const [stage, setStage] = useStateB("ready"); // ready | drawing | result
  const [drawn, setDrawn] = useStateB(null);
  const [revealed, setRevealed] = useStateB(false);

  const draw = () => {
    setStage("drawing");
    setRevealed(false);
    // 随机选一签
    setTimeout(() => {
      const pick = signs[Math.floor(Math.random() * signs.length)];
      setDrawn(pick);
      setStage("result");
      setTimeout(() => setRevealed(true), 200);
    }, 1800);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 100, paddingBottom: 40, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 16, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 8 }}>
          DAILY  ·  SIGN
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          今日签
        </h2>
        <div style={{ marginTop: 12 }}>
          <OrnateDivider width={200} />
        </div>
      </div>

      <div style={{
        flex: 1, display: "flex",
        alignItems: "center", justifyContent: "center",
        gap: 80, position: "relative",
      }}>
        {/* 签筒 / 抽签区 */}
        <div style={{
          width: 380, height: 480,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <FortuneCanister stage={stage} onDraw={draw} signs={signs} />
        </div>

        {/* 签结果 */}
        <div style={{
          width: 380, minHeight: 480, position: "relative",
          opacity: stage === "result" && revealed ? 1 : 0.15,
          transition: "opacity 0.8s ease",
        }}>
          <SignCard sign={drawn} revealed={revealed} />
        </div>
      </div>

      <div style={{
        textAlign: "center",
        fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: "0.4em", color: "var(--text-faint)",
        marginTop: 16, animation: "fadeIn 1.5s ease 0.6s both",
      }}>
        十五意象  ·  山 河 灯 镜 舟 风 石 桥 井 火 雪 雾 桃 烛 月
      </div>
    </div>
  );
}

function FortuneCanister({ stage, onDraw, signs }) {
  // 签筒视觉：竖立的木质签筒 + 几根签头
  const sticks = stage === "drawing"
    ? Array.from({ length: 8 }, (_, i) => i)
    : Array.from({ length: 6 }, (_, i) => i);

  return (
    <>
      {/* 签头 */}
      <div style={{
        position: "relative",
        width: 200, height: 360,
        marginBottom: 24,
      }}>
        {/* 签筒外壳 */}
        <div style={{
          position: "absolute", left: 26, right: 26, bottom: 0, height: 220,
          background: "linear-gradient(180deg, #2a1f14 0%, #1a1208 100%)",
          border: "1px solid var(--gold-faint)",
          borderRadius: "2px 2px 4px 4px",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.6), 0 0 40px rgba(201,169,110,0.15)",
        }}>
          {/* 描金箍 */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 1, background: "var(--gold)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 1, background: "var(--gold)" }} />
          <div style={{
            position: "absolute", left: 0, right: 0, top: 50, bottom: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            writingMode: "vertical-rl",
            fontFamily: "var(--font-display)", fontSize: 24,
            letterSpacing: "0.4em", color: "var(--gold-soft)", opacity: 0.7,
          }}>
            夜 语 灵 签
          </div>
        </div>

        {/* 签 */}
        <div style={{ position: "absolute", left: 50, right: 50, top: 0, bottom: 180 }}>
          {sticks.map((i) => {
            const offset = (i - sticks.length / 2) * 14;
            const rot = stage === "drawing" ? Math.sin(Date.now() / 200 + i) * 8 : (i - sticks.length / 2) * 2;
            return (
              <div key={i} style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                width: 5, height: 180,
                transform: `translateX(${offset}px) rotate(${rot}deg)`,
                transformOrigin: "bottom center",
                background: "linear-gradient(180deg, #d4b87a 0%, #8a6a30 100%)",
                borderRadius: 1,
                boxShadow: "0 0 4px rgba(201,169,110,0.4)",
                animation: stage === "drawing" ? `drift 0.6s ease-in-out infinite ${i * 0.05}s alternate` : "none",
                transition: "transform 0.4s ease",
              }} />
            );
          })}
        </div>

        {/* 底座 */}
        <div style={{
          position: "absolute", left: 14, right: 14, bottom: -8, height: 14,
          background: "linear-gradient(180deg, #1a1208 0%, #0a0604 100%)",
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
        }} />
      </div>

      <button
        onClick={onDraw}
        disabled={stage === "drawing"}
        className="btn-ink"
        style={{ marginTop: 12 }}
      >
        <span>{stage === "drawing" ? "摇  签  中…" : (stage === "result" ? "再  摇  一  次" : "摇  签  ·  问  今  日")}</span>
      </button>

      <div style={{
        marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: "0.3em", color: "var(--text-faint)",
      }}>
        SHAKE  ·  TO  ·  DRAW
      </div>
    </>
  );
}

function SignCard({ sign, revealed }) {
  if (!sign) {
    return (
      <div className="glass" style={{
        height: 480, display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 14, padding: 40,
        opacity: 0.4,
      }}>
        <CornerDeco />
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--text-tertiary)", letterSpacing: "0.3em" }}>
          签 未 落
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.3em" }}>
          AWAITING  ·  THE  ·  SIGN
        </div>
      </div>
    );
  }

  const levelColor = sign.level.startsWith("上上") ? "#d4b87a"
                    : sign.level.startsWith("上")   ? "#c9a96e"
                    : sign.level.startsWith("中")   ? "#9bb0c4"
                    : "#7c6d5a";

  return (
    <div className="glass gold-frame" style={{
      height: 480, padding: "44px 40px",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      transform: revealed ? "rotateY(0)" : "rotateY(180deg)",
      transition: "transform 1s cubic-bezier(0.16,1,0.3,1)",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
    }}>
      <CornerDeco />

      {/* 顶部签号 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--text-tertiary)" }}>
          NO.  {String(sign.id).padStart(2, "0")}  /  15
        </div>
        <div style={{
          padding: "3px 10px", border: `1px solid ${levelColor}`,
          fontFamily: "var(--font-hand)", fontSize: 13,
          color: levelColor, letterSpacing: "0.3em",
          whiteSpace: "nowrap",
        }}>
          {sign.level}
        </div>
      </div>

      {/* 大字签象 */}
      <div style={{
        marginTop: 6, marginBottom: 14,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <div style={{
          width: 110, height: 110,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid var(--gold-faint)",
          background: "radial-gradient(circle at 30% 30%, rgba(201,169,110,0.10), transparent 70%)",
          position: "relative",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: 72,
            color: "var(--moon-white)",
            textShadow: "0 0 20px rgba(201,169,110,0.3)",
          }}>{sign.sign}</span>
          <span className="corner-deco tl"></span>
          <span className="corner-deco br"></span>
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 400,
            letterSpacing: "0.15em", color: "var(--moon-white)", marginBottom: 8,
          }}>{sign.title}</h3>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.3em" }}>
            {sign.sign === "山" ? "MOUNTAIN" : sign.sign === "河" ? "RIVER" : sign.sign === "灯" ? "LAMP" : sign.sign === "镜" ? "MIRROR" : sign.sign === "舟" ? "BOAT" : sign.sign === "风" ? "WIND" : sign.sign === "石" ? "STONE" : sign.sign === "桥" ? "BRIDGE" : sign.sign === "井" ? "WELL" : sign.sign === "火" ? "FIRE" : sign.sign === "雪" ? "SNOW" : sign.sign === "雾" ? "MIST" : sign.sign === "桃" ? "PEACH" : sign.sign === "烛" ? "CANDLE" : "MOON"}
          </div>
        </div>
      </div>

      {/* 签文 */}
      <div style={{
        margin: "16px 0",
        padding: "22px 26px",
        background: "rgba(201,169,110,0.04)",
        border: "1px solid var(--gold-faint)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -8, left: 20, padding: "0 10px",
          background: "var(--ink-deep)",
          fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--gold-soft)", letterSpacing: "0.3em",
        }}>SIGN  ·  VERSE</div>
        {revealed && (
          <Whisper text={sign.line} speed={120}
            as="p"
            className="verse-line"
          />
        )}
      </div>

      {/* 释义 */}
      <p style={{
        fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.9,
        color: "var(--text-secondary)", letterSpacing: "0.05em",
        marginTop: 12, opacity: revealed ? 1 : 0,
        transition: "opacity 0.8s ease 1.2s",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--gold-soft)", letterSpacing: "0.3em", marginRight: 10 }}>释 · </span>
        {sign.meaning}
      </p>

      {/* 底部章 */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.3em" }}>
          辰月 · 初七 · 23:47
        </span>
        <span className="seal" style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease 1.4s" }}>夜语之印</span>
      </div>
    </div>
  );
}


/* -------------------------------------------
   场景 5 · 自我画像
   ------------------------------------------- */
function PortraitScene({ globalStyle }) {
  const [mode, setMode] = useStateB("mbti"); // mbti | zodiac
  const [selectedId, setSelectedId] = useStateB(null);

  const options = mode === "mbti" ? window.YY_DATA.mbtiTypes : window.YY_DATA.zodiacs;
  const selected = options.find(o => o.id === selectedId);

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 100, paddingBottom: 40, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", marginBottom: 16, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 8 }}>
          SELF  ·  PORTRAIT
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          自我画像
        </h2>

        {/* 模式切换 */}
        <div style={{ marginTop: 22, display: "inline-flex", border: "1px solid var(--glass-border)", padding: 4 }}>
          {[{ id: "mbti", label: "MBTI · 16 型" }, { id: "zodiac", label: "星座 · 12 宫" }].map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setSelectedId(null); }}
              style={{
                padding: "8px 22px",
                fontFamily: "var(--font-serif)", fontSize: 13, letterSpacing: "0.25em",
                background: mode === m.id ? "var(--gold)" : "transparent",
                color: mode === m.id ? "var(--ink)" : "var(--text-secondary)",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: selectedId ? "1.1fr 1fr" : "1fr",
        gap: 24, maxWidth: 1400, width: "100%", margin: "0 auto",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        minHeight: 0, paddingTop: 8,
      }}>
        {/* 选择区 */}
        <div style={{ overflow: "auto", paddingRight: 4 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: selectedId ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: 12,
          }}>
            {options.map((o, i) => (
              <PortraitTile
                key={o.id}
                option={o}
                mode={mode}
                selected={selectedId === o.id}
                onClick={() => setSelectedId(o.id)}
                delay={i * 0.06}
              />
            ))}
          </div>
        </div>

        {/* 解读区 */}
        {selectedId && (
          <div className="glass gold-frame" style={{
            padding: "36px 40px", position: "relative",
            animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
            overflow: "auto",
          }} key={selected.id}>
            <CornerDeco />
            <PortraitReading option={selected} mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
}

function PortraitTile({ option, mode, selected, onClick, delay }) {
  const [hover, setHover] = useStateB(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass"
      style={{
        padding: 16, textAlign: "left",
        background: selected
          ? "linear-gradient(135deg, rgba(201,169,110,0.14), rgba(201,169,110,0.04))"
          : (hover ? "rgba(244,236,216,0.06)" : "rgba(244,236,216,0.025)"),
        borderColor: selected ? "var(--gold)" : (hover ? "var(--glass-border-strong)" : "var(--glass-border)"),
        transition: "all 0.4s ease",
        animation: `fadeInUp 0.7s ease ${delay}s both`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        minHeight: 132,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${option.color}66`,
          background: `radial-gradient(circle, ${option.color}22, transparent 80%)`,
        }}>
          <span style={{
            fontFamily: mode === "zodiac" ? "var(--font-serif)" : "var(--font-mono)",
            fontSize: mode === "zodiac" ? 22 : 11, fontWeight: 500,
            color: option.color, letterSpacing: "0.05em",
          }}>
            {mode === "zodiac" ? option.symbol : option.id}
          </span>
        </div>
        <span style={{
          fontFamily: "var(--font-hand)", fontSize: 13,
          color: option.color, letterSpacing: "0.2em", opacity: 0.85,
        }}>
          {mode === "zodiac" ? option.word : (option.element || "·").split("之")[0]}
        </span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 400,
        letterSpacing: "0.08em", color: "var(--moon-white)", marginBottom: 4,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{option.title}</h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em", color: option.color, marginBottom: 8, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {mode === "mbti" ? option.element : option.dates}
      </div>
    </button>
  );
}

function PortraitReading({ option, mode }) {
  const [aspect, setAspect] = useStateB("core");
  const [rerollKey, setRerollKey] = useStateB(0);
  const aspects = mode === "mbti"
    ? [
        { id: "core",   label: "核 · CORE",   text: option.core },
        { id: "love",   label: "爱 · LOVE",   text: option.love },
        { id: "shadow", label: "影 · SHADOW", text: option.shadow },
      ]
    : [{ id: "core", label: option.word + "  ·  " + option.id.toUpperCase(), text: option.line }];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: option.color, marginBottom: 8 }}>
            {mode === "mbti" ? option.id + "  ·  " + option.element : option.id.toUpperCase() + "  ·  " + option.symbol}
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, letterSpacing: "0.15em", color: "var(--moon-white)" }}>
            {option.title}
          </h3>
        </div>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${option.color}aa, ${option.color}22)`,
          boxShadow: `0 0 30px ${option.color}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: mode === "zodiac" ? "var(--font-serif)" : "var(--font-mono)",
          fontSize: mode === "zodiac" ? 32 : 14,
          color: "var(--moon-white)", letterSpacing: "0.1em",
        }}>
          {mode === "zodiac" ? option.symbol : option.id}
        </div>
      </div>

      {/* AI 重写 + 维度切换 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {aspects.map(a => (
            <button key={a.id} onClick={() => setAspect(a.id)}
              style={{
                padding: "5px 12px", border: `1px solid ${aspect === a.id ? option.color : "var(--glass-border)"}`,
                background: aspect === a.id ? `${option.color}22` : "transparent",
                color: aspect === a.id ? "var(--moon-white)" : "var(--text-tertiary)",
                fontFamily: "var(--font-serif)", fontSize: 12, letterSpacing: "0.15em",
                transition: "all 0.3s", whiteSpace: "nowrap",
              }}>
              {a.label}
            </button>
          ))}
        </div>
        <button onClick={() => setRerollKey(k => k + 1)}
          style={{
            padding: "5px 12px", border: "1px solid var(--gold-faint)",
            color: "var(--gold-soft)", fontFamily: "var(--font-mono)",
            fontSize: 10, letterSpacing: "0.3em", whiteSpace: "nowrap",
          }}>
          ✦  AI  重  写
        </button>
      </div>

      {aspects.filter(a => a.id === aspect).map(a => (
        <Section key={a.id + "-" + rerollKey} title={a.label} verse={a.text} />
      ))}

      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="seal">夜语之印</span>
        <button style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--gold-soft)", whiteSpace: "nowrap",
        }}>
          收 入 卷 轴  →
        </button>
      </div>
    </div>
  );
}

function Section({ title, verse }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em",
        color: "var(--gold-soft)", marginBottom: 10,
      }}>
        {title}
      </div>
      <Whisper text={verse} speed={45} as="p" className="verse-line" />
    </div>
  );
}


/* -------------------------------------------
   场景 6 · 河灯共鸣池
   ------------------------------------------- */
function LanternScene() {
  const [lanterns, setLanterns] = useStateB(window.YY_DATA.lanterns);
  const [composing, setComposing] = useStateB(false);
  const [draft, setDraft] = useStateB("");
  const [focused, setFocused] = useStateB(null);
  const [tick, setTick] = useStateB(0);

  // 时间推进 —— 让灯漂流
  useEffectB(() => {
    let raf;
    const loop = () => {
      setTick(t => t + 0.0008);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const release = () => {
    if (!draft.trim()) return;
    const newLantern = {
      id: "u" + Date.now(),
      text: draft.trim(),
      echo: 0,
      distance: 0,
      mine: true,
    };
    setLanterns(prev => [newLantern, ...prev]);
    setDraft("");
    setComposing(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 90, paddingBottom: 40, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 12, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 8 }}>
          LANTERN  ·  POOL
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          月下放灯
        </h2>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 17, color: "var(--text-secondary)", letterSpacing: "0.2em", marginTop: 10 }}>
          把心事写进河灯，看一看别人也在放灯
        </p>
      </div>

      {/* 河面 */}
      <div style={{
        position: "relative", flex: 1, overflow: "hidden",
        margin: "0 auto", maxWidth: 1340, width: "100%",
        borderTop: "1px solid var(--gold-faint)",
        borderBottom: "1px solid var(--gold-faint)",
      }}>
        {/* 远景月在水中倒影 */}
        <div style={{
          position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)",
          width: 100, height: 30,
          background: "radial-gradient(ellipse, rgba(244,236,216,0.25), transparent 70%)",
          filter: "blur(8px)",
        }} />
        {/* 水波纹 */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none" viewBox="0 0 1200 600">
          {Array.from({ length: 12 }).map((_, i) => {
            const y = 50 + i * 45;
            const w = 0.4 + (i % 3) * 0.2;
            return (
              <path
                key={i}
                d={`M -50 ${y} Q 200 ${y - 4 - i % 2 * 2} 600 ${y} T 1250 ${y}`}
                stroke="rgba(106,139,191,0.18)"
                strokeWidth={w}
                fill="none"
              />
            );
          })}
        </svg>

        {/* 漂浮的灯 */}
        {lanterns.map((l, i) => {
          // 计算位置：每个灯有 distance 0..1
          const baseY = ((i * 73 + l.id.charCodeAt(0)) % 70 + 15) / 100; // 15% - 85%
          const speed = 0.4 + (l.id.charCodeAt(l.id.length - 1) % 5) * 0.08;
          const xRaw = ((l.distance + tick * speed) % 1.3) - 0.15;
          const yJitter = Math.sin(tick * 60 + i * 1.7) * 0.012;
          const x = xRaw * 100;
          const y = (baseY + yJitter) * 100;
          return (
            <Lantern
              key={l.id}
              lantern={l}
              x={x}
              y={y}
              focused={focused === l.id}
              onClick={() => setFocused(focused === l.id ? null : l.id)}
            />
          );
        })}

        {/* 焦点灯文 */}
        {focused && (
          <div style={{
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            maxWidth: 520, padding: "20px 28px",
            background: "rgba(8,17,31,0.85)", backdropFilter: "blur(12px)",
            border: "1px solid var(--gold-faint)",
            animation: "fadeInUp 0.5s ease both",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-hand)", fontSize: 22,
              color: "var(--moon-white)", letterSpacing: "0.15em", lineHeight: 1.7,
            }}>
              "{lanterns.find(l => l.id === focused)?.text}"
            </p>
            <div style={{
              marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.3em", color: "var(--text-tertiary)",
            }}>
              此灯已被回响  ·  {lanterns.find(l => l.id === focused)?.echo} ·  次
            </div>
          </div>
        )}

        {/* 放灯按钮 */}
        {!composing && (
          <button
            onClick={() => setComposing(true)}
            style={{
              position: "absolute", bottom: 30, right: 30,
              padding: "14px 28px",
              background: "rgba(201,169,110,0.15)",
              border: "1px solid var(--gold)",
              color: "var(--moon-white)",
              fontFamily: "var(--font-serif)", fontSize: 14,
              letterSpacing: "0.3em",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,110,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,169,110,0.15)"; }}
          >
            ✦  放 一 盏 灯
          </button>
        )}

        {/* 编写河灯 */}
        {composing && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(8,17,31,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.4s ease both",
          }}>
            <div className="glass gold-frame" style={{
              padding: 36, width: 540, position: "relative",
              background: "rgba(20,30,50,0.8)",
            }}>
              <CornerDeco />
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--moon-white)", letterSpacing: "0.25em", marginBottom: 8 }}>
                把心事写进河灯
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.3em", marginBottom: 18 }}>
                WRITE  ·  YOUR  ·  WHISPER  ·  ANONYMOUSLY
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value.slice(0, 60))}
                placeholder="一句话，不超过 60 字。它会匿名漂在夜河上。"
                style={{
                  width: "100%", minHeight: 100,
                  background: "rgba(8,17,31,0.5)",
                  border: "1px solid var(--glass-border)",
                  padding: 16, fontFamily: "var(--font-serif)",
                  fontSize: 16, color: "var(--moon-white)",
                  outline: "none", resize: "none",
                  letterSpacing: "0.05em", lineHeight: 1.7,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.2em" }}>
                  {draft.length} / 60
                </span>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => { setComposing(false); setDraft(""); }} style={{
                    padding: "10px 22px", border: "1px solid var(--glass-border)",
                    color: "var(--text-tertiary)", fontFamily: "var(--font-serif)", fontSize: 13, letterSpacing: "0.25em",
                  }}>取  消</button>
                  <button onClick={release} disabled={!draft.trim()} className="btn-ink" style={{ padding: "10px 22px", fontSize: 13, opacity: draft.trim() ? 1 : 0.3 }}>
                    <span>放  入  夜  河</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        textAlign: "center", marginTop: 16,
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--text-faint)",
      }}>
        点 击 任 一 河 灯  ·  听 见 那 段 低 语
      </div>
    </div>
  );
}

function Lantern({ lantern, x, y, focused, onClick }) {
  if (x < -8 || x > 108) return null;
  const isMine = lantern.mine;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        opacity: x < 0 || x > 100 ? 0.3 : 1,
        transition: "opacity 0.5s",
        zIndex: focused ? 10 : 1,
      }}
    >
      <div style={{
        position: "relative",
        animation: `float-up 3s ease-in-out infinite alternate ${(x + y) % 2}s`,
      }}>
        {/* 光晕 */}
        <div style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          background: `radial-gradient(circle, ${isMine ? "#d4b87aaa" : "#e8b86fcc"} 0%, transparent 70%)`,
          filter: "blur(8px)",
          transform: focused ? "scale(1.4)" : "scale(1)",
          transition: "transform 0.4s",
        }} />
        {/* 灯身 */}
        <svg width="36" height="44" viewBox="0 0 36 44" style={{ position: "relative", display: "block" }}>
          {/* 顶 */}
          <path d="M14 4 L22 4 M18 4 L18 8" stroke="var(--gold)" strokeWidth="0.5" fill="none" />
          {/* 灯笼 */}
          <ellipse cx="18" cy="20" rx="13" ry="11"
            fill={`url(#lantern-glow-${lantern.id})`}
            stroke="var(--gold)"
            strokeWidth="0.5"
          />
          <line x1="5" y1="20" x2="31" y2="20" stroke="var(--gold)" strokeWidth="0.3" opacity="0.6" />
          {/* 流苏 */}
          <line x1="18" y1="31" x2="18" y2="38" stroke="var(--gold)" strokeWidth="0.5" />
          <path d="M16 38 L20 38 L19 42 L17 42 Z" fill="var(--gold)" opacity="0.7" />
          <defs>
            <radialGradient id={`lantern-glow-${lantern.id}`} cx="50%" cy="40%">
              <stop offset="0%" stopColor="#fdf6e3" stopOpacity="0.95" />
              <stop offset="60%" stopColor={isMine ? "#d4b87a" : "#e8a878"} stopOpacity="0.7" />
              <stop offset="100%" stopColor={isMine ? "#a08245" : "#a06850"} stopOpacity="0.5" />
            </radialGradient>
          </defs>
        </svg>
        {/* 水中倒影 */}
        <div style={{
          position: "absolute", left: "50%", top: "100%",
          transform: "translateX(-50%) scaleY(-1)",
          opacity: 0.25, filter: "blur(2px)",
        }}>
          <svg width="36" height="20" viewBox="0 0 36 24">
            <ellipse cx="18" cy="12" rx="13" ry="8"
              fill={isMine ? "#d4b87a" : "#e8a878"}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}


/* -------------------------------------------
   场景 7 · 我的卷轴
   ------------------------------------------- */
function ScrollScene() {
  const items = window.YY_DATA.history;
  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 100, paddingBottom: 40, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", marginBottom: 14, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 8 }}>
          MY  ·  SCROLLS
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          我的卷轴
        </h2>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 17, color: "var(--text-secondary)", letterSpacing: "0.2em", marginTop: 10 }}>
          所有夜里 · 你曾说过的话
        </p>
      </div>

      {/* 卷轴主体 */}
      <div style={{
        flex: 1, position: "relative",
        maxWidth: 1340, width: "100%", margin: "0 auto",
        display: "flex",
        overflow: "hidden",
      }}>
        {/* 左轴 */}
        <ScrollRoller side="left" />
        {/* 卷面 */}
        <div style={{
          flex: 1,
          background:
            "linear-gradient(180deg, rgba(244,236,216,0.04) 0%, rgba(244,236,216,0.025) 100%), " +
            "repeating-linear-gradient(90deg, transparent 0, transparent 80px, rgba(201,169,110,0.04) 80px, rgba(201,169,110,0.04) 81px)",
          borderTop: "1px solid var(--gold-faint)",
          borderBottom: "1px solid var(--gold-faint)",
          padding: "32px 40px",
          overflowX: "auto", overflowY: "hidden",
          position: "relative",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ display: "flex", gap: 24, height: "100%", minWidth: "min-content" }}>
            {items.map((it, i) => (
              <ScrollEntry key={it.id} item={it} delay={i * 0.08} />
            ))}
            <div style={{
              minWidth: 240, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
              border: "1px dashed var(--glass-border)", padding: 24,
              opacity: 0.5,
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--gold-soft)" }}>+</span>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 17, color: "var(--text-tertiary)", letterSpacing: "0.2em" }}>
                续 · 写
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "var(--text-faint)" }}>
                ADD  ·  NEW
              </span>
            </div>
          </div>
        </div>
        {/* 右轴 */}
        <ScrollRoller side="right" />
      </div>

      <div style={{
        textAlign: "center", marginTop: 18,
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--text-faint)",
      }}>
        向 右 滚 动  ·  展 开 更 多 夜 话
      </div>
    </div>
  );
}

function ScrollRoller({ side }) {
  return (
    <div style={{
      width: 36, position: "relative",
      background: "linear-gradient(180deg, #3a2a14 0%, #1a1208 50%, #3a2a14 100%)",
      borderRadius: 2,
      boxShadow: side === "left" ? "inset -4px 0 8px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.6)" : "inset 4px 0 8px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.6)",
    }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 2, background: "var(--gold)", opacity: 0.7 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 2, background: "var(--gold)", opacity: 0.7 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--gold)", opacity: 0.4 }} />
    </div>
  );
}

function ScrollEntry({ item, delay }) {
  const typeLabel = item.type === "梦" ? "DREAM" : item.type === "签" ? "SIGN" : item.type === "像" ? "SELF" : "LANTERN";
  return (
    <div style={{
      minWidth: 280, height: "100%",
      display: "flex", flexDirection: "column",
      padding: 22,
      background: "rgba(244,236,216,0.025)",
      border: "1px solid var(--glass-border)",
      position: "relative",
      animation: `fadeInUp 0.8s ease ${delay}s both`,
    }}>
      <CornerDeco />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: item.color,
          color: "var(--ink)",
          fontFamily: "var(--font-display)", fontSize: 18,
        }}>
          {item.type}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.2em", whiteSpace: "nowrap" }}>{item.date}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.3em" }}>{typeLabel}</div>
        </div>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400,
        letterSpacing: "0.12em", color: "var(--moon-white)", marginBottom: 12, lineHeight: 1.4,
      }}>
        {item.title}
      </h3>

      <p style={{
        fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.85,
        color: "var(--text-secondary)", letterSpacing: "0.04em",
        flex: 1,
      }}>
        {item.excerpt}
      </p>

      <div style={{
        marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--glass-border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.3em" }}>
          NO. {String(item.id).padStart(3, "0")}
        </span>
        <button style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--gold-soft)", letterSpacing: "0.3em" }}>
          展 开  →
        </button>
      </div>
    </div>
  );
}


Object.assign(window, { FortuneScene, PortraitScene, LanternScene, ScrollScene });
