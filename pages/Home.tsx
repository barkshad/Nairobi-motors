import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    motion, 
    useScroll, 
    useTransform, 
    useSpring, 
    useMotionValue, 
    useVelocity, 
    useAnimationFrame 
} from 'framer-motion';
import { storeService } from '../services/store';
import { Car, HomeContent } from '../types';
import { CarCard } from '../components/CarComponents';
import { PageTransition } from '../components/Layout';

// --- VELOCITY SCROLL COMPONENT ---
interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${v}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className="font-display uppercase text-7xl md:text-9xl font-bold flex whitespace-nowrap gap-8 text-outline opacity-20" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

// --- SCRAMBLE TEXT EFFECT ---
const ScrambleText: React.FC<{ text: string }> = ({ text }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split("").map((letter, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}</span>;
}

// --- 3D TILT CARD COMPONENT ---
const TiltCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            style={{ x, y, rotateX, rotateY, z: 100 }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const xPct = mouseX / width - 0.5;
                const yPct = mouseY / height - 0.5;
                x.set(xPct * 200);
                y.set(yPct * 200);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            className="relative perspective-1000"
        >
            <motion.div 
                className="glass-dark p-10 rounded-[2rem] border border-white/10 h-full transform-style-3d group overflow-hidden relative"
            >
                {/* Holographic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"></div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-2xl mb-8 group-hover:scale-110 group-hover:text-brand-red transition-all shadow-xl border border-white/5 relative z-10">
                    <i className={`fas ${icon}`}></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{title}</h3>
                <p className="text-gray-400 relative z-10">{text}</p>
            </motion.div>
        </motion.div>
    );
};

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [content, setContent] = useState<HomeContent | null>(null);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      const allCars = await storeService.getCars();
      setFeaturedCars(allCars.filter(c => c.isFeatured).slice(0, 3));
      
      const siteContent = await storeService.getSiteContent();
      setContent(siteContent.home);
    };
    fetchData();
  }, []);

  if(!content) return <div className="h-screen w-full bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <PageTransition>
      <div className="flex flex-col w-full overflow-hidden bg-slate-50">
        
        {/* HERO SECTION - Cinematic */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
          
          {/* Parallax Background */}
          <motion.div 
              style={{ y: yHero }}
              className="absolute inset-0 z-0"
          >
              {content.heroBackgroundVideo ? (
                  <video
                      src={content.heroBackgroundVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-60"
                  />
              ) : (
                  <img 
                      src={content.heroBackgroundImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80"}
                      alt="Hero" 
                      className="w-full h-full object-cover opacity-60"
                  />
              )}
              {/* Vignette & Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80"></div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
              <motion.div 
                  style={{ opacity: opacityHero }}
                  className="max-w-5xl mx-auto text-center"
              >
                   <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center mb-8"
                   >
                       <span className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-brand-red font-bold text-xs uppercase tracking-[0.3em] shadow-glow">
                           Kiambu Autospares Showroom
                       </span>
                   </motion.div>

                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl font-mono">
                     <ScrambleText text={content.heroTitle} />
                  </h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-lg md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 tracking-wide"
                  >
                      {content.heroSubtitle}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                  >
                      <Link to="/inventory" className="relative overflow-hidden group px-10 py-5 bg-brand-red rounded-full font-bold text-white shadow-glow transition-all hover:scale-105 active:scale-95">
                          <span className="relative z-10 flex items-center gap-2 uppercase tracking-wider text-sm">
                              {content.heroButtonText} <i className="fas fa-arrow-right"></i>
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </Link>
                      <Link to="/showroom" className="px-10 py-5 glass-panel rounded-full font-bold text-slate-900 hover:bg-white transition-colors shadow-xl uppercase tracking-wider text-sm">
                          Visit Showroom
                      </Link>
                  </motion.div>
              </motion.div>
          </div>

          {/* Floating Arrow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-2xl"
          >
              <i className="fas fa-chevron-down"></i>
          </motion.div>
        </section>

        {/* VELOCITY BAND */}
        <section className="bg-slate-900 py-12 border-y border-white/5 overflow-hidden">
            <ParallaxText baseVelocity={-2}>KIAMBU AUTOSPARES SHOWROOM • PREMIUM QUALITY • </ParallaxText>
        </section>

        {/* FEATURED COLLECTION */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-brand-red font-bold uppercase tracking-[0.2em] text-sm mb-2 block">Our Finest</span>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">Curated <br/>Inventory.</h2>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/inventory" className="group flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 hover:border-brand-red hover:bg-brand-red hover:text-white transition-all duration-300">
                            <span className="font-bold text-sm uppercase tracking-wide">View All Cars</span>
                            <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredCars.map((car, index) => (
                         <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </section>

        {/* 3D TILT SECTION (Why Choose Us) */}
        <section className="py-32 bg-brand-dark relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-brand-red rounded-full blur-[200px] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-5"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white/50 font-bold uppercase tracking-[0.2em] text-sm mb-4 block"
                    >
                        The Difference
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        {content.whyChooseUsTitle}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 font-light leading-relaxed"
                    >
                        {content.whyChooseUsText}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-container">
                    {[
                        { icon: 'fa-check-circle', title: 'Verified Quality', text: '150-point inspection on every unit.' },
                        { icon: 'fa-handshake', title: 'Transparent Dealings', text: 'No hidden costs, just honest business.' },
                        { icon: 'fa-headset', title: 'Expert Support', text: 'We are with you before and after the sale.' }
                    ].map((item, i) => (
                        <TiltCard 
                            key={i} 
                            delay={i * 0.1}
                            icon={item.icon}
                            title={item.title}
                            text={item.text}
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* MAP SECTION - Full Width */}
        <section className="h-[600px] relative bg-slate-900">
             <div className="absolute inset-0 opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) brightness(0.8)' }} 
                    loading="lazy"
                    title="Map Location"
                ></iframe>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>

             <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex items-end justify-between pointer-events-none">
                 <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl pointer-events-auto max-w-md"
                 >
                     <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Visit the Showroom</h3>
                     <p className="text-slate-500 mb-6">Experience our collection in person. Open Mon-Sat.</p>
                     <Link to="/contact" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-red transition-colors inline-flex items-center gap-2">
                         Get Directions <i className="fas fa-location-arrow"></i>
                     </Link>
                 </motion.div>
             </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;