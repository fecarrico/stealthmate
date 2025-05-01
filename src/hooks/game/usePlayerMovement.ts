
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

  return { movePlayer };
};
