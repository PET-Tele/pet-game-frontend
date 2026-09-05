import {
    Flex,
    Box,
    Center,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    FormLabel,
    VStack,
    HStack,
    Text,
    Checkbox,
    Button,
} from "@chakra-ui/react";
  
import React, { useEffect, useState } from 'react';
import * as UserService from '../../middleware/UserService';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toastAlert } from "../components/ui/toastAlert";

function Login() {
    const navigate = useNavigate();
    const { setUserData } = useAuth();
    //nome de usuário
    const [username, setUsername] = useState('');
    //isso é para a senha
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const handleClick = () => setShowSenha(!showSenha)

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
    };

    //isso é para manter conectado
    const [mantenhaConectado, setMantenhaConectado] = useState(false);

    const handleCheckboxChange = () => {
        setMantenhaConectado(!mantenhaConectado);
    };

    useEffect(() => {
        async function fetchUserDataFromCookie () {
            const userFromCookie = await UserService.fetchCookieData();
            if (userFromCookie) // não está logado
                navigate("/")
        }

        fetchUserDataFromCookie();
    }, [navigate])

    const onSubmit = async (e) => {
        e.preventDefault();
  
        const user = {
          nickname: username,
          password: senha,
          remember: mantenhaConectado
        };
  
        const result = await UserService.getUserByCredentials(user);
        if (result.ok) { // Check if login is successful
            const userFromCookie = await UserService.fetchCookieData();
            if (userFromCookie) {
                setUserData(userFromCookie);
            }
            toastAlert("Login bem-sucedido", "Você está logado com sucesso!", "success");
            navigate("/", {viewTransition: true});
        } else {
            console.error("Login failed");
            toastAlert("Login falhou", "Verifique suas credenciais e tente novamente.", "error");
        }
      }

    return (
     
        <Flex
            minH="calc(100vh - 100px)"
            width="100%"
            align="center"
            justify="center"
            bg="#012034"

        >
            <Center
            width="100%"
            maxW={{ base: "100%", md: "840px" }}
            minH={{ base: "420px", md: "420px" }}
            padding={{base: 4, md: 6}}
            bg="white"
            boxShadow="0 1px 2px #ccc"
            >
            <form onSubmit={onSubmit} style={{ width: "100%" }}>
                <FormControl display="flex" flexDir="column" gap="4">
                <Text fontSize='2xl' textAlign={"center"}>Bem-vindo(a)!</Text>
                    <Box width="100%" maxW="650px" alignSelf="center">
                        <VStack spacing="4" align="stretch">
                            <FormControl id="user-control">
                                <FormLabel htmlFor="user">Nome de usuário ou email</FormLabel>
                                <Input
                                    id="user"
                                    variant='filled'
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </FormControl>
    

                            <FormControl id="senha-control">
                                <FormLabel htmlFor="senha">Senha</FormLabel>

                                <InputGroup size='md'>
                                    <Input 
                                        id="senha"
                                        pr='4.5rem'
                                        variant='filled'
                                        type={showSenha ? 'text' : 'password'}
                                        value={senha}
                                        onChange={handleSenhaChange}
                                    />

                                    <InputRightElement width='6rem'>
                                        <Button
                                            type="button"
                                            h='1.6rem'
                                            size='sm'
                                            bg={"blackAlpha.300"}
                                            onClick={handleClick}
                                        >
                                            {showSenha ? 'Esconder' : 'Mostrar'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </VStack>

                        <Checkbox
                            size='lg'
                            isChecked={mantenhaConectado}
                            onChange={handleCheckboxChange}
                        >
                            Mantenha-me conectado
                        </Checkbox>
                        </Box>
                    
                    <HStack justify="center">
                    <Button
                        w={240}
                        p="6"
                        type="submit"
                        bg="#004AAD"
                        color="white"
                        fontWeight="bold"
                        fontSize="xl"
                        mt="2"
                        _hover={{ bg: "#1E446D" }}
                    >
                        Entrar
                    </Button>

                    </HStack>
                </FormControl>
                <Center width="100%" maxW="650px" flex={true} marginTop={"24px"} justifyContent={"center"}>
                        <p>Não tem uma conta?</p>
                        <Button
                            bg="none"
                            color="#004AAD"
                            fontWeight="bold"
                            fontSize="xl"
                            _hover={{ bg: "none", color: "#E09F00"}}
                            onClick={() => navigate("/cadastro")}
                        >
                            Cadastre-se
                        </Button>
                    </Center>
            </form>
            </Center>
        </Flex>
        // </Box>
    )
}


export default Login;