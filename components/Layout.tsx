import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_INFO } from '../constants';

// --- Page Transition Wrapper ---
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
    transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Showroom', path: '/showroom' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-xl py-3' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white uppercase flex items-center gap-2 group">
              <motion.i 
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="fas fa-circle-notch text-brand-red"
              ></motion.i>
              <span className="tracking-widest">Nairobi <span className="text-brand-red">Premium</span></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors group"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${isActive(link.path) || (!scrolled && location.pathname === '/') ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-brand-red/80 backdrop-blur-sm rounded-full shadow-lg shadow-red-900/40"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {!isActive(link.path) && (
                     <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 ease-out origin-center"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <motion.i 
                animate={{ rotate: isOpen ? 180 : 0 }}
                className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}
              ></motion.i>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-gray-800 overflow-hidden backdrop-blur-3xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                    <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                        isActive(link.path)
                        ? 'bg-brand-red text-white shadow-lg shadow-red-900/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    >
                    {link.name}
                    </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-gray-400 border-t border-gray-800 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-red rounded-full blur-[100px]"></div>
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">NAIROBI <span className="text-brand-red">PREMIUM</span></h3>
            <p className="text-sm leading-relaxed mb-8 text-gray-400">
              The premier destination for luxury and performance vehicles in Kenya. Elevating the car buying experience through transparency and class.
            </p>
            <div className="flex space-x-4">
              {['facebook-f', 'instagram', 'twitter', 'linkedin-in'].map((icon) => (
                  <motion.a 
                    whileHover={{ scale: 1.1, backgroundColor: '#D90429', borderColor: '#D90429', color: '#fff' }}
                    key={icon} href="#" 
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
                  >
                      <i className={`fab fa-${icon}`}></i>
                  </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/inventory" className="hover:text-brand-red transition-colors">Browse Inventory</Link></li>
              <li><Link to="/showroom" className="hover:text-brand-red transition-colors">Virtual Showroom</Link></li>
              <li><Link to="/about" className="hover:text-brand-red transition-colors">Our Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Visit Us</h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-4 text-brand-red"></i>
                <span className="text-gray-400">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-4 text-brand-red"></i>
                <span className="text-white font-medium">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-4 text-brand-red"></i>
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours Column */}
          <div>
             <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Mon - Fri</span>
                <span className="text-white">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Saturday</span>
                <span className="text-white">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between pt-2">
                <span>Sunday</span>
                <span className="text-brand-red">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nairobi Premium Motors.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const StickyMobileActions: React.FC = () => {
  return (
    <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex gap-3"
    >
      <a
        href={`tel:${COMPANY_INFO.phone}`}
        className="flex-1 glass-panel bg-white/90 backdrop-blur-xl text-brand-dark rounded-2xl py-4 flex items-center justify-center shadow-premium active:scale-95 transition-transform"
      >
        <i className="fas fa-phone-alt mr-2 text-lg"></i>
        <span className="font-bold text-sm">Call</span>
      </a>
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        className="flex-1 bg-brand-red/90 backdrop-blur-xl text-white rounded-2xl py-4 flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
      >
        <i className="fab fa-whatsapp mr-2 text-xl"></i>
        <span className="font-bold text-sm">WhatsApp</span>
      </a>
    </motion.div>
  );
};

const SaleBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, type: "spring", stiffness: 120 }}
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 w-auto z-40"
    >
      <div className="glass-panel bg-brand-dark/90 px-6 py-3 rounded-full shadow-premium text-center border-white/10 whitespace-nowrap">
        <p className="font-medium text-white text-sm">
          Website on sale. Call or WhatsApp{" "}
          <a href="tel:+254746053175" className="font-bold underline hover:text-brand-red transition-colors">0746053175</a>
        </p>
      </div>
    </motion.div>
  );
};


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 selection:bg-brand-red selection:text-white">
      <Header />
      <main className="flex-grow pt-0 min-h-screen"> 
        {children}
      </main>
      <Footer />
      <StickyMobileActions />
      <SaleBanner />
    </div>
  );
};