'use client';

import React, { useState } from 'react';
import { BrainCircuit, Database, Layers, ArrowRight, Play, FastForward, RotateCcw, Calculator, Image as ImageIcon, ScanText, Map, Navigation, FileQuestion, ArrowDown } from 'lucide-react';

export default function SimulationPage() {

    // --- GLOBAL STATE ---
    const [activeTab, setActiveTab] = useState('rag');

    // --- RAG INTERACTIVE STATE ---
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // --- STATIC EDUCATIONAL DATA ---
    const docSentence = "Machine learning is amazing.";
    const docTokens = ["Machine", "learn", "##ing", "is", "amazing"];
    const docTokenIds = [341, 892, 12, 55, 2045];

    const querySentence = "Explain machine learning";
    const queryTokens = ["Explain", "machine", "learn", "##ing"];
    const queryTokenIds = [4091, 341, 892, 12];

    const vectors: Record<string, number[]> = {
        "Machine": [0.12, 0.88, -0.45],
        "machine": [0.12, 0.88, -0.45], 
        "learn": [0.55, -0.23, 0.77],
        "##ing": [0.33, -0.11, 0.44],
        "is": [0.11, 0.04, -0.09],
        "amazing": [0.67, 0.55, 0.21],
        "Explain": [-0.42, 0.31, 0.58]
    };

    // --- SELF-ATTENTION STATE ---
    const [bankContext, setBankContext] = useState<'neutral' | 'river' | 'finance'>('neutral');

    // --- VECTOR MATH STATE (King - Man + Woman = Queen) ---
    const [vectorMathStep, setVectorMathStep] = useState(0);
  
    const runVectorMath = () => {
        setVectorMathStep(0);
        setTimeout(() => setVectorMathStep(1), 1000); // Show calculated array
        setTimeout(() => setVectorMathStep(2), 2500); // Reveal "Queen" match
    };

    // ==========================================
    // --- 1. AUTOMATED OCR PIPELINE STATE ---
    // ==========================================
    const [ocrStep, setOcrStep] = useState(0); 
    const runOcrPipeline = () => {
        setOcrStep(0);
        setTimeout(() => setOcrStep(1), 1000); 
        setTimeout(() => setOcrStep(2), 2500); 
        setTimeout(() => setOcrStep(3), 5000); 
    };
    // A 7x7 pixel grid representing the letter "A" for the automated demo
    const pixelGridA = [
        0,0,1,1,1,0,0, 0,1,0,0,0,1,0, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1,
        1,0,0,0,0,0,1, 1,0,0,0,0,0,1, 1,0,0,0,0,0,1,
    ];

    // ==========================================
    // --- 2. INTERACTIVE OCR SANDBOX STATE ---
    // ==========================================
    const [pixels, setPixels] = useState<boolean[]>(Array(25).fill(false));
    const [ocrScanning, setOcrScanning] = useState(false);
    const [ocrResult, setOcrResult] = useState<string | null>(null);

    const togglePixel = (index: number) => {
        if (ocrScanning) return;
        const newPixels = [...pixels];
        newPixels[index] = !newPixels[index];
        setPixels(newPixels);
        setOcrResult(null); 
    };

    const clearGrid = () => {
        setPixels(Array(25).fill(false));
        setOcrResult(null);
    };

    const runInteractiveOcr = () => {
        setOcrScanning(true);
        setOcrResult(null);
        setTimeout(() => {
            setOcrScanning(false);
            const activeCount = pixels.filter(Boolean).length;
            if (activeCount === 0) setOcrResult("?");
            else if (activeCount < 8) setOcrResult("I");
            else if (activeCount > 15) setOcrResult("O");
            else setOcrResult("A");
        }, 2000);
    };

    // --- CONTROLS ---
    const nextStep = () => {
        if (step < 5) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);
            setStep(step + 1);
        }
    };

    const resetSimulation = () => setStep(0);

    return (
        <main className="relative flex flex-col items-center flex-1 px-4 sm:px-6 pt-12 pb-20 w-full min-h-screen overflow-hidden">

            {/* Background Glow - Made completely responsive to prevent horizontal scroll */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[120%] max-w-[600px] h-[300px] md:h-[400px] bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-6xl">

                {/* Header */}
                <div className="text-center mb-8 md:mb-10 px-2">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Under the Hood
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">An interactive breakdown of the Deep Learning architecture powering QuestAI.</p>
                </div>

                {/* --- CUSTOM TAB SELECTOR (Fully fluid & touch-friendly) --- */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-10">
                    <button
                        onClick={() => setActiveTab('rag')}
                        className={`flex items-center justify-center gap-2 px-5 py-3.5 md:py-3 rounded-xl font-semibold transition-all ${activeTab === 'rag' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Database className="w-4 h-4 md:w-5 md:h-5" /> RAG Pipeline
                    </button>
                    <button
                        onClick={() => setActiveTab('vectors')}
                        className={`flex items-center justify-center gap-2 px-5 py-3.5 md:py-3 rounded-xl font-semibold transition-all ${activeTab === 'vectors' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Map className="w-4 h-4 md:w-5 md:h-5" /> Vector Space
                    </button>
                    <button
                        onClick={() => setActiveTab('ocr')}
                        className={`flex items-center justify-center gap-2 px-5 py-3.5 md:py-3 rounded-xl font-semibold transition-all ${activeTab === 'ocr' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <ScanText className="w-4 h-4 md:w-5 md:h-5" /> OCR Engine
                    </button>
                </div>

                {/* =========================================
            TAB 1: INTERACTIVE RAG PIPELINE
        ========================================= */}
                {activeTab === 'rag' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">

                        {/* LEFT PANEL: Inputs & Controls */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-5 md:p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
                                <h2 className="text-lg md:text-xl font-bold mb-3 text-purple-400">1. Example Data</h2>
                                <p className="text-xs md:text-sm text-gray-400 mb-6">
                                    Because generating *real* embeddings requires a heavy neural network, we are using a static, mathematically accurate example to demonstrate the pipeline.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center gap-2"><Database className="w-3 h-3"/> Document Chunk</label>
                                        <div className="w-full mt-1.5 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-purple-100 font-mono shadow-inner break-words">
                                            {docSentence}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] md:text-xs text-green-400 font-bold uppercase tracking-wider flex items-center gap-2"><Layers className="w-3 h-3"/> User Query</label>
                                        <div className="w-full mt-1.5 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-100 font-mono shadow-inner break-words">
                                            {querySentence}
                                        </div>
                                    </div>
                                </div>

                                {/* Control Buttons */}
                                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                                    <button
                                        onClick={nextStep}
                                        disabled={step >= 5} 
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                                    >
                                        {step === 0 ? <Play className="w-5 h-5" /> : <FastForward className="w-5 h-5" />}
                                        {step === 0 ? "Start Simulation" : step === 5 ? "Simulation Complete" : "Next Step"}
                                    </button>

                                    {step > 0 && (
                                        <button
                                            onClick={resetSimulation}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all"
                                        >
                                            <RotateCcw className="w-4 h-4" /> Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Visualizer Stage */}
                        <div className="lg:col-span-2 p-4 sm:p-8 border border-white/10 rounded-2xl bg-[#0a0a0a] backdrop-blur-xl relative overflow-hidden min-h-[450px] lg:min-h-[500px]">

                            {/* Step 0 */}
                            {step === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 animate-in fade-in p-6 text-center">
                                    <Database className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-20" />
                                    <p className="text-sm md:text-base">Enter text on the left and click Start.</p>
                                </div>
                            )}

                           {/* Step 1 & 2: Tokenization & IDs */}
                            {(step === 1 || step === 2) && (
                                <div className={`space-y-6 md:space-y-8 flex flex-col justify-center h-full ${isAnimating ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'} transition-all duration-500`}>
                                    
                                    {/* Document Tokens */}
                                    <div className="p-4 md:p-5 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                                        <h3 className="text-xs md:text-sm font-bold text-purple-400 mb-3 md:mb-4 border-b border-purple-500/20 pb-2">
                                            1. Document Tokenization
                                        </h3>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {docTokens.map((token, i) => (
                                                <div key={`doc-${i}`} className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                                                    <div className="px-2 md:px-3 py-1 md:py-1.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-200 font-mono text-xs md:text-sm">{token}</div>
                                                    {step >= 2 && <div className="mt-1.5 md:mt-2 px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-mono rounded animate-in fade-in">ID: {docTokenIds[i]}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Query Tokens */}
                                    <div className="p-4 md:p-5 bg-green-500/5 border border-green-500/20 rounded-xl">
                                        <h3 className="text-xs md:text-sm font-bold text-green-400 mb-3 md:mb-4 border-b border-green-500/20 pb-2">
                                            2. Query Tokenization
                                        </h3>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {queryTokens.map((token, i) => (
                                                <div key={`query-${i}`} className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                                                    <div className="px-2 md:px-3 py-1 md:py-1.5 bg-green-500/20 border border-green-500/40 rounded text-green-200 font-mono text-xs md:text-sm">{token}</div>
                                                    {step >= 2 && <div className="mt-1.5 md:mt-2 px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-mono rounded animate-in fade-in">ID: {queryTokenIds[i]}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {step >= 2 && (
                                        <p className="text-[10px] md:text-xs text-gray-400 text-center animate-in fade-in px-4">Notice how the shared concepts ("learn", "##ing") get the exact same Token IDs!</p>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Embeddings */}
                            {step === 3 && (
                                <div className={`space-y-4 md:space-y-6 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 ${isAnimating ? 'opacity-50' : 'opacity-100'} transition-all duration-500`}>
                                    <div className="text-center mb-1 md:mb-2">
                                        <h2 className="text-lg md:text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                            <BrainCircuit className="text-purple-400 w-4 h-4 md:w-5 md:h-5" /> Vector Lookup
                                        </h2>
                                        <p className="text-gray-400 text-[10px] md:text-xs">Each ID is mapped to a 384-dimension coordinate.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl mx-auto">
                                        {/* Doc Vectors */}
                                        <div className="space-y-2">
                                            <div className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Document Vectors</div>
                                            {docTokens.slice(0, 3).map((token, i) => (
                                                <div key={`d-vec-${i}`} className="p-2 bg-white/5 border border-purple-500/30 rounded flex items-center gap-1.5 md:gap-2">
                                                    <div className="w-12 md:w-16 text-purple-300 font-mono text-[10px] md:text-xs text-right truncate">{token}</div>
                                                    <ArrowRight className="text-gray-600 w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
                                                    <div className="font-mono text-[10px] md:text-xs text-gray-400 bg-black/50 p-1 md:p-1.5 rounded flex-1 truncate">
                                                        [{vectors[token].join(", ")}, ...]
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-center text-gray-500 text-[10px] md:text-xs font-mono">... {docTokens.length - 3} more</div>
                                        </div>

                                        {/* Query Vectors */}
                                        <div className="space-y-2">
                                            <div className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Query Vectors</div>
                                            {queryTokens.slice(0, 3).map((token, i) => (
                                                <div key={`q-vec-${i}`} className="p-2 bg-white/5 border border-green-500/30 rounded flex items-center gap-1.5 md:gap-2">
                                                    <div className="w-12 md:w-16 text-green-300 font-mono text-[10px] md:text-xs text-right truncate">{token}</div>
                                                    <ArrowRight className="text-gray-600 w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
                                                    <div className="font-mono text-[10px] md:text-xs text-gray-400 bg-black/50 p-1 md:p-1.5 rounded flex-1 truncate">
                                                        [{vectors[token].join(", ")}, ...]
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-center text-gray-500 text-[10px] md:text-xs font-mono">... {queryTokens.length - 3} more</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Cosine Similarity */}
                            {step === 4 && (
                                <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
                                    <Calculator className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mb-3 md:mb-4" />
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white text-center">Cosine Similarity</h2>
                                    <p className="text-gray-400 text-xs md:text-sm mb-6 text-center max-w-lg px-2">
                                        The AI averages the token vectors to create one single vector for the Document and one for the Query. Then, it measures the angle between them.
                                    </p>

                                    <div className="w-full max-w-md space-y-3 md:space-y-4 mb-6 md:mb-8">
                                        <div className="p-2.5 md:p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex flex-col sm:flex-row sm:justify-between items-center font-mono text-xs md:text-sm gap-1 sm:gap-0 text-center sm:text-left">
                                            <span className="text-purple-300">Vector A (Doc):</span>
                                            <span className="text-gray-400 break-all">[0.44, 0.31, 0.12, ...]</span>
                                        </div>
                                        <div className="p-2.5 md:p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex flex-col sm:flex-row sm:justify-between items-center font-mono text-xs md:text-sm gap-1 sm:gap-0 text-center sm:text-left">
                                            <span className="text-green-300">Vector B (Query):</span>
                                            <span className="text-gray-400 break-all">[0.41, 0.28, 0.19, ...]</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/10 font-mono text-center mb-6 shadow-inner w-full max-w-md">
                                        <div className="text-gray-300 text-xs md:text-sm mb-2 break-words px-2">cos(θ) = (A · B) / (||A|| * ||B||)</div>
                                        <div className="border-t border-gray-700 my-3"></div>
                                        <div className="text-blue-400 font-bold text-xl md:text-2xl animate-pulse">
                                            Similarity Score: 92.4%
                                        </div>
                                    </div>
                                    
                                    <p className="text-[10px] md:text-xs text-green-400 font-bold bg-green-400/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-green-400/20 text-center">
                                        High Match! This Document is sent to the LLM.
                                    </p>
                                </div>
                            )}

                            {/* Step 5: Augmented Generation */}
                            {step === 5 && (
                                <div className="h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 duration-700 w-full py-4 md:py-0">
                                    <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-white flex items-center justify-center gap-2 md:gap-3 text-center">
                                        <BrainCircuit className="text-green-400 w-6 h-6 md:w-8 md:h-8 shrink-0" /> Augmented Generation
                                    </h2>
                                    <p className="text-gray-400 text-xs md:text-sm mb-5 md:mb-6 text-center max-w-lg px-2">
                                        The "Aha!" moment. We dynamically construct a massive, invisible prompt containing the exact text we retrieved from the database!
                                    </p>

                                    {/* The Prompt Injector Visual */}
                                    <div className="w-full max-w-xl bg-[#111] rounded-xl border border-gray-700 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                        <div className="bg-gray-800 px-3 py-2 md:px-4 md:py-2 border-b border-gray-700 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Layers className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> LLM Prompt Construction
                                        </div>

                                        <div className="p-3 md:p-4 space-y-3 font-mono text-[10px] md:text-xs">
                                            {/* System Prompt */}
                                            <div className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 animate-in fade-in overflow-x-hidden break-words" style={{ animationDelay: '100ms' }}>
                                                <span className="text-gray-500 font-bold block mb-1.5 text-[9px] md:text-[10px] uppercase tracking-wider flex items-center gap-1.5 md:gap-2">
                                                    <ScanText className="w-3 h-3" /> 1. SYSTEM ROLE
                                                </span>
                                                "You are an expert professor. Answer the user's question using ONLY the provided context."
                                            </div>

                                            {/* Retrieved Context (The RAG magic) */}
                                            <div className="p-2.5 md:p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 animate-in fade-in slide-in-from-left-4 overflow-x-hidden break-words" style={{ animationDelay: '600ms' }}>
                                                <span className="text-green-500 font-bold block mb-1.5 text-[9px] md:text-[10px] uppercase tracking-wider flex items-center gap-1.5 md:gap-2">
                                                    <Database className="w-3 h-3 shrink-0" /> 2. Retrieved Context
                                                </span>
                                                "Machine learning is amazing. It allows computers to learn from data without being explicitly programmed."
                                            </div>

                                            {/* User Query */}
                                            <div className="p-2.5 md:p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 animate-in fade-in overflow-x-hidden break-words" style={{ animationDelay: '1100ms' }}>
                                                <span className="text-blue-500 font-bold block mb-1.5 text-[9px] md:text-[10px] uppercase tracking-wider flex items-center gap-1.5 md:gap-2">
                                                    <FileQuestion className='w-3 h-3' /> 3. USER QUESTION
                                                </span>
                                                "What is machine learning?"
                                            </div>
                                        </div>
                                    </div>

                                    <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-gray-500 my-3 md:my-4 animate-bounce" />

                                    <div className="px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] animate-in zoom-in text-xs md:text-sm text-center max-w-[90%]" style={{ animationDelay: '1600ms' }}>
                                        Flawless, Hallucination-Free Output!
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* =========================================
            TAB 2: VECTORS & SELF-ATTENTION
        ========================================= */}
                {activeTab === 'vectors' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">

                        {/* 2D Vector Graph */}
                        <div className="p-5 md:p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-white">
                                    <Navigation className="text-pink-400 w-5 h-5 md:w-6 md:h-6" /> 2D Vector Space
                                </h2>
                                <p className="text-xs md:text-sm text-gray-400 mb-4 leading-relaxed">
                                    Embeddings convert words into coordinates (vectors). In this simplified 2D map, notice how similar concepts cluster together mathematically.
                                </p>
                                <ul className="text-xs md:text-sm text-gray-300 space-y-2 mb-5 md:mb-6">
                                    <li>🍎 <strong>Fruits:</strong> Top Right (High X, High Y)</li>
                                    <li>🚗 <strong>Vehicles:</strong> Bottom Left (Low X, Low Y)</li>
                                </ul>
                                <p className="text-[10px] md:text-xs text-pink-300 font-mono bg-pink-500/10 p-2.5 md:p-3 rounded-lg border border-pink-500/20">
                                    Math logic: The closer the dots, the higher the Cosine Similarity score!
                                </p>
                            </div>

                            {/* The Graph UI */}
                            <div className="relative w-[80%] md:w-full aspect-square max-w-[250px] md:max-w-[300px] mx-auto bg-[#0a0a0a] border-l-2 border-b-2 border-gray-600 rounded-bl-sm mt-4 lg:mt-0">
                                <span className="absolute -left-5 md:-left-6 top-0 text-[10px] md:text-xs text-gray-500">Y</span>
                                <span className="absolute bottom-[-16px] md:bottom-[-20px] right-0 text-[10px] md:text-xs text-gray-500">X</span>

                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
                                    {[...Array(16)].map((_, i) => <div key={i} className="border-t border-r border-white"></div>)}
                                </div>

                                {/* Fruits */}
                                <div className="absolute left-[80%] bottom-[85%] w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full shadow-[0_0_8px_red]"></div>
                                <span className="absolute left-[85%] bottom-[84%] text-[9px] md:text-xs text-gray-300">Apple</span>

                                <div className="absolute left-[70%] bottom-[75%] w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-500 rounded-full shadow-[0_0_8px_yellow]"></div>
                                <span className="absolute left-[75%] bottom-[74%] text-[9px] md:text-xs text-gray-300">Banana</span>

                                {/* Vehicles */}
                                <div className="absolute left-[15%] bottom-[20%] w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full shadow-[0_0_8px_blue]"></div>
                                <span className="absolute left-[20%] bottom-[19%] text-[9px] md:text-xs text-gray-300">Car</span>

                                <div className="absolute left-[25%] bottom-[10%] w-2.5 h-2.5 md:w-3 md:h-3 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]"></div>
                                <span className="absolute left-[30%] bottom-[9%] text-[9px] md:text-xs text-gray-300">Bike</span>
                            </div>
                        </div>

                        {/* --- NEW: Vector Arithmetic Interactive Demo --- */}
            <div className="p-5 md:p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white flex items-center gap-2 md:gap-3">
                <Calculator className="text-pink-400 w-5 h-5 md:w-6 md:h-6" /> Vector Arithmetic
              </h2>
              <p className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8 max-w-3xl">
                Because words are just math (arrays of numbers), you can literally add and subtract concepts! The most famous example is <strong>King − Man + Woman</strong>.
              </p>

              {/* The Math Equation */}
              <div className="flex flex-col md:flex-row flex-wrap items-center justify-center lg:justify-between gap-3 md:gap-4 font-mono text-xs md:text-sm">
                
                {/* King */}
                <div className="p-3 md:p-4 bg-white/5 border border-purple-500/30 rounded-xl text-center w-full sm:w-[45%] md:w-auto shadow-inner">
                  <div className="text-purple-400 font-bold mb-1.5 md:mb-2 text-base md:text-lg">KING</div>
                  <div className="text-gray-400 bg-black/50 px-2 py-1 rounded border border-white/5 break-words">[0.8, 0.2, 0.6]</div>
                </div>

                <div className="text-xl md:text-3xl font-bold text-gray-600 rotate-90 md:rotate-0">−</div>

                {/* Man */}
                <div className="p-3 md:p-4 bg-white/5 border border-blue-500/30 rounded-xl text-center w-full sm:w-[45%] md:w-auto shadow-inner">
                  <div className="text-blue-400 font-bold mb-1.5 md:mb-2 text-base md:text-lg">MAN</div>
                  <div className="text-gray-400 bg-black/50 px-2 py-1 rounded border border-white/5 break-words">[0.7, 0.1, 0.5]</div>
                </div>

                <div className="text-xl md:text-3xl font-bold text-gray-600 rotate-90 md:rotate-0">+</div>

                {/* Woman */}
                <div className="p-3 md:p-4 bg-white/5 border border-pink-500/30 rounded-xl text-center w-full sm:w-[45%] md:w-auto shadow-inner">
                  <div className="text-pink-400 font-bold mb-1.5 md:mb-2 text-base md:text-lg">WOMAN</div>
                  <div className="text-gray-400 bg-black/50 px-2 py-1 rounded border border-white/5 break-words">[0.6, 0.3, 0.5]</div>
                </div>

                <div className="text-xl md:text-3xl font-bold text-gray-600 rotate-90 lg:rotate-0">=</div>

                {/* Result Area */}
                <div className="flex flex-col items-center gap-2 w-full lg:w-auto min-h-[80px] justify-center mt-4 lg:mt-0">
                   {vectorMathStep === 0 ? (
                     <button 
                       onClick={runVectorMath} 
                       className="px-6 py-3.5 md:px-8 md:py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 w-full sm:w-auto justify-center"
                     >
                       <Calculator className="w-4 h-4 md:w-5 md:h-5" /> Calculate Math
                     </button>
                   ) : (
                     <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 animate-in zoom-in duration-500 w-full justify-center">
                       
                       {/* Pure Math Result */}
                       <div className="p-3 md:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center w-full sm:w-auto">
                         <div className="text-yellow-400 font-bold mb-1.5 md:mb-2 text-[10px] md:text-xs uppercase tracking-widest">Result Array</div>
                         <div className="text-yellow-200 bg-black/50 px-2 py-1 rounded break-words">[0.7, 0.4, 0.6]</div>
                       </div>

                       {vectorMathStep >= 2 && (
                         <>
                           <div className="text-xl md:text-2xl font-bold text-gray-500 animate-in fade-in rotate-90 sm:rotate-0">≈</div>
                           
                           {/* The Magic Match */}
                           <div className="p-3 md:p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-in slide-in-from-top-4 sm:slide-in-from-left-8 duration-700 w-full sm:w-auto">
                             <div className="text-green-400 font-bold mb-1.5 md:mb-2 text-base md:text-lg tracking-widest">QUEEN</div>
                             <div className="text-green-200 bg-black/50 px-2 py-1 rounded border border-green-500/30 break-words">[0.72, 0.38, 0.61]</div>
                           </div>
                         </>
                       )}
                     </div>
                   )}
                </div>
              </div>

              {/* Explanation Note */}
              {vectorMathStep >= 2 && (
                <div className="mt-6 md:mt-8 text-center text-[10px] md:text-sm text-green-300 bg-green-500/10 py-3 px-4 md:px-6 rounded-xl border border-green-500/20 animate-in fade-in slide-in-from-bottom-4">
                  <strong>The Magic:</strong> The math perfectly shifts the concept coordinate to land exactly on <strong>"Queen"</strong>!
                  <button onClick={() => setVectorMathStep(0)} className="ml-3 md:ml-4 text-xs text-gray-400 hover:text-white underline underline-offset-2">Reset</button>
                </div>
              )}
            </div>
            
                        {/* Self-Attention Interactive Demo */}
                        <div className="p-5 md:p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
                            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">Self-Attention</h2>
                            <p className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8 max-w-2xl">
                                Older AI mapped words statically. Transformers use <strong>Self-Attention</strong> to look at neighboring words and mathematically pull the coordinate toward the correct context. Try it below:
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                                {/* Controls */}
                                <div className="space-y-3 md:space-y-4">
                                    <button
                                        onClick={() => setBankContext('neutral')}
                                        className={`w-full p-3 md:p-4 rounded-xl border text-left transition-all ${bankContext === 'neutral' ? 'border-gray-400 bg-gray-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="text-[10px] md:text-xs text-gray-400 mb-1">No Context</div>
                                        <div className="font-mono text-xs md:text-sm text-white">"I sat on the bank."</div>
                                    </button>
                                    <button
                                        onClick={() => setBankContext('river')}
                                        className={`w-full p-3 md:p-4 rounded-xl border text-left transition-all ${bankContext === 'river' ? 'border-green-400 bg-green-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="text-[10px] md:text-xs text-green-400 mb-1">Nature Context</div>
                                        <div className="font-mono text-xs md:text-sm text-white">"I sat by the <span className="text-green-400 font-bold">river</span> bank."</div>
                                    </button>
                                    <button
                                        onClick={() => setBankContext('finance')}
                                        className={`w-full p-3 md:p-4 rounded-xl border text-left transition-all ${bankContext === 'finance' ? 'border-yellow-400 bg-yellow-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="text-[10px] md:text-xs text-yellow-400 mb-1">Finance Context</div>
                                        <div className="font-mono text-xs md:text-sm text-white">"I deposited <span className="text-yellow-400 font-bold">money</span> in the bank."</div>
                                    </button>
                                </div>

                                {/* Attention Graph Simulator */}
                                <div className="relative w-full h-[200px] md:h-[250px] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden mt-4 lg:mt-0">
                                    <div className="absolute top-3 md:top-4 left-3 md:left-4 text-[10px] md:text-xs font-bold text-green-500/50 uppercase">Nature</div>
                                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-[10px] md:text-xs font-bold text-yellow-500/50 uppercase">Finance</div>

                                    {/* The Word "Bank" (Animated Dot) */}
                                    <div
                                        className={`absolute flex flex-col items-center transition-all duration-700 ease-in-out
                      ${bankContext === 'neutral' ? 'top-[40%] left-[40%] md:top-[45%] md:left-[45%]' : ''}
                      ${bankContext === 'river' ? 'top-[15%] left-[15%]' : ''}
                      ${bankContext === 'finance' ? 'top-[65%] left-[65%] md:top-[75%] md:left-[75%]' : ''}
                    `}
                                    >
                                        <div className="w-4 h-4 md:w-5 md:h-5 bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899] animate-pulse"></div>
                                        <span className="mt-1.5 md:mt-2 text-xs md:text-sm font-bold text-white bg-black/50 px-1.5 md:px-2 rounded">BANK</span>
                                    </div>

                                    {/* Attention Lines */}
                                    {bankContext === 'river' && (
                                        <div className="absolute top-[20%] left-[20%] w-24 md:w-32 h-[2px] bg-green-500/50 -rotate-45 origin-left animate-in fade-in"></div>
                                    )}
                                    {bankContext === 'finance' && (
                                        <div className="absolute top-[75%] left-[75%] md:top-[80%] md:left-[80%] w-24 md:w-32 h-[2px] bg-yellow-500/50 -rotate-135 origin-left animate-in fade-in"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================
            TAB 3: OCR & NEURAL NETWORK (MERGED)
        ========================================= */}
        {activeTab === 'ocr' && (
          <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 w-full">
            
            {/* PART 1: THE AUTOMATED PIPELINE */}
            <div className="space-y-5 md:space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-2 md:mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">Part 1: The Visual Pipeline</h2>
                <p className="text-xs md:text-sm text-gray-400">Watch how a smooth PDF document is mathematically converted into pixels and scanned by a Neural Network.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Explanation */}
                <div className="lg:col-span-1 p-5 md:p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    
                    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-all ${ocrStep >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shrink-0 z-10 ${ocrStep === 0 ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_blue]' : 'bg-[#111] border-white/20 text-gray-500'}`}>1</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 md:p-4 rounded-xl border border-white/10 bg-white/5 ml-4 md:ml-0 md:mr-4">
                        <h3 className="font-bold text-xs md:text-sm text-white">PDF Vector</h3>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">Mathematical curves & lines.</p>
                      </div>
                    </div>

                    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-all ${ocrStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shrink-0 z-10 ${ocrStep === 1 ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_cyan]' : 'bg-[#111] border-white/20 text-gray-500'}`}>2</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 md:p-4 rounded-xl border border-white/10 bg-white/5 ml-4 md:ml-0 md:mr-4">
                        <h3 className="font-bold text-xs md:text-sm text-white">Poppler Raster</h3>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">Converted to pixel grid.</p>
                      </div>
                    </div>

                    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-all ${ocrStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shrink-0 z-10 ${ocrStep === 2 ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_green]' : 'bg-[#111] border-white/20 text-gray-500'}`}>3</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 md:p-4 rounded-xl border border-white/10 bg-white/5 ml-4 md:ml-0 md:mr-4">
                        <h3 className="font-bold text-xs md:text-sm text-white">Tesseract LSTM</h3>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">Scanning lines for patterns.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={runOcrPipeline}
                    disabled={ocrStep > 0 && ocrStep < 3}
                    className="mt-6 md:mt-8 w-full py-3.5 md:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 text-sm md:text-base"
                  >
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5"/> {ocrStep > 0 && ocrStep < 3 ? "Processing..." : "Run OCR Pipeline"}
                  </button>
                </div>

                {/* Right Panel: Canvas */}
                <div className="lg:col-span-2 p-4 md:p-8 border border-white/10 rounded-2xl bg-[#0a0a0a] backdrop-blur-xl relative overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center justify-center">
                  
                  {/* State 0 */}
                  <div className={`absolute transition-all duration-700 ${ocrStep === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <div className="relative text-center">
                      <div className="absolute top-1/2 -right-4 md:-right-8 w-full h-[1px] bg-blue-500/50 -z-10"></div>
                      <span className="text-[7rem] sm:text-[8rem] md:text-[10rem] font-serif leading-none text-transparent tracking-tighter" style={{ WebkitTextStroke: '2px #3b82f6' }}>A</span>
                    </div>
                    <div className="text-center mt-4 text-blue-400 font-mono text-xs md:text-sm bg-blue-500/10 py-1.5 px-3 md:py-2 md:px-4 rounded-lg border border-blue-500/20">Vector Path</div>
                  </div>

                  {/* State 1 & 2 */}
                  <div className={`absolute flex flex-col items-center transition-all duration-700 w-full px-2 ${ocrStep === 1 || ocrStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-12 items-center">
                      <div className="relative w-36 h-36 md:w-48 md:h-48 grid grid-cols-7 gap-1 p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-xl shrink-0">
                        {pixelGridA.map((val, i) => <div key={i} className={`rounded-sm transition-colors duration-500 ${val === 1 ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-black'}`}></div>)}
                        {ocrStep >= 1 && <div className={`absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_20px_#4ade80] z-10 transition-all ease-linear ${ocrStep === 2 ? 'top-full duration-[2500ms]' : 'top-0 opacity-0 duration-0'}`}></div>}
                      </div>
                      
                      <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 items-center transition-opacity duration-500 ${ocrStep === 2 ? 'opacity-100' : 'opacity-20'}`}>
                        <ArrowRight className="text-gray-600 hidden sm:block shrink-0" />
                        <ArrowDown className="text-gray-600 sm:hidden shrink-0" />
                        <div className="flex gap-2 md:gap-4 items-center">
                          <div className="flex flex-col gap-1.5 md:gap-2">{[1,2,3].map(n => <div key={`l1-${n}`} className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${ocrStep===2 ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} style={{ animationDelay: `${n*100}ms`}}></div>)}</div>
                          <div className="flex flex-col justify-center gap-1.5 md:gap-2">{[1,2].map(n => <div key={`l2-${n}`} className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${ocrStep===2 ? 'bg-green-400 animate-pulse' : 'bg-gray-700'}`} style={{ animationDelay: `${n*200}ms`}}></div>)}</div>
                          <div className="flex flex-col justify-center ml-2 md:ml-0"><div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold ${ocrStep===2 ? 'bg-white text-green-600 shadow-[0_0_20px_white]' : 'bg-gray-700 text-transparent'} transition-all duration-1000 delay-1000`}>A</div></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* State 3 */}
                  <div className={`absolute flex flex-col items-center transition-all duration-700 ${ocrStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-[0_0_30px_rgba(74,222,128,0.4)]"><ScanText className="w-6 h-6 md:w-8 md:h-8 text-green-400" /></div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Extraction Complete</h2>
                    <div className="mt-3 md:mt-4 p-3 md:p-4 bg-[#111] border border-gray-700 rounded-xl font-mono text-center w-48 md:w-64 shadow-inner">
                      <div className="text-gray-500 text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-widest">Digital String</div>
                      <div className="text-3xl md:text-4xl text-green-400 font-bold">"A"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* PART 2: THE INTERACTIVE SANDBOX */}
            <div className="space-y-5 md:space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-2 md:mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">Part 2: Interactive Sandbox</h2>
                <p className="text-xs md:text-sm text-gray-400">Draw a letter on the pixel grid. Watch how the 2D image is "flattened" into an array to predict the character!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-5 md:p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl items-center">
                
                {/* 1. DRAW PAD */}
                <div className="flex flex-col items-center">
                  <h3 className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 md:mb-6 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /> 1. Pixel Grid
                  </h3>
                  
                  <div className="grid grid-cols-5 gap-1 p-2 bg-white/5 border border-white/10 rounded-xl mb-5 md:mb-6">
                    {pixels.map((isActive, i) => (
                      <button
                        key={i} onClick={() => togglePixel(i)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-sm border transition-colors touch-none ${isActive ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-black border-white/10 hover:bg-white/10'}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 md:gap-3 w-full max-w-[240px]">
                    <button onClick={clearGrid} disabled={ocrScanning} className="flex-1 py-2.5 md:py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs md:text-sm font-medium transition-all">Clear</button>
                    <button onClick={runInteractiveOcr} disabled={ocrScanning} className="flex-[2] py-2.5 md:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50">
                      {ocrScanning ? 'Scanning...' : 'Scan Image'}
                    </button>
                  </div>
                </div>

                {/* 2. THE NEURAL NETWORK */}
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center relative py-6 md:py-10 gap-4 md:gap-0">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full text-gray-600 text-xs font-mono items-center hidden lg:flex flex-col">
                    <span>Flatten</span><ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Input Layer */}
                  <div className="flex flex-col gap-1 items-center z-10 w-full md:w-auto">
                    <span className="text-[9px] md:text-[10px] text-gray-500 mb-1 md:mb-2 uppercase font-bold tracking-widest text-center">Input Layer (25)</span>
                    <div className="flex flex-row md:flex-col flex-wrap md:h-[220px] w-full md:w-auto gap-1 md:gap-1.5 justify-center content-center px-4 md:px-0">
                      {pixels.map((isActive, i) => (
                        <div key={`in-${i}`} className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-gray-800'}`}/>
                      ))}
                    </div>
                  </div>

                  <ArrowDown className={`w-5 h-5 md:hidden ${ocrScanning ? 'text-green-400 animate-pulse' : 'text-gray-700'} transition-colors my-2`} />
                  <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 hidden md:block ${ocrScanning ? 'text-green-400 animate-pulse' : 'text-gray-700'} transition-colors mx-2`} />

                  {/* Hidden Layer */}
                  <div className="flex flex-col gap-2 items-center z-10">
                    <span className="text-[9px] md:text-[10px] text-gray-500 mb-1 md:mb-2 uppercase font-bold tracking-widest text-center">Hidden Layer</span>
                    <div className="flex flex-row md:flex-col gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`hid-${i}`} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all border border-green-500/30 ${ocrScanning ? 'bg-green-500 shadow-[0_0_15px_#22c55e] animate-pulse' : 'bg-gray-800'}`} style={{ animationDelay: `${i * 100}ms` }}/>
                      ))}
                    </div>
                  </div>

                  <ArrowDown className={`w-5 h-5 md:hidden ${ocrScanning ? 'text-green-400 animate-pulse' : 'text-gray-700'} transition-colors my-2`} style={{ animationDelay: '500ms' }} />
                  <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 hidden md:block ${ocrScanning ? 'text-green-400 animate-pulse' : 'text-gray-700'} transition-colors mx-2`} style={{ animationDelay: '500ms' }} />
                </div>

                {/* 3. THE OUTPUT LAYER */}
                <div className="flex flex-col items-center">
                   <h3 className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 md:mb-6 flex items-center gap-2">
                    <ScanText className="w-3 h-3 md:w-4 md:h-4 text-green-400" /> 3. Output
                  </h3>
                  
                  <div className="flex flex-row md:flex-col gap-3 w-full justify-center flex-wrap md:max-w-[150px]">
                    {["A", "I", "O", "?"].map((char) => (
                      <div key={char} className={`px-4 py-2 md:px-4 md:py-3 rounded-xl border text-center font-mono text-lg md:text-xl font-bold transition-all duration-500 ${ocrResult === char ? 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)] scale-110' : 'bg-black/50 border-white/10 text-gray-600'}`}>
                        {char}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

            </div>
        </main>
    );
}