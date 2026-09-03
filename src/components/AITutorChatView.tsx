import React, { useState } from 'react';
import {
  ChevronLeft,
  Sparkles,
  Mic,
  Trash2,
  Send,
  ArrowDown,
  User,
  Paperclip,
} from 'lucide-react';
import { executeAIProviderQuery } from '../services/aiProvider';
import { getApiKey } from '../services/aiEngine';

interface AITutorChatViewProps {
  onOpenVoiceMode?: () => void;
  onSendToInvestigation?: (problem: string, reasoning: string) => void;
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
  showConceptMap?: boolean;
}

export const AITutorChatView: React.FC<AITutorChatViewProps> = ({
  onOpenVoiceMode,
  onSendToInvestigation,
  onBack,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: `What concept, problem, or topic are you working on today?\n\nType a question or paste code/equations below. I'll provide clear explanations first, then guide you through Socratic probes to verify your mental model.`,
      showConceptMap: true,
    },
  ]);

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasKey = Boolean((envKey && envKey !== 'your_gemini_api_key_here') || getApiKey());

  const generateDynamicFallbackResponse = (userPrompt: string): string => {
    const cleanPrompt = userPrompt.trim();
    const lower = cleanPrompt.toLowerCase();

    // 1. Programming & Software Engineering
    if (lower.includes('python') || lower.includes('javascript') || lower.includes('code') || lower.includes('function') || lower.includes('array') || lower.includes('react') || lower.includes('loop') || lower.includes('algorithm')) {
      return `### Technical Analysis: ${cleanPrompt}\n\nWhen implementing or analyzing logic around **${cleanPrompt}**, key architectural considerations include memory allocation, execution scope, and algorithmic complexity ($O(N)$ vs $O(1)$).\n\n\`\`\`javascript\n// Conceptual breakdown for: ${cleanPrompt}\nfunction evaluateSystemState(input) {\n  // Invariant check\n  if (!input) return null;\n  return processInput(input);\n}\n\`\`\`\n\n**Socratic Verification Probe:** In your mental model, what happens to runtime performance or state synchronization if the input size grows by a factor of 100? What edge cases could break this implementation?`;
    }

    // 2. Mathematics & Calculus
    if (lower.includes('math') || lower.includes('derivative') || lower.includes('integral') || lower.includes('matrix') || lower.includes('equation') || lower.includes('solve') || lower.includes('calculus')) {
      return `### Mathematical Foundations: ${cleanPrompt}\n\nTo solve or evaluate **${cleanPrompt}**, we express the relationship using formal fundamental principles. \n\n$$\\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}$$\n\n1. **Identify Invariants:** Determine which quantities remain constant vs. variable.\n2. **Apply System Transformations:** Perform algebraic or differential operations step-by-step.\n\n**Socratic Verification Probe:** If you reverse the transformation applied here, what boundary condition must hold true for the inverse operation to remain valid?`;
    }

    // 3. General Subject / Adaptive Response
    const words = cleanPrompt.split(/\s+/).filter(w => w.length > 3);
    const keyTopic = words.length > 0 ? words.slice(0, 3).join(' ') : cleanPrompt;

    return `### Core Concept Breakdown: ${keyTopic}\n\nAnalyzing **"${cleanPrompt}"** requires examining the underlying mechanisms and structural definitions that govern this topic.\n\n**Key Principles:**\n- **Definition & Context:** Understanding the primary function and boundary conditions of *${keyTopic}*.\n- **Cause & Effect:** How changes to input parameters ripple through the system.\n\n**Socratic Verification Probe:** Based on your understanding of **${keyTopic}**, if you were to change one core assumption about this scenario, how would the outcome change? Walk me through your reasoning.`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const currentApiKey = getApiKey();
      const systemInstruction = `You are MindTrace AI Tutor, a highly intelligent, direct, and rigorous academic tutor across all domains (Computer Science, Mathematics, Physics, Humanities, Biology, Engineering, Philosophy, etc.).
STRICT MANDATE 1: ANSWER DIRECTLY FIRST. Provide a clear, thorough, accurate explanation addressing the user's EXACT question "${userText}". Do NOT say sycophantic fillers like "Great question!", "Good point!", or "I am glad you asked!".
STRICT MANDATE 2: ADAPT TO THEIR EXACT DOMAIN. If they ask about coding, write code. If they ask about math, show equations. If they ask about history or logic, provide precise analytical context.
STRICT MANDATE 3: SOCRATIC PROBE. End your response with 1 targeted Socratic probe question to test their understanding of the underlying principle.`;

      const aiRes = await executeAIProviderQuery(
        `User Prompt: "${userText}". Answer their question directly with accurate explanation/code/math, followed by 1 Socratic check question.`,
        systemInstruction,
        currentApiKey
      );

      let replyText = aiRes.rawText;
      if (!replyText || aiRes.isFallback) {
        replyText = generateDynamicFallbackResponse(userText);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: replyText,
        },
      ]);
    } catch (err) {
      console.error('AI Tutor error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: generateDynamicFallbackResponse(userText),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'tutor',
        text: `New study session started. What concept or problem would you like to explore?`,
      },
    ]);
  };

  const handleDelete = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-w-5xl mx-auto pb-8 relative">
      {/* 1. CHAT HEADER BAR */}
      <div className="bg-[#141622] p-4 rounded-xl border border-[#232636] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg bg-[#1c1f2e] hover:bg-[#25293c] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer border border-[#2a2e42]"
              title="Back to Roadmap"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>

          <div>
            <h1 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              AI Socratic Tutor
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Interactive
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {hasKey ? 'Gemini Active' : 'Offline Mode'}
            </p>
          </div>
        </div>

        {/* TOP RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {onOpenVoiceMode && (
            <button
              onClick={onOpenVoiceMode}
              className="px-3 py-1.5 rounded-lg bg-[#1c1f2e] hover:bg-[#25293c] border border-[#2a2e42] text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-500" /> Voice Mode
            </button>
          )}

          <button
            onClick={handleDelete}
            className="text-xs font-sans text-slate-400 hover:text-slate-200 font-medium px-2 cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>

          <button
            onClick={handleNewChat}
            className="mindtrace-btn-yellow text-xs font-medium flex items-center gap-1 cursor-pointer px-3.5 py-1.5 rounded-lg"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 bg-[#141622] p-6 rounded-xl border border-[#232636] space-y-6 overflow-y-auto max-h-[calc(100vh-250px)]">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {msg.sender === 'tutor' ? (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-3 text-sm text-slate-200 font-sans leading-relaxed flex-1">
                  <div className="bg-[#11131c] p-4 rounded-xl border border-[#212433] whitespace-pre-line relative">
                    {msg.text}

                    {onSendToInvestigation && (
                      <div className="pt-3 mt-3 border-t border-[#232636] flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Cognitive Diagnostic Ready
                        </span>
                        <button
                          onClick={() => onSendToInvestigation('Concept Diagnostic', msg.text)}
                          className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-[#1c1f2e] border border-[#2a2e42] px-3 py-1 rounded-md transition"
                        >
                          Explore in Sandbox &rarr;
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CONCEPT MAP FLOWCHART */}
                  {msg.showConceptMap && (
                    <div className="bg-[#11131c] p-5 rounded-xl border border-[#212433] space-y-5 my-4">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-amber-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" /> CONCEPT MAP
                        </span>
                        <span>Socratic Cognitive Tree</span>
                      </div>

                      <div className="flex flex-col items-center space-y-3 font-mono text-xs">
                        {/* LEVEL 1 */}
                        <div className="bg-[#1a1d2b] border border-[#2e3347] px-5 py-2 rounded-lg font-semibold text-white">
                          Position-Time (x-t) Graph
                        </div>
                        <ArrowDown className="w-4 h-4 text-slate-500" />

                        {/* LEVEL 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                          <div className="bg-[#1a1d2b] border border-[#2a2e42] p-2.5 rounded-lg text-center text-slate-300">
                            Vertical Axis: Position (x)
                          </div>
                          <div className="bg-[#1a1d2b] border border-[#2a2e42] p-2.5 rounded-lg text-center text-slate-300">
                            Horizontal Axis: Time (t)
                          </div>
                          <div className="bg-[#1a1d2b] border border-[#2e3347] p-2.5 rounded-lg text-center text-amber-400 font-medium">
                            Slope of x-t Graph
                          </div>
                        </div>

                        <ArrowDown className="w-4 h-4 text-slate-500" />

                        {/* LEVEL 3 */}
                        <div className="bg-[#1a1d2b] border border-[#2e3347] px-5 py-2 rounded-lg font-semibold text-amber-400">
                          Represents Velocity (v)
                        </div>

                        <ArrowDown className="w-4 h-4 text-slate-500" />

                        {/* LEVEL 4 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full pt-1">
                          <div className="bg-[#1a1d2b] border border-[#2a2e42] p-2.5 rounded-lg text-center text-slate-300 space-y-1">
                            <p className="font-semibold text-white">Zero Slope (Horizontal)</p>
                            <p className="text-[11px] text-slate-400">v = 0 (Rest)</p>
                          </div>

                          <div className="bg-[#1a1d2b] border border-[#2a2e42] p-2.5 rounded-lg text-center text-slate-300 space-y-1">
                            <p className="font-semibold text-white">Constant Slope (Straight)</p>
                            <p className="text-[11px] text-amber-400">Constant Velocity</p>
                          </div>

                          <div className="bg-[#1c0d13] border border-white/10 p-3 rounded-xl text-center text-slate-300 space-y-1">
                            <p className="font-bold text-white">Changing Slope (Curved Line)</p>
                            <p className="text-[11px] text-rose-300">Changing Velocity (Acceleration)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-3">
                <div className="bg-[#1c1f2e] border border-[#2a2e42] text-white text-sm font-sans p-3.5 rounded-xl max-w-xl">
                  {msg.text}
                </div>
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
            MindTrace Socratic AI Agent is reasoning...
          </div>
        )}
      </div>

      {/* 3. BOTTOM CHAT INPUT CONTAINER */}
      <div className="bg-[#141622] p-3 rounded-xl border border-[#232636] flex items-center justify-between gap-3">
        <label className="w-8 h-8 rounded-lg bg-[#1c1f2e] hover:bg-[#25293c] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer border border-[#2a2e42]">
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setInputText(`[Attached Study Material: ${e.target.files[0].name}] `);
              }
            }}
          />
        </label>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask any question about programming, math, science, or concepts..."
          className="flex-1 bg-transparent text-sm font-sans text-white focus:outline-none placeholder-slate-500"
        />

        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold transition cursor-pointer"
        >
          {inputText.trim() ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" onClick={onOpenVoiceMode} />}
        </button>
      </div>
    </div>
  );
};

export default AITutorChatView;
