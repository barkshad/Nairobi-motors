import React, { useEffect, useState } from 'react';
import { storeService } from '../services/store';
import { AboutContent } from '../types';

const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetch = async () => {
        const data = await storeService.getSiteContent();
        setContent(data.about);
    };
    fetch();
  }, []);

  if(!content) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
       <div className="bg-brand-dark py-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-30"></div>
        <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl text-gray-300">{content.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto text-gray-600">
            <div className="mb-12 whitespace-pre-line leading-relaxed">
                {content.story}
            </div>

            <div className="bg-brand-red/5 p-8 rounded-2xl border border-brand-red/10 mb-12">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 mt-0">Our Mission</h2>
                <p className="mb-0 text-slate-700 italic font-medium text-xl">
                    "{content.mission}"
                </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl"><i className="fas fa-check-circle"></i></div>
                    <h3 className="font-bold text-brand-dark mb-2">Integrity</h3>
                    <p className="text-sm leading-relaxed">{content.valuesIntegrity}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-red-50 text-brand-red rounded-lg flex items-center justify-center mb-4 text-xl"><i className="fas fa-star"></i></div>
                    <h3 className="font-bold text-brand-dark mb-2">Quality</h3>
                    <p className="text-sm leading-relaxed">{content.valuesQuality}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 text-xl"><i className="fas fa-users"></i></div>
                    <h3 className="font-bold text-brand-dark mb-2">Customer First</h3>
                    <p className="text-sm leading-relaxed">{content.valuesCustomer}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;