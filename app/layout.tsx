import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NL → SQL Explorer",
  description: "Ask questions, run SQL, see answers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-slate-100 min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-line/80 bg-slate-950/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-400">
            <div>DataPilot AI</div>
            <div>Natural language spreadsheet analysis and SQL exploration.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
