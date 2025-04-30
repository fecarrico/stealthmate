
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LevelData } from '@/utils/levelData';
import LevelEditor from '@/components/LevelEditor';

const LevelEditorPage: React.FC = () => {
  // Test level function
  const handleTestLevel = (level: LevelData) => {
    console.log("Testing level:", level);
    // Implementation could be added here
  };

  // Save level function
  const handleSave = (level: LevelData) => {
    console.log("Saving level:", level);
    // Implementation could be added here
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-amber-500">Level Editor</h1>
      <div className="w-full max-w-6xl">
        <LevelEditor />
      </div>
    </div>
  );
};

export default LevelEditorPage;
