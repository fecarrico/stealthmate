
import React, { useEffect, useCallback, useState } from 'react';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import GameMessage from '@/components/GameMessage';
import LevelEditor from '@/components/LevelEditor';
import VictoryPopup from '@/components/VictoryPopup';
import LevelSelector from '@/components/LevelSelector';
import { useGameState } from '@/hooks/useGameState';
import { toast } from "@/components/ui/sonner";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveCustomLevel, LevelData, loadLevelFromCode } from '@/utils/levelData';
import { Input } from '@/components/ui/input';
import { Shield, Box, Eye } from 'lucide-react';

const Index = () => {
  const [mode, setMode] = useState<'game' | 'editor'>('game');
  const [levelCode, setLevelCode] = useState<string>('');
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
    loadCustomLevel,
    bestScores,
    showVictory,
    closeVictory,
    loadLevel
  } = useGameState();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (mode !== 'game' || !gameState) return;
      
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
    [movePlayer, undoMove, mode, gameState]
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

  // Debug log to track the gameState
  useEffect(() => {
    console.log("Current gameState:", gameState);
  }, [gameState]);

  const handleTestLevel = (level: LevelData) => {
    loadCustomLevel(level);
    setMode('game');
    toast.success("Testing custom level");
  };
  
  const handleSaveLevel = (level: LevelData) => {
    saveCustomLevel(level);
  };
  
  const handleLoadCode = () => {
    if (levelCode.trim()) {
      try {
        const level = loadLevelFromCode(levelCode);
        if (level) {
          loadCustomLevel(level);
          setMode('game');
          toast.success("Custom level loaded!");
        } else {
          toast.error("Invalid level code");
        }
      } catch (error) {
        toast.error("Failed to load level from code");
      }
    }
  };

  const handleSelectLevel = (levelId: number) => {
    loadLevel(levelId);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-amber-500 flex items-center gap-2">
        <Shield className="h-8 w-8" />
        StealthMate
      </h1>
      
      <Tabs
        defaultValue="game"
        value={mode}
        onValueChange={(value) => setMode(value as 'game' | 'editor')}
        className="w-full max-w-6xl"
      >
        <div className="flex justify-center mb-4">
          <TabsList className="bg-zinc-800 shadow-lg">
            <TabsTrigger value="game" className="data-[state=active]:bg-amber-500 text-lg px-6">Play Game</TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-amber-500 text-lg px-6">Level Editor</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="game">
          {!gameState ? (
            <div className="text-gray-300 flex flex-col items-center">
              <p className="mb-4">Loading game...</p>
              <Button onClick={resetGame} className="bg-amber-600 hover:bg-amber-700">
                Start Game
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">
              <div className="flex-1">
                <div className="bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-800">
                  <div className="w-full max-w-lg mx-auto">
                    {/* Ninja Instinct Button */}
                    <div className="mb-2 flex justify-center">
                      <button
                        className="ninja-instinct-button"
                        onMouseDown={() => setShowSightLines(gameState.ninjaInstinct > 0)}
                        onMouseUp={() => setShowSightLines(false)}
                        onMouseLeave={() => setShowSightLines(false)}
                        disabled={gameState.ninjaInstinct <= 0}
                      >
                        <Eye className="h-5 w-5" />
                        Ninja Instinct
                        <span className="ninja-instinct-counter">{gameState.ninjaInstinct}</span>
                      </button>
                    </div>
                    
                    {/* Game Board */}
                    <div className="aspect-square">
                      <GameBoard 
                        board={gameState.board} 
                        sightLines={gameState.sightLines}
                        showSightLines={showSightLines}
                      />
                    </div>
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
                
                <div className="mt-4">
                  <div className="bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-800 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Enter level code..." 
                        value={levelCode}
                        onChange={(e) => setLevelCode(e.target.value)}
                        className="flex-grow bg-zinc-800 border-zinc-700"
                      />
                      <Button onClick={handleLoadCode} className="game-button bg-amber-600 hover:bg-amber-700">
                        Load Level
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
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
          )}
        </TabsContent>
        
        <TabsContent value="editor">
          <LevelEditor 
            onTestLevel={handleTestLevel}
            onSave={handleSaveLevel}
          />
        </TabsContent>
      </Tabs>
      
      {showVictory && gameState && (
        <VictoryPopup
          steps={gameState.steps}
          onNextLevel={nextLevel}
          onReplayLevel={resetLevel}
          levelName={gameState.levelName}
        />
      )}
      
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Move with arrow keys. Press Z to undo.</p>
        <p>Capture all kings without being spotted by the enemy pieces.</p>
        <p>Hold the Ninja Instinct button to see enemy sight lines (3 uses per level).</p>
      </div>
    </div>
  );
};

export default Index;
