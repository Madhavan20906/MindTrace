import React, { useState } from 'react';
import { BookOpen, Lock, Play, Sparkles } from 'lucide-react';

interface LearningRoadmapViewProps {
  onStartModule?: () => void;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({ onStartModule }) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const modules = [
    {
      id: 1,
      title: "KINEMATICS AND NEWTON'S LAWS OF MOTION",
      status: 'CURRENT',
      unlocked: true,
      mastery: 85,
      desc: 'Establishes foundational principles of motion, position-time curves, and gravitational forces.',
      objectives: [
        'Define displacement, velocity, and acceleration.',
        "Apply Newton's Three Laws of Motion.",
        'Distinguish between mass and weight.',
        'Analyze forces acting on objects in various scenarios.',
      ],
      keyConcepts: ['Displacement', 'Velocity', 'Acceleration', "Newton's Laws", 'Inertia', 'Force', 'Mass', 'Weight'],
      lessons: [
        {
          title: 'Describing Motion: Kinematic Quantities',
          duration: '25m',
          desc: 'Learn to define and calculate fundamental quantities used to describe motion.',
          tags: ['Position, Distance, Displacement', 'Speed, Velocity, Acceleration', 'Kinematic equations'],
        },
        {
          title: "Newton's First and Second Laws: Force & Acceleration",
          duration: '30m',
          desc: 'Explore the relationship between force, mass, and acceleration as described by Newton.',
          tags: ['Inertia', 'F = ma', 'Normal Force', 'Friction'],
        },
      ],
    },
    {
      id: 2,
      title: "NEWTON'S LAW OF UNIVERSAL GRAVITATION",
      status: 'UNLOCKED',
      unlocked: true,
      mastery: 0,
      desc: 'Introduces the inverse-square law describing gravitational attraction between point masses.',
      objectives: [
        'Formulate Universal Gravitation equation F = G m1 m2 / r^2.',
        'Calculate gravitational force between planets and stars.',
        'Understand gravitational constant G.',
      ],
      keyConcepts: ['Inverse Square Law', 'Gravitational Constant G', 'Attractive Force', 'Mass Scale'],
      lessons: [
        {
          title: 'The Inverse-Square Law & Gravitational Constant G',
          duration: '20m',
          desc: 'Derive force magnitudes across astronomical distances.',
          tags: ['G = 6.674e-11', 'Mass Product', 'Distance Squared'],
        },
      ],
    },
    {
      id: 3,
      title: 'GRAVITATIONAL FIELDS & POTENTIAL ENERGY',
      status: 'LOCKED',
      unlocked: false,
      mastery: 0,
      desc: 'Explore field vector fields g and negative potential energy wells U(r) = -G M m / r.',
      objectives: [
        'Map vector fields surrounding massive bodies.',
        'Explain why gravitational potential energy is defined as negative at infinity.',
      ],
      keyConcepts: ['Field Strength g', 'Potential Energy U(r)', 'Escape Velocity'],
      lessons: [],
    },
    {
      id: 4,
      title: 'ORBITAL MECHANICS & KEPLER\'S LAWS',
      status: 'LOCKED',
      unlocked: false,
      mastery: 0,
      desc: 'Apply gravitational forces to calculate circular and elliptical planetary orbits.',
      objectives: [
        'Apply Kepler\'s Three Laws of Planetary Motion.',
        'Calculate orbital velocity and period T^2 ∝ a^3.',
      ],
      keyConcepts: ['Elliptical Orbits', 'Kepler\'s Laws', 'Orbital Period'],
      lessons: [],
    },
    {
      id: 5,
      title: 'BEYOND NEWTON: EINSTEIN\'S GENERAL RELATIVITY',
      status: 'LOCKED',
      unlocked: false,
      mastery: 0,
      desc: 'Introduce spacetime curvature, gravitational lensing, and black hole event horizons.',
      objectives: [
        'Conceptualize gravity as geometric curvature of 4D spacetime.',
        'Understand gravitational time dilation.',
      ],
      keyConcepts: ['Spacetime Curvature', 'Geodesics', 'Event Horizon'],
      lessons: [],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* 1. TOP CURVED HERO BANNER */}
      <div className="roadmap-hero-banner p-8 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider uppercase opacity-90">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300" /> COGNITIVE CURRICULUM ARCHITECTURE
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">40% OVERALL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
          Your Autonomous Learning Roadmap
        </h1>
        <p className="text-sm text-indigo-200 max-w-xl font-sans">
          Synthesized by MindTrace Bayesian Engine based on your active diagnostic performance.
        </p>
      </div>

      {/* 2. MODULE SEQUENCE LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase tracking-wider px-2">
          <span>5 SEQUENTIAL MODULES</span>
          <span>AUTONOMOUS PREREQUISITE ENGINE</span>
        </div>

        {modules.map((mod) => {
          const isSelected = mod.id === activeModuleId;

          return (
            <div
              key={mod.id}
              onClick={() => mod.unlocked && setActiveModuleId(mod.id)}
              className={`bg-[#121522]/80 backdrop-blur-xl p-6 rounded-2xl border space-y-4 shadow-xl transition cursor-pointer ${
                isSelected
                  ? 'border-indigo-500/60 bg-[#16192a]'
                  : mod.unlocked
                  ? 'border-white/10 hover:border-indigo-500/30'
                  : 'border-white/5 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${
                      mod.unlocked
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 text-slate-500 border-white/10'
                    }`}
                  >
                    {mod.unlocked ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        MODULE {mod.id}
                      </span>
                      <h2 className="text-base font-bold text-white font-sans">{mod.title}</h2>
                      {mod.status === 'CURRENT' && (
                        <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-2.5 py-0.5 rounded-full font-mono font-extrabold shadow">
                          CURRENT
                        </span>
                      )}
                      {!mod.unlocked && (
                        <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                          Locked — Complete Module {mod.id - 1}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1">{mod.desc}</p>
                  </div>
                </div>

                {mod.unlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(!showDetails);
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                  >
                    {isSelected && showDetails ? 'HIDE DETAILS ^' : 'SHOW DETAILS v'}
                  </button>
                )}
              </div>

              {/* DETAILS SECTION FOR SELECTED MODULE */}
              {isSelected && showDetails && mod.unlocked && (
                <div className="space-y-6 pt-4 border-t border-white/5 text-xs font-sans animate-fadeIn">
                  {/* OBJECTIVES */}
                  <div className="space-y-2">
                    <h3 className="font-mono text-slate-400 font-bold uppercase tracking-wider">
                      LEARNING OBJECTIVES
                    </h3>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {mod.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* KEY CONCEPTS */}
                  <div className="space-y-2">
                    <h3 className="font-mono text-slate-400 font-bold uppercase tracking-wider">
                      KEY CONCEPTS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mod.keyConcepts.map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1 rounded-lg bg-[#090a0f] border border-white/10 text-slate-300 text-xs font-mono"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* LESSONS */}
                  {mod.lessons.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-slate-400 font-bold uppercase tracking-wider">
                        LESSONS BREAKDOWN
                      </h3>
                      <div className="space-y-3">
                        {mod.lessons.map((l, idx) => (
                          <div
                            key={idx}
                            className="bg-[#090a0f] p-4 rounded-xl border border-white/5 space-y-2"
                          >
                            <div className="flex items-center justify-between font-sans">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {l.title}
                              </h4>
                              <span className="text-xs font-mono text-slate-400">{l.duration}</span>
                            </div>
                            <p className="text-xs text-slate-400">{l.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={onStartModule}
                      className="mindtrace-btn-primary text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 px-5 py-2.5 rounded-xl"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> START MODULE IN AI TUTOR
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningRoadmapView;
