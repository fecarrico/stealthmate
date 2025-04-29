
import React, { useEffect, useCallback, useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveCustomLevel, LevelData, loadLevelFromCode } from '@/utils/levelData';
import VictoryPopup from '@/components/VictoryPopup';
import LevelEditor from '@/components/LevelEditor';
import GameMode from '@/components/GameMode';
import GameInstructions from '@/components/GameInstructions';
import { useGameState } from '@/hooks/useGameState';

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
          <GameMode 
            gameState={gameState}
            resetGame={resetGame}
            showSightLines={showSightLines}
            setShowSightLines={setShowSightLines}
            levelCode={levelCode}
            setLevelCode={setLevelCode}
            handleLoadCode={handleLoadCode}
            nextLevel={nextLevel}
            resetLevel={resetLevel}
            levelComplete={levelComplete}
            allLevelsComplete={allLevelsComplete}
            totalSteps={totalSteps}
            bestScores={bestScores}
            handleSelectLevel={handleSelectLevel}
          />
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
      
      <GameInstructions />
    </div>
  );
};

export default Index;
