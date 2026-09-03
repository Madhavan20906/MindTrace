import React from 'react';
import { Plus, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RightMasteryPanelProps {
  currentMastery?: number;
  currentDomain?: string;
  activeTopic?: string;
}

export const RightMasteryPanel: React.FC<RightMasteryPanelProps> = ({
  currentMastery = 85,
  currentDomain = 'Physics Kinematics',
  activeTopic = 'Trajectory Apex Dynamics',
}) => {
  return (
    <aside className="w-72 bg-[#11131c] border-l border-[#212433] flex flex-col h-screen sticky top-0 z-30 p-4 space-y-4 select-none overflow-y-auto">
      {/* 1. DYNAMIC BAYESIAN MASTERY TELEMETRY CARD */}
      <div className="bg-[#161824] p-4 rounded-xl border border-[#232636] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-500" /> DAILY MASTERY
          </h3>
          <span className="text-[10px] font-mono text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
            P(H) Belief
          </span>
        </div>

        {/* CIRCULAR GAUGE */}
        <div className="relative flex items-center justify-center my-1">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="#212433"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="#d97706"
              strokeWidth="8"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * (currentMastery / 100))}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-white">
              {currentMastery}%
            </span>
            <span className="text-[9px] text-slate-400 font-mono uppercase">
              Certainty
            </span>
          </div>
        </div>

        {/* ACTIVE DOMAIN & SUB STATS */}
        <div className="text-center">
          <p className="text-xs font-medium text-white font-sans truncate">{activeTopic}</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">{currentDomain}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="bg-[#11131c] p-2 rounded-lg border border-[#212433]">
            <p className="text-[9px] text-slate-400 uppercase">STUDY TIME</p>
            <p className="text-xs font-semibold text-white mt-0.5">0.3h</p>
          </div>
          <div className="bg-[#11131c] p-2 rounded-lg border border-[#212433]">
            <p className="text-[9px] text-slate-400 uppercase">XP GAINED</p>
            <p className="text-xs font-semibold text-amber-400 mt-0.5">+80 XP</p>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME COGNITIVE MEMORY LOG */}
      <div className="bg-[#161824] p-4 rounded-xl border border-[#232636] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> MEMORY LOG
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Active</span>
        </div>

        <div className="space-y-2">
          <div className="p-2 rounded-lg bg-[#11131c] border border-[#212433] flex items-start gap-2">
            <div className="p-1 rounded bg-slate-800 text-amber-400 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-medium text-white font-sans">Posterior Updated: {currentMastery}%</p>
              <p className="text-[10px] text-slate-400 font-mono">H1 Confirmed</p>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#11131c] border border-[#212433] flex items-start gap-2">
            <div className="p-1 rounded bg-slate-800 text-amber-400 mt-0.5">
              <Plus className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-medium text-white font-sans">{currentDomain}</p>
              <p className="text-[10px] text-slate-400 font-mono">2m ago • Probe Evaluated</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightMasteryPanel;
