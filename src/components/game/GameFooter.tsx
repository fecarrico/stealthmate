
import React from 'react';

interface GameFooterProps {
  steps: number;
  ninjaInstinctAvailable: number;
  lives?: number;
}

const GameFooter: React.FC<GameFooterProps> = ({
  steps,
  ninjaInstinctAvailable,
  lives = 3,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-zinc-400">
        Steps: <span className="font-bold text-zinc-200">{steps}</span>
      </div>
      
      <div className="text-sm text-zinc-400 flex items-center gap-4">
        <div>
          Ninja Instinct: <span className="font-bold text-green-500">{ninjaInstinctAvailable}</span>
        </div>
        
        {lives !== undefined && (
          <div>
            Lives: <span className="font-bold text-red-500">{lives}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameFooter;
