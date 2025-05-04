
import { LevelData, CellType } from '../utils/levelData';

const level3: LevelData = {
  id: 3,
  level: 3,
  name: "Royal Checkmate",
  playerStart: [0, 0], // Player at top-left
  kings: [
    [1, 6], // King at second row, right
    [6, 1]  // King at bottom row, second column
  ],
  enemies: [
    { type: CellType.BISHOP, position: [0, 6] }, // Bishop at top-right
    { type: CellType.BISHOP, position: [6, 0] }, // Bishop at bottom-left
    { type: CellType.QUEEN, position: [6, 6] }   // Queen at bottom-right
  ],
  boxes: [
    [0, 2], [0, 3], // Top row boxes
    [1, 1], // Second row
    [2, 0], [2, 2], [2, 3], // Third row boxes
    [3, 0], [3, 2] // Fourth row boxes
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

export default level3;
