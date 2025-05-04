
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
        return isDetected ? '💨' : '🥷';
      case CellType.KING:
        return '👑';
      case CellType.ROOK:
        return '♖';
      case CellType.BISHOP:
        return '♗';
      case CellType.QUEEN:
        return '♕';
      case CellType.BOX:
        return '📦';
      case CellType.KNIGHT:
        return '♘';
      case CellType.PAWN:
        return '♙';
      case CellType.HOLE:
        return 'X';
      default:
        return '';
    }
  };

  if (type === CellType.EMPTY) {
    return null;
  }

  // For hole type, render a transparent div
  if (type === CellType.HOLE) {
    return (
      <div className="absolute inset-0 bg-transparent border border-zinc-800/30" />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center text-3xl">
      {getEmoji()}
    </div>
  );
};

export default GamePiece;
