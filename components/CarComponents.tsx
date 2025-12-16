import React from 'react';
import { Link } from 'react-router-dom';
import { Car, CarStatus } from '../types';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);
};

export const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        {car.status === CarStatus.Sold && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 z-10 font-bold text-xs uppercase tracking-wider">
            SOLD
          </div>
        )}
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-lg font-bold">{car.make} {car.model}</h3>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-brand-red text-xl font-bold">{formatPrice(car.price)}</span>
          <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{car.year}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center"><i className="fas fa-tachometer-alt w-5 text-center mr-1"></i> {car.mileage.toLocaleString()} km</div>
            <div className="flex items-center"><i className="fas fa-cogs w-5 text-center mr-1"></i> {car.transmission}</div>
            <div className="flex items-center"><i className="fas fa-gas-pump w-5 text-center mr-1"></i> {car.fuelType}</div>
            <div className="flex items-center"><i className="fas fa-cube w-5 text-center mr-1"></i> {car.engineSize}</div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/cars/${car.id}`}
            className="block w-full text-center bg-brand-dark text-white py-2 rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
