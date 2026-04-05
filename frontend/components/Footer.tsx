import React from 'react';
import Link from 'next/link';
import { BookOpen, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <BookOpen className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-xl font-extrabold tracking-tight text-white">QuestAI</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering students and professionals to master complex concepts through AI-generated quizzes and interactive document tutoring.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  Start Learning
                </Link>
              </li>
              <li>
                <Link href="/simulation" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Project Info */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Project Info</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/ronitsavaliya03/QuestAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                  View Code on GitHub
                </a>
              </li>
              <li className="text-gray-400 text-sm">Built with Next.js, RAG & Advanced LLMs</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Disclaimer */}
        <div className="mt-12 border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} QuestAI. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 max-w-xl text-center md:text-right">
            Disclaimer: This application is for educational purposes. AI-generated content may occasionally contain inaccuracies. Always verify critical information.
          </p>
        </div>
      </div>
    </footer>
  );
}