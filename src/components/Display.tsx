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
      className={`p-6 ${
        isDarkMode
          ? 'bg-gray-800/50 text-white'
          : 'bg-gray-50/50 text-gray-800'
      }`}
    >
      <div className="text-right text-4xl font-mono tracking-wider overflow-x-auto scrollbar-hide">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          value || '0'
        )}
      </div>
    </motion.div>
  );
};