
import React from 'react';
import { LevelSelector } from '@/components/LevelSelector';
import { LevelData } from '@/utils/levelData';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface LevelSelectScreenProps {
  levels: LevelData[];
  bestScores: Record<number, number>;
  handleSelectLevel: (levelId: number) => void;
  levelCode: string;
  setLevelCode: (code: string) => void;
  handleLoadCode: () => void;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  levels,
  bestScores,
  handleSelectLevel,
  levelCode,
  setLevelCode,
  handleLoadCode,
}) => {
  const navigate = useNavigate();
  
  const handleLevelSelect = (levelId: number) => {
    navigate(`/game?levelId=${levelId}`);
  };
  
  const handleEditCustomLevel = (level: LevelData) => {
    // Store the level data in localStorage
    localStorage.setItem('testing_level', JSON.stringify(level));
    // Navigate to editor
    navigate('/editor');
  };
  
  return (
    <div className="flex flex-col items-center">
      <LevelSelector
        levels={levels}
        bestScores={bestScores}
        handleSelectLevel={handleLevelSelect}
        onEditCustomLevel={handleEditCustomLevel}
      />
      <div className="mt-4">
        <div className="bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter level code..."
              value={levelCode}
              onChange={(e) => setLevelCode(e.target.value)}
              className="flex-grow bg-zinc-800 border-zinc-700"
            />
            <Button
              onClick={handleLoadCode}
              className="game-button bg-amber-600 hover:bg-amber-700"
            >
              Load Level
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelectScreen;
