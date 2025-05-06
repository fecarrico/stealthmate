
import React from 'react';
import GameTitle from './GameTitle';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useGameState } from '@/hooks/useGameState';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { resetAllProgress, resetCustomLevels } = useGameState();
  
  const handleResetProgress = () => {
    resetAllProgress();
    setResetDialogOpen(false);
  };
  
  const handleResetCustomLevels = () => {
    resetCustomLevels();
    setResetDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setResetDialogOpen(true)}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
        >
          <Settings className="h-5 w-5 text-zinc-400" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="space-y-12 flex flex-col items-center">
          <GameTitle />
          
          <p className="text-zinc-400 text-center max-w-xs mx-auto">
            Navigate through deadly traps and enemies to rescue the king. Use your ninja skills wisely!
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button 
              onClick={() => navigate('/game?levelId=101')} 
              className="bg-amber-600 hover:bg-amber-700 text-zinc-950 h-12 text-lg"
              size="lg"
            >
              Play Now
            </Button>
            
            <Button 
              onClick={() => navigate('/levels')} 
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-12"
              variant="outline"
              size="lg"
            >
              Select Level
            </Button>
            
            <Button 
              onClick={() => navigate('/editor')} 
              className="bg-transparent border border-zinc-700 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              variant="outline"
              size="lg"
            >
              Level Editor
            </Button>
          </div>
          
          <div className="text-xs text-zinc-500 absolute bottom-4">
            Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
          </div>
        </div>
      </div>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Game Settings</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-300">
              You can reset your progress or custom levels here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleResetProgress}
            >
              Reset All Progress
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleResetCustomLevels}
            >
              Reset Custom Levels
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SplashScreen;
