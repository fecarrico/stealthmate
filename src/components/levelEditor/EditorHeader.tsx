
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface EditorHeaderProps {
  handleTestLevel: () => void;
  canSave: boolean;
  testButtonText?: string;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  handleTestLevel, 
  canSave,
  testButtonText = "Test & Save"
}) => {
  const navigate = useNavigate();
  
  const handleTestClick = () => {
    if (!canSave) {
      toast.error("Level must have a player and at least one king");
      return;
    }
    handleTestLevel();
  };
  
  return (
    <div className="flex justify-between items-center">
      <div className="text-amber-500 flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <span>StealthMate Level Editor</span>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="border-zinc-700 text-zinc-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleTestClick} 
          className={`bg-green-600 hover:bg-green-700 text-zinc-950 font-medium ${!canSave ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Play className="mr-1 h-4 w-4" />
          {testButtonText}
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
