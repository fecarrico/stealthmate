import { LevelData, CellType } from '../utils/levelData';

const level3: LevelData = {
  id: 3,
  level: 3,
  name: 'Level 3',
  board: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 2, 0],
    [0, 0, 3, 0, 0],
    [0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  playerStart: [1, 1],
  enemies: [
    { type: CellType.QUEEN, position: [4, 0] }
  ],
  boxes: [
    [3, 3],
    [2, 3],
  ],
};
export default level3;