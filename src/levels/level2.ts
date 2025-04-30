import { LevelData, CellType } from '../utils/levelData';


const level2: LevelData = {
  id: 2,
  level: 2,
  name: "Level 2",
  playerStart: [0, 0],
  kings: [[4, 4]],
  enemies: [
    { type: CellType.BISHOP, position: [4, 0] },
    { type: CellType.BISHOP, position: [0, 4] },
  ],
  boxes: [[1, 1], [1, 2], [2, 1]],
};

export default level2;