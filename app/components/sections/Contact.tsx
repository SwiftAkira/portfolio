"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail, Phone, MapPin, Send, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CircleBlur, FloatingShape } from '../ui/DecorativeElements';
import { useScrollAnimation, fadeIn, scaleIn } from '@/app/lib/hooks/useScrollAnimation';

// Magnetic Button Component
const MagneticButton = ({ children, className = "", href, icon, onClick, external = false }: { 
  children: React.ReactNode, 
  className?: string, 
  href?: string,
  icon?: React.ReactNode,
  onClick?: () => void,
  external?: boolean
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) * 0.3;
    const moveY = (e.clientY - centerY) * 0.3;
    setPosition({ x: moveX, y: moveY });
  };
  
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };
  
  const Content = () => (
    <motion.div
      className={`flex items-center justify-center gap-2 ${isHovered ? 'scale-110' : 'scale-100'} transition-all duration-300`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className={`${icon ? 'ml-1' : ''}`}>{children}</span>
    </motion.div>
  );

  const ButtonContent = (
    <motion.div
      ref={buttonRef}
      className={`relative overflow-hidden rounded-md px-5 py-3 font-medium ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetPosition}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md"
        animate={{ opacity: isHovered ? 1 : 0.7 }}
      />
      <motion.div 
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-md"
        animate={{ opacity: isHovered ? 0.8 : 0, x: isHovered ? ['0%', '100%'] : '0%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <Content />
    </motion.div>
  );
  
  if (href) {
    if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <Link 
          href={href} 
          target={href.startsWith('mailto:') || href.startsWith('tel:') ? '_self' : '_blank'} 
          rel="noopener noreferrer"
        >
          {ButtonContent}
        </Link>
      );
    }
    return <Link href={href}>{ButtonContent}</Link>;
  }
  
  return (
    <div onClick={onClick} className="cursor-pointer">
      {ButtonContent}
    </div>
  );
};

// Animated Input Field
const AnimatedInput = ({ 
  label, 
  id, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  as = "input",
  rows = 4
}: { 
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputBorderControls = useAnimation();
  const progressValue = useMotionValue(0);
  const progress = useTransform(progressValue, [0, 100], [0, 1]);
  
  useEffect(() => {
    // Animate border when focused
    if (isFocused) {
      inputBorderControls.start({
        backgroundPosition: ['0% 50%', '100% 50%'],
        transition: { duration: 2, repeat: Infinity, ease: "linear" }
      });
    } else {
      inputBorderControls.stop();
      inputBorderControls.set({ backgroundPosition: '0% 50%' });
    }
    
    // Update progress based on input value
    if (type === "text" || type === "email") {
      progressValue.set(Math.min((value.length / 20) * 100, 100));
    } else if (as === "textarea") {
      progressValue.set(Math.min((value.length / 100) * 100, 100));
    }
  }, [isFocused, inputBorderControls, progressValue, value, type, as]);

  return (
    <div className="relative space-y-2 group">
      <label htmlFor={id} className="text-sm font-medium leading-none opacity-80 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </label>
      
      <div className="relative">
        {as === "input" ? (
          <input
            id={id}
            name={name}
            type={type}
            className="flex h-12 w-full rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200 ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 z-10 relative group-hover:border-primary/30"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <textarea
            id={id}
            name={name}
            rows={rows}
            className="flex w-full rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200 ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 z-10 relative group-hover:border-primary/30"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
        
        {/* Glowing border animation */}
        <motion.div 
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{ 
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(90deg, var(--primary) 0%, rgba(123, 97, 255, 0.3) 50%, var(--primary) 100%)',
            backgroundSize: '200% 100%',
            opacity: isFocused ? 1 : 0,
            maskImage: 'linear-gradient(to right, black 0%, black 100%)',
            maskSize: '100% 100%',
            maskPosition: '0 0',
            maskRepeat: 'no-repeat'
          }}
          animate={inputBorderControls}
        />
        
        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary/40 to-primary"
            style={{ scaleX: progress, originX: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

// Particle Background
const ParticleField = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10"
          style={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`],
            y: [`${particle.y}%`, `${particle.y + (Math.random() * 10 - 5)}%`],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D Card
const Card3D = ({ children }: { children: React.ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * 5;
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 5;
    
    setRotateX(-rotateXValue);
    setRotateY(rotateYValue);
  };
  
  const resetRotation = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };
  
  // Spring animations for smoother motion
  const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  return (
    <motion.div 
      ref={cardRef}
      className="relative w-full perspective-1000 cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered ? 
          `rotateX(${springRotateX}deg) rotateY(${springRotateY}deg)` : 
          "rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease-out"
      }}
    >
      <div 
        className="relative bg-background/20 backdrop-blur-md rounded-xl border border-primary/10 overflow-hidden shadow-lg"
        style={{ 
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card lighting effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-300"
          style={{ 
            opacity: isHovered ? 0.8 : 0,
            transform: `translateZ(2px)`,
            backgroundPosition: `${50 + rotateY * 2}% ${50 + rotateX * 2}%`,
          }}
        />
        
        {/* Card content */}
        <div style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
        
        {/* Edge highlight */}
        <div 
          className="absolute inset-0 rounded-xl border border-primary/30 opacity-0"
          style={{ 
            opacity: isHovered ? 0.6 : 0,
            transform: `translateZ(1px)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [animateForm, setAnimateForm] = useState(false);
  
  const { ref, controls } = useScrollAnimation(0.1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setAnimateForm(true);
    
    // Simulate form submission - in a real application, you would send this to your backend
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAnimateForm(false), 1000);
    }
  };
  
  return (
    <section id="contact" className="relative py-24 w-full overflow-hidden">
      {/* Decorative elements */}
      <ParticleField />
      <CircleBlur className="top-20 -left-32 opacity-20" size="300px" duration={15} />
      <CircleBlur className="bottom-40 -right-40 opacity-10" size="400px" delay={2} duration={20} />
      <FloatingShape className="top-40 right-[5%] w-12 h-12 rotate-12 border border-primary/30 rounded-md" delay={1} />
      <FloatingShape className="bottom-20 left-[10%] w-8 h-8 rotate-45 bg-primary/5 rounded-full" delay={0.5} />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center space-x-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Let's Connect</span>
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span className="relative">
              Get In Touch
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </span>
          </h2>
          <motion.p 
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a project in mind or want to discuss potential opportunities? I'd love to hear from you!
            I'm currently available for remote contract or part-time positions.
          </motion.p>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          <motion.div 
            ref={ref}
            className="space-y-8"
            variants={fadeIn}
            initial="hidden"
            animate={controls}
            viewport={{ once: true }}
          >
            {/* Contact Info Card */}
            <Card3D>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    Let's Talk
                  </h3>
                  <p className="text-muted-foreground">
                    Feel free to reach out through any of these channels:
                  </p>
                </div>
                
                <motion.div 
                  className="grid gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="group"
                  >
                    <Link href="mailto:orionlamme01@gmail.com" className="block">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-background/30 to-background/50 backdrop-blur-sm border border-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Email</p>
                          <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            orionlamme01@gmail.com
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-0 text-primary opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="group"
                  >
                    <Link href="tel:+31615584889" className="block">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-background/30 to-background/50 backdrop-blur-sm border border-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Phone</p>
                          <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            +31 6 1558 4889
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-0 text-primary opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-background/30 to-background/50 backdrop-blur-sm border border-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                      <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Location</p>
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                          Almere, Flevoland, Netherlands
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold pt-2">Connect With Me</h3>
                  <div className="flex flex-wrap gap-3">
                    <MagneticButton 
                      href="https://github.com/SwiftAkira" 
                      className="bg-gradient-to-br from-gray-800 to-gray-900 text-white"
                      icon={<Github className="w-5 h-5" />}
                      external={true}
                    >
                      GitHub
                    </MagneticButton>
                    
                    <MagneticButton 
                      href="https://linkedin.com/in/orion-lamme" 
                      className="bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      icon={<Linkedin className="w-5 h-5" />}
                      external={true}
                    >
                      LinkedIn
                    </MagneticButton>
                    
                    <MagneticButton 
                      href="mailto:orionlamme01@gmail.com" 
                      className="bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                      icon={<Mail className="w-5 h-5" />}
                      external={true}
                    >
                      Email
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>
          
          <motion.div
            className="relative"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Form Card */}
            <Card3D>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center">
                    <Send className="w-5 h-5 mr-2 text-primary" />
                    Send a Message
                  </h3>
                  <p className="text-muted-foreground">
                    I'll get back to you as soon as possible.
                  </p>
                </div>
                
                <motion.form 
                  id="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  animate={animateForm ? { 
                    y: [0, -10, 0],
                    opacity: [1, 0.8, 1],
                    transition: { duration: 0.5 } 
                  } : {}}
                >
                  <AnimatedInput
                    label="Name"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                  
                  <AnimatedInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                  />
                  
                  <AnimatedInput
                    label="Message"
                    id="message"
                    name="message"
                    as="textarea"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                  />
                  
                  {submitError && (
                    <motion.p 
                      className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {submitError}
                    </motion.p>
                  )}
                  
                  {submitSuccess && (
                    <motion.div 
                      className="text-sm text-green-500 bg-green-500/10 px-3 py-2 rounded-md flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Your message has been sent successfully!
                    </motion.div>
                  )}
                  
                  <div className="pt-2">
                    <MagneticButton
                      onClick={isSubmitting ? undefined : () => {
                        const form = document.getElementById('contact-form');
                        if (form) {
                          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }
                      }}
                      className={`w-full bg-gradient-to-r from-primary to-primary/80 text-white font-medium ${isSubmitting ? 'opacity-80' : ''}`}
                      icon={isSubmitting ? <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" /> : <Send className="w-5 h-5" />}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </MagneticButton>
                  </div>
                </motion.form>
              </div>
            </Card3D>
            
            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 right-1/2 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-30 blur-3xl">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  borderRadius: ["50%", "40%", "50%"],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 