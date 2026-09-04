import React from 'react';
import NavBar from './NavBar';
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
    return (
        <Box minH="100vh" width="100%" bg="#012034" overflowX="hidden">
            <NavBar />
                <Box 
                    as="main"
                    width="100%"
                    paddingX={{ base: 3, sm: 5, md: 8 }}
                    paddingY={{ base: 4, md: 8 }}
                >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;