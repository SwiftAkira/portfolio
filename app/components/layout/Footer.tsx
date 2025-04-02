"use client";

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-10 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <span className="text-xl">💻</span>
              <span>Orion Lamme</span>
            </Link>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {currentYear} Orion Lamme. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="https://github.com/SwiftAkira" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://linkedin.com/in/orion-lamme" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link 
              href="mailto:orionlamme01@gmail.com"
              className="text-muted-foreground hover:text-primary"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          
          <nav className="flex gap-4 md:gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="#projects" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Projects
            </Link>
            <Link href="#skills" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Skills
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
} 