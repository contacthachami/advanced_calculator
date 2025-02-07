import { useReducer, useCallback } from 'react';
import { evaluate } from 'mathjs';
import { CalculatorState, CalculatorAction, ScientificOperation } from '../types/calculator';

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

function formatResult(result: number, decimalPlaces: number): string {
  if (Number.isInteger(result)) return result.toString();
  return result.toFixed(decimalPlaces);
}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'APPEND_NUMBER':
      return {
        ...state,
        display: state.display + action.payload,
        error: null,
      };
    case 'SET_OPERATION':
      let operation = action.payload;
      if (operation === 'pi') operation = 'π';
      return {
        ...state,
        display: state.display + operation,
        error: null,
      };
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
        
        return {
          ...state,
          display: formattedResult,
          history: newHistory,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: 'Invalid expression',
        };
      }
    case 'CLEAR':
      return {
        ...state,
        display: '',
        error: null,
      };
    case 'STORE_MEMORY':
      return {
        ...state,
        memory: state.display,
      };
    case 'RECALL_MEMORY':
      return {
        ...state,
        display: state.display + state.memory,
      };
    case 'CLEAR_MEMORY':
      return {
        ...state,
        memory: '',
      };
    case 'TOGGLE_SCIENTIFIC':
      return {
        ...state,
        isScientific: !state.isScientific,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_DECIMAL_PLACES':
      return {
        ...state,
        decimalPlaces: action.payload,
      };
    case 'SET_EXPRESSION':
      return {
        ...state,
        display: action.payload,
        error: null,
      };
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

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

  return {
    state,
    dispatch,
    handleKeyPress,
    handleScientificOperation,
  };
}