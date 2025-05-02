
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
    boardSize?: number;
}

// Function to load custom level from level code
export const loadLevelFromCode = (code: string): LevelData | null => {
  try {
    if (!code || code.trim() === '') {
      throw new Error('Empty code provided');
    }
    
    let levelData = JSON.parse(atob(code));
    
    // Ensure required fields are present
    if (!levelData || !levelData.playerStart || !Array.isArray(levelData.kings) || !Array.isArray(levelData.enemies)) {
      throw new Error('Invalid level data structure');
    }
    
    // Ensure 'boxes' field is present
    if (!levelData.boxes && levelData.box) {
      // Rename 'box' to 'boxes' if it exists
      levelData.boxes = levelData.box;
      delete levelData.box;
    }

    // Add id if not present
    if (!levelData.id) {
      levelData.id = Date.now();
    }
    
    // Add level number if not present
    if (!levelData.level) {
      levelData.level = 1000 + Date.now() % 1000;
    }
    
    // Set isCustom flag
    levelData.isCustom = true;

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
    
    // Check if level with same ID already exists
    const existingIndex = customLevels.findIndex(l => l.id === level.id);
    
    if (existingIndex >= 0) {
      // Replace existing level
      customLevels[existingIndex] = level;
    } else {
      // Add new level
      customLevels.push(level);
    }
    
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
