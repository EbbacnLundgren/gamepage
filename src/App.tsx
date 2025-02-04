import { useEffect, useState } from 'react'
import {fetchMultipleDogs} from "./api";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Game from "./Game";
import Dog from "./Dog";


import './App.css'

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Ebba's Game Page</h1>
      
      <button onClick={() => navigate("/game")}>Guess the year of the song!</button>
      <button onClick={() => navigate("/dog")}>Guess the dog!</button>
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

