
import { useState, useEffect, useCallback } from 'react';
import levels, { LevelData, CellType, GameCell } from '../utils/levelData';
import { getCustomLevelFromCode } from '../utils/levelHelper';
import {
  getNewPosition,
  calculateLineOfSight,
  isPlayerDetected,
  allKingsCaptured,
  getCellAt,
  isMoveValid,
} from '../utils/gameLogic';

// Game state interface
interface GameState {
  level: number;
  board: GameCell[][];
  playerPosition: [number, number];
  steps: number;
  sightLines: [number, number][];
  gameOver: boolean;
  victory: boolean;
  message: string;
  ninjaInstinct: number;
  levelName: string;
  history: {
    board: GameCell[][];
    playerPosition: [number, number];
    steps: number;
  }[];
  isCustomLevel?: boolean;
}

// Custom hook for game state management
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [totalSteps, setTotalSteps] = useState<number[]>([]);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [showVictory, setShowVictory] = useState(false);

  // Load best scores from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('stealthmate_best_scores');
      if (savedScores) {
        setBestScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Error loading best scores:", error);
    }
  }, []);

  // Save best scores to localStorage
  const saveBestScore = useCallback((levelId: number, steps: number) => {
    const currentBest = bestScores[levelId];
    
    if (!currentBest || steps < currentBest) {
      const newBestScores = { ...bestScores, [levelId]: steps };
      setBestScores(newBestScores);
      
      try {
        localStorage.setItem('stealthmate_best_scores', JSON.stringify(newBestScores));
      } catch (error) {
        console.error("Error saving best score:", error);
      }
    }
  }, [bestScores]);

  // Initialize the board from level data
  const initializeBoard = useCallback((levelData: LevelData): GameCell[][] => {
    const [rows, cols] = levelData.size;
    const board: GameCell[][] = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            type: CellType.EMPTY,
            position: [row, col],
          }))
      );

    // Place player
    board[levelData.playerStart[0]][levelData.playerStart[1]].type = CellType.PLAYER;

    // Place kings
    levelData.kings.forEach(([row, col]) => {
      board[row][col].type = CellType.KING;
    });

    // Place enemies
    levelData.enemies.forEach((enemy) => {
      const [row, col] = enemy.position;
      board[row][col].type = enemy.type;
    });

    // Place boxes
    levelData.boxes.forEach(([row, col]) => {
      board[row][col].type = CellType.BOX;
    });

    return board;
  }, []);

  // Calculate all enemy sight lines
  const calculateAllSightLines = useCallback(
    (board: GameCell[][]): [number, number][] => {
      let allSightLines: [number, number][] = [];
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const cell = board[row][col];
          if (
            cell.type === CellType.ROOK ||
            cell.type === CellType.BISHOP ||
            cell.type === CellType.QUEEN
          ) {
            const sightLines = calculateLineOfSight(board, cell.type, [row, col]);
            allSightLines = [...allSightLines, ...sightLines];
          }
        }
      }
      return allSightLines;
    },
    []
  );

  // Load level
  const loadLevel = useCallback(
    (levelNumber: number) => {
      const levelData = levels.find((level) => level.id === levelNumber);
      
      if (!levelData) {
        setAllLevelsComplete(true);
        return;
      }
      
      const board = initializeBoard(levelData);
      const sightLines = calculateAllSightLines(board);
      
      setGameState({
        level: levelNumber,
        board,
        playerPosition: levelData.playerStart,
        steps: 0,
        sightLines,
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3, // Initialize with 3 ninja instinct uses
        levelName: levelData.name || `Level ${levelNumber}`,
        history: [
          {
            board: JSON.parse(JSON.stringify(board)),
            playerPosition: [...levelData.playerStart] as [number, number],
            steps: 0,
          },
        ],
      });
      
      setLevelComplete(false);
      setShowVictory(false);
    },
    [initializeBoard, calculateAllSightLines]
  );

  // Load a custom level
  const loadCustomLevel = useCallback(
    (levelData: LevelData) => {
      const board = initializeBoard(levelData);
      const sightLines = calculateAllSightLines(board);
      
      setGameState({
        level: levelData.id,
        board,
        playerPosition: levelData.playerStart,
        steps: 0,
        sightLines,
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3, // Initialize with 3 ninja instinct uses
        levelName: levelData.name || `Custom Level`,
        isCustomLevel: true,
        history: [
          {
            board: JSON.parse(JSON.stringify(board)),
            playerPosition: [...levelData.playerStart] as [number, number],
            steps: 0,
          },
        ],
      });
      
      setLevelComplete(false);
      setShowVictory(false);
      setAllLevelsComplete(false);
    },
    [initializeBoard, calculateAllSightLines]
  );

  // Initialize game with the custom level
  useEffect(() => {
    // Try to load the custom level first
    const customLevelCode = "eyJpZCI6MTc0NTk1MTkxMjI0NywibmFtZSI6IkN1c3RvbSBMZXZlbCIsInNpemUiOls1LDVdLCJwbGF5ZXJTdGFydCI6WzAsMF0sImtpbmdzIjpbWzQsNF1dLCJlbmVtaWVzIjpbeyJ0eXBlIjoiYmlzaG9wIiwicG9zaXRpb24iOlswLDRdfSx7InR5cGUiOiJiaXNob3AiLCJwb3NpdGlvbiI6WzQsMF19XSwiYm94ZXMiOltbMiwxXSxbMSwyXV19";
    const customLevel = getCustomLevelFromCode(customLevelCode);
    
    if (customLevel) {
      // Replace the first level with the custom level
      levels[0] = customLevel;
    }
    
    loadLevel(1);
  }, [loadLevel]);

  // Move player
  const movePlayer = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!gameState || gameState.gameOver || gameState.victory) return;

      const { board, playerPosition, steps, history } = gameState;
      const newPosition = getNewPosition(playerPosition, direction);

      if (isMoveValid(board, playerPosition, newPosition)) {
        // Create new board
        const newBoard: GameCell[][] = JSON.parse(JSON.stringify(board));
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
          
          // If the box hits a king, it captures it
          if (targetType === CellType.KING) {
            newBoard[boxNewRow][boxNewCol].type = CellType.BOX;
          } 
          // If the box hits an enemy, it captures it
          else if (
            targetType === CellType.ROOK ||
            targetType === CellType.BISHOP ||
            targetType === CellType.QUEEN
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

        // Calculate new sight lines
        const newSightLines = calculateAllSightLines(newBoard);
        
        // Check if player is detected
        const detected = isPlayerDetected(newPosition, newSightLines);
        
        if (detected) {
          // Game over
          setGameState({
            ...gameState,
            gameOver: true,
            message: 'You were spotted! Press Z to undo your last move.',
          });
          return;
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

        setGameState({
          ...gameState,
          board: newBoard,
          playerPosition: newPosition,
          steps: steps + 1,
          sightLines: newSightLines,
          victory,
          message: victory ? 'Level Complete!' : '',
          history: newHistory,
        });

        if (victory) {
          setLevelComplete(true);
          setShowVictory(true);
          saveBestScore(gameState.level, steps + 1);
          setTotalSteps((prev) => [...prev, steps + 1]);
        }
      }
    },
    [gameState, calculateAllSightLines, saveBestScore]
  );

  // Undo last move
  const undoMove = useCallback(() => {
    if (!gameState || gameState.history.length <= 1) return;

    const { history } = gameState;
    const previousState = history[history.length - 2];

    setGameState({
      ...gameState,
      board: previousState.board,
      playerPosition: previousState.playerPosition,
      steps: previousState.steps,
      sightLines: calculateAllSightLines(previousState.board),
      gameOver: false,
      message: '',
      history: history.slice(0, -1),
    });
  }, [gameState, calculateAllSightLines]);

  // Move to next level
  const nextLevel = useCallback(() => {
    if (!gameState) return;
    
    // If it's a custom level, just reset the same level
    if (gameState.isCustomLevel) {
      resetLevel();
      return;
    }
    
    const nextLevelNumber = gameState.level + 1;
    if (nextLevelNumber <= levels.length) {
      loadLevel(nextLevelNumber);
    } else {
      setAllLevelsComplete(true);
    }
  }, [gameState, loadLevel]);

  // Reset current level
  const resetLevel = useCallback(() => {
    if (!gameState) return;
    
    if (gameState.isCustomLevel && gameState.history.length > 0) {
      // Reset to initial state of custom level
      const initialState = gameState.history[0];
      
      setGameState({
        ...gameState,
        board: JSON.parse(JSON.stringify(initialState.board)),
        playerPosition: [...initialState.playerPosition],
        steps: 0,
        sightLines: calculateAllSightLines(initialState.board),
        gameOver: false,
        victory: false,
        message: '',
        ninjaInstinct: 3, // Reset ninja instinct uses
        history: [initialState],
      });
    } else {
      loadLevel(gameState.level);
    }
    
    setShowVictory(false);
  }, [gameState, loadLevel, calculateAllSightLines]);

  // Reset game completely
  const resetGame = useCallback(() => {
    loadLevel(1);
    setTotalSteps([]);
    setAllLevelsComplete(false);
    setShowVictory(false);
  }, [loadLevel]);

  // Close victory popup
  const closeVictory = useCallback(() => {
    setShowVictory(false);
  }, []);

  return {
    gameState,
    movePlayer,
    undoMove,
    nextLevel,
    resetLevel,
    resetGame,
    levelComplete,
    allLevelsComplete,
    totalSteps,
    loadCustomLevel,
    bestScores,
    showVictory,
    closeVictory,
    loadLevel
  };
};
