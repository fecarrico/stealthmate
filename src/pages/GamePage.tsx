
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameBoard from '@/components/GameBoard';
import GameLoading from '@/components/GameLoading';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import { useLevelManager } from '@/hooks/game/useLevelManager';
import VictoryPopup from '@/components/VictoryPopup';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, Lightbulb, ChevronsLeft, ChevronsRight, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { LevelData } from '@/utils/levelData';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract levelId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const levelId = queryParams.get('levelId');
  const mode = queryParams.get('mode');
  
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const [hintMoves, setHintMoves] = useState<number[][]>([]);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [hintCostMultiplier, setHintCostMultiplier] = useState(1);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { gameState, movePlayer, resetLevel, undoMove, redoMove, canUndo, canRedo, getHint, ninjaInstinctCost, ninjaInstinctAvailable, setNinjaInstinctAvailable, isGameOver, isVictory } = useGameLogic();
  const { loadLevel, loadCustomLevel } = useLevelManager();
  
  // Load level when levelId changes
  useEffect(() => {
    console.log('Loading game with mode:', mode, 'levelId:', levelId);
    setIsLoading(true);
    setLoadingError(null);
    
    if (mode === 'test' || mode === 'custom') {
      const storedLevel = localStorage.getItem('testing_level');
      console.log('Stored level from localStorage:', storedLevel ? 'exists' : 'not found');
      
      if (storedLevel) {
        try {
          const parsedLevel = JSON.parse(storedLevel);
          console.log('Parsed level data:', parsedLevel);
          
          // Validate level data
          if (!parsedLevel.playerStart) {
            throw new Error('Missing player start position');
          }
          
          if (!parsedLevel.kings || parsedLevel.kings.length === 0) {
            throw new Error('Level must have at least one king');
          }
          
          const loadedState = loadCustomLevel(parsedLevel);
          if (!loadedState) {
            throw new Error('Failed to load level data');
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading test level:', error);
          setLoadingError(`Failed to load test level: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      } else {
        console.error('No level data found in localStorage for test mode.');
        setLoadingError('No level data found');
        setIsLoading(false);
      }
    } else if (levelId) {
      try {
        const levelNumber = parseInt(levelId, 10);
        console.log('Loading standard level number:', levelNumber);
        const loadedState = loadLevel(levelNumber);
        if (!loadedState) {
          throw new Error('Failed to load level data');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading level:', error);
        setLoadingError(`Failed to load level ${levelId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    } else {
      console.error('No levelId provided');
      setLoadingError('No level ID provided');
      setIsLoading(false);
    }
  }, [levelId, loadLevel, navigate, mode, loadCustomLevel]);
  
  // Reset hint state when level is reset or a new level is loaded
  useEffect(() => {
    setShowHint(false);
    setHintStep(0);
    setHintMoves([]);
  }, [levelId]);
  
  const handleMove = (direction: number[]) => {
    movePlayer(direction);
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [gameState]); // Add gameState as dependency to update when it changes
  
  const handleReset = () => {
    resetLevel();
    setShowHint(false);
    setHintStep(0);
    setHintMoves([]);
  };
  
  const handleGetHint = async () => {
    if (!gameState) return;
    
    const cost = ninjaInstinctCost * hintCostMultiplier;
    if (cost > ninjaInstinctAvailable) {
      toast.error("Not enough Ninja Instinct!");
      return;
    }
    
    const hint = await getHint();
    if (hint && hint.moves && hint.moves.length > 0) {
      setHintMoves(hint.moves);
      setShowHint(true);
      setHintStep(0);
      setNinjaInstinctAvailable(ninjaInstinctAvailable - cost);
      setHintDialogOpen(false);
    } else {
      toast.error("No hint available for this level.");
    }
  };
  
  const handleNextHint = () => {
    if (hintStep < hintMoves.length - 1) {
      setHintStep(hintStep + 1);
    }
  };
  
  const handlePrevHint = () => {
    if (hintStep > 0) {
      setHintStep(hintStep - 1);
    }
  };
  
  const currentHintMove = showHint && hintMoves.length > 0 ? hintMoves[hintStep] : null;
  const hintCost = ninjaInstinctCost * hintCostMultiplier;

  // When there's an error or still loading
  if (loadingError || isLoading || !gameState) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <Shield className="h-6 w-6 text-amber-500 mr-2" />
            <h1 className="text-2xl font-bold text-amber-500">StealthMate</h1>
          </div>
        </div>
        <GameLoading 
          resetGame={() => navigate('/levels')}
          errorMessage={loadingError || undefined}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4">
        <div className="flex justify-center items-center mb-2">
          <Shield className="h-6 w-6 text-amber-500 mr-2" />
          <h1 className="text-2xl font-bold text-amber-500">StealthMate</h1>
        </div>
      </div>
      
      {isVictory && (
        <VictoryPopup 
          level={gameState.level}
          steps={gameState.steps}
          levelName={gameState.levelName}
        />
      )}
      
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Button 
              variant="outline" 
              className="mr-2 border-zinc-700 text-zinc-300"
              onClick={() => navigate('/levels')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Levels
            </Button>
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300"
              onClick={handleReset}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Level
            </Button>
          </div>
          
          <div className="text-xl font-bold">
            {gameState.levelName}
          </div>
          
          <div>
            <Button 
              variant="outline" 
              className="mr-2 border-zinc-700 text-zinc-300"
              onClick={undoMove}
              disabled={!canUndo}
            >
              <ChevronsLeft className="mr-2 h-4 w-4" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300"
              onClick={redoMove}
              disabled={!canRedo}
            >
              <ChevronsRight className="mr-2 h-4 w-4" />
              Redo
            </Button>
          </div>
        </div>
        
        <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800">
          <GameBoard 
            board={gameState.board} 
            sightLines={gameState.sightLines}
            playerPosition={gameState.playerPosition}
            currentHintMove={currentHintMove}
            showSightLines={true}
          />
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
                <DialogDescription>
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
      
      <div className="mt-6 text-xs text-center text-zinc-500 w-full">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>
    </div>
  );
};

export default GamePage;
