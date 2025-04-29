
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onNextLevel: () => void;
  onResetLevel: () => void;
  onResetGame: () => void;
  isLevelComplete: boolean;
  isAllLevelsComplete: boolean;
  level: number;
  steps: number;
  totalSteps?: number[];
}

const GameControls: React.FC<GameControlsProps> = ({
  onNextLevel,
  onResetLevel,
  onResetGame,
  isLevelComplete,
  isAllLevelsComplete,
  level,
  steps,
  totalSteps = [],
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">Level: {level}</span>
        <span className="font-medium text-lg">Steps: {steps}</span>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={onResetLevel} 
          variant="outline" 
          className="flex-1"
        >
          Reset Level
        </Button>
        
        {isLevelComplete && !isAllLevelsComplete && (
          <Button 
            onClick={onNextLevel} 
            variant="default" 
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            Next Level
          </Button>
        )}
      </div>
      
      {isAllLevelsComplete && (
        <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
          <h3 className="font-bold text-lg text-green-800 mb-2">
            🎉 Congratulations! All Levels Complete!
          </h3>
          <ul className="list-disc list-inside mb-4">
            {totalSteps.map((steps, idx) => (
              <li key={idx}>
                Level {idx + 1}: {steps} steps
              </li>
            ))}
            <li className="font-bold">
              Total: {totalSteps.reduce((a, b) => a + b, 0)} steps
            </li>
          </ul>
          <Button 
            onClick={onResetGame} 
            variant="default" 
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Play Again
          </Button>
        </div>
      )}
      
      <div className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <h3 className="font-medium mb-2">Controls:</h3>
        <ul className="text-sm space-y-1">
          <li>⬆️ ⬇️ ⬅️ ➡️ - Move</li>
          <li>Z - Undo Last Move</li>
          <li>Push boxes to block enemy vision</li>
          <li>Push boxes into enemies or kings to capture</li>
          <li>Don't get spotted!</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
