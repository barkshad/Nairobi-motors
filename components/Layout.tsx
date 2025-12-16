import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Showroom', path: '/showroom' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wider text-white">
              <span className="text-brand-red">NAIROBI</span> PREMIUM
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-dark border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
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
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Nairobi Premium</h3>
            <p className="text-sm leading-relaxed">
              Your trusted partner for quality vehicles in Kenya. We offer a wide range of locally used and foreign used cars.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/inventory" className="hover:text-brand-red">Browse Cars</Link></li>
              <li><Link to="/showroom" className="hover:text-brand-red">Visit Showroom</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red">Contact Us</Link></li>
              <li><Link to="/admin" className="hover:text-brand-red">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-brand-red"></i>
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2 text-brand-red"></i>
                <span>{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-brand-red"></i>
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-brand-red"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-2xl hover:text-brand-red"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-2xl hover:text-brand-red"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Nairobi Premium Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const StickyMobileActions: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex shadow-2xl">
      <a
        href={`tel:${COMPANY_INFO.phone}`}
        className="flex-1 flex items-center justify-center py-4 bg-brand-dark text-white font-bold text-sm"
      >
        <i className="fas fa-phone-alt mr-2"></i> Call Now
      </a>
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        className="flex-1 flex items-center justify-center py-4 bg-green-600 text-white font-bold text-sm"
      >
        <i className="fab fa-whatsapp mr-2 text-lg"></i> WhatsApp
      </a>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header />
      <main className="flex-grow pb-16 md:pb-0"> 
        {/* pb-16 adds padding for sticky mobile nav */}
        {children}
      </main>
      <Footer />
      <StickyMobileActions />
    </div>
  );
};
