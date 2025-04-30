
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Award } from 'lucide-react';

interface VictoryPopupProps {
  level: number;
  steps: number;
  onNextLevel?: () => void;
  onReplayLevel?: () => void;
  levelName?: string;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ 
  steps,
  level,
  onNextLevel,
  onReplayLevel,
  levelName = `Level ${level}`
}) => {
  return (
    <div className="victory-popup">
      <div className="victory-content bg-zinc-900 border border-zinc-700 rounded-lg p-8 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <Shield className="h-8 w-8 text-amber-500 mr-2" />
            <h1 className="text-3xl font-bold text-amber-500">StealthMate</h1>
          </div>
          <h2 className="text-3xl font-bold text-amber-500 mb-2">✨ Victory! ✨</h2>
          <h3 className="text-xl text-zinc-200 mb-4">{levelName} Complete!</h3>
        </div>
        
        <div className="bg-zinc-800 p-4 rounded-lg mb-6">
          <p className="text-zinc-300 text-lg">You completed the level in:</p>
          <div className="flex items-center justify-center mt-1">
            <Award className="text-amber-400 h-5 w-5 mr-2" />
            <p className="text-3xl font-bold text-amber-400">{steps} {steps === 1 ? 'step' : 'steps'}</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          {onReplayLevel && (
            <Button 
              onClick={onReplayLevel}
              variant="outline"
              className="text-lg px-6 py-2 bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
            >
              Replay Level
            </Button>
          )}
          {onNextLevel && (
            <Button 
              onClick={onNextLevel}
              className="bg-amber-600 hover:bg-amber-700 text-zinc-950 text-lg px-6 py-2 font-medium"
            >
              Next Level
            </Button>
          )}
        </div>
        
        <div className="mt-6 text-xs text-center text-zinc-500">
          Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
