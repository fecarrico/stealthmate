import { useCallback } from 'react';
import { GameState } from './types';
import { CellType } from '../../utils/levelData';
import {
  getNewPosition,
  isPlayerDetected,
  allKingsCaptured,
  isMoveValid,
} from '../../utils/gameLogic';

// Hook for managing game moves
export const useGameMoves = (
  calculateAllSightLines: (board: any[][]) => [number, number][]
) => {
  // Move player
  const movePlayer = useCallback(
    (gameState: GameState, direction: 'up' | 'down' | 'left' | 'right'): GameState => {
      if (!gameState || gameState.gameOver || gameState.victory) return gameState;

      const { board, playerPosition, steps, history } = gameState;
      const newPosition = getNewPosition(playerPosition, direction);

      if (isMoveValid(board, playerPosition, newPosition)) {
        // Create new board
        const newBoard = JSON.parse(JSON.stringify(board));
        const [currentRow, currentCol] = playerPosition;
        const [newRow, newCol] = newPosition;

        // Check if we're pushing a box
        if (newBoard[newRow][newCol].type === CellType.BOX) {
          // Calculate where the box will go
          const boxNewPosition = getNewPosition(newPosition, direction);
          const [boxNewRow, boxNewCol] = boxNewPosition;
          
          // What's in the target cell for the box?
          const targetType = newBoard[boxNewRow][boxNewCol].type;
          
          // Clear original box position and move player
          newBoard[currentRow][currentCol].type = CellType.EMPTY;
          newBoard[newRow][newCol].type = CellType.PLAYER;
          
          // If the box hits a hole, the hole becomes empty and the box disappears
          if (targetType === CellType.HOLE) {
            newBoard[boxNewRow][boxNewCol].type = CellType.EMPTY;
            // Box "disappears" as it falls into the hole, and hole is filled (becomes empty)
          }
          // If the box hits a king, it captures it
          else if (targetType === CellType.KING) {
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
          } 
          // If the box hits an enemy, it captures it
          else if (
            targetType === CellType.ROOK ||
            targetType === CellType.BISHOP ||
            targetType === CellType.QUEEN ||
            targetType === CellType.KNIGHT ||
            targetType === CellType.PAWN
          ) {
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
          } 
          // Otherwise, just move the box
          else {
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
          }
        } 
        // Moving to an empty space
        else if (newBoard[newRow][newCol].type === CellType.EMPTY) {
          newBoard[currentRow][currentCol].type = CellType.EMPTY;
          newBoard[newRow][newCol].type = CellType.PLAYER;
        }
        // Capturing a king
        else if (newBoard[newRow][newCol].type === CellType.KING) {
          newBoard[currentRow][currentCol].type = CellType.EMPTY;
          newBoard[newRow][newCol].type = CellType.PLAYER;
        }

        // Calculate new sight lines AFTER the player has moved
        const newSightLines = calculateAllSightLines(newBoard);
        
        // Check if player is detected in their new position (after movement is complete)
        const detected = isPlayerDetected(newPosition, newSightLines);
        
        if (detected) {
          // Game over
          return {
            ...gameState,
            board: newBoard,
            playerPosition: newPosition,
            steps: steps + 1,
            sightLines: newSightLines,
            gameOver: true,
            message: 'You were spotted! Press Z to undo your last move.',
            history: [
              ...history,
              {
                board: JSON.parse(JSON.stringify(newBoard)),
                playerPosition: [...newPosition] as [number, number],
                steps: steps + 1,
              },
            ],
          };
        }

        // Check for victory
        const victory = allKingsCaptured(newBoard);

        // Save the new game state
        const newHistory = [
          ...history,
          {
            board: JSON.parse(JSON.stringify(newBoard)),
            playerPosition: [...newPosition] as [number, number],
            steps: steps + 1,
          },
        ];

        return {
          ...gameState,
          board: newBoard,
          playerPosition: newPosition,
          steps: steps + 1,
          sightLines: newSightLines,
          victory,
          message: victory ? 'Level Complete!' : '',
          history: newHistory,
        };
      }
      
      return gameState;
    },
    []
  );

  // Undo last move
  const undoMove = useCallback(
    (gameState: GameState): GameState => {
      if (!gameState || gameState.history.length <= 1) return gameState;

      const { history } = gameState;
      const previousState = history[history.length - 2];

      return {
        ...gameState,
        board: previousState.board,
        playerPosition: previousState.playerPosition,
        steps: previousState.steps,
        sightLines: calculateAllSightLines(previousState.board),
        gameOver: false,
        message: '',
        history: history.slice(0, -1),
      };
    },
    [calculateAllSightLines]
  );

  return {
    movePlayer,
    undoMove,
  };
};
