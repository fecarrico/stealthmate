
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Box, RotateCcw, ArrowRight, RefreshCcw } from 'lucide-react';

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
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-500 text-xl">Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-xl flex items-center gap-1">
              <Shield className="w-5 h-5" /> Level: {level}
            </span>
            <span className="font-medium text-xl flex items-center gap-1">
              <Box className="w-5 h-5" /> Steps: {steps}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onResetLevel} 
              variant="outline" 
              className="flex-1 border-zinc-700 hover:bg-zinc-800 game-button"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Level
            </Button>
            
            {isLevelComplete && !isAllLevelsComplete && (
              <Button 
                onClick={onNextLevel} 
                variant="default" 
                className="flex-1 bg-green-700 hover:bg-green-800 game-button"
              >
                <ArrowRight className="w-4 h-4" />
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
              className="w-full bg-amber-600 hover:bg-amber-700 game-button"
            >
              <RefreshCcw className="w-4 h-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-zinc-400">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono">⬆️ ⬇️ ⬅️ ➡️</span>
              <span>Move</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono">Z</span>
              <span>Undo Last Move</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-purple-900 px-2 py-1 rounded text-xs text-purple-200">
                <Eye className="w-3 h-3 inline-block" /> Ninja Instinct
              </span>
              <span>Hold to see enemy vision</span>
            </li>
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
