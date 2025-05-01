
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GameLoadingProps {
  resetGame: () => void;
  errorMessage?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ resetGame, errorMessage }) => {
  return (
    <div className="text-zinc-300 flex flex-col items-center">
      {errorMessage ? (
        <>
          <p className="mb-4 text-red-400">{errorMessage}</p>
          <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
            Return to Levels
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <p>Loading game...</p>
          </div>
          <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
            Start Game
          </Button>
        </>
      )}
    </div>
  );
};

export default GameLoading;
