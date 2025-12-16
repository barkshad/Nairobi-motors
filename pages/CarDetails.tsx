import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockService } from '../services/mockService';
import { Car } from '../types';
import { formatPrice } from '../components/CarComponents';
import { COMPANY_INFO } from '../constants';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const foundCar = mockService.getCarById(id);
      setCar(foundCar);
      if (foundCar && foundCar.images.length > 0) {
        setActiveImage(foundCar.images[0]);
      }
    }
  }, [id]);

  if (!car) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockService.addInquiry({
        ...inquiryForm,
        carId: car.id,
        carName: `${car.make} ${car.model}`
    });
    setInquirySent(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="mb-8">
            <nav className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-4">
                <Link to="/" className="hover:text-brand-red transition-colors">Home</Link> 
                <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
                <Link to="/inventory" className="hover:text-brand-red transition-colors">Inventory</Link> 
                <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
                <span className="text-slate-900 font-bold">{car.make} {car.model}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">{car.make} {car.model} <span className="text-slate-400 font-light ml-2">{car.year}</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Gallery & Specs */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-8"
            >
                {/* Main Gallery */}
                <div className="glass-card rounded-3xl p-2 bg-white shadow-xl">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900 group">
                        <motion.img 
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={activeImage} 
                            alt={car.model} 
                            className="w-full h-full object-cover" 
                        />
                         <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-900 shadow-lg">
                                {car.condition}
                            </span>
                        </div>
                    </div>
                    {/* Thumbs */}
                    <div className="flex gap-4 mt-4 px-2 pb-2 overflow-x-auto">
                        {car.images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImage(img)}
                                className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === img ? 'ring-2 ring-brand-red ring-offset-2 scale-105' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="glass-card bg-white/60 p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                        <i className="fas fa-sliders-h text-brand-red"></i> Specifications
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                        {[
                            { label: "Make", val: car.make, icon: "fa-car" },
                            { label: "Model", val: car.model, icon: "fa-list" },
                            { label: "Year", val: car.year, icon: "fa-calendar" },
                            { label: "Mileage", val: `${car.mileage.toLocaleString()} km`, icon: "fa-tachometer-alt" },
                            { label: "Transmission", val: car.transmission, icon: "fa-cogs" },
                            { label: "Fuel", val: car.fuelType, icon: "fa-gas-pump" },
                            { label: "Engine", val: car.engineSize, icon: "fa-cube" },
                            { label: "Color", val: car.color, icon: "fa-palette" },
                            { label: "Drive", val: "2WD/4WD", icon: "fa-road" },
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-slate-400 group-hover:bg-brand-red group-hover:text-white transition-colors">
                                    <i className={`fas ${spec.icon}`}></i>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{spec.label}</span>
                                    <span className="font-bold text-slate-800">{spec.val}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Description */}
                    <div className="glass-card bg-white/60 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Vehicle Overview</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{car.description}</p>
                    </div>
                    {/* Features */}
                    <div className="glass-card bg-white/60 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Key Features</h2>
                        <ul className="space-y-3">
                            {car.features.map((f, i) => (
                                <li key={i} className="flex items-center text-slate-700 text-sm">
                                    <i className="fas fa-check-circle text-green-500 mr-3"></i> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Right Col: Price & Contact - Sticky */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
            >
                <div className="sticky top-28 space-y-6">
                    {/* Price Card */}
                    <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-red rounded-full blur-[60px] opacity-20"></div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Price</p>
                        <h2 className="text-4xl font-extrabold mb-6 text-white">{formatPrice(car.price)}</h2>
                        <div className="space-y-3">
                            <a href={`tel:${COMPANY_INFO.phone}`} className="w-full py-4 bg-white text-brand-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                                <i className="fas fa-phone-alt"></i> Call Seller
                            </a>
                            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=I'm interested in the ${car.year} ${car.make} ${car.model}`} className="w-full py-4 bg-brand-red text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50">
                                <i className="fab fa-whatsapp text-xl"></i> WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    <div className="glass-card bg-white p-8 rounded-3xl shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Send Message</h3>
                        {inquirySent ? (
                             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    <i className="fas fa-check"></i>
                                </div>
                                <h4 className="font-bold text-lg">Sent Successfully!</h4>
                                <p className="text-slate-500 text-sm mt-2">We will contact you shortly.</p>
                             </motion.div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    value={inquiryForm.name}
                                    onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Phone Number" 
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    value={inquiryForm.phone}
                                    onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})}
                                />
                                <textarea 
                                    rows={3} 
                                    placeholder="I am interested in this car..." 
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                                ></textarea>
                                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                    Send Inquiry
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;