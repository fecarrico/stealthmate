
import { useState, useEffect, useCallback } from 'react';
import { GameState } from './game/types';
import { useBoard } from './game/useBoard';
import { useScores } from './game/useScores';
import { useLevelManager } from './game/useLevelManager';
import { useGameMoves } from './game/useGameMoves';
import { LevelData } from '../utils/levelData';

// Main game state hook that composes all the other hooks
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { initializeBoard, calculateAllSightLines } = useBoard();
  const { bestScores, totalSteps, saveBestScore, addToTotalSteps, resetTotalSteps } = useScores();
  const { 
    levelComplete, 
    allLevelsComplete, 
    showVictory, 
    loadLevel: loadLevelData, 
    loadCustomLevel: loadCustomLevelData,
    setLevelCompleted,
    setVictoryVisible,
    setAllLevelsComplete,
    checkForCustomLevel
  } = useLevelManager();
  const { movePlayer: processMove, undoMove: processUndo } = useGameMoves(calculateAllSightLines);

  // Initialize game with the first level
  useEffect(() => {
    // Try to load the custom level first
    checkForCustomLevel();
    
    // Load the first level
    loadLevel(1);
  }, []);

  // Load a level
  const loadLevel = useCallback((levelNumber: number) => {
    const newGameState = loadLevelData(levelNumber);
    if (newGameState) {
      setGameState(newGameState);
    }
  }, [loadLevelData]);

  // Load a custom level
  const loadCustomLevel = useCallback((levelData: LevelData) => {
    const newGameState = loadCustomLevelData(levelData);
    setGameState(newGameState);
  }, [loadCustomLevelData]);

  // Move player
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState) return;
    
    const newGameState = processMove(gameState, direction);
    setGameState(newGameState);
    
    // Check if the player has won
    if (newGameState.victory && !gameState.victory) {
      setLevelCompleted(true);
      setVictoryVisible(true);
      saveBestScore(gameState.level, newGameState.steps);
      addToTotalSteps(newGameState.steps);
    }
  }, [gameState, processMove, setLevelCompleted, setVictoryVisible, saveBestScore, addToTotalSteps]);

  // Undo last move
  const undoMove = useCallback(() => {
    if (!gameState) return;
    
    const newGameState = processUndo(gameState);
    setGameState(newGameState);
  }, [gameState, processUndo]);

  // Move to next level
  const nextLevel = useCallback(() => {
    if (!gameState) return;
    
    // If it's a custom level, just reset the same level
    if (gameState.isCustomLevel) {
      resetLevel();
      return;
    }
    
    const nextLevelNumber = gameState.level + 1;
    loadLevel(nextLevelNumber);
  }, [gameState, loadLevel]);

  // Reset current level
  const resetLevel = useCallback(() => {
    if (!gameState) return;
    
    if (gameState.isCustomLevel && gameState.history.length > 0) {
      // Reset to initial state of custom level
      const initialState = gameState.history[0];
      
      setGameState({
        ...gameState,
        board: JSON.parse(JSON.stringify(initialState.board)),
        playerPosition: [...initialState.playerPosition],
        steps: 0,
        sightLines: calculateAllSightLines(initialState.board),
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3, // Reset ninja instinct uses
        history: [initialState],
      });
    } else {
      loadLevel(gameState.level);
    }
    
    setVictoryVisible(false);
  }, [gameState, loadLevel, calculateAllSightLines, setVictoryVisible]);

  // Reset game completely
  const resetGame = useCallback(() => {
    console.log("Resetting game");
    loadLevel(1);
    resetTotalSteps();
    setAllLevelsComplete(false);
    setVictoryVisible(false);
  }, [loadLevel, resetTotalSteps, setAllLevelsComplete, setVictoryVisible]);

  // Close victory popup
  const closeVictory = useCallback(() => {
    setVictoryVisible(false);
  }, [setVictoryVisible]);

  return {
    gameState,
    movePlayer,
    undoMove,
    nextLevel,
    resetLevel,
    resetGame,
    levelComplete,
    allLevelsComplete,
    totalSteps,
    loadCustomLevel,
    bestScores,
    showVictory,
    closeVictory,
    loadLevel
  };
};
