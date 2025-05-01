
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, ChevronsLeft, ChevronsRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameHeaderProps {
  levelName: string;
  resetLevel: () => void;
  undoMove: () => void;
  redoMove: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  levelName,
  resetLevel,
  undoMove,
  redoMove,
  canUndo,
  canRedo
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="text-center mb-4">
        <div className="flex justify-center items-center mb-2">
          <Shield className="h-6 w-6 text-amber-500 mr-2" />
          <h1 className="text-2xl font-bold text-amber-500">StealthMate</h1>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button 
            variant="outline" 
            className="mr-2 border-zinc-700 text-zinc-300"
            onClick={() => navigate('/levels')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Levels
          </Button>
          <Button 
            variant="outline" 
            className="border-zinc-700 text-zinc-300"
            onClick={resetLevel}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Level
          </Button>
        </div>
        
        <div className="text-xl font-bold">
          {levelName}
        </div>
        
        <div>
          <Button 
            variant="outline" 
            className="mr-2 border-zinc-700 text-zinc-300"
            onClick={undoMove}
            disabled={!canUndo}
          >
            <ChevronsLeft className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button 
            variant="outline" 
            className="border-zinc-700 text-zinc-300"
            onClick={redoMove}
            disabled={!canRedo}
          >
            <ChevronsRight className="mr-2 h-4 w-4" />
            Redo
          </Button>
        </div>
      </div>
    </>
  );
};

export default GameHeader;
