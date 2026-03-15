import React from 'react';
import { BookOpen, Code2, GraduationCap, Target, Download, Bot, Database, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center flex-1 px-4 pt-20 pb-20 w-full overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <BookOpen className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            About QuestAI
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            An advanced document analysis platform designed to instantly generate intelligent assessments and provide interactive tutoring using state-of-the-art Large Language Models and RAG architecture.
          </p>
        </div>

        {/* --- SECTION 1: PLATFORM CAPABILITIES --- */}
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" /> Core Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16">
          
          {/* Feature 1: MCQ Generation */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Smart Assessment Generation</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Tailor your quizzes exactly to your needs by specifying a <strong>Focus Topic</strong> (e.g., "Newton's Laws"), or let the AI scan the entire document. Choose from 3 distinct cognitive difficulties:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="text-green-400 font-bold">Easy:</span> Direct fact extraction and vocabulary recall.</li>
              <li><span className="text-yellow-400 font-bold">Medium:</span> Conceptual understanding and application.</li>
              <li><span className="text-red-400 font-bold">Hard:</span> Deep analysis, inference, and critical thinking.</li>
            </ul>
          </div>

          {/* Feature 2: AI Tutor */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Interactive Document Tutor</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Don't just take a quiz—understand the material. Our built-in AI Tutor slides out seamlessly alongside your questions. 
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ask cross-questions about specific MCQs or request deeper explanations of complex concepts. The AI uses semantic search to only answer based on the context of your uploaded PDF, preventing hallucinations.
            </p>
          </div>

          {/* Feature 3: Professional Export */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Professional PDF Export</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Instantly convert your generated MCQs into formatted, print-ready PDF test papers. Teachers and students can easily toggle an <strong>"Include Answers"</strong> switch to generate either a blank student copy or a complete teacher's grading key.
            </p>
          </div>

          {/* Feature 4: RAG Simulation */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">"Under the Hood" RAG Simulation</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curious how AI reads documents? Access our interactive simulation sandbox to visualize the <strong>Retrieval-Augmented Generation (RAG)</strong> pipeline. Watch in real-time as your PDF is broken into text chunks, converted into high-dimensional vector embeddings, and searched using Cosine Similarity math.
            </p>
          </div>
        </div>

        {/* --- SECTION 2: ACADEMIC & TECH DETAILS --- */}
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2 border-t border-white/10 pt-16">
          <Code2 className="w-6 h-6 text-gray-400" /> Technical Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Academic Card */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold">Academic Project</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              This application was developed as part of the Machine Learning & Deep Learning coursework at <strong>Darshan University</strong>. The objective is to create a complete, industry-level Deep Learning application featuring complex vector mathematics, dynamic memory management, and a highly polished user interface.
            </p>
            <div className="text-xs font-mono text-purple-300 bg-purple-900/20 py-2 px-3 rounded border border-purple-500/20 inline-block">
              Category: Natural Language Processing (NLP) & RAG
            </div>
          </div>

          {/* Tech Stack Card */}
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold">Our Technology Stack</h3>
            </div>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-gray-200">Frontend UI</strong>
                <span>Next.js & Tailwind CSS</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-gray-200">Backend API</strong>
                <span>FastAPI (Python)</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-gray-200">AI / LLM Fallback</strong>
                <span>Groq, Gemini, Ollama</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-gray-200">Vector Database</strong>
                <span>ChromaDB & LangChain</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <strong className="text-gray-200">PDF Processing</strong>
                <span>PyPDF2 & fpdf2</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}