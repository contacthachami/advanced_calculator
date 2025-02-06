import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, Sun, Moon } from 'lucide-react';
import { Display } from './components/Display';
import { Button } from './components/Button';
import { History } from './components/History';
import { useCalculator } from './hooks/useCalculator';
function App() {
  const { t } = useTranslation();
  const { state, dispatch, handleKeyPress } = useCalculator();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className={`min-h-screen transition-all duration-300 relative ${
      state.isDarkMode ? 'calculator-gradient' : 'light-gradient'
    }`}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
          id="calculator"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            } flex items-center`}>
              <Calculator className="inline-block mr-2" />
              {t('Calculator Basic')}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
              className={`p-2 rounded-full transition-all duration-300 ${
                state.isDarkMode 
                  ? 'bg-gray-800/80 text-yellow-400 hover:bg-gray-700/80 shadow-lg shadow-gray-900/50' 
                  : 'bg-white/80 text-gray-800 hover:bg-gray-50/80 shadow-lg shadow-gray-200/50'
              }`}
            >
              {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          <motion.div
            className={`backdrop-blur-md bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden ${
              state.isDarkMode 
                ? 'bg-gray-900/40 shadow-gray-900/30' 
                : 'bg-white/40 shadow-gray-200/30'
            }`}
          >
            <Display value={state.display} isDarkMode={state.isDarkMode} error={state.error} />

            <div className="grid grid-cols-4 gap-3 p-4">
              {/* Row 1 - Clear and Operations */}
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

              {/* Row 2 - Numbers 7-9 and Multiply */}
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '7' })}
                isDarkMode={state.isDarkMode}
              >
                7
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '8' })}
                isDarkMode={state.isDarkMode}
              >
                8
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '9' })}
                isDarkMode={state.isDarkMode}
              >
                9
              </Button>
              <Button
                onClick={() => dispatch({ type: 'SET_OPERATION', payload: '*' })}
                variant="secondary"
                isDarkMode={state.isDarkMode}
              >
                ×
              </Button>

              {/* Row 3 - Numbers 4-6 and Subtract */}
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '4' })}
                isDarkMode={state.isDarkMode}
              >
                4
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '5' })}
                isDarkMode={state.isDarkMode}
              >
                5
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '6' })}
                isDarkMode={state.isDarkMode}
              >
                6
              </Button>
              <Button
                onClick={() => dispatch({ type: 'SET_OPERATION', payload: '-' })}
                variant="secondary"
                isDarkMode={state.isDarkMode}
              >
                −
              </Button>

              {/* Row 4 - Numbers 1-3 and Add */}
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '1' })}
                isDarkMode={state.isDarkMode}
              >
                1
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '2' })}
                isDarkMode={state.isDarkMode}
              >
                2
              </Button>
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '3' })}
                isDarkMode={state.isDarkMode}
              >
                3
              </Button>
              <Button
                onClick={() => dispatch({ type: 'SET_OPERATION', payload: '+' })}
                variant="secondary"
                isDarkMode={state.isDarkMode}
              >
                +
              </Button>

              {/* Row 5 - Zero and Equals */}
              <Button
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: '0' })}
                isDarkMode={state.isDarkMode}
              >
                0
              </Button>
              <Button
                onClick={() => dispatch({ type: 'CALCULATE' })}
                variant="secondary"
                isDarkMode={state.isDarkMode}
                className="col-span-3"
              >
                =
              </Button>
            </div>
          </motion.div>

          <div className="mt-6">
            <History
              history={state.history}
              onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
              isDarkMode={state.isDarkMode}
              onSelect={(expression) => dispatch({ type: 'SET_EXPRESSION', payload: expression })}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App