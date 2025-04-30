import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SplashScreenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="text-4xl font-bold mb-4 text-amber-500 flex items-center gap-2">
        <Shield className="h-8 w-8" />
        StealthMate
      </div>
      <div className="flex gap-4">
        <Link to="/levels">
          <Button className="game-button bg-amber-600 hover:bg-amber-700">
            Select Level
          </Button>
        </Link>
        <Link to="/editor">
          <Button className="game-button bg-amber-600 hover:bg-amber-700">
            Create Level
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SplashScreenPage;