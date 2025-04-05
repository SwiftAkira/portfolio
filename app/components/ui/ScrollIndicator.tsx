"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
}

export function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > window.innerHeight * 0.2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);
  
  return (
    <motion.button
      className="fixed right-6 bottom-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-50"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Scroll to top"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 19V5M5 12L12 5L19 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

interface FloatingNavIndicatorProps {
  sections: string[];
}

export function FloatingNavIndicator({ sections }: FloatingNavIndicatorProps) {
  const [activeSection, setActiveSection] = React.useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section)
      );
      
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop - viewportHeight / 2) {
            setActiveSection(i);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
  
  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <motion.div 
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-3 p-2 rounded-full backdrop-blur-sm bg-background/30 shadow-lg border border-primary/10">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index ? 'bg-primary scale-125' : 'bg-muted hover:bg-primary/50'
            }`}
            onClick={() => scrollToSection(section)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
      </div>
    </motion.div>
  );
} 