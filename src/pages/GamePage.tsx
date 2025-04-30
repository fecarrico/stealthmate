
import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/components/ui/sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VictoryPopup from '@/components/VictoryPopup';
import GameModeComponent from '@/components/GameMode';
import { Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSightLines, setShowSightLines] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);

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
    loadCustomLevel,
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
    const mode = searchParams.get('mode');
    
    if (mode === 'test') {
      setIsTestMode(true);
      // Load the test level from localStorage
      const testLevelStr = localStorage.getItem('testing_level');
      if (testLevelStr) {
        try {
          const testLevel = JSON.parse(testLevelStr);
          loadCustomLevel(testLevel);
        } catch (error) {
          console.error("Failed to load test level:", error);
          navigate('/editor');
        }
      } else {
        navigate('/editor');
      }
    } else if (levelId) {
      loadLevel(parseInt(levelId, 10));
    }
  }, [searchParams, loadLevel, loadCustomLevel, navigate]);

  const handleBackToEditor = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-amber-500 flex items-center gap-2">
        <Shield className="h-8 w-8" />
        StealthMate
      </h1>
      
      {gameState && (
        <>
          {showVictory && (
            <VictoryPopup
              steps={gameState.steps}
              onNextLevel={nextLevel}
              onReplayLevel={resetLevel}
              levelName={gameState.levelName}
            />
          )}
          
          <Card className="bg-zinc-900 border-zinc-800 p-4 w-full max-w-2xl">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex justify-between items-center">
                <span className="text-2xl font-bold text-amber-500">{gameState.levelName}</span>
                
                <div className="flex gap-2">
                  {isTestMode && (
                    <Button 
                      variant="outline" 
                      className="border-zinc-700 text-zinc-300"
                      onClick={handleBackToEditor}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Back to Editor
                    </Button>
                  )}
                  {!isTestMode && (
                    <Button 
                      variant="outline" 
                      className="border-zinc-700 text-zinc-300"
                      onClick={() => navigate('/levels')}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Level Select
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
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
            </CardContent>
          </Card>
        </>
      )}
      
      <div className="w-full max-w-6xl mt-8 text-xs text-right text-zinc-500">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>
    </div>
  );
};

export default GamePage;
