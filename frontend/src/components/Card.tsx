import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'glass';
  hover?: boolean;
}

export function Card({ children, className = '', variant = 'standard', hover = false }: CardProps) {
  const baseClasses = "rounded-xl p-6";
  
  const variants = {
    standard: "bg-white border border-gray-200 shadow-sm",
    glass: "glassmorphism"
  };

  const hoverClasses = hover ? "hover:shadow-lg hover:border-blue-300 transition-all duration-300" : "";

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}
