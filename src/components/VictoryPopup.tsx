
import React from 'react';
import { Button } from '@/components/ui/button';

interface VictoryPopupProps {
  steps: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  levelName: string;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ 
  steps,
  onNextLevel,
  onReplayLevel,
  levelName
}) => {
  return (
    <div className="victory-popup">
      <div className="victory-content">
        <h2 className="text-3xl font-bold text-amber-500 mb-2">✨ Victory! ✨</h2>
        <h3 className="text-xl text-zinc-200 mb-4">{levelName} Complete!</h3>
        
        <div className="bg-zinc-800 p-4 rounded-lg mb-6">
          <p className="text-zinc-300 text-lg">You completed the level in:</p>
          <p className="text-3xl font-bold text-amber-400">{steps} {steps === 1 ? 'step' : 'steps'}</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={onReplayLevel}
            variant="outline"
            className="text-lg px-6 py-2"
          >
            Replay Level
          </Button>
          <Button 
            onClick={onNextLevel}
            className="bg-amber-600 hover:bg-amber-700 text-lg px-6 py-2"
          >
            Next Level
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
