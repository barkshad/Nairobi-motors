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
      <section className="relative h-[85vh] min-h-[600px] flex items-center bg-gray-900 overflow-hidden">
        {/* Background Image with Scale Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Showroom" 
            className="w-full h-full object-cover animate-fade-in scale-105"
            loading="eager"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl animate-fade-in-up">
                <span className="inline-block py-1 px-3 rounded bg-brand-red/20 text-brand-red border border-brand-red/30 text-sm font-bold uppercase tracking-widest mb-6">
                    Premium Dealership
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                    Drive Excellence <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">Every Day.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl">
                    Experience Kenya's finest selection of foreign used and locally maintained vehicles. Verified quality, transparent pricing, and unmatched service.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                    <Link to="/inventory" className="px-8 py-4 bg-brand-red text-white font-bold rounded-lg shadow-lg hover:bg-brand-redHover hover:shadow-red-900/30 transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-2">
                        View Inventory <i className="fas fa-arrow-right"></i>
                    </Link>
                    <Link to="/showroom" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white hover:text-brand-dark transition-all transform hover:-translate-y-1 text-center">
                        Visit Showroom
                    </Link>
                </div>
                
                <div className="mt-12 flex items-center gap-8 text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-check-circle text-brand-red"></i> Verified Mileage
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fas fa-check-circle text-brand-red"></i> Accident Free
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fas fa-check-circle text-brand-red"></i> Grade 4+ Imports
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Featured Collection</h2>
                    <p className="text-gray-600">Hand-picked selection of our finest available stock.</p>
                </div>
                <Link to="/inventory" className="group text-brand-red font-bold hover:text-brand-redHover flex items-center gap-2 transition-colors">
                    View Full Inventory <i className="fas fa-long-arrow-alt-right transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 translate-x-20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-brand-red font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">We Are Different</h2>
                <p className="text-gray-600">We don't just sell cars; we build relationships. Here is why thousands of Kenyans trust us.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-brand-dark text-2xl group-hover:bg-brand-dark group-hover:text-white transition-colors">
                        <i className="fas fa-clipboard-check"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Assured</h3>
                    <p className="text-gray-600 leading-relaxed">Every car undergoes a rigorous 150-point mechanical inspection by our certified engineers before hitting the floor.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300 group">
                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-brand-dark text-2xl group-hover:bg-brand-dark group-hover:text-white transition-colors">
                        <i className="fas fa-tags"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Fair Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">We offer the best market rates in Kenya with transparent pricing, no hidden fees, and flexible financing options.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300 group">
                    <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-brand-dark text-2xl group-hover:bg-brand-dark group-hover:text-white transition-colors">
                        <i className="fas fa-headset"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Support</h3>
                    <p className="text-gray-600 leading-relaxed">Our team assists with KRA transfer, insurance, and logbook processing to ensure a seamless ownership experience.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-dark text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Trusted by Kenyans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 hover:border-brand-red/50 transition-colors">
                    <div className="flex text-yellow-400 mb-6 text-sm">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <p className="text-lg italic mb-8 text-gray-300 leading-relaxed">"Bought my first Toyota Harrier here. The process was smooth, honest, and they handled all the KRA paperwork for me. Highly recommended!"</p>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center font-bold text-xl">JK</div>
                         <div>
                            <h4 className="font-bold text-white">John Kamau</h4>
                            <span className="text-sm text-gray-400">Nairobi, KE</span>
                         </div>
                    </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 hover:border-brand-red/50 transition-colors">
                    <div className="flex text-yellow-400 mb-6 text-sm">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <p className="text-lg italic mb-8 text-gray-300 leading-relaxed">"Professional service and legitimate clean cars. No tricks. The car looked exactly like the photos on the website. A truly premium experience."</p>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center font-bold text-xl">SO</div>
                         <div>
                            <h4 className="font-bold text-white">Sarah Ochieng</h4>
                            <span className="text-sm text-gray-400">Mombasa, KE</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="h-[400px] relative bg-gray-200">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0.3)' }} 
            loading="lazy"
            title="Showroom Location"
        ></iframe>
         <div className="absolute bottom-8 left-4 md:left-8 bg-white p-6 rounded-xl shadow-premium max-w-xs md:max-w-sm border border-gray-100">
             <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Visit Our Showroom</h4>
                    <p className="text-sm text-gray-500 mb-3">{COMPANY_INFO.address}</p>
                    <Link to="/showroom" className="text-brand-red text-sm font-bold inline-flex items-center hover:underline">
                        Get Directions <i className="fas fa-external-link-alt ml-2"></i>
                    </Link>
                </div>
                <div className="bg-brand-light p-3 rounded-full text-brand-dark">
                    <i className="fas fa-map-marked-alt text-xl"></i>
                </div>
             </div>
         </div>
      </section>
    </div>
  );
};

export default Home;