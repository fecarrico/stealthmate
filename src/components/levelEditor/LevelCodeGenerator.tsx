
import React from 'react';
import { Button } from '@/components/ui/button';
import { LevelData } from '@/utils/levelData';
import { toast } from '@/components/ui/sonner';

interface LevelCodeGeneratorProps {
  generateLevelData: () => LevelData | null;
}

const LevelCodeGenerator: React.FC<LevelCodeGeneratorProps> = ({ generateLevelData }) => {
  const generateLevelCode = () => {
    const levelData = generateLevelData();
    if (levelData) {
      try {
        const levelCode = btoa(JSON.stringify(levelData));
        navigator.clipboard.writeText(levelCode);
        toast.success("Level code copied to clipboard");
      } catch (error) {
        console.error("Error generating level code:", error);
        toast.error("Failed to generate level code");
      }
    }
  };

  return (
    <Button 
      onClick={generateLevelCode} 
      className="w-full bg-amber-600 hover:bg-amber-700 text-zinc-950 font-medium"
    >
      Generate & Copy Code
    </Button>
  );
};

export default LevelCodeGenerator;
