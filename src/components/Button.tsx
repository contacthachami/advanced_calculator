import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isDarkMode?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  isDarkMode = false,
  className = '',
}) => {
  const baseClasses = 'rounded-xl p-4 text-center transition-all duration-300 font-medium relative backdrop-blur-sm shadow-lg';
  
  const variantClasses = {
    primary: isDarkMode
      ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white shadow-gray-900/30'
      : 'bg-white/80 hover:bg-gray-50/80 text-gray-800 shadow-gray-200/30',
    secondary: isDarkMode
      ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white shadow-gray-900/30'
      : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-800 shadow-gray-200/30',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};