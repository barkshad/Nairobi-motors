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
  const [maxPrice, setMaxPrice] = useState<number>(15000000);

  useEffect(() => {
    // Simulate network delay for effect
    setTimeout(() => {
        setCars(mockService.getCars());
        setLoading(false);
    }, 600);
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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available Inventory</h1>
                <p className="text-gray-500 mt-1">{filteredCars.length} vehicles found</p>
            </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-1/4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center text-gray-900">
                            <i className="fas fa-sliders-h mr-2 text-brand-red"></i> Filters
                        </h3>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedMake('');
                                setSelectedCondition('');
                                setMaxPrice(15000000);
                            }}
                            className="text-xs text-brand-red font-semibold hover:underline"
                        >
                            Reset All
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Keyword</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. Prado..." 
                                className="w-full border border-gray-200 bg-gray-50 rounded-lg py-2.5 px-3 pl-10 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
                        </div>
                    </div>

                    {/* Make */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Make</label>
                        <select 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm"
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                        >
                            <option value="">All Makes</option>
                            {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Condition</label>
                        <select 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm"
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                            <option value="">Any Condition</option>
                            {Object.values(CarCondition).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Max Budget
                        </label>
                        <div className="text-brand-red font-bold text-lg mb-2">
                            KSh {maxPrice.toLocaleString()}
                        </div>
                        <input 
                            type="range" 
                            min="500000" 
                            max="15000000" 
                            step="500000" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                        />
                         <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>500k</span>
                            <span>15M+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Car Grid */}
            <div className="w-full lg:w-3/4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red mb-4"></div>
                         <p className="text-gray-500 animate-pulse">Loading vehicles...</p>
                    </div>
                ) : filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-16 text-center rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400 text-3xl">
                            <i className="fas fa-search"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any cars matching your specific criteria. Try adjusting your price range or filters.</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedMake('');
                                setSelectedCondition('');
                                setMaxPrice(15000000);
                            }}
                            className="mt-6 px-6 py-2 bg-brand-dark text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;