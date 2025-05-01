
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameBoard from '@/components/GameBoard';
import GameLoading from '@/components/GameLoading';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import { useLevelManager } from '@/hooks/game/useLevelManager';
import VictoryPopup from '@/components/VictoryPopup';
import GameHeader from '@/components/game/GameHeader';
import GameFooter from '@/components/game/GameFooter';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract levelId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const levelId = queryParams.get('levelId');
  const mode = queryParams.get('mode');
  
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    showHint,
    setShowHint,
    hintStep,
    setHintStep,
    hintMoves
  } = useGameLogic();
  
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
  
  const currentHintMove = showHint && hintMoves.length > 0 ? hintMoves[hintStep] : null;

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
          resetGame={() => navigate('/levels')}
          errorMessage={loadingError || undefined}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <GameHeader 
        levelName={gameState.levelName}
        resetLevel={resetLevel}
        undoMove={undoMove}
        redoMove={redoMove}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      {isVictory && (
        <VictoryPopup 
          level={gameState.level}
          steps={gameState.steps}
          levelName={gameState.levelName}
          isCustomLevel={gameState.isCustomLevel}
        />
      )}
      
      <div className="w-full max-w-2xl">
        <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800">
          <GameBoard 
            board={gameState.board} 
            sightLines={gameState.sightLines}
            playerPosition={gameState.playerPosition}
            currentHintMove={currentHintMove}
            showSightLines={true}
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
    </div>
  );
};

export default GamePage;
