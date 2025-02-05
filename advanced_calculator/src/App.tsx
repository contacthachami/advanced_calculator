import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sun, Moon, Languages, Calculator, Mic, MicOff, Save, Printer } from 'lucide-react';
import { Display } from './components/Display';
import { Button } from './components/Button';
import { History } from './components/History';
import { useCalculator } from './hooks/useCalculator';
import './i18n/i18n';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const { t, i18n } = useTranslation();
  const { state, dispatch, handleKeyPress } = useCalculator();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = i18n.language;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        dispatch({ type: 'APPEND_NUMBER', payload: transcript });
      };

      recognition.start();
    }
  };

  const saveAsPDF = async () => {
    const element = document.getElementById('calculator');
    if (element) {
      const canvas = await html2canvas(element);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('calculator-history.pdf');
    }
  };

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
            <div className="flex space-x-2">
              <Button
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                variant="secondary"
                isDarkMode={state.isDarkMode}
              >
                {state.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </Button>
              <Button
                onClick={toggleLanguage}
                variant="secondary"
                isDarkMode={state.isDarkMode}
              >
                <Languages size={20} />
              </Button>
            </div>
          </div>

          <Display value={state.display} isDarkMode={state.isDarkMode} />

          <div className="grid grid-cols-4 gap-2 mb-4">
            {['7', '8', '9', '/'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
            {['4', '5', '6', '*'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
            {['1', '2', '3', '-'].map((btn) => (
              <Button
                key={btn}
                onClick={() => dispatch({ type: 'APPEND_NUMBER', payload: btn })}
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
            {['0', '.', '=', '+'].map((btn) => (
              <Button
                key={btn}
                onClick={() =>
                  btn === '='
                    ? dispatch({ type: 'CALCULATE' })
                    : dispatch({ type: 'APPEND_NUMBER', payload: btn })
                }
                isDarkMode={state.isDarkMode}
              >
                {btn}
              </Button>
            ))}
          </div>

          {state.isScientific && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['sin', 'cos', 'tan', 'log'].map((fn) => (
                <Button
                  key={fn}
                  onClick={() => dispatch({ type: 'SET_OPERATION', payload: `${fn}(` })}
                  variant="scientific"
                  isDarkMode={state.isDarkMode}
                >
                  {fn}
                </Button>
              ))}
            </div>
          )}

          <div className="flex justify-between mb-4">
            <Button
              onClick={() => dispatch({ type: 'TOGGLE_SCIENTIFIC' })}
              variant="secondary"
              isDarkMode={state.isDarkMode}
            >
              {state.isScientific ? 'Basic' : 'Scientific'}
            </Button>
            <Button
              onClick={handleVoiceInput}
              variant="secondary"
              isDarkMode={state.isDarkMode}
            >
              {state.isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            <Button
              onClick={saveAsPDF}
              variant="secondary"
              isDarkMode={state.isDarkMode}
            >
              <Save size={20} />
            </Button>
            <Button
              onClick={() => window.print()}
              variant="secondary"
              isDarkMode={state.isDarkMode}
            >
              <Printer size={20} />
            </Button>
          </div>

          <History
            history={state.history}
            onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
            isDarkMode={state.isDarkMode}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App;