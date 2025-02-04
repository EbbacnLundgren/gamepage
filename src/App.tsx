import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Game from "./Game";
import Dog from "./Dog";
import './App.css';


import './App.css'

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Ebba's Game Page</h1>

      <div className="button-container">
      <button onClick={() => navigate("/game")}>Guess the year of the song!</button>
      <button onClick={() => navigate("/dog")}>Guess the dog!</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/dog" element={<Dog />} />
    </Routes>
  );
};

export default App;

