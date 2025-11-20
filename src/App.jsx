// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import { createPageUrl } from './utils'; // Assumindo que você tem um utils/index.js

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={createPageUrl("Feed")} element={<Feed />} />
        <Route path={createPageUrl("Profile")} element={<Profile />} />
        <Route path={createPageUrl("Portfolio")} element={<Portfolio />} />
        <Route path={createPageUrl("Explore")} element={<Explore />} />
        <Route path={createPageUrl("Settings")} element={<Settings />} />
        {/* Redirecionar para o feed como padrão, ou uma página de login se quiser */}
        <Route path="/" element={<Feed />} />
      </Routes>
    </Layout>
  );
}

export default App;