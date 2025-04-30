
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface BoardSizeControlProps {
  boardSize: [number, number];
  handleBoardSizeChange: (newSize: number[]) => void;
}

const BoardSizeControl: React.FC<BoardSizeControlProps> = ({ 
  boardSize, 
  handleBoardSizeChange 
}) => {
  return (
    <div className="space-y-2">
      <label>Board Size: {boardSize[0]}x{boardSize[1]}</label>
      <Slider 
        defaultValue={[boardSize[0]]} 
        min={2} 
        max={15} 
        step={1} 
        onValueChange={handleBoardSizeChange}
        className="py-4"
      />
    </div>
  );
};

export default BoardSizeControl;
