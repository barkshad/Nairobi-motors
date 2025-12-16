import React, { useEffect, useState } from 'react';
import { storeService } from '../services/store';
import { ContactContent, ShowroomContent } from '../types';
import { PageTransition } from '../components/Layout';
import { motion } from 'framer-motion';

const Showroom: React.FC = () => {
  const [content, setContent] = useState<ShowroomContent | null>(null);
  const [contact, setContact] = useState<ContactContent | null>(null);

  useEffect(() => {
    const fetch = async () => {
        const data = await storeService.getSiteContent();
        setContent(data.showroom);
        setContact(data.contact);
    };
    fetch();
  }, []);

  if(!content || !contact) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-brand-dark py-24 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            {content.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.experienceTitle}</h2>
                  <div className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                      {content.experienceText}
                  </div>
                  
                  <div className="glass-panel bg-gray-50/50 p-6 rounded-lg border-l-4 border-brand-red shadow-sm">
                      <h3 className="font-bold text-lg mb-2">Opening Hours</h3>
                      <p className="text-gray-700">{contact.openingHours}</p>
                      <p className="text-gray-500 text-sm mt-1">Closed on Public Holidays unless stated otherwise.</p>
                  </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src="https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&w=600&q=80" alt="Showroom Interior" className="rounded-2xl shadow-lg transition-transform duration-500" 
                  />
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80" alt="Cars lined up" className="rounded-2xl shadow-lg mt-8 transition-transform duration-500" 
                  />
              </motion.div>
          </div>

          <div className="mt-20">
              <h2 className="text-2xl font-bold mb-6 text-center">Location Map</h2>
              <div className="h-96 w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63826.53634123531!2d36.804153399999995!3d-1.171542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f386915037d4f%3A0x6543b57356236b56!2sKiambu!5e0!3m2!1sen!2ske!4v1709214000000!5m2!1sen!2ske" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      loading="lazy"
                      title="Map"
                  ></iframe>
              </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Showroom;