
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleX, RotateCw } from 'lucide-react';

interface GameOverPopupProps {
  onRestart: () => void;
  onBackToLevels: () => void;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ onRestart, onBackToLevels }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8 max-w-md text-center transform animate-scale-in">
        <CircleX className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h2>
        <p className="text-zinc-400 mb-6">
          You've been spotted too many times!
        </p>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onBackToLevels} 
            className="bg-zinc-600 hover:bg-zinc-700 text-zinc-100"
          >
            Back to Levels
          </Button>
          <Button 
            onClick={onRestart} 
            className="bg-amber-600 hover:bg-amber-700 text-zinc-950 flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverPopup;
