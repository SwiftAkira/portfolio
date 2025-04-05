"use client";

import React from 'react';
// Removed unused Link import
// import Link from 'next/link';
// Removed unused Linkedin import
// import { Linkedin } from 'lucide-react'; 
import { Github, Mail } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Orion Lamme. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/SwiftAkira" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="mailto:orionlamme01@gmail.com" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email Orion"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 