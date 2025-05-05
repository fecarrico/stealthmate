import { useState, useEffect, useCallback } from 'react';
import levels from '../../levels/levels';

// Hook for tracking scores and level completion
export const useScores = () => {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<Record<number, boolean>>({});
  const [unlockedLevels, setUnlockedLevels] = useState<Record<number, boolean>>({});
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
      
      // Load unlocked levels - initialize with correct progression based on completed levels
      const storedUnlocked = localStorage.getItem('stealthmate_unlocked_levels');
      
      if (storedUnlocked) {
        setUnlockedLevels(JSON.parse(storedUnlocked));
      } else {
        // Initialize with level 1 unlocked by default
        setUnlockedLevels({ 1: true });
        localStorage.setItem('stealthmate_unlocked_levels', JSON.stringify({ 1: true }));
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
      
      // Unlock next level
      const nextLevelId = levelId + 1;
      if (nextLevelId <= levels.length) {
        const newUnlockedLevels = { ...unlockedLevels, [nextLevelId]: true };
        setUnlockedLevels(newUnlockedLevels);
        localStorage.setItem('stealthmate_unlocked_levels', JSON.stringify(newUnlockedLevels));
      }
    } catch (error) {
      console.error('Error saving score to localStorage:', error);
    }
  }, [bestScores, completedLevels, unlockedLevels]);

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
    
    // Custom levels are always unlocked
    if (levelId >= 1000) return true;
    
    // A level is unlocked if it has been completed
    if (completedLevels[levelId]) return true;
    
    // A level is unlocked if the previous level has been completed
    if (completedLevels[levelId - 1]) return true;
    
    // A level is unlocked if it has a best score recorded
    // (which means it was completed at some point)
    if (bestScores[levelId]) return true;
    
    // A level is unlocked if the previous level has a best score
    // (which means the previous level was completed)
    if (bestScores[levelId - 1]) return true;
    
    // Otherwise, check if it's in the unlockedLevels map
    return unlockedLevels[levelId] || false;
  }, [completedLevels, bestScores, unlockedLevels]);

  return {
    bestScores,
    totalSteps,
    saveBestScore,
    addToTotalSteps,
    resetTotalSteps,
    getBestTotalScore,
    calculateTotalSteps,
    isLevelCompleted,
    isLevelUnlocked
  };
};
