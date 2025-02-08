import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalculationHistory } from '../types/calculator';
import { Search, Clock, Trash2, RotateCcw, Download, Camera } from 'lucide-react';

interface HistoryProps {
  history: CalculationHistory[];
  onClear: () => void;
  isDarkMode: boolean;
  onSelect: (expression: string) => void;
  onExportPDF: () => void;
  onExportImage: () => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onClear,
  isDarkMode,
  onSelect,
  onExportPDF,
  onExportImage,
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode
          ? 'bg-gray-900/40 text-white shadow-gray-900/30'
          : 'bg-white/40 text-gray-800 shadow-gray-200/30'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {t('calculator.history.title')}
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportPDF}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-purple-500/20 text-purple-400'
                  : 'hover:bg-purple-100 text-purple-600'
              }`}
              title="Export to PDF"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportImage}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-blue-500/20 text-blue-400'
                  : 'hover:bg-blue-100 text-blue-600'
              }`}
              title="Export as Image"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-red-500/20 text-red-400'
                  : 'hover:bg-red-100 text-red-600'
              }`}
              title={t('calculator.history.clear')}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('calculator.history.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 pl-9 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800/50 text-white placeholder-gray-400 focus:bg-gray-800'
                : 'bg-gray-50/50 text-gray-800 placeholder-gray-500 focus:bg-white'
            } transition-colors focus:outline-none focus:ring-2 ${
              isDarkMode ? 'focus:ring-purple-500/50' : 'focus:ring-purple-500/30'
            }`}
          />
          <Search className="absolute left-2 top-2.5 w-5 h-5 opacity-50" />
        </div>
      </div>

      {/* History List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-4 text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
              {searchTerm
                ? t('calculator.history.noResults')
                : t('calculator.history.empty')}
            </motion.div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-xl cursor-pointer group ${
                    isDarkMode
                      ? 'hover:bg-gray-800/50'
                      : 'hover:bg-gray-100/50'
                  } transition-colors`}
                  onClick={() => onSelect(item.expression)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.expression}
                      </div>
                      <div className="text-lg font-semibold">{item.result}</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full opacity-0 group-hover:opacity-100 ${
                        isDarkMode
                          ? 'hover:bg-purple-500/20 text-purple-400'
                          : 'hover:bg-purple-100 text-purple-600'
                      } transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item.expression);
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};