
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GameArea } from './GameArea';
import { GameState } from '@/hooks/game/types';

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
  ninjaInstinctAvailable: number;
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
  ninjaInstinctAvailable,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-amber-500">{gameState.levelName}</h2>
      <GameArea
        gameState={gameState}
        showSightLines={showSightLines}
        setShowSightLines={setShowSightLines}
        ninjaInstinctAvailable={ninjaInstinctAvailable}
      />
    </div>
  );
};

export default GameMode;
