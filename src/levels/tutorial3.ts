
import { LevelData, CellType } from '../utils/levelData';

const tutorial3: LevelData = {
    id: 103,
    level: 103,
    name: "Bridge the Gap",
    playerStart: [2, 0],
    kings: [[2, 4]],
    enemies: [],
    boxes: [[2, 2]],
    holes: [[2, 3], [1, 0], [0, 0], [0, 1], [1, 1], [1, 2], [0, 2], [0, 3], [1, 3], [1, 4], [0, 4], [3, 4], [4, 4], [4, 3], [3, 3], [4, 2], [3, 2], [3, 1], [4, 1], [4, 0], [3, 0]],
    isCustom: false,
    isTutorial: true,
    boardSize: 5,
    board: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
};

export default tutorial3;
