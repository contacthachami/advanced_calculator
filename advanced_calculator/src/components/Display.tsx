import React from 'react';
import { motion } from 'framer-motion';

interface DisplayProps {
  value: string;
  isDarkMode: boolean;
}

export const Display: React.FC<DisplayProps> = ({ value, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full p-4 text-right text-3xl font-mono rounded-lg mb-4 ${
        isDarkMode
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-800'
      } shadow-lg`}
    >
      {value || '0'}
    </motion.div>
  );
};