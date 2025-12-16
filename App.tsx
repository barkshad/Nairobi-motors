import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetails from './pages/CarDetails';
import Showroom from './pages/Showroom';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Route (No Layout) */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Public Routes (With Layout & Animation) */}
        <Route path="*" element={<AnimatedRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;