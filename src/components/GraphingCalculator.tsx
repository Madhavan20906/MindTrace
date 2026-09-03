import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Zap,
  RotateCcw,
  Sliders,
  Brain,
  ArrowRight,
} from 'lucide-react';

interface GraphingCalculatorProps {
  onSendToDiagnosis?: (equation: string, reasoning: string) => void;
}

export const GraphingCalculator: React.FC<GraphingCalculatorProps> = ({ onSendToDiagnosis }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(-4);
  const [paramC, setParamC] = useState<number>(3);
  const [equationType, setEquationType] = useState<'quadratic' | 'sine' | 'gaussian' | 'decay'>('quadratic');
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Render mathematical function on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40; // 40 pixels per grid unit

    // Clear background
    ctx.fillStyle = '#08090c';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Main Axes
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = 2;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Plot Mathematical Curve
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();

    let isFirst = true;
    for (let pixelX = 0; pixelX <= width; pixelX += 2) {
      const x = (pixelX - centerX) / scale;
      let y = 0;

      if (equationType === 'quadratic') {
        y = paramA * x * x + paramB * x + paramC;
      } else if (equationType === 'sine') {
        y = paramA * Math.sin(paramB * x) + paramC;
      } else if (equationType === 'gaussian') {
        y = paramA * Math.exp(-Math.pow(x - paramB, 2) / (2 * Math.pow(paramC || 1, 2)));
      } else if (equationType === 'decay') {
        y = paramA * Math.exp(-0.3 * Math.abs(x)) * Math.cos(paramB * x) + paramC;
      }

      const pixelY = centerY - y * scale;

      if (isFirst) {
        ctx.moveTo(pixelX, pixelY);
        isFirst = false;
      } else {
        ctx.lineTo(pixelX, pixelY);
      }
    }
    ctx.stroke();

    // Reset shadow blur
    ctx.shadowBlur = 0;

    // Draw Vertex or Key Points
    if (equationType === 'quadratic') {
      const vertexX = -paramB / (2 * paramA);
      const vertexY = paramA * vertexX * vertexX + paramB * vertexX + paramC;
      const px = centerX + vertexX * scale;
      const py = centerY - vertexY * scale;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(`Vertex (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, px + 10, py - 10);
      }
    }
  }, [paramA, paramB, paramC, equationType]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const scale = 40;
    const x = (px - canvas.width / 2) / scale;
    const y = (canvas.height / 2 - py) / scale;
    setMousePos({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  };

  const getFormulaString = () => {
    if (equationType === 'quadratic') return `f(x) = ${paramA}x² + (${paramB})x + (${paramC})`;
    if (equationType === 'sine') return `f(x) = ${paramA} · sin(${paramB}x) + (${paramC})`;
    if (equationType === 'gaussian') return `f(x) = ${paramA} · e^(-(x - ${paramB})² / 2)`;
    return `f(x) = ${paramA} · e^(-0.3x) · cos(${paramB}x) + (${paramC})`;
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto animate-fade-in">
      {/* HEADER BANNER */}
      <div className="aether-card p-6 bg-[#121622]/90 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              DESMOS AI GRAPHING TUTOR
              <span className="text-[10px] bg-amber-400/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                REALTIME CANVAS
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive mathematical curve simulation and vertex analysis for Bayesian reasoning diagnostics
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setParamA(1);
            setParamB(-4);
            setParamC(3);
            setEquationType('quadratic');
          }}
          className="aether-btn-secondary px-4 py-2 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Parameters
        </button>
      </div>

      {/* CANVAS & CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH CANVAS (2 COLS) */}
        <div className="lg:col-span-2 aether-card p-4 bg-[#08090c] border-white/10 space-y-3 relative">
          <div className="flex items-center justify-between font-mono text-xs px-2">
            <span className="text-amber-400 font-bold tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> {getFormulaString()}
            </span>
            <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              {mousePos ? `X: ${mousePos.x} | Y: ${mousePos.y}` : 'Hover canvas to inspect'}
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-white/10">
            <canvas
              ref={canvasRef}
              width={700}
              height={420}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos(null)}
              className="w-full h-auto bg-[#08090c] cursor-crosshair block"
            />
          </div>
        </div>

        {/* PARAMETER SLIDERS & CONTROLS (1 COL) */}
        <div className="aether-card p-6 bg-[#121622]/90 border-white/10 space-y-6">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" /> Function Parameters
          </h3>

          {/* EQUATION TYPE SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">Curve Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'quadratic', label: 'Quadratic' },
                { id: 'sine', label: 'Sinusoidal' },
                { id: 'gaussian', label: 'Bayesian Gaussian' },
                { id: 'decay', label: 'Exp Decay' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEquationType(t.id as any)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition ${
                    equationType === t.id
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* SLIDERS */}
          <div className="space-y-4 font-mono">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Parameter A (Scale / Amplitude):</span>
                <span className="text-amber-400 font-bold">{paramA}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={paramA}
                onChange={(e) => setParamA(Number(e.target.value))}
                className="w-full h-1.5 bg-[#08090c] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Parameter B (Shift / Frequency):</span>
                <span className="text-amber-400 font-bold">{paramB}</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={paramB}
                onChange={(e) => setParamB(Number(e.target.value))}
                className="w-full h-1.5 bg-[#08090c] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Parameter C (Vertical Offset):</span>
                <span className="text-amber-400 font-bold">{paramC}</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={paramC}
                onChange={(e) => setParamC(Number(e.target.value))}
                className="w-full h-1.5 bg-[#08090c] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* SEND TO DIAGNOSTIC INVESTIGATION CTA */}
          <div className="pt-2 border-t border-white/5 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1 font-mono">
                <Brain className="w-4 h-4 text-amber-400" /> AI Diagnostic Integration
              </p>
              <p className="text-[11px] text-slate-300 leading-tight">
                Send this mathematical function to the Bayesian engine to diagnose root student misconceptions in vertex calculation.
              </p>
            </div>

            {onSendToDiagnosis && (
              <button
                onClick={() =>
                  onSendToDiagnosis(
                    getFormulaString(),
                    `Analyzing vertex point and root behavior for ${getFormulaString()}`
                  )
                }
                className="w-full aether-btn-primary py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                Analyze Function Misconception <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
