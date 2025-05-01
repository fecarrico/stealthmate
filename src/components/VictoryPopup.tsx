
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface VictoryPopupProps {
  level: number;
  steps: number;
  levelName?: string;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ level, steps, levelName }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-8 max-w-md text-center transform animate-scale-in">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Level Complete!</h2>
        {levelName && <p className="text-lg text-zinc-300 mb-4">{levelName}</p>}
        <p className="text-zinc-400 mb-6">
          Congratulations! You completed Level {level} in {steps} steps.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/levels')} className="bg-amber-600 hover:bg-amber-700 text-zinc-950">
            Back to Levels
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
