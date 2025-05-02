
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameCell } from '@/utils/levelData';
import GameBoard from '../GameBoard';
import EditorHeader from './EditorHeader';

interface LevelEditorBoardProps {
  board: GameCell[][];
  sightLines: any[];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  handleTestLevel: () => void;
  canSaveLevel: boolean;
}

const LevelEditorBoard: React.FC<LevelEditorBoardProps> = ({
  board,
  sightLines,
  selectedCell,
  onCellClick,
  handleTestLevel,
  canSaveLevel
}) => {
  return (
    <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardHeader>
        <CardTitle>
          <EditorHeader 
            handleTestLevel={handleTestLevel} 
            canSave={canSaveLevel}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-square max-w-lg mx-auto">
          <GameBoard 
            board={board} 
            sightLines={sightLines} 
            editorMode={true}
            onCellClick={onCellClick}
            selectedCell={selectedCell}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelEditorBoard;
