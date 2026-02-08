import React from 'react';
import { motion } from 'motion/react';

interface ConfidenceMeterProps {
  value: number; // 0-100
  size?: 'small' | 'medium' | 'large';
}

export function ConfidenceMeter({ value, size = 'medium' }: ConfidenceMeterProps) {
  const sizes = {
    small: { width: 80, stroke: 6, text: 'text-xl' },
    medium: { width: 120, stroke: 8, text: 'text-3xl' },
    large: { width: 160, stroke: 10, text: 'text-5xl' }
  };

  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (val: number) => {
    if (val < 50) return '#EF4444'; // Red
    if (val < 75) return '#F59E0B'; // Yellow
    return '#22C55E'; // Green
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={`font-bold ${text}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
}
