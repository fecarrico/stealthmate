
import React, { useEffect, useCallback } from 'react';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import GameMessage from '@/components/GameMessage';
import { useGameState } from '@/hooks/useGameState';
import { toast } from "@/components/ui/sonner";

const Index = () => {
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
  } = useGameState();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    [movePlayer, undoMove]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState?.gameOver) {
      toast.error("You were spotted! Press Z to undo your last move.");
    }
  }, [gameState?.gameOver]);

  useEffect(() => {
    if (levelComplete) {
      toast.success(`Level ${gameState?.level} complete!`);
    }
  }, [levelComplete, gameState?.level]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-primary">Chess Hide & Seek</h1>
      
      {!gameState ? (
        <p>Loading game...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-4xl">
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="w-full aspect-square max-w-lg mx-auto">
                <GameBoard board={gameState.board} sightLines={gameState.sightLines} />
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
          </div>
          
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
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Move with arrow keys. Press Z to undo.</p>
        <p>Capture all kings without being spotted by the enemy pieces.</p>
      </div>
    </div>
  );
};

export default Index;
