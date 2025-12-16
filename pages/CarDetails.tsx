import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../services/mockService';
import { Car, Inquiry } from '../types';
import { formatPrice } from '../components/CarComponents';
import { COMPANY_INFO } from '../constants';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    if (id) {
      const foundCar = mockService.getCarById(id);
      setCar(foundCar);
      if (foundCar && foundCar.images.length > 0) {
        setActiveImage(foundCar.images[0]);
      }
    }
  }, [id]);

  if (!car) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div></div>;
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockService.addInquiry({
        ...inquiryForm,
        carId: car.id,
        carName: `${car.make} ${car.model}`
    });
    setInquirySent(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-gray-500 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-brand-red transition-colors">Home</Link> 
            <i className="fas fa-chevron-right text-xs text-gray-300"></i>
            <Link to="/inventory" className="hover:text-brand-red transition-colors">Inventory</Link> 
            <i className="fas fa-chevron-right text-xs text-gray-300"></i>
            <span className="text-brand-dark font-semibold">{car.make} {car.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Images & Specs */}
            <div className="lg:col-span-2 space-y-8">
                {/* Gallery */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="aspect-w-16 aspect-h-10 w-full bg-gray-100 relative group">
                        <img 
                            src={activeImage} 
                            alt={car.model} 
                            className="w-full h-[500px] object-cover object-center transition-opacity duration-300" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                            {car.condition}
                        </div>
                    </div>
                    <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide">
                        {car.images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImage(img)}
                                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-red opacity-100 ring-2 ring-brand-red/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Vehicle Specifications</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                        <SpecItem label="Make" value={car.make} icon="fa-car" />
                        <SpecItem label="Model" value={car.model} icon="fa-list-ul" />
                        <SpecItem label="Year" value={car.year.toString()} icon="fa-calendar-alt" />
                        <SpecItem label="Mileage" value={`${car.mileage.toLocaleString()} km`} icon="fa-tachometer-alt" />
                        <SpecItem label="Transmission" value={car.transmission} icon="fa-cogs" />
                        <SpecItem label="Fuel Type" value={car.fuelType} icon="fa-gas-pump" />
                        <SpecItem label="Engine Size" value={car.engineSize} icon="fa-cube" />
                        <SpecItem label="Exterior Color" value={car.color} icon="fa-palette" />
                        <SpecItem label="Condition" value={car.condition} icon="fa-clipboard-check" />
                    </div>
                </div>

                 {/* Description */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Vehicle Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{car.description}</p>
                </div>

                {/* Features */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {car.features.map((f, i) => (
                            <div key={i} className="flex items-center text-gray-700 p-2 rounded bg-gray-50">
                                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                                <span className="font-medium text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Col: Price & Contact */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-premium border-t-4 border-brand-red">
                        <div className="mb-4">
                            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{car.make} {car.model}</h1>
                            <p className="text-gray-500 text-sm mt-1">{car.year} • {car.transmission} • {car.fuelType}</p>
                        </div>
                        
                        <div className="py-4 border-t border-b border-gray-100 mb-6">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Our Price</p>
                            <p className="text-3xl font-extrabold text-brand-red">{formatPrice(car.price)}</p>
                            <p className="text-xs text-gray-400 mt-1">*Excludes insurance & registration fees</p>
                        </div>
                        
                        <div className="space-y-3">
                            <a href={`tel:${COMPANY_INFO.phone}`} className="w-full flex justify-center items-center gap-2 py-4 bg-brand-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <i className="fas fa-phone-alt"></i> Call Seller
                            </a>
                            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${formatPrice(car.price)})`} className="w-full flex justify-center items-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <i className="fab fa-whatsapp text-xl"></i> WhatsApp Us
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Send an Inquiry</h3>
                        {inquirySent ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-100">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-check text-green-600 text-xl"></i>
                                </div>
                                <h4 className="font-bold mb-1">Inquiry Sent!</h4>
                                <p className="text-sm">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Your Full Name" 
                                        required
                                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                        value={inquiryForm.name}
                                        onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        placeholder="07XX XXX XXX" 
                                        required
                                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                        value={inquiryForm.phone}
                                        onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                    <textarea 
                                        rows={3} 
                                        placeholder="I'm interested in knowing more about..." 
                                        required
                                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                        value={inquiryForm.message}
                                        onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-gray-100 text-brand-dark py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mt-1 flex-shrink-0">
            <i className={`fas ${icon} text-xs`}></i>
        </div>
        <div>
            <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold">{label}</span>
            <span className="font-semibold text-gray-900 text-sm">{value}</span>
        </div>
    </div>
);

export default CarDetails;