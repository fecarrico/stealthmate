
import { CellType, GameCell } from './levelData';
import { isValidPosition, getCellAt } from './boardUtils';

// Calculate the line of sight for enemies
export const calculateLineOfSight = (
  board: GameCell[][],
  enemyType: CellType,
  position: [number, number]
): [number, number][] => {
  const sightLines: [number, number][] = [];
  const [row, col] = position;
  const boardSize: [number, number] = [board.length, board[0].length];
  
  const addPositionIfValid = (pos: [number, number], checkEnemyBlocking: boolean = true) => {
    if (isValidPosition(pos, boardSize)) {
      const cell = getCellAt(board, pos);
      if (cell) {
        const isEnemy = cell.type === CellType.ROOK || 
                        cell.type === CellType.BISHOP || 
                        cell.type === CellType.QUEEN ||
                        cell.type === CellType.KNIGHT || 
                        cell.type === CellType.PAWN ||
                        cell.type === CellType.KING;

        // Enemies block sight lines of other enemies (new behavior)
        if (checkEnemyBlocking && isEnemy && cell.type !== enemyType) {
          return false;
        }
        
        // Boxes block all sight lines (except for knight)
        if (cell.type === CellType.BOX && enemyType !== CellType.KNIGHT) {
          return false;
        }
        
        // Add this position to sight lines if it's not a box (boxes can't be detected)
        if (cell.type !== CellType.BOX && cell.type !== CellType.KING) {
          sightLines.push(pos);
        }
        
        // Return if this position blocks further sight
        return !(cell.type === CellType.BOX || isEnemy);
      }
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
  
  // Knight moves in L-shape - updated to only see at the capture positions, not along the path
  if (enemyType === CellType.KNIGHT) {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dr, dc] of knightMoves) {
      const pos: [number, number] = [row + dr, col + dc];
      // Knights have special movement - they ignore blocking pieces, but only see at destination
      addPositionIfValid(pos, false);
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
