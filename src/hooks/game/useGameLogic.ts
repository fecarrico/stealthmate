import { useState, useCallback, useEffect } from 'react';
import { GameState } from './types'; 
import { useLevelManager } from './useLevelManager';
import { useBoard } from './useBoard';
import { usePlayerMovement } from './usePlayerMovement';
import { useGameHistory } from './useGameHistory';
import { LevelData } from '../../utils/levelData';
import { toast } from '@/components/ui/sonner';
import { useScores } from './useScores';
import { masterLevelSequence } from '@/levels/levels';
export const useGameLogic = () => {
 const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const levelManager = useLevelManager();
  const { loadInitialLevel, getNextLevelNumber } = levelManager;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const scores = useScores();
  const [showSightLines, setShowSightLines] = useState<boolean>(false);
  const [ninjaInstinctAvailable, setNinjaInstinctAvailable] = useState<number>(3); 
  const [showFinalVictoryPopup, setShowFinalVictoryPopup] = useState<boolean>(false);
 const [lives, setLives] = useState<number>(3);
 const [isGameOver, setIsGameOver] = useState<boolean>(false);
 const [initialLevelData, setInitialLevelData] = useState<number | LevelData | null>(null);
 const [isCustomLevel, setIsCustomLevel] = useState<boolean>(false);

  const { calculateAllSightLines } = useBoard();
  const { movePlayer: processMove } = usePlayerMovement(calculateAllSightLines);
  const { undoMove: processUndo, redoMove: processRedo, resetLevel: resetLevelFromHistory } = useGameHistory(calculateAllSightLines);
  const { loadLevel, loadCustomLevel, getLevels } = useLevelManager();

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

      // Store the initial level data and type
      setInitialLevelData(levelDataOrNumber);
      setIsCustomLevel(isCustom);
      
      setGameState(initialGameState);
      setHistory([initialGameState]);
      setCurrentStep(0);
      setNinjaInstinctAvailable(3); // Reset ninja instinct for new level
      setShowFinalVictoryPopup(false); // Hide popup final when loading new level
      setLives(3); // Reset lives for new level
      setIsGameOver(false); // Reset game over state
      return true;
 } catch (error) {
      console.error("Error initializing game:", error); // Added error logging
      return false;
    }
  }, [loadLevel, loadCustomLevel]);

  // Move player in a direction
 const movePlayer = useCallback((direction: [number, number]) => {
    if (!gameState || isGameOver) return;

 // Create updated game state with current sight line visibility
    const updatedGameState = {
      ...gameState,
      showingNinjaInstinct: showSightLines
    };
    
    const newGameState = processMove(direction, updatedGameState);
    
    if (newGameState !== gameState) {
      // Handle ninja instinct usage when moving with sight lines visible
 if (showSightLines && ninjaInstinctAvailable > 0) {
        setNinjaInstinctAvailable(prev => prev - 1);

 // Update the game state with the new ninja instinct count
        newGameState.ninjaInstinct = ninjaInstinctAvailable - 1;
      }
      
      // Handle detection and lives
      if (newGameState.gameOver && !gameState.gameOver) {
        // Player was spotted, reduce lives
        const newLives = lives - 1;
 setLives(newLives);

        if (newLives <= 0) {
 // Game over when no more lives
          setIsGameOver(true);
        } else {
          // Still have lives, allow continuing with undo
          toast.error(`Spotted! ${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining`);
          // Note: We keep gameOver as true so player must undo to continue
        }
      }
      
 setGameState(newGameState);
 setHistory([...history.slice(0, currentStep + 1), newGameState]);
 setCurrentStep(currentStep + 1);

      // Turn off sight lines after moving
      setShowSightLines(false);
    }
  }, [gameState, history, currentStep, processMove, showSightLines, ninjaInstinctAvailable, lives, isGameOver]);

 // Undo move (uses game history)
 const undoMove = useCallback(() => {
    console.log('undoMove called - Start', { gameState, history, currentStep });
    if (!gameState || currentStep <= 0) return;

    const { newStep, restoredState } = processUndo(history, currentStep);

    if (restoredState) {
      setGameState(restoredState);
      setCurrentStep(newStep);
    }
 }, [gameState, currentStep, history, processUndo]);
 
 const resetLevel = useCallback(() => { // This function is called by the "Try Again" button
    console.log('resetLevel called - Start', { gameState, history, currentStep });
    // Use initializeGame to reset the level
    if (initialLevelData !== null) {
      initializeGame(initialLevelData, isCustomLevel);
    } else {
      console.error("Cannot reset level: Initial level data is not available.");
    }
    setCurrentStep(0);
  }, [initialLevelData, isCustomLevel, initializeGame]); // Update dependencies

 const redoMove = useCallback(() => {
 if (!gameState || currentStep >= history.length - 1 || history.length <= 1) return;

 const nextStep = currentStep + 1;
    const restoredState = processRedo(gameState, currentStep, history); // Use the redo function from useGameHistory
 setGameState(restoredState);
 setCurrentStep(nextStep);
 }, [gameState, history, currentStep, processRedo]); // Add processRedo as a dependency

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

  // Handle level victory
  useEffect(() => {
    if (gameState?.victory && !gameState?.isCustomLevel) {
 // Save best score
      scores.saveBestScore(gameState.level, gameState.steps);

      // Unlock next level
      const nextLevelNumber = levelManager.getNextLevelNumber(gameState.level);
      if (nextLevelNumber !== undefined) {
        scores.unlockLevel(nextLevelNumber);
      } else {
        // If no next level number, it means the player has completed all levels in the sequence
        setShowFinalVictoryPopup(true);
      }
    }
  }, [
    gameState?.victory,
    gameState?.level,
    gameState?.steps,
    gameState?.isCustomLevel,
    scores.completedLevels, // Add completedLevels as a dependency
    scores.saveBestScore, // Use specific function from scores
    scores.unlockLevel, // Use specific function from scores    
 levelManager.getNextLevelNumber, // Use specific function from levelManager
  ]);

  // Check if can undo
  const canUndo = currentStep > 0;

  // Check if can redo
  const canRedo = history.length > 0 && currentStep < history.length - 1;

 return {
    gameState,
    movePlayer,
 resetLevel,
    undoMove: undoMove,
    redoMove: redoMove,
    canUndo,
    canRedo,
    ninjaInstinctAvailable,
    showSightLines,
    toggleSightLines,
    isGameOver: gameState?.gameOver || false,
    isVictory: gameState?.victory || false,
 initializeGame,
    showFinalVictoryPopup,
    lives,
    gameOverState: isGameOver
  };
};
