
import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useLevelManager } from '@/hooks/game/useLevelManager';
import { Shield, Trophy } from 'lucide-react';
import { useScores } from '@/hooks/game/useScores';
import '../styles/victoryPopup.css';

interface VictoryPopupProps {
  level: number;
  steps: number;
  levelName: string;
  isCustomLevel?: boolean;
  isTestMode?: boolean;
  backToEditor?: () => void;
  totalSteps?: number;
  isFinalVictory?: boolean;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({
  level,
  steps,
  levelName,
  isCustomLevel = false,
  isTestMode = false,
  backToEditor,
  totalSteps = 0,
  isFinalVictory = false
}) => {
  const navigate = useNavigate();
  const { getNextLevelNumber } = useLevelManager();
  const { bestScores, isLevelCompleted } = useScores();
  
  // Get the best score for this level
  const bestScore = bestScores[level];
  const isNewBestScore = bestScore === undefined || steps < bestScore;

  const handleNextLevel = () => {
    // For test mode, go back to editor
    if (isTestMode) {
      if (backToEditor) backToEditor();
      return;
    }
    
    // For custom levels, return to level selection
    if (isCustomLevel) {
      navigate('/levels');
      return;
    }
    
    // For tutorial levels, find the next tutorial or go to level 1
    const nextLevelNumber = getNextLevelNumber(level);
    navigate(`/game?levelId=${nextLevelNumber}`);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  const handleLevelSelect = () => {
    navigate('/levels');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
      <div className="victory-popup absolute w-full max-w-md p-8 bg-zinc-900 border border-amber-500 rounded-lg shadow-xl">
        <div className="flex justify-center">
          <div className="relative">
            <div className="victory-trophy text-amber-500">
              <Trophy size={isFinalVictory ? 120 : 80} strokeWidth={1} />
            </div>
          </div>
        </div>
        
        {isFinalVictory ? (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 text-amber-500 victory-title">Ultimate Victory!</h2>
            <p className="text-xl text-zinc-300">You've completed all levels with a total of {totalSteps} steps!</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 text-amber-500 victory-title">
              {levelName}
            </h2>
            <p className="text-xl text-zinc-300">
              Congratulations! You completed in {steps} steps!
            </p>
            {bestScore !== undefined && (
              <p className="text-sm mt-1 text-zinc-400">
                {isNewBestScore ? "New best score!" : `Best score: ${bestScore}`}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isFinalVictory && (
            <Button 
              onClick={handleNextLevel} 
              className="victory-next-btn bg-amber-600 hover:bg-amber-700 text-white py-2"
            >
              {isCustomLevel || isTestMode ? "Return to Menu" : "Next Level"}
            </Button>
          )}
          
          <div className="flex gap-3">
            <Button 
              onClick={handleLevelSelect} 
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Level Select
            </Button>
            
            <Button 
              onClick={handleBackToMenu} 
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
            >
              Main Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
