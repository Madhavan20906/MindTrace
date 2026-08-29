import React, { useState, useEffect } from 'react';
import { Volume2, Pause, Sparkles } from 'lucide-react';

interface SocraticVoiceCoachProps {
  textToSpeak: string;
  title?: string;
}

export const SocraticVoiceCoach: React.FC<SocraticVoiceCoachProps> = ({
  textToSpeak,
  title = 'Socratic Audio Guidance',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleToggleSpeech = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Reset any previous speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95; // Slightly calmer Socratic pace
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#090c18]/80 relative overflow-hidden" aria-live="polite" aria-atomic="true">
      {/* Glow Background */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Voice Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleSpeech}
          aria-label={isPlaying ? 'Pause audio guidance' : 'Listen to Socratic audio guidance'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition focus:ring-2 focus:ring-indigo-400 ${
            isPlaying
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400'
              : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {title}
            </span>
            {isPlaying && (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded animate-pulse">
                Speaking Socratic Probe...
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 line-clamp-1 font-medium">
            "{textToSpeak}"
          </p>
        </div>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#050711] rounded-lg border border-zinc-800">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
          <div
            key={bar}
            className={`w-1 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-t from-indigo-500 to-cyan-400 audio-bar'
                : 'bg-zinc-800 h-2'
            }`}
            style={{
              animationDelay: isPlaying ? `${(bar * 0.12).toFixed(2)}s` : '0s',
            }}
          />
        ))}

        <button
          onClick={handleToggleSpeech}
          className="ml-2 text-xs font-mono font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          {isPlaying ? 'Pause Voice' : 'Listen Socratic Voice'}
        </button>
      </div>
    </div>
  );
};
