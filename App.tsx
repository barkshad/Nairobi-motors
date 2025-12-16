import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetails from './pages/CarDetails';
import Showroom from './pages/Showroom';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Route (No Layout) */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Public Routes (With Layout) */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/showroom" element={<Showroom />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
