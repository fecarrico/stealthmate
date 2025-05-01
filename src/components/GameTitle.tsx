import { Shield } from "lucide-react";

const GameTitle = () => {
  return (
    <div className="flex items-center">
      <Shield className="h-6 w-6 text-amber-500 mr-2" />
      <h1 className="text-2xl font-bold text-amber-500">StealthMate</h1>
    </div>
  );
};

export default GameTitle;