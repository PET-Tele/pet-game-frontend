import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Login from './pages/Login.jsx';
import Principal from './pages/Principal.jsx';
import GamePage from './pages/GamePage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import Store from './pages/Store.jsx';
import Layout from './components/Layout.jsx';
import About from './pages/About.jsx';
import Videos from './pages/Videos.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import Terms from './pages/Terms.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function App() {
  const { userData, setUserData } = useAuth();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/termos" element={<Terms />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Principal setUserData={setUserData} userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/store" element={
            <ProtectedRoute>
              <Store userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/games/:id" element={
            <ProtectedRoute>
              <GamePage userData={userData} />
            </ProtectedRoute>
          }>
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;