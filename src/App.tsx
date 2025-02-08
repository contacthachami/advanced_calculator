import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, Sun, Moon, Languages, FunctionSquare as Function } from 'lucide-react';
import { Display } from './components/Display';
import { Button } from './components/Button';
import { History } from './components/History';
import { useCalculator } from './hooks/useCalculator';
import './i18n/i18n';

function App() {
  const { t, i18n } = useTranslation();
  const { state, dispatch, handleKeyPress, handleScientificOperation, exportToPDF, exportToImage } = useCalculator();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 relative ${
      state.isDarkMode ? 'calculator-gradient' : 'light-gradient'
    }`}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
          id="calculator"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            } flex items-center`}>
              <Calculator className="inline-block mr-2" />
              {t('calculator.title')}
            </h1>
            <div className="flex items-center space-x-4">
              <select
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className={`p-2 rounded-lg ${
                  state.isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'TOGGLE_SCIENTIFIC' })}
                className={`p-2 rounded-full transition-all duration-300 ${
                  state.isDarkMode
                    ? 'bg-gray-800/80 text-purple-400 hover:bg-gray-700/80'
                    : 'bg-white/80 text-purple-600 hover:bg-gray-50/80'
                }`}
              >
                <Function size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                className={`p-2 rounded-full transition-all duration-300 ${
                  state.isDarkMode
                    ? 'bg-gray-800/80 text-yellow-400 hover:bg-gray-700/80'
                    : 'bg-white/80 text-gray-800 hover:bg-gray-50/80'
                }`}
              >
                {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className={`lg:col-span-2 backdrop-blur-md bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden ${
                state.isDarkMode
                  ? 'bg-gray-900/40 shadow-gray-900/30'
                  : 'bg-white/40 shadow-gray-200/30'
              }`}
            >
              <Display value={state.display} isDarkMode={state.isDarkMode} error={state.error} />

              <div className="grid grid-cols-4 gap-3 p-4">
                {state.isScientific && (
                  <div className="col-span-4 grid grid-cols-4 gap-3 mb-3">
                    <Button
                      onClick={() => handleScientificOperation('sin')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      sin
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('cos')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      cos
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('tan')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      tan
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('log')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      log
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('ln')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      ln
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('sqrt')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      √
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('pow')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      xⁿ
                    </Button>
                    <Button
                      onClick={() => handleScientificOperation('pi')}
                      variant="secondary"
                      isDarkMode={state.isDarkMode}
                    >
                      π
                    </Button>
                  </div>
                )}

                {/* Standard Calculator Buttons */}
                <Button
                  onClick={() => dispatch({ type: 'CLEAR' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  C
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '(' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  (
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: ')' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  )
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '/' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  ÷
                </Button>

                {/* Numbers and Operations */}
                {[7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: num.toString() })}
                    isDarkMode={state.isDarkMode}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '*' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  ×
                </Button>

                {[4, 5, 6].map((num) => (
                  <Button
                    key={num}
                    onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: num.toString() })}
                    isDarkMode={state.isDarkMode}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '-' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  −
                </Button>

                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: num.toString() })}
                    isDarkMode={state.isDarkMode}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '+' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                >
                  +
                </Button>

                <Button
                  onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '0' })}
                  isDarkMode={state.isDarkMode}
                >
                  0
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: '.' })}
                  isDarkMode={state.isDarkMode}
                >
                  .
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'CALCULATE' })}
                  variant="secondary"
                  isDarkMode={state.isDarkMode}
                  className="col-span-2"
                >
                  =
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <History
                history={state.history}
                onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
                isDarkMode={state.isDarkMode}
                onSelect={(expression) => dispatch({ type: 'SET_EXPRESSION', payload: expression })}
                onExportPDF={exportToPDF}
                onExportImage={exportToImage}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;