'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

// Initialize the professional font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/generate' },
    { name: 'Simulation', href: '/simulation' }, 
    { name: 'About', href: '/about' },
  ];

  // Function to close the mobile menu when a link is clicked
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
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
          <Link 
            href="/generate"
            className="hidden md:block px-6 py-2 text-base font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Try Now
          </Link>
          
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
          
          <Link 
            href="/generate"
            onClick={closeMobileMenu}
            className="mt-4 text-center py-3 text-base font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Try Now
          </Link>
        </div>
      )}
    </nav>
  );
}