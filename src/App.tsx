
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from "./components/SplashScreen";
import LevelSelectPage from "./pages/LevelSelectPage";
import GamePage from "./pages/GamePage";
import LevelEditorPage from "./pages/LevelEditorPage";

import "./styles/index.css";
import "./styles/victoryPopup.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/editor" element={<LevelEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
