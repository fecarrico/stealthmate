
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
  name?: string;
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
  // Level 1 - Custom Level from the provided code
  {
    id: 1,
    name: "First Mission",
    size: [5, 5],
    playerStart: [0, 0],
    kings: [[4, 4]],
    enemies: [
      { type: CellType.BISHOP, position: [0, 4] },
      { type: CellType.BISHOP, position: [4, 0] },
    ],
    boxes: [
      [2, 1],
      [1, 2],
    ],
  },
  
  // Level 2 - 6x6 board with more enemies
  {
    id: 2,
    name: "Warehouse Heist",
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
    name: "Dungeon Depths",
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
  
  // Level 4 - 8x8 chess-like board with challenging setup
  {
    id: 4,
    name: "Grand Master",
    size: [8, 8],
    playerStart: [0, 0],
    kings: [
      [7, 7],
      [7, 0],
      [0, 7],
    ],
    enemies: [
      { type: CellType.ROOK, position: [1, 1] },
      { type: CellType.BISHOP, position: [6, 1] },
      { type: CellType.QUEEN, position: [3, 3] },
      { type: CellType.ROOK, position: [3, 7] },
      { type: CellType.BISHOP, position: [6, 6] },
    ],
    boxes: [
      [1, 2],
      [2, 1],
      [4, 4],
      [5, 5],
      [6, 3],
      [3, 6],
    ],
  },
];

// Function to load custom level from level code
export const loadLevelFromCode = (code: string): LevelData | null => {
  try {
    const levelData = JSON.parse(atob(code));
    return levelData;
  } catch (error) {
    console.error("Failed to parse level code:", error);
    return null;
  }
};

// Function to save custom level to local storage
export const saveCustomLevel = (level: LevelData): void => {
  try {
    const customLevels = getCustomLevels();
    customLevels.push(level);
    localStorage.setItem('stealthmate_custom_levels', JSON.stringify(customLevels));
  } catch (error) {
    console.error("Failed to save custom level:", error);
  }
};

// Function to get all custom levels from local storage
export const getCustomLevels = (): LevelData[] => {
  try {
    const customLevels = localStorage.getItem('stealthmate_custom_levels');
    return customLevels ? JSON.parse(customLevels) : [];
  } catch (error) {
    console.error("Failed to get custom levels:", error);
    return [];
  }
};

export default levels;
