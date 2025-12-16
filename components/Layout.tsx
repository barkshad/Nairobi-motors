import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { COMPANY_INFO } from '../constants';

// --- Custom Cursor ---
const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className="custom-cursor fixed top-0 left-0 w-4 h-4 bg-brand-red rounded-full pointer-events-none z-[100] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 4 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1
                }}
            />
            <motion.div
                className="custom-cursor fixed top-0 left-0 w-12 h-12 border border-brand-red rounded-full pointer-events-none z-[100] opacity-50"
                animate={{
                    x: mousePosition.x - 24,
                    y: mousePosition.y - 24,
                    scale: isHovering ? 1.5 : 1,
                    borderColor: isHovering ? 'transparent' : '#D90429'
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 25,
                    mass: 0.2 // More lag for outer ring
                }}
            />
        </>
    );
};

// --- Page Transition Wrapper ---
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Cubic bezier for luxury feel
    className="w-full"
  >
    {children}
  </motion.div>
);

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-red z-[100] origin-left"
        style={{ scaleX }}
      />
    
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500`}>
          <div className={`
              flex items-center justify-between h-16 px-8 rounded-full transition-all duration-500
              ${scrolled ? 'glass-dark shadow-neon bg-slate-900/90 border border-white/10 backdrop-blur-xl' : 'bg-transparent'}
          `}>
            <div className="flex items-center">
              <Link to="/" className="text-xl font-extrabold tracking-tighter text-white uppercase flex items-center gap-3 group">
                <motion.span 
                  whileHover={{ rotate: 90 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-lg ${scrolled ? 'bg-brand-red' : 'bg-white text-slate-900'}`}
                >
                    <i className="fas fa-gem"></i>
                </motion.span>
                <span className="tracking-[0.15em] hidden sm:block text-sm">Kiambu <span className={scrolled ? 'text-white' : 'text-brand-red'}>Auto</span></span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors group overflow-hidden"
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${isActive(link.path) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {link.name}
                    </span>
                    {isActive(link.path) && (
                      <motion.div 
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-brand-red rounded-full shadow-glow"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover background for non-active links */}
                    {!isActive(link.path) && (
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
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
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="md:hidden glass-dark border border-white/10 overflow-hidden backdrop-blur-3xl mx-4 mt-2 rounded-3xl shadow-2xl"
            >
              <div className="px-4 pt-6 pb-8 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                      <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider ${
                          isActive(link.path)
                          ? 'bg-brand-red text-white shadow-glow'
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
    </>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-white/5 relative overflow-hidden">
      {/* Massive CTA */}
      <div className="border-b border-white/5 bg-slate-900/50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter">Ready to <span className="text-brand-red">Upgrade?</span></h2>
                    <Link to="/inventory" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-full font-bold hover:scale-105 transition-transform shadow-premium uppercase tracking-wider text-sm">
                        View Inventory <i className="fas fa-arrow-right"></i>
                    </Link>
                </motion.div>
           </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">KIAMBU <span className="text-brand-red">AUTOSPARES</span></h3>
            <p className="text-sm leading-relaxed mb-8 text-gray-500 font-medium">
              Premium vehicles. Transparent process. Kiambu's finest automotive showroom.
            </p>
            <div className="flex space-x-4">
              {['facebook-f', 'instagram', 'twitter', 'linkedin-in'].map((icon) => (
                  <motion.a 
                    whileHover={{ y: -5, color: '#fff', backgroundColor: '#D90429', borderColor: '#D90429' }}
                    key={icon} href="#" 
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300"
                  >
                      <i className={`fab fa-${icon}`}></i>
                  </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">Discovery</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/inventory" className="hover:text-brand-red transition-colors block py-1">Inventory</Link></li>
              <li><Link to="/showroom" className="hover:text-brand-red transition-colors block py-1">Virtual Tour</Link></li>
              <li><Link to="/about" className="hover:text-brand-red transition-colors block py-1">Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors block py-1">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">Locate Us</h3>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex items-start">
                <i className="fas fa-map-pin mt-1 mr-4 text-brand-red"></i>
                <span className="text-gray-400">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-4 text-brand-red"></i>
                <span className="text-white">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-at mr-4 text-brand-red"></i>
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>

          <div>
             <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">Trading Hours</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Weekdays</span>
                <span className="text-white">8am - 6pm</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Saturday</span>
                <span className="text-white">9am - 4pm</span>
              </li>
              <li className="flex justify-between pt-2">
                <span>Sunday</span>
                <span className="text-brand-red">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Kiambu Autospares Showroom.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
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
        className="flex-1 glass-dark text-white rounded-2xl py-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
      >
        <i className="fas fa-phone-alt mr-2 text-lg"></i>
        <span className="font-bold text-sm">Call</span>
      </a>
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        className="flex-1 bg-brand-red text-white rounded-2xl py-4 flex items-center justify-center shadow-lg shadow-red-900/40 active:scale-95 transition-transform"
      >
        <i className="fab fa-whatsapp mr-2 text-xl"></i>
        <span className="font-bold text-sm">WhatsApp</span>
      </a>
    </motion.div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 selection:bg-brand-red selection:text-white cursor-none">
      <CustomCursor />
      <Header />
      <main className="flex-grow pt-0 min-h-screen"> 
        {children}
      </main>
      <Footer />
      <StickyMobileActions />
    </div>
  );
};