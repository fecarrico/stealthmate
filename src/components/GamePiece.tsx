
import React from 'react';
import { CellType } from '../utils/levelData';

interface GamePieceProps {
  type: CellType;
}

const GamePiece: React.FC<GamePieceProps> = ({ type }) => {
  switch (type) {
    case CellType.PLAYER:
      return (
        <div className="game-piece bg-player rounded-full border-2 border-white w-[80%] h-[80%] shadow-md animate-pulse">
          <span role="img" aria-label="player">🥷</span>
        </div>
      );
    case CellType.KING:
      return (
        <div className="game-piece bg-king rounded-lg border-2 border-amber-300 w-[80%] h-[80%] shadow-md">
          <span role="img" aria-label="king">♔</span>
        </div>
      );
    case CellType.ROOK:
      return (
        <div className="game-piece bg-enemy-rook rounded-lg border-2 border-white w-[80%] h-[80%] shadow-md">
          <span role="img" aria-label="rook">♖</span>
        </div>
      );
    case CellType.BISHOP:
      return (
        <div className="game-piece bg-enemy-bishop rounded-lg border-2 border-white w-[80%] h-[80%] shadow-md">
          <span role="img" aria-label="bishop">♗</span>
        </div>
      );
    case CellType.QUEEN:
      return (
        <div className="game-piece bg-enemy-queen rounded-lg border-2 border-white w-[80%] h-[80%] shadow-md">
          <span role="img" aria-label="queen">♕</span>
        </div>
      );
    case CellType.BOX:
      return (
        <div className="game-piece bg-box border-2 border-gray-700 w-[80%] h-[80%] shadow-md">
          <span role="img" aria-label="box">📦</span>
        </div>
      );
    default:
      return null;
  }
};

export default GamePiece;
