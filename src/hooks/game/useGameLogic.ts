
import { useState, useCallback, useEffect } from 'react';
import { GameState } from './types'; 
import { useLevelManager } from './useLevelManager';
import { useBoard } from './useBoard';
import { usePlayerMovement } from './usePlayerMovement';
import { useGameHistory } from './useGameHistory';
import { LevelData } from '../../utils/levelData';
import { toast } from '@/components/ui/sonner';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const { loadInitialLevel } = useLevelManager();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSightLines, setShowSightLines] = useState<boolean>(false);
  const [ninjaInstinctAvailable, setNinjaInstinctAvailable] = useState<number>(3);
  
  const { calculateAllSightLines } = useBoard();
  const { movePlayer: processMove } = usePlayerMovement(calculateAllSightLines);
  const { undoMove: processUndo, redoMove: processRedo, resetLevel: processReset } = useGameHistory(calculateAllSightLines);
  const { loadLevel, loadCustomLevel } = useLevelManager();

  // Initialize game with a level number or custom level data
  const initializeGame = useCallback(async (levelDataOrNumber: number | LevelData, isCustom: boolean = false) => {
    try {
      let initialGameState: GameState | null = null;
      
      if (isCustom) {
        // Custom level is passed as a LevelData object
        const levelData = levelDataOrNumber as LevelData;
        initialGameState = loadCustomLevel(levelData);
      } else {
        // Standard level is passed as a number
        const levelNumber = levelDataOrNumber as number;
        initialGameState = loadLevel(levelNumber);
      }
      
      if (!initialGameState) {
        console.error("Failed to initialize game state");
        return false;
      }
      
      setGameState(initialGameState);
      setHistory([initialGameState]);
      setCurrentStep(0);
      setNinjaInstinctAvailable(3); // Reset ninja instinct for new level
      return true;
    } catch (error) {
      console.error("Error initializing game:", error);
      return false;
    }
  }, [loadLevel, loadCustomLevel]);

  // Move player in a direction
  const movePlayer = useCallback((direction: [number, number]) => {
    if (!gameState) return;

    // Create updated game state with current sight line visibility
    const updatedGameState = {
      ...gameState,
      showSightLines: showSightLines
    };
    
    const newGameState = processMove(direction, updatedGameState);
    
    if (newGameState !== gameState) {
      // Handle ninja instinct usage when moving with sight lines visible
      if (showSightLines && ninjaInstinctAvailable > 0) {
        setNinjaInstinctAvailable(prev => prev - 1);
        
        // Update the game state with the new ninja instinct count
        newGameState.ninjaInstinct = ninjaInstinctAvailable - 1;
      }
      
      setGameState(newGameState);
      setHistory([...history.slice(0, currentStep + 1), newGameState]);
      setCurrentStep(currentStep + 1);
      
      // Turn off sight lines after moving
      setShowSightLines(false);
    }
  }, [gameState, history, currentStep, processMove, showSightLines, ninjaInstinctAvailable]);

  // Reset level
  const resetLevel = useCallback(() => {
    if (!gameState) return;
    
    const resetState = processReset(gameState);
    setGameState(resetState);
    setHistory([resetState]);
    setCurrentStep(0);
    setNinjaInstinctAvailable(3); // Reset Ninja Instinct uses on level reset
    setShowSightLines(false);
  }, [gameState, processReset]);

  // Undo move
  const undoMove = useCallback(() => {
    if (!gameState || currentStep <= 0) return;
    
    const prevStep = currentStep - 1;
    const prevGameState = history[prevStep];
    
    setGameState(prevGameState);
    setCurrentStep(prevStep);
  }, [gameState, currentStep, history]);

  // Redo move
  const redoMove = useCallback(() => {
    if (!gameState || currentStep >= history.length - 1) return;
    
    const nextStep = currentStep + 1;
    const nextGameState = history[nextStep];
    
    setGameState(nextGameState);
    setCurrentStep(nextStep);
  }, [gameState, history, currentStep]);

  // Toggle ninja instinct sight lines
  const toggleSightLines = useCallback((show: boolean) => {
    // Only allow toggling if we have ninja instinct charges remaining
    if (ninjaInstinctAvailable > 0 || !show) {
      setShowSightLines(show);
    }
  }, [ninjaInstinctAvailable]);

  useEffect(() => {
    loadInitialLevel(1, setGameState);
  }, [loadInitialLevel]);

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
    ninjaInstinctAvailable,
    showSightLines,
    toggleSightLines,
    isGameOver,
    isVictory,
    initializeGame,
  };
};
