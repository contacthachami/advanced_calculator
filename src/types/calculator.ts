export interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  display: string;
  history: CalculationHistory[];
  memory: string;
  isScientific: boolean;
  isDarkMode: boolean;
  isListening: boolean;
  error: string | null;
  decimalPlaces: number;
}

export type CalculatorAction =
  | { type: 'APPEND_NUMBER'; payload: string }
  | { type: 'SET_OPERATION'; payload: string }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'STORE_MEMORY' }
  | { type: 'RECALL_MEMORY' }
  | { type: 'CLEAR_MEMORY' }
  | { type: 'TOGGLE_SCIENTIFIC' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DECIMAL_PLACES'; payload: number }
  | { type: 'SET_EXPRESSION'; payload: string };

export type ScientificOperation = 
  | 'sin' 
  | 'cos' 
  | 'tan' 
  | 'log' 
  | 'ln' 
  | 'sqrt' 
  | 'pow' 
  | 'pi' 
  | 'e';