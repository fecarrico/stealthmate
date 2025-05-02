
import { LevelData, CellType } from '../utils/levelData';

const level3: LevelData = {
  id: 3,
  level: 3,
  name: "God save me!",
  playerStart: [0, 0],
  kings: [
    [1, 6],
    [6, 1]
  ],
  enemies: [
    { type: CellType.BISHOP, position: [0, 6] },
    { type: CellType.BISHOP, position: [6, 0] },
    { type: CellType.QUEEN, position: [6, 6] }
  ],
  boxes: [
    [0,1], [0,2], [0,3],
    [1,1],
    [2,0], [2,1], [2,2], [2,3],
    [3,0], [3,1], [3,2]
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
