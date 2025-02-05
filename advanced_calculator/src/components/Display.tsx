import React from 'react';
import { motion } from 'framer-motion';

interface DisplayProps {
  value: string;
  isDarkMode: boolean;
  error?: string;
}

export const Display: React.FC<DisplayProps> = ({
  value,
  isDarkMode,
  error,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full p-4 rounded-lg mb-4 ${
        isDarkMode
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-800'
      } shadow-lg`}
    >
      <div className="text-right text-4xl font-mono tracking-wider overflow-x-auto">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          value || '0'
        )}
      </div>
    </motion.div>
  );
};