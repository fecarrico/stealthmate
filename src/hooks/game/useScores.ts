import { useState, useCallback, useEffect } from 'react';

// Hook for managing game scores
export const useScores = () => {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [totalSteps, setTotalSteps] = useState<number[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Load best scores and completed levels from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('stealthmate_best_scores');
      if (savedScores) {
        setBestScores(JSON.parse(savedScores));
      }
      
      const savedCompletedLevels = localStorage.getItem('stealthmate_completed_levels');
      if (savedCompletedLevels) {
        setCompletedLevels(JSON.parse(savedCompletedLevels));
      }
    } catch (error) {
      console.error("Error loading game data:", error);
    }
  }, []);

  // Save best score to localStorage
  const saveBestScore = useCallback((levelNumber: number, steps: number) => {
    const currentBest = bestScores[levelNumber];
    
    if (!currentBest || steps < currentBest) {
      const newBestScores = { ...bestScores, [levelNumber]: steps };
      setBestScores(newBestScores);
      
      try {
        localStorage.setItem('stealthmate_best_scores', JSON.stringify(newBestScores));
      } catch (error) {
        console.error("Error saving best score:", error);
      }
    }
    
    // Add level to completed levels if not already completed
    if (!completedLevels.includes(levelNumber)) {
      const newCompletedLevels = [...completedLevels, levelNumber];
      setCompletedLevels(newCompletedLevels);
      try {
        localStorage.setItem('stealthmate_completed_levels', JSON.stringify(newCompletedLevels));
      } catch (error) {
        console.error("Error saving completed levels:", error);
      }
    }
  }, [bestScores, completedLevels]);

  // Get the best score for a level
  const getBestScoreForLevel = useCallback((levelNumber: number): number | undefined => {
    return bestScores[levelNumber];
  }, [bestScores]);
  
  // Check if a level is completed
  const isLevelCompleted = useCallback((levelNumber: number): boolean => {
    return completedLevels.includes(levelNumber);
  }, [completedLevels]);

  // Check if a level is unlocked
  const isLevelUnlocked = useCallback((levelNumber: number): boolean => {
    // Level 1 is always unlocked
    if (levelNumber === 1) return true;
    
    // Other levels are unlocked if the previous level is completed
    return isLevelCompleted(levelNumber - 1);
  }, [isLevelCompleted]);

  // Add steps to total steps
  const addToTotalSteps = useCallback((steps: number) => {
    setTotalSteps((prev) => [...prev, steps]);
  }, []);

  // Reset total steps
  const resetTotalSteps = useCallback(() => {
    setTotalSteps([]);
  }, []);

  // Calculate total steps from all completed levels
  const calculateTotalSteps = useCallback(() => {
    return Object.values(bestScores).reduce((sum, score) => sum + score, 0);
  }, [bestScores]);

  return {
    bestScores,
    totalSteps: calculateTotalSteps(),
    saveBestScore,
    getBestScoreForLevel,
    addToTotalSteps,
    resetTotalSteps,
    calculateTotalSteps,
    isLevelCompleted,
    isLevelUnlocked,
    completedLevels
  };
};
