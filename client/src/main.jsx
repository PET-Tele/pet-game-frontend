import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import AuthProvider from './contexts/AuthContext.jsx';

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render your application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);