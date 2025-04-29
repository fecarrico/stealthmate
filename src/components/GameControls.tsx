
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Box } from 'lucide-react';

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
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-500">Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-lg flex items-center gap-1">
              <Shield className="w-4 h-4" /> Level: {level}
            </span>
            <span className="font-medium text-lg flex items-center gap-1">
              <Box className="w-4 h-4" /> Steps: {steps}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onResetLevel} 
              variant="outline" 
              className="flex-1 border-zinc-700 hover:bg-zinc-800"
            >
              Reset Level
            </Button>
            
            {isLevelComplete && !isAllLevelsComplete && (
              <Button 
                onClick={onNextLevel} 
                variant="default" 
                className="flex-1 bg-green-700 hover:bg-green-800"
              >
                Next Level
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isAllLevelsComplete && (
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 border-t-green-600 border-t-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-500">
              🎉 All Levels Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-4 text-gray-300">
              {totalSteps.map((steps, idx) => (
                <li key={idx}>
                  Level {idx + 1}: {steps} steps
                </li>
              ))}
              <li className="font-bold text-white mt-2">
                Total: {totalSteps.reduce((a, b) => a + b, 0)} steps
              </li>
            </ul>
            <Button 
              onClick={onResetGame} 
              variant="default" 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-zinc-400">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>⬆️ ⬇️ ⬅️ ➡️ - Move</li>
            <li>Z - Undo Last Move</li>
            <li>Push boxes to block enemy vision</li>
            <li>Push boxes into enemies or kings to capture</li>
            <li>Don't get spotted!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControls;
