import React, { useState } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Sparkles,
  Zap,
  Radio,
  Sliders,
  Music2,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const FocusMusicStudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeSound, setActiveSound] = useState<string>('Interstellar Void');
  const [activeMood, setActiveMood] = useState<string>('Deep Focus');
  const [trackPrompt, setTrackPrompt] = useState<string>('Binaural 432Hz ambient synth for deep Bayesian reasoning');
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const ambientPresets = [
    { id: 'Interstellar Void', title: 'Interstellar Void', freq: '432 Hz', desc: 'Deep space synth waves for maximum cognitive flow', icon: Radio, category: 'Binaural' },
    { id: 'Deep Forest Rain', title: 'Deep Forest Rain', freq: '528 Hz', desc: 'Organic rainfall with subtle thunder resonant pulses', icon: Sparkles, category: 'Nature' },
    { id: 'Cyber Lofi Cafe', title: 'Cyber Lofi Cafe', freq: '440 Hz', desc: 'Subtle chill vinyl beats & rain drops on glass', icon: Headphones, category: 'Lofi' },
    { id: 'Quantum Surge', title: 'Quantum Surge', freq: '639 Hz', desc: 'Gamma wave neuro-stimulation soundscape', icon: Zap, category: 'Neuro' },
  ];

  const moodPills = ['Deep Focus', 'Flow State', 'High Energy', 'Calm Meditation', 'Gamma Boost'];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto animate-fade-in">
      {/* AETHER HERO BANNER */}
      <div className="aether-card-gold p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md tracking-wider uppercase">
              PRO SOUND ENGINE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md font-bold">
              AI GENERATION READY
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
            Your Focus. <span className="text-amber-400">Your Sound.</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl font-sans leading-relaxed">
            Neural-tuned ambient acoustics engineered to induce flow state during intense mathematical and cognitive diagnostic investigations.
          </p>
        </div>

        <div className="z-10 bg-[#08090c]/80 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/30 font-mono text-xs space-y-2">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">CURRENT TRACK:</span>
            <span className="text-amber-400 font-bold">{activeSound}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">NEURAL BAND:</span>
            <span className="text-emerald-400 font-bold">ALPHA (8 - 12 Hz)</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-white font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> STREAMING
            </span>
          </div>
        </div>
      </div>

      {/* MAIN AUDIO PLAYER CONTROLLER */}
      <div className="aether-card p-6 bg-[#121622]/90 border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* TRACK INFO */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Music2 className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">{activeSound}</h2>
              <p className="text-xs text-amber-400 font-mono">Neural Resonance Engine • 432 Hz</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {activeMood}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Lossless Audio
                </span>
              </div>
            </div>
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="flex flex-col items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-5">
              <button className="text-slate-400 hover:text-white transition">
                <Shuffle className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-white transition">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition transform hover:scale-105 font-bold cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <button className="text-slate-400 hover:text-white transition">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-white transition">
                <Repeat className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* VOLUME SLIDER */}
          <div className="flex items-center gap-3 w-full md:w-48">
            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-amber-400 transition">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-[#08090c] rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs font-mono text-slate-400 w-8 text-right">{isMuted ? '0%' : `${volume}%`}</span>
          </div>
        </div>

        {/* PROGRESS BAR & DYNAMIC EQUALIZER WAVE */}
        <div className="space-y-2 pt-2 border-t border-white/5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>01:14</span>
            <div className="flex items-center gap-1">
              {isPlaying && (
                <div className="flex items-end gap-1 h-3 mr-2">
                  <span className="w-1 bg-amber-400 rounded animate-wave-1"></span>
                  <span className="w-1 bg-amber-400 rounded animate-wave-2"></span>
                  <span className="w-1 bg-amber-400 rounded animate-wave-3"></span>
                  <span className="w-1 bg-amber-400 rounded animate-wave-4"></span>
                </div>
              )}
              <span className="text-amber-400 font-bold">LIVE SYNTHESIS</span>
            </div>
            <span>03:45</span>
          </div>
          <div className="w-full bg-[#08090c] h-2 rounded-full overflow-hidden border border-white/10 cursor-pointer relative">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full" style={{ width: '32%' }}></div>
          </div>
        </div>
      </div>

      {/* AMBIENT SOUND PRESET GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" /> Neural Ambient Library
          </h3>
          <span className="text-xs font-mono text-slate-400">4 PRESETS ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambientPresets.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activeSound === preset.title;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  setActiveSound(preset.title);
                  setIsPlaying(true);
                }}
                className={`p-5 rounded-2xl cursor-pointer transition border ${
                  isSelected
                    ? 'aether-card-gold'
                    : 'bg-[#121622]/70 border-white/10 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-amber-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-mono">{preset.title}</h4>
                      <p className="text-xs text-amber-400 font-mono">{preset.freq} • {preset.category}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-mono bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded">
                      PLAYING
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-3 font-sans leading-relaxed">{preset.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI TRACK PROMPT GENERATOR */}
      <div className="aether-card p-6 bg-[#121622]/80 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-mono text-sm font-bold">
            <Sliders className="w-4 h-4 text-amber-400" /> AI Neural Track Synthesizer
          </div>
          <button className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition">
            <Share2 className="w-3.5 h-3.5" /> Sync with Spotify / Apple Music
          </button>
        </div>

        {/* MOOD SELECTION PILLS */}
        <div className="flex flex-wrap gap-2">
          {moodPills.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMood(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                activeMood === m
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* PROMPT INPUT BOX */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={trackPrompt}
            onChange={(e) => setTrackPrompt(e.target.value)}
            className="flex-1 bg-[#08090c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
            placeholder="Describe your target soundscape..."
          />
          <button className="aether-btn-primary px-6 py-3 text-xs font-mono flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
            <Sparkles className="w-4 h-4" /> Synthesize Track
          </button>
        </div>
      </div>
    </div>
  );
};
