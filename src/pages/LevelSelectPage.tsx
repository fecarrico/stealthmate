import React, {useState, useEffect} from 'react';
import { getCustomLevels, LevelData, saveCustomLevel } from '@/utils/levelData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loadLevelFromCode } from '@/utils/levelData';
import { useGameState } from '@/hooks/useGameState';
import { Shield, Code, ArrowRight, ChevronLeft, Trash2, Edit } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LevelSelectPage: React.FC = () => {  
  const [levelCode, setLevelCode] = useState<string>('');
  const [customLevels, setCustomLevels] = useState<LevelData[]>([]);
  const [levelToDelete, setLevelToDelete] = useState<LevelData | null>(null);
  const navigate = useNavigate();

  const {loadCustomLevel, bestScores, getLevels, loadLevel } = useGameState();

  useEffect(() => {
    // Load custom levels from localStorage when component mounts
    setCustomLevels(getCustomLevels());
  }, []);
  
  const handleLoadCode = () => {
    if (levelCode.trim()) {
      try {
        const level = loadLevelFromCode(levelCode);
        if (level) {
          // Save the custom level from code
          localStorage.setItem('testing_level', JSON.stringify(level));
          navigate('/game?mode=test');
          toast.success('Custom level loaded!');
        } else {
          toast.error('Invalid level code');
        }
      } catch (error) {
        toast.error('Failed to load level from code');
      }
    } else {
      toast.error('Please enter a level code');
    }
  };

  const handleLevelSelect = (levelId: number) => {
    loadLevel(levelId);
    navigate(`/game?levelId=${levelId}`);
  };

  const handleCustomLevelSelect = (level: LevelData) => {
    try {
      loadCustomLevel(level);
      navigate('/game?mode=custom');
      localStorage.setItem('testing_level', JSON.stringify(level));
    } catch (error) {
      console.error("Error loading custom level:", error);
      toast.error("Failed to load custom level");
    }
  };

  const handleEditLevel = (event: React.MouseEvent, level: LevelData) => {
    event.stopPropagation();
    // Store the level data for editing
    localStorage.setItem('testing_level', JSON.stringify(level));
    navigate('/editor');
  };

  const handleDeleteLevel = (event: React.MouseEvent, level: LevelData) => {
    event.stopPropagation();
    setLevelToDelete(level);
  };

  const confirmDeleteLevel = () => {
    if (!levelToDelete) return;

    try {
      // Filter out the level to delete
      const updatedLevels = customLevels.filter(level => level.id !== levelToDelete.id);
      
      // Save the updated levels to localStorage
      localStorage.setItem('stealthmate_custom_levels', JSON.stringify(updatedLevels));
      
      // Update state
      setCustomLevels(updatedLevels);
      
      // Clear selected level
      setLevelToDelete(null);
      
      toast.success('Level deleted successfully');
    } catch (error) {
      console.error("Error deleting level:", error);
      toast.error('Failed to delete level');
    }
  };
  
  const levels = getLevels();
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-amber-500 flex items-center gap-2">
        <Shield className="h-8 w-8" />
        StealthMate
      </h1>
      
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-zinc-200 border-zinc-700" 
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={16} />
            Back to Main Menu
          </Button>
          
          <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Select a Level
          </h2>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-zinc-200">Official Levels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {levels.map((level) => (
            <Card 
              key={level.level} 
              className="bg-zinc-900 border-zinc-800 hover:border-amber-500 transition-all cursor-pointer overflow-hidden"
              onClick={() => handleLevelSelect(level.level)}
            >
              <div className="h-32 bg-zinc-800 relative">
                {/* Level preview would go here */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent flex items-end p-3">
                  <div className="bg-amber-600 text-zinc-950 font-bold px-2 py-1 rounded-sm text-xs">
                    Level {level.level}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-zinc-200">{level.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-zinc-400">Best Score:</span>
                  <span className="text-amber-400 font-bold">{bestScores[level.level] ?? "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {customLevels.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-zinc-300">Your Custom Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {customLevels.map((level) => (
                <Card 
                  key={level.id} 
                  className="bg-zinc-900 border-zinc-700 hover:border-amber-500 transition-all cursor-pointer overflow-hidden opacity-90 hover:opacity-100"
                  onClick={() => handleCustomLevelSelect(level)}
                >
                  <div className="h-24 bg-zinc-800 relative">
                    {/* Custom level preview would go here */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent flex items-end p-3">
                      <div className="bg-green-600 text-zinc-950 font-bold px-2 py-1 rounded-sm text-xs">
                        Custom
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button 
                        className="p-1.5 bg-blue-500/80 hover:bg-blue-600 rounded-full text-white"
                        onClick={(e) => handleEditLevel(e, level)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white"
                        onClick={(e) => handleDeleteLevel(e, level)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-md font-bold text-zinc-300">{level.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-zinc-400">Best Score:</span>
                      <span className="text-green-400 font-bold">{bestScores[level.id] ?? "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        
        <Card className="mt-8 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-200 flex items-center gap-2">
              <Code size={18} />
              Custom Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Enter level code..." 
                value={levelCode} 
                onChange={(e) => setLevelCode(e.target.value)} 
                className="flex-grow bg-zinc-800 border-zinc-700 text-zinc-200"
              />
              <Button 
                onClick={handleLoadCode} 
                className="bg-amber-600 hover:bg-amber-700 text-zinc-950 flex items-center gap-2 font-medium"
              >
                Load Level
                <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full max-w-6xl mt-8 text-xs text-right text-zinc-500">
        Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
      </div>

      <AlertDialog open={!!levelToDelete} onOpenChange={(open) => {
        if (!open) setLevelToDelete(null);
      }}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom level? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={confirmDeleteLevel}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LevelSelectPage;
