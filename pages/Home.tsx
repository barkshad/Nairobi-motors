import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { storeService } from '../services/store';
import { Car, HomeContent } from '../types';
import { CarCard } from '../components/CarComponents';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [content, setContent] = useState<HomeContent | null>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      const allCars = await storeService.getCars();
      setFeaturedCars(allCars.filter(c => c.isFeatured).slice(0, 3));
      
      const siteContent = await storeService.getSiteContent();
      setContent(siteContent.home);
    };
    fetchData();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if(!content) return <div className="h-screen w-full bg-slate-900"></div>;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Parallax Background */}
        <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 z-0"
        >
            <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80" 
                alt="Luxury Car Background" 
                className="w-full h-[120%] object-cover object-center brightness-[0.6]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
            <motion.div 
                style={{ opacity }}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-3xl"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-brand-red font-bold text-xs uppercase tracking-widest mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                    Premium Dealership
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight whitespace-pre-line">
                   {content.heroTitle}
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl mb-10 border-l-2 border-brand-red pl-6">
                    {content.heroSubtitle}
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                    <Link to="/inventory" className="group relative px-8 py-4 bg-brand-red text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-red-900/30">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="relative flex items-center gap-3">
                            {content.heroButtonText} <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </span>
                    </Link>
                    <Link to="/showroom" className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        Visit Showroom
                    </Link>
                </motion.div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
            <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
                <motion.div 
                    animate={{ y: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-1.5 h-1.5 bg-brand-red rounded-full mx-auto"
                />
            </div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
            >
                <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">Featured <span className="text-brand-red">Collection</span></h2>
                    <p className="text-slate-500 text-lg">Hand-picked selection of our finest available stock.</p>
                </div>
                <Link to="/inventory" className="text-brand-red font-bold hover:text-brand-dark transition-colors flex items-center gap-2 group">
                    View All Cars <i className="fas fa-long-arrow-alt-right transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </motion.div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {featuredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-brand-dark relative overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red rounded-full blur-[150px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-brand-red font-bold uppercase tracking-widest text-sm"
                >
                    Why Choose Us
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6"
                >
                    {content.whyChooseUsTitle}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg"
                >
                    {content.whyChooseUsText}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: 'fa-check-double', title: '150-Point Check', desc: 'Every vehicle undergoes a rigorous mechanical inspection by certified engineers.' },
                    { icon: 'fa-hand-holding-usd', title: 'Transparent Pricing', desc: 'No hidden fees. Just honest, market-competitive pricing for premium units.' },
                    { icon: 'fa-shield-alt', title: 'After-Sales Support', desc: 'We assist with insurance, KRA transfer, and logbook processing for total peace of mind.' }
                ].map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
                        className="glass-dark p-10 rounded-3xl border border-white/5 hover:border-brand-red/30 transition-colors group"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-brand-red text-2xl group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                            <i className={`fas ${item.icon}`}></i>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="h-[500px] relative bg-slate-900 overflow-hidden">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.8)' }} 
            loading="lazy"
            title="Showroom Location"
            className="opacity-60"
        ></iframe>
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-brand-dark/90 via-transparent to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-md">
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90"
             >
                <div className="flex items-start gap-4">
                    <div className="bg-brand-dark p-4 rounded-full text-white shrink-0">
                        <i className="fas fa-map-marked-alt text-xl"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-xl mb-2">Visit Our Showroom</h4>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">Ngong Road, Near Prestige Plaza.<br/>Experience our collection in person.</p>
                        <Link to="/showroom" className="px-6 py-2 bg-brand-red text-white text-sm font-bold rounded-lg inline-flex items-center gap-2 hover:bg-red-700 transition-colors">
                            Get Directions <i className="fas fa-location-arrow"></i>
                        </Link>
                    </div>
                </div>
             </motion.div>
         </div>
      </section>
    </div>
  );
};

export default Home;