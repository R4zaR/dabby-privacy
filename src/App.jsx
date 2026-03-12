import { useState } from 'react'
import MainScreen from './components/MainScreen'
import TimerScreen from './components/TimerScreen'

export const PRESETS = [
  {
    id: 'flavor',
    name: 'Low & Slow',
    emoji: '🌿',
    heatTime: 30,
    coolTime: 60,
    temp: '350–450°F',
    description:
      'Maximum terpene preservation for rich, full flavor. The long cool-down lets the banger drop to the sweet spot, delivering smooth, aromatic hits. Ideal for beginners and flavor chasers.',
  },
  {
    id: 'balance',
    name: 'Classic Balance',
    emoji: '⚖️',
    heatTime: 30,
    coolTime: 30,
    temp: '450–500°F',
    description:
      'The classic 30/30 rule — equal heat and cool time. A trusted balance of flavor and potency that works for most standard quartz bangers. The most popular method among dabbers.',
  },
  {
    id: 'potency',
    name: 'High Temp',
    emoji: '💨',
    heatTime: 30,
    coolTime: 15,
    temp: '550–600°F',
    description:
      'Short cool-down for thicker, more immediate hits and bigger clouds. Sacrifices some terpene flavor for stronger effects. Best for experienced users who prefer intensity over taste.',
  },
  {
    id: 'thick-quartz',
    name: 'Thick Quartz',
    emoji: '💎',
    heatTime: 45,
    coolTime: 75,
    temp: '375–425°F',
    description:
      'Thick-walled bangers absorb and retain significantly more heat. They need a longer heat-up to fully saturate and an extended cool-down to reach the ideal temperature window.',
  },
  {
    id: 'titanium',
    name: 'Titanium Nail',
    emoji: '⚙️',
    heatTime: 20,
    coolTime: 20,
    temp: '450–500°F',
    description:
      'Titanium heats rapidly and retains heat extremely well. Short heat-up and quick cool cycles efficiently reach a balanced hit. A reliable material that lasts for years.',
  },
]

export default function App() {
  const [screen, setScreen] = useState('main')
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[1])

  return (
    <div className="app">
      {screen === 'main' ? (
        <MainScreen
          presets={PRESETS}
          selectedPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
          onStart={() => setScreen('timer')}
        />
      ) : (
        <TimerScreen
          preset={selectedPreset}
          onDone={() => setScreen('main')}
        />
      )}
    </div>
  )
}
