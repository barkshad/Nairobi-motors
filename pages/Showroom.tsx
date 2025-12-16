import React from 'react';
import { COMPANY_INFO } from '../constants';

const Showroom: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-brand-dark py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Visit Our Showroom</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">Experience our premium collection in person. Take a test drive today.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">A Premium Buying Experience</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Located conveniently along Ngong Road, our state-of-the-art showroom allows you to view our vehicles in comfort. 
                    We have a dedicated customer lounge, ample parking, and a team of sales executives ready to answer your questions.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    We believe buying a car should be exciting, not stressful. That's why we've designed our space to be welcoming and professional.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-red">
                    <h3 className="font-bold text-lg mb-2">Opening Hours</h3>
                    <p className="text-gray-700">{COMPANY_INFO.openingHours}</p>
                    <p className="text-gray-500 text-sm mt-1">Closed on Public Holidays unless stated otherwise.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&w=600&q=80" alt="Showroom Interior" className="rounded-lg shadow-lg" />
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80" alt="Cars lined up" className="rounded-lg shadow-lg mt-8" />
            </div>
        </div>

        <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Location Map</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    loading="lazy"
                    title="Map"
                ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Showroom;
