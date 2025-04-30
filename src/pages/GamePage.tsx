import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameBoard from '@/components/GameBoard';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import { useLevelManager } from '@/hooks/game/useLevelManager';
import VictoryPopup from '@/components/VictoryPopup';
import { LevelData } from '@/utils/levelData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, Lightbulb, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"

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
  } = useGameLogic();
  const { loadLevel, loadCustomLevel } = useLevelManager();
  const [levelData, setLevelData] = useState<LevelData | null>(null);

  // Load level when levelId changes
  useEffect(() => {
    if (mode === 'test') {
      const storedLevel = localStorage.getItem('testing_level');
      if (storedLevel) {
        const parsedLevel = JSON.parse(storedLevel);
        const loadedGameState = loadCustomLevel(parsedLevel);
        if (loadedGameState) {
          setLevelData(parsedLevel);
        }
      } else {
        console.error('No level data found in localStorage for test mode.');
        navigate('/levels');
      }
    } else if (levelId) {
      const levelNumber = parseInt(levelId, 10);
      const loadedGameState = loadLevel(levelNumber);
      if (loadedGameState) {
        setLevelData(loadedGameState);
      } else {
        console.error(`Failed to load level ${levelNumber}`);
        navigate('/levels');
      }
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
  }, [handleMove]);

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      {/* Victory Popup */}
      {isVictory && <VictoryPopup level={gameState?.level || 1} steps={gameState?.steps || 0} />}

      {/* Game Board */}
      {gameState && levelData && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button variant="outline" className="mr-2 border-zinc-700 text-zinc-300" onClick={() => navigate('/levels')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Levels
              </Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={handleReset}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset Level
              </Button>
            </div>

            <div className="text-xl font-bold">{gameState.levelName}</div>

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

          <div className="aspect-square">
            <GameBoard
              board={gameState.board}
              sightLines={gameState.sightLines}
              playerPosition={gameState.playerPosition}
              currentHintMove={currentHintMove}
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
                  <Button type="submit" onClick={handleGetHint}>Get Hint</Button>
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
              <span>Hint Step: {hintStep + 1} / {hintMoves.length}</span>
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
    </div>
  );
};

export default GamePage;
