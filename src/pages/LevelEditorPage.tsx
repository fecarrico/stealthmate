
import React from 'react';
import LevelEditor from '@/components/LevelEditor';
import GameTitle from '@/components/GameTitle';
import AuthorFooter from '@/components/AuthorFooter';

const LevelEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4">
      <div className="mb-4 w-full flex justify-center">
        <GameTitle />
      </div>
      <div className="w-full max-w-6xl">
        <LevelEditor />
      </div>
    </div>
  );
};

export default LevelEditorPage;
