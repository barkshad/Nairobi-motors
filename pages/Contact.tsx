import React, { useEffect, useState } from 'react';
import { storeService } from '../services/store';
import { ContactContent } from '../types';
import { PageTransition } from '../components/Layout';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [contact, setContact] = useState<ContactContent | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await storeService.getSiteContent();
            setContact(data.contact);
        };
        fetch();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await storeService.addInquiry({ ...form });
        setSubmitted(true);
    };

    if(!contact) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <PageTransition>
          <div className="bg-gray-50 min-h-screen">
              <div className="bg-brand-dark py-20 text-center text-white">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-2"
                  >
                    Contact Us
                  </motion.h1>
                  <p className="text-gray-300">We'd love to hear from you</p>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Form */}
                      <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                      >
                          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                          {submitted ? (
                              <div className="bg-green-100 text-green-700 p-6 rounded-xl text-center">
                                  <div className="text-4xl mb-2"><i className="fas fa-check-circle"></i></div>
                                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                                  <p>We have received your message and will get back to you shortly via phone or WhatsApp.</p>
                              </div>
                          ) : (
                              <form onSubmit={handleSubmit} className="space-y-6">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                      <input 
                                          type="text" 
                                          required 
                                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                                          value={form.name}
                                          onChange={e => setForm({...form, name: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
                                      <input 
                                          type="tel" 
                                          required 
                                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                                          value={form.phone}
                                          onChange={e => setForm({...form, phone: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                      <textarea 
                                          rows={4} 
                                          required 
                                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                                          value={form.message}
                                          onChange={e => setForm({...form, message: e.target.value})}
                                      ></textarea>
                                  </div>
                                  <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/20 active:scale-95 transform">
                                      Send Message
                                  </button>
                              </form>
                          )}
                      </motion.div>

                      {/* Info */}
                      <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                      >
                          <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Reach Us Directly</h3>
                              <div className="space-y-4">
                                  <a href={`tel:${contact.phone}`} className="flex items-center p-4 bg-white glass-panel rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                                      <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4 shrink-0">
                                          <i className="fas fa-phone-alt"></i>
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-gray-500 uppercase">Call Us</p>
                                          <p className="font-bold text-gray-900">{contact.phone}</p>
                                      </div>
                                  </a>
                                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center p-4 bg-white glass-panel rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                                      <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4 shrink-0">
                                          <i className="fab fa-whatsapp"></i>
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-gray-500 uppercase">WhatsApp</p>
                                          <p className="font-bold text-gray-900">{contact.whatsapp}</p>
                                      </div>
                                  </a>
                                  <a href={`mailto:${contact.email}`} className="flex items-center p-4 bg-white glass-panel rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                                      <div className="bg-red-100 p-3 rounded-full text-brand-red mr-4 shrink-0">
                                          <i className="fas fa-envelope"></i>
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-gray-500 uppercase">Email Us</p>
                                          <p className="font-bold text-gray-900">{contact.email}</p>
                                      </div>
                                  </a>
                                  <div className="flex items-center p-4 bg-white glass-panel rounded-xl shadow-sm border border-gray-100">
                                      <div className="bg-slate-100 p-3 rounded-full text-slate-600 mr-4 shrink-0">
                                          <i className="fas fa-clock"></i>
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-gray-500 uppercase">Opening Hours</p>
                                          <p className="font-bold text-gray-900">{contact.openingHours}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                              <iframe 
                                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                                  width="100%" 
                                  height="100%" 
                                  style={{ border: 0 }} 
                                  loading="lazy"
                                  title="Map"
                              ></iframe>
                          </div>
                      </motion.div>
                  </div>
              </div>
          </div>
        </PageTransition>
    );
};

export default Contact;