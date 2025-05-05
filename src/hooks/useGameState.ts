
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
  const { 
    bestScores, 
    totalSteps, 
    saveBestScore, 
    addToTotalSteps, 
    resetTotalSteps, 
    isLevelCompleted,
    isLevelUnlocked,
    resetAllProgress
  } = useScores();
  const { 
    levelComplete, 
    allLevelsComplete, 
    showVictory, 
    loadLevel: loadLevelData, 
    loadCustomLevel: loadCustomLevelData,
    getLevels,
    setLevelCompleted,
    setVictoryVisible,
    setAllLevelsComplete,
    checkForCustomLevel
  } = useLevelManager();
  const { movePlayer: processMove, undoMove: processUndo } = useGameMoves(calculateAllSightLines);

  // Load a level
  const loadLevel = useCallback((levelNumber: number) => {
    console.log('useGameState: loadLevel called with levelNumber:', levelNumber);
    const newGameState = loadLevelData(levelNumber);
    console.log("useGameState: newGameState", newGameState);
    if (newGameState) {
      setGameState(newGameState);
    }
  }, [loadLevelData]);

  // Load a custom level
  const loadCustomLevel = useCallback((
    levelData: LevelData
  ) => {
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
    closeVictory();
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
      // Load the same level again but maintain best score
      loadLevel(gameState.level);
    }
    
    setVictoryVisible(false);
  }, [gameState, loadLevel, calculateAllSightLines, setVictoryVisible]);

  // Reset game completely
  const resetGame = useCallback(() => {
    console.log("Resetting game");
    setGameState(null)
    resetTotalSteps();
    setAllLevelsComplete(false);
    setVictoryVisible(false);
    setLevelCompleted(false);
  }, [resetTotalSteps, setAllLevelsComplete, setVictoryVisible]);

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
    getLevels,
    showVictory,
    closeVictory,
    loadLevel,
    isLevelCompleted,
    isLevelUnlocked,
    resetAllProgress
  };
};
