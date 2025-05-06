
import { useState, useCallback, useEffect } from 'react';
import { tutorialLevels, regularLevels, masterLevelSequence, getLevelById } from '../../levels/levels';
import { LevelData, PlayerStart } from '../../utils/levelData';
import { useBoard } from './useBoard';
import { GameState } from './types';

// Hook for managing game levels
export const useLevelManager = () => {
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  
  const { initializeBoard, calculateAllSightLines } = useBoard();  
  
  const getLevels = useCallback((): LevelData[] => {   
    return [...tutorialLevels, ...regularLevels];
  }, []);
  
  const getNextLevelNumber = useCallback((currentLevelId: number | string): number | undefined => {
    // Ensure currentLevelId is a number for masterLevelSequence lookup
    const currentIdNum = typeof currentLevelId === 'string' ? parseInt(currentLevelId, 10) : currentLevelId;

    const currentIndex = masterLevelSequence.indexOf(currentIdNum);

    // If current level found and there's a next one in the sequence
    if (currentIndex !== -1 && currentIndex < masterLevelSequence.length - 1) {
      return masterLevelSequence[currentIndex + 1];
    }
    
    // No next level found (end of game for regular levels)
    return undefined;
  }, []);

  const loadLevel = useCallback((
    levelNumber: number
  ) => {
    try {
      // First try to find the level by exact ID
      let levelData = getLevelById(levelNumber);
      
      if (!levelData) {
        console.error(`useLevelManager: Level ${levelNumber} not found`);
        setAllLevelsComplete(true);
        return null;
      }

      const board = initializeBoard(levelData);
      if (!board) {
        console.error('Failed to initialize board for level', levelNumber);
        return null;
      }
      
      const sightLines = calculateAllSightLines(board);
      const gameState: GameState = {
        level: levelNumber,
        board: JSON.parse(JSON.stringify(board)), // Deep copy the board
        playerPosition: [...levelData.playerStart] as [number, number],
        steps: 0,
        sightLines,
        gameOver: false,
        victory: false,
        message: "",
        ninjaInstinct: 3,
        history:[
          // history will be added in useGameLogic after initialization
        ],
      };
      
      return gameState;
    } catch (error) {
      console.error(`Error loading level ${levelNumber}:`, error);
      return null;
    }
  }, [initializeBoard, calculateAllSightLines]);
  
  const loadInitialLevel = useCallback((
    levelNumber: number, 
    setGameState: (gameState: GameState) => void
  ) => {
    const gameState = loadLevel(levelNumber);
    if (gameState && setGameState) {
      setGameState(gameState);
    }
  }, [loadLevel]);

  const loadCustomLevel = useCallback((
    levelData: LevelData
  ) => {
    try {
      const board = initializeBoard(levelData);
      if (!board) {
        console.error('Failed to initialize board for custom level');
        return null;
      }
      
      const sightLines = calculateAllSightLines(board);

      const gameState: GameState = {
        level: levelData.level || levelData.id || 0,
        board,
        playerPosition: [...levelData.playerStart] as [number, number],
        steps: 0,
        sightLines,
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3,
        levelName: levelData.name || "Custom Level",
        isCustomLevel: true,
        history: [
          {
            board: JSON.parse(JSON.stringify(board)),
            playerPosition: [...levelData.playerStart] as [number, number],
            steps: 0
          }
        ]
      };

      return gameState;
    } catch (error) {
      console.error('Error loading custom level:', error);
      return null;
    }
  }, [initializeBoard, calculateAllSightLines]);

  // Set level complete
  const setLevelCompleted = useCallback((isComplete: boolean) => {
    setLevelComplete(isComplete);
  }, []);

  // Set show victory
  const setVictoryVisible = useCallback((isVisible: boolean) => {
    setShowVictory(isVisible);
  }, []);

  return {
    levelComplete,
    allLevelsComplete,
    showVictory,
    loadLevel,
    loadInitialLevel,
    loadCustomLevel,
    setLevelCompleted,
    setVictoryVisible,
    setAllLevelsComplete,
    getLevels, // Keep getLevels if it's used elsewhere for a different purpose (e.g., level selection screen)
    getNextLevelNumber
  }
};
