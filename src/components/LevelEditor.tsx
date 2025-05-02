
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelEditorBoard from './levelEditor/LevelEditorBoard';
import EditorSidebar from './levelEditor/EditorSidebar';
import { LevelData, CellType, GameCell } from '@/utils/levelData';
import { toast } from '@/components/ui/sonner';
import AuthorFooter from './AuthorFooter';

const LevelEditor: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(5);
  const [board, setBoard] = useState<GameCell[][]>([]);
  const [sightLines, setSightLines] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedCellType, setSelectedCellType] = useState<CellType>(CellType.EMPTY);
  const [levelName, setLevelName] = useState<string>("Custom Level");
  const [playerStart, setPlayerStart] = useState<[number, number]>([-1, -1]);
  const [kings, setKings] = useState<[number, number][]>([]);
  const [enemies, setEnemies] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<[number, number][]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're editing an existing level
    const storedLevel = localStorage.getItem('testing_level');
    if (storedLevel) {
      try {
        const levelData = JSON.parse(storedLevel);
        if (levelData) {
          // Set level name
          setLevelName(levelData.name || "Custom Level");
          
          // Calculate board size based on level data
          if (levelData.boardSize) {
            setBoardSize(levelData.boardSize);
          } else {
            // Determine board size from existing pieces
            let maxRow = 0;
            let maxCol = 0;
            
            // Check player position
            if (levelData.playerStart) {
              maxRow = Math.max(maxRow, levelData.playerStart[0]);
              maxCol = Math.max(maxCol, levelData.playerStart[1]);
            }
            
            // Check kings positions
            if (levelData.kings && levelData.kings.length) {
              levelData.kings.forEach((king: [number, number]) => {
                maxRow = Math.max(maxRow, king[0]);
                maxCol = Math.max(maxCol, king[1]);
              });
            }
            
            // Check enemies positions
            if (levelData.enemies && levelData.enemies.length) {
              levelData.enemies.forEach((enemy: any) => {
                if (enemy.position) {
                  maxRow = Math.max(maxRow, enemy.position[0]);
                  maxCol = Math.max(maxCol, enemy.position[1]);
                }
              });
            }
            
            // Check boxes positions
            if (levelData.boxes && levelData.boxes.length) {
              levelData.boxes.forEach((box: [number, number]) => {
                maxRow = Math.max(maxRow, box[0]);
                maxCol = Math.max(maxCol, box[1]);
              });
            }
            
            // Set board size to max dimension + 1 (minimum 5)
            setBoardSize(Math.max(5, Math.max(maxRow, maxCol) + 1));
          }
          
          // We'll initialize the board in the next effect when boardSize is updated
        }
      } catch (error) {
        console.error("Error loading level for editing:", error);
        toast.error("Error loading level for editing");
        initializeBoard();
      }
    } else {
      // No stored level, initialize a new board
      initializeBoard();
    }
  }, []);

  // Initialize board when boardSize changes
  useEffect(() => {
    const storedLevel = localStorage.getItem('testing_level');
    
    // Create empty board first
    const newBoard: GameCell[][] = Array.from(
      { length: boardSize },
      (_, rowIndex) =>
        Array.from({ length: boardSize }, (_, colIndex) => ({
          type: CellType.EMPTY,
          position: [rowIndex, colIndex],
        }))
    );
    
    // If we're editing an existing level, populate the board with its pieces
    if (storedLevel) {
      try {
        const levelData = JSON.parse(storedLevel);
        
        // Set player position
        if (levelData.playerStart) {
          const [playerRow, playerCol] = levelData.playerStart;
          if (playerRow < boardSize && playerCol < boardSize) {
            newBoard[playerRow][playerCol].type = CellType.PLAYER;
            setPlayerStart([playerRow, playerCol]);
          }
        }
        
        // Set kings
        const newKings: [number, number][] = [];
        if (levelData.kings && levelData.kings.length) {
          levelData.kings.forEach((king: [number, number]) => {
            const [kingRow, kingCol] = king;
            if (kingRow < boardSize && kingCol < boardSize) {
              newBoard[kingRow][kingCol].type = CellType.KING;
              newKings.push([kingRow, kingCol]);
            }
          });
        }
        setKings(newKings);
        
        // Set enemies
        const newEnemies: any[] = [];
        if (levelData.enemies && levelData.enemies.length) {
          levelData.enemies.forEach((enemy: any) => {
            if (enemy.position) {
              const [enemyRow, enemyCol] = enemy.position;
              if (enemyRow < boardSize && enemyCol < boardSize) {
                newBoard[enemyRow][enemyCol].type = enemy.type;
                newEnemies.push({
                  type: enemy.type,
                  position: [enemyRow, enemyCol]
                });
              }
            }
          });
        }
        setEnemies(newEnemies);
        
        // Set boxes
        const newBoxes: [number, number][] = [];
        if (levelData.boxes && levelData.boxes.length) {
          levelData.boxes.forEach((box: [number, number]) => {
            const [boxRow, boxCol] = box;
            if (boxRow < boardSize && boxCol < boardSize) {
              newBoard[boxRow][boxCol].type = CellType.BOX;
              newBoxes.push([boxRow, boxCol]);
            }
          });
        }
        setBoxes(newBoxes);
        
      } catch (error) {
        console.error("Error populating board:", error);
      }
    }
    
    setBoard(newBoard);
    setSightLines([]);
    setSelectedCell(null);
    
  }, [boardSize]);

  const initializeBoard = useCallback(() => {
    const newBoard: GameCell[][] = Array.from(
      { length: boardSize },
      (_, rowIndex) =>
        Array.from({ length: boardSize }, (_, colIndex) => ({
          type: CellType.EMPTY,
          position: [rowIndex, colIndex],
        }))
    );
    setBoard(newBoard);
    setSightLines([]);
    setSelectedCell(null);
    setPlayerStart([-1, -1]);
    setKings([]);
    setEnemies([]);
    setBoxes([]);
  }, [boardSize]);

  const handleCellClick = (row: number, col: number) => {
    const newBoard = board.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          let newType = selectedCellType;
          let updatedBoard = true;

          // Handle player placement
          if (selectedCellType === CellType.PLAYER) {
            // Clear previous player position
            if (playerStart[0] !== -1 && playerStart[1] !== -1) {
              board[playerStart[0]][playerStart[1]].type = CellType.EMPTY;
            }
            setPlayerStart([row, col]);
          } 
          // Handle king placement
          else if (selectedCellType === CellType.KING) {
            const isKingAlready = kings.some(king => king[0] === row && king[1] === col);
            if (!isKingAlready) {
              setKings([...kings, [row, col]]);
            }
          } 
          // Handle removing kings
          else if (cell.type === CellType.KING) {
            setKings(kings.filter(king => !(king[0] === row && king[1] === col)));
          }
          // Handle enemy placement
          else if (selectedCellType === CellType.ROOK || selectedCellType === CellType.BISHOP || selectedCellType === CellType.QUEEN) {
            // Add to enemies list
            setEnemies([...enemies, {
              type: selectedCellType,
              position: [row, col]
            }]);
          }
          // Handle removing enemies
          else if (cell.type === CellType.ROOK || cell.type === CellType.BISHOP || cell.type === CellType.QUEEN) {
            setEnemies(enemies.filter(enemy => !(enemy.position[0] === row && enemy.position[1] === col)));
          }
          // Handle box placement
          else if (selectedCellType === CellType.BOX) {
            const isBoxAlready = boxes.some(box => box[0] === row && box[1] === col);
            if (!isBoxAlready) {
              setBoxes([...boxes, [row, col]]);
            }
          }
          // Handle removing boxes
          else if (cell.type === CellType.BOX) {
            setBoxes(boxes.filter(box => !(box[0] === row && box[1] === col)));
          }
          // Handle clearing player
          else if (selectedCellType === CellType.EMPTY && cell.type === CellType.PLAYER) {
            setPlayerStart([-1, -1]);
          }

          return { ...cell, type: newType };
        }
        return cell;
      })
    );
    setBoard(newBoard);
    setSelectedCell([row, col]);
  };

  // Add validation for level requirements
  const hasPlayer = (): boolean => {
    return playerStart[0] >= 0 && playerStart[1] >= 0;
  };
  
  const hasKing = (): boolean => {
    return kings.length > 0;
  };
  
  const canSaveLevel = hasPlayer() && hasKing();

  // Test level
  const handleTestLevel = () => {
    if (!canSaveLevel) {
      toast.error("Level must have a player and at least one king");
      return;
    }
    
    const levelData = generateLevelData();
    if (levelData) {
      localStorage.setItem('testing_level', JSON.stringify(levelData));
      navigate('/game?mode=test');
    } else {
      toast.error("Failed to generate level data");
    }
  };

  // Save level
  const handleSaveLevel = () => {
    if (!canSaveLevel) {
      toast.error("Level must have a player and at least one king");
      return;
    }
    
    const levelData = generateLevelData();
    if (levelData) {
      try {
        const levelCode = btoa(JSON.stringify(levelData));
        navigator.clipboard.writeText(levelCode);
        toast.success("Level code copied to clipboard");
      } catch (error) {
        console.error("Error generating level code:", error);
        toast.error("Failed to generate level code");
      }
    }
  };

  // Generate level data
  const generateLevelData = (): LevelData | null => {
    if (!hasPlayer() || !hasKing()) {
      toast.error("Level must have a player and at least one king");
      return null;
    }
    
    const kingsData: [number, number][] = kings.map(king => [king[0], king[1]]);
    const boxesData: [number, number][] = boxes.map(box => [box[0], box[1]]);
    
    const timestamp = Date.now();
    const levelData: LevelData = {
      id: timestamp,
      level: 1000 + (timestamp % 1000),
      name: levelName,
      playerStart: [playerStart[0], playerStart[1]],
      kings: kingsData,
      enemies: enemies,
      boxes: boxesData,
      boardSize: boardSize,
      isCustom: true
    };
    return levelData;
  };

  const handleBoardSizeChange = (newSize: number[]) => {
    setBoardSize(newSize[0]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LevelEditorBoard
            board={board}
            sightLines={sightLines}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            handleSaveLevel={handleSaveLevel}
            handleTestLevel={handleTestLevel}
            canSaveLevel={canSaveLevel}
          />
          <EditorSidebar
            levelName={levelName}
            setLevelName={setLevelName}
            boardSize={[boardSize, boardSize]}
            handleBoardSizeChange={handleBoardSizeChange}
            selectedCellType={selectedCellType}
            setSelectedCellType={setSelectedCellType}
            generateLevelData={generateLevelData}
          />
        </div>
        <div className="mt-4 w-full text-right">
          <AuthorFooter />
        </div>
      </div>
    </div>
  );
};

export default LevelEditor;
