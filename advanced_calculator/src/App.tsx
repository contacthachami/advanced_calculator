import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { Display } from './components/Display';
import { Button } from './components/Button';
import { History } from './components/History';
import { useCalculator } from './hooks/useCalculator';
import './i18n/i18n';

function App() {
  const { t } = useTranslation();
  const { state, dispatch, handleKeyPress } = useCalculator();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
          id="calculator"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${state.isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Calculator className="inline-block mr-2" />
              {t('calculator.title')}
            </h1>
          </div>

          <Display value={state.display} isDarkMode={state.isDarkMode} error={state.error} />

          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button onClick={() => dispatch({ type: 'CLEAR' })} variant="secondary" isDarkMode={state.isDarkMode}>
              C
            </Button>
            <Button onClick={() => dispatch({ type: 'SET_OPERATION', payload: '(' })} variant="secondary" isDarkMode={state.isDarkMode}>
              (
            </Button>
            <Button onClick={() => dispatch({ type: 'SET_OPERATION', payload: ')' })} variant="secondary" isDarkMode={state.isDarkMode}>
              )
            </Button>
            <Button onClick={() => dispatch({ type: 'SET_OPERATION', payload: '/' })} variant="secondary" isDarkMode={state.isDarkMode}>
              ÷
            </Button>
            
            {['7', '8', '9', '*'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn === '*' ? '×' : btn}
              </Button>
            ))}
            
            {['4', '5', '6', '-'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
            
            {['1', '2', '3', '+'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
            
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

          <History
            history={state.history}
            onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
            isDarkMode={state.isDarkMode}
            onSelect={(expression) => dispatch({ type: 'SET_EXPRESSION', payload: expression })}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App;