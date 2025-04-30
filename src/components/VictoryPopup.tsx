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
    <div className="victory-popup">
      <div className="victory-content">
        <CheckCircle className="victory-icon" />
        <h2 className="victory-title">Level Complete!</h2>
        {levelName && <p className="victory-level-name">{levelName}</p>}
        <p className="victory-message">
          Congratulations! You completed Level {level} in {steps} steps.
        </p>
        <div className="victory-buttons">
          <Button onClick={() => navigate('/levels')} className="victory-button">
            Back to Levels
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;
