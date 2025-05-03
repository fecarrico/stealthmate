
import { CellType } from "../../utils/levelData";

export interface GameState {
  level: number;
  board: {
    type: CellType;
    position: [number, number];
  }[][];
  playerPosition: [number, number];
  steps: number;
  sightLines: [number, number][];
  gameOver: boolean;
  victory: boolean;
  message: string;
  ninjaInstinct?: number;
  levelName: string;
  isCustomLevel?: boolean;
  history: {
    board: {
      type: CellType;
      position: [number, number];
    }[][];
    playerPosition: [number, number];
    steps: number;
  }[];
  usedNinjaInstinct?: boolean;
  detectingEnemies?: [number, number][];
  showSightLines?: boolean;
  showingNinjaInstinct?: boolean;
}
