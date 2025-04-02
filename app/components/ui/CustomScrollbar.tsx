"use client";

import React from "react";

export const CustomScrollbar = () => {
  const [scrollPercentage, setScrollPercentage] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollTimer = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      const scrollableHeight = scrollHeight - clientHeight;
      const percentage = (scrollTop / scrollableHeight) * 100;
      
      setScrollPercentage(percentage);
      setIsScrolling(true);
      
      // Reset scrolling state after a delay
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <div className="custom-scrollbar">
      <div 
        className={`custom-scrollbar-thumb ${isScrolling ? 'active' : ''}`}
        style={{ 
          height: `${scrollPercentage}%`,
          top: "0",
        }}
      />
    </div>
  );
}; 