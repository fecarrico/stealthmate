
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LevelNameInput from './LevelNameInput';
import BoardSizeControl from './BoardSizeControl';
import CellTypeSelector from './CellTypeSelector';
import LevelCodeGenerator from './LevelCodeGenerator';
import { CellType, LevelData } from '@/utils/levelData';

interface EditorSidebarProps {
  levelName: string;
  setLevelName: (name: string) => void;
  boardSize: [number, number];
  handleBoardSizeChange: (newSize: number[]) => void;
  selectedCellType: CellType;
  setSelectedCellType: (type: CellType) => void;
  generateLevelData: () => LevelData | null;
  isEditMode?: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  levelName,
  setLevelName,
  boardSize,
  handleBoardSizeChange,
  selectedCellType,
  setSelectedCellType,
  generateLevelData,
  isEditMode
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Level Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LevelNameInput levelName={levelName} setLevelName={setLevelName} />
          <BoardSizeControl boardSize={boardSize} handleBoardSizeChange={handleBoardSizeChange} />
        </CardContent>
      </Card>
      
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Piece Selector</CardTitle>
        </CardHeader>
        <CardContent>
          <CellTypeSelector 
            selectedCellType={selectedCellType} 
            setSelectedCellType={setSelectedCellType} 
          />
        </CardContent>
      </Card>
      
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Level Code</CardTitle>
        </CardHeader>
        <CardContent>
          <LevelCodeGenerator generateLevelData={generateLevelData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorSidebar;
