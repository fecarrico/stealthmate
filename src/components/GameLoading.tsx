
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameLoadingProps {
  resetGame: () => void;
}

const GameLoading: React.FC<GameLoadingProps> = ({ resetGame }) => {
  return (
    <div className="text-gray-300 flex flex-col items-center">
      <p className="mb-4">Loading game...</p>
      <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
        Start Game
      </Button>
    </div>
  );
};

export default GameLoading;
