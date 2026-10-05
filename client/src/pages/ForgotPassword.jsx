import React, { useState } from "react";
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../middleware/UserService";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            setError("Informe seu email.");
            return;
        }

        setLoading(true);

        try {
            const result = await UserService.requestPasswordReset(
                normalizedEmail
            );

            if (!result.ok) {
                setError(
                    "Não foi possível processar a solicitação. Tente novamente."
                );
                return;
            }

            setMessage(
                "Se existir uma conta associada a esse email, você receberá instruções para redefinir sua senha."
            );
        } catch {
            setError(
                "Não foi possível conectar ao servidor. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

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
                maxW="840px"
                minH="420px"
                padding={{ base: 4, md: 6 }}
                bg="white"
                boxShadow="0 1px 2px #ccc"
            >
                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    width="100%"
                    maxW="650px"
                >
                    <Text fontSize="2xl" textAlign="center" mb="6">
                        Esqueci minha senha
                    </Text>

                    <FormControl isRequired>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            variant="filled"
                            autoComplete="email"
                        />
                    </FormControl>

                    {message && (
                        <Text color="green.600" mt="4">
                            {message}
                        </Text>
                    )}

                    {error && (
                        <Text color="red.600" mt="4">
                            {error}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        width="100%"
                        mt="6"
                        bg="#004AAD"
                        color="white"
                        isLoading={loading}
                        loadingText="Enviando"
                    >
                        Enviar instruções
                    </Button>

                    <Button
                        type="button"
                        width="100%"
                        mt="3"
                        variant="ghost"
                        onClick={() => navigate("/login")}
                    >
                        Voltar para o login
                    </Button>
                </Box>
            </Center>
        </Flex>
    );
}

export default ForgotPassword;