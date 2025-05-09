
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameLoading from '@/components/GameLoading';
import { useGameLogic } from '@/hooks/game/useGameLogic'; 
import LevelVictoryPopup from '@/components/LevelVictoryPopup';
import FinalVictoryPopup from '@/components/FinalVictoryPopup';
import GameOverPopup from '@/components/GameOverPopup';
import GameHeader from '@/components/game/GameHeader'; // This line appears to be a duplicate or misplaced. Removing it.
import { useIsMobile } from '@/hooks/use-mobile';
import GameFooter from '@/components/game/GameFooter';
import { Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import AuthorFooter from '@/components/AuthorFooter';
import GameTitle from '@/components/GameTitle';
import GameBoard from '@/components/GameBoard';
import { useScores } from '@/hooks/game/useScores';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

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
    isGameOver,
    isVictory,
    initializeGame,
    showFinalVictoryPopup,
    lives,
    gameOverState,
    ninjaInstinctAvailable,
    toggleSightLines
  } = useGameLogic();

  // Load level when levelId changes
  useEffect(() => {
    console.log('Loading game with mode:', mode, 'levelId:', levelId);
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
  
  const handleMove = (direction: [number, number]) => {
    // Don't allow movement when player is detected (until they undo)
    if (gameState && gameState.gameOver && !gameOverState) {
      toast.error("You've been spotted! Press Undo to continue.");
      return;
    }
    
    movePlayer(direction);
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameState || isLoading) return;
    
    // Don't allow movement when player is detected (until they undo)
    if (gameState.gameOver && !gameOverState) {
      if (e.key === 'z' || e.key === 'Z') {
        undoMove();
      }
      return;
    }
    
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
  }, [gameState, isLoading, canUndo, canRedo, undoMove, redoMove]);
  
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

  const handleNinjaInstinct = (show: boolean) => {
    toggleSightLines(show);
  };

  // Render ninja emojis based on remaining lives
  const renderLives = () => {
    const livesList = [];
    for (let i = 0; i < lives; i++) {
      livesList.push(<span key={i} className="text-lg">🥷</span>);
    }
    return livesList;
  };
  
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
      
      {showFinalVictoryPopup ? (
        <FinalVictoryPopup
          totalSteps={gameState?.steps}
          onBackToLevels={() => navigate('/levels')}
        />
      ) : isVictory && !showFinalVictoryPopup ? (
        <LevelVictoryPopup
          level={gameState.level}
          steps={gameState.steps}
          levelName={gameState.levelName}
          isCustomLevel={gameState.isCustomLevel}
          isTestMode={mode === 'test'}
          backToEditor={backToEditor}
        />
      ) : null}
      {gameOverState && (
        <GameOverPopup 
          onRestart={resetLevel}
          onBackToLevels={() => navigate('/levels')}
        />
      )}
      
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-500">{gameState.levelName}</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="flex">{renderLives()}</div>
            </div>
            
            <Button
              variant="outline"
              className={`${ninjaInstinctAvailable > 0 ? 'bg-purple-700 hover:bg-purple-800' : 'bg-red-700 hover:bg-red-800'} text-zinc-100 flex items-center gap-2`}
              onMouseDown={() => handleNinjaInstinct(true)}
              onMouseUp={() => handleNinjaInstinct(false)}
              onMouseLeave={() => handleNinjaInstinct(false)}
              onTouchStart={() => handleNinjaInstinct(true)}
              onTouchEnd={() => handleNinjaInstinct(false)}
              disabled={ninjaInstinctAvailable <= 0}
            >
              <Eye className="h-4 w-4" />
              Ninja Instinct: {ninjaInstinctAvailable}
            </Button>
          </div>
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

        {/* Mobile Controls */}
        {isMobile && (
          <div className="mt-4">
            <div className="flex flex-col items-center gap-2">
              <Button 
                variant="outline"
                className="h-12 w-12 flex items-center justify-center bg-zinc-800"
                onClick={() => handleMove([-1, 0])}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="h-12 w-12 flex items-center justify-center bg-zinc-800"
                  onClick={() => handleMove([0, -1])}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-12 w-12 flex items-center justify-center bg-zinc-800"
                  onClick={() => handleMove([1, 0])}
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-12 w-12 flex items-center justify-center bg-zinc-800"
                  onClick={() => handleMove([0, 1])}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <GameFooter
          steps={gameState.steps}
          ninjaInstinctAvailable={ninjaInstinctAvailable}
          lives={lives}
        />
      </div>
      
      <div className="fixed bottom-4 right-4 text-xs text-zinc-500">
        <AuthorFooter />
      </div>
    </div>
  );
};

export default GamePage;
