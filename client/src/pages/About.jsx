import React from 'react';
import { Center, Circle, Container, Heading, HStack, Image, Link, List, ListItem, OrderedList, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const About = (props) => {
  const navigate = useNavigate();
  return (
    <Center mt={12} overflow={"none"}>
      <Container minWidth={"1000px"} maxHeight={"calc(100vh - 180px)"} bg="#f0f0f0" p={"32px 32px 32px 32px"} borderRadius={8} boxShadow="md" overflowY={"auto"}>
        <Heading mb={2}>Sobre a página</Heading>
        <Text>Olá, amiguinhos e amiguinhas!</Text>
        <Text>Estamos muito felizes em ter você aqui no nosso site especial, criado com muito carinho pelo PET Odontologia e PET Telecomunicações. Aqui, você vai se divertir e aprender ao mesmo tempo com jogos super legais que ensinam tudo sobre saúde bucal!</Text>
        
        <Heading size="md" mt={8} mb={2}>No nosso site, você vai encontrar:</Heading>
        <OrderedList as="ol">
          <ListItem mb={2}>
            <Link onClick={() => navigate("/")} fontSize={"lg"} fontWeight={"medium"}>Jogos Divertidos</Link>
            <Text>Aprenda brincando com "Me diz aí?" e "Operação Dentinho". Descubra como cuidar dos seus dentes de um jeito divertido e fácil!</Text>
          </ListItem>
          <ListItem mb={2}>
            <Text fontSize={"lg"} fontWeight={"medium"}>Pontuação e Recompensas</Text>
            <Text>Ganhe pontos ao jogar, que são convertidos em moedas para gastar na lojinha. Quanto mais você jogar, mais recompensas você pode ganhar!</Text>
          </ListItem>
          <ListItem mb={2}>
            <Link onClick={() => navigate("/store")} fontSize={"lg"} fontWeight={"medium"}>Lojinha de Skins</Link>
            <Text>Jogue, acumule moedas e personalize seu personagem com roupas e acessórios incríveis na nossa <Link onClick={() => navigate("/store")}>lojinha</Link>.</Text>          
          </ListItem>
          <ListItem mb={2}>
            <Link onClick={() => navigate("/videos")} fontSize={"lg"} fontWeight={"medium"}>Vídeos Educativos</Link>
            <Text>Assista a vídeos cheios de dicas para manter um sorriso saudável e saiba mais sobre a importância dos seus dentes.</Text>          
          </ListItem>
        </OrderedList>


        {/* <Text size="md" mt={8} mb={2}>Desenvolvido com muito carinho pelos grupos PET Odontologia e Telecomunicações.</Text> */}
        <HStack align={'center'} mt={12} gap={4} justifyContent={'center'}>
          <Image src="../../images/pet-odonto-logo.png" alt="PET Odontologia Logo" height={"80px"}/>
          {/* <Circle size="6px" bg="#000000a7" /> */}
          <Image src="../../images/pet-tele-logo.png" alt="PET Telecomunicações Logo" height={"60px"}/>
          {/* <Circle size="6px" bg="#000000a7" /> */}
          <Image src="../../images/uff-logo.png" alt="UFF Logo" height={"60px"}/>
        </HStack>

        <Text textAlign={'center'} mt={4}>Todos os direitos reservados ao PET Odontologia e PET Telecomunicações © {new Date().getFullYear()}</Text>
    </Container>
    </Center>
  );
};

export default About;