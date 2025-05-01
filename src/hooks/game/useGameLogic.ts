
import { useState, useCallback } from 'react';
import { GameState } from './types';
import { useLevelManager } from './useLevelManager';
import { useBoard } from './useBoard';
import { usePlayerMovement } from './usePlayerMovement';
import { useGameHistory } from './useGameHistory';
import { useHintSystem } from './useHintSystem';
import { LevelData } from '../../utils/levelData';
import { toast } from '@/components/ui/sonner';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [ninjaInstinctAvailable, setNinjaInstinctAvailable] = useState<number>(3);
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const [hintMoves, setHintMoves] = useState<number[][]>([]);
  
  const ninjaInstinctCost = 1;
  
  const { calculateAllSightLines } = useBoard();
  const { movePlayer: processMove } = usePlayerMovement(calculateAllSightLines);
  const { undoMove: processUndo, redoMove: processRedo, resetLevel: processReset } = useGameHistory(calculateAllSightLines);
  const { getHint: processGetHint } = useHintSystem();
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
      setShowHint(false);
      setHintStep(0);
      setHintMoves([]);
      return true;
    } catch (error) {
      console.error("Error initializing game:", error);
      return false;
    }
  }, [loadLevel, loadCustomLevel]);

  // Move player in a direction
  const movePlayer = useCallback((direction: number[]) => {
    if (!gameState) return;

    const newGameState = processMove(direction, gameState);
    
    if (newGameState !== gameState) {
      setGameState(newGameState);
      setHistory([...history.slice(0, currentStep + 1), newGameState]);
      setCurrentStep(currentStep + 1);
    }
  }, [gameState, history, currentStep, processMove]);

  // Reset level
  const resetLevel = useCallback(() => {
    if (!gameState) return;
    
    const resetState = processReset(gameState);
    setGameState(resetState);
    setHistory([resetState]);
    setCurrentStep(0);
    setShowHint(false);
    setHintStep(0);
    setHintMoves([]);
    setNinjaInstinctAvailable(3); // Reset Ninja Instinct uses on level reset
  }, [gameState, processReset]);

  // Undo move
  const undoMove = useCallback(() => {
    if (!gameState || currentStep <= 0) return;
    
    const prevGameState = processUndo(gameState);
    setGameState(prevGameState);
    setCurrentStep(currentStep - 1);
  }, [gameState, currentStep, processUndo]);

  // Redo move
  const redoMove = useCallback(() => {
    if (!gameState || currentStep >= history.length - 1) return;
    
    const nextGameState = processRedo(gameState, currentStep, history);
    setGameState(nextGameState);
    setCurrentStep(currentStep + 1);
  }, [gameState, history, currentStep, processRedo]);

  // Get hint for current level
  const getHint = useCallback(async () => {
    if (!gameState) return null;
    
    const hint = await processGetHint(gameState);
    if (hint && hint.moves) {
      setHintMoves(hint.moves);
      return hint;
    }
    return null;
  }, [gameState, processGetHint]);

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
    showHint,
    setShowHint,
    hintStep,
    setHintStep,
    hintMoves,
    initializeGame,
  };
};
