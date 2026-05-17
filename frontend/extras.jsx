/* ============================================
   夜语 — 新增场景：月相日历 / 意象图谱 / 氛围层
   ============================================ */

const { useState: useStateX, useEffect: useEffectX, useRef: useRefX, useMemo: useMemoX } = React;

/* ============================================
   场景 8 · 月相日历
   ============================================ */
function CalendarScene() {
  const now = new Date();
  const [viewDate, setViewDate] = useStateX(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useStateX(now.getDate());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11
  const monthLabel = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"][month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun

  // 构建格子
  const cells = useMemoX(() => {
    const arr = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const phase = window.YY_MOON_PHASE(date);
      const events = window.YY_DATA.calendarEvents[d] || [];
      arr.push({ day: d, date, phase, events });
    }
    return arr;
  }, [year, month, firstDow, daysInMonth]);

  const events = window.YY_DATA.calendarEvents;
  const selectedEvents = events[selectedDay] || [];
  const selectedPhase = window.YY_MOON_PHASE(new Date(year, month, selectedDay));

  // 整月统计
  const stats = useMemoX(() => {
    let dreams = 0, signs = 0, lanterns = 0, portraits = 0;
    Object.values(events).forEach(arr => {
      arr.forEach(e => {
        if (e.type === "梦") dreams++;
        else if (e.type === "签") signs++;
        else if (e.type === "灯") lanterns++;
        else if (e.type === "像") portraits++;
      });
    });
    return { dreams, signs, lanterns, portraits, total: dreams + signs + lanterns + portraits };
  }, [events]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 90, paddingBottom: 30, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* 标题栏 */}
      <div style={{ textAlign: "center", marginBottom: 14, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 6 }}>
          LUNAR  ·  CALENDAR
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <button onClick={prevMonth} style={navArrow}>← 上 月</button>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 38, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
            {year}  ·  {monthLabel} 月
          </h2>
          <button onClick={nextMonth} style={navArrow}>下 月 →</button>
        </div>
      </div>

      <div style={{
        flex: 1, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28,
        maxWidth: 1340, width: "100%", margin: "0 auto", minHeight: 0,
      }}>
        {/* 日历主体 */}
        <div className="glass gold-frame" style={{
          padding: "26px 30px", display: "flex", flexDirection: "column",
          animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}>
          <CornerDeco />

          {/* 周首字 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 10 }}>
            {["日", "一", "二", "三", "四", "五", "六"].map((w, i) => (
              <div key={w} style={{
                textAlign: "center", padding: 6,
                fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.2em",
                color: i === 0 || i === 6 ? "var(--gold-soft)" : "var(--text-tertiary)",
              }}>{w}</div>
            ))}
          </div>

          {/* 日格 */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 6 }}>
            {cells.map((c, i) => (
              <DayCell
                key={i}
                cell={c}
                selected={c && c.day === selectedDay}
                onClick={() => c && setSelectedDay(c.day)}
              />
            ))}
          </div>
        </div>

        {/* 侧边·当日详情 + 统计 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minHeight: 0 }}>
          {/* 当日 */}
          <div className="glass gold-frame" style={{
            padding: "26px 28px", flex: 1, position: "relative",
            animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
            display: "flex", flexDirection: "column", minHeight: 0,
          }}>
            <CornerDeco />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--text-tertiary)", marginBottom: 4 }}>
                  DAY  {String(selectedDay).padStart(2, "0")}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 400, letterSpacing: "0.15em", color: "var(--moon-white)" }}>
                  {monthLabel}月 · {numToCn(selectedDay)}
                </h3>
                <div style={{ marginTop: 6, fontFamily: "var(--font-hand)", fontSize: 15, color: "var(--text-secondary)", letterSpacing: "0.15em" }}>
                  {phaseToName(selectedPhase)}
                </div>
              </div>
              <Moon size={72} phase={selectedPhase} />
            </div>

            <div style={{ flex: 1, overflow: "auto", paddingRight: 4 }}>
              {selectedEvents.length === 0 ? (
                <div style={{
                  height: "100%", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "var(--font-hand)", fontSize: 18, color: "var(--text-faint)",
                  letterSpacing: "0.2em",
                }}>
                  此 日 静 默 无 言
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em" }}>NO  ·  RECORD</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedEvents.map((e, i) => (
                    <div key={i} style={{
                      padding: "12px 14px",
                      background: "rgba(244,236,216,0.025)",
                      border: "1px solid var(--glass-border)",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <div style={{
                        width: 28, height: 28, flexShrink: 0,
                        background: e.color, color: "var(--ink)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontSize: 15,
                      }}>{e.type}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--moon-white)", letterSpacing: "0.05em" }}>
                          {e.title}
                        </div>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-tertiary)", letterSpacing: "0.2em", whiteSpace: "nowrap" }}>
                        →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 月统计 */}
          <div className="glass" style={{
            padding: "22px 26px", position: "relative",
            animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--gold-soft)", marginBottom: 12 }}>
              MONTH  ·  ECHO
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {[
                { l: "梦", v: stats.dreams,    en: "DREAM" },
                { l: "签", v: stats.signs,     en: "SIGN" },
                { l: "灯", v: stats.lanterns,  en: "LAMP" },
                { l: "像", v: stats.portraits, en: "SELF" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--moon-white)", lineHeight: 1 }}>
                    {String(s.v).padStart(2, "0")}
                  </div>
                  <div style={{ marginTop: 6, fontFamily: "var(--font-hand)", fontSize: 14, color: "var(--gold-soft)", letterSpacing: "0.25em" }}>
                    {s.l}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.3em" }}>
                    {s.en}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--glass-border)",
              textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 14, color: "var(--text-secondary)",
              letterSpacing: "0.18em",
            }}>
              这个月 · 你与潜意识相会 {stats.total} 次
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const navArrow = {
  fontFamily: "var(--font-serif)", fontSize: 13, letterSpacing: "0.3em",
  color: "var(--text-tertiary)", padding: "6px 10px",
  transition: "color 0.3s",
  whiteSpace: "nowrap",
};

function DayCell({ cell, selected, onClick }) {
  const [hover, setHover] = useStateX(false);
  if (!cell) return <div></div>;
  const hasEvent = cell.events.length > 0;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: 6,
        background: selected
          ? "linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.06))"
          : (hover ? "rgba(244,236,216,0.05)" : "transparent"),
        border: selected ? "1px solid var(--gold)" : "1px solid var(--glass-border)",
        cursor: "pointer",
        transition: "all 0.3s",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        minHeight: 70,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
          color: selected ? "var(--moon-white)" : "var(--text-secondary)",
        }}>
          {String(cell.day).padStart(2, "0")}
        </span>
        <div style={{ width: 18, height: 18, opacity: 0.85 }}>
          <Moon size={18} phase={cell.phase} glow={false} />
        </div>
      </div>
      {/* 事件点 */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
        {cell.events.slice(0, 3).map((e, i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: e.color, boxShadow: `0 0 6px ${e.color}99`,
          }} />
        ))}
        {cell.events.length > 3 && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-tertiary)" }}>
            +{cell.events.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}

function numToCn(n) {
  const cn = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (n <= 10) return n === 10 ? "初十" : "初" + cn[n];
  if (n < 20) return "十" + (n === 10 ? "" : cn[n - 10]);
  if (n === 20) return "二十";
  if (n < 30) return "廿" + cn[n - 20];
  if (n === 30) return "三十";
  return "廿" + cn[n - 20] + "/" + n;
}

function phaseToName(p) {
  // 0=新月 / 0.25=上弦 / 0.5=满月 / 0.75=下弦
  if (p < 0.05 || p > 0.95) return "朔 · 新月";
  if (p < 0.20) return "蛾眉月";
  if (p < 0.30) return "上弦月";
  if (p < 0.45) return "盈凸月";
  if (p < 0.55) return "望 · 满月";
  if (p < 0.70) return "亏凸月";
  if (p < 0.80) return "下弦月";
  return "残月";
}

/* ============================================
   场景 9 · 意象图谱（力导向星图）
   ============================================ */
function SymbolGraphScene() {
  const { nodes: rawNodes, links: rawLinks } = window.YY_DATA.symbolGraph;
  const [focusedId, setFocusedId] = useStateX(null);

  // 简单的固定布局 —— 圆形 + 偏置（避免每次渲染重算）
  const layout = useMemoX(() => {
    const N = rawNodes.length;
    const positions = {};
    const cx = 0, cy = 0;
    // 主中心圈
    const sorted = [...rawNodes].sort((a, b) => b.weight - a.weight);
    sorted.forEach((n, i) => {
      // 大节点近中心，小节点更远
      const ring = i < 3 ? 0 : (i < 8 ? 1 : 2);
      const r = ring === 0 ? 90 + i * 12 : ring === 1 ? 200 : 290;
      const seed = (i * 73 + n.id.charCodeAt(0) * 31) % 360;
      const ang = (seed / 360) * Math.PI * 2;
      positions[n.id] = {
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r * 0.72,
      };
    });
    return positions;
  }, [rawNodes]);

  // 当前焦点节点的关联
  const related = useMemoX(() => {
    if (!focusedId) return { ids: new Set(), links: [] };
    const ids = new Set([focusedId]);
    const links = [];
    rawLinks.forEach(([a, b, w]) => {
      if (a === focusedId || b === focusedId) {
        ids.add(a); ids.add(b);
        links.push([a, b, w]);
      }
    });
    return { ids, links };
  }, [focusedId, rawLinks]);

  const focusedNode = focusedId ? rawNodes.find(n => n.id === focusedId) : null;

  const W = 900, H = 620;

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: 90, paddingBottom: 30, paddingLeft: 48, paddingRight: 48,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 12, animation: "fadeInUp 0.8s ease both" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", color: "var(--text-tertiary)", marginBottom: 6 }}>
          SYMBOL  ·  CONSTELLATION
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: "0.2em", color: "var(--moon-white)", fontWeight: 400 }}>
          意象 · 星图
        </h2>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--text-secondary)", letterSpacing: "0.18em", marginTop: 8 }}>
          梦里反复出现的物，连成了你的星座
        </p>
      </div>

      <div style={{
        flex: 1, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24,
        maxWidth: 1340, width: "100%", margin: "0 auto", minHeight: 0,
      }}>
        {/* 星图主体 */}
        <div className="glass gold-frame" style={{
          padding: 12, position: "relative", overflow: "hidden",
          animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}>
          <CornerDeco />

          <svg viewBox={`${-W/2} ${-H/2} ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <radialGradient id="node-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(244,236,216,0.5)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 连线 —— 暗 */}
            {rawLinks.map(([a, b, w], i) => {
              const A = layout[a], B = layout[b];
              if (!A || !B) return null;
              const isRelated = related.ids.has(a) && related.ids.has(b);
              return (
                <line
                  key={i}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={focusedId ? (isRelated ? "var(--gold)" : "rgba(201,169,110,0.06)") : `rgba(201,169,110,${0.08 + w * 0.05})`}
                  strokeWidth={focusedId && isRelated ? 1.5 : 0.6}
                  style={{ transition: "all 0.5s ease" }}
                />
              );
            })}

            {/* 节点 */}
            {rawNodes.map(n => {
              const p = layout[n.id];
              if (!p) return null;
              const isFocused = focusedId === n.id;
              const isRelated = related.ids.has(n.id);
              const dim = focusedId && !isRelated;
              const r = 12 + n.weight * 3;
              return (
                <g
                  key={n.id}
                  transform={`translate(${p.x}, ${p.y})`}
                  onClick={() => setFocusedId(isFocused ? null : n.id)}
                  style={{
                    cursor: "pointer",
                    opacity: dim ? 0.25 : 1,
                    transition: "all 0.5s ease",
                  }}
                >
                  {/* 光晕 */}
                  <circle r={r * 1.6} fill={n.mood} opacity={isFocused ? 0.35 : 0.16}>
                    <animate attributeName="r" values={`${r * 1.6};${r * 1.85};${r * 1.6}`} dur={`${3 + n.weight * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                  {/* 星 */}
                  <circle r={r} fill={n.mood} stroke={isFocused ? "var(--moon-white)" : "var(--gold)"} strokeWidth={isFocused ? 1.5 : 0.5} />
                  {/* 内白点 */}
                  <circle r={r * 0.3} fill="var(--moon-white)" opacity="0.85" />
                  {/* 字 */}
                  <text
                    y={r + 18}
                    textAnchor="middle"
                    fontFamily="var(--font-display)"
                    fontSize={n.weight > 5 ? 17 : 14}
                    fill="var(--moon-white)"
                    letterSpacing="0.1em"
                    style={{ pointerEvents: "none" }}
                  >
                    {n.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 提示 */}
          <div style={{
            position: "absolute", bottom: 16, left: 24,
            fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.3em",
          }}>
            {focusedId ? "再 点 一 次 · 收 起" : "点 击 任 一 意 象 · 看 它 的 关 系"}
          </div>
        </div>

        {/* 解读侧栏 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minHeight: 0 }}>
          <div className="glass gold-frame" style={{
            padding: "26px 28px", flex: 1, position: "relative",
            animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
            display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden",
          }}>
            <CornerDeco />
            {focusedNode ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "auto", paddingRight: 4 }} key={focusedNode.id}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: focusedNode.mood, marginBottom: 8 }}>
                  SYMBOL  ·  {focusedNode.id}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
                  <div style={{
                    width: 64, height: 64, flexShrink: 0,
                    background: `radial-gradient(circle at 30% 30%, ${focusedNode.mood}aa, ${focusedNode.mood}33)`,
                    boxShadow: `0 0 24px ${focusedNode.mood}66`,
                    border: `1px solid ${focusedNode.mood}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--moon-white)" }}>
                      {focusedNode.id}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.12em", color: "var(--moon-white)" }}>
                      出现 {focusedNode.weight} 次
                    </div>
                    <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "var(--text-tertiary)" }}>
                      APPEARED  ·  {focusedNode.weight}  ·  TIMES
                    </div>
                  </div>
                </div>

                <p className="verse-line" style={{ fontSize: 18 }}>{focusedNode.verse}</p>

                <div style={{ marginTop: 18 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--gold-soft)", letterSpacing: "0.3em", marginBottom: 10 }}>
                    与 之 共 现  ·  RELATED
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {related.links.map(([a, b, w], i) => {
                      const other = a === focusedNode.id ? b : a;
                      return (
                        <button key={i} onClick={() => setFocusedId(other)}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid var(--glass-border)",
                            fontFamily: "var(--font-serif)", fontSize: 12,
                            color: "var(--moon-white)", letterSpacing: "0.12em",
                            transition: "all 0.3s", whiteSpace: "nowrap",
                          }}>
                          {other} <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: 10 }}>×{w}</span>
                        </button>
                      );
                    })}
                    {related.links.length === 0 && (
                      <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--text-faint)", letterSpacing: "0.2em" }}>
                        它 是 孤 星
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "8px 4px" }}>
                <Moon size={72} phase={0.5} />
                <div style={{ fontFamily: "var(--font-hand)", fontSize: 19, color: "var(--moon-white)", letterSpacing: "0.2em", marginTop: 4, textAlign: "center" }}>
                  这 是 你 的 心 之 星 图
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "var(--text-secondary)", letterSpacing: "0.05em", textAlign: "center", lineHeight: 1.85 }}>
                  每一颗星 · 是你梦里反复出现的物<br />
                  星与星的连线 · 是它们在同一个梦里出现过
                </div>
              </div>
            )}
          </div>

          {/* 图例 */}
          <div className="glass" style={{
            padding: "18px 24px",
            animation: "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em", color: "var(--gold-soft)", marginBottom: 12 }}>
              LEGEND  ·  天 文 注
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              <LegendItem swatch={<div style={{ width: 14, height: 14, borderRadius: "50%", background: "#c9a96e", boxShadow: "0 0 8px #c9a96e88" }} />} label="光点 = 单次出现" />
              <LegendItem swatch={<div style={{ width: 22, height: 22, borderRadius: "50%", background: "#c9a96e", boxShadow: "0 0 12px #c9a96eaa" }} />} label="星越大 = 出现越多" />
              <LegendItem swatch={<svg width="22" height="14"><line x1="0" y1="7" x2="22" y2="7" stroke="rgba(201,169,110,0.4)" strokeWidth="0.6" /></svg>} label="细线 = 偶尔同现" />
              <LegendItem swatch={<svg width="22" height="14"><line x1="0" y1="7" x2="22" y2="7" stroke="var(--gold)" strokeWidth="1.5" /></svg>} label="粗线 = 常常同现" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ swatch, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {swatch}
      <span style={{ fontFamily: "var(--font-serif)", fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}

/* ============================================
   AI 语义响应层
   ============================================
   背景 / 粒子 / 边光 会随 AI 返回的 mood_color & symbols 改变
   ============================================ */

function MoodAura({ moodColor, intensity = 0.4, active = true }) {
  // 一团缓慢呼吸的色彩雾气，贴近梦境的主情绪
  if (!active || !moodColor) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: -2,
      background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${moodColor}${alphaHex(intensity)}, transparent 70%)`,
      transition: "background 1.6s ease",
      animation: "moodPulse 9s ease-in-out infinite",
    }} />
  );
}

function SymbolDrift({ symbols }) {
  // 把 AI 返回的意象做成漂浮的字 —— 极慢，半透明，模糊
  if (!symbols || symbols.length === 0) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {symbols.slice(0, 5).map((s, i) => {
        const seed = (i * 73 + (s.charCodeAt(0) || 0)) % 100;
        const left = 10 + seed * 0.8;
        const delay = i * 4;
        return (
          <span key={s + i} style={{
            position: "absolute", left: `${left}%`, top: "110%",
            fontFamily: "var(--font-display)", fontSize: 110 + (i % 3) * 14,
            color: "var(--moon-white)", opacity: 0.05,
            letterSpacing: "0.2em", whiteSpace: "nowrap",
            animation: `symbol-rise ${28 + i * 3}s linear ${delay}s infinite`,
            filter: "blur(1px)",
          }}>
            {s}
          </span>
        );
      })}
    </div>
  );
}

function alphaHex(a) {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");
  return v;
}

Object.assign(window, { MoodAura, SymbolDrift, alphaHex });

/* ============================================
   氛围层 —— 飞蛾 + 偶发流星 + 涟漪点击
   ============================================ */
function AmbientLayer({ mothCount = 5, meteorEnabled = true, rippleEnabled = true }) {
  return (
    <>
      <MothSwarm count={mothCount} />
      {meteorEnabled && <Meteors />}
      {rippleEnabled && <ClickRipple />}
    </>
  );
}

function MothSwarm({ count }) {
  const moths = useMemoX(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    seed: Math.random() * 1000,
    delay: i * 1.4,
    duration: 22 + Math.random() * 14,
    size: 4 + Math.random() * 3,
    startY: 20 + Math.random() * 60,
  })), [count]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {moths.map(m => (
        <div key={m.id} style={{
          position: "absolute",
          left: "-5%", top: `${m.startY}%`,
          width: m.size, height: m.size,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,236,216,0.9) 0%, rgba(201,169,110,0.4) 60%, transparent 100%)",
          boxShadow: "0 0 8px rgba(244,236,216,0.5)",
          animation: `moth-fly ${m.duration}s linear ${m.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Meteors() {
  const [meteor, setMeteor] = useStateX(null);
  useEffectX(() => {
    let t;
    const spawn = () => {
      const top = Math.random() * 30;
      const left = 60 + Math.random() * 30;
      const angle = 25 + Math.random() * 15;
      setMeteor({ id: Date.now(), top, left, angle });
      t = setTimeout(spawn, 12000 + Math.random() * 18000);
    };
    t = setTimeout(spawn, 4000);
    return () => clearTimeout(t);
  }, []);

  if (!meteor) return null;
  return (
    <div key={meteor.id} style={{
      position: "fixed", top: `${meteor.top}%`, left: `${meteor.left}%`,
      width: 180, height: 1,
      background: "linear-gradient(90deg, rgba(244,236,216,0) 0%, rgba(244,236,216,0.85) 70%, rgba(244,236,216,1) 100%)",
      boxShadow: "0 0 6px rgba(244,236,216,0.8)",
      transform: `rotate(${meteor.angle}deg)`,
      transformOrigin: "left center",
      pointerEvents: "none", zIndex: 1,
      animation: "meteor-fall 1.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
    }} />
  );
}

function ClickRipple() {
  const [ripples, setRipples] = useStateX([]);
  useEffectX(() => {
    const onClick = (e) => {
      // 忽略按钮/输入等交互元素的点击（避免干扰）
      const tag = e.target.tagName;
      if (tag === "BUTTON" || tag === "TEXTAREA" || tag === "INPUT") return;
      const id = Date.now() + Math.random();
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1400);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y,
          width: 0, height: 0,
          borderRadius: "50%",
          border: "1px solid var(--gold)",
          transform: "translate(-50%, -50%)",
          animation: "ripple 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }} />
      ))}
    </div>
  );
}

Object.assign(window, {
  CalendarScene, SymbolGraphScene, AmbientLayer,
});
