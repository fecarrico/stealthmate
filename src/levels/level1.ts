
import { LevelData, CellType } from '../utils/levelData';

const level1: LevelData = {
  id: 1,
  level: 1,
  name: "Level 1",
  playerStart: [0, 0] as [number, number],
  kings: [[4, 4]] as [number, number][],
  enemies: [
    { type: CellType.BISHOP, position: [4, 0] as [number, number] },
    { type: CellType.BISHOP, position: [0, 4] as [number, number] },
  ],
  boxes: [[1, 1], [1, 2], [2, 1]] as [number, number][],
  board: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
};

export default level1;
