
import React from 'react';
import GameLoading from '@/components/GameLoading';
import GameArea from '@/components/GameArea';
import GameControls from '@/components/GameControls';
import LevelSelector from '@/components/LevelSelector';
import { GameState } from '@/hooks/game/types';

interface GameModeProps {
  gameState: GameState | null;
  resetGame: () => void;
  showSightLines: boolean;
  setShowSightLines: (show: boolean) => void;
  levelCode: string;
  setLevelCode: (code: string) => void;
  handleLoadCode: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  levelComplete: boolean;
  allLevelsComplete: boolean;
  totalSteps: number[];
  bestScores: Record<number, number>;
  handleSelectLevel: (levelId: number) => void;
}

const GameMode: React.FC<GameModeProps> = ({
  gameState,
  resetGame,
  showSightLines,
  setShowSightLines,
  levelCode,
  setLevelCode,
  handleLoadCode,
  nextLevel,
  resetLevel,
  levelComplete,
  allLevelsComplete,
  totalSteps,
  bestScores,
  handleSelectLevel
}) => {
  if (!gameState) {
    return <GameLoading resetGame={resetGame} />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      <GameArea 
        gameState={gameState}
        showSightLines={showSightLines}
        setShowSightLines={setShowSightLines}
        levelCode={levelCode}
        setLevelCode={setLevelCode}
        handleLoadCode={handleLoadCode}
      />
      
      <div className="w-full max-w-sm">
        <GameControls
          onNextLevel={nextLevel}
          onResetLevel={resetLevel}
          onResetGame={resetGame}
          isLevelComplete={levelComplete}
          isAllLevelsComplete={allLevelsComplete}
          level={gameState.level}
          steps={gameState.steps}
          totalSteps={totalSteps}
        />
        
        <div className="mt-4 flex justify-center">
          <LevelSelector 
            onSelectLevel={handleSelectLevel}
            currentLevel={gameState.level}
            bestScores={bestScores}
          />
        </div>
      </div>
    </div>
  );
};

export default GameMode;
