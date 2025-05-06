import React from 'react';
import { Button } from '@/components/ui/button';

interface FinalVictoryPopupProps {
  totalSteps: number;
  onBackToLevels: () => void;
}

const FinalVictoryPopup: React.FC<FinalVictoryPopupProps> = ({ totalSteps, onBackToLevels }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8 max-w-md text-center transform animate-scale-in">
        <div className="text-amber-500 text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-amber-500 mb-4">Game Complete!</h2>
        <p className="text-xl text-zinc-300 mb-4">Congratulations!</p>
        <p className="text-lg text-zinc-400 mb-2">
          You have completed all levels!
        </p>
        <p className="text-md text-amber-400 mb-6 p-3 bg-zinc-800/50 rounded-md">
          Total Best Score: {totalSteps} steps
        </p>

        <div className="text-sm text-zinc-500 mb-6 p-4 bg-zinc-800/50 rounded-md">
          This game was created by Felipe Carriço.<br />
          <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
            LinkedIn Profile
          </a>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={onBackToLevels} className="bg-amber-600 hover:bg-amber-700 text-zinc-950">
            Back to Levels
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalVictoryPopup;