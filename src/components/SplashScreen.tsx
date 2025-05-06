
import React, { useState, useEffect } from 'react';
import GameTitle from './GameTitle';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGameState } from '@/hooks/useGameState';
import { useScores } from '@/hooks/game/useScores';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { resetAllProgress, resetCustomLevels } = useGameState();
  const { isLevelCompleted } = useScores();
  const [continueGame, setContinueGame] = useState(false);
  
  useEffect(() => {
    // Check if there's any completed level to determine if we show "Continue" instead of "Play Now"
    const hasStartedGame = localStorage.getItem('stealthmate_completed_levels') !== null;
    setContinueGame(hasStartedGame);
  }, []);
  
  const handleResetProgress = () => {
    resetAllProgress();
    setContinueGame(false);
    setResetDialogOpen(false);
  };
  
  const handleResetCustomLevels = () => {
    resetCustomLevels();
    setResetDialogOpen(false);
  };
  
  const handlePlayNow = () => {
    // If continuing game, navigate to the levels page so player can pick where to continue
    if (continueGame) {
      navigate('/levels');
      return;
    }
    
    // New game - start with the first tutorial level (101)
    navigate('/game?levelId=101');
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <GameTitle />
        <p className="text-zinc-400 mt-2">Stealth chess puzzle game</p>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8 text-center">
          <p className="text-zinc-300 mb-4">
            Move your ninja stealth through the chessboard.
          </p>
          <p className="text-zinc-400 text-sm">
            Don't get caught in the sight lines of the chess pieces!
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button 
            onClick={handlePlayNow} 
            className="bg-amber-600 hover:bg-amber-700 text-zinc-950 h-12 text-lg"
            size="lg"
          >
            {continueGame ? "Continue" : "Play Now"}
          </Button>
          
          <Button 
            onClick={() => navigate("/levels")}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 h-12"
            size="lg"
          >
            Select Level
          </Button>
          
          <Button 
            onClick={() => navigate("/editor")}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
            size="lg"
          >
            Level Editor
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-zinc-500 hover:text-zinc-300 mt-8 flex items-center gap-2"
          onClick={() => setResetDialogOpen(true)}
        >
          <Settings size={16} />
          Settings
        </Button>
      </div>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Game Data</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              What would you like to reset?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
            <AlertDialogAction 
              onClick={handleResetProgress}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              Reset All Progress
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={handleResetCustomLevels}
              className="bg-orange-600 hover:bg-orange-700 text-white w-full"
            >
              Reset Custom Levels
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SplashScreen;
