
import React from 'react';
import { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import GameLoading from '@/components/GameLoading';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import VictoryPopup from '@/components/VictoryPopup';
import GameHeader from '@/components/game/GameHeader';
import GameFooter from '@/components/game/GameFooter';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import AuthorFooter from '@/components/AuthorFooter';
import GameTitle from '@/components/GameTitle';
import GameBoard from '@/components/GameBoard';
import { useScores } from '@/hooks/game/useScores';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalSteps } = useScores();

  // Extract levelId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const levelId = queryParams.get('levelId');
  const mode = queryParams.get('mode');
  
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSightLines, setShowSightLines] = useState(false);

  const {
    gameState,
    movePlayer,
    resetLevel,
    undoMove,
    redoMove,
    canUndo,
    canRedo,
    ninjaInstinctAvailable,
    isGameOver,
    isVictory,
    initializeGame,
  } = useGameLogic();

  // Load level when levelId changes
  useEffect(() => {
    console.log('Loading game with mode:', mode, 'levelId:', levelId);
    setIsLoading(true);
    setLoadingError(null);
    
    const loadGame = async () => {
      try {
        if (mode === 'test' || mode === 'custom') {
          const storedLevel = localStorage.getItem('testing_level');
          console.log(
            'Stored level from localStorage:',
            storedLevel ? 'exists' : 'not found'
          );

          if (!storedLevel) {
            throw new Error('No level data found');
          }

          const parsedLevel = JSON.parse(storedLevel);
          console.log('Parsed level data:', parsedLevel);

          // Validate level data
          if (!parsedLevel.playerStart) {
            throw new Error('Missing player start position');
          }

          if (!parsedLevel.kings || parsedLevel.kings.length === 0) {
            throw new Error('Level must have at least one king');
          }
          
          const success = await initializeGame(parsedLevel, true);
          if (!success) {
            throw new Error('Failed to initialize game');
          }
        } else if (levelId) {
          const levelNumber = parseInt(levelId, 10);
          console.log('Loading standard level number:', levelNumber);
          const success = await initializeGame(levelNumber);
          if (!success) {
            throw new Error('Failed to initialize game');
          }
        } else {
          throw new Error('No level ID provided');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading level:', error);
        setLoadingError(`${error instanceof Error ? error.message : 'Unknown error loading level'}`);
        setIsLoading(false);
      }
    };
    
    loadGame();
  }, [levelId, mode, initializeGame]);
  
  const handleMove = (direction: number[]) => {
    // Ensure we're passing a direction array to movePlayer
    if (direction && direction.length === 2) {
      movePlayer(direction);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameState || isLoading) return;
    
    switch (e.key) {
      case 'ArrowUp':
        handleMove([-1, 0]);
        break;
      case 'ArrowDown':
        handleMove([1, 0]);
        break;
      case 'ArrowLeft':
        handleMove([0, -1]);
        break;
      case 'ArrowRight':
        handleMove([0, 1]);
        break;
      case 'z':
      case 'Z':
        if (canUndo) undoMove();
        break;
      case 'y':
      case 'Y':
        if (canRedo) redoMove();
        break;
      default:
        break;
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, isLoading, canUndo, canRedo]);
  
  const backToEditor = () => {
    navigate('/editor?editMode=true');
  };

  // When there's an error or still loading
  if (loadingError || isLoading || !gameState) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <GameTitle />
        </div>
        <GameLoading 
          resetGame={mode === 'test' ? backToEditor : () => navigate('/levels')}
          errorMessage={loadingError || undefined}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <GameHeader 
        levelName=""
        resetLevel={resetLevel}
        undoMove={undoMove}
        redoMove={redoMove}
        canUndo={canUndo}
        canRedo={canRedo}
        isTestMode={mode === 'test'}
        backToEditor={backToEditor}
      />
      
      {isVictory && (
        <VictoryPopup 
          level={gameState.level}
          steps={gameState.steps}
          levelName={gameState.levelName}
          isCustomLevel={gameState.isCustomLevel}
          isTestMode={mode === 'test'}
          backToEditor={backToEditor}
          totalSteps={totalSteps}
        />
      )}
      
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-500">{gameState.levelName}</h2>
          
          <Button
            variant="outline"
            className="bg-purple-700 hover:bg-purple-800 text-zinc-100 flex items-center gap-2"
            onMouseDown={() => setShowSightLines(true)}
            onMouseUp={() => setShowSightLines(false)}
            onMouseLeave={() => setShowSightLines(false)}
            onTouchStart={() => setShowSightLines(true)}
            onTouchEnd={() => setShowSightLines(false)}
            disabled={ninjaInstinctAvailable <= 0}
          >
            <Eye className="h-4 w-4" />
            Ninja Instinct: {ninjaInstinctAvailable}
          </Button>
        </div>
        
        <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800 relative">
          <GameBoard 
            board={gameState.board} 
            sightLines={gameState.sightLines}
            showSightLines={showSightLines}
            playerPosition={gameState.playerPosition}
            playerDetected={gameState.gameOver}
            detectingEnemies={gameState.detectingEnemies || []}
          />
        </div>
        
        <GameFooter
          steps={gameState.steps}
          ninjaInstinctAvailable={ninjaInstinctAvailable}
        />
      </div>
      
      <div className="fixed bottom-4 right-4 text-xs text-zinc-500">
        <AuthorFooter />
      </div>
    </div>
  );
};

export default GamePage;
