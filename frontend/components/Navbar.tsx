'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, MessageSquare, Bug, Coffee, Github } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

// Initialize the professional font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/generate' },
    { name: 'Simulation', href: '/simulation' }, 
    { name: 'About', href: '/about' },
  ];

  // Function to close the mobile menu when a link is clicked
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
    <nav className={`px-8 py-5 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 ${jakarta.className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 cursor-pointer group">
          <BookOpen className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
          <span className="text-xl font-extrabold tracking-tight text-white">QuestAI</span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-base font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`transition-all duration-300 pb-1 relative ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
                {/* Animated underline for active state */}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Call to Action & Mobile Toggle Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <MessageSquare className="w-4 h-4" /> Connect & Info
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl py-6 px-8 flex flex-col gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <button 
            onClick={() => {
              setIsModalOpen(true);
              closeMobileMenu();
            }}
            className="mt-4 flex items-center justify-center gap-2 py-3.5 text-base font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <MessageSquare className="w-5 h-5" /> Connect & Info
          </button>
        </div>
      )}

         </nav>

         {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          
          {/* Modal Box */}
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">QuestAI</h3>

            <div className="flex flex-col gap-3">
              
              {/* Option 1: Report a Bug */}
              <a 
                href="mailto:ronitsavaliya3303@gmail.com?subject=QuestAI%20Bug%20Report"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition-transform">
                  <Bug className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Report a Bug</div>
                  <div className="text-xs text-gray-400">Help me improve the platform</div>
                </div>
              </a>

              {/* Option 2: Buy Me a Coffee */}
              <a 
                href="/support"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg group-hover:scale-110 transition-transform">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Support the Project</div>
                  <div className="text-xs text-gray-400">Buy me a coffee for my time</div>
                </div>
              </a>

              {/* Option 3: View Source */}
              <a 
                href="https://github.com/ronitsavaliya03/QuestAI"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">View Source Code</div>
                  <div className="text-xs text-gray-400">Check out the GitHub repo</div>
                </div>
              </a>

            </div>
          </div>
        </div>
      )}
    </>
  );
}