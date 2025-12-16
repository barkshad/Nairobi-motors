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
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  },
  hover: {
    y: -10,
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }
};

export const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative h-full"
    >
      <Link to={`/cars/${car.id}`} className="block h-full">
        <div className="relative h-full bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-brand-red/10 flex flex-col">
            
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-[2rem]">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </div>

            {/* Image Container */}
            <div className="relative h-72 overflow-hidden">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        {car.condition}
                    </span>
                    {car.isFeatured && (
                         <span className="bg-brand-dark/95 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md border border-white/10">
                            Featured
                        </span>
                    )}
                </div>

                <div className="absolute top-4 right-4 z-20">
                     {car.status !== CarStatus.Available && (
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${
                            car.status === CarStatus.Sold ? 'bg-red-600' : 'bg-amber-500'
                        }`}>
                            {car.status}
                        </span>
                    )}
                </div>
                
                {/* Main Image with Ken Burns Effect */}
                <motion.div 
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow bg-white relative">
                {/* Floating Price Tag Effect */}
                <div className="absolute -top-6 right-6 bg-brand-red text-white px-4 py-2 rounded-xl shadow-lg shadow-red-600/30 transform group-hover:scale-110 transition-transform duration-300 z-20">
                    <span className="font-bold text-sm tracking-tight">{formatPrice(car.price)}</span>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-brand-red transition-colors">
                        {car.make} {car.model}
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">{car.year} • {car.color}</p>
                </div>

                {/* Specs Grid - Minimalist */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <i className="fas fa-tachometer-alt text-brand-red/70"></i>
                        <span className="truncate">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <i className="fas fa-gas-pump text-brand-red/70"></i>
                        <span className="truncate">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <i className="fas fa-cogs text-brand-red/70"></i>
                        <span className="truncate">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <i className="fas fa-cube text-brand-red/70"></i>
                        <span className="truncate">{car.engineSize}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900 group-hover:underline decoration-brand-red underline-offset-4 decoration-2">View Details</span>
                    <motion.div 
                        className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg"
                        whileHover={{ x: 5, backgroundColor: "#D90429" }}
                    >
                        <i className="fas fa-arrow-right text-xs"></i>
                    </motion.div>
                </div>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};