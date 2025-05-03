
import { LevelData, CellType } from '../utils/levelData';

const level3: LevelData = {
  id: 3,
  level: 3,
  name: "God save me!",
  playerStart: [0, 0],
  kings: [
    [6, 6]
  ],
  enemies: [
    { type: CellType.BISHOP, position: [0, 6] },
    { type: CellType.ROOK, position: [6, 0] },
    { type: CellType.QUEEN, position: [3, 3] }
  ],
  boxes: [
    [1, 1], [1, 5],
    [2, 2], [2, 4],
    [4, 2], [4, 4],
    [5, 1], [5, 5]
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
