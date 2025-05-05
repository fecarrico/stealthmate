
import { LevelData, CellType } from '../utils/levelData';

const level2: LevelData = {
    id: 2,
    level: 2,
    name: "Role Holes",
    playerStart: [0, 0],
    kings: [[0, 4]],
    enemies: [],
    boxes: [[1, 1], [3, 2]],
    holes: [[2, 0], [2, 1], [2, 2], [2, 3], [1, 3], [0, 3], [1, 4], [2, 4]],
    isCustom: false,
    boardSize: 5,
    board: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
};

export default level2;
