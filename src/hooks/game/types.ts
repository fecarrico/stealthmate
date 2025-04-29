
import { CellType } from '../../utils/levelData';

// Game state interface
export interface GameState {
  level: number;
  board: GameCell[][];
  playerPosition: [number, number];
  steps: number;
  sightLines: [number, number][];
  gameOver: boolean;
  victory: boolean;
  message: string;
  ninjaInstinct: number;
  levelName: string;
  history: GameHistory[];
  isCustomLevel?: boolean;
}

export interface GameCell {
  type: CellType;
  position: [number, number];
}

export interface GameHistory {
  board: GameCell[][];
  playerPosition: [number, number];
  steps: number;
}

export interface LevelState {
  levelComplete: boolean;
  allLevelsComplete: boolean;
  totalSteps: number[];
  bestScores: Record<number, number>;
  showVictory: boolean;
}
