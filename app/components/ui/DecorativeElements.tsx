import React from 'react';
import { motion } from 'framer-motion';

interface ShapeProps {
  className?: string;
  delay?: number;
  duration?: number;
}

export const FloatingShape: React.FC<ShapeProps> = ({ 
  className, 
  delay = 0, 
  duration = 20 
}) => {
  return (
    <motion.div
      className={`absolute opacity-30 ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export const CircleBlur: React.FC<ShapeProps & { size?: string }> = ({ 
  className, 
  size = "200px",
  delay = 0, 
  duration = 20 
}) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: 'var(--primary)',
        opacity: 0.15
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.2, 0.15],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export const Grid = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export const CodeSnippet = ({ className }: { className?: string }) => {
  const codeLines = [
    'const developer = {',
    '  name: "Orion Lamme",',
    '  skills: ["TypeScript", "React", "Node.js"],',
    '  passion: "Building elegant solutions",',
    '};',
  ];

  return (
    <motion.div 
      className={`font-mono text-xs bg-black/80 text-green-500 p-4 rounded-lg shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {codeLines.map((line, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
        >
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
}; 