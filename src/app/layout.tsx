import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll";
import { LiquidGlassProvider } from "@/components/ui/liquid-glass";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innovexa Technologies | Product Inventory & Listing Manager",
  description: "Enterprise Product Inventory & Marketplace Listing Manager for Innovexa Technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <SmoothScrollProvider>
            <LiquidGlassProvider>
              {children}
            </LiquidGlassProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
