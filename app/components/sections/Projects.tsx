"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Code, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CircleBlur, FloatingShape } from '../ui/DecorativeElements';
import { useScrollAnimation, fadeIn } from '@/app/lib/hooks/useScrollAnimation';

// Enhanced project data with more details
const projects = [
  {
    id: 1,
    title: 'WhiskerCode',
    description: 'Instantly understand unfamiliar code with this cat-themed VS Code extension. Explains code blocks, traces variables, and generates docs - all with adorable whisker visualizations.',
    longDescription: 'WhiskerCode transforms complex code understanding into a delightful experience. The extension analyzes code structure, variable scope, and execution flow to provide contextual explanations. Features include: semantic code analysis, natural language explanations of functions and algorithms, visual tracing of variable changes, and automatic documentation generation - all presented with charming cat-themed visualizations.',
    tags: ['JavaScript', 'VS Code Extension', 'AST Parsing', 'Static Analysis', 'Developer Tools'],
    image: '/placeholder-project.jpg',
    color: 'from-yellow-500/20 to-amber-500/20',
    icon: <Code className="h-10 w-10" />,
    githubUrl: 'https://github.com/SwiftAkira/WhiskerCode',
    liveUrl: '#'
  },
  {
    id: 2,
    title: 'Jikanshin',
    description: 'Python-based app for real-time speech translation, displaying subtitles at the bottom of the screen. Currently in development, it uses your microphone for input.',
    longDescription: 'Jikanshin is designed to capture real-time speech and instantly translate it, displaying translated subtitles as an overlay on your screen. The application uses advanced speech recognition algorithms to process audio input from your microphone, then leverages machine translation models to provide accurate translations across multiple languages. The overlay system is designed to be unobtrusive, making it perfect for watching foreign videos, participating in international meetings, or learning new languages.',
    tags: ['Python', 'Speech Recognition', 'Machine Translation', 'Audio Processing', 'Desktop App'],
    image: '/placeholder-project.jpg',
    color: 'from-blue-500/20 to-cyan-500/20',
    icon: <Layers className="h-10 w-10" />,
    githubUrl: 'https://github.com/SwiftAkira/Jikanshin',
    liveUrl: '#'
  },
  {
    id: 3,
    title: 'SmartScribe',
    description: 'Coming soon... (Closed Source Project)',
    longDescription: 'Coming soon... This is a closed source project under development.',
    tags: ['Coming Soon', 'Closed Source'],
    image: '/placeholder-project.jpg',
    color: 'from-purple-500/20 to-pink-500/20',
    icon: <Code className="h-10 w-10" />,
    githubUrl: '#',
    liveUrl: 'https://swiftakira.github.io/SmartScribeFrontendUI-UX/'
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const { ref, controls } = useScrollAnimation(0.1);
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  // Function to navigate between projects
  const navigateProject = (direction: number) => {
    setExpandedCard(null);
    let newIndex = activeProject + direction;
    if (newIndex < 0) newIndex = projects.length - 1;
    if (newIndex >= projects.length) newIndex = 0;
    setActiveProject(newIndex);
  };
  
  const project = projects[activeProject];
  
  // 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section id="projects" ref={containerRef} className="py-20 lg:py-32 relative w-full overflow-hidden">
      <CircleBlur className="absolute right-[10%] top-[10%]" size="350px" duration={15} />
      <CircleBlur className="absolute left-[5%] bottom-[20%]" size="250px" delay={4} duration={20} />
      <FloatingShape className="absolute right-[20%] bottom-[30%] w-14 h-14 border-2 border-primary/20 rounded-md" delay={2} />
      
      <motion.div
        ref={ref}
        variants={fadeIn}
        initial="hidden"
        animate={controls}
        style={{ opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <span className="text-primary font-mono tracking-widest text-sm">PORTFOLIO</span>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <motion.div 
            className="w-20 h-1 bg-primary rounded mt-2"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed mt-6">
            Explore my portfolio of cutting-edge projects showcasing expertise in API integration, 
            full-stack development, and innovative solutions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-stretch mt-10">
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ y: y1 }}
                className="flex flex-col h-full"
              >
                <Card 
                  className={`h-full overflow-hidden border-0 shadow-xl transition-all duration-300 bg-gradient-to-br ${project.color}`}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-64 overflow-hidden relative bg-black/40 backdrop-blur-sm">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="p-6 rounded-full bg-black/30 text-white"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 5,
                          ease: "easeInOut" 
                        }}
                      >
                        {project.icon}
                      </motion.div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl md:text-3xl">{project.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => navigateProject(-1)}>
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => navigateProject(1)}>
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-base mt-2">
                      {expandedCard === activeProject 
                        ? project.longDescription 
                        : project.description}
                    </CardDescription>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-primary"
                      onClick={() => setExpandedCard(expandedCard === activeProject ? null : activeProject)}
                    >
                      {expandedCard === activeProject ? "Show less" : "Read more"}
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span 
                          key={tagIndex} 
                          className="px-3 py-1.5 bg-background/60 backdrop-blur-sm text-foreground text-xs font-medium rounded-full"
                          whileHover={{ scale: 1.05, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {project.githubUrl !== '#' && (
                      <Button variant="outline" asChild>
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Source Code
                        </Link>
                      </Button>
                    )}
                    <Button asChild className={project.githubUrl === '#' ? 'w-full' : ''}>
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="text-xl font-bold mb-4">Project Selection</h3>
              <div className="space-y-3">
                {projects.map((p, index) => (
                  <motion.div
                    key={p.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${activeProject === index ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-primary/10'}`}
                    onClick={() => setActiveProject(index)}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{p.title}</h4>
                      {activeProject === index && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                    <p className="text-sm mt-1 truncate">
                      {p.description.substring(0, 60)}...
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-primary/10">
                <Link href="https://github.com/SwiftAkira" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" variant="outline">
                    <Github className="mr-2 h-4 w-4" />
                    View All Projects on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 