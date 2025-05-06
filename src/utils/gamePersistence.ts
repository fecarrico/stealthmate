interface GameProgress {
  bestScores: Record<number, number>;
  completedLevels: Record<number, boolean>;
  unlockedLevels: number[];
}

const STORAGE_KEY_BEST_SCORES = 'stealthmate_best_scores';
const STORAGE_KEY_COMPLETED_LEVELS = 'stealthmate_completed_levels';
const STORAGE_KEY_UNLOCKED_LEVELS = 'stealthmate_unlocked_levels';

export const saveGameProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY_BEST_SCORES, JSON.stringify(progress.bestScores));
    localStorage.setItem(STORAGE_KEY_COMPLETED_LEVELS, JSON.stringify(progress.completedLevels));
    localStorage.setItem(STORAGE_KEY_UNLOCKED_LEVELS, JSON.stringify(progress.unlockedLevels));
  } catch (error) {
    console.error('Error saving game progress to localStorage:', error);
  }
};

export const loadGameProgress = (): GameProgress => {
  try {
    const storedScores = localStorage.getItem(STORAGE_KEY_BEST_SCORES);
    const storedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED_LEVELS);
    const storedUnlocked = localStorage.getItem(STORAGE_KEY_UNLOCKED_LEVELS);

    const bestScores: Record<number, number> = storedScores ? JSON.parse(storedScores) : {};
    const completedLevels: Record<number, boolean> = storedCompleted ? JSON.parse(storedCompleted) : {};
    const unlockedLevels: number[] = storedUnlocked ? JSON.parse(storedUnlocked) : [];

    return {
      bestScores,
      completedLevels,
      unlockedLevels,
    };
  } catch (error) {
    console.error('Error loading game progress from localStorage:', error);
    return {
      bestScores: {},
      completedLevels: {},
      unlockedLevels: [],
    };
  }
};

export const clearGameProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_BEST_SCORES);
    localStorage.removeItem(STORAGE_KEY_COMPLETED_LEVELS);
    localStorage.removeItem(STORAGE_KEY_UNLOCKED_LEVELS);
  } catch (error) {
    console.error('Error clearing game progress from localStorage:', error);
  }
};