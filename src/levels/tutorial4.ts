
import { LevelData, CellType } from '../utils/levelData';

const tutorial4: LevelData = {
    id: 104,
    level: 104,
    name: "Bishop's Challenge",
    playerStart: [2, 0],
    kings: [[2, 4]],
    enemies: [{ type: CellType.BISHOP, position: [0, 3] }],
    boxes: [[2, 1], [2, 3], [0, 2]],
    holes: [[1, 1], [1, 2], [1, 3], [3, 2], [3, 0], [4, 0], [4, 4], [3, 4]],
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

export default tutorial4;
