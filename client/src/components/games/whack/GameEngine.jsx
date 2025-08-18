import React, { useState, useEffect, useRef } from "react";
import { Center, HStack, Text } from "@chakra-ui/react";
import * as GameService from "../../../../middleware/GameService";
import * as InventoryService from "../../../../middleware/InventoryService";

function Game({ userData, gameId, pasteSelected, brushSelected, setHasSelectedBoth }) {
  const INITIAL_TIME = 15;
  const INITIAL_LIVES = 3;
  const LEVELS = [
    { gameVelocity: 1000, time: 15 },
    { gameVelocity: 800, time: 20 },
    { gameVelocity: 650, time: 20 },
  ];

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [gameVelocity, setGameVelocity] = useState(LEVELS[0].gameVelocity);
  const [hitPosition, setHitPosition] = useState(null);
  const [gameIsOn, setGameIsOn] = useState(false);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("Acerte o dente sujo para ganhar pontos!");
  const [showButton, setShowButton] = useState(true);
  const [buttonText, setButtonText] = useState("Iniciar jogo");
  const [finalScore, setFinalScore] = useState(0);
  const [playerDidScore, setPlayerDidScore] = useState(false);
  const [mistakesCounter, setMistakesCounter] = useState(0);

  const squaresRef = useRef([]);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const playSound = (name, volume = 1) => {
    const audio = new Audio(`../../../audios/${name}`);
    audio.volume = volume;
    audio.play();
  };

  const saveScore = async (score) => {
    if (score > 0 && userData && gameId)
      await GameService.createGameProgress({
        userId: userData.id,
        gameId,
        userScore: score,
        userMistakes: mistakesCounter,
        datePlayed: new Date().toISOString(),
      })
        .then((response) => {
          console.log("Game progress saved:", response);
        })
        .catch((error) => {
          console.error("Failed to save game progress:", error);
        })

    const userOldInventory = await InventoryService.getInventoryItemsByUserId(userData.id)
    if (userOldInventory != null) {
      const coins = userOldInventory.coins + score;
      // console.log("User coins:", coins);

      const updatedInventory = {
        user_id: userData.id, // User ID
        items: userOldInventory.items.map((item) => item._id?.toString() || ""),
        coins: coins,
      };
      InventoryService.updateInventory(userOldInventory._id, updatedInventory)
        .then((response) => {
          console.log("Coins updated:", response);
        })
        .catch((error) => {
          console.error("Failed to update user coins:", error);
        });
    } else {
      console.warning("User inventory not found. Creating new inventory and saving coins...");

      const requestBody = {
        items: [], // Ensure items are strings
        user_id: userData.id, // User ID
        coins: coins, // Default to 0 if coins is undefined
      };
      await InventoryService.postNewInventory(requestBody);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) endGame();
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = () => {
    countdownRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
  };

  const resetBoard = () => {
    setTimeLeft(LEVELS[level - 1]?.time || INITIAL_TIME);
    setGameIsOn(false);
    setScore(0);
    setMessage("");
  }

  const endGame = () => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
    setGameIsOn(false);
    setShowButton(true);

    if (pasteSelected != 2) {
      playSound("lost.mp3", 0.5);
      setMessage("Talvez você devesse rever sua escolha de pasta! Tente novamente!");
      setButtonText("Jogar novamente");
      return;
    }

    if (score < 5) {
      playSound("lost.mp3", 0.5);
      setMessage(`Fim de jogo! Você obteve ${score} pontos! Você precisa de pelo menos 5 pontos para passar de fase!`);
      setButtonText("Jogar novamente");
      return;
    } else {
      playSound("level-win.mp3", 0.5);
      if (level < 3) {
        setMessage(`Fim de jogo! Você obteve ${score} pontos, muito bem! Ganhou +1 vida!`);
        setFinalScore(finalScore + score);
        setButtonText("Iniciar próxima fase");
        setLives(lives + 1);
      } else {
        const newFinalScore = finalScore + score + lives * 5;
        setMessage(`Fim de jogo! Sua pontuação total é ${newFinalScore} pontos.`);
        setButtonText("Jogar novamente");
        saveScore(newFinalScore);
      }
      return;
    }
  };

  const lastHitPositionRef = useRef(null); // Add this ref

  const randomSquare = () => {
    squaresRef.current.forEach((square) => square.classList.remove("enemy"));

    let newSquare;

    // Ensure we get a different square
    do {
      newSquare = squaresRef.current[Math.floor(Math.random() * squaresRef.current.length)];
    } while (newSquare.id == lastHitPositionRef.current);

    console.log("new: " + newSquare.id + " - last: " + lastHitPositionRef.current);

    newSquare.classList.add("enemy");
    playSound("jump.mp3", 0.3);

    // Update the ref with the new hit position
    lastHitPositionRef.current = newSquare.id;

    // Optionally, update the state for other parts of the app that depend on it
    setHitPosition(newSquare.id);
  };

  useEffect(() => {
    if (hitPosition !== null) {
      if (!playerDidScore || pasteSelected != 2) {
        if (timeLeft < LEVELS[level - 1].time - 1) {
          setMistakesCounter(mistakesCounter + 1);
          setLives(lives - 1);
        }
      }
      setPlayerDidScore(false); // Reset playerDidScore after checking
    }
  }, [hitPosition]);

  useEffect(() => {
    if (!gameIsOn) return;
    timerRef.current = setInterval(randomSquare, gameVelocity);
    return () => clearInterval(timerRef.current);
  }, [gameIsOn, gameVelocity]);

  const handleSquareClick = (id) => {
    if (!gameIsOn || id != hitPosition) return;

    const points = 1 * Math.floor(pasteSelected / 2) * brushSelected;
    setScore((s) => s + points);
    setPlayerDidScore(true);
    setHitPosition(null);
    playSound("brush.mp3", 1);
  };

  useEffect(() => {
    if (lives <= 0) setTimeLeft(0);
  }, [lives]);

  useEffect(() => {
    setGameVelocity(LEVELS[level - 1]?.gameVelocity || 1000);
  }, [level]);

  const startGame = () => {
    playSound("game-start.mp3", 0.6);
    resetBoard();
    setGameIsOn(true);
    setShowButton(false);
    startCountdown();
  };

  const goBack = () => { setHasSelectedBoth(false); }

  return (
    <Center>
      <Center className="brush-cursor body" flexDirection="column" padding="12px 24px" width="700px" borderRadius="10px">
        <HStack spacing="24px" className="menu" justifyContent="space-around">
          <div className="menu-level">
            <img src="../../images/star.png" alt="nivel" style={{ height: "28px", marginRight: "5px" }} />
            Nível: <span>{level}</span>
          </div>
          <div className="menu-time">
            <img src="../../images/clock.png" alt="tempo" style={{ height: "28px", marginRight: "4px" }} />
            Tempo: <span>{timeLeft}</span>
          </div>
          <div className="menu-score">
            <img src="../../images/tooth-pixel.png" alt="pontos" style={{ height: "28px", marginRight: "4px" }} />
            Pontos: <span>{score}</span>
          </div>
          <div className="menu-lives">
            <img src="../../images/love-always-wins.png" alt="vidas" style={{ height: "28px", marginRight: "4px" }} />
            Vidas: <span id="number-lives-left">{lives}</span></div>
        </HStack>
        <Text id="instructions" maxW={"600px"} textAlign={"center"} fontSize={21} mt={2}>{message}</Text>
        <HStack gap={0} wrap={"wrap"} maxWidth={"390px"} mb={2} mt={4} bgColor={"#FD8087"} borderRadius={"10px"}>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              id={index}
              className="square"
              ref={(el) => (squaresRef.current[index] = el)}
              onClick={() => handleSquareClick(index)}
            ></div>
          ))}
        </HStack>
        {showButton && (
          buttonText === "Iniciar próxima fase" ? (
            <button id="game-start" className='pixel2 start-button' onClick={() => {
              setLevel(level + 1);
              startGame();
            }}>{buttonText}</button>
          ) :
            buttonText === "Jogar novamente" ? (
              <button id="game-start" className='pixel2 start-button' onClick={goBack}>{buttonText}</button>
            ) : (<button id="game-start" className='pixel2 start-button' onClick={startGame}>{buttonText}</button>)

        )}
      </Center>
    </Center>
  );
}

export default Game;
