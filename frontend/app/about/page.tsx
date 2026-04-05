'use client';

import React from 'react';
import { BookOpen, Code2, GraduationCap, Target, Download, Bot, Database, Sparkles, BrainCircuit, Network } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center flex-1 px-4 sm:px-6 pt-16 md:pt-24 pb-20 w-full overflow-hidden min-h-screen">
      
      {/* Dynamic Background Glow - Scaled for mobile */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[120%] max-w-[600px] h-[300px] md:h-[400px] bg-purple-600/15 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="p-4 md:p-5 bg-purple-500/10 rounded-3xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-pulse-slow">
              <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-purple-400" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            About QuestAI
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-2">
            More than just a quiz maker. QuestAI is an advanced educational platform that uses 
            <span className="text-purple-300 font-semibold"> Large Language Models</span> and 
            <span className="text-blue-300 font-semibold"> Retrieval-Augmented Generation (RAG)</span> to instantly turn static documents into interactive learning experiences.
          </p>
        </div>

        {/* --- SECTION 1: PLATFORM CAPABILITIES --- */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white flex items-center justify-center md:justify-start gap-3">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400" /> Platform Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
            
            {/* Feature 1: MCQ Generation */}
            <div className="group p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.04] hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Smart Assessment</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                Tailor quizzes exactly to your needs by specifying a <strong>Focus Topic</strong> or letting the AI scan the entire document. Our engine targets three distinct cognitive levels:
              </p>
              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-green-400 font-bold text-sm uppercase tracking-wider block mb-1">Easy</span>
                  <span className="text-sm text-gray-300">Direct fact extraction and vocabulary recall.</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider block mb-1">Medium</span>
                  <span className="text-sm text-gray-300">Conceptual understanding and practical application.</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wider block mb-1">Hard</span>
                  <span className="text-sm text-gray-300">Deep analysis, multi-step inference, and critical thinking.</span>
                </div>
              </div>
            </div>

            {/* Feature 2: AI Tutor */}
            <div className="group p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Interactive AI Tutor</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
                Don't just memorize the answers—understand the *why*. Our built-in AI Tutor slides out seamlessly alongside your questions, acting as a personal teaching assistant.
              </p>
              <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl mt-6">
                <h4 className="text-purple-300 font-bold text-sm flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4" /> How it prevents Hallucinations
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  The AI uses semantic search to read <strong>only</strong> the context of your uploaded PDF. It cannot make up facts from the internet; it is strictly anchored to your study material.
                </p>
              </div>
            </div>

            {/* Feature 3: Professional Export */}
            <div className="group p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Professional PDF Export</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Instantly convert your generated MCQs into formatted, print-ready PDF test papers. Perfect for educators and students alike. Use the <strong>"Include Answers"</strong> switch to instantly toggle between generating a blank student exam or a complete teacher's grading key.
              </p>
            </div>

            {/* Feature 4: RAG Simulation */}
            <div className="group p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Network className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">"Under the Hood" Engine</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
                Curious how AI actually "reads" documents? Access our interactive Simulation Sandbox to visualize the architecture.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span> 
                  <span><strong>Vector Embeddings:</strong> Watch text turn into mathematical coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span> 
                  <span><strong>Cosine Similarity:</strong> See how the AI calculates the distance between concepts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ACADEMIC & TECH DETAILS --- */}
        <div className="mt-16 md:mt-24 border-t border-white/10 pt-16 md:pt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white flex items-center justify-center md:justify-start gap-3">
            <Code2 className="w-6 h-6 md:w-8 md:h-8 text-gray-400" /> Technical Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
            
            {/* Academic Card */}
            <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-[#0a0a0a] backdrop-blur-xl relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute -right-10 -top-10 text-white/5">
                <GraduationCap className="w-48 h-48" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">Academic Project</h3>
                </div>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                  This application was developed as part of the Machine Learning & Deep Learning coursework at <strong className="text-white">Darshan University</strong>. The objective was to move beyond theory and build a complete, industry-level AI application featuring complex vector mathematics, dynamic memory management, and a highly polished user interface.
                </p>
                <div className="inline-flex items-center gap-2 text-xs md:text-sm font-mono text-purple-300 bg-purple-500/10 py-2.5 px-4 rounded-xl border border-purple-500/20">
                  <Database className="w-4 h-4" /> Category: NLP & RAG Systems
                </div>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-[#0a0a0a] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <Code2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                <h3 className="text-xl md:text-2xl font-bold text-white">Technology Stack</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Frontend UI</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono rounded-md">Next.js</span>
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono rounded-md">Tailwind</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Backend API</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/20 text-xs font-mono rounded-md">FastAPI</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/20 text-xs font-mono rounded-md">Python</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">LLM Engine</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-mono rounded-md">Groq</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-mono rounded-md">Gemini</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Vector Memory</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/20 text-xs font-mono rounded-md">ChromaDB</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/20 text-xs font-mono rounded-md">LangChain</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">PDF Processing</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-mono rounded-md">PyPDF2</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-mono rounded-md">fpdf2</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}