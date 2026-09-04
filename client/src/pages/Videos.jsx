import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import * as GameService from '../../middleware/GameService';

const Videos = (props) => {
  const [videos, setVideos] = useState([]);
  const [videoSelected, setVideoSelected] = useState({gameName: "", videoLink: ""});

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await GameService.getAllVideos();
      if (videos) {
        setVideos(videos);
      }
      console.log(videos);
    };
    fetchVideos();
  }, []);

  const popVideo = (link, name) => {
    setVideoSelected({gameName: name, videoLink: link});
    console.log(name)

  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container mt={12} width="100%" maxW="800px" bg="#f0f0f0" p={{ base: 4, md: 12 }} borderRadius={8} boxShadow="md">
        <Heading>Vídeos</Heading>
        <Text>Assista aos vídeos para aprender mais sobre os seus dentes e como mantê-los saudáveis!</Text>

        <HStack mt={12} gap={{ base: 4, md: 10 }} wrap="wrap" justifyContent="center">
          {videos && videos.map((game, index) => (
            game.videos.length > 0 && game.videos.map((video, videoIndex) => (
              <Box key={`${index}-${videoIndex}`} w={"120px"} h={"120px"} bg={"#e0e0e0"} borderRadius={"12"} _hover={{cursor: 'pointer'}} onClick={() => {popVideo(video, game.gameName); onOpen()}}>
                <iframe src={video} width="120px" height="120px" objectFit="cover" style={{ pointerEvents: 'none', borderRadius: "8px" }}></iframe>
              </Box>
            ))
          ))}
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
          <ModalOverlay />
          <ModalContent>
            {videoSelected.gameName && <ModalHeader>Vídeo do jogo {videoSelected.gameName}</ModalHeader>}
            <ModalCloseButton />
            <ModalBody mb={4} alignItems={"center"} display="flex" justifyContent="center">
                <iframe src={videoSelected.videoLink} allow="autoplay" style={{borderRadius: "5px"}}></iframe>
            </ModalBody>
          </ModalContent>
        </Modal>
    </Container>
  );
};

export default Videos;