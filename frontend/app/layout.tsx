import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuestAI - MCQ Generator",
  description: "AI-Powered MCQ Generation from PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning> 
      <body 
        // And add suppressHydrationWarning here
        suppressHydrationWarning 
        className={`${inter.className} bg-[#050505] text-white font-sans selection:bg-purple-500/30 min-h-screen flex flex-col`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}