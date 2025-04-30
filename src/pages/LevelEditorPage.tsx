
import React from 'react';
import { Button } from '@/components/ui/button';
import LevelEditor from '@/components/LevelEditor';
import { Shield } from 'lucide-react';

const LevelEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <LevelEditor />
      </div>
    </div>
  );
};

export default LevelEditorPage;
