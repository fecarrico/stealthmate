import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add missing import
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface GameControlsProps {
  resetLevel: () => void;
  navigate: (path: string) => void;
  undoMove: () => void;
  canUndo: boolean;
  redoMove: () => void;
  canRedo: boolean;
  levelName: string | undefined;
}

const GameControls: React.FC<GameControlsProps> = ({
  resetLevel,
  navigate,
  undoMove,
  canUndo,
  redoMove,
  canRedo,
  levelName,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button variant="outline" className="mr-2 border-zinc-700 text-zinc-300" onClick={() => navigate('/levels')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Levels
        </Button>
        <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={resetLevel}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Level
        </Button>
      </div>
      <div className="text-xl font-bold">{levelName}?</div>
      <div>
        <Button variant="outline" className="mr-2 border-zinc-700 text-zinc-300" onClick={undoMove} disabled={!canUndo}>
          <ChevronsLeft className="mr-2 h-4 w-4" />
          Undo</Button>
        <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={redoMove} disabled={!canRedo}><ChevronsRight className="mr-2 h-4 w-4" />Redo</Button>
      </div>
    </div>
  );
};

export default GameControls; // Export component as default

