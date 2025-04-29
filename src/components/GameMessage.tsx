
import React from 'react';

interface GameMessageProps {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
}

const GameMessage: React.FC<GameMessageProps> = ({ 
  message, 
  isError = false,
  isSuccess = false,
}) => {
  if (!message) return null;
  
  let classes = 'py-2 px-4 rounded-md text-white text-center font-medium animate-slide-in shadow-lg border';
  
  if (isError) {
    classes += ' bg-red-900/80 border-red-700';
  } else if (isSuccess) {
    classes += ' bg-green-900/80 border-green-700';
  } else {
    classes += ' bg-zinc-800/80 border-zinc-700';
  }
  
  return (
    <div className={classes}>
      {message}
    </div>
  );
};

export default GameMessage;
