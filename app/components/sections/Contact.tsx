"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Mail, MapPin, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CircleBlur, FloatingShape } from '../ui/DecorativeElements';
import { useScrollAnimation, fadeIn } from '@/app/lib/hooks/useScrollAnimation';

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

// Particle Background - Wrap state in useEffect for hydration safety
const ParticleField = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 2,
      }))
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10"> {/* Ensure particles are behind */} 
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
            translateX: [`0%`, `${(Math.random() * 10 - 5)}%`],
            translateY: [`0%`, `${(Math.random() * 10 - 5)}%`],
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

// --- Refactored 3D Card Component --- 
const Card3D = ({ children }: { children: React.ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Use motion values for direct, smooth updates without re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for natural movement
  const springConfig = { stiffness: 150, damping: 20, mass: 0.1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const xPct = (clientX - rect.left) / rect.width - 0.5;
    const yPct = (clientY - rect.top) / rect.height - 0.5;
    // Update motion values directly
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    // Reset motion values to return to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // Define max rotation degrees
  const maxRotation = 8; 

  // Transform the smoothed motion values into rotateX and rotateY CSS properties
  // Invert rotation directions for a natural feel (moving mouse right tilts card left/around Y)
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [-maxRotation, maxRotation]);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full"
      style={{
        perspective: '1000px', // Set perspective on the parent
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* This inner div applies the rotation and contains the interactive content */}
      <motion.div
         style={{
           transformStyle: "preserve-3d", // Ensure children are in 3D space
           rotateX,
           rotateY,
           // Add a subtle transition for when the mouse leaves
           transition: 'transform 0.4s ease-out' 
         }}
      >
        {/* The children (Card component) are rendered here and should remain interactive */}
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function Contact() {
  const { ref, controls } = useScrollAnimation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    console.log('Form data:', formData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('Message Sent!');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <motion.section 
      id="contact"
      ref={ref}
      variants={fadeIn}
      initial="hidden"
      animate={controls}
      className="py-20 lg:py-32 relative w-full overflow-hidden"
    >
      <ParticleField />
      <CircleBlur className="absolute left-[10%] top-[5%] opacity-50" size="400px" duration={30} /> 
      <FloatingShape className="absolute left-[15%] bottom-[20%] w-10 h-10 border-2 border-primary/10 rounded-full rotate-45" delay={1} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-xl z-10 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <span className="text-primary font-mono tracking-widest text-sm">CONNECT</span>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <motion.div 
            className="w-20 h-1 bg-primary rounded mt-2"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed mt-6">
            Have a project in mind, a question, or just want to say hi? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info & Socials Card Wrapper */}
          <motion.div 
            variants={fadeIn}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            {/* Apply 3D effect to the Card */}
            <Card3D>
              {/* Dark Mode Adjustment: Increased card background opacity */}
              <Card className="bg-card/40 backdrop-blur-lg border-primary/10 shadow-xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground">Contact Information</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 mt-1 text-primary shrink-0" />
                      <span>Based in Netherlands - Let&apos;s connect virtually!</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 mt-1 text-primary shrink-0" />
                      <a href="mailto:orionlamme01@gmail.com" className="hover:text-primary transition-colors">orionlamme01@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="border-t border-primary/10 pt-6">
                    <h4 className="text-lg font-medium mb-4 text-foreground">Find me on</h4>
                    <div className="flex items-center flex-wrap gap-4">
                      <MagneticButton 
                        href="https://github.com/SwiftAkira" 
                        icon={<Github size={18} />}
                        className="bg-card/60 border border-primary/20 hover:bg-accent hover:text-accent-foreground text-sm"
                        external={true}
                      >
                        GitHub
                      </MagneticButton>
                      <MagneticButton 
                        href="mailto:orionlamme01@gmail.com"
                        icon={<Mail size={18} />}
                        className="bg-card/60 border border-primary/20 hover:bg-accent hover:text-accent-foreground text-sm"
                      >
                        Email
                      </MagneticButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Card3D>
          </motion.div>

          {/* Contact Form Card Wrapper */}
          <motion.div 
            variants={fadeIn} 
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full"
          >
            {/* Apply 3D effect to the Card */}
            <Card3D>
              {/* Dark Mode Adjustment: Increased card background opacity */}
              <Card className="bg-card/40 backdrop-blur-lg border-primary/10 shadow-xl overflow-hidden w-full">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-semibold text-foreground mb-6">Send a Message</h3>
                    <AnimatedInput 
                      label="Your Name" id="name" name="name" placeholder="What should I call you?"
                      value={formData.name} onChange={handleChange} required
                    />
                    <AnimatedInput 
                      label="Your Email" id="email" name="email" type="email" placeholder="Where can I reply?"
                      value={formData.email} onChange={handleChange} required
                    />
                    <AnimatedInput 
                      as="textarea" label="Your Message" id="message" name="message" placeholder="What&apos;s on your mind?"
                      value={formData.message} onChange={handleChange} required rows={5}
                    />
                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        type="submit" size="lg" 
                        className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/30 w-full sm:w-auto"
                        disabled={status === 'Sending...' || status === 'Message Sent!'}
                      >
                        {status === 'Sending...' ? (
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-2 inline-block">
                            <Sparkles size={18} />
                          </motion.span>
                        ) : status === 'Message Sent!' ? (
                          <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mr-2">
                           ✅
                          </motion.span>
                        ) : (
                          <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                        )}
                        {status || 'Send Message'}
                      </Button>
                      {status === 'Message Sent!' && (
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-green-500 ml-4"
                        >
                          Thanks! I&apos;ll be in touch.
                        </motion.p>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Card3D>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 