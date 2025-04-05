"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CircleBlur, FloatingShape } from '../ui/DecorativeElements';
import { useScrollAnimation, fadeIn } from '@/app/lib/hooks/useScrollAnimation';
import SkillConstellation from './SkillConstellation';

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
      { name: 'Kotlin', level: 70, color: 'rgba(120, 80, 230, 0.8)' },
    ],
    color: 'rgba(59, 130, 246, 0.7)',
  },
  {
    name: 'Frameworks',
    icon: '🛠️',
    description: 'Libraries and frameworks I build with',
    skills: [
      { name: 'React.js', level: 90, color: 'rgba(14, 165, 233, 0.8)' },
      { name: 'Next.js', level: 88, color: 'rgba(31, 41, 55, 0.8)' },
      { name: 'Node.js', level: 92, color: 'rgba(22, 163, 74, 0.8)' },
      { name: 'Express.js', level: 90, color: 'rgba(100, 116, 139, 0.8)' },
      { name: 'NestJS', level: 85, color: 'rgba(220, 38, 38, 0.8)' },
      { name: 'Tailwind CSS', level: 90, color: 'rgba(6, 182, 212, 0.8)' },
      { name: 'React Native', level: 80, color: 'rgba(59, 130, 246, 0.8)' },
      { name: 'Vite', level: 85, color: 'rgba(103, 232, 249, 0.8)' },
      { name: 'Material UI', level: 80, color: 'rgba(0, 127, 255, 0.8)' },
      { name: 'Multer', level: 75, color: 'rgba(134, 25, 143, 0.8)' },
      { name: 'pdfjs-dist', level: 70, color: 'rgba(255, 0, 0, 0.8)' },
    ],
    color: 'rgba(14, 165, 233, 0.7)',
  },
  {
    name: 'DevOps',
    icon: '🔄',
    description: 'Infrastructure and deployment technologies',
    skills: [
      { name: 'Linux', level: 85, color: 'rgba(202, 138, 4, 0.8)' },
      { name: 'Docker', level: 75, color: 'rgba(37, 99, 235, 0.8)' },
      { name: 'Git/GitHub', level: 90, color: 'rgba(55, 65, 81, 0.8)' },
      { name: 'CI/CD', level: 75, color: 'rgba(21, 128, 61, 0.8)' },
      { name: 'Kubernetes', level: 65, color: 'rgba(59, 130, 246, 0.8)' },
    ],
    color: 'rgba(202, 138, 4, 0.7)',
  },
  {
    name: 'Cloud & BaaS',
    icon: '☁️',
    description: 'Cloud platforms, backend-as-a-service, and auth',
    skills: [
      { name: 'Supabase', level: 88, color: 'rgba(56, 189, 142, 0.8)' },
      { name: 'Clerk Auth', level: 85, color: 'rgba(100, 70, 220, 0.8)' },
      { name: 'AWS', level: 80, color: 'rgba(255, 153, 0, 0.8)' },
      { name: 'Google Cloud', level: 75, color: 'rgba(66, 133, 244, 0.8)' },
      { name: 'Azure', level: 70, color: 'rgba(0, 120, 212, 0.8)' },
    ],
    color: 'rgba(56, 189, 142, 0.7)',
  },
  {
    name: 'Databases',
    icon: '💾',
    description: 'Database systems and data storage technologies',
    skills: [
      { name: 'PostgreSQL', level: 85, color: 'rgba(51, 103, 145, 0.8)' },
      { name: 'MongoDB', level: 80, color: 'rgba(88, 150, 54, 0.8)' },
      { name: 'Redis', level: 75, color: 'rgba(220, 50, 50, 0.8)' },
      { name: 'TypeORM', level: 82, color: 'rgba(230, 110, 40, 0.8)' },
      { name: 'Prisma', level: 78, color: 'rgba(45, 60, 75, 0.8)' },
      { name: 'GraphQL', level: 70, color: 'rgba(229, 53, 171, 0.8)' },
    ],
    color: 'rgba(51, 103, 145, 0.7)',
  },
  {
    name: 'API & Integration',
    icon: '🔗',
    description: 'API design, integration, and related technologies',
    skills: [
      { name: 'RESTful Services', level: 90, color: 'rgba(14, 165, 233, 0.8)' },
      { name: 'API Gateway', level: 80, color: 'rgba(249, 115, 22, 0.8)' },
      { name: 'Microservices', level: 85, color: 'rgba(22, 163, 74, 0.8)' },
      { name: 'OAuth 2.0', level: 88, color: 'rgba(55, 65, 81, 0.8)' },
      { name: 'JWT Auth', level: 85, color: 'rgba(220, 38, 38, 0.8)' },
      { name: 'WebSockets', level: 75, color: 'rgba(59, 130, 246, 0.8)' },
      { name: 'MQTT', level: 70, color: 'rgba(100, 180, 100, 0.8)' },
      { name: 'Swagger/OpenAPI', level: 80, color: 'rgba(130, 200, 0, 0.8)' },
    ],
    color: 'rgba(220, 38, 38, 0.7)',
  },
  {
    name: 'AI & ML',
    icon: '🤖',
    description: 'Artificial intelligence and machine learning tools',
    skills: [
      { name: 'Google AI (Gemini)', level: 85, color: 'rgba(70, 100, 220, 0.8)' },
      { name: 'TensorFlow', level: 70, color: 'rgba(255, 140, 0, 0.8)' },
    ],
    color: 'rgba(70, 100, 220, 0.7)',
  }
];

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const { ref, controls } = useScrollAnimation(0.1);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-20 lg:py-32 relative w-full overflow-hidden min-h-screen flex flex-col justify-center"
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
        className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl flex flex-col items-center"
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
            TypeScript and API integration systems. Hover over the nodes to explore.
          </p>
        </div>

        <div className="w-full max-w-5xl aspect-video relative">
          <SkillConstellation categories={skillCategories} />
        </div>
      </motion.div>
    </section>
  );
} 