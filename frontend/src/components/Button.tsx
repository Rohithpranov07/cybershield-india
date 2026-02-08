import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  children, 
  icon,
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = "font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "gradient-primary text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl active:scale-98",
    secondary: "bg-white border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-500 hover:text-white",
    outline: "bg-transparent border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-blue-500 hover:text-blue-600",
    icon: "bg-transparent hover:bg-gray-100 p-2 rounded-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: variant !== 'icon' ? 1.05 : 1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
