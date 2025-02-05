import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'scientific' | 'memory' | 'unit';
  isDarkMode?: boolean;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  isDarkMode = false,
  shortcut,
}) => {
  const baseClasses = 'rounded-lg p-3 text-center transition-all duration-200 font-medium relative';
  
  const variantClasses = {
    primary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    secondary: isDarkMode
      ? 'bg-gray-800 hover:bg-gray-700 text-white'
      : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200',
    scientific: isDarkMode
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
      : 'bg-indigo-500 hover:bg-indigo-600 text-white',
    memory: isDarkMode
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : 'bg-emerald-500 hover:bg-emerald-600 text-white',
    unit: isDarkMode
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-amber-500 hover:bg-amber-600 text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
      {shortcut && (
        <span className="absolute bottom-1 right-1 text-xs opacity-60">
          {shortcut}
        </span>
      )}
    </motion.button>
  );
};