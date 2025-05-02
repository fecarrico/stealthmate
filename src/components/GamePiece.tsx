
import React from 'react';
import { CellType } from '../utils/levelData';

interface GamePieceProps {
  type: CellType;
  isDetected?: boolean;
}

const GamePiece: React.FC<GamePieceProps> = ({ type, isDetected = false }) => {
  const getEmoji = () => {
    switch (type) {
      case CellType.PLAYER:
        return isDetected ? '💨' : '🦹';
      case CellType.KING:
        return '👑';
      case CellType.ROOK:
        return '🏰';
      case CellType.BISHOP:
        return '⛪';
      case CellType.QUEEN:
        return '👸';
      case CellType.BOX:
        return '📦';
      default:
        return '';
    }
  };

  if (type === CellType.EMPTY) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center text-3xl">
      {getEmoji()}
    </div>
  );
};

export default GamePiece;
