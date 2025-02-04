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
  
    // Find similar breeds
    for (const breed in breeds) {
      if (breed.includes(mainBreed) && breed !== correctBreed) {
        similarBreeds.push(breed);
      }
    }
  
    // If not enough similar breeds, find breeds starting with the same letter
    if (similarBreeds.length < 3) {
      const firstLetter = mainBreed.charAt(0);
      for (const breed in breeds) {
        if (breed.startsWith(firstLetter) && breed !== correctBreed && !similarBreeds.includes(breed)) {
          similarBreeds.push(breed);
        }
      }
    }
  
    // Ensure we have exactly 3 options
    while (similarBreeds.length > 3) {
      similarBreeds.pop();
    }
  
    // Add the correct breed to the options
    similarBreeds.push(correctBreed);
  
    // Shuffle the options
    similarBreeds = similarBreeds.sort(() => Math.random() - 0.5);
  
    setOptions(similarBreeds);
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleGuess = (selectedBreed: string) => {
    setSelectedOption(selectedBreed); 

    if (selectedBreed === dogs[currentRound].breed) {
        setScore(score + 1);
    }

    setTimeout(() => {
        setSelectedOption(null); 
        if (currentRound < 9) {
        setCurrentRound(currentRound + 1);
        generateOptions(dogs, currentRound + 1, allBreeds);
        } else {
        setGameOver(true);
        }
    }, 1000); // Delay before next round
    };

  const restartGame = () => {
    setDogs([]);
    setCurrentRound(0);
    setScore(0);
    setGameOver(false);
    const loadDogs = async () => {
      const fetchedDogs = await fetchMultipleDogs(10);
      setDogs(fetchedDogs);
      generateOptions(fetchedDogs, 0, allBreeds);
    };
    loadDogs();
  };

  const getFeedbackMessage = (score: number): string => {
    if (score <= 3) {
        return "Practice more for next time!🐾";
    } else if (score <=6) {
        return "Good work!🎉"
    } else {
        return "Well done! You are a dog expert!🐶";
    }
  }

  if (dogs.length === 0) return <p>Loading game...</p>;

  return (
    <div>
      {!gameOver ? (
        <div>
          <h1>Guess the dog!!🐶</h1>
          <div className="rounds">
            <p>Round {currentRound + 1} of 10</p>
          </div>
          <img
            src={dogs[currentRound].imageUrl}
            alt="Guess the dog"
            style={{ width: "300px", borderRadius: "10px", height: "300px", objectFit: "cover" }}
          />
          
          <div className="button-container">
                {options.map((breed) => (
                    <button 
                    key={breed} 
                    onClick={() => handleGuess(breed)}
                    className={`dog-button 
                        ${selectedOption === breed 
                        ? breed === dogs[currentRound].breed 
                            ? "correct" 
                            : "wrong"
                        : ""}`}
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
          <button onClick={restartGame}>Play Again style</button>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default Dog;

//visa alternativ som liknar varandra, eller börjar på samma bokstav
//  inte så många alternativ, samt ändra färg på den knapp man trycker, timer, vissa box terrier istället för terrier box
//att bilden alltid stannar där den är och att den inte flyttar sig bara för att bilden är liten
//När man väljer fel --> visa grönt vilken som va den rätta eller ha som facit efter