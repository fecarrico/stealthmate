
import React from 'react';
import { LevelData } from '../utils/levelData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft } from 'lucide-react';

interface LevelSelectorProps {
  levels: LevelData[];
  bestScores: { [key: number]: number };
  handleSelectLevel: (levelId: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, bestScores, handleSelectLevel }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 text-zinc-200 border-zinc-700" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft size={16} />
          Back to Main Menu
        </Button>
        
        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Select a Level
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {levels.map((level) => {
          const bestScore = bestScores?.[level.level] ?? "N/A";
          
          return (
            <Card 
              key={level.level} 
              className="bg-zinc-900 border-zinc-800 hover:border-amber-500 transition-all cursor-pointer overflow-hidden"
              onClick={() => handleSelectLevel(level.level)}
            >
              <div className="h-32 bg-zinc-800 relative">
                {/* Level thumbnail/snapshot would go here */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent flex items-end p-3">
                  <div className="bg-amber-600 text-white font-bold px-2 py-1 rounded-sm text-xs">
                    Level {level.level}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-zinc-200">{level.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-zinc-400">Best Score:</span>
                  <span className="text-amber-400 font-bold">{bestScore}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
