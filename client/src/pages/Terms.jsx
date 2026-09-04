import React from 'react';
import termsData from '../data/terms.json';
import { Box, Center, Container, Heading, Text, Button } from '@chakra-ui/react';
import { LuDownload } from "react-icons/lu"

function Terms() {
    // safety check pra caso a estrutura de dados mude
    const terms = termsData.terms || {};
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/terms.pdf'; // nome do PDF no diretório público
        link.download = 'termo-de-consentimento.pdf';
        link.click();
    };
    
    return (
        <Center mt={12} overflow={"none"}>
            <Container width="100%" maxW="900px" maxH="calc(100vh - 180px)" p={{ base: 4, md: 8 }} bg="#f0f0f0" borderRadius={20} boxShadow="md" overflowY="auto">
                <Heading mb={6} size="lg" width={"100%"} textAlign={"center"}>{terms.title || 'Terms and Conditions'}</Heading>
                {terms.paragraphs && terms.paragraphs.map((term, index) => (
                    <Box key={term.substring(0, 50) + index} mb={3}>
                        <Text dangerouslySetInnerHTML={{ __html: term }} />    
                    </Box>
                ))}

                <Box mt={6} display="flex" justifyContent="center">
                    <Button 
                        variant="outline" 
                        leftIcon={<LuDownload />}
                        onClick={handleDownload}
                        colorScheme="blue"
                    >
                        Baixar cópia do termo (PDF)
                    </Button>
                </Box>
            </Container>
        </Center>
    );
}

export default Terms;