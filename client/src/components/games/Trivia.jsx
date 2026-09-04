import React, { useEffect, useState } from 'react';
import triviaData from '../../data/trivia-script.json';
// import buttonBg from 'GUI.png'; // Import the image
import * as GameService from '../../../middleware/GameService';
import * as InventoryService from '../../../middleware/InventoryService';
// import { useAuth } from '../../contexts/AuthContext';
// import * from "@/";
// import '../../styles/style.css';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

const Trivia = (props) => {
    // const { userData } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
    const [levelName, setLevelName] = useState("");
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [mistakesCounter, setMistakesCounter] = useState(0);
    const [videos, setVideos] = useState([]);

    function onAnswerClick(answer) {
        if (answer === triviaData[currentQuestionIndex].correct) {
            setScore(score + triviaData[currentQuestionIndex].points);
            setNumberOfCorrectAnswers(numberOfCorrectAnswers+1);
        } else {
            setMistakesCounter(mistakesCounter + 1);
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    useEffect(() => {
        if (currentQuestionIndex >= triviaData.length) {
            saveScore(score);
        }
        else {
            switch (triviaData[currentQuestionIndex].level) {
                case 1:
                    setLevelName('Higiene Bucal');
                    break;
                case 2:
                    setLevelName('Alimentação');
                    break;
                case 3:
                    setLevelName('Cuidados Preventivos e Problemas Dentários')
                    break;
                default:
                    break;
            }
        }
    }, [currentQuestionIndex, score]);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    useEffect(() => {
        if (triviaData[currentQuestionIndex]?.answers) {
            const shuffled = shuffleArray([...triviaData[currentQuestionIndex].answers]);
            setShuffledAnswers(shuffled);
        }

    }, [currentQuestionIndex]);
    

    async function saveScore(score) {
        if (score > 0 && props.userData && props.gameId) {
            const gameProgressData = {
                userId: props.userData.id,  
                gameId: props.gameId,
                userScore: score,
                userMistakes: mistakesCounter,
                datePlayed: new Date().toISOString(),
            };
            // console.log(gameProgressData);
            GameService.createGameProgress(gameProgressData)
                .then((response) => {
                    console.log("Game progress saved:", response);
                })
                .catch((error) => {
                    console.error("Failed to save game progress:", error);
                });

            const userOldInventory = await InventoryService.getInventoryItemsByUserId(props.userData.id)
            if (userOldInventory != null) {
                const coins = userOldInventory.coins + score;
                // console.log("User coins:", coins);

                const updatedInventory = {
                    user_id: props.userData.id, // User ID
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
                    user_id: props.userData.id, // User ID
                    coins: coins, // Default to 0 if coins is undefined
                };
                await InventoryService.postNewInventory(requestBody);
            }
        }
    }

    useEffect(() => {
        const setVideosList = async () => {
            const response = await GameService.getVideosByGameId(props.gameId);
            setVideos(response.videos);
        }

        setVideosList();
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div style={{backgroundImage: 'url("/bg-temp.png")', backgroundSize: 'cover', minHeight: 'calc(100vh - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px'}}>
            <div /*style={styles.container}*/ className='pixel2white' >
                <h1 style={styles.title}>Me diz aí!</h1>
                {currentQuestionIndex < triviaData.length ? (
                    <>
                        <h2 style={styles.levelBox}>Fase {triviaData[currentQuestionIndex].level} - {levelName}</h2>
                        <div style={styles.currentQuestionBox}>
                            <div style={styles.questionBox}>
                                <h2>{triviaData[currentQuestionIndex].question}</h2>
                            </div>
                            <div style={styles.answersBox}>
                                {shuffledAnswers.map((answer, index) => (
                                    (answer === "Quero descobrir!" ?
                                        <button key={index} className="pixel2" /*style={styles.answerButton}*/ onClick={onOpen}>
                                            {answer}
                                        </button>
                                    :
                                    <button key={index} className="pixel2" /*style={styles.answerButton}*/ onClick={() => onAnswerClick(answer)}>
                                        {answer}
                                    </button>
                                    )
                                ))}
                            </div>
                            <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Aprenda como escovar os dentes!</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody alignItems={"center"} display="flex" justifyContent="center">
                                    <iframe src={videos[0]} allow="autoplay"></iframe>
                                </ModalBody>
                                <ModalFooter display="flex" justifyContent="center">
                                    <Button colorScheme="blue" mr={3} onClick={() => {onAnswerClick("Quero descobrir!"); onClose()}}>
                                    Entendi!
                                    </Button>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </div>
                    </>
                ) : (
                    <h2 style={{color: 'rgb(50, 50, 162)', fontSize: '24px', textAlign: 'center'}}>GAME OVER<br/>Você acertou {numberOfCorrectAnswers} perguntas!</h2>
                )}
            </div>

        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 32px 0px 32px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '500px',
        margin: '20px auto 10px auto',
    },
    levelBox: {
        marginBottom: '12px',
        fontFamily: "'Pixelify Sans'",
        fontSize: '24px',
        fontWeight: 'normal',
        textAlign: 'left',
        color: 'rgb(91, 149, 159)',
        // width: '100%',
        // paddingLeft: '20px',
    },
    currentQuestionBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 32px',
        // border: '1px solid #ccc',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '700px',
        // margin: '20px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    questionBox: {
        marginBottom: '20px',
        fontFamily: "'Pixelify Sans'",
        fontSize: '22px',
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'rgb(50, 50, 162)',
    },
    answersBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    answerButton: {
        padding: '14px 46px',
        border: 'none',
        // borderRadius: '8px',
        // backgroundImage: `url(gui/button-blue.png)`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        cursor: 'pointer',
        fontFamily: "'Pixelify Sans'",
        fontSize: '18px',
        fontWeight: '300',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
    },
    title: {
        fontFamily: "'Press Start 2P'",
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '20px',
        color: 'rgb(50, 50, 162)',
    },
};

export default Trivia;