
import React from 'react';
import { GameCell } from '../utils/levelData';
import GamePiece from './GamePiece';
import { getCellColor } from '../utils/gameLogic';

interface GameBoardProps {
  board: GameCell[][];
  sightLines: [number, number][];
}

const GameBoard: React.FC<GameBoardProps> = ({ board, sightLines }) => {
  const rows = board.length;
  const cols = board[0].length;
  
  // Check if a position is in sight line
  const isInSightLine = (row: number, col: number): boolean => {
    return sightLines.some(([r, c]) => r === row && c === col);
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
            className={`game-cell bg-${getCellColor(rowIndex, colIndex)}`}
          >
            {isInSightLine(rowIndex, colIndex) && (
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
