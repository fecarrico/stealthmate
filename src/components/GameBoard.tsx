
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
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  sightLines, 
  editorMode = false,
  onCellClick,
  selectedCell,
  showSightLines = false
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

  // If we have rows but no columns, return a message
  if (cols === 0) {
    return <div className="game-board empty-board bg-zinc-800 w-full h-full flex items-center justify-center">
      <p className="text-zinc-400">Invalid board data</p>
    </div>;
  }

  return (
    <div 
      className="game-board"
      style={{ 
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`game-cell bg-${getCellColor(rowIndex, colIndex)} 
              ${editorMode ? 'cursor-pointer hover:opacity-75' : ''}
              ${isSelected(rowIndex, colIndex) ? 'ring-2 ring-yellow-400' : ''}
            `}
            onClick={editorMode && onCellClick ? () => onCellClick(rowIndex, colIndex) : undefined}
            data-position={`${rowIndex},${colIndex}`}
          >
            {isInSightLine(rowIndex, colIndex) && !editorMode && showSightLines && (
              <div className="sight-line absolute inset-0" />
            )}
            {cell.type !== 'empty' && <GamePiece type={cell.type} />}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
