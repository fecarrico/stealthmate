import { LevelData, CellType } from '../utils/levelData';


const level1: LevelData = {
  id: 1,
  level: 1,
  name: "Level 1",
  playerStart: [0, 0],
  kings: [[4, 4]],
  enemies: [
    { type: CellType.BISHOP, position: [4, 0] },
    { type: CellType.BISHOP, position: [0, 4] },
  ],
  boxes: [[1, 1], [1, 2], [2, 1]],
};

export default level1;