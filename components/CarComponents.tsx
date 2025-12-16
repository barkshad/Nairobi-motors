import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Car, CarStatus } from '../types';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES', 
    maximumFractionDigits: 0 
  }).format(price);
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <motion.div 
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative h-full flex flex-col"
    >
      {/* Glass Card Container */}
      <motion.div 
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-card rounded-2xl overflow-hidden h-full flex flex-col bg-white/60 hover:bg-white/80 transition-colors duration-300 hover:shadow-premium-hover border border-white/40"
      >
        
        {/* Image Section */}
        <Link to={`/cars/${car.id}`} className="block relative h-64 overflow-hidden">
            {/* Status Badges */}
            {car.status === CarStatus.Sold && (
              <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-md text-white px-4 py-1 z-20 font-bold text-xs uppercase tracking-widest shadow-lg rounded-lg border border-red-500/50">
                SOLD
              </div>
            )}
            {car.status === CarStatus.Reserved && (
              <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-white px-4 py-1 z-20 font-bold text-xs uppercase tracking-widest shadow-lg rounded-lg border border-amber-400/50">
                Reserved
              </div>
            )}
            
            {/* Image Zoom Effect */}
            <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </motion.div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/20 uppercase tracking-wide">
                    {car.condition}
                </span>
                <h3 className="text-white text-xl font-bold mt-2 text-shadow-sm truncate">{car.make} {car.model}</h3>
            </div>
        </Link>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow relative">
           <div className="flex justify-between items-baseline mb-4 border-b border-gray-200/50 pb-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{car.year}</p>
                <span className="text-brand-red text-xl font-extrabold">{formatPrice(car.price)}</span>
           </div>

           <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg border border-gray-100">
                    <i className="fas fa-tachometer-alt text-gray-400"></i>
                    <span className="font-medium truncate">{car.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg border border-gray-100">
                    <i className="fas fa-gas-pump text-gray-400"></i>
                    <span className="font-medium truncate">{car.fuelType}</span>
                </div>
                 <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg border border-gray-100">
                    <i className="fas fa-cogs text-gray-400"></i>
                    <span className="font-medium truncate">{car.transmission}</span>
                </div>
                 <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg border border-gray-100">
                    <i className="fas fa-cube text-gray-400"></i>
                    <span className="font-medium truncate">{car.engineSize}</span>
                </div>
           </div>

           <div className="mt-auto pt-2">
               <Link 
                to={`/cars/${car.id}`}
                className="block w-full text-center py-3 rounded-xl bg-brand-dark text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]"
               >
                   View Details
               </Link>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};