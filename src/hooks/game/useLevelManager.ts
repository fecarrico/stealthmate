
import { useState, useCallback, useEffect } from 'react';
import levels from '../../levels/levels';
import { LevelData } from '../../utils/levelData';
import { getCustomLevelFromCode } from '../../utils/levelHelper';
import { useBoard } from './useBoard';
import { GameState } from './types';

// Hook for managing game levels
export const useLevelManager = () => {
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const levelsData = levels;
  
  const { initializeBoard, calculateAllSightLines } = useBoard();
  
  // Get all levels
  const getLevels = useCallback((): LevelData[] => {
    return levelsData;
  }, [levelsData]);
  
  // Load level
  const loadLevel = useCallback(
    (levelNumber: number) => {
      console.log('useLevelManager: loadLevel called with levelNumber:', levelNumber);
      const levelData = levelsData[levelNumber - 1];
      console.log("useLevelManager: levelData", levelData);
      
      if (!levelData) {
        console.error(`Level ${levelNumber} not found`);
        setAllLevelsComplete(true);
        return null;
      }

      try {
          const board = initializeBoard(levelData);
          if (!board) {
            console.error('Failed to initialize board for level', levelNumber);
            return null;
          }
          
          const sightLines = calculateAllSightLines(board);
          
          const gameState: GameState = {
            level: levelNumber,
            board,
            playerPosition: [...levelData.playerStart] as [number, number],
            steps: 0,
            sightLines,
            gameOver: false,
            victory: false,
            message: "",
            ninjaInstinct: 1,
            levelName: levelData.name || `Level ${levelNumber}`,
            history:[
              {
                board: JSON.parse(JSON.stringify(board)),
                playerPosition: [...levelData.playerStart] as [number, number],
                steps: 0
              }
            ],
          };
          return gameState;
      } catch (error) {
        console.error(`Error loading level ${levelNumber}:`, error);
        return null;
      }
    },
    [initializeBoard, calculateAllSightLines, levelsData]
  );
  
  // Load a custom level
  const loadCustomLevel = useCallback(
    (levelData: LevelData) => {
      try {
        console.log('useLevelManager: loadCustomLevel called with level:', levelData);
        
        if (!levelData.playerStart) {
          console.error('Custom level missing player start position');
          return null;
        }
        
        if (!levelData.kings || levelData.kings.length === 0) {
          console.error('Custom level must have at least one king');
          return null;
        }
        
        // Ensure enemies and boxes arrays exist
        levelData.enemies = levelData.enemies || [];
        levelData.boxes = levelData.boxes || [];
        
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
      console.log("Attempting to load custom level");
      const customLevel = getCustomLevelFromCode("");
      
      if (customLevel) {
        console.log("Custom level loaded successfully:", customLevel);
        // Replace the first level with the custom level
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
    getLevels,
    checkForCustomLevel
  }
};
