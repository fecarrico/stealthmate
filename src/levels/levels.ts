
import { LevelData } from '../utils/levelData';

/**
 * Import all level files dynamically using import.meta.glob
 * This technique allows the level system to automatically find all level files
 */
const levelModules = import.meta.glob<{ default: LevelData }>('./level*.ts', { eager: true });
const tutorialModules = import.meta.glob<{ default: LevelData }>('./tutorial*.ts', { eager: true });

// Get tutorial levels
const tutorialLevels: LevelData[] = Object.values(tutorialModules)
  .map(module => module.default)
  .sort((a, b) => a.level - b.level);

// Get regular levels
const regularLevels: LevelData[] = Object.values(levelModules)
  .map(module => module.default)
  .sort((a, b) => a.level - b.level);

// Create a master sequence of level IDs for progression
export const masterLevelSequence: number[] = [
  ...tutorialLevels.map(level => level.id),
  ...regularLevels.map(level => level.id),
];

// Add a helper function to get level by ID
export const getLevelById = (id: number): LevelData | undefined => {
 return tutorialLevels.find(level => level.id === id || level.level === id) ||
 regularLevels.find(level => level.id === id || level.level === id);
};

export { tutorialLevels, regularLevels };
