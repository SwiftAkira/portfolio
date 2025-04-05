"use client";

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useMouse } from '@uidotdev/usehooks'; // A hook for easy mouse tracking

// Define the structure of skill and category data we expect
interface Skill {
  name: string;
  level: number; // We might use this later for subtle size variations
  color: string; // Primary color for the skill node/glow
}

interface SkillCategory {
  name: string;
  icon: string; // We can potentially use this in tooltips
  description: string;
  skills: Skill[];
  color?: string; // Optional: color for the category node
}

interface SkillConstellationProps {
  categories: SkillCategory[];
  width?: number; // SVG width
  height?: number; // SVG height
}

// Node types for internal calculations
interface Node {
  id: string;
  type: 'category' | 'skill';
  name: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  data: Skill | SkillCategory;
  parentId?: string; // For skills, refers to category ID
}

interface Edge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
}

// --- Constants ---
const CATEGORY_RADIUS = 20;
const SKILL_RADIUS = 8;
const SKILL_ORBIT_RADIUS_BASE = 75;
const SKILL_ORBIT_RADIUS_VARIANCE = 25;
const MAX_PARALLAX_ROTATION = 8; // Degrees

// Helper function to round numbers to a specific precision
const round = (num: number, precision: number = 3): number => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

const SkillConstellation: React.FC<SkillConstellationProps> = ({
  categories,
  width = 800, // Default width
  height = 600, // Default height
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // --- 1. Calculate Node and Edge Positions (Memoized) ---
  const { nodes, edges } = useMemo(() => {
    // console.log("Recalculating constellation layout...");
    const calculatedNodes: Node[] = [];
    const calculatedEdges: Edge[] = [];
    const numCategories = categories.length;
    
    const ellipseRadiusX = width * 0.4; 
    const ellipseRadiusY = height * 0.4;

    // Place category nodes
    categories.forEach((category, index) => {
      const angle = (index / numCategories) * 2 * Math.PI;
      const categoryId = `cat-${category.name.replace(/\s|&/g, '')}`;
      // Calculate positions relative to center (width/2, height/2)
      const catX = round(width/2 + ellipseRadiusX * Math.cos(angle));
      const catY = round(height/2 + ellipseRadiusY * Math.sin(angle));

      // Add category node data
      calculatedNodes.push({
        id: categoryId,
        type: 'category',
        name: category.name,
        x: catX,
        y: catY,
        radius: CATEGORY_RADIUS,
        color: category.color || 'rgba(var(--primary-rgb), 0.7)',
        data: category,
      });

      // Place skill nodes orbiting this category
      const numSkills = category.skills.length;
      category.skills.forEach((skill, skillIndex) => {
        const skillAngle = (skillIndex / numSkills) * 2 * Math.PI;
        
        // --- HYDRATION FIX: Replace Math.random() with deterministic variation ---
        // Use skillIndex to create consistent variation instead of Math.random()
        // Example: Alternate adding/subtracting half the variance, or cycle through variations.
        const deterministicVariance = (skillIndex % 3 - 1) * (SKILL_ORBIT_RADIUS_VARIANCE / 2); // Gives -variance/2, 0, +variance/2 cycle
        const orbitRadius = SKILL_ORBIT_RADIUS_BASE + deterministicVariance;
        // ----------------------------------------------------------------------
        
        const skillId = `skill-${skill.name.replace(/\s|&|\./g, '')}`;
        
        // Round calculated positions
        const skillX = round(catX + orbitRadius * Math.cos(skillAngle));
        const skillY = round(catY + orbitRadius * Math.sin(skillAngle));

        // Add skill node data
        calculatedNodes.push({
          id: skillId,
          type: 'skill',
          name: skill.name,
          x: skillX,
          y: skillY,
          radius: SKILL_RADIUS,
          color: skill.color || 'rgba(var(--foreground-rgb), 0.8)',
          data: skill,
          parentId: categoryId,
        });

        // Add edge connecting the skill to its category
        calculatedEdges.push({
          id: `edge-${categoryId}-${skillId}`,
          source: categoryId,
          target: skillId,
        });
      });
    });

    // Optional: Add edges between related categories (Example: Lang -> Frameworks)
    // Find specific category nodes if needed for inter-category connections
    // const langNode = calculatedNodes.find(n => n.id === 'cat-Languages');
    // const frameNode = calculatedNodes.find(n => n.id === 'cat-Frameworks');
    // if (langNode && frameNode) {
    //   calculatedEdges.push({ id: 'edge-lang-frame', source: langNode.id, target: frameNode.id });
    // }

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [categories, width, height]);

  // --- 2. 3D Parallax Effect ---
  const [mouse, ref] = useMouse(); // Attaches ref to the container div
  const containerRef = ref as React.RefObject<HTMLDivElement>;

  // Smooth mouse values with spring physics for subtle rotation
  const smoothMouseX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20, mass: 0.5 });
  const smoothMouseY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20, mass: 0.5 });

  // Update motion values based on mouse position relative to the container center
  React.useEffect(() => {
    if (containerRef.current && mouse.elementX !== null && mouse.elementY !== null) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = mouse.elementX - rect.width / 2;
      const offsetY = mouse.elementY - rect.height / 2;
      
      // Normalize offset to a range (e.g., -1 to 1) and scale by max rotation
      const targetX = (offsetX / (rect.width / 2)) * MAX_PARALLAX_ROTATION;
      const targetY = -(offsetY / (rect.height / 2)) * MAX_PARALLAX_ROTATION; // Invert Y for natural feel

      // Set the target for the spring animations
      smoothMouseX.set(targetX);
      smoothMouseY.set(targetY);
    }
  }, [mouse.elementX, mouse.elementY, smoothMouseX, smoothMouseY, containerRef]);

  // Transform motion values into rotateX and rotateY
  const rotateX = useTransform(smoothMouseY, value => `${value}deg`); // Rotate around X axis based on vertical mouse movement
  const rotateY = useTransform(smoothMouseX, value => `${value}deg`); // Rotate around Y axis based on horizontal mouse movement

  // --- 3. Animation Variants for Entry Animation ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, // Keep stagger on the container
        delayChildren: 0.3,    
      } 
    },
  };

  const itemVariants = { // This variant will now ONLY be used for edges
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    },
  };
  
  // --- 4. Hover State Logic (Memoized with useCallback) ---
  const getNodeState = useCallback((nodeId: string): 'hovered' | 'related' | 'dimmed' | 'default' => {
    if (!hoveredNodeId) return 'default'; 
    if (nodeId === hoveredNodeId) return 'hovered';
    
    // Find nodes directly within the callback using the memoized `nodes` reference
    const hNode = nodes.find(n => n.id === hoveredNodeId);
    const currentNode = nodes.find(n => n.id === nodeId);
    if (!hNode || !currentNode) return 'dimmed';

    if (hNode.type === 'category' && currentNode.parentId === hNode.id) return 'related';
    if (hNode.type === 'skill' && currentNode.id === hNode.parentId) return 'related';
    
    return 'dimmed'; 
  }, [hoveredNodeId, nodes]);
  
  const getEdgeState = useCallback((edge: Edge): 'related' | 'dimmed' | 'default' => {
    if (!hoveredNodeId) return 'default';
    const sourceState = getNodeState(edge.source);
    const targetState = getNodeState(edge.target);
    if (sourceState === 'hovered' || targetState === 'hovered' || (sourceState === 'related' && targetState === 'related')) {
        return 'related';
    }
    return 'dimmed';
  }, [hoveredNodeId, getNodeState]);

  // --- 5. Helper Function for Node Animation Properties ---
  const getNodeAnimProps = useCallback((node: Node) => {
    const state = getNodeState(node.id);
    const isCategory = node.type === 'category';
    
    let scale = 1;
    let opacity = 1;
    let filter = 'none'; // Using drop-shadow for glow effect

    switch (state) {
      case 'hovered':
        scale = isCategory ? 1.2 : 1.4;
        // Apply glow ONLY on direct hover now
        const glowColor = node.color || 'rgba(var(--primary-rgb), 0.6)';
        filter = `drop-shadow(0 0 5px ${glowColor})`; // Standard glow size for all hovered
        break;
      case 'related':
        scale = isCategory ? 1.05 : 1.15;
        break;
      case 'dimmed':
        scale = 0.8;
        opacity = 0.4;
        break;
      // 'default' state uses the initial values (scale=1, opacity=1, filter='none').
    }
    
    return {
      x: node.x,
      y: node.y,
      scale,
      opacity,
      filter,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    };
  }, [getNodeState]);

  // --- 7. Render SVG ---
  return (
    <motion.div
      ref={containerRef}
      className="w-full flex justify-center items-center relative"
      style={{ 
        perspective: '1000px', // Enable 3D perspective
        height: `${height}px`, // Set container height
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ 
          // Apply 3D rotation based on mouse position
          rotateX, 
          rotateY,
          // Ensure transforms originate from the center
          transformOrigin: 'center center', 
          maxWidth: `${width}px`, // Limit SVG size
        }}
        className="overflow-visible" // Allow nodes/glows to slightly exceed viewBox
      >
        {/* Glow Definitions (Optional but cool) */}
        {/* Removed SVG <defs> for filter, using CSS filter now */}

        {/* Group for Edges (Lines) - Rendered first */}
        <g>
          {edges.map(edge => {
             const sourceNode = nodes.find(n => n.id === edge.source);
             const targetNode = nodes.find(n => n.id === edge.target);
             if (!sourceNode || !targetNode) return null; 

             const state = getEdgeState(edge);
             const isRelated = state === 'related';

             return (
              <motion.line
                key={edge.id}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="rgba(var(--foreground-rgb), 0.15)"
                strokeWidth={1}
                // Edges still use itemVariants for entry pop-in
                variants={itemVariants} 
                initial="hidden"
                animate={{ 
                    opacity: state === 'dimmed' ? 0.05 : (isRelated ? 0.6 : 0.15),
                    stroke: isRelated ? 'rgba(var(--primary-rgb), 0.6)' : 'rgba(var(--foreground-rgb), 0.15)',
                    strokeWidth: isRelated ? 1.5 : 1,
                    // Animate scale back to 1 in case it started at 0 from variants
                    scale: 1, 
                    transition: { duration: 0.3, scale: { delay: 0.05 } } // Delay scale slightly after opacity/stroke
                }}
              />
            );
          })}
        </g>

        {/* Group for Nodes - Rendered in a single loop */}
        {/* Order matters less now, hover effects control appearance */}
        <g>
          {nodes.map(node => {
            const animProps = getNodeAnimProps(node);
            const state = getNodeState(node.id);

            return (
              <motion.g 
                key={node.id}
                animate={animProps}
                onHoverStart={() => setHoveredNodeId(node.id)}
                onHoverEnd={() => setHoveredNodeId(null)}
                className="cursor-pointer"
              >
                <motion.circle
                  r={node.radius}
                  fill={node.color || 'rgba(var(--foreground-rgb), 0.8)'}
                  stroke={'rgba(var(--foreground-rgb), 0.1)'}
                  strokeWidth={1}
                />
                {/* Text Label - Rendered only when hovered */}
                {state === 'hovered' && (
                  <motion.text 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1 }}}
                    exit={{ opacity: 0, y: 5 }}
                    textAnchor="middle"
                    y={-node.radius - 8}
                    fill="rgba(var(--foreground-rgb), 0.9)"
                    fontSize="12"
                    fontWeight="medium"
                    paintOrder="stroke"
                    strokeWidth="4px"
                    stroke="rgba(240, 240, 240, 0.7)"
                    className="pointer-events-none"
                  >
                    {hoveredNodeId === node.id ? node.name : ''}
                  </motion.text>
                )}
              </motion.g>
            );
          })}
        </g>
      </motion.svg>
    </motion.div>
  );
};

export default SkillConstellation; 