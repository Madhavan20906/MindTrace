import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Sparkles,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
} from 'lucide-react';

interface SocraticVoiceCoachProps {
  textToSpeak?: string;
  title?: string;
  isFullMode?: boolean;
  onCloseFullMode?: () => void;
  onClose?: () => void;
}

export const SocraticVoiceCoach: React.FC<SocraticVoiceCoachProps> = ({
  textToSpeak = 'Consider a related scenario to test your mental model. When an equilibrium point is reached, does the governing force vanish?',
  title = 'Socratic Audio Guidance',
  isFullMode = false,
  onCloseFullMode,
  onClose,
}) => {
  const handleClose = onClose || onCloseFullMode;
  const [isPlaying, setIsPlaying] = useState<boolean>(isFullMode);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(18); // 18 seconds stream duration

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // FULL PAGE AETHER VOICE MODE (TIMESTAMP 75s IN VIDEO DEMO)
  if (isFullMode) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        {/* TOP STREAM STATUS BAR */}
        <div className="aether-card p-4 bg-[#08090c] border-amber-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ENCRYPTED VOICE STREAM (AES-256)
            </span>
            <span className="text-slate-400 font-bold">SESSION DURATION: {formatTimer(timer)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Radio className="w-4 h-4 animate-pulse" /> Socratic Voice AI
            </span>
            {onCloseFullMode && (
              <button
                onClick={onCloseFullMode}
                className="bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1 rounded-lg border border-white/10 transition"
              >
                Exit Voice View
              </button>
            )}
          </div>
        </div>

        {/* CENTRAL ORB CONTAINER */}
        <div className="aether-card p-12 bg-[#0c0e15]/95 border-amber-500/20 flex flex-col items-center justify-center relative min-h-[420px] overflow-hidden space-y-6">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* PULSING STAR ORB (MIRRORING AETHER VIDEO DEMO) */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-400/30 to-amber-600/20 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl animate-orb-pulse relative">
              <div className="w-36 h-36 rounded-full bg-[#08090c] border border-amber-400/40 flex items-center justify-center">
                {/* ROTATING GOLDEN 4-POINTED STAR */}
                <Sparkles className="w-16 h-16 text-amber-400 animate-star-spin drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
              </div>
            </div>

            {/* SPEAKING CAPSULE BADGE */}
            <div className="absolute -bottom-4 bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider shadow-lg flex items-center gap-1.5 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
              {isPlaying ? 'AETHER IS EXPLAINING...' : 'LISTENING TO USER...'}
            </div>
          </div>

          <p className="text-sm font-mono text-slate-300 max-w-lg text-center leading-relaxed">
            "Socratic reasoning active. Speak your hypothesis out loud or ask clarifying questions."
          </p>

          {/* DUAL TRANSCRIPT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
            {/* USER TRANSCRIPT */}
            <div className="p-4 rounded-xl bg-[#08090c]/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" /> YOUR VOICE (INPUT)
                </span>
                <span className="text-slate-400">Captured</span>
              </div>
              <p className="text-xs text-slate-300 font-sans italic leading-relaxed">
                "I think when system equilibrium is reached, the governing forces cancel each other out completely..."
              </p>
            </div>

            {/* AETHER AI RESPONSE */}
            <div className="p-4 rounded-xl bg-[#121622]/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> MINDTRACE RESPONSE
                </span>
                <span className="text-slate-400">Socratic Synthesis</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                "{textToSpeak}"
              </p>
            </div>
          </div>
        </div>

        {/* FLOATING MEDIA CONTROLS CAPSULE BAR */}
        <div className="aether-card p-3 bg-[#08090c]/90 border-amber-500/30 flex items-center justify-center gap-6 max-w-md mx-auto rounded-full shadow-2xl">
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isMicActive
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
            aria-label="Toggle Microphone"
          >
            {isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleSpeech}
            className="w-14 h-14 rounded-full bg-amber-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
            aria-label="Play/Pause Voice"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={handleClose}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition transform hover:scale-105 cursor-pointer"
            aria-label="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // INLINE COMPACT CARD WIDGET MODE (FOR CORE DIAGNOSTIC LOOP)
  return (
    <div className="aether-card p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0c0e15]/90 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleSpeech}
          aria-label={isPlaying ? 'Pause audio guidance' : 'Listen to Socratic audio guidance'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition ${
            isPlaying
              ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
              : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-400 hover:text-slate-950'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {title}
            </span>
            {isPlaying && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse font-bold">
                AETHER VOICE ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 line-clamp-1 font-medium mt-0.5">
            "{textToSpeak}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-[#08090c] rounded-lg border border-white/10 font-mono text-xs">
        <div className="flex items-end gap-1 h-3">
          <span className={`w-1 rounded ${isPlaying ? 'bg-amber-400 animate-wave-1' : 'bg-slate-700 h-2'}`}></span>
          <span className={`w-1 rounded ${isPlaying ? 'bg-amber-400 animate-wave-2' : 'bg-slate-700 h-2'}`}></span>
          <span className={`w-1 rounded ${isPlaying ? 'bg-amber-400 animate-wave-3' : 'bg-slate-700 h-2'}`}></span>
          <span className={`w-1 rounded ${isPlaying ? 'bg-amber-400 animate-wave-4' : 'bg-slate-700 h-2'}`}></span>
        </div>
        <button
          onClick={handleToggleSpeech}
          className="ml-2 text-xs text-amber-400 font-bold hover:text-yellow-300 transition"
        >
          {isPlaying ? 'Pause Voice' : 'Listen Voice'}
        </button>
      </div>
    </div>
  );
};
