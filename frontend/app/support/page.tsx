'use client';

import React, { useState } from 'react';
import { Heart, Coffee, Code2, QrCode, Copy, CheckCircle2, Zap, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [copied, setCopied] = useState(false);
  const upiId = "8488818874@upi"; 

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative flex flex-col items-center flex-1 px-4 sm:px-6 pt-16 md:pt-24 pb-20 w-full overflow-hidden min-h-screen">
      
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[120%] max-w-[600px] h-[300px] md:h-[400px] bg-yellow-600/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Heart className="w-8 h-8 text-yellow-400 fill-yellow-400/20" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight pb-5 mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Support My Work
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            I build free, open-source tools for the community. If QuestAI has helped you, consider supporting the server costs and late-night coding sessions!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: About & Work (Takes up 3/5 of space on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Developer Card */}
            <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl">
              <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row mb-6">
                {/* Replace src with your actual profile picture */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 flex-shrink-0">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-bold text-white">👨‍💻</span>
                    {/* <img src="/my-profile.jpg" alt="Profile" className="w-full h-full object-cover" /> */}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Hi, I'm Ronit Savaliya</h2>
                  <p className="text-purple-400 font-medium">Creator of QuestAI</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                I am a passionate developer focusing on AI and educational technology. I built QuestAI to help students and teachers process documents faster without relying on expensive, paid AI subscriptions. 
              </p>

              <div className="flex gap-4">
                <a href="https://github.com/ronitsavaliya03" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" /> GitHub
                </a>
                <a href="https://twitter.com/imrsavaliya03" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" /> Twitter
                </a>
              </div>
            </div>

            {/* Project Showcase */}
            <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" /> What your support funds
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-200 block">Server & API Costs</strong>
                    <span className="text-gray-400 text-sm">Keeping the RAG pipeline and AI features running fast and free for everyone.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-200 block">Development Time</strong>
                    <span className="text-gray-400 text-sm">Funding the hundreds of hours spent designing, coding, and debugging new features.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment / QR Code (Takes up 2/5 of space on desktop) */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 border border-yellow-500/30 rounded-3xl bg-yellow-500/5 backdrop-blur-xl sticky top-28 shadow-[0_0_40px_rgba(234,179,8,0.05)]">
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Buy me a coffee</h3>
                <p className="text-sm text-gray-400">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl mb-6 mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center relative overflow-hidden group">
                  <img src="/upi-qr.jpeg" alt="UPI QR Code" className="w-full h-full object-contain" />
                
                {/* <div className="text-center flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-gray-800 mb-2" />
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Place QR Here</span>
                </div> */}
              </div>

              {/* Copy UPI ID Button */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-1 flex items-center justify-between mb-6">
                <span className="text-sm font-mono text-gray-300 pl-4 py-2 truncate flex-1">
                  {upiId}
                </span>
                <button 
                  onClick={handleCopyUPI}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </button>
              </div>

              {/* Mobile "Pay Now" Deep Link (Only shows on mobile, attempts to open UPI apps directly) */}
              <a 
                href={`upi://pay?pa=${upiId}&pn=QuestAI%20Developer&cu=INR`}
                className="md:hidden w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-4"
              >
                Open UPI App <Zap className="w-4 h-4 fill-black" />
              </a>

              <div className="text-center text-xs text-gray-500 border-t border-white/10 pt-4">
                100% secure. Zero platform fees.
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}