"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { CircleBlur, FloatingShape } from '../ui/DecorativeElements';
import { useScrollAnimation, fadeIn, fadeInStagger } from '@/app/lib/hooks/useScrollAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

// Skills data with additional details and icons
const skillCategories = [
  {
    name: 'Languages',
    icon: '👨‍💻',
    description: 'Programming languages I work with regularly',
    skills: [
      { name: 'TypeScript', level: 95, color: 'rgba(59, 130, 246, 0.8)' },
      { name: 'JavaScript', level: 95, color: 'rgba(234, 179, 8, 0.8)' },
      { name: 'Python', level: 85, color: 'rgba(34, 197, 94, 0.8)' },
      { name: 'HTML5/CSS3', level: 90, color: 'rgba(249, 115, 22, 0.8)' },
      { name: 'SQL', level: 80, color: 'rgba(168, 85, 247, 0.8)' },
      { name: 'Swift', level: 75, color: 'rgba(239, 68, 68, 0.8)' },
    ],
  },
  {
    name: 'Frameworks',
    icon: '🛠️',
    description: 'Libraries and frameworks I build with',
    skills: [
      { name: 'React.js', level: 90, color: 'rgba(14, 165, 233, 0.8)' },
      { name: 'Next.js', level: 88, color: 'rgba(31, 41, 55, 0.8)' },
      { name: 'Node.js', level: 92, color: 'rgba(22, 163, 74, 0.8)' },
      { name: 'NestJS', level: 85, color: 'rgba(220, 38, 38, 0.8)' },
      { name: 'Tailwind CSS', level: 90, color: 'rgba(6, 182, 212, 0.8)' },
      { name: 'React Native', level: 80, color: 'rgba(59, 130, 246, 0.8)' },
    ],
  },
  {
    name: 'DevOps',
    icon: '🔄',
    description: 'Infrastructure and deployment technologies',
    skills: [
      { name: 'Linux', level: 85, color: 'rgba(202, 138, 4, 0.8)' },
      { name: 'AWS', level: 80, color: 'rgba(249, 115, 22, 0.8)' },
      { name: 'Docker', level: 75, color: 'rgba(37, 99, 235, 0.8)' },
      { name: 'Git/GitHub', level: 90, color: 'rgba(55, 65, 81, 0.8)' },
      { name: 'CI/CD', level: 75, color: 'rgba(21, 128, 61, 0.8)' },
      { name: 'Kubernetes', level: 65, color: 'rgba(59, 130, 246, 0.8)' },
    ],
  },
  {
    name: 'Databases',
    icon: '💾',
    description: 'Database systems and data storage technologies',
    skills: [
      { name: 'PostgreSQL', level: 85, color: 'rgba(37, 99, 235, 0.8)' },
      { name: 'MongoDB', level: 80, color: 'rgba(34, 197, 94, 0.8)' },
      { name: 'Redis', level: 75, color: 'rgba(239, 68, 68, 0.8)' },
      { name: 'TypeORM', level: 82, color: 'rgba(96, 165, 250, 0.8)' },
      { name: 'Prisma', level: 78, color: 'rgba(147, 51, 234, 0.8)' },
      { name: 'GraphQL', level: 70, color: 'rgba(236, 72, 153, 0.8)' },
    ],
  },
];

const additionalSkills = [
  'API Gateway', 'OAuth 2.0', 'RESTful Services', 'JWT Authentication', 
  'Microservices', 'MQTT', 'WebSockets', 'Swagger/OpenAPI', 
  'Material UI', 'Google Cloud', 'Azure', 'TensorFlow',
  'Data Visualization', 'System Design', 'Performance Optimization'
];

// Client-only DNA Helix component to avoid hydration mismatches
const DNAHelix = dynamic(() => import('./DNAHelix'), { ssr: false });

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const { ref, controls } = useScrollAnimation(0.1);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const yTransform = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  const handleTabChange = (index: number) => {
    setActiveCategory(index);
    setActiveSkill(null);
  };
  
  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-20 lg:py-32 relative w-full overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <motion.div
          className="absolute h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]"
          style={{ scale }}
        />
      </div>
      
      <CircleBlur className="absolute left-[5%] top-[20%]" size="300px" duration={20} />
      <CircleBlur className="absolute right-[10%] bottom-[10%]" size="350px" delay={3} duration={25} />
      <FloatingShape className="absolute right-[5%] top-[30%] w-12 h-12 border-2 border-primary/20 rounded-full" delay={2} />
      
      <motion.div
        ref={ref}
        variants={fadeIn}
        initial="hidden"
        animate={controls}
        style={{ opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <span className="text-primary font-mono tracking-widest text-sm">EXPERTISE</span>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Technical <span className="text-primary">Proficiencies</span>
          </h2>
          <motion.div 
            className="w-20 h-1 bg-primary rounded mt-2"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed mt-6">
            My toolkit spans front-end, back-end, and DevOps technologies, with specialized expertise in 
            TypeScript and API integration systems.
          </p>
        </div>

        <motion.div 
          className="relative mx-auto max-w-5xl"
          style={{ y: yTransform }}
        >
          <Tabs 
            defaultValue={skillCategories[0].name} 
            className="w-full"
            onValueChange={(value: string) => {
              const index = skillCategories.findIndex(cat => cat.name === value);
              if (index !== -1) handleTabChange(index);
            }}
          >
            <div className="relative mb-12 perspective-800 w-full">
              <div className="bg-background/30 backdrop-blur-sm rounded-full shadow-lg p-1 overflow-hidden border border-primary/10 transform-gpu">
                <TabsList className="grid grid-cols-4 w-full bg-transparent">
                  {skillCategories.map((category, index) => (
                    <TabsTrigger 
                      key={category.name} 
                      value={category.name}
                      className="relative py-5 text-base bg-transparent z-10 overflow-hidden
                                 data-[state=active]:text-primary-foreground
                                 data-[state=active]:font-medium transition-all duration-300"
                    >
                      {/* Active background pill */}
                      {activeCategory === index && (
                        <motion.div 
                          className="absolute inset-0 bg-primary rounded-full shadow-lg z-0"
                          layoutId="activeTab"
                          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                        />
                      )}
                      
                      {/* Content */}
                      <span className="relative z-10 flex flex-col items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-sm whitespace-nowrap">{category.name}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            
            {skillCategories.map((category, categoryIndex) => (
              <TabsContent 
                key={category.name}
                value={category.name}
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-xl"
                  >
                    <div className="text-center mb-8">
                      <div className="bg-primary/10 py-2 px-6 rounded-full inline-block mb-3">
                        <span className="text-3xl mr-3">{category.icon}</span>
                        <h3 className="text-xl font-medium inline-block">{category.name}</h3>
                      </div>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* DNA Helix Visualization */}
                    <DNAHelix 
                      skills={category.skills} 
                      activeSkill={activeSkill} 
                      setActiveSkill={setActiveSkill} 
                    />
                    
                    {/* Skill Legend - 3D buttons with names */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      {category.skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          className="perspective-500 transform-gpu"
                          whileHover={{ scale: 1.05, z: 20 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center transform-gpu"
                            style={{ 
                              backgroundColor: index === activeSkill ? skill.color : 'rgba(var(--background), 0.8)',
                              color: index === activeSkill ? 'white' : 'var(--foreground)',
                              border: `1px solid ${skill.color}`,
                              boxShadow: index === activeSkill 
                                ? `0 10px 25px -5px ${skill.color}60, 0 8px 10px -6px ${skill.color}40` 
                                : '0 2px 5px rgba(0, 0, 0, 0.1)',
                              transform: index === activeSkill 
                                ? 'translateZ(20px) rotateX(10deg)' 
                                : 'translateZ(0) rotateX(0deg)'
                            }}
                            animate={{
                              boxShadow: index === activeSkill 
                                ? [
                                  `0 10px 25px -5px ${skill.color}60, 0 8px 10px -6px ${skill.color}40`,
                                  `0 15px 35px -5px ${skill.color}70, 0 10px 20px -6px ${skill.color}50`,
                                  `0 10px 25px -5px ${skill.color}60, 0 8px 10px -6px ${skill.color}40`
                                ] 
                                : '0 2px 5px rgba(0, 0, 0, 0.1)',
                              y: index === activeSkill ? [0, -3, 0] : 0
                            }}
                            transition={{
                              duration: 2,
                              repeat: index === activeSkill ? Infinity : 0,
                              repeatType: "reverse"
                            }}
                            onClick={() => setActiveSkill(index === activeSkill ? null : index)}
                          >
                            <span className="mr-2 w-5 h-5 flex items-center justify-center rounded-full bg-background/80 text-foreground text-xs transform-gpu">
                              {index + 1}
                            </span>
                            <span>{skill.name}</span>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
          
          <motion.div 
            variants={fadeInStagger}
            initial="hidden"
            animate={controls}
            className="mt-16 pt-10 border-t border-primary/10 text-center"
          >
            <h3 className="text-xl font-bold mb-6">Additional Technologies & Expertise</h3>
            <div className="flex flex-wrap gap-3 justify-center mx-auto">
              {additionalSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="px-4 py-2 bg-background/70 backdrop-blur-sm text-foreground rounded-full text-sm border border-primary/10 shadow-sm"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "var(--primary)", 
                    color: "var(--primary-foreground)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                  onClick={(e) => {
                    // Prevent event bubbling
                    e.stopPropagation();
                    
                    // For now just provide visual feedback on click
                    // You could add more functionality later if needed
                    const target = e.currentTarget;
                    target.style.backgroundColor = "var(--primary)";
                    target.style.color = "var(--primary-foreground)";
                    
                    // Reset after a short delay
                    setTimeout(() => {
                      if (target) {
                        target.style.backgroundColor = "";
                        target.style.color = "";
                      }
                    }, 300);
                  }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
} 