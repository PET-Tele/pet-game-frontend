import React from 'react';
import NavBar from './NavBar';
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
    return (
        <Box height={'100vh'} bg="#012034">
            <NavBar />
            <Box as="main">
                {children}
            </Box>
        </Box>
    );
};

export default Layout;