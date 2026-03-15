import React from 'react';
import Link from 'next/link';
import { UploadCloud, Zap, Bot, Info, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center overflow-hidden flex-1">
      {/* Background Glow Effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium border rounded-full text-purple-300 border-purple-500/30 bg-purple-500/10">
          <Zap className="w-3 h-3" />
          <span>Powered by RAG & Advanced LLMs</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          AI-Powered Quizzes <br /> & Document Tutor
        </h1>

        <p className="max-w-2xl mb-10 text-lg text-gray-400">
          Upload any PDF document to instantly extract high-quality multiple-choice questions, and seamlessly chat with our built-in AI Tutor to master complex concepts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/generate"
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Start Learning <UploadCloud className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/simulation"
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all"
          >
            How it Works <Info className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-center gap-8 md:gap-16 mt-24 border-t border-white/10 pt-12">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" /> 3
          </span>
          <span className="text-sm text-gray-500">Difficulty Levels</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" /> 24/7
          </span>
          <span className="text-sm text-gray-500">AI Chat Tutor</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-400" /> &lt;10s
          </span>
          <span className="text-sm text-gray-500">Processing Time</span>
        </div>
      </div>
    </main>
  );
}