
import { LevelData, CellType } from '../utils/levelData';

const tutorial1: LevelData = {
    id: 101,  // Using a specific ID range for tutorials
    level: 101,
    name: "First Steps",
    playerStart: [1, 0],
    kings: [[1, 2]],
    enemies: [],
    boxes: [],
    holes: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 2], [2, 1]],
    isCustom: false,
    isTutorial: true,
    boardSize: 3,
    board: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
};

export default tutorial1;
