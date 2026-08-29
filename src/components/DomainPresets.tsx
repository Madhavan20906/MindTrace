import React from 'react';
import { Rocket, Code, Scale, TrendingDown, Binary, Sparkles } from 'lucide-react';
import { MULTI_DOMAIN_PRESETS, type MultiDomainPreset } from '../services/aiEngine';

interface DomainPresetsProps {
  onSelectPreset: (preset: MultiDomainPreset) => void;
}

export const DomainPresets: React.FC<DomainPresetsProps> = ({ onSelectPreset }) => {
  return (
    <div className="studio-card rounded-2xl p-5 border border-indigo-500/20 space-y-4 bg-[#111625]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>1-Click Multi-Domain Investigation Presets</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Demonstrates domain universality across STEM, Law, Economics & Formal Logic
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MULTI_DOMAIN_PRESETS.map((preset) => {
          let icon = <Rocket className="w-4 h-4 text-amber-400" />;
          if (preset.domain.includes('Computer')) icon = <Code className="w-4 h-4 text-cyan-400" />;
          if (preset.domain.includes('Law')) icon = <Scale className="w-4 h-4 text-indigo-400" />;
          if (preset.domain.includes('Econ')) icon = <TrendingDown className="w-4 h-4 text-fuchsia-400" />;
          if (preset.domain.includes('Logic')) icon = <Binary className="w-4 h-4 text-emerald-400" />;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              aria-label={`Select ${preset.title} preset in ${preset.domain}`}
              className="p-3.5 rounded-xl border border-[#222b42] text-left space-y-2 group flex flex-col justify-between transition-all bg-[#0d111d] hover:border-indigo-400/80 hover:bg-[#161c2e] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${preset.badgeColor}`}>
                  {preset.domain}
                </span>
                <div className="group-hover:scale-110 transition">{icon}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  {preset.title}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug font-sans">
                  "{preset.studentAnswer}"
                </p>
              </div>

              <div className="text-[10px] font-mono text-indigo-400 font-semibold pt-1 flex items-center gap-1 group-hover:translate-x-1 transition">
                Investigate Reasoning →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
