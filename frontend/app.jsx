/* ============================================
   夜语 — 主入口
   ============================================ */

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "moonglow",
  "globalStyle": "gentle",
  "noiseEnabled": true,
  "haloEnabled": true,
  "mothsEnabled": true,
  "meteorsEnabled": true,
  "ripplesEnabled": true,
  "showSecondMoon": false
}/*EDITMODE-END*/;

function App() {
  const [scene, setScene] = useStateApp("welcome");
  const [tw, setTw] = useTweaks(TWEAK_DEFAULTS);

  // 应用主题
  useEffectApp(() => {
    document.documentElement.setAttribute("data-theme", tw.theme || "moonglow");
  }, [tw.theme]);

  // 噪点开关
  useEffectApp(() => {
    const el = document.querySelector(".paper-noise");
    if (el) el.style.display = tw.noiseEnabled === false ? "none" : "";
  }, [tw.noiseEnabled]);

  // 光晕开关
  useEffectApp(() => {
    const el = document.getElementById("cursor-halo");
    if (el) el.style.display = tw.haloEnabled === false ? "none" : "";
  }, [tw.haloEnabled]);

  const goHome = () => setScene("home");
  const goNav = (id) => setScene(id);

  return (
    <>
      {scene !== "welcome" && (
        <TopNav current={scene} onNav={goNav} onHome={goHome} />
      )}

      <div key={scene} style={{ animation: "fadeIn 0.6s ease both" }}>
        {scene === "welcome"  && <WelcomeScene     onEnter={() => setScene("home")} />}
        {scene === "home"     && <HomeScene        onNav={setScene} />}
        {scene === "dream"    && <DreamScene       globalStyle={tw.globalStyle} />}
        {scene === "fortune"  && <FortuneScene     />}
        {scene === "portrait" && <PortraitScene    globalStyle={tw.globalStyle} />}
        {scene === "lantern"  && <LanternScene     />}
        {scene === "calendar" && <CalendarScene    />}
        {scene === "symbols"  && <SymbolGraphScene />}
        {scene === "scroll"   && <ScrollScene      />}
      </div>

      {/* 氛围层 —— welcome 不显示，避免干扰入场 */}
      {scene !== "welcome" && (
        <AmbientLayer
          mothCount={tw.mothsEnabled === false ? 0 : 4}
          meteorEnabled={tw.meteorsEnabled !== false}
          rippleEnabled={tw.ripplesEnabled !== false}
        />
      )}

      {tw.showSecondMoon && (
        <div style={{
          position: "fixed", top: "12%", right: "8%", zIndex: -2,
          opacity: 0.7, pointerEvents: "none",
          animation: "drift 12s ease-in-out infinite",
        }}>
          <Moon size={140} phase={0.3} />
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="主题 · THEME">
          <TweakColor
            label="主题色 / Palette"
            value={tw.theme}
            onChange={v => setTw("theme", v)}
            options={[
              ["#1a2541", "#c9a96e", "#f4ecd8"],
              ["#3d3552", "#d4a574", "#e8d5c4"],
              ["#243d33", "#b8a070", "#d4c089"],
              ["#3d1f25", "#d68f5c", "#e8b89a"],
            ]}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: -8, marginBottom: 4 }}>
            {[
              { v: "moonglow", l: "月光琉璃" },
              { v: "dawn",     l: "破晓玫瑰" },
              { v: "forest",   l: "深林墨绿" },
              { v: "ember",    l: "暗夜暖煻" },
            ].map(o => (
              <button key={o.v} onClick={() => setTw("theme", o.v)}
                style={{
                  padding: "4px 0",
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: 11, letterSpacing: "0.15em",
                  color: tw.theme === o.v ? "#f4ecd8" : "rgba(244,236,216,0.5)",
                  borderTop: tw.theme === o.v ? "1px solid #c9a96e" : "1px solid transparent",
                  transition: "all 0.3s",
                }}>
                {o.l}
              </button>
            ))}
          </div>
        </TweakSection>

        <TweakSection label="解读风格 · READING STYLE">
          <TweakRadio
            label="风格 / Style"
            value={tw.globalStyle}
            onChange={v => setTw("globalStyle", v)}
            options={[
              { value: "gentle", label: "温柔" },
              { value: "sharp",  label: "锐利" },
              { value: "mystic", label: "玄学" },
              { value: "modern", label: "现代" },
            ]}
          />
        </TweakSection>

        <TweakSection label="氛围 · ATMOSPHERE">
          <TweakToggle label="鼠标月晕"          value={tw.haloEnabled !== false}     onChange={v => setTw("haloEnabled", v)} />
          <TweakToggle label="宣纸噪点"          value={tw.noiseEnabled !== false}    onChange={v => setTw("noiseEnabled", v)} />
          <TweakToggle label="飞蛾粒子"          value={tw.mothsEnabled !== false}    onChange={v => setTw("mothsEnabled", v)} />
          <TweakToggle label="偶发流星"          value={tw.meteorsEnabled !== false}  onChange={v => setTw("meteorsEnabled", v)} />
          <TweakToggle label="点击金涟漪"        value={tw.ripplesEnabled !== false}  onChange={v => setTw("ripplesEnabled", v)} />
          <TweakToggle label="第二轮月（角落）"  value={tw.showSecondMoon === true}   onChange={v => setTw("showSecondMoon", v)} />
        </TweakSection>

        <TweakSection label="导航 · QUICK NAV">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {[
              { id: "welcome",  label: "进入页" },
              { id: "home",     label: "夜话" },
              { id: "dream",    label: "解梦" },
              { id: "fortune",  label: "今日签" },
              { id: "portrait", label: "画像" },
              { id: "lantern",  label: "河灯" },
              { id: "calendar", label: "月历" },
              { id: "symbols",  label: "星图" },
              { id: "scroll",   label: "卷轴" },
            ].map(s => (
              <button key={s.id} onClick={() => setScene(s.id)}
                style={{
                  padding: "8px 0",
                  fontFamily: "serif",
                  fontSize: 12, letterSpacing: "0.2em",
                  color: scene === s.id ? "#f4ecd8" : "rgba(244,236,216,0.55)",
                  border: scene === s.id ? "1px solid #c9a96e" : "1px solid rgba(201,169,110,0.22)",
                  background: scene === s.id ? "rgba(201,169,110,0.12)" : "transparent",
                  cursor: "pointer", transition: "all 0.3s",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
