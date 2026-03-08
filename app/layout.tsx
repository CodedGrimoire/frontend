import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NL → SQL Explorer",
  description: "Ask questions, run SQL, see answers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
