import React, { useState } from 'react';
import { Play, Sparkles, Sliders, Activity, AlertTriangle, CheckCircle2, Code, Zap, TrendingUp, Brain } from 'lucide-react';

export type SandboxDomain = 'kinematics' | 'recursion' | 'economics' | 'logic';

export const SimulationSandboxView: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<SandboxDomain>('kinematics');

  // Domain 1: Physics Kinematics State
  const [gravity, setGravity] = useState<number>(9.8);
  const [initialVelocity, setInitialVelocity] = useState<number>(20);
  const [selectedTime, setSelectedTime] = useState<number>(2.04);
  const [assumesZeroAccAtApex, setAssumesZeroAccAtApex] = useState<boolean>(true);

  // Domain 2: CS Recursion State
  const [recursionDepth, setRecursionDepth] = useState<number>(6);
  const [stackLimit, setStackLimit] = useState<number>(8);
  const [hasBaseCondition, setHasBaseCondition] = useState<boolean>(false);

  // Domain 3: Economics State
  const [priceFloor, setPriceFloor] = useState<number>(45);
  const [equilibriumPrice] = useState<number>(30);

  // Physics Calculations
  const tApex = Number((initialVelocity / gravity).toFixed(2));
  const currentHeight = Math.max(0, Number((initialVelocity * selectedTime - 0.5 * gravity * Math.pow(selectedTime, 2)).toFixed(1)));
  const currentVelocity = Number((initialVelocity - gravity * selectedTime).toFixed(1));
  const actualAcc = -gravity;
  const studentAcc = assumesZeroAccAtApex && Math.abs(currentVelocity) < 1.5 ? 0 : -gravity;

  // CS Recursion Calculations
  const isStackOverflow = !hasBaseCondition && recursionDepth >= stackLimit;

  // Economics Calculations
  const isSurplus = priceFloor > equilibriumPrice;
  const surplusAmount = Math.max(0, (priceFloor - equilibriumPrice) * 12);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-[#141622] border border-[#232636] space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#1c1f2e] text-slate-300 border border-[#2a2e42]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> MULTI-DOMAIN SIMULATOR
          </div>
          <h1 className="text-2xl font-bold text-white font-sans tracking-tight">
            Misconception Sandbox
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl font-sans leading-relaxed">
            Interactively simulate system invariants across Physics, Computer Science, Economics, and Formal Logic to compare intuitive mental models against physical & mathematical ground truth.
          </p>

          {/* DOMAIN SCENARIO SWITCHER TABS */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'kinematics', label: 'Physics Kinematics', icon: Zap },
              { id: 'recursion', label: 'Computer Science Recursion', icon: Code },
              { id: 'economics', label: 'Economics Price Floor', icon: TrendingUp },
              { id: 'logic', label: 'Formal Logic Implication', icon: Brain },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeDomain === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomain(tab.id as SandboxDomain)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1c1f2e] text-amber-400 border border-[#2a2e42]'
                      : 'bg-[#11131c] text-slate-400 hover:text-white border border-[#212433]'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. SCENARIO 1: PHYSICS KINEMATICS */}
      {activeDomain === 'kinematics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* PARAMETERS */}
          <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" /> Kinematics Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Initial Velocity ($v_0$)</span>
                  <span className="text-emerald-400 font-bold">{initialVelocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={initialVelocity}
                  onChange={(e) => setInitialVelocity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Gravitational Field ($g$)</span>
                  <span className="text-emerald-400 font-bold">{gravity} m/s²</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="25"
                  step="0.1"
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Scrub Time Axis ($t$)</span>
                  <span className="text-emerald-400 font-bold">{selectedTime} s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={tApex * 2}
                  step="0.05"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={assumesZeroAccAtApex}
                  onChange={(e) => setAssumesZeroAccAtApex(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span>Inject Misconception: "v = 0 implies a = 0"</span>
              </label>

              <button
                onClick={() => setSelectedTime(tApex)}
                className="w-full mindtrace-btn-yellow py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Jump to Trajectory Apex (t = {tApex}s)
              </button>
            </div>
          </div>

          {/* VISUAL STAGE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl min-h-[260px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Kinematic Trajectory Canvas
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Height: {currentHeight} m
                </span>
              </div>

              <div className="h-44 bg-[#0a0d18] rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20" />
                <div className="absolute top-6 inset-x-0 border-t border-dashed border-emerald-500/30 text-[10px] font-mono text-emerald-400/60 text-right pr-3">
                  Max Apex ({((Math.pow(initialVelocity, 2)) / (2 * gravity)).toFixed(1)}m)
                </div>
                <div
                  className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 border-2 border-white text-white font-mono text-[9px] flex items-center justify-center font-bold shadow-lg shadow-emerald-500/40 transition-all duration-150"
                  style={{
                    bottom: `${Math.min(80, (currentHeight / ((Math.pow(initialVelocity, 2)) / (2 * gravity))) * 80)}%`,
                  }}
                >
                  m
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="bg-[#0a0d18] p-3.5 rounded-2xl border border-rose-500/30 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Student Mental Model</span>
                  <p className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Accel: {studentAcc} m/s²
                  </p>
                  <p className="text-[10px] text-slate-500">Assumes force stops at peak</p>
                </div>
                <div className="bg-[#0a0d18] p-3.5 rounded-2xl border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Physical System Reality</span>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accel: {actualAcc} m/s²
                  </p>
                  <p className="text-[10px] text-slate-500">Gravity acts continuously downwards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCENARIO 2: COMPUTER SCIENCE RECURSION */}
      {activeDomain === 'recursion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-white/5 pb-3">
              <Code className="w-4 h-4 text-rose-400" /> Recursion Call Stack Controls
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Recursive Depth N</span>
                  <span className="text-rose-400 font-bold">N = {recursionDepth}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={recursionDepth}
                  onChange={(e) => setRecursionDepth(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Call Stack Frame Limit</span>
                  <span className="text-rose-400 font-bold">{stackLimit} frames</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={stackLimit}
                  onChange={(e) => setStackLimit(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBaseCondition}
                  onChange={(e) => setHasBaseCondition(e.target.checked)}
                  className="accent-rose-500 w-4 h-4 rounded"
                />
                <span>Include Base Condition `if (n &lt;= 1) return 1;`</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-400" /> Memory Call Stack Visualizer
                </span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full ${isStackOverflow ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isStackOverflow ? 'STACK OVERFLOW EXCEPTION' : 'SAFE EXECUTION'}
                </span>
              </div>

              {/* STACK FRAMES DISPLAY */}
              <div className="h-44 bg-[#0a0d18] rounded-2xl border border-white/5 p-4 flex flex-col-reverse gap-1.5 overflow-y-auto">
                {Array.from({ length: recursionDepth }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                      idx >= stackLimit
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-white/5 text-slate-300 border border-white/5'
                    }`}
                  >
                    <span>Stack Frame #{idx + 1}: factorial({recursionDepth - idx})</span>
                    <span className="text-[10px] text-slate-500">Address 0x04F{idx}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SCENARIO 3: ECONOMICS PRICE FLOOR */}
      {activeDomain === 'economics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-white/5 pb-3">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Market Controls
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Price Floor Mandate ($P_{'{floor}'}$)</span>
                  <span className="text-cyan-400 font-bold">${priceFloor}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={priceFloor}
                  onChange={(e) => setPriceFloor(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121624]/90 p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" /> Supply / Demand Equilibrium Chart
                </span>
                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                  Equilibrium Price: ${equilibriumPrice}
                </span>
              </div>

              <div className="h-44 bg-[#0a0d18] rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="text-xs font-mono space-y-2">
                  <p className="text-slate-300 font-bold">Price Floor Impact Analysis:</p>
                  <p className={isSurplus ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isSurplus
                      ? `Market Surplus Generated: +${surplusAmount} Excess Units (Supply > Demand)`
                      : 'Non-binding Price Floor. Market remains at equilibrium equilibrium ($30).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCENARIO 4: FORMAL LOGIC */}
      {activeDomain === 'logic' && (
        <div className="bg-[#121624]/90 p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Brain className="w-6 h-6 text-violet-400" />
            <div>
              <h3 className="text-base font-bold text-white font-sans">Formal Logic Implication Invariant ($P \implies Q$)</h3>
              <p className="text-xs text-slate-400 font-sans">Vacuous Truth Misconception: If P is False, the conditional statement $P \implies Q$ is ALWAYS TRUE.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-[#0a0d18] p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
              <span className="text-slate-400">P = True, Q = True</span>
              <p className="text-sm font-bold text-emerald-400">P ⇒ Q : TRUE</p>
            </div>
            <div className="bg-[#0a0d18] p-4 rounded-2xl border border-rose-500/30 text-center space-y-1">
              <span className="text-slate-400">P = True, Q = False</span>
              <p className="text-sm font-bold text-rose-400">P ⇒ Q : FALSE</p>
            </div>
            <div className="bg-[#0a0d18] p-4 rounded-2xl border border-violet-500/30 text-center space-y-1">
              <span className="text-slate-400">P = False, Q = True</span>
              <p className="text-sm font-bold text-violet-300">P ⇒ Q : TRUE (Vacuous)</p>
            </div>
            <div className="bg-[#0a0d18] p-4 rounded-2xl border border-violet-500/30 text-center space-y-1">
              <span className="text-slate-400">P = False, Q = False</span>
              <p className="text-sm font-bold text-violet-300">P ⇒ Q : TRUE (Vacuous)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationSandboxView;
