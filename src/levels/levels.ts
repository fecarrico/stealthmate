
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

// Combine tutorial levels first, then regular levels
const levels: LevelData[] = [...tutorialLevels, ...regularLevels];

export default levels;
