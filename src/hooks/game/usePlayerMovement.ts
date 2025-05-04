
import { useCallback } from 'react';
import { GameState } from './types';
import { CellType } from '../../utils/levelData';

export const usePlayerMovement = (
  calculateAllSightLines: (board: any[][]) => [number, number][]
) => {
  const movePlayer = useCallback((direction: [number, number], gameState: GameState) => {
    if (!gameState || gameState.gameOver || gameState.victory) return gameState;

    const [rowDelta, colDelta] = direction;
    const [currentRow, currentCol] = gameState.playerPosition;
    const newRow = currentRow + rowDelta;
    const newCol = currentCol + colDelta;
    
    // Check if move is valid (within board bounds)
    if (newRow < 0 || newRow >= gameState.board.length || newCol < 0 || newCol >= gameState.board[0].length) {
      return gameState;
    }

    const targetCell = gameState.board[newRow][newCol];
    
    // Can't move to cells with enemies or holes
    if (
      targetCell.type === CellType.ROOK ||
      targetCell.type === CellType.BISHOP ||
      targetCell.type === CellType.QUEEN ||
      targetCell.type === CellType.KNIGHT ||
      targetCell.type === CellType.PAWN ||
      targetCell.type === CellType.HOLE
    ) {
      return gameState;
    }

    // Create new board
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    let usedNinjaInstinct = false;
    
    // Check if player is using Ninja Instinct
    if (gameState.showingNinjaInstinct) {
      usedNinjaInstinct = true;
    }
    
    // Handle box pushing
    if (targetCell.type === CellType.BOX) {
      const boxNewRow = newRow + rowDelta;
      const boxNewCol = newCol + colDelta;
      
      // Check if box can be pushed (within board bounds)
      if (
        boxNewRow < 0 ||
        boxNewRow >= newBoard.length ||
        boxNewCol < 0 ||
        boxNewCol >= newBoard[0].length
      ) {
        return gameState;
      }
      
      const boxTargetCell = newBoard[boxNewRow][boxNewCol];
      
      // Check what's in the target cell for the box
      // Can't push a box into a hole
      if (boxTargetCell.type === CellType.HOLE) {
        return gameState;
      }
      
      if (boxTargetCell.type === CellType.EMPTY) {
        // Move box to empty space
        newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
      } else if (boxTargetCell.type === CellType.KING) {
        // Capture a king with the box
        newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
      } else if (
        boxTargetCell.type === CellType.ROOK ||
        boxTargetCell.type === CellType.BISHOP ||
        boxTargetCell.type === CellType.QUEEN ||
        boxTargetCell.type === CellType.KNIGHT ||
        boxTargetCell.type === CellType.PAWN
      ) {
        // Capture an enemy with the box
        newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
      } else {
        // Can't push box to non-empty cells that aren't kings or enemies
        return gameState;
      }
    }

    // Move player
    newBoard[currentRow][currentCol].type = CellType.EMPTY;
    newBoard[newRow][newCol].type = CellType.PLAYER;

    // Calculate new sight lines
    const newSightLines = calculateAllSightLines(newBoard);
    
    // Check if player is detected
    const isDetected = newSightLines.some(([r, c]) => r === newRow && c === newCol);
    
    // Find enemies that can see the player
    const detectingEnemies: [number, number][] = [];
    if (isDetected) {
      newBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (
            cell.type === CellType.ROOK ||
            cell.type === CellType.BISHOP ||
            cell.type === CellType.QUEEN ||
            cell.type === CellType.KNIGHT ||
            cell.type === CellType.PAWN
          ) {
            const enemySightLines = calculateLineOfSight(
              newBoard, 
              cell.type, 
              [rowIndex, colIndex]
            );
            
            if (enemySightLines.some(([r, c]) => r === newRow && c === newCol)) {
              detectingEnemies.push([rowIndex, colIndex]);
            }
          }
        });
      });
    }

    // Check for victory (no more kings)
    const victory = !newBoard.some(row => 
      row.some(cell => cell.type === CellType.KING)
    );

    return {
      ...gameState,
      board: newBoard,
      playerPosition: [newRow, newCol] as [number, number],
      steps: gameState.steps + 1,
      sightLines: newSightLines,
      gameOver: isDetected,
      victory,
      message: isDetected ? 'You were spotted! Game over.' : (victory ? 'Victory! All kings captured.' : ''),
      detectingEnemies,
      usedNinjaInstinct
    };
  }, [calculateAllSightLines]);

  // Helper function to calculate line of sight for a single enemy
  const calculateLineOfSight = (
    board: any[][],
    enemyType: CellType,
    position: [number, number]
  ): [number, number][] => {
    const sightLines: [number, number][] = [];
    const [row, col] = position;
    const boardSize: [number, number] = [board.length, board[0].length];
    
    const addPositionIfValid = (pos: [number, number]) => {
      if (pos[0] >= 0 && pos[0] < boardSize[0] && pos[1] >= 0 && pos[1] < boardSize[1]) {
        const cell = board[pos[0]][pos[1]];
        // Holes don't block sight lines, boxes and kings do
        if (cell && cell.type !== CellType.BOX && cell.type !== CellType.KING) {
          sightLines.push(pos);
          return true;
        }
        return false;
      }
      return false;
    };
    
    // Rook can see in straight lines
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
    
    // Pawn sees only diagonally forward
    if (enemyType === CellType.PAWN) {
      // Diagonal forward-left
      addPositionIfValid([row - 1, col - 1]);
      
      // Diagonal forward-right
      addPositionIfValid([row - 1, col + 1]);
    }
    
    return sightLines;
  };

  return { movePlayer };
};
