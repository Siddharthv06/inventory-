"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { LiquidGlassLens } from "@/components/ui/liquid-glass-lens";
import { LiquidGlassControls } from "@/components/ui/liquid-glass-controls";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    full_name: string;
    email: string;
    role: string;
    company_name?: string | null;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-slate-100/70 dark:bg-[#070B14] overflow-x-hidden text-slate-900 dark:text-slate-100">
      {/* Apple WWDC 2025 Liquid Glass Ambient Optical Refraction Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-[12%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-500/25 via-sky-400/20 to-transparent blur-[120px] dark:from-blue-600/25 dark:via-indigo-600/20 dark:to-transparent animate-ambient-slow" />
        <div className="absolute top-[28%] -right-[12%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-500/25 via-purple-500/20 to-transparent blur-[130px] dark:from-indigo-600/25 dark:via-purple-800/20 dark:to-transparent animate-ambient-reverse" />
        <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-400/25 via-blue-500/20 to-transparent blur-[140px] dark:from-cyan-700/20 dark:via-blue-800/15 dark:to-transparent" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 relative z-20">
        <Sidebar user={user} />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Interactive Draggable Liquid Glass Magnifier Lens */}
      <LiquidGlassLens />

      {/* Floating Liquid Glass Physics Lab Dock */}
      <LiquidGlassControls />
    </div>
  );
}
