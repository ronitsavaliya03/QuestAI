import React from 'react';
import Link from 'next/link';
import { UploadCloud, Zap, Bot, Info, BookOpen, ShieldCheck, Layers, Share2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden flex-1 w-full">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center flex flex-col items-center">
        {/* Background Glow Effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[120%] max-w-[600px] h-[300px] md:h-[400px] bg-purple-600/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
          <div className="flex items-center gap-2 px-3 py-1 mb-6 md:mb-8 text-xs font-medium border rounded-full text-purple-300 border-purple-500/30 bg-purple-500/10">
            <Zap className="w-3 h-3" />
            <span>Powered by RAG & Advanced LLMs</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            AI-Powered Quizzes <br className="hidden sm:block" /> & Document Tutor
          </h1>

          <p className="max-w-2xl mb-8 md:mb-10 text-base md:text-lg text-gray-400 px-2 sm:px-0 leading-relaxed">
            Upload any PDF document to instantly extract high-quality multiple-choice questions, and seamlessly chat with our built-in AI Tutor to master complex concepts.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Link 
              href="/generate"
              className="flex items-center justify-center gap-2 px-8 py-3.5 md:py-4 w-full sm:w-auto text-base font-semibold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Learning <UploadCloud className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            
            <Link 
              href="/simulation"
              className="flex items-center justify-center gap-2 px-8 py-3.5 md:py-4 w-full sm:w-auto text-base font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all"
            >
              How it Works <Info className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-16 mt-16 md:mt-24 border-t border-white/10 pt-8 md:pt-12 w-full max-w-3xl mx-auto">
          <div className="flex flex-col items-center w-[45%] sm:w-auto">
            <span className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /> 3
            </span>
            <span className="text-xs md:text-sm text-gray-500 text-center">Difficulty Levels</span>
          </div>
          
          <div className="flex flex-col items-center w-[45%] sm:w-auto">
            <span className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 flex items-center gap-2">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /> 24/7
            </span>
            <span className="text-xs md:text-sm text-gray-500 text-center">AI Chat Tutor</span>
          </div>
          
          <div className="flex flex-col items-center w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /> &lt;10s
            </span>
            <span className="text-xs md:text-sm text-gray-500 text-center">Processing Time</span>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION SECTION ================= */}
      <section className="w-full bg-[#0a0a0a] border-t border-white/5 py-20 px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why use QuestAI instead of ChatGPT?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Standard AI models require complex prompting and often hallucinate. We built a dedicated workflow designed specifically for education and accuracy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ShieldCheck className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Zero Hallucinations</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Generic LLMs make up facts. Our RAG (Retrieval-Augmented Generation) engine strictly limits the AI to only use the knowledge found inside your uploaded document.</p>
            </div>
            
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Share2 className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Instant PDF Exports</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Don't waste time copy-pasting from chat windows. We automatically format your generated questions into beautiful, print-ready PDFs with optional Teacher Answer Keys.</p>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Layers className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Targeted Difficulty</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Prompting an AI for "hard" questions is inconsistent. Our custom pipeline enforces strict cognitive difficulty levels, from basic recall to complex application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="w-full py-20 px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Seamless Workflow</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-blue-500/0 z-0"></div>

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border-2 border-purple-500 flex items-center justify-center text-xl font-bold text-white mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)]">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Source</h3>
              <p className="text-sm text-gray-400">Drag and drop your PDF or convert a PowerPoint presentation.</p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border-2 border-purple-400 flex items-center justify-center text-xl font-bold text-white mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)]">2</div>
              <h3 className="text-xl font-bold text-white mb-2">Configure</h3>
              <p className="text-sm text-gray-400">Select question count, difficulty level, and optional focus topics.</p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border-2 border-blue-500 flex items-center justify-center text-xl font-bold text-white mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Export & Learn</h3>
              <p className="text-sm text-gray-400">Download your PDF test paper or open the interactive AI Tutor.</p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link href="/generate" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors">
              Try the generator now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}