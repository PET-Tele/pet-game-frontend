import {
    Flex,
    Box,
    Heading,
    Center,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    FormLabel,
    VStack,
    HStack,
    RadioGroup,
    Radio,
    Select,
    Text,
    Link,
    Button,
    Switch,
    Image,
    Checkbox,
} from "@chakra-ui/react";
import * as UserService from '../../middleware/UserService.js';

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import * as addressApi from '../getAddress.js';
import { toastAlert } from "../components/ui/toastAlert.jsx";

function Cadastro() {
    const navigate = useNavigate();

    //nome de usuário
    const [username, setUsername] = useState('');
    //idade
    const [mostrarIdade, setMostrarIdade] = useState(false);
    const [idade, setIdade] = useState("");
    const [aniversario, setAniversario] = useState("");
    const [aniversarioInputVisivel, setAniversarioInputVisivel] = useState(true);
    //gênero
    const [genero, setGenero] = useState('Masculino');
    //ano escolar
    const [anoEscolar, setAnoEscolar] = useState('');
    const [email, setEmail] = useState('');
    //isso é para a senha
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const handleClick = () => setShowSenha(!showSenha)
    //tipo de escola
    const [tipoEscola, setTipoEscola] = useState('');

    const [statesOptions, setStatesOptions] = useState([]);
    const [citiesOptions, setCitiesOptions] = useState([]);

    //estado
    const [estado, setEstado] = useState('');
    //cidade
    const [cidade, setCidade] = useState('');
    const [states, setStates] = useState({ items: [] });
    const [cities, setCities] = useState({ items: [] });

    useEffect(() => {
        if (aniversario) { // Verifica se a data de aniversário está definida para evitar loops infinitos
            calculandoIdade();
        }
    }, [aniversario]); // Chama a função calculandoIdade sempre que a data de aniversário mudar

    const calculandoIdade = () => {
        const hoje = new Date();
        const aniver = new Date(aniversario);
        let idadeCalculada = hoje.getFullYear() - aniver.getFullYear();
        const diferencaMes = hoje.getMonth() - aniver.getMonth();
        if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < aniver.getDate())) {
            idadeCalculada--;
        }
        setIdade(idadeCalculada);
    };

    const handleLinkClick = () => {
        if (mostrarIdade) {
            setMostrarIdade(false)
            setAniversarioInputVisivel(true);
        } else {
            setMostrarIdade(true)
            setAniversarioInputVisivel(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleIdadeChange = (e) => {
        setIdade(Number(e.target.value));
    };

    const handleAniversarioChange = (e) => {
        setAniversario(e.target.value);
    };

    const handleGeneroChange = (e) => {
        setGenero(e.target.value);
    };

    const handleAnoEscolarChange = (e) => {
        setAnoEscolar(e.target.value);
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleTipoEscolaChange = (e) => {
        setTipoEscola(e.target.value);
    };

    const handleEstadoChange = async (e) => {
        setEstado(e.target.value);
        try {
            const cities = await addressApi.addOptionsCidades(e.target.value);
            setCitiesOptions(parseOptions(cities));
        } catch (e) {
            console.error(e);
        }
    };

    const handleCidadeChange = (e) => {
        setCidade(e.target.value);
    };

    useEffect(() => {
        async function fetchUserDataFromCookie() {
            const userFromCookie = await UserService.fetchCookieData();
            if (userFromCookie) // não está logado
                navigate("/");
        }

        fetchUserDataFromCookie();

        async function loadStates() {
            const states = await addressApi.addOptionsEstado();
            setStatesOptions(parseOptions(states));
        }

        loadStates();
    }, []);

    const parseOptions = (optionsString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(optionsString, 'text/html');
        const options = Array.from(doc.querySelectorAll('option'));
        return options.map(option => (
            <option key={option.value} value={option.value}>{option.textContent}</option>
        ));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            nickname: username,
            password: senha,
            age: idade,
            email: email,
            gender: genero,
            school_type: tipoEscola,
            school_year: anoEscolar,
            state: estado,
            city: cidade,
            isAdm: false,
        };

        try {
            const result = await UserService.postNewUser(newUser);
            if (result.ok) { // se o cadastro for realizado com sucesso
                toastAlert("Cadastro bem-sucedido", "Você pode fazer login agora!", "success");
                navigate("/login"); // redireciona para a tela de login
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            toastAlert("Erro no cadastro", "Verifique os dados e tente novamente.", "error");
        }
    }

    return (
        <Box>
            <Flex
                align="center"
                justify="center"
                bg="#012034"
                pb={"24px"}
            >
                <Center
                    w="900px"
                    bg="white"
                    borderRadius={20}
                    padding={"40px 0px"}
                    boxShadow="0 1px 2px #ccc"
                >
                    <form onSubmit={onSubmit}>
                        <FormControl display="flex" flexDir="column" gap="4">
                            <Text fontSize='2xl' textAlign={"center"} mb={"12px"}>Registre-se para jogar!</Text>
                            <Heading as='h3' size='lg' color="#285A8F" pb={3}>Dados pessoais</Heading>
                            <VStack spacing="4">
                                <Box w="700px">
                                    <FormLabel htmlFor="user">Nome de usuário</FormLabel>
                                    <Input variant='filled' id="user" type="text" value={username} onChange={handleUsernameChange} />
                                </Box>

                                <Box w="100%" pb={2}>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input variant='filled' id="email" type="email" placeholder="exemplo@gmail.com" value={email} onChange={handleEmailChange} />
                                </Box>

                                <Box w="100%">
                                    <HStack>
                                        <FormLabel htmlFor="nasc">Data de nascimento</FormLabel>
                                        <Link color='#3D8ADB' fontSize='medium' pb={2} onClick={handleLinkClick} textDecoration="underline">Não sabe sua data de nascimento?</Link>
                                    </HStack>
                                    {aniversarioInputVisivel ? (
                                        <Input variant='filled' id="nasc" type="date" value={aniversario} onChange={handleAniversarioChange} />
                                    ) : (
                                        <Select variant='filled' onChange={handleIdadeChange} value={idade}>
                                            <option value="">Selecione sua idade</option>
                                            <option value="1">1 ano</option>
                                            <option value="2">2 anos</option>
                                            <option value="3">3 anos</option>
                                            <option value="4">4 anos</option>
                                            <option value="5">5 anos</option>
                                            <option value="6">6 anos</option>
                                            <option value="7">7 anos</option>
                                            <option value="8">8 anos</option>
                                            <option value="9">9 anos</option>
                                            <option value="10">10 anos</option>
                                            <option value="11">11 anos</option>
                                            <option value="12">12 anos</option>
                                        </Select>
                                    )}
                                </Box>

                                <Box w="100%">
                                    <FormLabel pt={2}>Gênero</FormLabel>
                                    <RadioGroup defaultValue="Masculino">
                                        <HStack spacing="24px">
                                            <input type="radio" id="masculino" name="genero" value="masculino" checked={genero === 'Masculino'} onChange={() => setGenero('Masculino')} />
                                            <label htmlFor="masculino">Masculino</label>

                                            <input type="radio" id="feminino" name="genero" value="feminino" checked={genero === 'Feminino'} onChange={() => setGenero('Feminino')} />
                                            <label htmlFor="feminino">Feminino</label>

                                            <input type="radio" id="outro" name="genero" value="outro" checked={genero === 'Outro'} onChange={() => setGenero('Outro')} />
                                            <label htmlFor="outro">Outro</label>
                                        </HStack>
                                    </RadioGroup>
                                </Box>

                                <Box w="100%">
                                    <FormLabel htmlFor="anoesc">Ano escolar</FormLabel>
                                    <Select id="anoesc" value={anoEscolar} variant='filled' onChange={handleAnoEscolarChange}>
                                        <option value="selecione"></option>
                                        <option value="1°ano">1° Ano</option>
                                        <option value="2°ano">2° Ano</option>
                                        <option value="3°ano">3° Ano</option>
                                        <option value="4°ano">4° Ano</option>
                                        <option value="5°ano">5° Ano</option>
                                        <option value="6°ano">6° Ano</option>
                                        <option value="7°ano">7° Ano</option>
                                    </Select>
                                </Box>

                                <FormControl id="senha-fc" mb={4}>
                                    <FormLabel htmlFor="senha">Senha</FormLabel>
                                    <InputGroup size='md'>
                                        <Input id="senha" pr='4.5rem' variant='filled' type={showSenha ? 'text' : 'password'} value={senha} onChange={handleSenhaChange} />
                                        <InputRightElement width='6rem'>
                                            <Button h='1.6rem' size='sm' bg={"blackAlpha.300"} onClick={handleClick}>
                                                {showSenha ? 'Esconder' : 'Mostrar'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </VStack>

                            {/* Segunda parte da página */}
                            <Heading as='h3' size='lg' color="#285A8F" pb={3}> Dados da escola</Heading>
                            <VStack>
                                <Box w="100%">
                                    <FormLabel htmlFor="tpesc">Tipo de escola</FormLabel>
                                    <Select value={tipoEscola} variant='filled' id="tpesc" onChange={handleTipoEscolaChange}>
                                        <option value="selecione"></option>
                                        <option value="particular">Particular</option>
                                        <option value="pública">Pública</option>
                                    </Select>
                                </Box>
                            </VStack>
                            <HStack spacing="4" pb={3}>
                                <Box w="100%">
                                    <FormLabel htmlFor="estado">Estado</FormLabel>
                                    <Select id="estado" variant='filled' value={estado} onChange={handleEstadoChange}>
                                        {statesOptions}
                                    </Select>
                                </Box>
                                <Box w="100%">
                                    <FormLabel htmlFor="cidade">Cidade</FormLabel>
                                    <Select id="cidade" variant='filled' value={cidade} onChange={handleCidadeChange}>
                                        {citiesOptions}
                                    </Select>
                                </Box>
                            </HStack>
                            <HStack spacing="4" align="center" >
                                <Checkbox id="aceito" colorScheme='blue' required />
                                <FormLabel margin={0} htmlFor="aceito">Declaro que li e aceito os <Link color="#316DAE" onClick={() => navigate("/termos")}>termos de uso</Link>.</FormLabel>
                            </HStack>
                            <HStack justify="center">
                                <Button w={240} p="6" type="submit" bg="#326FB1" color="white" fontWeight="bold" fontSize="xl" mt="4" _hover={{ bg: "#1E446D" }}>
                                    Cadastrar-se
                                </Button>
                            </HStack>
                        </FormControl>
                    </form>
                </Center>
            </Flex>
        </Box>
    )
}

export default Cadastro;