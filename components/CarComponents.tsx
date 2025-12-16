import React from 'react';
import { Link } from 'react-router-dom';
import { Car, CarStatus } from '../types';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES', 
    maximumFractionDigits: 0 
  }).format(price);
};

export const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden relative">
      <Link to={`/cars/${car.id}`} className="block relative h-64 overflow-hidden bg-gray-200">
        {car.status === CarStatus.Sold && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 z-10 font-bold text-xs uppercase tracking-widest shadow-md rounded-sm">
            SOLD
          </div>
        )}
        {car.status === CarStatus.Reserved && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-1 z-10 font-bold text-xs uppercase tracking-widest shadow-md rounded-sm">
            Reserved
          </div>
        )}
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm inline-block px-2 py-1 rounded mb-2">
            {car.condition}
          </p>
          <h3 className="text-white text-xl font-bold truncate tracking-tight text-shadow">{car.make} {car.model}</h3>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-end mb-4 pb-4 border-b border-gray-100">
          <div>
             <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">{car.year}</p>
             <span className="text-brand-red text-2xl font-extrabold">{formatPrice(car.price)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
                <i className="fas fa-tachometer-alt text-brand-gray w-4"></i> 
                <span className="truncate">{car.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2">
                <i className="fas fa-cogs text-brand-gray w-4"></i> 
                <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
                <i className="fas fa-gas-pump text-brand-gray w-4"></i> 
                <span className="truncate">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
                <i className="fas fa-cube text-brand-gray w-4"></i> 
                <span className="truncate">{car.engineSize}</span>
            </div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/cars/${car.id}`}
            className="w-full flex items-center justify-center py-3 rounded-lg border-2 border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 group-hover:bg-brand-dark group-hover:text-white"
          >
            View Details <i className="fas fa-arrow-right ml-2 text-xs transform group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};