import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/context/theme-context";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ScrollProgressIndicator, ScrollToTopButton, FloatingNavIndicator } from "./components/ui/ScrollIndicator";
import { CustomScrollbar } from "./components/ui/CustomScrollbar";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orion Lamme | Full-Stack TypeScript Developer",
  description: "Portfolio of Orion Lamme - Specialized in Full-Stack TypeScript Development with React and Node.js",
  keywords: ["TypeScript", "React", "Node.js", "Web Development", "Frontend", "Full-Stack Developer"],
  authors: [{ name: "Orion Lamme" }],
  openGraph: {
    title: "Orion Lamme | Full-Stack TypeScript Developer",
    description: "Portfolio of Orion Lamme - Specialized in Full-Stack TypeScript Development with React and Node.js",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col w-full overflow-x-hidden`}
      >
        <ThemeProvider>
          <ScrollProgressIndicator />
          <Navbar />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
          <ScrollToTopButton />
          <FloatingNavIndicator sections={["about", "projects", "skills", "contact"]} />
          <CustomScrollbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
