import { useCallback } from 'react';
import { LevelData, CellType, GameCell } from '../../utils/levelData';

// Hooks for board operations

export const useBoard = () => {
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
      
      // Use the board size from level data if available, otherwise determine it from the board or other elements
      let boardSize = levelData.boardSize;
      
      if (!boardSize) {
        // Check if board is present to determine size
        if (levelData.board && levelData.board.length > 0) {
          boardSize = levelData.board.length;
        } else {
          // Determine size from positions of elements
          let maxDimension = 0;
          
          // Check player position
          maxDimension = Math.max(maxDimension, levelData.playerStart[0], levelData.playerStart[1]);
          
          // Check kings positions
          if (levelData.kings) {
            levelData.kings.forEach(king => {
              maxDimension = Math.max(maxDimension, king[0], king[1]);
            });
          }
          
          // Check enemies positions
          if (levelData.enemies) {
            levelData.enemies.forEach(enemy => {
              maxDimension = Math.max(maxDimension, enemy.position[0], enemy.position[1]);
            });
          }
          
          // Check boxes positions
          if (levelData.boxes) {
            levelData.boxes.forEach(box => {
              maxDimension = Math.max(maxDimension, box[0], box[1]);
            });
          }
          
          // Add 1 to max dimension to get size (because index starts at 0)
          boardSize = maxDimension + 1;
        }
      }
      
      // Ensure boardSize is at least 5
      boardSize = Math.max(5, boardSize);
      
      // Create the empty board
      const board: GameCell[][] = Array.from(
        { length: boardSize },
        (_, row) =>
          Array.from({ length: boardSize }, (_, col) => ({
            type: CellType.EMPTY,
            position: [row, col] as [number, number],
         }))
      );

      // Place kings - Each king is stored as [row, col]
      (levelData.kings || []).forEach((item) => {
        if (item && item.length === 2) {
          const [kingRow, kingCol] = item;
          if (kingRow >= 0 && kingRow < boardSize && kingCol >= 0 && kingCol < boardSize) {
            board[kingRow][kingCol].type = CellType.KING;
          }
        }
      });

      // Place enemies - Each enemy has a {type, position: [row, col]}
      (levelData.enemies || []).forEach((item) => {
        if (item && item.position && item.position.length === 2) {
          const [enemyRow, enemyCol] = item.position;
          if (enemyRow >= 0 && enemyRow < boardSize && enemyCol >= 0 && enemyCol < boardSize) {
            board[enemyRow][enemyCol].type = item.type;
          }
        }
      });

      // Place boxes - Each box is stored as [row, col]
      (levelData.boxes || []).forEach((item) => {
        if (item && item.length === 2) {
          const [boxRow, boxCol] = item;
          if (boxRow >= 0 && boxRow < boardSize && boxCol >= 0 && boxCol < boardSize) {
            board[boxRow][boxCol].type = CellType.BOX;
          }
        }
      });

      // Place player - stored as [row, col]
      const [playerRow, playerCol] = levelData.playerStart;
      if (playerRow >= 0 && playerRow < boardSize && playerCol >= 0 && playerCol < boardSize) {
        board[playerRow][playerCol].type = CellType.PLAYER;
      } else {
        throw new Error('Player start position is out of board bounds');
      }
      
      return board;
    } catch (error) {
      console.error('Error initializing board:', error);
      throw error;
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
