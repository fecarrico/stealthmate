
import { LevelData } from '../utils/levelData';

/**
 * Import all level files dynamically using import.meta.glob
 * This technique allows the level system to automatically find all level files
 */
const levelModules = import.meta.glob<{ default: LevelData }>('./level*.ts', { eager: true });

// Sort the levels by level number to ensure consistent ordering
const levels: LevelData[] = Object.values(levelModules)
  .map(module => module.default)
  .sort((a, b) => a.level - b.level);

export default levels;
