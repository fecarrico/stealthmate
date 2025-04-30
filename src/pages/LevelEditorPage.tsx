import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LevelData } from '@/utils/levelData';

interface LevelEditorProps {
  onTestLevel: (level: LevelData) => void;
  onSave: (level: LevelData) => void;
}

const LevelEditor: React.FC<LevelEditorProps> = ({ onTestLevel, onSave }) => {
  const [levelName, setLevelName] = React.useState("My Level");
  const [rows, setRows] = React.useState<number>(10);
  const [cols, setCols] = React.useState<number>(10);
  const [playerStart, setPlayerStart] = React.useState<[number, number]>([1, 1]);
  const [guardStarts, setGuardStarts] = React.useState<[number, number][]>([]);
  const [exit, setExit] = React.useState<[number, number]>([8, 8]);

  const handleTest = () => {
    onTestLevel({ levelName, rows, cols, playerStart, guardStarts, exit });
  };

  const handleSave = () => {
    onSave({ levelName, rows, cols, playerStart, guardStarts, exit });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <h1>Level Editor</h1>
      <Input type="text" placeholder="Level Name" value={levelName} onChange={(e) => setLevelName(e.target.value)} />
      <Input type="number" placeholder="Rows" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} />
      <Input type="number" placeholder="Cols" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} />
      {/* Add more inputs for playerStart, guardStarts, exit, etc. */}
      <div className="flex gap-4">
        <Button onClick={handleTest} className="game-button bg-amber-600 hover:bg-amber-700">Test</Button>
        <Button onClick={handleSave} className="game-button bg-amber-600 hover:bg-amber-700">Save</Button>
      </div>


    </div>
  );
};

export default LevelEditor;
