import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// GeistSans is for UI text, GeistMono is for code
// Next.js font system loads these with zero layout shift
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "DevSync — AI-Powered Code Review",
  description:
    "Write, review, and collaborate on code in real-time with AI assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}