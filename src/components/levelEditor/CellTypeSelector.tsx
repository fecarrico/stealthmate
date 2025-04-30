
import React from 'react';
import { Button } from '@/components/ui/button';
import { CellType } from '@/utils/levelData';
import { Shield, Box } from 'lucide-react';

interface CellTypeSelectorProps {
  selectedCellType: CellType;
  setSelectedCellType: (type: CellType) => void;
}

const CellTypeSelector: React.FC<CellTypeSelectorProps> = ({ 
  selectedCellType, 
  setSelectedCellType 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.values(CellType).map((type) => (
        <Button 
          key={type}
          variant={selectedCellType === type ? "default" : "outline"}
          onClick={() => setSelectedCellType(type)}
          className={`h-16 ${selectedCellType !== type ? 'border-zinc-700 hover:bg-zinc-800' : ''} text-zinc-950`}
        >
          <div className="flex flex-col items-center">
            {type === CellType.PLAYER && (
              <Shield className="w-5 h-5 mb-1" />
            )}
            {type === CellType.BOX && (
              <Box className="w-5 h-5 mb-1" />
            )}
            {type !== CellType.PLAYER && type !== CellType.BOX && (
              <div className="w-5 h-5 mb-1">{
                type === CellType.KING ? '♔' : 
                type === CellType.ROOK ? '♖' : 
                type === CellType.BISHOP ? '♗' : 
                type === CellType.QUEEN ? '♕' : ''
              }</div>
            )}
            <span className="text-xs">{type}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default CellTypeSelector;
