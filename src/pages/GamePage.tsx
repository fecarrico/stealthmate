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
import { useLevelManager } from '@/hooks/game/useLevelManager';
import { Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { LevelData } from '@/utils/levelData';
import GameArea from '@/components/GameArea';
import AuthorFooter from '@/components/AuthorFooter';
import GameTitle from '@/components/GameTitle';
import GameControls from '@/components/GameControls';
import GameBoard from '@/components/GameBoard';
const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract levelId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const levelId = queryParams.get('levelId');
  const mode = queryParams.get('mode');
  
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSightLines, setShowSightLines] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const [hintMoves, setHintMoves] = useState<number[][]>([]);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [hintCostMultiplier, setHintCostMultiplier] = useState(1);

  const {
    gameState,
    movePlayer,
    resetLevel,
    undoMove,
    redoMove,
    canUndo,
    canRedo,
    getHint,
    ninjaInstinctCost,
    ninjaInstinctAvailable,
    setNinjaInstinctAvailable,
    isGameOver,
    isVictory,
    initializeGame,
  } = useGameLogic();
  const { loadLevel, loadCustomLevel } = useLevelManager();

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
           
           loadCustomLevel(parsedLevel, (gameState) => {
             initializeGame(gameState, true);
           });
        } else if (levelId) {
          const levelNumber = parseInt(levelId, 10);
          console.log('Loading standard level number:', levelNumber);
          loadLevel(levelNumber, (gameState) => {
             initializeGame(gameState);
          });
        } else {
          throw new Error('No level ID provided');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading level:', error);
        setLoadingError(`${error instanceof Error ? error.message : 'Unknown error loading level'}`);
        setIsLoading(false);
      }
<<<<<<< Updated upstream
    };
    
    loadGame();
  }, [levelId, mode, initializeGame]);
=======
    } else if (levelId) {
      const levelNumber = parseInt(levelId, 10);
      loadLevel(levelNumber);
      // For standard levels we don't need to set levelData
    } else {
      console.error('No levelId provided');
      navigate('/levels');
    }
  }, [levelId, loadLevel, navigate, mode, loadCustomLevel]); 
  
  // Reset hint state when level is reset or a new level is loaded
  useEffect(() => {
    setShowHint(false);
    setHintStep(0);
    setHintMoves([]);
  }, [levelId]);
>>>>>>> Stashed changes
  
  const handleMove = (direction: number[]) => {
    movePlayer(direction);
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
      default:
        break;
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, isLoading]);
  
  const currentHintMove = showHint && hintMoves.length > 0 ? hintMoves[hintStep] : null;
  
  const backToEditor = () => {
    navigate('/editor');
  };

  // When there's an error or still loading
  if (loadingError || isLoading || !gameState) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <h1 className="text-2xl font-bold text-amber-500">StealthMate</h1>
          </div>
        </div>
        <GameLoading 
          resetGame={mode === 'test' ? backToEditor : () => navigate('/levels')}
          errorMessage={loadingError || undefined}
        />
      </div>
    );
  }
  
  return (
<<<<<<< Updated upstream
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
        />
      )}
      
      <div className="w-full max-w-2xl">
        {/* Level name moved here, above the board */}
        <h2 className="text-2xl font-bold mb-4 text-amber-500 text-center">{gameState.levelName}</h2>
        
        <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800 relative">
          {/* Ninja Instinct Button */}
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="outline"
              className="bg-purple-700 hover:bg-purple-800 text-zinc-100 flex items-center gap-2"
              onMouseDown={() => setShowSightLines(true)}
              onMouseUp={() => setShowSightLines(false)}
              onMouseLeave={() => setShowSightLines(false)}
              disabled={ninjaInstinctAvailable <= 0}
            >
              <Eye className="h-4 w-4" />
              Ninja Instinct: {ninjaInstinctAvailable}
            </Button>
          </div>
          
          <GameBoard 
            board={gameState.board} 
            sightLines={gameState.sightLines}
            playerPosition={gameState.playerPosition}
            currentHintMove={currentHintMove}
            showSightLines={showSightLines}
          />
        </div>
        
        <GameFooter
          steps={gameState.steps}
          ninjaInstinctAvailable={ninjaInstinctAvailable}
          ninjaInstinctCost={ninjaInstinctCost}
          getHint={getHint}
          setNinjaInstinctAvailable={setNinjaInstinctAvailable}
          showHint={showHint}
          hintMoves={hintMoves}
          hintStep={hintStep}
          setHintStep={setHintStep}
          setShowHint={setShowHint}
        />
      </div>
      
      <div className="mt-6 text-xs text-center text-zinc-500 w-full">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>
=======
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <GameTitle/>
        {isVictory && gameState && (
          <VictoryPopup 
            level={gameState.level || 1}
            steps={gameState.steps || 0}
            levelName={gameState.levelName}
          />
        )}
      
      {gameState !== null && (
        <div className="w-full max-w-2xl">
          <GameControls
              resetLevel={handleReset}
              navigate={navigate}
              undoMove={undoMove}
              redoMove={redoMove}
              canUndo={canUndo}
              canRedo={canRedo}
              levelName={gameState.levelName}
            />
            
            <div className="aspect-square">
              <GameArea gameState={gameState} showSightLines={true}
                currentHintMove={currentHintMove}/>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-zinc-400">
                Steps: <span className="font-bold text-zinc-200">{gameState.steps}</span>
              </div>
              
              <div className="text-sm text-zinc-400">
                Ninja Instinct: <span className="font-bold text-green-500">{ninjaInstinctAvailable}</span>
              </div>
              
              <Dialog open={hintDialogOpen} onOpenChange={setHintDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-zinc-700 text-zinc-300">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Hint ({hintCost})
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle>Get a Hint</DialogTitle>
                    <DialogDescription>Is this information correct?
                      Using a hint will cost you Ninja Instinct. Adjust the slider to choose how many steps to reveal.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="hint-steps" className="text-right">
                        Hint Steps
                      </label>
                      <Slider
                        id="hint-steps"
                        defaultValue={[1]}
                        max={5}
                        step={1}
                        onValueChange={(value) => setHintCostMultiplier(value[0])}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="hint-cost" className="text-right">
                        Hint Cost
                      </label>
                      <Input
                        type="text"
                        id="hint-cost"
                        value={hintCost.toString()}
                        readOnly
                        className="col-span-3 bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setHintDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleGetHint}>
                      Get Hint
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {showHint && hintMoves.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300"
                  onClick={handlePrevHint}
                  disabled={hintStep === 0}
                >
                  Previous Hint
                </Button>
                
                <span>
                  Hint Step: {hintStep + 1} / {hintMoves.length}
                </span>
                
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300"
                  onClick={handleNextHint}
                  disabled={hintStep === hintMoves.length - 1}
                >
                  Next Hint
                </Button>
              </div>
            )}
          </div>
      )}
        <div className="mt-6 text-xs text-center text-zinc-500 w-full">
          <AuthorFooter/>
        </div>
>>>>>>> Stashed changes
    </div>
  );
}

export default GamePage;
