
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelEditorBoard from './levelEditor/LevelEditorBoard';
import EditorSidebar from './levelEditor/EditorSidebar';
import { LevelData, CellType, GameCell, saveCustomLevel } from '@/utils/levelData';
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
  const [holes, setHoles] = useState<[number, number][]>([]); 
  const [editingLevelId, setEditingLevelId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL params to see if we're editing a specific level
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get('editMode') === 'true';
    
    // First clear any testing_level from localStorage if not in edit mode
    if (!editMode) {
      localStorage.removeItem('testing_level');
      initializeBoard();
      setIsEditMode(false);
      return;
    }
    
    // Otherwise, we're in edit mode - check for stored level
    const storedLevel = localStorage.getItem('testing_level');
    if (storedLevel && editMode) {
      try {
        const levelData = JSON.parse(storedLevel);
        if (levelData) {
          setIsEditMode(true);
          
          // If level has an ID, we're editing an existing level
          if (levelData.id) {
            setEditingLevelId(levelData.id);
          }
          
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
            
            // Check holes positions
            if (levelData.holes && levelData.holes.length) {
              levelData.holes.forEach((hole: [number, number]) => {
                maxRow = Math.max(maxRow, hole[0]);
                maxCol = Math.max(maxCol, hole[1]);
              });
            }
            
            // Set board size to max dimension + 1 (minimum 5)
            setBoardSize(Math.max(5, Math.max(maxRow, maxCol) + 1));
          }
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
    if (isEditMode) {
      const storedLevel = localStorage.getItem('testing_level');
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
          
          // Set holes
          const newHoles: [number, number][] = [];
          if (levelData.holes && levelData.holes.length) {
            levelData.holes.forEach((hole: [number, number]) => {
              const [holeRow, holeCol] = hole;
              if (holeRow < boardSize && holeCol < boardSize) {
                newBoard[holeRow][holeCol].type = CellType.HOLE;
                newHoles.push([holeRow, holeCol]);
              }
            });
          }
          setHoles(newHoles);
          
        } catch (error) {
          console.error("Error populating board:", error);
        }
      }
    } else {
      // Reset all pieces for a new level
      setPlayerStart([-1, -1]);
      setKings([]);
      setEnemies([]);
      setBoxes([]);
      setHoles([]);
    }
    
    setBoard(newBoard);
    setSightLines([]);
    setSelectedCell(null);
    
  }, [boardSize, isEditMode]);

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
    setHoles([]);
  }, [boardSize]);

  const handleCellClick = (row: number, col: number) => {
    const newBoard = [...board];
    const cell = newBoard[row][col];
    const cellType = cell.type;
    
    // Clear cell first
    newBoard[row][col] = {
      ...cell,
      type: selectedCellType
    };

    // Handle player placement
    if (selectedCellType === CellType.PLAYER) {
      // Clear previous player position
      if (playerStart[0] !== -1 && playerStart[1] !== -1) {
        const prevRow = playerStart[0];
        const prevCol = playerStart[1];
        if (prevRow < newBoard.length && prevCol < newBoard[0].length) {
          newBoard[prevRow][prevCol].type = CellType.EMPTY;
        }
      }
      setPlayerStart([row, col]);
    } 
    // Handle removing player
    else if (cellType === CellType.PLAYER) {
      setPlayerStart([-1, -1]);
    }
    
    // Handle king placement
    if (selectedCellType === CellType.KING) {
      const isKingAlready = kings.some(king => king[0] === row && king[1] === col);
      if (!isKingAlready) {
        setKings([...kings, [row, col]]);
      }
    } 
    // Handle removing kings
    else if (cellType === CellType.KING) {
      setKings(kings.filter(king => !(king[0] === row && king[1] === col)));
    }
    
    // Handle enemy placement
    if (selectedCellType === CellType.ROOK || 
        selectedCellType === CellType.BISHOP || 
        selectedCellType === CellType.QUEEN ||
        selectedCellType === CellType.KNIGHT ||
        selectedCellType === CellType.PAWN) {
      // Add to enemies list
      setEnemies([...enemies, {
        type: selectedCellType,
        position: [row, col]
      }]);
    }
    // Handle removing enemies
    else if (cellType === CellType.ROOK || 
             cellType === CellType.BISHOP || 
             cellType === CellType.QUEEN ||
             cellType === CellType.KNIGHT ||
             cellType === CellType.PAWN) {
      setEnemies(enemies.filter(enemy => !(enemy.position[0] === row && enemy.position[1] === col)));
    }
    
    // Handle box placement
    if (selectedCellType === CellType.BOX) {
      const isBoxAlready = boxes.some(box => box[0] === row && box[1] === col);
      if (!isBoxAlready) {
        setBoxes([...boxes, [row, col]]);
      }
    } 
    // Handle removing boxes
    else if (cellType === CellType.BOX) {
      setBoxes(boxes.filter(box => !(box[0] === row && box[1] === col)));
    }

    // Handle hole placement
    if (selectedCellType === CellType.HOLE) {
      const isHoleAlready = holes.some(hole => hole[0] === row && hole[1] === col);
      if (!isHoleAlready) {
        setHoles([...holes, [row, col]]);
      }
    } 
    // Handle removing holes
    else if (cellType === CellType.HOLE) {
      setHoles(holes.filter(hole => !(hole[0] === row && hole[1] === col)));
    }

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
      // Always save the level before testing
      saveCustomLevel(levelData);
      if (editingLevelId) {
        toast.success("Level updated successfully");
      } else {
        toast.success("Level saved successfully");
      }
      
      localStorage.setItem('testing_level', JSON.stringify(levelData));
      navigate('/game?mode=test');
    } else {
      toast.error("Failed to generate level data");
    }
  };

  // Generate level data
  const generateLevelData = (): LevelData | null => {
    if (!hasPlayer() || !hasKing()) {
      toast.error("Level must have a player and at least one king");
      return null;
    }
    
    // Use existing ID if editing a level
    const timestamp = Date.now();
    const levelData: LevelData = {
      id: editingLevelId || timestamp,
      level: editingLevelId ? (editingLevelId % 1000) + 1000 : 1000 + (timestamp % 1000),
      name: levelName,
      playerStart: [playerStart[0], playerStart[1]],
      kings: kings.map(k => [k[0], k[1]]),
      enemies: enemies.map(e => ({
        type: e.type,
        position: [e.position[0], e.position[1]]
      })),
      boxes: boxes.map(b => [b[0], b[1]]),
      holes: holes.map(h => [h[0], h[1]]),
      isCustom: true,
      boardSize: boardSize
    };
    
    return levelData as LevelData;
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
            handleTestLevel={handleTestLevel}
            canSaveLevel={canSaveLevel}
            isEditMode={isEditMode}
          />
          <EditorSidebar
            levelName={levelName}
            setLevelName={setLevelName}
            boardSize={[boardSize, boardSize]}
            handleBoardSizeChange={handleBoardSizeChange}
            selectedCellType={selectedCellType}
            setSelectedCellType={setSelectedCellType}
            generateLevelData={generateLevelData}
            isEditMode={isEditMode}
          />
        </div>
        <div className="fixed bottom-4 right-4 text-xs text-zinc-500">
          <AuthorFooter />
        </div>
      </div>
    </div>
  );

  function handleBoardSizeChange(newSize: number[]) {
    setBoardSize(newSize[0]);
  }
};

export default LevelEditor;
