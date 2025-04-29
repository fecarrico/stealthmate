
import { useState, useCallback } from 'react';
import levels, { LevelData } from '../../utils/levelData';
import { getCustomLevelFromCode } from '../../utils/levelHelper';
import { useBoard } from './useBoard';
import { GameState } from './types';

// Hook for managing game levels
export const useLevelManager = () => {
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const { initializeBoard, calculateAllSightLines } = useBoard();

  // Load level
  const loadLevel = useCallback(
    (levelNumber: number): GameState | null => {
      const levelData = levels.find((level) => level.id === levelNumber);
      
      if (!levelData) {
        console.error(`Level ${levelNumber} not found`);
        setAllLevelsComplete(true);
        return null;
      }
      
      try {
        const board = initializeBoard(levelData);
        const sightLines = calculateAllSightLines(board);
        
        const gameState: GameState = {
          level: levelNumber,
          board,
          playerPosition: [...levelData.playerStart] as [number, number],
          steps: 0,
          sightLines,
          gameOver: false,
          victory: false,
          message: '',
          ninjaInstinct: 3,
          levelName: levelData.name || `Level ${levelNumber}`,
          history: [
            {
              board: JSON.parse(JSON.stringify(board)),
              playerPosition: [...levelData.playerStart] as [number, number],
              steps: 0,
            },
          ],
        };
        
        setLevelComplete(false);
        setShowVictory(false);
        console.log(`Level ${levelNumber} loaded successfully`);
        return gameState;
      } catch (error) {
        console.error(`Error loading level ${levelNumber}:`, error);
        return null;
      }
    },
    [initializeBoard, calculateAllSightLines]
  );

  // Load a custom level
  const loadCustomLevel = useCallback(
    (levelData: LevelData): GameState => {
      const board = initializeBoard(levelData);
      const sightLines = calculateAllSightLines(board);
      
      const gameState: GameState = {
        level: levelData.id,
        board,
        playerPosition: levelData.playerStart,
        steps: 0,
        sightLines,
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3,
        levelName: levelData.name || `Custom Level`,
        isCustomLevel: true,
        history: [
          {
            board: JSON.parse(JSON.stringify(board)),
            playerPosition: [...levelData.playerStart] as [number, number],
            steps: 0,
          },
        ],
      };
      
      setLevelComplete(false);
      setShowVictory(false);
      setAllLevelsComplete(false);
      return gameState;
    },
    [initializeBoard, calculateAllSightLines]
  );

  // Set level complete
  const setLevelCompleted = useCallback((isComplete: boolean) => {
    setLevelComplete(isComplete);
  }, []);

  // Set show victory
  const setVictoryVisible = useCallback((isVisible: boolean) => {
    setShowVictory(isVisible);
  }, []);

  // Check if custom level from code exists
  const checkForCustomLevel = useCallback(() => {
    try {
      const customLevelCode = "eyJpZCI6MTc0NTk1MTkxMjI0NywibmFtZSI6IkN1c3RvbSBMZXZlbCIsInNpemUiOls1LDVdLCJwbGF5ZXJTdGFydCI6WzAsMF0sImtpbmdzIjpbWzQsNF1dLCJlbmVtaWVzIjpbeyJ0eXBlIjoiYmlzaG9wIiwicG9zaXRpb24iOlswLDRdfSx7InR5cGUiOiJiaXNob3AiLCJwb3NpdGlvbiI6WzQsMF19XSwiYm94ZXMiOltbMiwxXSxbMSwyXV19";
      console.log("Attempting to load custom level");
      const customLevel = getCustomLevelFromCode(customLevelCode);
      
      if (customLevel) {
        console.log("Custom level loaded successfully:", customLevel);
        // Replace the first level with the custom level
        levels[0] = customLevel;
      } else {
        console.error("Failed to load custom level from code");
      }
    } catch (error) {
      console.error("Error loading custom level:", error);
    }
  }, []);

  return {
    levelComplete,
    allLevelsComplete,
    showVictory,
    loadLevel,
    loadCustomLevel,
    setLevelCompleted,
    setVictoryVisible,
    setAllLevelsComplete,
    checkForCustomLevel
  };
};
