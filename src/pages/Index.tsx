
import React from "react";
import GameTitle from "../components/GameTitle";

// This is a placeholder file to avoid conflicts with main.tsx
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <GameTitle />
      <h1 className="text-2xl font-bold text-amber-500">App initialized</h1>
    </div>    
  );
};

export default Index;
