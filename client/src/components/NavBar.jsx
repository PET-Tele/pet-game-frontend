import React, { useEffect, useState } from 'react';
import {
    Flex,
    Button,
    Image,
    IconButton,
    Avatar,
} from "@chakra-ui/react";
import { fetchCookieData, logoutUser } from '../../middleware/UserService';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toastAlert } from './ui/toastAlert.jsx';

function NavBar() {
    const { userData, setUserData } = useAuth();
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setisAdmin] = useState(false);
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    const [btnIdHovered, setBtnIdHovered] = useState("");

    // Define button configurations based on auth state
    const getButtonConfig = () => {
        const baseButtons = [
            {
                id: "about",
                icon: "fa fa-circle-info",
                label: "SOBRE",
                onClick: () => navigate("/about")
            },
            {
                id: "videos",
                icon: "fa fa-film",
                label: "VIDEOS",
                onClick: () => navigate("/videos")
            }
        ];

        if (isLogged) {
            const loggedInButtons = [
                {
                    id: "games",
                    icon: "fa fa-gamepad",
                    label: "JOGOS",
                    onClick: () => navigate("/")
                },
                {
                    id: "store",
                    icon: "fa fa-store",
                    label: "LOJA",
                    onClick: () => navigate("/store")
                },

            ];

            if (isAdmin) {
                loggedInButtons.push({
                    id: "admin",
                    icon: "fa fa-lock",
                    label: "ADMIN",
                    onClick: () => navigate("/admin")
                });
            }

            return [...baseButtons, ...loggedInButtons];
        }

        return baseButtons;
    };

    const renderButton = (buttonConfig) => (
        <Button
            key={buttonConfig.id}
            id={buttonConfig.id}
            className={btnIdHovered === buttonConfig.id ? "fa-bounce" : ""}
            onClick={buttonConfig.onClick}
            onMouseEnter={() => setBtnIdHovered(buttonConfig.id)}
            onMouseLeave={() => setBtnIdHovered("")}
        >
            <i
                icon={buttonConfig.icon}
                className={buttonConfig.icon}
                style={{ marginRight: '8px' }}
            />
            {buttonConfig.label}
        </Button>
    );

    useEffect(() => {
        async function fetchUserDataFromCookie() {
            // If userData is already in context, use it
            if (userData) {
                setIsLogged(true);
                setisAdmin(userData.isAdmin || false);
                setUser(userData);
                return;
            }

            // Otherwise, fetch from cookie
            const userFromCookie = await fetchCookieData();
            if (userFromCookie) {
                setIsLogged(true);
                if (userFromCookie.isAdmin) {
                    setisAdmin(true);
                } else {
                    setisAdmin(false);
                }
                setUser(userFromCookie);
                // Update the context as well
                setUserData(userFromCookie);
            }
            else {
                setIsLogged(false);
            }
        }

        fetchUserDataFromCookie();
    }, [userData, setUserData])

    async function logout() {
        try {
            const response = await logoutUser();
            if (response.ok) {
                setIsLogged(false);
                setUser("");
                setisAdmin(false);
                setUserData(null);
                toastAlert("Deslogado", "Você foi deslogado com sucesso.", "success");
                navigate("/login");
            }
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            toastAlert("Erro ao deslogar", "Ocorreu um erro ao tentar deslogar. Tente novamente mais tarde.", "error");
        }

    }

    return (
        <div>
            <Flex
                as="header"
                h={100}
                bg="#012034"
                color="white"
                fontWeight="bold"
                fontSize="4xl"
                justifyContent={'space-between'}
                alignItems={'end'}
                padding={"0 24px 12px 24px"}
            >
                <Image
                    height={"60px"}
                    objectfit='contain'
                    src='../../logo_petgame.PNG'
                    alt='Pet game'
                    onClick={() => navigate("/")}
                    _hover={{ cursor: 'pointer' }}
                />
                <Flex justifyContent={'space-between'} alignItems={'end'} gap={"24px"}>
                    {getButtonConfig().map(buttonConfig => renderButton(buttonConfig))}
                    {isLogged && (
                        <>
                            <Avatar
                                style={{ cursor: "pointer" }}
                                name={user.nickname}
                                src={user.gender === "Feminino" ? "../../images/girl.PNG" : "../../images/boy.PNG"}
                                onClick={() => navigate("/profile")}
                            />
                            <IconButton
                                id="logout"
                                icon="fa fa-sign-out"
                                className={btnIdHovered === "logout" ? "fa fa-sign-out fa-bounce" : "fa fa-sign-out"}
                                onClick={logout}
                                aria-label="Logout"
                                title="Logout"
                                onMouseEnter={() => setBtnIdHovered("logout")}
                                onMouseLeave={() => setBtnIdHovered("")}
                            />
                        </>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}

export default NavBar;