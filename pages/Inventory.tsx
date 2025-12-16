import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { storeService } from '../services/store';
import { Car, CarCondition } from '../types';
import { CAR_MAKES } from '../constants';
import { CarCard } from '../components/CarComponents';
import { PageTransition } from '../components/Layout';

const Inventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);

  useEffect(() => {
    const fetchCars = async () => {
      const data = await storeService.getCars();
      setCars(data);
      setLoading(false);
    };
    fetchCars();
  }, []);

  // Handle URL Search Params
  useEffect(() => {
      const query = searchParams.get('search');
      if (query) {
          setSearchTerm(query);
      }
  }, [searchParams]);

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
    <PageTransition>
      <div className="bg-slate-50 min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-gray-200/50"
          >
              <div>
                  <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Inventory</h1>
                  <p className="text-slate-500 font-medium text-lg">Curated excellence, ready for delivery.</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                  <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3">
                      <span className="text-3xl font-bold text-brand-red">{filteredCars.length}</span>
                      <span className="text-xs uppercase tracking-widest opacity-70 font-bold">Vehicles Found</span>
                  </div>
              </div>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar Filters - Dashboard Style */}
              <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="w-full lg:w-1/4"
              >
                  <div className="bg-white sticky top-32 p-8 rounded-3xl shadow-premium border border-gray-100">
                      <div className="flex items-center justify-between mb-8">
                          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                              Refine Search
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
                              Reset All
                          </button>
                      </div>
                      
                      {/* Search */}
                      <div className="mb-8">
                          <div className="relative group">
                              <input 
                                  type="text" 
                                  placeholder="Search model..." 
                                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-4 px-4 pl-12 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-gray-400"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <i className="fas fa-search absolute left-4 top-4.5 text-gray-400 text-lg group-focus-within:text-brand-red transition-colors"></i>
                          </div>
                      </div>

                      {/* Make */}
                      <div className="mb-8">
                          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Make</label>
                          <select 
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-red transition-all cursor-pointer font-bold text-slate-700 appearance-none"
                              value={selectedMake}
                              onChange={(e) => setSelectedMake(e.target.value)}
                          >
                              <option value="">All Makes</option>
                              {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                          </select>
                      </div>

                      {/* Condition */}
                      <div className="mb-8">
                          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Condition</label>
                          <div className="flex flex-wrap gap-2">
                              {['', ...Object.values(CarCondition)].map((condition) => (
                                  <button
                                      key={condition}
                                      onClick={() => setSelectedCondition(condition)}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border border-transparent ${
                                          selectedCondition === condition 
                                          ? 'bg-slate-900 text-white shadow-lg' 
                                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-gray-200'
                                      }`}
                                  >
                                      {condition || 'All'}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Price Range */}
                      <div className="mb-4">
                          <label className="flex justify-between items-center text-xs font-bold text-slate-900 uppercase tracking-wide mb-4">
                              <span>Max Budget</span>
                              <span className="text-brand-red bg-red-50 px-2 py-1 rounded-md">KSh {maxPrice.toLocaleString()}</span>
                          </label>
                          <input 
                              type="range" 
                              min="500000" 
                              max="15000000" 
                              step="500000" 
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red hover:accent-red-600"
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
                          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8"
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
                                      className="col-span-full py-32 text-center"
                                  >
                                      <div className="inline-block p-8 rounded-full bg-slate-100 mb-6 text-slate-300 text-5xl">
                                          <i className="fas fa-ghost"></i>
                                      </div>
                                      <h3 className="text-2xl font-bold text-slate-800">No results found</h3>
                                      <p className="text-slate-500 mt-2">Adjust your filters to broaden your search.</p>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </motion.div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Inventory;