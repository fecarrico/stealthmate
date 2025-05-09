
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const GameInstructions: React.FC = () => {
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-2xl font-bold text-amber-500">Game Instructions</h2>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-zinc-200">Goal</h3>
          <p>Capture all kings on the board without being spotted by enemy pieces.</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-zinc-200">Controls</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Arrow keys to move</li>
            <li>Z key to undo a move</li>
            <li>Hold "Ninja Instinct" button to see enemy sight lines (limited uses)</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-zinc-200">Pieces</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="text-emerald-500">🥷</span> Player - You control this piece</li>
            <li><span className="text-amber-500">👑</span> King - Capture these to win</li>
            <li><span className="text-red-500">♖</span> Rook - Sees horizontally and vertically</li>
            <li><span className="text-blue-500">♗</span> Bishop - Sees diagonally</li>
            <li><span className="text-purple-500">♕</span> Queen - Sees in all directions</li>
            <li><span className="text-cyan-500">♘</span> Knight - Sees in L-shaped patterns</li>
            <li><span className="text-green-500">♙</span> Pawn - Sees diagonally forward</li>
            <li><span className="text-zinc-400">📦</span> Box - Can be pushed to block sight or capture enemies</li>
            <li><span className="text-zinc-400">⊗</span> Hole - Cannot be traversed, but pushing a box into it will fill the hole</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-zinc-200">Special Mechanics</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Push boxes into holes to fill them and create an empty space (the box disappears)</li>
            <li>Push boxes into enemies or kings to capture them</li>
            <li>Complete each level to unlock the next one</li>
            <li>Use Ninja Instinct wisely - you only have 3 uses per level</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInstructions;
