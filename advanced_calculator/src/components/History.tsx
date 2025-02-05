import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalculationHistory } from '../types/calculator';
import { Search } from 'lucide-react';

interface HistoryProps {
  history: CalculationHistory[];
  onClear: () => void;
  isDarkMode: boolean;
  onSelect: (expression: string) => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onClear,
  isDarkMode,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = history.filter(
    (item) =>
      item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          } text-white transition-colors`}
        >
          {t('calculator.history.clear')}
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t('calculator.history.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 pl-8 rounded ${
            isDarkMode
              ? 'bg-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-100 text-gray-800 placeholder-gray-500'
          }`}
        />
        <Search className="absolute left-2 top-2.5 w-4 h-4 opacity-50" />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500">
            {searchTerm
              ? t('calculator.history.noResults')
              : t('calculator.history.empty')}
          </p>
        ) : (
          filteredHistory.map((item) => (
            <motion.div
              key={item.timestamp}
              className={`p-2 rounded cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => onSelect(item.expression)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="text-sm">{item.expression}</div>
              <div className="text-lg font-semibold">{item.result}</div>
              <div className="text-xs opacity-50">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};