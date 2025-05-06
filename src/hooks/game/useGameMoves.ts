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

        // Get the type of the target cell before we change it
        const targetCellType = newBoard[newRow][newCol].type;

        // Handle different target cell types
        if (targetCellType === CellType.BOX) {
          // Calculate where the box will go
          const boxNewPosition = getNewPosition(newPosition, direction);
          const [boxNewRow, boxNewCol] = boxNewPosition;
          
          // What's in the target cell for the box?
          const boxTargetCell = newBoard[boxNewRow][boxNewCol];
          if (!boxTargetCell) return gameState;
          
          const targetType = boxTargetCell.type;
          const isValidBoxPush = boxTargetCell && (
            targetType === CellType.EMPTY || 
            targetType === CellType.KING || 
            targetType === CellType.HOLE ||
            targetType === CellType.ROOK || 
            targetType === CellType.BISHOP || 
            targetType === CellType.QUEEN ||
            targetType === CellType.KNIGHT || 
            targetType === CellType.PAWN
          );
          
          if (!isValidBoxPush) return gameState;
          
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
          // If the box hits an enemy, it captures it and becomes a coffin (⚰️)
          else if (
            targetType === CellType.ROOK ||
            targetType === CellType.BISHOP ||
            targetType === CellType.QUEEN ||
            targetType === CellType.KNIGHT ||
            targetType === CellType.PAWN
          ) {
            // Mark this box as a coffin by setting a special property
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
            newBoard[boxNewRow][boxNewCol].isCoffin = true;
          } 
          // Otherwise, just move the box
          else {
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
          }
        } 
        // Capturing an enemy directly
        else if (
          targetCellType === CellType.ROOK ||
          targetCellType === CellType.BISHOP ||
          targetCellType === CellType.QUEEN ||
          targetCellType === CellType.KNIGHT ||
          targetCellType === CellType.PAWN
        ) {
          newBoard[currentRow][currentCol].type = CellType.EMPTY;
          newBoard[newRow][newCol].type = CellType.PLAYER;
        }
        // Moving to an empty space or capturing a king
        else {
          newBoard[currentRow][currentCol].type = CellType.EMPTY;
          newBoard[newRow][newCol].type = CellType.PLAYER;
        }

        // Calculate new sight lines AFTER the player has moved
        const newSightLines = calculateAllSightLines(newBoard);
        
        // Check if player is detected in their new position
        const detected = isPlayerDetected(newPosition, newSightLines);
        
        // Find enemies that can detect the player
        const detectingEnemies = detected ? findDetectingEnemies(newBoard, newPosition, newSightLines) : [];
        
        if (detected) {
          // Game over (if lives > 0, useGameLogic will handle it)
          return {
            ...gameState,
            board: newBoard,
            playerPosition: newPosition,
            steps: steps + 1,
            sightLines: newSightLines,
            gameOver: true,
            message: 'You were spotted!',
            detectingEnemies,
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

        // Check for victory (no more kings)
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
    [calculateAllSightLines]
  );

  // Find enemies that can detect the player
  const findDetectingEnemies = (
    board: any[][],
    playerPosition: [number, number],
    sightLines: [number, number][]
  ): [number, number][] => {
    const detectingEnemies: [number, number][] = [];
    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const isEnemy = [
          CellType.ROOK,
          CellType.BISHOP,
          CellType.QUEEN,
          CellType.KNIGHT,
          CellType.PAWN
        ].includes(cell.type);
        
        if (isEnemy) {
          // Check if this enemy's sight line includes the player position
          const canSeePlayer = sightLines.some(([r, c]) => 
            r === playerPosition[0] && c === playerPosition[1] &&
            // Need to verify this sight line originated from this enemy
            isInEnemySightLine(board, [rowIndex, colIndex], playerPosition)
          );
          
          if (canSeePlayer) {
            detectingEnemies.push([rowIndex, colIndex]);
          }
        }
      });
    });
    
    return detectingEnemies;
  };

  // Helper to check if a position is in an enemy's sight line
  const isInEnemySightLine = (
    board: any[][],
    enemyPos: [number, number],
    targetPos: [number, number]
  ): boolean => {
    const [enemyRow, enemyCol] = enemyPos;
    const enemyCell = board[enemyRow][enemyCol];
    
    if (!enemyCell) return false;
    
    // Get this enemy's specific sight lines
    const enemySightLines = calculateAllSightLines([
      [{ type: enemyCell.type, position: enemyPos }]
    ]);
    
    // Check if target position is in this enemy's sight lines
    return enemySightLines.some(([r, c]) => 
      r === targetPos[0] && c === targetPos[1]
    );
  };

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
        gameOver: false, // Clear game over state when undoing
        message: '',
        history: history.slice(0, -1),
        detectingEnemies: [], // Clear detecting enemies
      };
    },
    [calculateAllSightLines]
  );

  return {
    movePlayer,
    undoMove,
  };
};
