import { useReducer, useCallback } from 'react';
import { evaluate } from 'mathjs';
import { CalculatorState, CalculatorAction, ScientificOperation } from '../types/calculator';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

const STORAGE_KEY = 'calculator_state';

const initialState: CalculatorState = {
  display: '',
  history: [],
  memory: '',
  isScientific: false,
  isDarkMode: false,
  isListening: false,
  error: null,
  decimalPlaces: 8,
};

// Load state from localStorage
const loadState = (): Partial<CalculatorState> => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : {};
  } catch (error) {
    console.error('Error loading state:', error);
    return {};
  }
};

function formatResult(result: number, decimalPlaces: number): string {
  if (Number.isInteger(result)) return result.toString();
  return result.toFixed(decimalPlaces);
}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  let newState = state;

  switch (action.type) {
    case 'APPEND_NUMBER':
      newState = {
        ...state,
        display: state.display + action.payload,
        error: null,
      };
      break;
    case 'SET_OPERATION':
      let operation = action.payload;
      if (operation === 'pi') operation = 'π';
      newState = {
        ...state,
        display: state.display + operation,
        error: null,
      };
      break;
    case 'CALCULATE':
      try {
        let expression = state.display
          .replace('π', 'pi')
          .replace('√', 'sqrt')
          .replace('ln', 'log');
        
        const result = evaluate(expression);
        const formattedResult = formatResult(result, state.decimalPlaces);
        
        const newHistory = [
          {
            expression: state.display,
            result: formattedResult,
            timestamp: Date.now(),
          },
          ...state.history,
        ];
        
        newState = {
          ...state,
          display: formattedResult,
          history: newHistory,
          error: null,
        };
      } catch (error) {
        newState = {
          ...state,
          error: 'Invalid expression',
        };
      }
      break;
    case 'CLEAR':
      newState = {
        ...state,
        display: '',
        error: null,
      };
      break;
    case 'STORE_MEMORY':
      newState = {
        ...state,
        memory: state.display,
      };
      break;
    case 'RECALL_MEMORY':
      newState = {
        ...state,
        display: state.display + state.memory,
      };
      break;
    case 'CLEAR_MEMORY':
      newState = {
        ...state,
        memory: '',
      };
      break;
    case 'TOGGLE_SCIENTIFIC':
      newState = {
        ...state,
        isScientific: !state.isScientific,
      };
      break;
    case 'TOGGLE_THEME':
      newState = {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
      break;
    case 'CLEAR_HISTORY':
      newState = {
        ...state,
        history: [],
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
      };
      break;
    case 'SET_DECIMAL_PLACES':
      newState = {
        ...state,
        decimalPlaces: action.payload,
      };
      break;
    case 'SET_EXPRESSION':
      newState = {
        ...state,
        display: action.payload,
        error: null,
      };
      break;
    default:
      return state;
  }

  // Save state to localStorage after each action
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, {
    ...initialState,
    ...loadState(),
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
      dispatch({ type: 'APPEND_NUMBER', payload: key });
    } else if (['+', '-', '*', '/', '(', ')', '^', '.'].includes(key)) {
      dispatch({ type: 'SET_OPERATION', payload: key });
    } else if (key === 'Enter') {
      dispatch({ type: 'CALCULATE' });
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      dispatch({ type: 'CLEAR' });
    }
  }, []);

  const handleScientificOperation = useCallback((operation: ScientificOperation) => {
    let displayOperation = '';
    switch (operation) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
        displayOperation = `${operation}(`;
        break;
      case 'sqrt':
        displayOperation = '√(';
        break;
      case 'pow':
        displayOperation = '^';
        break;
      case 'pi':
        displayOperation = 'π';
        break;
      case 'e':
        displayOperation = 'e';
        break;
    }
    dispatch({ type: 'SET_OPERATION', payload: displayOperation });
  }, []);

  const exportToPDF = useCallback(async () => {
    const element = document.getElementById('calculator');
    if (!element) return;

    try {
      // First try dom-to-image
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        bgcolor: 'transparent',
        style: {
          transform: 'none'
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('calculator-history.pdf');
    } catch (domToImageError) {
      console.warn('dom-to-image failed, falling back to html2canvas:', domToImageError);
      
      try {
        // Fallback to html2canvas
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('calculator');
            if (clonedElement) {
              clonedElement.style.width = `${element.offsetWidth}px`;
              clonedElement.style.height = `${element.offsetHeight}px`;
              clonedElement.style.position = 'relative';
              clonedElement.style.transform = 'none';
            }
          }
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('calculator-history.pdf');
      } catch (error) {
        console.error('Error exporting to PDF:', error);
      }
    }
  }, []);

  const exportToImage = useCallback(async () => {
    const element = document.getElementById('calculator');
    if (!element) return;

    try {
      // First try dom-to-image
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        bgcolor: 'transparent',
        style: {
          transform: 'none'
        }
      });

      const link = document.createElement('a');
      link.download = 'calculator-snapshot.png';
      link.href = dataUrl;
      link.click();
    } catch (domToImageError) {
      console.warn('dom-to-image failed, falling back to html2canvas:', domToImageError);

      try {
        // Fallback to html2canvas
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('calculator');
            if (clonedElement) {
              clonedElement.style.width = `${element.offsetWidth}px`;
              clonedElement.style.height = `${element.offsetHeight}px`;
              clonedElement.style.position = 'relative';
              clonedElement.style.transform = 'none';
            }
          }
        });

        const link = document.createElement('a');
        link.download = 'calculator-snapshot.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error exporting to image:', error);
      }
    }
  }, []);

  return {
    state,
    dispatch,
    handleKeyPress,
    handleScientificOperation,
    exportToPDF,
    exportToImage,
  };
}