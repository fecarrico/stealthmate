
import { LevelData, CellType } from '../utils/levelData';

const level2: LevelData = {
  id: 2,
  level: 2,
  name: "Box Fortress",
  playerStart: [0, 0], // Player at top-left
  kings: [[5, 5]], // King at bottom-right
  enemies: [
    { type: CellType.ROOK, position: [0, 5] }, // Rook at top-right
    { type: CellType.BISHOP, position: [6, 6] } // Bishop at bottom-right
  ],
  boxes: [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 6], // Top row boxes
    [1, 2], [1, 3], [1, 4], [1, 6], // Second row boxes
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 6], // Third row boxes
    [4, 1], [4, 2], // Boxes in fifth row
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4] // Bottom row boxes
  ],
  board: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  boardSize: 7
};

export default level2;
