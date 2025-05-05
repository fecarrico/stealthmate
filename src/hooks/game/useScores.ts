
import { useState, useEffect, useCallback } from 'react';
import levels from '../../levels/levels';

// Hook for tracking scores and level completion
export const useScores = () => {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<Record<number, boolean>>({});
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
    } catch (error) {
      console.error('Error loading scores from localStorage:', error);
    }
  }, []);

  // Save best score for a level and mark as completed
  const saveBestScore = useCallback((levelId: number, score: number): void => {
    try {
      // Check if this level has a best score or if the new score is better
      if (!bestScores[levelId] || score < bestScores[levelId]) {
        const newBestScores = { ...bestScores, [levelId]: score };
        setBestScores(newBestScores);
        localStorage.setItem('stealthmate_best_scores', JSON.stringify(newBestScores));
      }
      
      // Mark level as completed
      const newCompletedLevels = { ...completedLevels, [levelId]: true };
      setCompletedLevels(newCompletedLevels);
      localStorage.setItem('stealthmate_completed_levels', JSON.stringify(newCompletedLevels));
      
    } catch (error) {
      console.error('Error saving score to localStorage:', error);
    }
  }, [bestScores, completedLevels]);

  // Reset all scores and progression
  const resetAllProgress = useCallback((): void => {
    try {
      // Reset best scores
      setBestScores({});
      localStorage.removeItem('stealthmate_best_scores');
      
      // Reset completed levels
      setCompletedLevels({});
      localStorage.removeItem('stealthmate_completed_levels');
      
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
      // Level 1 is always unlocked
      if (levelId === 1) return true;

      // A level is unlocked if the previous level is completed
      return completedLevels[levelId - 1] || false;
  }, [completedLevels]);

  const areAllOfficialLevelsCompleted = useCallback((): boolean => {
      const lastOfficialLevelId = levels.length;
      return completedLevels[lastOfficialLevelId] || false;
  }, [completedLevels, levels]);

  return {
    bestScores,
    totalSteps,
    saveBestScore,
    addToTotalSteps,
    resetTotalSteps,
    getBestTotalScore,
    calculateTotalSteps,
    isLevelCompleted,
    isLevelUnlocked,
    resetAllProgress,
    areAllOfficialLevelsCompleted
  };
};
