import {
    Flex,
    Center,
    FormControl,
    Input,
    FormLabel,
    VStack,
    Text,
    Button,
    ModalFooter,
    ModalCloseButton,
    ModalHeader,
    ModalContent,
    ModalOverlay,
    Modal,
    useDisclosure,
    ModalBody,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import { fetchCookieData } from '../../middleware/UserService';
import { getAllGames, updateGame } from "../../middleware/GameService";
import { useNavigate } from "react-router-dom";
import '../styles/style.css';
import EditModal from "../components/EditModal";

function Principal(props) {
    const navigate = useNavigate();
    const [gamesData, setGamesData] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [gameToEdit, setGameToEdit] = useState(null);
    const [gameWithEdit, setGameWithEdit] = useState(null);

    useEffect(() => {
        async function loadAllGames() {
            const response = await getAllGames();

            setGamesData(response);
            // console.log(response);

            if (!response) {
                console.log("Failed to retrieve games");
            }
        }

        loadAllGames();
    }, []);

    const editGame = async () => {
        let errorDescription = "";

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    // Ensure all fields have the correct data types
                    const updatedGame = {
                        name: gameWithEdit.name,
                        picture: gameWithEdit.picture,
                        description: gameWithEdit.description,
                    };

                    console.log("Updating game with data:", updatedGame);

                    const response = await updateGame(gameToEdit._id, updatedGame);
                    console.log("Game updated successfully:", response);

                    // Update the games list with the edited game
                    setGamesData((prevGames) =>
                        prevGames.map((game) =>
                            game._id === gameToEdit._id ? { ...game, ...updatedGame } : game
                        )
                    );

                    onClose();
                    resolve(); // Resolve the promise if the game is successfully updated
                } catch (error) {
                    console.error("Failed to edit game:", error);
                    errorDescription = "Ocorreu um erro ao tentar editar o jogo. Tente novamente mais tarde.";
                    reject(errorDescription); // Reject with the error message
                }
            }),
            {
                success: {
                    title: "Edição realizada",
                    description: `${gameWithEdit.name} foi atualizado com sucesso!`,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                error: {
                    title: "Erro na edição",
                    description: errorDescription,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                loading: {
                    title: "Edição em progresso",
                    description: "Aguarde...",
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
            }
        );
    };

    return (
        <Center align="center" justify="center" bg="#012034" h="86.3vh">
            <Flex
                width="100%"
                maxW="900px"
                h={"fit-content"}
                padding={"40px 0px 40px 0"}
                bg="white"
                borderRadius={20}
                boxShadow="0 1px 2px #ccc"
                gap="24px"
                justifyContent={"center"}
            >
                <VStack>
                    <Text fontSize="3xl" fontWeight={"bold"} textAlign="center">
                        JOGOS
                    </Text>
                    <Flex
                        className="link"
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "14px",
                            alignItems: "center",
                        }}
                    >
                        {gamesData.length > 0 ? (
                            gamesData.map((game) => {
                                return props.userData && props.userData.isAdmin ? (
                                    <div
                                        key={game._id}
                                        className="temp-rect"
                                        onClick={() => {
                                            setGameToEdit(game);
                                            setGameWithEdit(game);
                                            onOpen();
                                        }}
                                    >
                                        <span className="edit-btn" ><i className="fa fa-pencil"></i></span>
                                        <picture>
                                            <img src={"../../images/" + game.picture + ".png"} alt="" />
                                        </picture>
                                        <span className={"main-item-name"} id={game._id}>
                                            <p>{game.name}</p>
                                        </span>
                                    </div>
                                ) : (
                                    <div
                                        key={game._id}
                                        className="temp-rect"
                                        onClick={() => navigate(`/games/${encodeURIComponent(game._id)}`)}
                                    >
                                        <picture>
                                            <img src={"../../images/" + game.picture + ".png"} alt="" />
                                        </picture>
                                        <span className={"main-item-name"} id={game._id}>
                                            <p>{game.name}</p>
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Carregando os jogos...</p>
                        )}
                    </Flex>
                </VStack>
            </Flex>

            {/* Modal for editing game */}
            <EditModal
                isOpen={isOpen}
                onClose={onClose}
                title={`Editar ${gameToEdit?.name}`}
                fields={[
                    {
                        label: "Nome",
                        placeholder: gameToEdit?.name,
                        value: gameWithEdit?.name || "",
                        onChange: (value) => setGameWithEdit({ ...gameWithEdit, name: value }),
                    },
                    {
                        label: "Imagem",
                        placeholder: gameToEdit?.picture,
                        value: gameWithEdit?.picture || "",
                        onChange: (value) => setGameWithEdit({ ...gameWithEdit, picture: value }),
                    },
                    {
                        label: "Descrição",
                        placeholder: gameToEdit?.description,
                        value: gameWithEdit?.description || "",
                        onChange: (value) => setGameWithEdit({ ...gameWithEdit, description: value }),
                    },
                ]}
                onSubmit={editGame}
            />
        </Center>
    )
}


export default Principal;