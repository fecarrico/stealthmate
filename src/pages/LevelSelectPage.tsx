
import React, {useState} from 'react';
import LevelSelector from '@/components/LevelSelector';
import { LevelData } from '@/utils/levelData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loadLevelFromCode } from '@/utils/levelData';
import { useGameState } from '@/hooks/useGameState';
import { Shield, Code, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LevelSelectPage: React.FC = () => {  
  const [levelCode, setLevelCode] = useState<string>('');
  const navigate = useNavigate();

  const {loadCustomLevel, bestScores, getLevels, loadLevel } = useGameState();
  
  const handleLoadCode = () => {
    if (levelCode.trim()) {
      try {
        const level = loadLevelFromCode(levelCode);
        if (level) {
          loadCustomLevel(level);
          navigate('/game');
          toast.success('Custom level loaded!');
        } else {
          toast.error('Invalid level code');
        }
      } catch (error) {
        toast.error('Failed to load level from code');
      }
    } else {
      toast.error('Please enter a level code');
    }
  };

  const handleLevelSelect = (levelId: number) => {
    loadLevel(levelId);
    navigate(`/game?levelId=${levelId}`);
  };
  
  const levels = getLevels();
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-amber-500 flex items-center gap-2">
        <Shield className="h-8 w-8" />
        StealthMate
      </h1>
      
      <div className="w-full max-w-6xl">
        <LevelSelector levels={levels} bestScores={bestScores} handleSelectLevel={handleLevelSelect} />
        
        <Card className="mt-8 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-200 flex items-center gap-2">
              <Code size={18} />
              Custom Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Enter level code..." 
                value={levelCode} 
                onChange={(e) => setLevelCode(e.target.value)} 
                className="flex-grow bg-zinc-800 border-zinc-700 text-zinc-200"
              />
              <Button 
                onClick={handleLoadCode} 
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              >
                Load Level
                <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LevelSelectPage;
