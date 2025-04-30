
import React from 'react';
import { LevelData, CellType } from './levelData';

// Generate a simple preview of the game board for level thumbnails
export const getGameBoardPreview = (level: LevelData) => {
  const { size, playerStart, kings, enemies, boxes } = level;
  const [rows, cols] = size;
  
  // Create an empty board representation
  let board = Array(rows).fill(0).map(() => Array(cols).fill(''));
  
  // Fill player position
  board[playerStart[1]][playerStart[0]] = '🥷';
  
  // Fill kings positions
  kings.forEach(([row, col]) => {
    board[row][col] = '♔';
  });
  
  // Fill enemy positions
  enemies.forEach(enemy => {
    const [row, col] = enemy.position;
    switch(enemy.type) {
      case CellType.ROOK:
        board[row][col] = '♖';
        break;
      case CellType.BISHOP:
        board[row][col] = '♗';
        break;
      case CellType.QUEEN:
        board[row][col] = '♕';
        break;
    }
  });
  
  // Fill box positions
  boxes.forEach(([row, col]) => {
    board[row][col] = '📦';
  });
  
  return (
    <div 
      className="grid w-full h-full"
      style={{ 
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`
      }}
    >
      {board.map((row, rowIdx) => 
        row.map((cell, colIdx) => (
          <div 
            key={`${rowIdx}-${colIdx}`} 
            className={`flex items-center justify-center text-sm ${(rowIdx + colIdx) % 2 === 0 ? 'bg-zinc-700' : 'bg-zinc-800'}`}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

// Load the custom level from the code
export const getCustomLevelFromCode = (code: string): LevelData | null => {
  try {
    return JSON.parse(atob(code)) as LevelData;
  } catch (error) {
    console.error("Invalid level code:", error);
    return null;
  }
};
