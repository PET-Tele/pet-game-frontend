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
import { Form, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import * as addressApi from '../getAddress.js';
import { toastAlert } from "../components/ui/toastAlert.jsx";

function Cadastro() {
    const navigate = useNavigate();
    //prevencao de erros
    const [errors, setErrors] = useState({});

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

    const validarDados = () => {
        const nextErrors = {};

        if (!username.trim()){
            nextErrors.username = "Digite o nome de usuário";
        }
        if (!email.trim()){
            nextErrors.email = "Digite seu e-mail";
        }
        if (!senha) {
            nextErrors.senha = "Digite a senha";
        }
        if (!aniversario && !idade) {
            nextErrors.aniversario = "Informe sua data de nascimento ou idade";
        }
        if (!anoEscolar || anoEscolar === "selecione") {
            nextErrors.anoEscolar = "Selecione o ano escolar";
        }
        if (!tipoEscola || tipoEscola === "selecione" || tipoEscola === "") {
            nextErrors.tipoEscola = "Selecione o tipo de escola";
        }
        if (!estado || estado === "selecione") {
            nextErrors.estado = "Selecione o estado";
        }
        if (!cidade || cidade === "selecione") {
            nextErrors.cidade = "Selecione a cidade";
        }
        if (!aceito) {
            nextErrors.aceito = "Você precisa aceitar os termos";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0; //retorna se algum campo ta errado ou nao
    }

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
        //ao mudar, zero ambos os valores
        setIdade("");
        setAniversario("");
        if (mostrarIdade) {
            console.error("oioi")
            setMostrarIdade(false)
            setAniversarioInputVisivel(true);
        } else {
            setMostrarIdade(true)
            setAniversarioInputVisivel(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: undefined }));
        } //forca "undefined" pra remover o erro vermelho (undefined = false)
    };

    const handleIdadeChange = (e) => {
        setIdade(Number(e.target.value));
        if (errors.aniversario){
            setErrors(prev => ({ ...prev, aniversario: undefined}));
        }
    };

    const handleAniversarioChange = (e) => {
        setAniversario(e.target.value);
        if (errors.aniversario){
            setErrors(prev => ({ ...prev, aniversario: undefined}));  
        }
    };

    const handleGeneroChange = (e) => {
        setGenero(e.target.value);
    };

    const handleAnoEscolarChange = (e) => {
        setAnoEscolar(e.target.value);
        if (errors.anoEscolar){
            setErrors(prev => ({ ...prev, anoEscolar: undefined}))
        }
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
        if (errors.senha){
            setErrors(prev => ({ ...prev, senha:undefined}))
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email){
            setErrors(prev => ({...prev, email:undefined}))
        }
    };

    const handleTipoEscolaChange = (e) => {
        setTipoEscola(e.target.value);
        if (errors.tipoEscola){
            setErrors(prev => ({...prev, tipoEscola:undefined}))
        }
    };

    const handleEstadoChange = async (e) => {
        setEstado(e.target.value);
        try {
            const cities = await addressApi.addOptionsCidades(e.target.value);
            setCitiesOptions(parseOptions(cities));
        } catch (e) {
            console.error(e);
        }
        if (errors.estado){
            setErrors(prev => ({...prev, estado:undefined}))
        }
    };

    const handleCidadeChange = (e) => {
        setCidade(e.target.value);
        if (errors.cidade){
            setErrors(prev => ({...prev, cidade:undefined}))
        }
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

        const isValid = validarDados(); //prevencao de erros
        if (!isValid) return; //retorna caso algo esteja fora do padrao

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
                    width="100%"
                    maxW="900px"
                    bg="white"
                    borderRadius={20}
                    padding={{ base: 4, md: "40px" }}
                    boxShadow="0 1px 2px #ccc"
                >
                    <form onSubmit={onSubmit}>
                        <FormControl display="flex" flexDir="column" gap="4">
                            <Text fontSize='2xl' textAlign={"center"} mb={"12px"}>Registre-se para jogar!</Text>
                            <Heading as='h3' size='lg' color="#285A8F" pb={3}>Dados pessoais</Heading>
                            <VStack spacing="4">

                                {/*USUARIO*/}
                                <FormControl isInvalid={!!errors.username} width="100%" maxW="700px" mb={2}>
                                    <FormLabel htmlFor="user">Nome de usuário</FormLabel>
                                    <Input
                                        variant='filled'
                                        id="user"
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                    {/*ERRO DE USUARIO*/}
                                    {errors.username && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.username}
                                        </Text>
                                    )}
                                </FormControl>

                                {/*EMAIL*/}
                                <FormControl isInValid={!!errors.email} w="100%" pb={2}>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input 
                                        variant='filled' 
                                        id="email" 
                                        type="email" 
                                        placeholder="exemplo@gmail.com" 
                                        value={email} 
                                        onChange={handleEmailChange}
                                    />
                                    {/*ERRO DE EMAIL*/}
                                    {errors.email && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </FormControl>

                                {/*DATA DE NASCIMENTO*/}
                                <FormControl isInValid={!!errors.aniversario} w="100%" pb={2}>
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
                                    {(errors.aniversario) && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.aniversario}
                                        </Text>
                                    )}
                                </FormControl>

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
                                
                                {/*ANO ESCOLAR*/}
                                <FormControl isInvalid={!!errors.anoEscolar} w="100%" pb={2}>
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
                                    {/*ERRO DE ANO ESCOLAR*/}
                                    {errors.anoEscolar && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.anoEscolar}
                                        </Text>
                                    )}
                                </FormControl>

                                {/*SENHA*/}
                                <FormControl id="senha-fc" mb={4}>
                                    <FormLabel htmlFor="senha">Senha</FormLabel>
                                    <InputGroup size='md'>
                                        <Input 
                                            id="senha" 
                                            pr='4.5rem' 
                                            variant='filled' 
                                            type={showSenha ? 'text' : 'password'} 
                                            value={senha} 
                                            onChange={handleSenhaChange} />
                                        {/*ESCONDER/MOSTRAR SENHA*/}
                                        <InputRightElement width='6rem'>
                                            <Button h='1.6rem' size='sm' bg={"blackAlpha.300"} onClick={handleClick}>
                                                {showSenha ? 'Esconder' : 'Mostrar'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    {/*ERRO DE SENHA*/}
                                    {errors.senha && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.senha}
                                        </Text>
                                    )}
                                </FormControl>
                            </VStack>

                            {/* Segunda parte da página */}
                            <Heading as='h3' size='lg' color="#285A8F" pb={3}> Dados da escola</Heading>
                            <VStack>
                                {/*TIPO DE ESCOLA*/}
                                <FormControl isInvalid={!!errors.tipoEscola} w="100%" pb={2}>
                                    <FormLabel htmlFor="tpesc">Tipo de escola</FormLabel>
                                    <Select value={tipoEscola} variant='filled' id="tpesc" onChange={handleTipoEscolaChange}>
                                        <option value="selecione"></option>
                                        <option value="particular">Particular</option>
                                        <option value="pública">Pública</option>
                                    </Select>
                                    {/*ERRO DO TIPO DE ESCOLA*/}
                                    {errors.tipoEscola && (
                                            <Text color="red" fontSize="sm" mt={1}>
                                            {errors.tipoEscola}
                                        </Text>
                                    )}
                                </FormControl>
                            </VStack>

                            <HStack spacing="4" pb={3} align="flex-start">
                                {/*ESTADO*/}
                                <FormControl isInvalid={!!errors.estado} w="100%" pb={2}>
                                    <FormLabel htmlFor="estado">Estado</FormLabel>
                                    <Select 
                                        id="estado" 
                                        variant='filled' 
                                        value={estado} 
                                        onChange={handleEstadoChange}>
                                        {statesOptions}
                                    </Select>
                                    {/*ERRO DE ESTADO*/}
                                    {errors.estado && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.estado}
                                        </Text>
                                    )}
                                </FormControl>

                                {/*CIDADE*/}
                                <FormControl isInvalid={!!errors.cidade} w="100%" pb={2}>
                                    <FormLabel htmlFor="cidade">Cidade</FormLabel>
                                    <Select 
                                        id="cidade" 
                                        variant='filled' 
                                        value={cidade} 
                                        onChange={handleCidadeChange}>
                                        {citiesOptions}
                                    </Select>
                                    {/*ERRO DE CIDADE*/}
                                    {(!errors.estado && errors.cidade) && (
                                        <Text color="red" fontSize="sm" mt={1}>
                                            {errors.cidade}
                                        </Text>
                                    )}
                                </FormControl>
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