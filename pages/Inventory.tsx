import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockService } from '../services/mockService';
import { Car, CarCondition } from '../types';
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
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-200"
        >
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Inventory</h1>
                <p className="text-slate-500 font-medium">Find your perfect drive from our curated selection.</p>
            </div>
            <div className="text-right">
                <span className="text-3xl font-bold text-brand-red">{filteredCars.length}</span>
                <span className="text-slate-400 text-sm font-medium ml-2">Vehicles Available</span>
            </div>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Sticky Glass Panel */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-1/4"
            >
                <div className="glass-card bg-white/60 sticky top-28 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center text-slate-800">
                            <i className="fas fa-filter mr-2 text-brand-red"></i> Filter
                        </h3>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedMake('');
                                setSelectedCondition('');
                                setMaxPrice(15000000);
                            }}
                            className="text-xs text-brand-red font-bold uppercase tracking-wide hover:underline"
                        >
                            Reset
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Search</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Model, keyword..." 
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-10 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                        </div>
                    </div>

                    {/* Make */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Make</label>
                        <select 
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 outline-none focus:ring-2 focus:ring-brand-red transition-all shadow-sm cursor-pointer"
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                        >
                            <option value="">All Makes</option>
                            {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Condition</label>
                        <div className="flex flex-wrap gap-2">
                             {['', ...Object.values(CarCondition)].map((condition) => (
                                 <button
                                    key={condition}
                                    onClick={() => setSelectedCondition(condition)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        selectedCondition === condition 
                                        ? 'bg-brand-dark text-white shadow-lg' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-dark'
                                    }`}
                                 >
                                     {condition || 'All'}
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                            Max Price: <span className="text-brand-red ml-1">KSh {maxPrice.toLocaleString()}</span>
                        </label>
                        <input 
                            type="range" 
                            min="500000" 
                            max="15000000" 
                            step="500000" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Car Grid */}
            <div className="w-full lg:w-3/4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                         <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredCars.length > 0 ? (
                                filteredCars.map(car => (
                                    <CarCard key={car.id} car={car} />
                                ))
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-20 text-center"
                                >
                                    <div className="inline-block p-6 rounded-full bg-gray-100 mb-4 text-gray-400 text-3xl">
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">No results found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;