import { useReducer, useCallback } from 'react';
import { evaluate } from 'mathjs';
import { CalculatorState, CalculatorAction } from '../types/calculator';

const initialState: CalculatorState = {
  display: '',
  history: [],
  memory: '',
  isScientific: false,
  isDarkMode: false,
  isListening: false,
  error: null,
  decimalPlaces: 0,
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'APPEND_NUMBER':
      return {
        ...state,
        display: state.display + action.payload,
        error: null,
      };
    case 'SET_OPERATION':
      return {
        ...state,
        display: state.display + action.payload,
        error: null,
      };
    case 'CALCULATE':
      try {
        const result = Math.floor(evaluate(state.display));
        const newHistory = [
          {
            expression: state.display,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...state.history,
        ];
        return {
          ...state,
          display: result.toString(),
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
    } else if (['+', '-', '*', '/', '(', ')', '^'].includes(key)) {
      dispatch({ type: 'SET_OPERATION', payload: key });
    } else if (key === 'Enter') {
      dispatch({ type: 'CALCULATE' });
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      dispatch({ type: 'CLEAR' });
    }
  }, []);

  return {
    state,
    dispatch,
    handleKeyPress,
  };
}