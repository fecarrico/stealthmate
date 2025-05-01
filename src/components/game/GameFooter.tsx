
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface GameFooterProps {
  steps: number;
  ninjaInstinctAvailable: number;
  ninjaInstinctCost: number;
  getHint: () => Promise<{ moves: number[][] } | null>;
  setNinjaInstinctAvailable: (value: number) => void;
  showHint: boolean;
  hintMoves: number[][];
  hintStep: number;
  setHintStep: (step: number) => void;
  setShowHint: (show: boolean) => void;
}

const GameFooter: React.FC<GameFooterProps> = ({
  steps,
  ninjaInstinctAvailable,
  ninjaInstinctCost,
  getHint,
  setNinjaInstinctAvailable,
  showHint,
  hintMoves,
  hintStep,
  setHintStep,
  setShowHint
}) => {
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [hintCostMultiplier, setHintCostMultiplier] = useState(1);
  
  const handleGetHint = async () => {
    const cost = ninjaInstinctCost * hintCostMultiplier;
    if (cost > ninjaInstinctAvailable) {
      toast.error("Not enough Ninja Instinct!");
      return;
    }
    
    const hint = await getHint();
    if (hint && hint.moves && hint.moves.length > 0) {
      setShowHint(true);
      setHintStep(0);
      setNinjaInstinctAvailable(ninjaInstinctAvailable - cost);
      setHintDialogOpen(false);
    } else {
      toast.error("No hint available for this level.");
    }
  };
  
  const handlePrevHint = () => {
    if (hintStep > 0) {
      setHintStep(hintStep - 1);
    }
  };
  
  const handleNextHint = () => {
    if (hintStep < hintMoves.length - 1) {
      setHintStep(hintStep + 1);
    }
  };
  
  const hintCost = ninjaInstinctCost * hintCostMultiplier;
  
  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-zinc-400">
          Steps: <span className="font-bold text-zinc-200">{steps}</span>
        </div>
        
        <div className="text-sm text-zinc-400">
          Ninja Instinct: <span className="font-bold text-green-500">{ninjaInstinctAvailable}</span>
        </div>
        
        <Dialog open={hintDialogOpen} onOpenChange={setHintDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-zinc-700 text-zinc-300">
              <Lightbulb className="mr-2 h-4 w-4" />
              Get Hint ({hintCost})
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle>Get a Hint</DialogTitle>
              <DialogDescription>
                Using a hint will cost you Ninja Instinct. Adjust the slider to choose how many steps to reveal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="hint-steps" className="text-right">
                  Hint Steps
                </label>
                <Slider
                  id="hint-steps"
                  defaultValue={[1]}
                  max={5}
                  step={1}
                  onValueChange={(value) => setHintCostMultiplier(value[0])}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="hint-cost" className="text-right">
                  Hint Cost
                </label>
                <Input
                  type="text"
                  id="hint-cost"
                  value={hintCost.toString()}
                  readOnly
                  className="col-span-3 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setHintDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleGetHint}>
                Get Hint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {showHint && hintMoves.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300"
            onClick={handlePrevHint}
            disabled={hintStep === 0}
          >
            Previous Hint
          </Button>
          
          <span>
            Hint Step: {hintStep + 1} / {hintMoves.length}
          </span>
          
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300"
            onClick={handleNextHint}
            disabled={hintStep === hintMoves.length - 1}
          >
            Next Hint
          </Button>
        </div>
      )}
    </>
  );
};

export default GameFooter;
