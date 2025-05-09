
import { GameCell, CellType } from './levelData';
import { getCellAt } from './boardUtils';

// Determine if a move is valid
export const isMoveValid = (
  board: GameCell[][],
  from: [number, number],
  to: [number, number]
): boolean => {
  const toCell = getCellAt(board, to);
  
  // Can't move outside the board
  if (!toCell) return false;
  
  // Can move to empty cells
  if (toCell.type === CellType.EMPTY) return true;
  
  // Can move to king cells (to capture)
  if (toCell.type === CellType.KING) return true;
  
  // Can now move to enemy cells (to capture them)
  if (toCell.type === CellType.ROOK || 
      toCell.type === CellType.BISHOP || 
      toCell.type === CellType.QUEEN || 
      toCell.type === CellType.KNIGHT || 
      toCell.type === CellType.PAWN) {
    return true;
  }
  
  // Can push boxes
  if (toCell.type === CellType.BOX) {
    // Can't push coffin boxes
    if (toCell.isCoffin) return false;
    
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
    
    // Can push box into a hole (box will disappear and hole will become empty)
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
  
  // Can't move to hole cells (player can't step in holes)
  if (toCell.type === CellType.HOLE) return false;
  
  return false;
};
