
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
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  sightLines, 
  editorMode = false,
  onCellClick,
  selectedCell
}) => {
  const rows = board.length;
  const cols = board[0].length;
  
  // Check if a position is in sight line
  const isInSightLine = (row: number, col: number): boolean => {
    return sightLines.some(([r, c]) => r === row && c === col);
  };
  
  // Check if cell is selected in editor mode
  const isSelected = (row: number, col: number): boolean => {
    return editorMode && selectedCell !== null && 
      selectedCell[0] === row && selectedCell[1] === col;
  };

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
            {isInSightLine(rowIndex, colIndex) && !editorMode && (
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
