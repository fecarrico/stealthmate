
import React from 'react';
import { Input } from '@/components/ui/input';

interface LevelNameInputProps {
  levelName: string;
  setLevelName: (name: string) => void;
}

const LevelNameInput: React.FC<LevelNameInputProps> = ({ levelName, setLevelName }) => {
  return (
    <div className="space-y-2">
      <label>Level Name</label>
      <Input 
        value={levelName} 
        onChange={(e) => setLevelName(e.target.value)}
        className="bg-zinc-800 border-zinc-700"
      />
    </div>
  );
};

export default LevelNameInput;
