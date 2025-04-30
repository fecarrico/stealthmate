
import React from 'react';

const AuthorFooter: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-3 text-xs text-right text-zinc-500">
      Created by <a href="https://www.linkedin.com/in/fecarrico" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Felipe Carriço</a>
    </div>
  );
};

export default AuthorFooter;
