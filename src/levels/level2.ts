
import { LevelData, CellType } from '../utils/levelData';

const level2: LevelData = {
  id: 2,
  level: 2,
  name: "Werehouse",
  playerStart: [0, 0],
  kings: [[5, 5]],
  enemies: [
    { type: CellType.ROOK, position: [0, 5] },
    { type: CellType.BISHOP, position: [5, 6] }
  ],
  boxes: [
    [0,1], [0,2], [0,3], [0,4], [0,6],
    [1,1], [1,2], [1,3], [1,4],
    [2,1], [2,2], [2,3], [2,4],
    [3,1],
    [4,1], [4,2],
    [6,0], [6,1], [6,2], [6,3]
  ],
  board: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ]
};

export default level2;
