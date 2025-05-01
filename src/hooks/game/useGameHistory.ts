
import { useCallback } from 'react';
import { GameState } from './types';

export const useGameHistory = (calculateAllSightLines: (board: any[][]) => [number, number][]) => {
  // Undo move
  const undoMove = useCallback((gameState: GameState) => {
    if (!gameState || gameState.history.length <= 1) return gameState;
    
    const prevStep = gameState.history.length - 2;
    const prevState = gameState.history[prevStep];
    
    if (prevState) {
      const newBoard = JSON.parse(JSON.stringify(prevState.board));
      const newSightLines = calculateAllSightLines(newBoard);
      
      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        playerPosition: [...prevState.playerPosition] as [number, number],
        steps: prevState.steps,
        sightLines: newSightLines,
        gameOver: false,
        victory: false,
        message: '',
        history: gameState.history.slice(0, prevStep + 1)
      };
      
      return newGameState;
    }
    
    return gameState;
  }, [calculateAllSightLines]);

  // Redo move
  const redoMove = useCallback((gameState: GameState, currentStep: number, history: GameState[]) => {
    if (!gameState || currentStep >= history.length - 1) return gameState;
    
    const nextStep = currentStep + 1;
    const nextState = history[nextStep];
    
    if (nextState) {
      const newBoard = JSON.parse(JSON.stringify(nextState.board));
      const newSightLines = calculateAllSightLines(newBoard);
      
      return {
        ...nextState,
        sightLines: newSightLines
      };
    }
    
    return gameState;
  }, [calculateAllSightLines]);

  // Reset level
  const resetLevel = useCallback((gameState: GameState) => {
    if (!gameState) return gameState;
    
    const initialState = gameState.history[0];
    const newBoard = JSON.parse(JSON.stringify(initialState.board));
    
    const resetState: GameState = {
      ...gameState,
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
