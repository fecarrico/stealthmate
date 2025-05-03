
import { LevelData, CellType } from '../utils/levelData';

const level2: LevelData = {
  id: 2,
  level: 2,
  name: "Werehouse",
  playerStart: [6, 0],
  kings: [[0, 6]],
  enemies: [
    { type: CellType.ROOK, position: [0, 0] },
    { type: CellType.BISHOP, position: [6, 6] }
  ],
  boxes: [
    [1, 0], [1, 1], [1, 3], [1, 5],
    [2, 1], [2, 3], [2, 5],
    [3, 1], [3, 3], [3, 5],
    [4, 1], [4, 3], [4, 5],
    [5, 1], [5, 3], [5, 5]
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
