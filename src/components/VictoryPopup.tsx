
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Save, Edit } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface VictoryPopupProps {
  level: number;
  steps: number;
  levelName?: string;
  isCustomLevel?: boolean;
  isTestMode?: boolean;
  backToEditor?: () => void;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ 
  level, 
  steps, 
  levelName, 
  isCustomLevel,
  isTestMode,
  backToEditor
}) => {
  const navigate = useNavigate();
  const levelText = isCustomLevel ? "Custom Level" : `Level ${level}`;
  
  const handleSaveLevel = () => {
    try {
      // Get the custom level from localStorage
      const storedLevel = localStorage.getItem('testing_level');
      if (!storedLevel) {
        toast.error('Level data not found');
        return;
      }
      
      const levelData = JSON.parse(storedLevel);
      
      // Get existing custom levels
      const existingLevelsJSON = localStorage.getItem('stealthmate_custom_levels');
      const existingLevels = existingLevelsJSON ? JSON.parse(existingLevelsJSON) : [];
      
      // Add new level or update if it exists
      const updatedLevels = [...existingLevels, levelData];
      
      // Save to localStorage
      localStorage.setItem('stealthmate_custom_levels', JSON.stringify(updatedLevels));
      toast.success('Level saved successfully');
      
      // Navigate to level select
      navigate('/levels');
    } catch (error) {
      toast.error('Failed to save level');
      console.error('Error saving level:', error);
    }
  };

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
          ) : (
            <Button onClick={() => navigate('/levels')} className="bg-amber-600 hover:bg-amber-700 text-zinc-950">
              Back to Levels
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
