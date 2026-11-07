import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link href="/login" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            IX
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
            INNOVEXA
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Auth Content */}
      <div className="w-full max-w-md mx-auto my-8 animate-fade-in">{children}</div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 Innovexa Technologies. Enterprise Product Listing System.
      </div>
    </div>
  );
}
