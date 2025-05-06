
import React from 'react';
import { CellType } from '@/utils/levelData';
import GamePiece from './GamePiece';

interface GameBoardProps {
  board: {
    type: CellType;
    position: [number, number];
    isCoffin?: boolean;
  }[][];
  sightLines: [number, number][];
  showSightLines?: boolean;
  playerPosition?: [number, number];
  playerDetected?: boolean;
  detectingEnemies?: [number, number][];
  isEditorMode?: boolean;
  onCellClick?: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  sightLines,
  showSightLines = false,
  playerPosition,
  playerDetected = false,
  detectingEnemies = [],
  isEditorMode = false,
  onCellClick,
}) => {
  if (!board || board.length === 0) return null;
  
  // Function to determine if a cell is in sight lines
  const isInSightLine = (row: number, col: number) => {
    return showSightLines && sightLines.some(([r, c]) => r === row && c === col);
  };
  
  // Function to determine if a cell is a detecting enemy
  const isDetectingEnemy = (row: number, col: number) => {
    return detectingEnemies.some(([r, c]) => r === row && c === col);
  };
  
  // Function to get cell color
  const getCellColor = (row: number, col: number) => {
    if ((row + col) % 2 === 0) {
      return 'bg-zinc-800/50';
    }
    return 'bg-zinc-900';
  };
  
  const handleCellClick = (row: number, col: number) => {
    if (isEditorMode && onCellClick) {
      onCellClick(row, col);
    }
  };
  
  return (
    <div className="w-full h-full grid" style={{
      gridTemplateRows: `repeat(${board.length}, 1fr)`,
      gridTemplateColumns: `repeat(${board[0].length}, 1fr)`
    }}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className={`relative ${getCellColor(rowIndex, colIndex)} ${
              isInSightLine(rowIndex, colIndex) ? 'sight-line' : ''
            } ${
              isDetectingEnemy(rowIndex, colIndex) ? 'bg-red-800/50' : ''
            } ${
              playerPosition && playerPosition[0] === rowIndex && playerPosition[1] === colIndex && playerDetected ? 'bg-red-900/70' : ''
            } ${
              isEditorMode ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            style={{
              outline: isInSightLine(rowIndex, colIndex) ? '2px solid rgba(255, 100, 100, 0.5)' : 'none'
            }}
          >
            <GamePiece 
              type={cell.type}
              isDetected={playerPosition && playerPosition[0] === rowIndex && playerPosition[1] === colIndex && playerDetected}
              isEditorMode={isEditorMode}
              isCoffin={cell.isCoffin}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
