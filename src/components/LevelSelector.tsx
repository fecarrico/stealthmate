
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { getGameBoardPreview } from '../utils/levelHelper';
import levels from '../utils/levelData';

interface LevelSelectorProps {
  onSelectLevel: (levelId: number) => void;
  currentLevel: number;
  bestScores: Record<number, number | undefined>;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  onSelectLevel, 
  currentLevel,
  bestScores 
}) => {
  const [open, setOpen] = useState(false);
  
  const handleSelectLevel = (levelId: number) => {
    onSelectLevel(levelId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-amber-600 hover:bg-amber-700 text-lg px-4 py-2 shadow-lg"
        >
          Select Level
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-amber-500 text-2xl">Level Selection</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            {levels.map((level) => (
              <Card 
                key={level.id} 
                className={`bg-zinc-800 border-zinc-700 hover:border-amber-400 transition-all cursor-pointer ${
                  level.id === currentLevel ? 'border-amber-500 ring-1 ring-amber-500' : ''
                }`}
                onClick={() => handleSelectLevel(level.id)}
              >
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-bold text-amber-400">{level.name || `Level ${level.id}`}</h3>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="level-thumbnail">
                    {getGameBoardPreview(level)}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="text-xs text-zinc-400">
                    {level.size[0]}x{level.size[1]} Board
                  </div>
                  {bestScores[level.id] ? (
                    <div className="text-xs font-medium bg-amber-900/50 text-amber-300 px-2 py-1 rounded">
                      Best: {bestScores[level.id]} steps
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500">Not completed</div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LevelSelector;
