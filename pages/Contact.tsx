import React, { useState } from 'react';
import { COMPANY_INFO } from '../constants';
import { mockService } from '../services/mockService';

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mockService.addInquiry({ ...form });
        setSubmitted(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
             <div className="bg-brand-dark py-12 text-center text-white">
                <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
                <p className="text-gray-300">We'd love to hear from you</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                        {submitted ? (
                            <div className="bg-green-100 text-green-700 p-6 rounded text-center">
                                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                                <p>We have received your message and will get back to you shortly via phone or WhatsApp.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-brand-red focus:border-brand-red outline-none"
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number (WhatsApp)</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-brand-red focus:border-brand-red outline-none"
                                        value={form.phone}
                                        onChange={e => setForm({...form, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea 
                                        rows={4} 
                                        required 
                                        className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-brand-red focus:border-brand-red outline-none"
                                        value={form.message}
                                        onChange={e => setForm({...form, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-md font-bold hover:bg-red-700 transition">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Reach Us Directly</h3>
                            <div className="space-y-4">
                                <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                                        <i className="fas fa-phone-alt"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Call Us</p>
                                        <p className="font-bold text-gray-900">{COMPANY_INFO.phone}</p>
                                    </div>
                                </a>
                                <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                    <div className="bg-red-100 p-3 rounded-full text-brand-red mr-4">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Us</p>
                                        <p className="font-bold text-gray-900">{COMPANY_INFO.email}</p>
                                    </div>
                                </a>
                                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Opening Hours</p>
                                        <p className="font-bold text-gray-900">{COMPANY_INFO.openingHours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="h-64 rounded-lg overflow-hidden shadow-md">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166412891965!2d36.7827885!3d-1.2995545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109983990479%3A0x6331902263303685!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
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
        </div>
    );
};

export default Contact;
