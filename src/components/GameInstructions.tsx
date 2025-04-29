
import React from 'react';

const GameInstructions: React.FC = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-400">
      <p>Move with arrow keys. Press Z to undo.</p>
      <p>Capture all kings without being spotted by the enemy pieces.</p>
      <p>Hold the Ninja Instinct button to see enemy sight lines (3 uses per level).</p>
    </div>
  );
};

export default GameInstructions;
