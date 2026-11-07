import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-100/70 dark:bg-[#070B14] flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Apple WWDC Liquid Glass Ambient Optical Refraction Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-500/25 via-sky-400/20 to-transparent blur-[110px] dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-transparent" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-500/20 via-purple-500/15 to-transparent blur-[130px] dark:from-indigo-600/20 dark:via-purple-800/15 dark:to-transparent" />
        <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-transparent blur-[140px] dark:from-cyan-700/15 dark:via-blue-800/10 dark:to-transparent" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-blue-500/20">
            IX
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
            INNOVEXA
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Auth Content */}
      <div className="relative z-10 w-full max-w-md mx-auto my-8 animate-fade-in">{children}</div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 Innovexa Technologies. Enterprise Product Listing System.
      </div>
    </div>
  );
}
