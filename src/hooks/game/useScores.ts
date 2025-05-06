
import { useState, useEffect, useCallback } from 'react';
import { tutorialLevels, regularLevels } from '../../levels/levels';

// Hook for tracking scores and level completion
export const useScores = () => {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<Record<number, boolean>>({});
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  // Load scores and completed levels from localStorage when component mounts
  useEffect(() => {
    try {
      // Load best scores
      const storedScores = localStorage.getItem('stealthmate_best_scores');
      if (storedScores) {
        setBestScores(JSON.parse(storedScores));
      }
      
      // Load completed levels
      const storedCompleted = localStorage.getItem('stealthmate_completed_levels');
      if (storedCompleted) {
        setCompletedLevels(JSON.parse(storedCompleted));
      }

      // Load unlocked levels
      const storedUnlocked = localStorage.getItem('stealthmate_unlocked_levels');
      if (storedUnlocked) {
        setUnlockedLevels(JSON.parse(storedUnlocked));
      }
    } catch (error) {
      console.error('Error loading game progress from localStorage:', error);
    }
  }, []);

  // Save best score for a level and mark as completed
  const saveBestScore = useCallback((levelId: number, score: number): void => {
    try {
      // Use functional update for bestScores to ensure we have the latest state
      setBestScores(prevBestScores => {
        const currentBestScore = prevBestScores[levelId];
        // Only update if there's no existing score or the new score is better
        if (currentBestScore === undefined || score < currentBestScore) {
          const newBestScores = { ...prevBestScores, [levelId]: score };
          localStorage.setItem('stealthmate_best_scores', JSON.stringify(newBestScores));
          return newBestScores; // Return the new state
        }
        return prevBestScores; // Return previous state if no update is needed
      }
      );
      setCompletedLevels(newCompletedLevels);
      localStorage.setItem('stealthmate_completed_levels', JSON.stringify(newCompletedLevels));
      
    } catch (error) {
      console.error('Error saving score to localStorage:', error);
    }
  }, [bestScores, completedLevels, setBestScores, setCompletedLevels]);

  // Unlock a level
  const unlockLevel = useCallback((levelId: number): void => {
    try {
      // Only unlock if not already unlocked
      if (!unlockedLevels.includes(levelId)) {
        const newUnlockedLevels = [...unlockedLevels, levelId];
        setUnlockedLevels(newUnlockedLevels);
        localStorage.setItem('stealthmate_unlocked_levels', JSON.stringify(newUnlockedLevels));
      }
    } catch (error) {
      console.error('Error unlocking level:', error);
    }
  }, [unlockedLevels]);

  // Reset all scores and progression
  const resetAllProgress = useCallback((): void => {
    try {
      // Reset best scores
      setBestScores({});
      localStorage.removeItem('stealthmate_best_scores');
      
      // Reset completed levels
      setCompletedLevels({});
      localStorage.removeItem('stealthmate_completed_levels');
      
      // Reset unlocked levels
      setUnlockedLevels([]);
      localStorage.removeItem('stealthmate_unlocked_levels');
      
      // Reset total steps
      setTotalSteps(0);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, []);

  // Add number of steps to total
  const addToTotalSteps = useCallback((steps: number): void => {
    try {
      const newTotal = totalSteps + steps;
      setTotalSteps(newTotal);
    } catch (error) {
      console.error('Error updating total steps:', error);
    }
  }, [totalSteps]);

  // Reset total steps
  const resetTotalSteps = useCallback((): void => {
    setTotalSteps(0);
  }, []);

  // Get the current best total score across all levels
  const getBestTotalScore = useCallback((): number => {
    return Object.values(bestScores).reduce((total, score) => total + score, 0);
  }, [bestScores]);

  // Calculate the total steps from best scores
  const calculateTotalSteps = useCallback((): number => {
    return getBestTotalScore();
  }, [getBestTotalScore]);

  // Check if a level is completed
  const isLevelCompleted = useCallback((levelId: number): boolean => {
    return completedLevels[levelId] || false;
  }, [completedLevels]);

  // Check if a level is unlocked
  const isLevelUnlocked = useCallback((levelId: number): boolean => {
    return levelId === 101 || unlockedLevels.includes(levelId);
  }, [unlockedLevels]);

  const areAllOfficialLevelsCompleted = useCallback((): boolean => {
    console.log('Checking if all official levels are completed...');
    console.log('Completed levels state:', completedLevels);
    // Iterate through all levels and check if all official levels are completed
    const allLevels = [...tutorialLevels, ...regularLevels];
    const areAllCompleted = allLevels.every(level => {
      // An official level is not a tutorial and not a custom level placeholder
      const isOfficial = !level.isTutorial && !level.isCustomLevel;
      // If it's an official level, check if it's in completedLevels
      return !isOfficial || (completedLevels[level.level] === true);
    });
    console.log('Result of all official levels completed check:', areAllCompleted);
    return areAllCompleted;
  }, [completedLevels]);

  return {
    bestScores,
    totalSteps,
    saveBestScore,
    addToTotalSteps,
    resetTotalSteps,
    getBestTotalScore,
    calculateTotalSteps,
    isLevelCompleted,
    unlockLevel,
    isLevelUnlocked,
    resetAllProgress,
    areAllOfficialLevelsCompleted
  };
};