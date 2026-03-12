import { useState, useEffect, useRef } from 'react'

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function playTone(freq, duration, volume = 0.6, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.05)
  } catch (_) {
    // Audio API not available
  }
}

// Three ascending notes — signals heat phase is over, drop your dab
function playTransitionBeep() {
  playTone(660, 0.18)
  setTimeout(() => playTone(880, 0.18), 200)
  setTimeout(() => playTone(1100, 0.45), 400)
}

// Three quick celebratory notes — session complete
function playDoneBeep() {
  playTone(880, 0.15)
  setTimeout(() => playTone(880, 0.15), 180)
  setTimeout(() => playTone(1320, 0.6), 360)
}

export default function TimerScreen({ preset, onDone }) {
  const [phase, setPhase] = useState('heat')
  const [timeLeft, setTimeLeft] = useState(preset.heatTime)
  const [isDone, setIsDone] = useState(false)

  // Use refs so the interval callback always sees current values
  const phaseRef = useRef('heat')
  const timeLeftRef = useRef(preset.heatTime)
  const isDoneRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (isDoneRef.current) return

      timeLeftRef.current -= 1

      if (timeLeftRef.current <= 0) {
        if (phaseRef.current === 'heat') {
          // Heat phase complete — transition to cool
          playTransitionBeep()
          phaseRef.current = 'cool'
          timeLeftRef.current = preset.coolTime
          setPhase('cool')
          setTimeLeft(preset.coolTime)
        } else {
          // Cool phase complete — all done
          playDoneBeep()
          isDoneRef.current = true
          clearInterval(id)
          setIsDone(true)
          setTimeLeft(0)
          setTimeout(onDone, 1600)
        }
      } else {
        setTimeLeft(timeLeftRef.current)
      }
    }, 1000)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const total = phase === 'heat' ? preset.heatTime : preset.coolTime
  const elapsed = total - timeLeft
  const progress = total > 0 ? elapsed / total : 1

  // Draining animation: starts full (offset=0), ends empty (offset=CIRCUMFERENCE)
  const dashOffset = CIRCUMFERENCE * progress

  const isHeat = phase === 'heat'
  const accentColor = isHeat ? '#ff5722' : '#29b6f6'
  const glowColor = isHeat ? 'rgba(255,87,34,0.5)' : 'rgba(41,182,246,0.5)'

  return (
    <div className={`timer-screen ${phase}`}>
      <div className="timer-header">
        <h1 className="logo">Dabby</h1>
        <p className="preset-label">
          {preset.emoji} {preset.name}
        </p>
      </div>

      <div className="phase-indicator">
        <span className="phase-icon">{isHeat ? '🔥' : '❄️'}</span>
        <span className="phase-text">{isHeat ? 'Heat Up' : 'Cool Down'}</span>
      </div>

      <div className="timer-container">
        <svg className="timer-svg" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="9"
          />
          {/* Progress arc — drains as time passes */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{
              transition: 'stroke-dashoffset 0.85s linear, stroke 0.5s ease',
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        <div
          className="time-display"
          style={{ color: accentColor }}
        >
          {isDone ? '✓' : `${timeLeft}s`}
        </div>
      </div>

      {isDone && (
        <div className="done-message">Session complete!</div>
      )}

      <div className="phase-steps">
        <div className={`step ${phase === 'heat' && !isDone ? 'active' : 'completed'}`}>
          <span>🔥</span>
          <span>{preset.heatTime}s heat</span>
        </div>
        <div className="step-arrow">→</div>
        <div className={`step ${phase === 'cool' ? (isDone ? 'completed' : 'active') : ''}`}>
          <span>❄️</span>
          <span>{preset.coolTime}s cool</span>
        </div>
      </div>

      <button className="cancel-btn" onClick={onDone}>
        Cancel
      </button>
    </div>
  )
}
