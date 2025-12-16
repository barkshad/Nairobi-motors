import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '../services/mockService';
import { Car } from '../types';
import { CarCard } from '../components/CarComponents';
import { COMPANY_INFO } from '../constants';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    const allCars = mockService.getCars();
    setFeaturedCars(allCars.filter(c => c.isFeatured).slice(0, 3));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gray-900 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80" 
            alt="Showroom Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Drive Your Dream <span className="text-brand-red">Today</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 font-light">
                    Kenya's most trusted car dealership. We import high-quality foreign used vehicles and offer the best locally used deals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/inventory" className="px-8 py-4 bg-brand-red text-white font-bold rounded shadow-lg hover:bg-red-700 transition-colors text-center">
                        View Inventory
                    </Link>
                    <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition-colors text-center">
                        Visit Showroom
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
                <div className="w-20 h-1 bg-brand-red mx-auto mt-4"></div>
                <p className="mt-4 text-gray-600">Hand-picked selection of our finest stock.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <Link to="/inventory" className="inline-block text-brand-red font-bold hover:text-red-800 underline">
                    View All Cars <i className="fas fa-arrow-right ml-1"></i>
                </Link>
            </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark text-2xl">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quality Assured</h3>
                    <p className="text-gray-600">Every car undergoes a rigorous mechanical inspection before hitting our showroom floor.</p>
                </div>
                <div className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark text-2xl">
                        <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Competitive Pricing</h3>
                    <p className="text-gray-600">We offer the best market rates in Kenya with transparent pricing and no hidden costs.</p>
                </div>
                <div className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark text-2xl">
                        <i className="fas fa-users"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                    <p className="text-gray-600">Our team assists with financing, insurance, and transfer of ownership logistics.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-8 rounded-lg">
                    <div className="flex text-yellow-400 mb-4 justify-center">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <p className="italic mb-6">"Bought my first Toyota Harrier here. The process was smooth, and they handled all the KRA paperwork for me. Highly recommended!"</p>
                    <h4 className="font-bold text-brand-red">- John Kamau</h4>
                </div>
                <div className="bg-gray-800 p-8 rounded-lg">
                    <div className="flex text-yellow-400 mb-4 justify-center">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <p className="italic mb-6">"Professional service and legitimate clean cars. No tricks. The car looked exactly like the photos on the website."</p>
                    <h4 className="font-bold text-brand-red">- Sarah Ochieng</h4>
                </div>
            </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="h-96 relative bg-gray-200">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy"
            title="Showroom Location"
        ></iframe>
         <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-lg max-w-sm">
             <h4 className="font-bold text-gray-900">Visit Our Showroom</h4>
             <p className="text-sm text-gray-600">{COMPANY_INFO.address}</p>
             <Link to="/showroom" className="text-brand-red text-sm font-bold mt-2 inline-block">Get Directions</Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
