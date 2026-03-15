'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

// Initialize the professional font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/generate' },
    { name: 'Simulation', href: '/simulation' }, 
    { name: 'About', href: '/about' },
  ];

  return (
    // Applied the jakarta.className right here to the main nav container
    <nav className={`flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 ${jakarta.className}`}>
      
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer group">
        <BookOpen className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <span className="text-xl font-extrabold tracking-tight text-white">QuestAI</span>
      </Link>
      
      {/* Navigation Links */}
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

      {/* Call to Action Button */}
      <Link 
        href="/generate"
        className="px-6 py-2 text-base font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      >
        Try Now
      </Link>
    </nav>
  );
}