
import React, { useState, useEffect } from 'react';
import { CellType, GameCell, LevelData, saveCustomLevel } from '@/utils/levelData';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import LevelEditorBoard from './levelEditor/LevelEditorBoard';
import EditorSidebar from './levelEditor/EditorSidebar';
import AuthorFooter from './levelEditor/AuthorFooter';

const LevelEditor: React.FC = () => {
  const [boardSize, setBoardSize] = useState<[number, number]>([5, 5]);
  const [selectedCellType, setSelectedCellType] = useState<CellType>(CellType.EMPTY);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [playerStart, setPlayerStart] = useState<[number, number]>([0, 0]);
  const [kings, setKings] = useState<[number, number][]>([]);
  const [enemies, setEnemies] = useState<{ type: CellType; position: [number, number] }[]>([]);
  const [boxes, setBoxes] = useState<[number, number][]>([]);
  const [levelName, setLevelName] = useState<string>("Custom Level");
  const navigate = useNavigate();
  
  // Initialize empty board
  const [board, setBoard] = useState<GameCell[][]>([]);
  
  useEffect(() => {
    initializeBoard();
  }, [boardSize]);
  
  const initializeBoard = () => {
    const [rows, cols] = boardSize;
    const newBoard: GameCell[][] = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            type: CellType.EMPTY,
            position: [row, col],
          }))
      );
    
    setBoard(newBoard);
    
    // Reset positions
    setPlayerStart([0, 0]);
    setKings([]);
    setEnemies([]);
    setBoxes([]);
    
    // Set player at start
    newBoard[0][0].type = CellType.PLAYER;
  };
  
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
    
    if (selectedCellType !== null) {
      const newBoard = [...board];
      const oldType = newBoard[row][col].type;
      
      // Remove from respective arrays if needed
      if (oldType === CellType.PLAYER) {
        // Skip if trying to remove the player with no new player placed
        if (selectedCellType !== CellType.PLAYER) {
          setPlayerStart([-1, -1]); // Invalid position to indicate no player
        }
      } else if (oldType === CellType.KING) {
        setKings(kings.filter(([r, c]) => r !== row || c !== col));
      } else if (oldType === CellType.ROOK || oldType === CellType.BISHOP || oldType === CellType.QUEEN) {
        setEnemies(enemies.filter(e => e.position[0] !== row || e.position[1] !== col));
      } else if (oldType === CellType.BOX) {
        setBoxes(boxes.filter(([r, c]) => r !== row || c !== col));
      }
      
      // Add to respective arrays
      if (selectedCellType === CellType.PLAYER) {
        // Remove old player position if exists
        const newBoardWithoutPlayer = newBoard.map(row => 
          row.map(cell => {
            if (cell.type === CellType.PLAYER) {
              return { ...cell, type: CellType.EMPTY };
            }
            return cell;
          })
        );
        setBoard(newBoardWithoutPlayer);
        setPlayerStart([row, col]);
      } else if (selectedCellType === CellType.KING) {
        setKings([...kings, [row, col]]);
      } else if (selectedCellType === CellType.ROOK || 
                 selectedCellType === CellType.BISHOP || 
                 selectedCellType === CellType.QUEEN) {
        setEnemies([...enemies, { type: selectedCellType, position: [row, col] }]);
      } else if (selectedCellType === CellType.BOX) {
        setBoxes([...boxes, [row, col]]);
      }
      
      // Update board
      newBoard[row][col].type = selectedCellType;
      setBoard(newBoard);
    }
  };
  
  const handleBoardSizeChange = (newSize: number[]) => {
    // Convert value from slider (2-15) to board size
    const size = newSize[0];
    setBoardSize([size, size]);
  };
  
  const validateLevel = (): boolean => {
    // Check if player exists
    if (playerStart[0] === -1 || playerStart[1] === -1) {
      toast.error("Level must have a player");
      return false;
    }
    
    // Check if at least one king exists
    if (kings.length === 0) {
      toast.error("Level must have at least one king");
      return false;
    }
    
    return true;
  };
  
  const generateLevelData = (): LevelData | null => {
    if (!validateLevel()) {
      return null;
    }
    
    const levelData: LevelData = {
      id: Date.now(), 
      level: 1000 + Date.now() % 1000, // Use a high number for custom levels
      name: levelName,
      playerStart: playerStart,
      kings: kings,
      enemies: enemies,
      boxes: boxes,
      isCustom: true,
      board: Array(boardSize[0]).fill(0).map(() => Array(boardSize[1]).fill(0)),
    };
    
    return levelData;
  };
  
  const handleSaveLevel = () => {
    const levelData = generateLevelData();
    if (levelData) {
      saveCustomLevel(levelData);
      toast.success("Level saved successfully");
    }
  };
  
  const handleTestLevel = () => {
    const levelData = generateLevelData();
    if (levelData) {
      // Store the level in localStorage temporarily
      localStorage.setItem('testing_level', JSON.stringify(levelData));
      navigate('/game?mode=test');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LevelEditorBoard 
        board={board}
        sightLines={[]}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
        handleSaveLevel={handleSaveLevel}
        handleTestLevel={handleTestLevel}
      />
      
      <EditorSidebar 
        levelName={levelName}
        setLevelName={setLevelName}
        boardSize={boardSize}
        handleBoardSizeChange={handleBoardSizeChange}
        selectedCellType={selectedCellType}
        setSelectedCellType={setSelectedCellType}
        generateLevelData={generateLevelData}
      />
      
      <AuthorFooter />
    </div>
  );
};

export default LevelEditor;
