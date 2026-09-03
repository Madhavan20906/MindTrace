import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Mic, BookOpen, Brain, Zap, X } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: {
    educationLevel: string;
    learningStyle: string[];
    goal: string;
    voiceEnabled: boolean;
  }) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [educationLevel, setEducationLevel] = useState<string>('Undergraduate');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Step-by-step explanations',
    'Visual examples',
  ]);
  const [goal, setGoal] = useState<string>('Understand difficult concepts & exam prep');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const styleOptions = [
    'Step-by-step explanations',
    'Visual examples',
    'Practice problems',
    'Real-world analogies',
    'Interactive exploration',
    'Concise summaries',
  ];

  const levelOptions = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Professional',
    'Self-Learner / Other',
  ];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFinish = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      onComplete({
        educationLevel,
        learningStyle: selectedStyles,
        goal,
        voiceEnabled,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#14161d] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* GLOW DECORATION */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#0c0d10] flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                MindTrace Adaptive Profile
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                Step {step} of 4
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-sans">
              Personalize Your AI Learning Engine
            </h2>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-[#0c0d10] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: EDUCATION LEVEL */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" /> What is your education level?
              </label>
              <p className="text-xs text-slate-400">
                MindTrace will calibrate foundational depth based on your academic stage.
              </p>
            </div>

            <div className="space-y-2">
              {levelOptions.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEducationLevel(lvl)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-mono font-semibold transition cursor-pointer ${
                    educationLevel === lvl
                      ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                      : 'bg-[#0c0d10] border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span>{lvl}</span>
                  {educationLevel === lvl && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="mindtrace-btn-yellow px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LEARNING PREFERENCE */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" /> How do you learn best?
              </label>
              <p className="text-xs text-slate-400">
                Select your preferred explanation modalities (multiple selections allowed).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {styleOptions.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                        : 'bg-[#0c0d10] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span>{style}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="mindtrace-btn-yellow px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OBJECTIVE */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> What would you like me to help you achieve?
              </label>
              <p className="text-xs text-slate-400">
                Define your primary learning objective or exam target.
              </p>
            </div>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder="e.g. Master physics kinematics for upcoming exam, understand recursion..."
              className="w-full bg-[#0c0d10] border border-white/10 rounded-2xl p-4 text-xs font-sans text-white focus:outline-none focus:border-amber-400"
            />

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="mindtrace-btn-yellow px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VOICE PREFERENCE & SYNTHESIS */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" /> Would you like to study using voice conversations?
              </label>
              <p className="text-xs text-slate-300">
                MindTrace can talk naturally with you in real time with encrypted voice streams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setVoiceEnabled(true)}
                className={`p-4 rounded-2xl border text-center space-y-2 cursor-pointer ${
                  voiceEnabled
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                    : 'bg-[#0c0d10] border-white/5 text-slate-400'
                }`}
              >
                <Mic className="w-6 h-6 mx-auto text-amber-400" />
                <p className="text-xs font-mono">Yes, Enable Voice Mode</p>
              </button>

              <button
                onClick={() => setVoiceEnabled(false)}
                className={`p-4 rounded-2xl border text-center space-y-2 cursor-pointer ${
                  !voiceEnabled
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                    : 'bg-[#0c0d10] border-white/5 text-slate-400'
                }`}
              >
                <BookOpen className="w-6 h-6 mx-auto text-slate-400" />
                <p className="text-xs font-mono">Text Only</p>
              </button>
            </div>

            {isSynthesizing ? (
              <div className="p-6 rounded-2xl bg-[#0c0d10] border border-amber-400/30 text-center space-y-3">
                <Sparkles className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                <p className="text-xs font-mono text-amber-400 font-bold">
                  Creating your personalized MindTrace learning engine...
                </p>
                <p className="text-[11px] text-slate-400 font-sans">
                  Persisting education level ({educationLevel}) and preferences to memory log.
                </p>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-white font-mono"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="mindtrace-btn-yellow px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  Save Profile & Start Learning <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
