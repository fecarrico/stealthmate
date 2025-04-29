
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
  const saveBestScore = useCallback((levelId: number, steps: number) => {
    const currentBest = bestScores[levelId];
    
    if (!currentBest || steps < currentBest) {
      const newBestScores = { ...bestScores, [levelId]: steps };
      setBestScores(newBestScores);
      
      try {
        localStorage.setItem('stealthmate_best_scores', JSON.stringify(newBestScores));
      } catch (error) {
        console.error("Error saving best score:", error);
      }
    }
  }, [bestScores]);

  // Add steps to total steps
  const addToTotalSteps = useCallback((steps: number) => {
    setTotalSteps((prev) => [...prev, steps]);
  }, []);

  // Reset total steps
  const resetTotalSteps = useCallback(() => {
    setTotalSteps([]);
  }, []);

  return {
    bestScores,
    totalSteps,
    saveBestScore,
    addToTotalSteps,
    resetTotalSteps,
  };
};
