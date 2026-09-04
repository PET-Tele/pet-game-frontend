import React, { useEffect, useState } from 'react';
import { Container, Heading, Text, Box, CircularProgress, HStack, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Collapse, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import * as UserService from '../../middleware/UserService';
import * as GameService from '../../middleware/GameService';

const Admin = (props) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [gameProgresses, setGameProgresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();


    useEffect(() => {
        const loadAllUsers = async () => {
            const response = await UserService.getAllUsers();
            setUsers(response);
            setLoading(false);
        };
        
        loadAllUsers();
        setLoading(true);
    }, []);
    
    
    const loadPlayerGameProgresses = async (userId) => {
        const response = await GameService.getGameProgressesByUserId(userId);
        setGameProgresses((prev) => ({
            ...prev,
            [userId]: response,
        }));
        
    };

    // useEffect(() => {console.log(gameProgresses)}, [gameProgresses]);

    const toggleRow = (userId, event) => {
        if (event && event.target.closest('.trash-btn')) {
            return;
        }
    
        if (!isOpen)
            setExpandedRows((prev) => {
                const isExpanded = !prev[userId];
                if (isExpanded && !gameProgresses[userId]) {
                    loadPlayerGameProgresses(userId);
                }
                return {
                    ...prev,
                    [userId]: isExpanded,
                };
            });
    };
    
    const confirmRemoveUser = (user) => {
        setSelectedUser(user);
        onOpen();
    };

    const removeUser = async (userId) => {
        if (selectedUser) {
            const response = await UserService.removeUser(selectedUser._id);
            if (response) {
                const newUsers = users.filter((user) => user._id !== selectedUser._id);
                setUsers(newUsers);
                onClose();
            }
        }
    }

    return (
        <Container mt={12} width="100%" maxW="1280px" bg="#f0f0f0" p={{ base: 4, md: 12 }} mb={0} borderRadius={8} boxShadow="md" >
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Exclusão</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        Tem certeza de que deseja excluir o usuário {selectedUser?.nickname}?
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button colorScheme="red" onClick={removeUser} ml={3}>Excluir</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Heading mb={8}>Usuários Cadastrados</Heading>
            {loading ? (
                <HStack gap="10">
                    <CircularProgress isIndeterminate />
                </HStack>
            ) : (
                users.length > 0 ? (
                    <TableContainer overflowX="auto" overflowY="auto" maxH="400px">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Apelido</Th>
                                    <Th>Gênero</Th>
                                    <Th>E-mail</Th>
                                    <Th>Idade</Th>
                                    <Th>Tipo de escola</Th>
                                    <Th>Ano escolar</Th>
                                    <Th>Estado</Th>
                                    <Th width={"50px"} m={0} p={0}></Th>
                                    <Th width={"50px"} m={0} p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {users.map((user) => (
                                user.isAdm == false && (
                                <React.Fragment key={user._id}>
                                    <Tr key={user._id} onClick={() => toggleRow(user._id, event)} _hover={{cursor: 'pointer'}}>
                                        <Td>{user.nickname}</Td>
                                        <Td>{user.gender}</Td>
                                        <Td>{user.email}</Td>
                                        <Td>{user.age}</Td>
                                        <Td>{user.school_type}</Td>
                                        <Td>{user.school_year}</Td>
                                        <Td>{user.state}</Td>
                                        <Td width={"50px"}>
                                            <Button bg="transparent" _hover={{ bg: "transparent", color: "blue.500" }} _focus={{ boxShadow: "none" }} _active={{ bg: "transparent" }} >
                                                {expandedRows[user._id] ? 
                                                    <i className="fa-solid fa-chevron-up"></i>
                                                    : <i className="fa-solid fa-chevron-down"></i> 
                                                }
                                            </Button>
                                        </Td>
                                        <Td>
                                            <Button className="trash-btn" bg="transparent" onClick={() => confirmRemoveUser(user)} _hover={{ bg: "transparent", color: "red.500" }} _focus={{ boxShadow: "none" }} _active={{ bg: "transparent" }} >
                                                <i className="fa-solid fa-trash"></i>
                                            </Button>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan="9" p={0}>
                                            <Collapse in={expandedRows[user._id]}>
                                                <Box p={4} m={"0 8px"} borderRadius={"4px"}  bg="gray.200">
                                                    <Heading fontSize={"20px"} color={"darkblue"} mb={4}>Estatísticas em jogos</Heading>
                                                    {gameProgresses[user._id] && gameProgresses[user._id].length > 0 && gameProgresses[user._id].map((game, index) => 
                                                    {
                                                        return (
                                                            <Box key={index} mb={4}>
                                                                <Heading fontSize={"18px"} mb={1}>&#9679; {game.gameId.name}</Heading>
                                                                {/* <Text textStyle="6xl">{game.gameId.name}</Text> */}
                                                                
                                                                <Text><strong>Pontuação:</strong> {game.userScore}</Text>
                                                                <Text><strong>Quantidade de erros:</strong> {game.userMistakes}</Text>
                                                                <Text><strong>Data:</strong> {new Date(game.datePlayed).toLocaleString('pt-BR')}</Text>
                                                            </Box>
                                                        )
                                                    })}
                                                    {gameProgresses[user._id] && gameProgresses[user._id].length === 0 && <Text>Nenhum jogo jogado.</Text>}
                                                </Box>
                                            </Collapse>
                                        </Td>
                                    </Tr>
                                </React.Fragment>)
                            ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Text>Nenhum usuário encontrado.</Text>
                )
            )}
        </Container>
    );
};

export default Admin;