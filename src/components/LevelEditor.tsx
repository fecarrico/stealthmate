import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelEditorBoard from './levelEditor/LevelEditorBoard';
import EditorSidebar from './levelEditor/EditorSidebar';
import { LevelData, CellType, GameCell } from '@/utils/levelData';
import { toast } from '@/components/ui/sonner';
import AuthorFooter from './AuthorFooter';

const LevelEditor: React.FC = () => {
  const [boardSize, setBoardSize] = useState(5);
  const [board, setBoard] = useState<GameCell[][]>([]);
  const [sightLines, setSightLines] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [activeTool, setActiveTool] = useState<CellType>(CellType.EMPTY);
  const [levelName, setLevelName] = useState<string>("Custom Level");
  const [playerStart, setPlayerStart] = useState<[number, number]>([-1, -1]);
  const [kings, setKings] = useState<[number, number][]>([]);
  const [enemies, setEnemies] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<[number, number][]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    initializeBoard();
  }, [boardSize]);

  const initializeBoard = useCallback(() => {
    const newBoard: GameCell[][] = Array.from(
      { length: boardSize },
      (_, y) =>
        Array.from({ length: boardSize }, (_, x) => ({
          type: CellType.EMPTY,
          position: [x, y],
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
          let newType = activeTool;

          if (activeTool === CellType.PLAYER) {
            // Clear previous player position
            if (playerStart[0] !== -1 && playerStart[1] !== -1) {
              board[playerStart[0]][playerStart[1]].type = CellType.EMPTY;
            }
            setPlayerStart([row, col]);
            newType = CellType.PLAYER;
          }

          if (activeTool === CellType.KING) {
            const isKingAlready = kings.some(king => king[0] === row && king[1] === col);
            if (!isKingAlready) {
              setKings([...kings, [row, col]]);
            }
            newType = CellType.KING;
          } else {
            // Remove king if the cell is already a king and we're changing it
            setKings(kings.filter(king => !(king[0] === row && king[1] === col)));
          }

          if (activeTool === CellType.EMPTY && cell.type === CellType.PLAYER) {
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
    
    const kingsData = kings.map(king => [king[0], king[1]]);
    const boxesData = boxes.map(box => [box[0], box[1]]);

    const levelData: LevelData = {
      name: levelName,
      level: 0,
      boardSize: boardSize,
      playerStart: [playerStart[0], playerStart[1]],
      kings: kingsData,
      enemies: enemies,
      boxes: boxesData,
    };
    return levelData;
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
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            levelName={levelName}
            setLevelName={setLevelName}
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            generateLevelData={generateLevelData}
          />
        </div>
        <AuthorFooter />
      </div>
    </div>
  );
};

export default LevelEditor;
