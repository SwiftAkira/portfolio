"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            💻
          </motion.div>
          <span>Orion Lamme</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="#skills" className="text-sm font-medium hover:text-primary transition-colors">
            Skills
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </motion.header>
  );
} 