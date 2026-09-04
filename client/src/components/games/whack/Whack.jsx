import { Button, Center, Container, Heading, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import GameEngine from './GameEngine';

function Whack (props) {
    const [brushSelected, setBrushSelected] = useState(null);
    const [pasteSelected, setPasteSelected] = useState(null);
    const [hasSelectedBoth, setHasSelectedBoth] = useState(false);

    useEffect(() => {
        if (brushSelected === null || pasteSelected === null) {
            setHasSelectedBoth(false);
        } 
    }, [brushSelected, pasteSelected]);

    const verifyIfSelectedOptions = () => {
        if (brushSelected === null || pasteSelected === null) {
            alert('Selecione uma escova e uma pasta para jogar!');
            setHasSelectedBoth(false);
        } else {
            setHasSelectedBoth(true);
        }
    }

    return (
        <Center>
            {!(hasSelectedBoth) && 
                <Container mt={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="body" borderRadius="10px" padding={{ base: 3, md: 6 }} width="100%" maxW="700px" height="fit-content">
                    <Heading size={"lg"} fontFamily={"Pixelify Sans"} mb={4}>Vamos nos preparar!</Heading>
                    <h1>Selecione uma escova</h1>
                    <HStack gap={{ base: 3, md: 10 }} wrap="wrap" alignItems="center" justifyContent="center" mb={4} mt={2}>
                        {brushSelected !== 1 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setBrushSelected(1)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cerdas duras</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setBrushSelected(1)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cerdas duras</p></span>
                            </div>
                        }
                        {brushSelected !== 2 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setBrushSelected(2)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cabeça longa</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setBrushSelected(2)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cabeça longa</p></span>
                            </div>
                        }
                        {brushSelected !== 3 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setBrushSelected(3)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cerdas macias</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setBrushSelected(3)}>
                                <picture><img src={"../../images/escovinha.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Cerdas macias</p></span>
                            </div>
                        }
                    </HStack>
                    <h1>Selecione uma pasta</h1>
                    <HStack gap={{ base: 3, md: 10 }} wrap="wrap" alignItems="center" justifyContent="center" mt={2}>
                        {pasteSelected !== 0 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setPasteSelected(0)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 0 ppm</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setPasteSelected(0)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 0 ppm</p></span>
                            </div>
                        }
                        {pasteSelected !== 1 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setPasteSelected(1)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 500 ppm</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setPasteSelected(1)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 500 ppm</p></span>
                            </div>
                        }
                        {pasteSelected !== 2 ? 
                            <div style={{height: '120px', width: '120px'}} className="temp-rect" onClick={() => setPasteSelected(2)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 1100 ppm</p></span>
                            </div>
                            : <div style={{height: '120px', width: '120px', border: "3px solid red"}} className="temp-rect" onClick={() => setPasteSelected(2)}>
                                <picture><img src={"../../images/004-toothpaste.png"} alt="" /></picture>
                                <span><p style={{fontSize: "16px"}}>Flúor 1100 ppm</p></span>
                            </div>
                        }
                    </HStack>
                    <Button variant='surface' mt={8} bg={'#012034'} color={"white"} onClick={() => verifyIfSelectedOptions()}>
                        Jogar!
                    </Button>
                </Container>
            }
            {hasSelectedBoth &&
                <GameEngine userData={props.userData} gameId={props.gameId} brushSelected={brushSelected} pasteSelected={pasteSelected} setHasSelectedBoth={setHasSelectedBoth}/>
            }

        </Center>
    );
}

export default Whack;