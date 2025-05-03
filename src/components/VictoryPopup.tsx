
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Save, Edit, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { LevelData, saveCustomLevel } from '@/utils/levelData';
import { useGameState } from '@/hooks/useGameState';
import { useScores } from '@/hooks/game/useScores';

interface VictoryPopupProps {
  level: number;
  steps: number;
  levelName?: string;
  isCustomLevel?: boolean;
  isTestMode?: boolean;
  backToEditor?: () => void;
  totalSteps?: number;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ 
  level, 
  steps, 
  levelName, 
  isCustomLevel,
  isTestMode,
  backToEditor,
  totalSteps
}) => {
  const navigate = useNavigate();
  const { getLevels } = useGameState();
  const { saveBestScore, calculateTotalSteps } = useScores();
  const levelText = isCustomLevel ? "Custom Level" : `Level ${level}`;

  const levels = getLevels();
  const isLastLevel = !isCustomLevel && level >= levels.length;
  
  // Save best score
  useEffect(() => {
    if (!isCustomLevel && !isTestMode) {
      saveBestScore(level, steps);
    }
  }, [level, steps, isCustomLevel, isTestMode, saveBestScore]);
  
  const totalBestSteps = calculateTotalSteps();
  
  const handleSaveLevel = () => {
    try {
      // Get the custom level from localStorage
      const storedLevel = localStorage.getItem('testing_level');
      if (!storedLevel) {
        toast.error('Level data not found');
        return;
      }
      
      const levelData = JSON.parse(storedLevel) as LevelData;
      
      // Save the level (this will overwrite if it exists with same ID)
      saveCustomLevel(levelData);
      toast.success('Level saved successfully');
      
      // Navigate to level select
      navigate('/levels');
    } catch (error) {
      toast.error('Failed to save level');
      console.error('Error saving level:', error);
    }
  };
  
  const handleNextLevel = () => {
    navigate(`/game?levelId=${level + 1}`);
  };

  // Show game completion message if it's the last level
  if (isLastLevel) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8 max-w-md text-center transform animate-scale-in">
          <div className="text-amber-500 text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-amber-500 mb-4">Game Complete!</h2>
          <p className="text-xl text-zinc-300 mb-4">Congratulations!</p>
          <p className="text-lg text-zinc-400 mb-2">
            You have completed all levels!
          </p>
          <p className="text-md text-amber-400 mb-6 p-3 bg-zinc-800/50 rounded-md">
            Total Best Score: {totalBestSteps} steps
          </p>
          
          <div className="text-sm text-zinc-500 mb-6 p-4 bg-zinc-800/50 rounded-md">
            This game was created by Felipe Carriço.<br/>
            <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
              LinkedIn Profile
            </a>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/levels')} className="bg-amber-600 hover:bg-amber-700 text-zinc-950">
              Back to Levels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8 max-w-md text-center transform animate-scale-in">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Level Complete!</h2>
        {levelName && <p className="text-lg text-zinc-300 mb-4">{levelName}</p>}
        <p className="text-zinc-400 mb-6">
          Congratulations! You completed {levelText} in {steps} steps.
        </p>
        
        <div className="flex justify-center gap-4">
          {isTestMode ? (
            <>
              <Button 
                onClick={handleSaveLevel} 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Level
              </Button>
              <Button 
                onClick={backToEditor} 
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Back to Editor
              </Button>
            </>
          ) : isCustomLevel ? (
            <Button onClick={() => navigate('/levels')} className="bg-amber-600 hover:bg-amber-700 text-zinc-950">
              Back to Levels
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/levels')} className="bg-zinc-600 hover:bg-zinc-700 text-zinc-100">
                Back to Levels
              </Button>
              <Button 
                onClick={handleNextLevel} 
                className="bg-amber-600 hover:bg-amber-700 text-zinc-950 flex items-center gap-2"
              >
                Next Level
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
