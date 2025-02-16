import { useState, useEffect } from "react";
import { fetchAllBreeds, fetchMultipleDogs } from "./api";
import { useNavigate } from "react-router-dom";

type Dog = {
  imageUrl: string;
  breed: string;
};

const Dog: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [allBreeds, setAllBreeds] = useState<Record<string, string[]>>({});
  const [showCorrect, setShowCorrect] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDogs = async () => {
      const fetchedDogs = await fetchMultipleDogs(10);
      const breeds = await fetchAllBreeds();
      setDogs(fetchedDogs);
      setAllBreeds(breeds);
      generateOptions(fetchedDogs, 0, breeds);
    };
    loadDogs();
  }, []);

  const generateOptions = (dogList: Dog[], roundIndex: number, breeds: Record<string, string[]>) => {
    if (dogList.length === 0) return;
  
    const correctBreed = dogList[roundIndex].breed;
    const [mainBreed] = correctBreed.split("-");
    let similarBreeds: string[] = [];
  
    for (const breed in breeds) {
      if (breed.includes(mainBreed) && breed !== correctBreed) {
        similarBreeds.push(breed);
      }
    }
  
    if (similarBreeds.length < 2) {
      const firstLetter = mainBreed.charAt(0);
      for (const breed in breeds) {
        if (breed.startsWith(firstLetter) && breed !== correctBreed && !similarBreeds.includes(breed)) {
          similarBreeds.push(breed);
        }
      }
    }
  

    while (similarBreeds.length > 2) {
      similarBreeds.pop();
    }
  

    similarBreeds.push(correctBreed);
  

    similarBreeds = similarBreeds.sort(() => Math.random() - 0.5);
  
    setOptions(similarBreeds);
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const correctSound = new Audio("/sounds/correct.mp3");
  const wrongSound = new Audio("/sounds/wrong.mp3");

    const handleGuess = (selectedBreed: string) => {
      if (isDisabled) return;
      console.log("handleGuess called with:", selectedBreed);
      setSelectedOption(selectedBreed); 
      setIsDisabled(true);

      if (selectedBreed === dogs[currentRound].breed) {
        setScore(score + 1);
        correctSound.play();
      } else {
        setShowCorrect(true);
        setShake(selectedBreed);
        wrongSound.play();
        setTimeout(() => setShake(null), 500);

      }

      setTimeout(() => {
        if (currentRound < 9) {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          generateOptions(dogs, nextRound, allBreeds);
          setSelectedOption(null);
          setShowCorrect(false);
          setIsDisabled(false);
        } else {
          setGameOver(true);
        }
      }, 2000); 
    };

  const [sessionScores, setSessionScores] = useState<number[]>(() => {
    const savedScores = sessionStorage.getItem("sessionScores");
    return savedScores ? JSON.parse(savedScores) : [];
  });

  const restartGame = async () => {

    setSessionScores((prevScores) => {
      const updatedScores = [...prevScores, score];
      sessionStorage.setItem("sessionScores", JSON.stringify(updatedScores));
      return updatedScores;
    });

    setDogs([]);
    setCurrentRound(0);
    setScore(0);
    setGameOver(false);
    setSelectedOption(null);
    setShowCorrect(false);
    setIsDisabled(false);

    const fetchedDogs = await fetchMultipleDogs(10);
    const breeds = await fetchAllBreeds();

    setDogs(fetchedDogs);
    setAllBreeds(breeds);
    generateOptions(fetchedDogs, 0, breeds);
};


  const getFeedbackMessage = (score: number): string => {
    if (score <= 3) {
        return "Practice more for next time!🐾";
    } else if (score <=6) {
        return "Good work champ!🎉"
    } else {
        return "Well done! You are a dog expert!🐶";
    }
  }

  if (dogs.length === 0) return <p>Loading game...</p>;

  return (
    <div className="game-container"> {/* Lägg game-container runt hela spelet */}
      {!gameOver ? (
        <div>
          <h1>GUESS THE DOG</h1>
          <div className="rounds">
            <p>Round {currentRound + 1} of 10</p>
          </div>
          <img
            src={dogs[currentRound].imageUrl}
            alt="Guess the dog"
            style={{ width: "300px", borderRadius: "10px", height: "300px", objectFit: "cover" }}
          />
          
          <div className="button-container">
            {options.map((breed, index) => (
              <button 
                key={index} 
                onClick={() => handleGuess(breed)}
                disabled={isDisabled} 
                className={`dog-button 
                  ${selectedOption === breed 
                    ? breed === dogs[currentRound].breed 
                      ? "correct" 
                      : "wrong"
                    : showCorrect && breed === dogs[currentRound].breed
                      ? "correct"
                    : ""} ${shake === breed ? "shake" : ""}`}
              >
                {breed}
              </button>
            ))}
          </div>
  
          <div className="back-button">
            <button onClick={() => navigate("/")}>Go Back</button>
          </div>
        </div>
      ) : (
        <div className="doneplaying">
          <h1>Thanks for playing!</h1>
          <p>You got {score} out of 10!</p>
          <p>{getFeedbackMessage(score)}</p>
  
          <h2>Previous Scores:</h2>
          <ul>
            {sessionScores.map((s, i) => (
              <li key={i}>Game {i + 1}: {s} points</li>
            ))}
          </ul>
  
          <div className="button-container">  
            <button onClick={restartGame}>Play Again!</button>
            <button onClick={() => navigate("/")}>Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Dog;


//inte så många alternativ, samt ändra färg på den knapp man trycker, timer, vissa box terrier istället för terrier box
//att bilden alltid stannar där den är och att den inte flyttar sig bara för att bilden är liten