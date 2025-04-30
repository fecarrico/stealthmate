
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

export interface EnemyData {
  type: CellType;
  position: [number, number];
}

export interface LevelData {
    id: number;
    level: number;
    name: string;
    playerStart: [number, number];
    kings?: [number, number][];
    enemies: EnemyData[];
    boxes: [number, number][];
    board?: number[][];
    isCustom?: boolean;
}

// Function to load custom level from level code
export const loadLevelFromCode = (code: string): LevelData | null => {
  try {
    let levelData = JSON.parse(atob(code));
    // Ensure 'boxes' field is present
    if (levelData && !levelData.boxes && levelData.box) {
      // Rename 'box' to 'boxes' if it exists
      levelData.boxes = levelData.box;
      delete levelData.box;
    }

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
