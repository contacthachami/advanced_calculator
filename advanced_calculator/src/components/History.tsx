import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalculationHistory } from '../types/calculator';

interface HistoryProps {
  history: CalculationHistory[];
  onClear: () => void;
  isDarkMode: boolean;
}

export const History: React.FC<HistoryProps> = ({ history, onClear, isDarkMode }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('calculator.history.title')}</h3>
        <button
          onClick={onClear}
          className={`text-sm px-2 py-1 rounded ${
            isDarkMode
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {t('calculator.history.clear')}
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-500">{t('calculator.history.empty')}</p>
        ) : (
          history.map((item, index) => (
            <div
              key={item.timestamp}
              className={`p-2 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="text-sm">{item.expression}</div>
              <div className="text-lg font-semibold">{item.result}</div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};