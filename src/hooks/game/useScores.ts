
import { useState, useCallback, useEffect } from 'react';

// Hook for managing game scores
export const useScores = () => {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [totalSteps, setTotalSteps] = useState<number[]>([]);

  // Load best scores from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('stealthmate_best_scores');
      if (savedScores) {
        setBestScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Error loading best scores:", error);
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
  }, [bestScores]);

  // Get the best score for a level
  const getBestScoreForLevel = useCallback((levelNumber: number): number | undefined => {
    return bestScores[levelNumber];
  }, [bestScores]);

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
  };
};
