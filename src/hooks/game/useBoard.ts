
import { useCallback } from 'react';
import { LevelData, GameCell, CellType } from '@/utils/levelData';
import { calculateLineOfSight } from '@/utils/gameLogic';

export const useBoard = () => {
  // Initialize game board from level data
  const initializeBoard = useCallback((levelData: LevelData): GameCell[][] | null => {
    try {
      const boardSize = levelData.boardSize || 
                      (levelData.board ? levelData.board.length : 
                      Math.max(7, Math.max(
                        levelData.playerStart ? levelData.playerStart[0] : 0,
                        levelData.playerStart ? levelData.playerStart[1] : 0
                      ) + 1));
      
      // Create empty board with all cells as EMPTY
      const board: GameCell[][] = Array.from(
        { length: boardSize },
        (_, row) => Array.from(
          { length: boardSize },
          (_, col) => ({
            type: CellType.EMPTY,
            position: [row, col] as [number, number],
          })
        )
      );
      
      // Place player
      const [playerRow, playerCol] = levelData.playerStart;
      if (playerRow >= 0 && playerRow < boardSize && playerCol >= 0 && playerCol < boardSize) {
        board[playerRow][playerCol].type = CellType.PLAYER;
      }
      
      // Place kings if present
      if (levelData.kings && levelData.kings.length > 0) {
        levelData.kings.forEach(([kingRow, kingCol]) => {
          if (kingRow >= 0 && kingRow < boardSize && kingCol >= 0 && kingCol < boardSize) {
            board[kingRow][kingCol].type = CellType.KING;
          }
        });
      }
      
      // Place enemies if present
      if (levelData.enemies && levelData.enemies.length > 0) {
        levelData.enemies.forEach((enemy) => {
          const [enemyRow, enemyCol] = enemy.position;
          if (enemyRow >= 0 && enemyRow < boardSize && enemyCol >= 0 && enemyCol < boardSize) {
            board[enemyRow][enemyCol].type = enemy.type;
          }
        });
      }
      
      // Place boxes if present
      if (levelData.boxes && levelData.boxes.length > 0) {
        levelData.boxes.forEach(([boxRow, boxCol]) => {
          if (boxRow >= 0 && boxRow < boardSize && boxCol >= 0 && boxCol < boardSize) {
            board[boxRow][boxCol].type = CellType.BOX;
          }
        });
      }
      
      // Place holes if present
      if (levelData.holes && levelData.holes.length > 0) {
        levelData.holes.forEach(([holeRow, holeCol]) => {
          if (holeRow >= 0 && holeRow < boardSize && holeCol >= 0 && holeCol < boardSize) {
            board[holeRow][holeCol].type = CellType.HOLE;
          }
        });
      }
      
      return board;
    } catch (error) {
      console.error('Error initializing board:', error);
      return null;
    }
  }, []);

  // Calculate sight lines for all enemies
  const calculateAllSightLines = useCallback((board: GameCell[][]) => {
    let allSightLines: [number, number][] = [];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = board[row][col];
        
        // Add sight lines for each enemy type
        if (cell.type === CellType.ROOK || 
            cell.type === CellType.BISHOP || 
            cell.type === CellType.QUEEN ||
            cell.type === CellType.KNIGHT ||
            cell.type === CellType.PAWN) {
          const sightLines = calculateLineOfSight(board, cell.type, [row, col]);
          allSightLines = [...allSightLines, ...sightLines];
        }
      }
    }
    
    return allSightLines;
  }, []);
  
  return {
    initializeBoard,
    calculateAllSightLines
  };
};
