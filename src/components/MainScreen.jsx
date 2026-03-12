export default function MainScreen({ presets, selectedPreset, onSelectPreset, onStart }) {
  return (
    <div className="main-screen">
      <header className="header">
        <h1 className="logo">Dabby</h1>
        <p className="tagline">Nail Timer</p>
      </header>

      <section className="start-section">
        <button className="start-btn" onClick={onStart}>
          <span className="start-text">Start</span>
        </button>
        <div className="selected-times">
          <span className="time-badge heat-badge">🔥 {selectedPreset.heatTime}s</span>
          <span className="divider">·</span>
          <span className="time-badge cool-badge">❄️ {selectedPreset.coolTime}s</span>
        </div>
        <p className="selected-name">
          {selectedPreset.emoji} {selectedPreset.name}
        </p>
      </section>

      <section className="presets-section">
        <h2 className="section-title">Choose Your Style</h2>
        <div className="presets-list">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className={`preset-card ${selectedPreset.id === preset.id ? 'selected' : ''}`}
              onClick={() => onSelectPreset(preset)}
            >
              <div className="preset-top">
                <div className="preset-info">
                  <span className="preset-emoji">{preset.emoji}</span>
                  <div>
                    <div className="preset-name">{preset.name}</div>
                    <div className="preset-temp">{preset.temp}</div>
                  </div>
                </div>
                <div className="preset-times">
                  <div className="time-chip heat-chip">🔥 {preset.heatTime}s</div>
                  <div className="time-chip cool-chip">❄️ {preset.coolTime}s</div>
                </div>
              </div>
              <p className="preset-desc">{preset.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
