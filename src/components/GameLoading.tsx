
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';

interface GameLoadingProps {
  resetGame: () => void;
  errorMessage?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ resetGame, errorMessage }) => {
  return (
    <div className="text-zinc-300 flex flex-col items-center justify-center min-h-[200px]">
      <Shield className="h-12 w-12 text-amber-500 mb-4" />
      {errorMessage ? (
        <>
          <p className="mb-4 text-red-400 text-center">{errorMessage}</p>
          <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
            Return to Levels
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <p className="text-lg">Loading game...</p>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Please wait while the level is being prepared.</p>
          <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
            Return to Levels
          </Button>
        </>
      )}
    </div>
  );
};

export default GameLoading;
