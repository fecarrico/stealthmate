
import { CellType, GameCell } from './levelData';

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

// Calculate the line of sight for enemies
export const calculateLineOfSight = (
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
  
  // Knight moves in L-shape
  if (enemyType === CellType.KNIGHT) {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dr, dc] of knightMoves) {
      const pos: [number, number] = [row + dr, col + dc];
      addPositionIfValid(pos);
    }
  }
  
  // Pawn can see diagonally forward (assuming pawn always faces up)
  if (enemyType === CellType.PAWN) {
    // Diagonal forward-left
    addPositionIfValid([row - 1, col - 1]);
    
    // Diagonal forward-right
    addPositionIfValid([row - 1, col + 1]);
  }
  
  return sightLines;
};

// Check if player is in enemy sight
export const isPlayerDetected = (
  playerPos: [number, number],
  sightLines: [number, number][]
): boolean => {
  return sightLines.some(([row, col]) => row === playerPos[0] && col === playerPos[1]);
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

// Get cell color based on position
export const getCellColor = (row: number, col: number): string => {
  return (row + col) % 2 === 0 ? 'board-light' : 'board-dark';
};

// Determine if a move is valid
export const isMoveValid = (
  board: GameCell[][],
  from: [number, number],
  to: [number, number]
): boolean => {
  const toCell = getCellAt(board, to);
  
  // Can't move outside the board
  if (!toCell) return false;
  
  // Can't move to hole cells
  if (toCell.type === CellType.HOLE) return false;
  
  // Can move to empty cells
  if (toCell.type === CellType.EMPTY) return true;
  
  // Can move to king cells (to capture)
  if (toCell.type === CellType.KING) return true;
  
  // Can push boxes
  if (toCell.type === CellType.BOX) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Calculate the direction of movement
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    // Calculate the position after the box
    const nextRow = toRow + rowDiff;
    const nextCol = toCol + colDiff;
    
    const nextCell = getCellAt(board, [nextRow, nextCol]);
    
    // Can't push if nextCell is null (outside the board)
    if (nextCell === null) return false;
    
    // Can push box into a hole now (new behavior)
    if (nextCell.type === CellType.HOLE) return true;
    
    // Can push if the next cell is empty or contains an enemy or king
    return (
      nextCell.type === CellType.EMPTY ||
      nextCell.type === CellType.ROOK ||
      nextCell.type === CellType.BISHOP ||
      nextCell.type === CellType.QUEEN ||
      nextCell.type === CellType.KNIGHT ||
      nextCell.type === CellType.PAWN ||
      nextCell.type === CellType.KING
    );
  }
  
  // Can't move to cells with enemies
  return false;
};
