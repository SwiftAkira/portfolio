"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Mail, ArrowRight, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

// Client-side only component to avoid hydration errors with randomness
const ParticleBackground = dynamic(() => Promise.resolve(() => {
  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 40 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10 dark:bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20,
          }}
        />
      ))}
    </div>
  );
}), { ssr: false });

interface AnimatedWordProps {
  text: string;
  delay?: number;
  className?: string;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({ text, delay = 0, className = "" }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * 0.1 },
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };
  
  return (
    <motion.h2 
      className={`flex overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} className={letter === " " ? "mr-2" : ""}>
          {letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

interface GlowingButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  icon?: React.ReactNode;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  children, 
  href, 
  className = "", 
  icon,
  ...props 
}) => {
  return (
    <Link href={href}>
      <motion.div
        className={`relative group ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
        <button
          className="relative flex items-center justify-center gap-2 px-8 py-4 font-medium bg-background text-white dark:text-white rounded-lg leading-none"
          {...props}
        >
          {children}
          {icon && icon}
        </button>
      </motion.div>
    </Link>
  );
};

// Define kawaii ASCII art and cute responses for the terminal
const kawaiiFaces = [
  '(づ｡◕‿‿◕｡)づ',
  '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  '(◕‿◕✿)',
  '(。･ω･｡)',
  'ʕ•ᴥ•ʔ',
  '(◠‿◠)',
  '(✿◠‿◠)',
  '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
  'ヽ(・∀・)ﾉ',
  '(´｡• ᵕ •｡`)',
  '(≧◡≦)',
  '(◕‿◕)'
];

const kawaiiAsciiArt = {
  cat: `
  /\\_/\\  
 ( o.o ) 
  > ^ <
  `,
  bunny: `
   /\\ /\\
  ( . . )
  c(\")(\")
  `,
  bear: `
  ʕ •ᴥ• ʔ
   /    \\
  |      |
   \\____/
  `,
  dog: `
   / \\__
  (    @\\___
  /         O
 /   (_____/
/_____/   U
  `,
  heart: `
   .:::.   .:::.
  :::::::.:::::::
  :::::::::::::::
  ':::::::::::::'
    ':::::::::'
      '::::'
        ''
  `
};

// Replace the current TerminalCard with an interactive version with kawaii features
const TerminalCard: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [active, setActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<Array<{type: string, content: string}>>([
    {type: 'system', content: 'Orion\'s Portfolio Terminal v1.0.0'},
    {type: 'system', content: 'Type "help" for available commands.'},
  ]);
  const [showCursor, setShowCursor] = useState(true);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [easterEggType, setEasterEggType] = useState("");
  
  // Get a random kawaii face
  const getRandomKawaiiFace = useCallback(() => {
    return kawaiiFaces[Math.floor(Math.random() * kawaiiFaces.length)];
  }, []);
  
  // Helper function to add rainbow-colored text
  const rainbowText = useCallback((text: string) => {
    const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-blue-400', 'text-indigo-400', 'text-purple-400'];
    return (
      <span className="inline-flex">
        {text.split('').map((char, index) => (
          <span key={index} className={colors[index % colors.length]}>
            {char}
          </span>
        ))}
      </span>
    );
  }, []);
  
  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);
  
  // Add a state for kawaii mode
  const [kawaiiMode, setKawaiiMode] = useState(false);
  
  // Update the terminal command interpreter
  const executeCommand = useCallback((cmd: string) => {
    // Trim whitespace
    const command = cmd.trim().toLowerCase();
    
    // Stop if empty command (except for history tracking)
    if (command === '') {
      setTerminalOutput(prev => [...prev, {type: 'command', content: '$'}]);
      return;
    }
    
    // Add to history
    setCommandHistory(prev => {
      // Don't add duplicate of the last command
      if (prev.length && prev[prev.length - 1] === command) {
        return prev;
      }
      return [...prev, command];
    });
    setHistoryIndex(-1);
    
    // Process command
    if (command === 'help') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Here are my commands:`},
          {type: 'output', content: '  help     - Show this help message'},
          {type: 'output', content: '  clear    - Clear the terminal'},
          {type: 'output', content: '  skills   - List my technical skills'},
          {type: 'output', content: '  about    - About me'},
          {type: 'output', content: '  contact  - How to reach me'},
          {type: 'output', content: '  projects - View my projects'},
          {type: 'kawaii', content: '✨ Kawaii commands! ✨'},
          {type: 'output', content: '  kawaii   - Show a cute face'},
          {type: 'output', content: '  cat      - Show a cat ASCII art'},
          {type: 'output', content: '  bunny    - Show a bunny ASCII art'},
          {type: 'output', content: '  bear     - Show a bear ASCII art'},
          {type: 'output', content: '  dog      - Show a dog ASCII art'},
          {type: 'output', content: '  heart    - Show a heart ASCII art'},
          {type: 'output', content: '  rainbow  - Do something colorful'},
          {type: 'output', content: '  meow     - Make a cat sound'},
          {type: 'output', content: '  colors   - Show pretty colors'},
          {type: 'output', content: '  serious  - Return to professional mode'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'Available commands:'},
          {type: 'output', content: '  help     - Show this help message'},
          {type: 'output', content: '  clear    - Clear the terminal'},
          {type: 'output', content: '  skills   - List my technical skills'},
          {type: 'output', content: '  about    - About me'},
          {type: 'output', content: '  contact  - How to reach me'},
          {type: 'output', content: '  projects - View my projects'},
          {type: 'output', content: '  kawaii   - Enable kawaii mode 🙂'},
        ]);
      }
    } else if (command === 'clear') {
      if (kawaiiMode) {
        setTerminalOutput([
          {type: 'system', content: 'Terminal cleared'},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} All clean now!`},
        ]);
      } else {
        setTerminalOutput([
          {type: 'system', content: 'Terminal cleared'},
        ]);
      }
    } else if (command === 'skills') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Here are my skills!`},
          {type: 'output', content: 'Technical Skills:'},
          {type: 'output', content: '  • TypeScript / JavaScript'},
          {type: 'output', content: '  • React, Next.js'},
          {type: 'output', content: '  • Node.js, Express'},
          {type: 'output', content: '  • Database: PostgreSQL, MongoDB'},
          {type: 'output', content: '  • UI/UX & Responsive Design'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'Technical Skills:'},
          {type: 'output', content: '  • TypeScript / JavaScript'},
          {type: 'output', content: '  • React, Next.js'},
          {type: 'output', content: '  • Node.js, Express'},
          {type: 'output', content: '  • Database: PostgreSQL, MongoDB'},
          {type: 'output', content: '  • UI/UX & Responsive Design'},
        ]);
      }
    } else if (command === 'about') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Nice to meet you!`},
          {type: 'output', content: 'Full-Stack TypeScript Developer creating modern web'},
          {type: 'output', content: 'applications with React and Node.js. Transforming'},
          {type: 'output', content: 'complex challenges into elegant digital solutions.'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'About Me:'},
          {type: 'output', content: 'Full-Stack TypeScript Developer creating modern web applications with React and Node.js.'},
          {type: 'output', content: 'Transforming complex challenges into elegant digital solutions.'},
        ]);
      }
    } else if (command === 'contact') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Let's get in touch!`},
          {type: 'output', content: 'Email: orionlamme01@gmail.com'},
          {type: 'output', content: 'GitHub: https://github.com/SwiftAkira'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'Contact Information:'},
          {type: 'output', content: 'Email: orionlamme01@gmail.com'},
          {type: 'output', content: 'GitHub: https://github.com/SwiftAkira'},
        ]);
      }
    } else if (command === 'projects') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Check out my work!`},
          {type: 'output', content: 'Navigate to the Projects section to see my work.'},
          {type: 'output', content: 'Or run "open projects" to go there directly.'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'Projects:'},
          {type: 'output', content: 'Navigate to the Projects section to see my work.'},
          {type: 'output', content: 'Or run "open projects" to go there directly.'},
        ]);
      }
    } else if (command === 'open projects') {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Taking you there now!`},
          {type: 'system', content: 'Navigating to Projects section...'},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'system', content: 'Navigating to Projects section...'},
        ]);
      }
      // Use setTimeout to make it feel like it's "processing"
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } else if (command === 'kawaii') {
      setKawaiiMode(true);
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'kawaii', content: `${getRandomKawaiiFace()} Kawaii mode activated!`},
        {type: 'kawaii', content: 'Type "help" to see all the kawaii commands!'},
      ]);
    } else if (command === 'serious') {
      setKawaiiMode(false);
      setIsEasterEgg(false);
      setEasterEggType("");
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'system', content: 'Returning to professional mode.'},
      ]);
    } else if (kawaiiMode && ['cat', 'bunny', 'bear', 'dog', 'heart'].includes(command)) {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'ascii', content: kawaiiAsciiArt[command as keyof typeof kawaiiAsciiArt]},
        {type: 'kawaii', content: `${getRandomKawaiiFace()} How cute!`},
      ]);
    } else if (kawaiiMode && command === 'rainbow') {
      setIsEasterEgg(true);
      setEasterEggType('rainbow');
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'kawaii', content: '🌈 RAINBOW MODE ACTIVATED! 🌈'},
      ]);
      
      // Turn off rainbow mode after a while
      setTimeout(() => {
        setIsEasterEgg(false);
        setEasterEggType("");
      }, 5000);
    } else if (kawaiiMode && command === 'meow') {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'kawaii', content: '🐱 Meow! Meow! Purrrrrr~'},
        {type: 'ascii', content: kawaiiAsciiArt.cat},
      ]);
      
      // Play a cat sound if Web Audio API is available
      try {
        const audio = new Audio('/meow.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Silently fail if audio can't play (browsers may block autoplay)
        });
      } catch (e) {
        // Ignore errors if audio isn't supported
      }
    } else if (kawaiiMode && command === 'colors') {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'command', content: `$ ${command}`},
        {type: 'rainbow', content: '🌈 Pretty colors! 🌈'},
      ]);
    } else {
      if (kawaiiMode) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'error', content: `Command not found: ${command}. Type "help" for available commands.`},
          {type: 'kawaii', content: `${getRandomKawaiiFace()} Oopsie!`},
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'command', content: `$ ${command}`},
          {type: 'error', content: `Command not found: ${command}. Type "help" for available commands.`},
        ]);
      }
    }
    
    // Clear input
    setCurrentInput("");
  }, [getRandomKawaiiFace, kawaiiMode, setIsEasterEgg, setEasterEggType, rainbowText]);
  
  // Handle key presses including command history
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  }, [currentInput, executeCommand, commandHistory, historyIndex]);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Focus input when clicking on terminal
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Throttled mouse move handler - reduces frequency of updates
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate percentage from center (from -50 to 50)
    const percentX = (mouseX - centerX) / (rect.width / 2);
    const percentY = (mouseY - centerY) / (rect.height / 2);
    
    // Update state for 3D rotation (limit to 10 degrees)
    setRotateY(percentX * 10);
    setRotateX(-percentY * 10);
    
    // Track cursor position for particles
    setCursorPosition({
      x: ((mouseX - rect.left) / rect.width) * 100,
      y: ((mouseY - rect.top) / rect.height) * 100
    });
  }, []);
  
  // Throttled version of the mouse move handler
  const throttledMouseMove = useMemo(() => {
    let lastCall = 0;
    return (e: React.MouseEvent<HTMLDivElement>) => {
      const now = Date.now();
      if (now - lastCall >= 16) { // ~60fps max
        lastCall = now;
        handleMouseMove(e);
      }
    };
  }, [handleMouseMove]);
  
  const handleMouseEnter = useCallback(() => {
    setActive(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setActive(false);
    setRotateX(0);
    setRotateY(0);
  }, []);
  
  // Custom cursor
  const CustomCursor = useMemo(() => active ? (
    <motion.div 
      className="absolute w-6 h-6 pointer-events-none z-50"
      style={{ 
        left: `calc(${cursorPosition.x}% - 12px)`, 
        top: `calc(${cursorPosition.y}% - 12px)`,
      }}
      animate={{
        scale: [1, 0.9, 1],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
      }}
    >
      {/* Kawaii cursor */}
      <div className="w-full h-full rounded-full border-2 border-white/50 flex items-center justify-center text-xs">
        {easterEggType === 'rainbow' ? '🌈' : '✨'}
      </div>
    </motion.div>
  ) : null, [active, cursorPosition.x, cursorPosition.y, easterEggType]);
  
  // Apply rainbow background for easter egg
  const terminalClasses = useMemo(() => {
    return `relative w-full h-full ${isEasterEgg && easterEggType === 'rainbow' ? 'bg-gradient-to-r from-red-500/90 via-purple-500/90 to-blue-500/90 animate-gradient-x' : 'bg-black/90'} backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 shadow-2xl`;
  }, [isEasterEgg, easterEggType]);
  
  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className} ${active ? 'cursor-none' : ''}`}
      onMouseMove={throttledMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: active ? 'transform 0.1s ease' : 'transform 0.5s ease',
      }}
    >
      {/* Glow effect - simplified */}
      {active && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-70 transition-opacity"></div>
      )}
      
      {/* Terminal window */}
      <div 
        className={terminalClasses}
        onClick={focusInput}
      >
        {/* Terminal header */}
        <div className={`h-9 ${isEasterEgg && easterEggType === 'rainbow' ? 'bg-gradient-to-r from-pink-500/90 to-yellow-500/90' : 'bg-gray-900/90'} border-b border-white/10 flex items-center px-4 relative`}>
          {/* Mac-style window buttons */}
          <div className="flex gap-1.5 absolute top-3 left-3">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
              {isEasterEgg && <span className="text-[8px]">✖</span>}
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center">
              {isEasterEgg && <span className="text-[8px]">−</span>}
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
              {isEasterEgg && <span className="text-[8px]">＋</span>}
            </div>
          </div>
          
          <div className="absolute inset-x-0 flex justify-center">
            <div className={`px-3 py-0.5 text-xs ${isEasterEgg ? 'text-white' : 'text-white/60'} font-mono rounded-md ${isEasterEgg && easterEggType === 'rainbow' ? 'bg-purple-600/50' : 'bg-gray-800/50'}`}>
              {isEasterEgg || kawaiiMode ? `${kawaiiMode ? getRandomKawaiiFace() : ''} kawaii@portfolio ~ /terminal` : 'orion@portfolio ~ /terminal'}
            </div>
          </div>
        </div>
        
        {/* Terminal content - scrollable */}
        <div 
          ref={terminalRef}
          className="p-5 h-[calc(100%-2.25rem)] text-white/85 font-mono overflow-y-auto terminal-content"
        >
          <div className="text-xs sm:text-sm space-y-1">
            {terminalOutput.map((line, index) => {
              if (line.type === 'rainbow') {
                return (
                  <div key={index} className="font-bold">
                    {rainbowText(line.content)}
                  </div>
                );
              }
              
              return (
                <div key={index} className={`
                  ${line.type === 'command' ? 'text-green-400' : ''}
                  ${line.type === 'error' ? 'text-red-400' : ''}
                  ${line.type === 'system' ? 'text-blue-400' : ''}
                  ${line.type === 'output' ? 'text-white/85' : ''}
                  ${line.type === 'kawaii' ? 'text-pink-400 font-bold' : ''}
                  ${line.type === 'ascii' ? 'text-yellow-300 whitespace-pre' : ''}
                `}>
                  {line.content}
                </div>
              );
            })}
            
            {/* Interactive command input */}
            <div className="flex items-center mt-1">
              <span className={`mr-2 ${isEasterEgg && easterEggType === 'rainbow' ? 'text-yellow-300' : 'text-green-400'}`}>
                {(isEasterEgg || kawaiiMode) ? '(^・ω・^)$' : '$'}
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  className={`w-full bg-transparent outline-none caret-transparent ${isEasterEgg ? 'text-yellow-200' : 'text-white/85'}`}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                {/* Show cursor at end of input */}
                {currentInput.length === 0 && (
                  <span 
                    className={`absolute left-0 w-2 h-4 ${isEasterEgg ? 'bg-yellow-300' : 'bg-gray-300'} inline-block ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                  ></span>
                )}
                {currentInput.length > 0 && (
                  <span 
                    className={`absolute w-2 h-4 ${isEasterEgg ? 'bg-yellow-300' : 'bg-gray-300'} inline-block ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                    style={{ left: `${currentInput.length}ch` }}
                  ></span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom cursor - only when moving around */}
        {CustomCursor}
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 700 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Scroll progress for animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values based on scroll progress
  const headingY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5], [0, -10]);
  
  // Content parallax based on mouse position
  const headingX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-10, 10]);
  const headingY2 = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-10, 10]);
  const subtitleX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-5, 5]);
  const subtitleY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-5, 5]);
  const imageX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-20, 20]);
  const imageY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-20, 20]);
  
  // Update mouse position for parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  }, [mouseX, mouseY]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
      
      const handleMove = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent<HTMLElement>);
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }
  }, [handleMouseMove, mouseX, mouseY]);
  
  // Typing animation text segments
  const phrases = [
    "Building digital experiences.",
    "Crafting elegant solutions.",
    "Bringing ideas to life.",
  ];
  
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [phrases.length]);
  
  return (
    <section 
      ref={containerRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div 
            className="flex flex-col gap-6 order-2 lg:order-1"
            style={{ 
              y: headingY,
              x: headingX, 
            }}
          >
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="overflow-hidden" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p 
                  className="text-primary font-mono tracking-widest text-sm mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  HELLO, I&apos;M
                </motion.p>
                
                <motion.h1 
                  className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight"
                  style={{ y: headingY2 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Orion Lamme</span>
                </motion.h1>
              </motion.div>
              
              <motion.div 
                className="h-16 overflow-hidden" 
                style={{ 
                  x: subtitleX, 
                  y: subtitleY,
                  opacity: subtitleOpacity 
                }}
              >
                <AnimatePresence mode="wait">
                  <AnimatedWord 
                    key={currentPhrase}
                    text={phrases[currentPhrase]}
                    className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium"
                  />
                </AnimatePresence>
              </motion.div>
              
              <motion.p 
                className="max-w-[500px] text-muted-foreground mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Full-Stack TypeScript Developer creating modern web applications with React and Node.js.
                Transforming complex challenges into elegant digital solutions.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlowingButton 
                href="#projects" 
                icon={<ArrowRight className="h-4 w-4 ml-1" />}
                className="min-w-36"
              >
                Explore Work
              </GlowingButton>
              
              <motion.div 
                className="relative overflow-hidden flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
              <Link href="#contact">
                  <Button variant="outline" className="gap-1.5 px-8 py-6 backdrop-blur-sm bg-background/50">
                    Get In Touch
                </Button>
              </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="https://github.com/SwiftAkira" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
                </motion.div>
              </Link>
              <Link href="mailto:orionlamme01@gmail.com">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* 3D Floating Profile Card */}
          <motion.div 
            className="order-1 lg:order-2 flex items-center justify-center relative"
            style={{ 
              scale: imageScale, 
              rotate: imageRotate,
              x: imageX,
              y: imageY,
            }}
          >
            <TerminalCard className="w-full max-w-md aspect-square" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-primary/70" />
      </motion.div>
    </section>
  );
} 