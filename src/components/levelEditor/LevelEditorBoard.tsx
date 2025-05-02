
import React from 'react';
import GamePiece from '../GamePiece';
import { GameCell } from '@/utils/levelData';
import EditorHeader from './EditorHeader';

interface LevelEditorBoardProps {
  board: GameCell[][];
  sightLines: any[];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  handleTestLevel: () => void;
  canSaveLevel: boolean;
  isEditMode?: boolean;
}

const LevelEditorBoard: React.FC<LevelEditorBoardProps> = ({
  board,
  sightLines,
  selectedCell,
  onCellClick,
  handleTestLevel,
  canSaveLevel,
  isEditMode
}) => {
  return (
    <div className="col-span-2 flex flex-col space-y-4">
      <EditorHeader 
        testButtonText={isEditMode ? "Test & Save" : "Test & Save"}
        handleTestLevel={handleTestLevel}
        canSave={canSaveLevel} 
      />
      <div className="relative aspect-square w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {/* Level Grid */}
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateRows: `repeat(${board.length}, 1fr)`,
            gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Determine if this cell is the selected cell
              const isSelected =
                selectedCell &&
                selectedCell[0] === rowIndex &&
                selectedCell[1] === colIndex;

              // Alternate colors for the chess-like grid effect
              const isEvenSquare = (rowIndex + colIndex) % 2 === 0;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    border border-zinc-800 p-1 relative cursor-pointer
                    ${isEvenSquare ? 'bg-zinc-900' : 'bg-zinc-800'}
                    ${isSelected ? 'ring-2 ring-amber-500 ring-inset' : ''}
                  `}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GamePiece type={cell.type} />
                  </div>
                  {/* Position indicator (small numbers in corner) */}
                  <div className="absolute bottom-0.5 right-1 text-[8px] opacity-50 font-mono">
                    {rowIndex},{colIndex}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sight lines */}
        {sightLines.map((line, index) => (
          <div
            key={`line-${index}`}
            className="absolute bg-red-500/40"
            style={{
              left: `${(line.start[1] / board[0].length) * 100}%`,
              top: `${(line.start[0] / board.length) * 100}%`,
              width: `${
                Math.abs(line.end[1] - line.start[1]) / board[0].length * 100
              }%`,
              height: `${
                Math.abs(line.end[0] - line.start[0]) / board.length * 100
              }%`,
              transform: `translate(${
                line.end[1] < line.start[1] ? "-100%" : "0"
              }, ${line.end[0] < line.start[0] ? "-100%" : "0"})`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelEditorBoard;
