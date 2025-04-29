
import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameMessage from '@/components/GameMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { GameState } from '@/hooks/game/types';

interface GameAreaProps {
  gameState: GameState;
  showSightLines: boolean;
  setShowSightLines: (show: boolean) => void;
  levelCode: string;
  setLevelCode: (code: string) => void;
  handleLoadCode: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({
  gameState,
  showSightLines,
  setShowSightLines,
  levelCode,
  setLevelCode,
  handleLoadCode
}) => {
  return (
    <div className="flex-1">
      <div className="bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-800">
        <div className="w-full max-w-lg mx-auto">
          {/* Ninja Instinct Button */}
          <div className="mb-2 flex justify-center">
            <button
              className="ninja-instinct-button"
              onMouseDown={() => setShowSightLines(gameState.ninjaInstinct > 0)}
              onMouseUp={() => setShowSightLines(false)}
              onMouseLeave={() => setShowSightLines(false)}
              disabled={gameState.ninjaInstinct <= 0}
            >
              <Eye className="h-5 w-5" />
              Ninja Instinct
              <span className="ninja-instinct-counter">{gameState.ninjaInstinct}</span>
            </button>
          </div>
          
          {/* Game Board */}
          <div className="aspect-square">
            <GameBoard 
              board={gameState.board} 
              sightLines={gameState.sightLines}
              showSightLines={showSightLines}
            />
          </div>
        </div>
      </div>
      
      {gameState.message && (
        <div className="mt-4">
          <GameMessage 
            message={gameState.message}
            isError={gameState.gameOver}
            isSuccess={gameState.victory} 
          />
        </div>
      )}
      
      <div className="mt-4">
        <div className="bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter level code..." 
              value={levelCode}
              onChange={(e) => setLevelCode(e.target.value)}
              className="flex-grow bg-zinc-800 border-zinc-700"
            />
            <Button onClick={handleLoadCode} className="game-button bg-amber-600 hover:bg-amber-700">
              Load Level
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArea;
