
import React from 'react';
import { CellType } from '../utils/levelData';

interface GamePieceProps {
  type: CellType;
  isDetected?: boolean;
  isEditorMode?: boolean;
  isCoffin?: boolean;
}

const GamePiece: React.FC<GamePieceProps> = ({ type, isDetected = false, isEditorMode = false, isCoffin = false }) => {
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
        return isCoffin ? '⚰️' : '📦';
      case CellType.KNIGHT:
        return '♘';
      case CellType.PAWN:
        return '♙';
      case CellType.HOLE:
        return isEditorMode ? '⊗' : ''; // Show hole as ⊗ in editor mode, nothing in game mode
      default:
        return '';
    }
  };

  if (type === CellType.EMPTY) {
    return null;
  }

  // For hole type, render a transparent div in game mode
  if (type === CellType.HOLE && !isEditorMode) {
    return (
      <div className="absolute inset-0 bg-[rgb(9,9,11)] border border-zinc-800/30" />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center text-3xl">
      {getEmoji()}
    </div>
  );
};

export default GamePiece;
