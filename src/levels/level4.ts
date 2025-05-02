import { LevelData, CellType } from '../utils/levelData';

const level4: LevelData = {
  id: 4,
  level: 4,
  name: "The cross",
  playerStart: [14, 7],
  kings: [
    [0, 0],
    [0, 14]
  ],
  enemies: [
    { type: CellType.QUEEN, position: [0, 7] },
    { type: CellType.QUEEN, position: [7, 0] },
    { type: CellType.QUEEN, position: [7, 14] }
  ],
  boxes: [
    [11, 6],
    [11, 8],
    [12, 7],
    [13, 6],
    [13, 8]
  ],
  board: Array(15).fill(null).map(() => Array(15).fill(0))
};

export default level4;
