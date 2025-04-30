
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Save, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditorHeaderProps {
  handleSaveLevel: () => void;
  handleTestLevel: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ handleSaveLevel, handleTestLevel }) => {
  const navigate = useNavigate();
  
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
        <Button onClick={handleSaveLevel} className="bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium">
          <Save className="mr-1 h-4 w-4" />
          Save Level
        </Button>
        <Button onClick={handleTestLevel} className="bg-green-600 hover:bg-green-700 text-zinc-950 font-medium">
          <Play className="mr-1 h-4 w-4" />
          Test Level
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
