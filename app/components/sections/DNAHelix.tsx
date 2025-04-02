"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// DNA Helix Animation Component
const DNAHelix = ({ 
  skills, 
  activeSkill, 
  setActiveSkill 
}: { 
  skills: { name: string; level: number; color: string }[]; 
  activeSkill: number | null;
  setActiveSkill: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const helixRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 500 });
  const [rotation, setRotation] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastDragPosition, setLastDragPosition] = useState({ x: 0, y: 0 });
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mouse tracking for 3D interaction
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!helixRef.current) return;
    
    const rect = helixRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // If we're dragging, rotate the helix based on the drag movement
    if (isDragging) {
      const deltaX = e.clientX - lastDragPosition.x;
      const deltaY = e.clientY - lastDragPosition.y;
      
      // Update rotation based on drag movement (horizontal movement affects Y rotation)
      setRotation(prev => (prev + deltaX * 0.5) % 360);
      setRotationX(prev => {
        // Allow more vertical rotation range for a floating experience
        const newRotation = prev + deltaY * 0.5;
        // Increased range from -30/30 to -60/60 for more freedom
        return Math.max(-60, Math.min(60, newRotation));
      });
      
      // Update last drag position
      setLastDragPosition({ x: e.clientX, y: e.clientY });
      
      // Reset auto-rotate timeout
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
      
      autoRotateTimeoutRef.current = setTimeout(() => {
        setAutoRotate(true);
      }, 5000); // Resume auto-rotate after 5 seconds of inactivity
    }
    
    // Pause auto-rotation when mouse is over but not dragging
    if (autoRotate && !isDragging) setAutoRotate(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start dragging and record initial position
    setIsDragging(true);
    setLastDragPosition({ x: e.clientX, y: e.clientY });
    
    // Pause auto-rotation when dragging starts
    setAutoRotate(false);
    
    // Prevent text selection during drag
    e.preventDefault();
  };
  
  const handleMouseUp = () => {
    // Stop dragging
    setIsDragging(false);
    
    // Set a timeout to resume auto-rotation after inactivity
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }
    
    autoRotateTimeoutRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 5000); // Resume auto-rotate after 5 seconds of inactivity
  };
  
  const handleMouseLeave = () => {
    // Stop dragging
    setIsDragging(false);
    
    // Resume auto-rotation when mouse leaves
    setAutoRotate(true);
  };
  
  useEffect(() => {
    if (helixRef.current) {
      setDimensions({
        width: helixRef.current.offsetWidth,
        height: helixRef.current.offsetHeight
      });
    }

    const handleResize = () => {
      if (helixRef.current) {
        setDimensions({
          width: helixRef.current.offsetWidth,
          height: helixRef.current.offsetHeight
        });
      }
    };

    // Add global mouse up event to handle cases where mouse is released outside the component
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        
        // Set a timeout to resume auto-rotation after inactivity
        if (autoRotateTimeoutRef.current) {
          clearTimeout(autoRotateTimeoutRef.current);
        }
        
        autoRotateTimeoutRef.current = setTimeout(() => {
          setAutoRotate(true);
        }, 5000); // Resume auto-rotate after 5 seconds of inactivity
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      
      // Clear any pending timeouts
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, [isDragging]);
  
  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
      // Add subtle vertical movement to auto-rotation for more 3D effect
      setRotationX(prev => {
        const newValue = prev + Math.sin(Date.now() / 2000) * 0.1;
        return Math.max(-15, Math.min(15, newValue));
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [autoRotate]);
  
  // Calculate 3D positions for nucleotides
  const calculate3DPosition = (index: number, side: 'left' | 'right') => {
    const totalSkills = skills.length || 1; // Prevent division by zero
    const angleStep = 360 / totalSkills;
    // Ensure radius is never zero
    const radius = Math.max(dimensions.width * 0.18, 20); 
    const yStep = dimensions.height / (totalSkills + 1);
    
    // Calculate angle with rotation offset for 3D helix effect
    const angle = ((index * angleStep) + rotation) % 360;
    const radian = (angle * Math.PI) / 180;
    
    // Side offset with phase shift
    const sideOffset = side === 'left' ? 0 : Math.PI; // 180 degree phase shift
    
    // Calculate 3D coordinates
    const x = Math.sin(radian + sideOffset) * radius + dimensions.width / 2;
    const z = Math.cos(radian + sideOffset) * radius;
    const y = 80 + index * yStep;
    
    // Mouse influence on rotation
    const mouseInfluenceX = (mousePosition.x - 0.5) * 20;
    const mouseInfluenceY = (mousePosition.y - 0.5) * 20;
    
    // Ensure scale is never NaN
    const zScale = (z + radius) / (radius * 2); 
    const scale = isNaN(zScale) || zScale <= 0 ? 0.5 : zScale;
    
    // Ensure opacity is never NaN
    const zOpacity = (z + radius) / (radius * 2) * 0.8 + 0.2;
    const opacity = isNaN(zOpacity) ? 0.5 : zOpacity;
    
    return {
      x, 
      y, 
      z,
      scale,
      opacity,
      rotateX: mouseInfluenceY,
      rotateY: mouseInfluenceX,
    };
  };

  // Key issue fix: Use explicitly typed values instead of dynamic calculations in animation
  const staticParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const depthSeed = ((i * 7919) % 200) - 100;
      const depth = depthSeed;
      const scale = (depth + 100) / 200 * 0.8 + 0.2;
      const width = ((i * 3929) % 6) + 2;
      
      return {
        id: i,
        depth,
        scale,
        width: width * scale,
        xSeed: (i * 104729) % 100 / 100,
        ySeed: (i * 15649) % 100 / 100,
        duration: 10 + (i % 10)
      };
    });
  }, []);
  
  return (
    <div 
      ref={helixRef}
      className="relative w-full h-[500px] overflow-hidden cursor-grab"
      style={{ 
        perspective: '1200px', 
        cursor: isDragging ? 'grabbing' : 'grab',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* User guide overlay */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs border border-primary/10 z-[9999] opacity-80">
        <span>Drag to rotate in any direction</span>
      </div>
      
      {/* 3D Container - will apply perspective */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* Rotating DNA structure */}
        <div 
          className="absolute inset-0 transform-gpu"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotation}deg)`,
            backfaceVisibility: 'visible'
          }}
        >
          {/* Central Axis Line */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-[2px] transform -translate-x-1/2"
            style={{ 
              background: `linear-gradient(to bottom, 
                rgba(var(--primary-rgb), 0) 0%, 
                rgba(var(--primary-rgb), 0.7) 20%,
                rgba(var(--primary-rgb), 0.7) 80%,
                rgba(var(--primary-rgb), 0) 100%)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible'
            }}
          />
          
          {/* Helix Strands */}
          {useMemo(() => {
            // Client-side only rendering of strands to avoid hydration mismatch
            if (typeof window === 'undefined') return null;
            
            return [0, 1].map((strand) => (
              <div 
                key={`strand-${strand}`}
                className="absolute inset-0"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${strand * 180}deg)`,
                  backfaceVisibility: 'visible'
                }}
              >
                {Array.from({ length: 30 }).map((_, i) => {
                  const position = (i / 30) * 100;
                  const offset = strand * 180 + rotation + (i * 12);
                  const radian = (offset * Math.PI) / 180;
                  
                  // Use Math.round to ensure consistent string formatting between server/client
                  const x = Math.round(Math.sin(radian) * (dimensions.width * 0.18) * 1000) / 1000;
                  const z = Math.round(Math.cos(radian) * (dimensions.width * 0.08) * 1000) / 1000;
                  
                  return (
                    <div 
                      key={`strand-${strand}-${i}`}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: `rgba(var(--primary-rgb), ${0.2 + (i % 5) * 0.1})`,
                        left: `calc(50% + ${x}px)`,
                        top: `${Math.round(position * 100) / 100}%`,
                        transform: `translateX(-50%) translateZ(${z}px)`,
                        opacity: 0.6,
                        boxShadow: `0 0 4px rgba(var(--primary-rgb), 0.5)`,
                        backfaceVisibility: 'visible'
                      }}
                    />
                  );
                })}
              </div>
            ));
          }, [rotation, dimensions.width])}
          
          {/* Nucleotide Pairs - Skills */}
          {useMemo(() => {
            // Client-side only rendering of nucleotides to avoid hydration mismatch
            if (typeof window === 'undefined') return null;
            
            return skills.map((skill, index) => {
              const leftPos = calculate3DPosition(index, 'left');
              const rightPos = calculate3DPosition(index, 'right');
              
              return (
                <React.Fragment key={skill.name}>
                  {/* Left nucleotide */}
                  <motion.div
                    className="absolute rounded-full cursor-pointer flex items-center justify-center overflow-hidden shadow-lg transform-gpu"
                    style={{
                      backgroundColor: skill.color,
                      left: `${leftPos.x}px`,
                      top: `${leftPos.y}px`,
                      width: `${Math.max(40 * leftPos.scale, 1)}px`,
                      height: `${Math.max(40 * leftPos.scale, 1)}px`,
                      opacity: leftPos.opacity,
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(${leftPos.z}px) translateX(-50%) translateY(-50%) 
                                rotateX(${leftPos.rotateX}deg) rotateY(${leftPos.rotateY}deg)`,
                      zIndex: Math.round(leftPos.z + 1000),
                      backfaceVisibility: 'visible'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: index === activeSkill ? 1.3 * leftPos.scale : 1 * leftPos.scale,
                      boxShadow: index === activeSkill ? 
                        `0 0 30px ${skill.color}` : 
                        `0 4px 10px rgba(0, 0, 0, 0.1)`
                    }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.2 * leftPos.scale, 
                      boxShadow: `0 0 20px ${skill.color}`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSkill(index === activeSkill ? null : index);
                    }}
                  >
                    <span className="text-xs font-semibold text-white">{index + 1}</span>
                  </motion.div>
                  
                  {/* Right nucleotide */}
                  <motion.div
                    className="absolute rounded-full cursor-pointer flex items-center justify-center overflow-hidden shadow-lg transform-gpu"
                    style={{
                      backgroundColor: skill.color,
                      left: `${rightPos.x}px`,
                      top: `${rightPos.y}px`,
                      width: `${Math.max(40 * rightPos.scale, 1)}px`,
                      height: `${Math.max(40 * rightPos.scale, 1)}px`,
                      opacity: rightPos.opacity,
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(${rightPos.z}px) translateX(-50%) translateY(-50%)
                                rotateX(${rightPos.rotateX}deg) rotateY(${rightPos.rotateY}deg)`,
                      zIndex: Math.round(rightPos.z + 1000),
                      backfaceVisibility: 'visible'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: index === activeSkill ? 1.3 * rightPos.scale : 1 * rightPos.scale,
                      boxShadow: index === activeSkill ? 
                        `0 0 30px ${skill.color}` : 
                        `0 4px 10px rgba(0, 0, 0, 0.1)`
                    }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.2 * rightPos.scale, 
                      boxShadow: `0 0 20px ${skill.color}`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSkill(index === activeSkill ? null : index);
                    }}
                  >
                    <span className="text-xs font-semibold text-white">{index + 1}</span>
                  </motion.div>
                  
                  {/* Connecting line - always visible without z condition */}
                  <div 
                    className="absolute pointer-events-none" 
                    style={{
                      height: '3px',
                      top: `${(leftPos.y + rightPos.y) / 2}px`,
                      left: `${Math.min(leftPos.x, rightPos.x)}px`,
                      width: `${Math.abs(rightPos.x - leftPos.x)}px`,
                      background: `linear-gradient(to right, 
                        rgba(${skill.color.split(')')[0].split('(')[1]}, ${leftPos.opacity}) 0%,
                        rgba(var(--primary-rgb), ${(leftPos.opacity + rightPos.opacity) / 3}) 50%,
                        rgba(${skill.color.split(')')[0].split('(')[1]}, ${rightPos.opacity}) 100%)`,
                      zIndex: Math.round((leftPos.z + rightPos.z) / 2 + 990),
                      transform: `translateY(-50%) translateZ(${(leftPos.z + rightPos.z) / 2}px)`,
                      opacity: index === activeSkill ? 1 : (leftPos.opacity + rightPos.opacity) / 2,
                      boxShadow: index === activeSkill ? 
                        `0 0 8px rgba(var(--primary-rgb), 0.8)` : 
                        'none',
                      backfaceVisibility: 'visible'
                    }}
                  />
                </React.Fragment>
              );
            });
          }, [skills, activeSkill, calculate3DPosition, setActiveSkill])}
        </div>
      </div>
      
      {/* Skill Detail Popup */}
      <AnimatePresence>
        {activeSkill !== null && skills[activeSkill] && (
          <motion.div
            className="absolute z-50 bg-background/90 backdrop-blur-md px-6 py-4 rounded-lg shadow-xl border border-primary/30"
            style={{
              top: '50%',
              left: '50%',
              width: 220,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div 
                className="inline-block w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: skills[activeSkill].color,
                  boxShadow: `0 0 20px ${skills[activeSkill].color}`
                }}
              >
                <span className="text-white font-bold">{activeSkill + 1}</span>
              </div>
              <h4 className="text-lg font-semibold">{skills[activeSkill].name}</h4>
              <div className="mt-3 w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-2 rounded-full"
                  style={{ 
                    backgroundColor: skills[activeSkill].color,
                    width: `${skills[activeSkill].level}%` 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skills[activeSkill].level}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Proficiency: {skills[activeSkill].level}%
              </div>
              <motion.button
                className="mt-4 px-4 py-1.5 rounded-full text-xs bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                onClick={() => setActiveSkill(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Static RNA Particles instead of animated */}
      {staticParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{
            width: `${particle.width}px`,
            height: `${particle.width}px`,
            left: `${particle.xSeed * dimensions.width}px`,
            top: `${particle.ySeed * dimensions.height}px`,
            opacity: particle.scale,
          }}
        />
      ))}
    </div>
  );
};

export default DNAHelix; 