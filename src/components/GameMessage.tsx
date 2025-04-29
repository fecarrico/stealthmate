
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
  
  let classes = 'py-2 px-4 rounded-md text-white text-center font-medium animate-slide-in';
  
  if (isError) {
    classes += ' bg-red-500';
  } else if (isSuccess) {
    classes += ' bg-green-500';
  } else {
    classes += ' bg-blue-500';
  }
  
  return (
    <div className={classes}>
      {message}
    </div>
  );
};

export default GameMessage;
