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
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#090D16]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar user={user} />
        </div>

        {/* Mobile Drawer */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          user={user}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
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

