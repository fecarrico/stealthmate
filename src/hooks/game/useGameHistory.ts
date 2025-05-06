
import { useCallback } from 'react';
import { GameState } from './types';

export const useGameHistory = (calculateAllSightLines: (board: any[][]) => [number, number][]) => {
  // Undo move
  const undoMove = useCallback((history: GameState[], currentStep: number) => {
    if (currentStep <= 0 || history.length <= 1) return { newStep: currentStep, restoredState: null };
    
    const prevStep = currentStep - 1;
    const prevState = history[prevStep];
    
    if (prevState) {
      const newBoard = JSON.parse(JSON.stringify(prevState.board));
      const newSightLines = calculateAllSightLines(newBoard);
      
      const newGameState: GameState = {
        ...prevState, // Use the entire previous state
        sightLines: newSightLines, // Recalculate sight lines based on the board
      };
      return { newStep: prevStep, restoredState: newGameState };
    }
    return { newStep: currentStep, restoredState: null };
  }, [calculateAllSightLines]);

  // Redo move
  const redoMove = useCallback((gameState: GameState, currentStep: number, history: GameState[]) => {
    if (!gameState || currentStep >= history.length - 1) return gameState;
    
    const nextStep = currentStep + 1;
    const nextState = history[nextStep];
    
    if (nextState) {
      const newBoard = JSON.parse(JSON.stringify(nextState.board));
      const newSightLines = calculateAllSightLines(newBoard); // Recalculate sight lines based on the board
      
      const newGameState: GameState = {
        ...nextState,
        sightLines: newSightLines
      };
      return { newStep: nextStep, restoredState: newGameState };
    }
    return { newStep: currentStep, restoredState: null };
  }, [calculateAllSightLines]);

  // Reset level
  const resetLevel = useCallback((initialState: GameState) => {
    if (!initialState) return initialState;
    
    const newBoard = JSON.parse(JSON.stringify(initialState.board));
    
    const resetState: GameState = {
      ...initialState, // Use the initial state as the base
      board: newBoard,
      playerPosition: [...initialState.playerPosition] as [number, number],
      steps: 0,
      sightLines: calculateAllSightLines(newBoard),
      gameOver: false,
      victory: false,
      message: '',
      history: [initialState],
    };
    
    return resetState;
  }, [calculateAllSightLines]);

  return { undoMove, redoMove, resetLevel };
};
