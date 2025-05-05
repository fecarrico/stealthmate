
import { GameCell, CellType } from './levelData';

// Get cell at a specific position
export const getCellAt = (
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
export const isValidPosition = (
  position: [number, number],
  boardSize: [number, number]
): boolean => {
  const [row, col] = position;
  const [rows, cols] = boardSize;
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

// Calculate new position after a move
export const getNewPosition = (
  position: [number, number],
  direction: 'up' | 'down' | 'left' | 'right'
): [number, number] => {
  const [row, col] = position;
  switch (direction) {
    case 'up':
      return [row - 1, col];
    case 'down':
      return [row + 1, col];
    case 'left':
      return [row, col - 1];
    case 'right':
      return [row, col + 1];
    default:
      return position;
  }
};

// Get cell color based on position
export const getCellColor = (row: number, col: number): string => {
  return (row + col) % 2 === 0 ? 'board-light' : 'board-dark';
};

// Check if all kings are captured
export const allKingsCaptured = (board: GameCell[][]): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].type === CellType.KING) {
        return false;
      }
    }
  }
  return true;
};
