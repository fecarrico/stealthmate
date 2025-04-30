import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import GameArea from './GameArea';
import { GameState } from '@/hooks/useGameState';
interface GameModeProps {
  gameState: GameState;
  resetGame: () => void;
  showSightLines: boolean;
  setShowSightLines: (show: boolean) => void;
  nextLevel: () => void;
  resetLevel: () => void;
  levelComplete: boolean;
  allLevelsComplete: boolean;
  totalSteps: number;
}
const GameMode: React.FC<GameModeProps> = ({
  gameState,
  resetGame,
  showSightLines,
  setShowSightLines,
  nextLevel,
  resetLevel,
  levelComplete,
  allLevelsComplete,
  totalSteps,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-white">{gameState.levelName}</h2>
      <GameArea
        gameState={gameState}
        showSightLines={showSightLines}
        setShowSightLines={setShowSightLines}
      />

      <div className="mt-4">
        <Button
          onClick={() => navigate('/levels')}
          className="game-button bg-amber-600 hover:bg-amber-700"
        >
          Back to level select
        </Button>
      </div>
    </div>
  );
};

export default GameMode;
