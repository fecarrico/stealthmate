
import React, { useState } from 'react';
import { Shield, Book, Play, Edit, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const SplashScreenPage: React.FC = () => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { resetAllProgress } = useGameState();
  
  const handleResetProgress = () => {
    resetAllProgress();
    setShowSettings(false);
    toast.success("Progress and high scores have been reset");
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="text-3xl md:text-4xl font-bold mb-8 text-amber-500 flex items-center gap-2">
        <Shield className="h-7 w-7 md:h-8 md:w-8" />
        StealthMate
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link to="/levels">
          <Button className="game-button w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium flex items-center gap-2 px-6 py-3">
            <Play className="h-5 w-5" />
            Play Game
          </Button>
        </Link>
        <Link to="/editor">
          <Button className="game-button w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium flex items-center gap-2 px-6 py-3">
            <Edit className="h-5 w-5" />
            Create Level
          </Button>
        </Link>
        <Button 
          className="game-button w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 flex items-center gap-2 px-6 py-3"
          onClick={() => setShowHowToPlay(true)}
        >
          <Book className="h-5 w-5" />
          How to Play
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
        onClick={() => setShowSettings(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>
      
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="max-w-2xl w-full bg-zinc-900 border-zinc-800 my-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-amber-500 flex items-center gap-2">
                <Book className="h-5 w-5" />
                How to Play
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowHowToPlay(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <h3 className="font-bold text-amber-400">Game Objective</h3>
                <p className="text-zinc-300">
                  You are a stealthy agent trying to reach and collect all king pieces without being spotted by enemy pieces.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-amber-400">Controls</h3>
                <ul className="list-disc pl-5 text-zinc-300 space-y-1">
                  <li>Use <span className="bg-zinc-800 px-2 py-1 rounded">Arrow Keys</span> to move your character</li>
                  <li>Press <span className="bg-zinc-800 px-2 py-1 rounded">Z</span> to undo your last move</li>
                  <li>Hold the <span className="bg-zinc-800 px-2 py-1 rounded">Ninja Instinct</span> button to see enemy sight lines</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-amber-400">Pieces</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-600 rounded-sm flex items-center justify-center">
                      <Shield className="h-4 w-4 text-zinc-100" />
                    </div>
                    <span className="text-zinc-300">Player - You control this piece</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-600 rounded-sm flex items-center justify-center">
                      <span className="text-zinc-100">♔</span>
                    </div>
                    <span className="text-zinc-300">King - Collect these to win</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-800 rounded-sm flex items-center justify-center">
                      <span className="text-zinc-100">♖</span>
                    </div>
                    <span className="text-zinc-300">Rook - Moves horizontally and vertically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-800 rounded-sm flex items-center justify-center">
                      <span className="text-zinc-100">♗</span>
                    </div>
                    <span className="text-zinc-300">Bishop - Moves diagonally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-800 rounded-sm flex items-center justify-center">
                      <span className="text-zinc-100">♕</span>
                    </div>
                    <span className="text-zinc-300">Queen - Moves in all directions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-600 rounded-sm flex items-center justify-center">
                      <span className="text-zinc-100">📦</span>
                    </div>
                    <span className="text-zinc-300">Box - Blocks movement and sight</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-amber-400">Tips</h3>
                <ul className="list-disc pl-5 text-zinc-300 space-y-1">
                  <li>Enemy pieces move like in chess and can spot you if you're in their line of sight</li>
                  <li>Use boxes as cover to avoid being spotted</li>
                  <li>Plan your moves carefully to reach all kings without being seen</li>
                  <li>Create your own levels in the level editor</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => setShowHowToPlay(false)} 
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <AlertDialog open={showSettings} onOpenChange={setShowSettings}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Settings</AlertDialogTitle>
            <AlertDialogDescription>
              You can reset your game progress and high scores here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Confirm reset",
                  description: "Are you sure you want to reset all progress and high scores?",
                  action: <Button className="bg-red-600 text-white" onClick={handleResetProgress}>Reset</Button>,
                });
              }}
            >
              Reset All Progress & High Scores
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="absolute bottom-4 right-4 text-xs text-zinc-500">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>
    </div>
  );
};

export default SplashScreenPage;
