
import { useState, useCallback, useEffect } from 'react';
import { GameState } from './types';
import { useLevelManager } from './useLevelManager';
import { useBoard } from './useBoard';
import { CellType } from '../../utils/levelData';
import { isPlayerDetected, allKingsCaptured } from '../../utils/gameLogic';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [ninjaInstinctAvailable, setNinjaInstinctAvailable] = useState<number>(3);
  const ninjaInstinctCost = 1;
  
  const { calculateAllSightLines } = useBoard();

  // Move player in a direction
  const movePlayer = useCallback((direction: number[]) => {
    if (!gameState || gameState.gameOver || gameState.victory) return;

    const [dRow, dCol] = direction;
    const { board, playerPosition, steps } = gameState;
    const [row, col] = playerPosition;
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check if the move is valid (within board bounds)
    if (newRow < 0 || newRow >= board.length || newCol < 0 || newCol >= board[0].length) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board));
    const targetCell = newBoard[newRow][newCol];

    // Check if the target cell can be moved to
    if (targetCell.type === CellType.EMPTY || targetCell.type === CellType.KING) {
      // Move player
      newBoard[row][col].type = CellType.EMPTY;
      newBoard[newRow][newCol].type = CellType.PLAYER;

      // Calculate new sight lines AFTER the player has moved
      const newSightLines = calculateAllSightLines(newBoard);
      
      // Check if player is detected in their new position
      const detected = isPlayerDetected([newRow, newCol], newSightLines);
      const victory = targetCell.type === CellType.KING || allKingsCaptured(newBoard);

      // Create new game state
      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        playerPosition: [newRow, newCol] as [number, number],
        steps: steps + 1,
        sightLines: newSightLines,
        gameOver: detected,
        victory: victory,
        message: detected ? 'You were spotted!' : (victory ? 'Level Complete!' : ''),
        history: [
          ...gameState.history,
          {
            board: JSON.parse(JSON.stringify(newBoard)),
            playerPosition: [newRow, newCol] as [number, number],
            steps: steps + 1
          }
        ]
      };

      // Add to history
      const newHistory = [...history.slice(0, currentStep + 1), newGameState];
      setHistory(newHistory);
      setCurrentStep(currentStep + 1);
      setGameState(newGameState);
    } 
    // Handle box pushing
    else if (targetCell.type === CellType.BOX) {
      const boxNewRow = newRow + dRow;
      const boxNewCol = newCol + dCol;
      
      // Check if box can be pushed (within bounds)
      if (boxNewRow < 0 || boxNewRow >= board.length || boxNewCol < 0 || boxNewCol >= board[0].length) {
        return;
      }
      
      const boxTargetCell = newBoard[boxNewRow][boxNewCol];
      
      // Check if box can be pushed to target cell
      if (boxTargetCell.type === CellType.EMPTY || 
          boxTargetCell.type === CellType.KING ||
          boxTargetCell.type === CellType.ROOK ||
          boxTargetCell.type === CellType.BISHOP ||
          boxTargetCell.type === CellType.QUEEN) {
        
        // Move player
        newBoard[row][col].type = CellType.EMPTY;
        newBoard[newRow][newCol].type = CellType.PLAYER;
        
        // Push box
        newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
        
        // Calculate new sight lines AFTER both player and box have moved
        const newSightLines = calculateAllSightLines(newBoard);
        
        // Check if player is detected in their new position
        const detected = isPlayerDetected([newRow, newCol], newSightLines);
        const victory = allKingsCaptured(newBoard);
        
        // Create new game state
        const newGameState: GameState = {
          ...gameState,
          board: newBoard,
          playerPosition: [newRow, newCol] as [number, number],
          steps: steps + 1,
          sightLines: newSightLines,
          gameOver: detected,
          victory: victory,
          message: detected ? 'You were spotted!' : (victory ? 'Level Complete!' : ''),
          history: [
            ...gameState.history,
            {
              board: JSON.parse(JSON.stringify(newBoard)),
              playerPosition: [newRow, newCol] as [number, number],
              steps: steps + 1
            }
          ]
        };
        
        // Add to history
        const newHistory = [...history.slice(0, currentStep + 1), newGameState];
        setHistory(newHistory);
        setCurrentStep(currentStep + 1);
        setGameState(newGameState);
      }
    }
  }, [gameState, history, currentStep, calculateAllSightLines]);

  // Reset level
  const resetLevel = useCallback(() => {
    if (!gameState) return;
    
    const initialState = gameState.history[0];
    
    const resetState: GameState = {
      ...gameState,
      board: JSON.parse(JSON.stringify(initialState.board)),
      playerPosition: [...initialState.playerPosition] as [number, number],
      steps: 0,
      sightLines: calculateAllSightLines(initialState.board),
      gameOver: false,
      victory: false,
      message: '',
      history: [initialState],
    };
    
    setGameState(resetState);
    setHistory([resetState]);
    setCurrentStep(0);
  }, [gameState, calculateAllSightLines]);

  // Undo move
  const undoMove = useCallback(() => {
    if (!gameState || currentStep <= 0) return;
    
    const prevStep = currentStep - 1;
    const prevState = history[prevStep];
    
    if (prevState) {
      setGameState(prevState);
      setCurrentStep(prevStep);
    }
  }, [gameState, history, currentStep]);

  // Redo move
  const redoMove = useCallback(() => {
    if (!gameState || currentStep >= history.length - 1) return;
    
    const nextStep = currentStep + 1;
    const nextState = history[nextStep];
    
    if (nextState) {
      setGameState(nextState);
      setCurrentStep(nextStep);
    }
  }, [gameState, history, currentStep]);

  // Get hint for current level
  const getHint = useCallback(async () => {
    // This is a simplified hint system that just suggests a path
    // A real implementation would need to calculate an optimal path
    if (!gameState) return null;
    
    // Mock hint calculation (in real game this would use pathfinding)
    // For simplicity, let's just return a series of random moves
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1]   // right
    ];
    
    const moves = [];
    for (let i = 0; i < 3; i++) {
      moves.push(directions[Math.floor(Math.random() * directions.length)]);
    }
    
    return { moves };
  }, [gameState]);

  // Check if can undo
  const canUndo = currentStep > 0;
  
  // Check if can redo
  const canRedo = history.length > 0 && currentStep < history.length - 1;
  
  // Check if game is over
  const isGameOver = gameState?.gameOver || false;
  
  // Check if victory
  const isVictory = gameState?.victory || false;

  return {
    gameState,
    movePlayer,
    resetLevel,
    undoMove,
    redoMove,
    canUndo,
    canRedo,
    getHint,
    ninjaInstinctCost,
    ninjaInstinctAvailable,
    setNinjaInstinctAvailable,
    isGameOver,
    isVictory,
  };
};
