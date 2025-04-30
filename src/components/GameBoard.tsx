
import React from 'react';
import { GameCell } from '../utils/levelData';
import GamePiece from './GamePiece';
import { getCellColor } from '../utils/gameLogic';

interface GameBoardProps {
  board: GameCell[][];
  sightLines: [number, number][];
  editorMode?: boolean;
  onCellClick?: (row: number, col: number) => void;
  selectedCell?: [number, number] | null;
  showSightLines?: boolean;
  playerPosition?: [number, number];
  currentHintMove?: number[] | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  sightLines, 
  editorMode = false,
  onCellClick,
  selectedCell,
  showSightLines = false,
  playerPosition,
  currentHintMove
}) => {
  // Safely handle the case when board is undefined or empty
  if (!board || board.length === 0) {
    return <div className="game-board empty-board bg-zinc-800 w-full h-full flex items-center justify-center">
      <p className="text-zinc-400">No board data available</p>
    </div>;
  }

  const rows = board.length;
  const cols = board[0]?.length || 0; // Use optional chaining to safely access board[0]
  
  // Check if a position is in sight line
  const isInSightLine = (row: number, col: number): boolean => {
    return sightLines.some(([r, c]) => r === row && c === col);
  };
  
  // Check if cell is selected in editor mode
  const isSelected = (row: number, col: number): boolean => {
    return editorMode && selectedCell !== null && 
      selectedCell[0] === row && selectedCell[1] === col;
  };

  // Check if cell is the hint move cell
  const isHintMove = (row: number, col: number): boolean => {
    return currentHintMove !== null && 
           currentHintMove !== undefined && 
           currentHintMove.length === 2 &&
           currentHintMove[0] === row && 
           currentHintMove[1] === col;
  };

  // If we have rows but no columns, return a message
  if (cols === 0) {
    return <div className="game-board empty-board bg-zinc-800 w-full h-full flex items-center justify-center">
      <p className="text-zinc-400">Invalid board data</p>
    </div>;
  }

  return (
    <div 
      className="game-board w-full h-full"
      style={{ 
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)` 
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              game-cell relative 
              bg-${getCellColor(rowIndex, colIndex)} 
              ${editorMode ? 'cursor-pointer hover:opacity-75' : ''}
              ${isSelected(rowIndex, colIndex) ? 'ring-2 ring-yellow-400' : ''}
              ${isHintMove(rowIndex, colIndex) ? 'ring-2 ring-green-400' : ''}
            `}
            onClick={editorMode && onCellClick ? () => onCellClick(rowIndex, colIndex) : undefined}
            data-position={`${rowIndex},${colIndex}`}
          >
            {isInSightLine(rowIndex, colIndex) && !editorMode && showSightLines && (
              <div className="sight-line absolute inset-0 bg-red-500/20" />
            )}
            {cell.type !== 'empty' && <GamePiece type={cell.type} />}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
