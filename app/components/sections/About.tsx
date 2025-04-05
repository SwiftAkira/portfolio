"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Server, Globe, BookOpen, MousePointerClick } from 'lucide-react';
import { useScrollAnimation, fadeIn, fadeInStagger } from '@/app/lib/hooks/useScrollAnimation';
import { CircleBlur } from '../ui/DecorativeElements';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values based on scroll position
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  // Use our custom scroll animation hook for different elements
  const { ref: titleRef, controls: titleControls } = useScrollAnimation(0.1);
  const { ref: cardsRef, controls: cardsControls } = useScrollAnimation(0.1);
  const { ref: textRef, controls: textControls } = useScrollAnimation(0.1);

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (index: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const cardContent = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Full-Stack Development",
      description: "Advanced knowledge of TypeScript, React, Node.js, and modern frameworks. I build enterprise-grade applications with focus on security, performance, and usability."
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Backend Development",
      description: "Experienced in building robust backend systems and RESTful services that power modern web applications with focus on performance and security."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Multilingual Communication",
      description: "Fluent in English, Dutch, and Turkish, with Basic Chinese (A1-A2), enabling effective communication across international teams and projects."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Education",
      description: "Currently pursuing IB studies with focus on Business Technology at Amsterdam International Community School."
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="py-20 lg:py-32 relative w-full overflow-hidden"
    >
      {/* Background elements with parallax effect */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <motion.div 
          className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]"
          style={{ y: y1 }}
        />
      </div>
      
      <CircleBlur className="absolute -left-[10%] top-[60%]" size="400px" duration={20} />
      <CircleBlur className="absolute right-[5%] top-[20%]" size="300px" delay={2} duration={25} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl relative">
        <motion.div
          ref={titleRef}
          variants={fadeIn}
          initial="hidden"
          animate={titleControls}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          style={{ opacity }}
        >
          <span className="text-primary font-mono tracking-widest text-sm">ABOUT ME</span>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Crafting <span className="text-primary">Solutions</span>
          </h2>
          <motion.div 
            className="w-20 h-1 bg-primary rounded mt-2"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed xl:text-xl/relaxed mt-6">
            I&apos;m a specialized TypeScript developer with expertise in building modern web applications and interactive user interfaces.
            I transform business requirements into elegant technical solutions that deliver exceptional experiences.
          </p>
        </motion.div>

        <motion.div 
          ref={cardsRef}
          variants={fadeInStagger}
          initial="hidden"
          animate={cardsControls}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full mx-auto max-w-4xl"
          style={{ y: y2 }}
        >
          {cardContent.map((card, index) => (
            <motion.div 
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full border-none shadow-lg bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300">
                <CardContent className="flex flex-col items-center p-8 text-center space-y-4 h-full">
                  <motion.div 
                    className="rounded-full p-4 bg-primary/10"
                    whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-muted-foreground flex-grow">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          ref={textRef}
          variants={fadeIn}
          initial="hidden"
          animate={textControls}
          className="relative mt-20 bg-primary/5 rounded-2xl p-8 border border-primary/10"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-background px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-primary" />
            <span className="font-medium">Professional Experience</span>
          </div>
          
          <p className="mx-auto max-w-[800px] text-muted-foreground text-center">
            With experience as a <span className="font-medium text-foreground">Full-Stack Developer</span> focused on TypeScript and React, 
            I&apos;ve been developing sophisticated web applications with emphasis on responsive design, performance optimization, 
            and seamless user experiences across various projects.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 