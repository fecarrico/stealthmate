
import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameMessage from '@/components/GameMessage';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { GameState } from '@/hooks/game/types';
import { Card } from '@/components/ui/card';

interface GameAreaProps {
  gameState: GameState;
  showSightLines: boolean;
  setShowSightLines: (show: boolean) => void;
}

const GameArea: React.FC<GameAreaProps> = ({
  gameState,
  showSightLines,
  setShowSightLines,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <Card className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800">
        <div className="w-full mx-auto">
          {/* Ninja Instinct Button */}
          <div className="mb-4 flex justify-center">
            <Button
              className="bg-purple-700 hover:bg-purple-800 text-zinc-100 flex items-center gap-2 py-2 px-4"
              onMouseDown={() => setShowSightLines(gameState.ninjaInstinct > 0)}
              onMouseUp={() => setShowSightLines(false)}
              onMouseLeave={() => setShowSightLines(false)}
              disabled={gameState.ninjaInstinct <= 0}
            >
              <Eye className="h-5 w-5" />
              Ninja Instinct
              <span className="bg-purple-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                {gameState.ninjaInstinct}
              </span>
            </Button>
          </div>
          
          {/* Game Board */}
          <div className="aspect-square w-full">
            <GameBoard 
              board={gameState.board} 
              sightLines={gameState.sightLines}
              showSightLines={showSightLines}
            />
          </div>
        </div>
      </Card>
      
      {gameState.message && (
        <div className="mt-4">
          <GameMessage 
            message={gameState.message}
            isError={gameState.gameOver}
            isSuccess={gameState.victory} 
          />
        </div>
      )}
    </div>
  );
};

export default GameArea;
