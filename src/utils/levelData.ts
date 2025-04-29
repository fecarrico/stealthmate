
export enum CellType {
  EMPTY = 'empty',
  PLAYER = 'player',
  KING = 'king',
  ROOK = 'rook',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  BOX = 'box',
}

export interface GameCell {
  type: CellType;
  position: [number, number];
}

export interface LevelData {
  id: number;
  size: [number, number];
  playerStart: [number, number];
  kings: [number, number][];
  enemies: {
    type: CellType;
    position: [number, number];
  }[];
  boxes: [number, number][];
}

const levels: LevelData[] = [
  // Level 1 - 5x5 board with basic setup
  {
    id: 1,
    size: [5, 5],
    playerStart: [0, 0],
    kings: [[4, 4]],
    enemies: [
      { type: CellType.ROOK, position: [1, 2] },
      { type: CellType.BISHOP, position: [3, 1] },
    ],
    boxes: [
      [2, 1],
      [2, 3],
    ],
  },
  
  // Level 2 - 6x6 board with more enemies
  {
    id: 2,
    size: [6, 6],
    playerStart: [0, 0],
    kings: [[5, 5]],
    enemies: [
      { type: CellType.ROOK, position: [2, 1] },
      { type: CellType.BISHOP, position: [4, 2] },
      { type: CellType.QUEEN, position: [1, 4] },
    ],
    boxes: [
      [1, 1],
      [3, 3],
      [4, 1],
    ],
  },
  
  // Level 3 - 7x7 board with multiple kings
  {
    id: 3,
    size: [7, 7],
    playerStart: [0, 0],
    kings: [
      [6, 6],
      [0, 6],
    ],
    enemies: [
      { type: CellType.ROOK, position: [3, 3] },
      { type: CellType.BISHOP, position: [5, 1] },
      { type: CellType.QUEEN, position: [1, 5] },
      { type: CellType.ROOK, position: [6, 2] },
    ],
    boxes: [
      [2, 2],
      [4, 4],
      [5, 5],
      [1, 6],
    ],
  },
];

export default levels;
