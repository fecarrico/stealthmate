
import { LevelData, CellType } from '../utils/levelData';

const level4: LevelData = {
  id: 4,
  level: 4,
  name: 'Level 4',
  board: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 2, 0],
    [0, 0, 3, 0, 0],
    [0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  playerStart: [1, 1] as [number, number],
  enemies: [
    { type: CellType.QUEEN, position: [4, 0] as [number, number] },
  ],
  boxes: [
    [3, 3],
    [2, 3],
  ] as [number, number][],
};

export default level4;
