import React, { useEffect, useState } from "react";
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
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import * as UserService from "../../middleware/UserService";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!token) {
            setError(
                "O link de redefinição está incompleto ou inválido."
            );
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError(
                "Não foi possível redefinir a senha porque o token não foi encontrado."
            );
            return;
        }

        if (!password || !confirmation) {
            setError("Preencha os dois campos de senha.");
            return;
        }

        if (password !== confirmation) {
            setError("A senha e a confirmação precisam ser iguais.");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const result = await UserService.resetPassword(
                token,
                password
            );

            if (result.ok) {
                setSuccess(
                    "Senha redefinida com sucesso. Você será redirecionado para o login."
                );

                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 1500);

                return;
            }

            if (result.status === 400 || result.status === 401) {
                setError(
                    "O link é inválido ou expirou. Solicite uma nova recuperação de senha."
                );
                return;
            }

            setError(
                "Não foi possível redefinir a senha. Tente novamente."
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
                        Redefinir senha
                    </Text>

                    <FormControl isRequired mb="4">
                        <FormLabel htmlFor="password">
                            Nova senha
                        </FormLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            variant="filled"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel htmlFor="confirmation">
                            Confirme a nova senha
                        </FormLabel>
                        <Input
                            id="confirmation"
                            type="password"
                            value={confirmation}
                            onChange={(event) =>
                                setConfirmation(event.target.value)
                            }
                            autoComplete="new-password"
                            variant="filled"
                        />
                    </FormControl>

                    {error && (
                        <Text color="red.600" mt="4">
                            {error}
                        </Text>
                    )}

                    {success && (
                        <Text color="green.600" mt="4">
                            {success}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        width="100%"
                        mt="6"
                        bg="#004AAD"
                        color="white"
                        isLoading={loading}
                        loadingText="Salvando"
                        isDisabled={!token}
                    >
                        Redefinir senha
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

export default ResetPassword;