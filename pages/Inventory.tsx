import React, { useEffect, useState, useMemo } from 'react';
import { mockService } from '../services/mockService';
import { Car, CarCondition, FuelType, Transmission } from '../types';
import { CAR_MAKES } from '../constants';
import { CarCard } from '../components/CarComponents';

const Inventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(10000000); // 10M default cap

  useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
        setCars(mockService.getCars());
        setLoading(false);
    }, 500);
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
        const matchesSearch = 
            car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
            car.model.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMake = selectedMake ? car.make === selectedMake : true;
        const matchesCondition = selectedCondition ? car.condition === selectedCondition : true;
        const matchesPrice = car.price <= maxPrice;

        return matchesSearch && matchesMake && matchesCondition && matchesPrice;
    });
  }, [cars, searchTerm, selectedMake, selectedCondition, maxPrice]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Inventory</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                        <i className="fas fa-filter mr-2 text-brand-red"></i> Filter Vehicles
                    </h3>
                    
                    {/* Search */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Prado, Demio..." 
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Make */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                        <select 
                            className="w-full border border-gray-300 rounded p-2 outline-none"
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                        >
                            <option value="">All Makes</option>
                            {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                        <select 
                            className="w-full border border-gray-300 rounded p-2 outline-none"
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                            <option value="">Any Condition</option>
                            {Object.values(CarCondition).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price: KSh {maxPrice.toLocaleString()}
                        </label>
                        <input 
                            type="range" 
                            min="500000" 
                            max="15000000" 
                            step="100000" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-brand-red"
                        />
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>500k</span>
                            <span>15M+</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedMake('');
                            setSelectedCondition('');
                            setMaxPrice(10000000);
                        }}
                        className="w-full py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 text-sm font-semibold"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Car Grid */}
            <div className="w-full lg:w-3/4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
                    </div>
                ) : filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 text-center rounded-lg shadow-sm">
                        <i className="fas fa-car-crash text-4xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-medium text-gray-900">No vehicles found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;