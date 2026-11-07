"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { LiquidGlassProvider } from "@/components/ui/liquid-glass";
import { LiquidGlassInspectorModal } from "@/components/ui/liquid-glass-inspector";

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
    <LiquidGlassProvider>
      <div className="relative flex min-h-screen bg-slate-100/70 dark:bg-[#070B14] overflow-x-hidden">
        {/* Apple WWDC Liquid Glass Ambient Optical Refraction Mesh */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top-left vibrant cyan-blue light orb */}
          <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-500/25 via-sky-400/20 to-transparent blur-[110px] dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-transparent" />
          {/* Middle-right purple-indigo light orb */}
          <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-500/20 via-purple-500/15 to-transparent blur-[130px] dark:from-indigo-600/20 dark:via-purple-800/15 dark:to-transparent" />
          {/* Bottom-left teal light orb */}
          <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-transparent blur-[140px] dark:from-cyan-700/15 dark:via-blue-800/10 dark:to-transparent" />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0 relative z-20">
          <Sidebar user={user} />
        </div>

        {/* Mobile Drawer */}
        <div className="relative z-40">
          <MobileNav
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            user={user}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} user={user} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </main>
        </div>

        {/* Floating Liquid Glass Physics Inspector */}
        <LiquidGlassInspectorModal />
      </div>
    </LiquidGlassProvider>
  );
}

