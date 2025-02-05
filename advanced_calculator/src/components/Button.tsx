import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'scientific';
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  isDarkMode = false,
}) => {
  const baseClasses = 'rounded-lg p-3 text-center transition-all duration-200 font-semibold';
  
  const variantClasses = {
    primary: isDarkMode
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    scientific: isDarkMode
      ? 'bg-purple-600 hover:bg-purple-700 text-white'
      : 'bg-purple-500 hover:bg-purple-600 text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};