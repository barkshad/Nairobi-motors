import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-md py-2' : 'bg-brand-dark py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
              <i className="fas fa-car-side text-brand-red"></i>
              <span>Nairobi <span className="text-brand-red font-extrabold">Premium</span></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-brand-red text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-dark border-t border-gray-700 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-6 tracking-wide">NAIROBI <span className="text-brand-red">PREMIUM</span></h3>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted partner for quality vehicles in Kenya. We specialize in clean, reliable, and premium locally used and foreign used cars.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300"><i className="fab fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/inventory" className="hover:text-brand-red transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Browse Inventory</Link></li>
              <li><Link to="/showroom" className="hover:text-brand-red transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Visit Showroom</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-brand-red transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-brand-red group-hover:text-white transition-colors"></i>
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center group">
                <i className="fas fa-phone mr-3 text-brand-red group-hover:text-white transition-colors"></i>
                <span>{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center group">
                <i className="fas fa-envelope mr-3 text-brand-red group-hover:text-white transition-colors"></i>
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Business Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-white">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-white">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-brand-red">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nairobi Premium Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const StickyMobileActions: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
      <a
        href={`tel:${COMPANY_INFO.phone}`}
        className="flex-1 flex flex-col items-center justify-center py-3 text-gray-800 active:bg-gray-100 transition-colors border-r border-gray-100"
      >
        <i className="fas fa-phone-alt text-xl mb-1 text-brand-dark"></i>
        <span className="text-xs font-bold uppercase tracking-wider">Call</span>
      </a>
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        className="flex-1 flex flex-col items-center justify-center py-3 bg-brand-red text-white active:bg-brand-redHover transition-colors"
      >
        <i className="fab fa-whatsapp text-2xl mb-1"></i>
        <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
      </a>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header />
      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-0"> 
        {children}
      </main>
      <Footer />
      <StickyMobileActions />
    </div>
  );
};