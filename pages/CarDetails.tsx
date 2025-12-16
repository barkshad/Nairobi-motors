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
    if (id) {
      const foundCar = mockService.getCarById(id);
      setCar(foundCar);
      if (foundCar && foundCar.images.length > 0) {
        setActiveImage(foundCar.images[0]);
      }
    }
  }, [id]);

  if (!car) {
    return <div className="p-20 text-center">Loading vehicle details...</div>;
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
        <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-brand-red">Home</Link> <span className="mx-2">/</span>
            <Link to="/inventory" className="hover:text-brand-red">Inventory</Link> <span className="mx-2">/</span>
            <span className="text-gray-900">{car.make} {car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Images & Specs */}
            <div className="lg:col-span-2 space-y-8">
                {/* Gallery */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-96 w-full bg-gray-200">
                        <img src={activeImage} alt={car.model} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex p-4 gap-4 overflow-x-auto">
                        {car.images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImage(img)}
                                className={`flex-shrink-0 w-24 h-24 border-2 rounded overflow-hidden ${activeImage === img ? 'border-brand-red' : 'border-transparent'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>

                {/* Specs */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <SpecItem label="Make" value={car.make} />
                        <SpecItem label="Model" value={car.model} />
                        <SpecItem label="Year" value={car.year.toString()} />
                        <SpecItem label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
                        <SpecItem label="Transmission" value={car.transmission} />
                        <SpecItem label="Fuel" value={car.fuelType} />
                        <SpecItem label="Engine" value={car.engineSize} />
                        <SpecItem label="Color" value={car.color} />
                        <SpecItem label="Condition" value={car.condition} />
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Features</h2>
                    <div className="flex flex-wrap gap-2">
                        {car.features.map((f, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                <i className="fas fa-check text-green-500 mr-2"></i>{f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Col: Price & Contact */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-brand-red">
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{car.make} {car.model}</h1>
                        <p className="text-3xl font-bold text-brand-red mb-6">{formatPrice(car.price)}</p>
                        
                        <div className="space-y-3">
                            <a href={`tel:${COMPANY_INFO.phone}`} className="block w-full text-center py-3 bg-brand-dark text-white rounded font-bold hover:bg-gray-800 transition">
                                <i className="fas fa-phone-alt mr-2"></i> Call Now
                            </a>
                            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hi, I am interested in the ${car.year} ${car.make} ${car.model} listed for ${formatPrice(car.price)}`} className="block w-full text-center py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">
                                <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Send an Inquiry</h3>
                        {inquirySent ? (
                            <div className="text-green-600 bg-green-50 p-4 rounded text-center">
                                <i className="fas fa-check-circle text-2xl mb-2"></i>
                                <p>Message sent successfully! We will contact you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={inquiryForm.name}
                                    onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Phone Number" 
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={inquiryForm.phone}
                                    onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})}
                                />
                                <textarea 
                                    rows={3} 
                                    placeholder="I'm interested in this car..." 
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                                ></textarea>
                                <button type="submit" className="w-full bg-brand-red text-white py-2 rounded font-semibold hover:bg-red-700">
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

const SpecItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <span className="block text-gray-500 text-xs uppercase tracking-wide">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);

export default CarDetails;
