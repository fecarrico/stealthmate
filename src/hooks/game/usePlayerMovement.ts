
import { useCallback } from 'react';
import { GameState } from './types';
import { CellType } from '../../utils/levelData';
import { isPlayerDetected, allKingsCaptured } from '../../utils/gameLogic';

export const usePlayerMovement = (calculateAllSightLines: (board: any[][]) => [number, number][]) => {
  // Move player in a direction
  const movePlayer = useCallback((direction: number[], gameState: GameState) => {
    if (!gameState || gameState.gameOver || gameState.victory) return gameState;

    const [dRow, dCol] = direction;
    const { board, playerPosition, steps } = gameState;
    const [row, col] = playerPosition;
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check if the move is valid (within board bounds)
    if (newRow < 0 || newRow >= board.length || newCol < 0 || newCol >= board[0].length) {
      return gameState;
    }

    const newBoard = JSON.parse(JSON.stringify(board));
    const targetCell = newBoard[newRow][newCol];

    // Check if the target cell can be moved to
    if (targetCell.type === CellType.EMPTY || targetCell.type === CellType.KING) {
      // Move player
      newBoard[row][col].type = CellType.EMPTY;
      newBoard[newRow][newCol].type = CellType.PLAYER;

      // Calculate new sight lines AFTER the player has moved
      const newSightLines = calculateAllSightLines(newBoard);
      
      // Check if player is detected in their new position
      const detected = isPlayerDetected([newRow, newCol], newSightLines);
      const victory = targetCell.type === CellType.KING || allKingsCaptured(newBoard);
      
      // Find enemies that can see the player
      const detectingEnemies: [number, number][] = [];
      if (detected) {
        // Loop through board to find enemies
        for (let r = 0; r < board.length; r++) {
          for (let c = 0; c < board[0].length; c++) {
            const cell = board[r][c];
            if (cell.type === CellType.ROOK || cell.type === CellType.BISHOP || cell.type === CellType.QUEEN) {
              // Calculate sight lines for this enemy
              const enemySightLines = calculateSightLines(newBoard, cell.type, [r, c]);
              
              // Check if player is in this enemy's sight line
              if (enemySightLines.some(([sightR, sightC]) => sightR === newRow && sightC === newCol)) {
                detectingEnemies.push([r, c]);
              }
            }
          }
        }
      }

      // Create new game state
      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        playerPosition: [newRow, newCol] as [number, number],
        steps: steps + 1,
        sightLines: newSightLines,
        gameOver: detected,
        victory: victory,
        message: detected ? 'You were spotted!' : (victory ? 'Level Complete!' : ''),
        detectingEnemies: detectingEnemies,
        history: [
          ...gameState.history,
          {
            board: JSON.parse(JSON.stringify(newBoard)),
            playerPosition: [newRow, newCol] as [number, number],
            steps: steps + 1
          }
        ]
      };

      return newGameState;
    } 
    // Handle box pushing
    else if (targetCell.type === CellType.BOX) {
      const boxNewRow = newRow + dRow;
      const boxNewCol = newCol + dCol;
      
      // Check if box can be pushed (within bounds)
      if (boxNewRow < 0 || boxNewRow >= board.length || boxNewCol < 0 || boxNewCol >= board[0].length) {
        return gameState;
      }
      
      const boxTargetCell = newBoard[boxNewRow][boxNewCol];
      
      // Check if box can be pushed to target cell
      if (boxTargetCell.type === CellType.EMPTY || 
          boxTargetCell.type === CellType.KING ||
          boxTargetCell.type === CellType.ROOK ||
          boxTargetCell.type === CellType.BISHOP ||
          boxTargetCell.type === CellType.QUEEN) {
        
        // Move player
        newBoard[row][col].type = CellType.EMPTY;
        newBoard[newRow][newCol].type = CellType.PLAYER;
        
        // Push box
        newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
        
        // Calculate new sight lines AFTER both player and box have moved
        const newSightLines = calculateAllSightLines(newBoard);
        
        // Check if player is detected in their new position
        const detected = isPlayerDetected([newRow, newCol], newSightLines);
        const victory = allKingsCaptured(newBoard);
        
        // Find enemies that can see the player
        const detectingEnemies: [number, number][] = [];
        if (detected) {
          // Loop through board to find enemies
          for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
              const cell = board[r][c];
              if (cell.type === CellType.ROOK || cell.type === CellType.BISHOP || cell.type === CellType.QUEEN) {
                // Calculate sight lines for this enemy
                const enemySightLines = calculateSightLines(newBoard, cell.type, [r, c]);
                
                // Check if player is in this enemy's sight line
                if (enemySightLines.some(([sightR, sightC]) => sightR === newRow && sightC === newCol)) {
                  detectingEnemies.push([r, c]);
                }
              }
            }
          }
        }
        
        // Create new game state
        const newGameState: GameState = {
          ...gameState,
          board: newBoard,
          playerPosition: [newRow, newCol] as [number, number],
          steps: steps + 1,
          sightLines: newSightLines,
          gameOver: detected,
          victory: victory,
          message: detected ? 'You were spotted!' : (victory ? 'Level Complete!' : ''),
          detectingEnemies: detectingEnemies,
          history: [
            ...gameState.history,
            {
              board: JSON.parse(JSON.stringify(newBoard)),
              playerPosition: [newRow, newCol] as [number, number],
              steps: steps + 1
            }
          ]
        };
        
        return newGameState;
      }
    }
    
    return gameState;
  }, [calculateAllSightLines]);

  // Helper function to calculate sight lines for a specific enemy
  const calculateSightLines = (board: any[][], enemyType: CellType, position: [number, number]): [number, number][] => {
    const sightLines: [number, number][] = [];
    const [row, col] = position;
    const boardSize: [number, number] = [board.length, board[0].length];
    
    const addPositionIfValid = (pos: [number, number]) => {
      const [r, c] = pos;
      if (r >= 0 && r < boardSize[0] && c >= 0 && c < boardSize[1]) {
        const cell = board[r][c];
        // Stop at boxes and kings
        if (cell.type === CellType.BOX || cell.type === CellType.KING) {
          return false;
        }
        sightLines.push(pos);
        return true;
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
    
    return sightLines;
  };

  return { movePlayer };
};
