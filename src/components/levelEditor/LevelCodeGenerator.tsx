
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
      const levelCode = btoa(JSON.stringify(levelData));
      navigator.clipboard.writeText(levelCode);
      toast.success("Level code copied to clipboard");
    }
  };

  return (
    <Button 
      onClick={generateLevelCode} 
      className="w-full text-zinc-950"
      variant="outline"
    >
      Generate & Copy Code
    </Button>
  );
};

export default LevelCodeGenerator;
