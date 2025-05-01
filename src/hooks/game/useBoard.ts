
import { useState, useCallback } from 'react';
import { LevelData, CellType, GameCell } from '../../utils/levelData';

// Hooks for board operations

export const useBoard = () => {
  const BOARD_SIZE = 5;
  // Initialize the board from level data
  const initializeBoard = useCallback((levelData: LevelData): GameCell[][] => {
    console.log('useBoard: initializeBoard called with levelData:', levelData);
    try {
      // Validate required data
      if (!levelData) {
        throw new Error('Level data is undefined');
      }
      
      if (!levelData.playerStart || levelData.playerStart.length !== 2) {
        throw new Error('Player start position is invalid or missing');
      }
      
      if (!levelData.kings || levelData.kings.length === 0) {
        throw new Error('Level must have at least one king');
      }
      
      const board: GameCell[][] = Array.from(
        { length: BOARD_SIZE },
        (_, y) =>
          Array.from({ length: BOARD_SIZE }, (_, x) => ({
            type: CellType.EMPTY,
            position: [x, y],
         }))
      );

      // Place kings
      (levelData.kings || []).forEach((item) => {
        if (item && item.length === 2) {
          board[item[1]][item[0]].type = CellType.KING;
        }
      });

      // Place enemies
     (levelData.enemies || []).forEach((item) => {
       if (item && item.position && item.position.length === 2) {
         board[item.position[0]][item.position[1]].type = item.type;
       }
     });

      // Place boxes
     (levelData.boxes || []).forEach((item) => {
       if (item && item.length === 2) {
         board[item[0]][item[1]].type = CellType.BOX;
       }
     });

      // Place player
      const [playerX, playerY] = levelData.playerStart;
      if (playerX >= 0 && playerX < BOARD_SIZE && playerY >= 0 && playerY < BOARD_SIZE) {
        board[playerX][playerY].type = CellType.PLAYER;
      } else {
        throw new Error('Player start position is out of board bounds');
      }
      
      return board;
    } catch (error) {
      console.error('Error initializing board:', error);
      return null as unknown as GameCell[][];
    }
  }, []);

 
  // Calculate all enemy sight lines
  const calculateAllSightLines = useCallback(
    (board: GameCell[][]): [number, number][] => {
      let allSightLines: [number, number][] = [];
      
      if (!board) {
        console.error('Board is undefined in calculateAllSightLines');
        return [];
      }
      
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const cell = board[row][col];
          if (
            cell.type === CellType.ROOK ||
            cell.type === CellType.BISHOP ||
            cell.type === CellType.QUEEN
          ) {
            const sightLines = calculateLineOfSight(board, cell.type, [row, col]);
            allSightLines = [...allSightLines, ...sightLines];
          }
        }
      }
      return allSightLines;
    },
    []
  );

  // Calculate the line of sight for enemies
  const calculateLineOfSight = (
    board: GameCell[][],
    enemyType: CellType,
    position: [number, number]
  ): [number, number][] => {
    const sightLines: [number, number][] = [];
    const [row, col] = position;
    const boardSize: [number, number] = [board.length, board[0].length];
    
    const addPositionIfValid = (pos: [number, number]) => {
      if (isValidPosition(pos, boardSize)) {
        const cell = getCellAt(board, pos);
        if (cell && cell.type !== CellType.BOX && cell.type !== CellType.KING) {
          sightLines.push(pos);
          return true;
        }
        return false;
      }
      return false;
    };
    
    // Rook can see in straight lines (horizontally and vertically)
    if (enemyType === CellType.ROOK || enemyType === CellType.QUEEN) {
      // Look up
      for (let r = row - 1; r >= 0; r--) {
        if (!addPositionIfValid([r, col])) break;
      }
      // Look down
      for (let r = row + 1; r < boardSize[0]; r++) {
        if (!addPositionIfValid([r, col])) break;
      }
      // Look left
      for (let c = col - 1; c >= 0; c--) {
        if (!addPositionIfValid([row, c])) break;
      }
      // Look right
      for (let c = col + 1; c < boardSize[1]; c++) {
        if (!addPositionIfValid([row, c])) break;
      }
    }
    
    // Bishop can see diagonally
    if (enemyType === CellType.BISHOP || enemyType === CellType.QUEEN) {
      // Top-left diagonal
      for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
        if (!addPositionIfValid([r, c])) break;
      }
      // Top-right diagonal
      for (let r = row - 1, c = col + 1; r >= 0 && c < boardSize[1]; r--, c++) {
        if (!addPositionIfValid([r, c])) break;
      }
      // Bottom-left diagonal
      for (let r = row + 1, c = col - 1; r < boardSize[0] && c >= 0; r++, c--) {
        if (!addPositionIfValid([r, c])) break;
      }
      // Bottom-right diagonal
      for (let r = row + 1, c = col + 1; r < boardSize[0] && c < boardSize[1]; r++, c++) {
        if (!addPositionIfValid([r, c])) break;
      }
    }
    
    return sightLines;
  };

  // Get cell at a specific position
  const getCellAt = (
    board: GameCell[][],
    position: [number, number]
  ): GameCell | null => {
    const [row, col] = position;
    if (
      row >= 0 &&
      row < board.length &&
      col >= 0 &&
      col < board[0].length
    ) {
      return board[row][col];
    }
    return null;
  };

  // Check if a position is valid (within board bounds)
  const isValidPosition = (
    position: [number, number],
    boardSize: [number, number]
  ): boolean => {
    const [row, col] = position;
    const [rows, cols] = boardSize;
    return row >= 0 && row < rows && col >= 0 && col < cols;
  };

  return {
    initializeBoard,
    calculateAllSightLines,
    getCellAt,
    isValidPosition,
  };
};
