
import React from 'react';
import { LevelData } from '../utils/levelData';

interface LevelSelectorProps {
  levels: LevelData[];
  bestScores: { [key: number]: number };
  handleSelectLevel: (levelId: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, bestScores, handleSelectLevel }) => {
  
  return (
    <div className="level-selector-container">
      <h2 className="level-selector-title">Select a Level</h2>
      <div className="level-grid">
        {levels.map((level, index) => {
          const isDark = index % 2 === 0;
          const backgroundColor = isDark ? "#3f3f46" : "#52525b";
          const textColor = isDark ? "text-white" : "text-black";
          return (
            <div
              key={level.level}
              className={`level-cell ${textColor}`}
              style={{ backgroundColor }}
            >
              <div className="level-button" onClick={() => handleSelectLevel(level.level)}>
                {level.name} - Best Score: {bestScores?.[level.level] ?? "N/A"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LevelSelector;
