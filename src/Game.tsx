import React from "react";
import { useNavigate } from "react-router-dom";

const Game: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Yearley</h1>
            <p>The game starts now! </p>
            <button onClick={() => navigate("/")}>Go Back</button>
        </div>
    );
};

export default Game;