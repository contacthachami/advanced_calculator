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
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'APPEND_NUMBER':
      return {
        ...state,
        display: state.display + action.payload,
      };
    case 'SET_OPERATION':
      return {
        ...state,
        display: state.display + action.payload,
      };
    case 'CALCULATE':
      try {
        const result = evaluate(state.display).toString();
        const newHistory = [
          {
            expression: state.display,
            result,
            timestamp: Date.now(),
          },
          ...state.history,
        ];
        return {
          ...state,
          display: result,
          history: newHistory,
        };
      } catch (error) {
        return {
          ...state,
          display: 'Error',
        };
      }
    case 'CLEAR':
      return {
        ...state,
        display: '',
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
    } else if (['+', '-', '*', '/', '.'].includes(key)) {
      dispatch({ type: 'SET_OPERATION', payload: key });
    } else if (key === 'Enter') {
      dispatch({ type: 'CALCULATE' });
    } else if (key === 'Escape') {
      dispatch({ type: 'CLEAR' });
    }
  }, []);

  return {
    state,
    dispatch,
    handleKeyPress,
  };
}