
import React from 'react';
import { Button } from '@/components/ui/button';
import { LevelData } from '@/utils/levelData';
import { Edit } from 'lucide-react';

interface LevelSelectorProps {
  levels: LevelData[];
  bestScores: Record<number, number>;
  handleSelectLevel: (levelId: number) => void;
  onEditCustomLevel?: (level: LevelData) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  bestScores,
  handleSelectLevel,
  onEditCustomLevel,
}) => {
  const renderLevelButton = (level: LevelData) => {
    const isCustom = level.isCustom;
    const bestScore = bestScores[level.level];
    
    return (
      <div 
        key={level.id} 
        className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-4 flex flex-col items-center gap-2"
      >
        <h3 className="text-lg font-medium text-amber-500">{level.name}</h3>
        {bestScore !== undefined && (
          <p className="text-sm text-zinc-400">
            Best: <span className="text-zinc-200">{bestScore}</span> steps
          </p>
        )}
        <div className="flex gap-2">
          <Button
            onClick={() => handleSelectLevel(level.level)}
            className="bg-amber-600 hover:bg-amber-700 text-zinc-950"
          >
            Play
          </Button>
          
          {isCustom && onEditCustomLevel && (
            <Button
              onClick={() => onEditCustomLevel(level)}
              variant="outline"
              className="border-zinc-700 text-zinc-300"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-amber-500 text-center">
        Select Level
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {levels.map(renderLevelButton)}
      </div>
    </div>
  );
};

export default LevelSelector;
