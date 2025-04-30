import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/components/ui/sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VictoryPopup from '@/components/VictoryPopup';
import GameModeComponent from '@/components/GameMode';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSightLines, setShowSightLines] = useState<boolean>(false);

  const {
    gameState,
    movePlayer,
    undoMove,
    nextLevel,
    resetLevel,
    resetGame,
    levelComplete,
    allLevelsComplete,
    totalSteps,
    showVictory,
    loadLevel,
  } = useGameState();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameState) return;

      switch (event.key) {
        case 'ArrowUp':
          movePlayer('up');
          event.preventDefault();
          break;
        case 'ArrowDown':
          movePlayer('down');
          event.preventDefault();
          break;
        case 'ArrowLeft':
          movePlayer('left');
          event.preventDefault();
          break;
        case 'ArrowRight':
          movePlayer('right');
          event.preventDefault();
          break;
        case 'z':
        case 'Z':
          undoMove();
          event.preventDefault();
          break;
        default:
          break;
      }
    },
    [movePlayer, undoMove, gameState]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState?.gameOver) {
      toast.error('You were spotted! Press Z to undo your last move.');
    }
  }, [gameState?.gameOver]);

  useEffect(() => {
    const levelId = searchParams.get('levelId');
    if (levelId) {
      loadLevel(parseInt(levelId));
    }
  }, [searchParams, loadLevel, navigate]);

  return (
    <div className="flex flex-col items-center">
      {gameState && (
        <>
        {showVictory && (
          <VictoryPopup
            steps={gameState.steps}
            onNextLevel={nextLevel}
            onReplayLevel={resetLevel}
            levelName={gameState.levelName}
          />)}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {gameState.levelName}
          </h2>
          {gameState && (
            <GameModeComponent
              gameState={gameState}
              resetGame={resetGame}
              showSightLines={showSightLines}
              setShowSightLines={setShowSightLines}
              nextLevel={nextLevel}
              resetLevel={resetLevel}
              levelComplete={levelComplete}
              allLevelsComplete={allLevelsComplete}
              totalSteps={totalSteps}
            />
          )}
          
        <div className="mt-4">
          <Button onClick={() => navigate('/levels')} className="game-button bg-amber-600 hover:bg-amber-700">
            Back to level select
          </Button>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default GamePage;
