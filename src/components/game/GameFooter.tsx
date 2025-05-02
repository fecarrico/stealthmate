
import React from 'react';

interface GameFooterProps {
  steps: number;
  ninjaInstinctAvailable: number;
}

const GameFooter: React.FC<GameFooterProps> = ({
  steps,
  ninjaInstinctAvailable,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-zinc-400">
        Steps: <span className="font-bold text-zinc-200">{steps}</span>
      </div>
      
      <div className="text-sm text-zinc-400">
        Ninja Instinct: <span className="font-bold text-green-500">{ninjaInstinctAvailable}</span>
      </div>
    </div>
  );
};

export default GameFooter;
