
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CellType, GameCell, LevelData, saveCustomLevel } from '@/utils/levelData';
import GameBoard from './GameBoard';
import { getCellAt } from '@/utils/gameLogic';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Shield, Box, Play, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  
  const generateLevelData = (): LevelData | null => {
    if (playerStart[0] === -1 || kings.length === 0) {
      toast.error("Level must have a player and at least one king");
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
  
  const generateLevelCode = () => {
    const levelData = generateLevelData();
    if (levelData) {
      const levelCode = btoa(JSON.stringify(levelData));
      navigator.clipboard.writeText(levelCode);
      toast.success("Level code copied to clipboard");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="text-amber-500 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>StealthMate Level Editor</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="border-zinc-700 text-zinc-300"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSaveLevel} className="bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium">
                <Save className="mr-1 h-4 w-4" />
                Save Level
              </Button>
              <Button onClick={handleTestLevel} className="bg-green-600 hover:bg-green-700 text-zinc-950 font-medium">
                <Play className="mr-1 h-4 w-4" />
                Test Level
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-square max-w-lg mx-auto">
            <GameBoard 
              board={board} 
              sightLines={[]} 
              editorMode={true}
              onCellClick={handleCellClick}
              selectedCell={selectedCell}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Level Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Level Name</label>
              <Input 
                value={levelName} 
                onChange={(e) => setLevelName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="space-y-2">
              <label>Board Size: {boardSize[0]}x{boardSize[1]}</label>
              <Slider 
                defaultValue={[5]} 
                min={2} 
                max={15} 
                step={1} 
                onValueChange={handleBoardSizeChange}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Piece Selector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CellType).map((type) => (
                <Button 
                  key={type}
                  variant={selectedCellType === type ? "default" : "outline"}
                  onClick={() => setSelectedCellType(type)}
                  className={`h-16 ${selectedCellType !== type ? 'border-zinc-700 hover:bg-zinc-800' : ''} text-zinc-950`}
                >
                  <div className="flex flex-col items-center">
                    {type === CellType.PLAYER && (
                      <Shield className="w-5 h-5 mb-1" />
                    )}
                    {type === CellType.BOX && (
                      <Box className="w-5 h-5 mb-1" />
                    )}
                    {type !== CellType.PLAYER && type !== CellType.BOX && (
                      <div className="w-5 h-5 mb-1">{
                        type === CellType.KING ? '♔' : 
                        type === CellType.ROOK ? '♖' : 
                        type === CellType.BISHOP ? '♗' : 
                        type === CellType.QUEEN ? '♕' : ''
                      }</div>
                    )}
                    <span className="text-xs">{type}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Level Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateLevelCode} 
              className="w-full text-zinc-950"
              variant="outline"
            >
              Generate & Copy Code
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-3 text-xs text-right text-zinc-500">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>
    </div>
  );
};

export default LevelEditor;
