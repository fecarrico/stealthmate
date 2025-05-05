
import { useCallback } from 'react';
import { GameState } from './types';
import { CellType } from '../../utils/levelData';

// Hook for handling player movement
export const usePlayerMovement = (
  calculateAllSightLines: (board: any[][]) => [number, number][]
) => {
  // Process player movement
  const movePlayer = useCallback((direction: [number, number], gameState: GameState) => {
    if (!gameState || gameState.gameOver || gameState.victory) return gameState;

    const [rowDelta, colDelta] = direction;
    const [currentRow, currentCol] = gameState.playerPosition;
    const newRow = currentRow + rowDelta;
    const newCol = currentCol + colDelta;
    
    // Check if move is valid (within board bounds)
    if (!isWithinBoardBounds(newRow, newCol, gameState.board)) {
      return gameState;
    }

    const targetCell = gameState.board[newRow][newCol];
    
    // Can't move to cells with enemies or holes
    if (isBlockedCell(targetCell.type)) {
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
      if (!processBoxPush(newBoard, [newRow, newCol], [rowDelta, colDelta])) {
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
    const detectingEnemies = isDetected ? 
      findDetectingEnemies(newBoard, [newRow, newCol], calculateAllSightLines) : [];

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

  // Check if position is within board bounds
  const isWithinBoardBounds = (row: number, col: number, board: any[][]) => {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
  };

  // Check if cell type blocks movement
  const isBlockedCell = (cellType: CellType) => {
    return [
      CellType.ROOK,
      CellType.BISHOP,
      CellType.QUEEN,
      CellType.KNIGHT,
      CellType.PAWN,
      CellType.HOLE
    ].includes(cellType);
  };

  // Process box pushing logic
  const processBoxPush = (
    board: any[][], 
    boxPosition: [number, number], 
    direction: [number, number]
  ) => {
    const [boxRow, boxCol] = boxPosition;
    const [rowDelta, colDelta] = direction;
    
    const targetRow = boxRow + rowDelta;
    const targetCol = boxCol + colDelta;
    
    // Check if target position is valid
    if (!isWithinBoardBounds(targetRow, targetCol, board)) {
      return false;
    }
    
    const targetCell = board[targetRow][targetCol];
    
    // Handle different target cell types
    if (targetCell.type === CellType.HOLE) {
      // Box falls into hole - both disappear (hole becomes empty)
      board[targetRow][targetCol].type = CellType.EMPTY;
      return true;
    } else if (
      targetCell.type === CellType.EMPTY ||
      targetCell.type === CellType.KING ||
      targetCell.type === CellType.ROOK ||
      targetCell.type === CellType.BISHOP ||
      targetCell.type === CellType.QUEEN ||
      targetCell.type === CellType.KNIGHT ||
      targetCell.type === CellType.PAWN
    ) {
      // Move box to target position
      board[targetRow][targetCol].type = CellType.BOX;
      return true;
    }
    
    // Can't push box to other cell types
    return false;
  };

  // Find enemies that can see the player
  const findDetectingEnemies = (
    board: any[][], 
    playerPosition: [number, number],
    calculateLineOfSightFn: Function
  ): [number, number][] => {
    const detectingEnemies: [number, number][] = [];
    const [playerRow, playerCol] = playerPosition;
    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (isEnemyCell(cell.type)) {
          const enemySightLines = calculateLineOfSight(
            board, 
            cell.type, 
            [rowIndex, colIndex],
            calculateLineOfSightFn
          );
          
          if (enemySightLines.some(([r, c]) => r === playerRow && c === playerCol)) {
            detectingEnemies.push([rowIndex, colIndex]);
          }
        }
      });
    });
    
    return detectingEnemies;
  };

  // Check if cell type is an enemy
  const isEnemyCell = (cellType: CellType) => {
    return [
      CellType.ROOK,
      CellType.BISHOP,
      CellType.QUEEN,
      CellType.KNIGHT,
      CellType.PAWN
    ].includes(cellType);
  };

  // Calculate line of sight for a single enemy
  const calculateLineOfSight = (
    board: any[][],
    enemyType: CellType,
    position: [number, number],
    calculateLineOfSightFn: Function
  ): [number, number][] => {
    return calculateLineOfSightFn(board, enemyType, position);
  };

  return { movePlayer };
};
