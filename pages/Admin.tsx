import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { storeService } from '../services/store';
import { Car, CarCondition, CarStatus, FuelType, Transmission, Inquiry } from '../types';
import { CAR_MAKES } from '../constants';
import { formatPrice } from '../components/CarComponents';

// --- Login Component (Firebase + Simple Pass) ---
const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === '12345') {
      onLogin();
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your Firebase Auth settings.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-dark rounded-full mx-auto flex items-center justify-center text-white mb-4">
                <i className="fas fa-user-shield"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-2">Secure access to dealership management</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-red transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-red transition-all"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><i className="fas fa-exclamation-circle"></i> {error}</div>}
          <button type="submit" className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Stat Card Component ---
const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${color}`}>
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
    </div>
);

// --- Main Admin Dashboard ---
const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [view, setView] = useState<'cars' | 'inquiries' | 'add-car'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const initialFormState: Partial<Car> = {
    make: CAR_MAKES[0],
    model: '',
    year: 2020,
    price: 0,
    mileage: 0,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Petrol,
    condition: CarCondition.ForeignUsed,
    status: CarStatus.Available,
    images: [],
    videoUrl: '',
    description: '',
    color: '',
    engineSize: '',
    features: [],
    isFeatured: false,
  };
  const [carForm, setCarForm] = useState(initialFormState);
  const [featuresInput, setFeaturesInput] = useState('');
  
  // Handling file uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const refreshData = async () => {
    const [c, i] = await Promise.all([storeService.getCars(), storeService.getInquiries()]);
    setCars(c);
    setInquiries(i);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update previews when files change
  useEffect(() => {
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [imageFiles]);

  useEffect(() => {
    if (videoFile) {
        const url = URL.createObjectURL(videoFile);
        setVideoPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    } else {
        setVideoPreviewUrl(null);
    }
  }, [videoFile]);

  const handleDeleteCar = async (id: string) => {
    if (window.confirm('Delete this car? This action cannot be undone.')) {
      await storeService.deleteCar(id);
      refreshData();
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarForm(car);
    setFeaturesInput(car.features.join(', '));
    setImageFiles([]); 
    setVideoFile(null);
    setView('add-car');
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Process features
    const processedFeatures = featuresInput.split(',').map(f => f.trim()).filter(f => f !== '');
    const finalForm = { ...carForm, features: processedFeatures };

    try {
      if (editingCar) {
        // Updating
        await storeService.updateCar(
            editingCar.id, 
            finalForm, 
            imageFiles, 
            videoFile || undefined
        );
      } else {
        // Adding
        await storeService.addCar(
            finalForm as Omit<Car, "id" | "createdAt" | "images" | "videoUrl">, 
            imageFiles, 
            videoFile || undefined
        );
      }
      
      setEditingCar(null);
      setCarForm(initialFormState);
      setFeaturesInput('');
      setImageFiles([]);
      setVideoFile(null);
      setView('cars');
      refreshData();
    } catch (err) {
      alert("Failed to save car. See console.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all text-sm";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                     <i className="fas fa-circle-notch text-brand-red"></i>
                     <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">PREMIUM <span className="text-brand-red">CMS</span></h1>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2">
                    {[
                        { id: 'cars', label: 'Inventory', icon: 'fa-car' },
                        { id: 'inquiries', label: 'Inquiries', icon: 'fa-envelope' },
                        { id: 'add-car', label: 'Add Vehicle', icon: 'fa-plus-circle' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => {
                                if(item.id === 'add-car') { setEditingCar(null); setCarForm(initialFormState); setFeaturesInput(''); setImageFiles([]); setVideoFile(null); }
                                setView(item.id as any);
                            }} 
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                view === item.id 
                                ? 'bg-brand-red text-white shadow-lg shadow-red-500/20' 
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <i className={`fas ${item.icon} sm:mr-1`}></i> <span className="hidden sm:inline">{item.label}</span>
                        </button>
                    ))}
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <button onClick={onLogout} className="text-gray-400 hover:text-brand-dark transition-colors text-sm px-2">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Dashboard Stats (Visible on Cars View) */}
        {view === 'cars' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Inventory" 
                    value={cars.length} 
                    icon="fa-car-side" 
                    color="bg-blue-500" 
                />
                 <StatCard 
                    title="Active Inquiries" 
                    value={inquiries.length} 
                    icon="fa-comment-dots" 
                    color="bg-emerald-500" 
                />
                 <StatCard 
                    title="Inventory Value" 
                    value={formatPrice(cars.reduce((acc, curr) => acc + curr.price, 0))} 
                    icon="fa-wallet" 
                    color="bg-brand-red" 
                />
            </div>
        )}

        {view === 'cars' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Vehicle Inventory</h3>
                <div className="text-sm text-gray-500">Sorted by: <span className="font-medium text-slate-900">Newest First</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Specs</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map(car => (
                    <tr key={car.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-24 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                                {car.images[0] ? (
                                    <img src={car.images[0]} className="w-full h-full object-cover" alt="thumb" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><i className="fas fa-image"></i></div>
                                )}
                                {car.videoUrl && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                                        <i className="fas fa-play-circle"></i>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{car.year} {car.make} {car.model}</div>
                                <div className="text-xs text-gray-500">{car.color} • {car.condition}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-700 font-medium">{formatPrice(car.price)}</div>
                        <div className="text-xs text-gray-500">{car.mileage.toLocaleString()} km • {car.fuelType}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            car.status === CarStatus.Available ? 'bg-green-100 text-green-800' : 
                            car.status === CarStatus.Reserved ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditCar(car)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <i className="fas fa-pen"></i>
                        </button>
                        <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="p-6 font-bold text-lg border-b border-gray-100">Customer Messages ({inquiries.length})</h3>
            <ul className="divide-y divide-gray-100">
              {inquiries.length === 0 && <li className="p-8 text-center text-gray-500">No inquiries received yet.</li>}
              {inquiries.map((inq) => (
                <li key={inq.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{inq.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{new Date(inq.date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-brand-red font-medium">Re: {inq.carName || 'General Inquiry'}</div>
                    </div>
                    <div className="flex gap-3">
                        <a href={`tel:${inq.phone}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-brand-dark hover:text-brand-dark transition-colors">
                            <i className="fas fa-phone-alt mr-2"></i> Call
                        </a>
                        <a href={`https://wa.me/${inq.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors">
                            <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                        </a>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      "{inq.message}"
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === 'add-car' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-900">{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                 <button onClick={() => setView('cars')} className="text-sm text-gray-500 hover:text-brand-dark underline">Cancel & Return</button>
            </div>
           
            <form onSubmit={handleSaveCar} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Specs */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Vehicle Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Make</label>
                                    <select className={inputClass} value={carForm.make} onChange={e => setCarForm({...carForm, make: e.target.value})}>
                                        {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Model</label>
                                    <input type="text" className={inputClass} value={carForm.model} onChange={e => setCarForm({...carForm, model: e.target.value})} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <input type="number" className={inputClass} value={carForm.year} onChange={e => setCarForm({...carForm, year: parseInt(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Color</label>
                                    <input type="text" className={inputClass} value={carForm.color} onChange={e => setCarForm({...carForm, color: e.target.value})} required />
                                </div>
                            </div>
                        </div>

                        {/* Performance & Status Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Specs & Performance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Price (KSh)</label>
                                    <input type="number" className={inputClass} value={carForm.price} onChange={e => setCarForm({...carForm, price: parseInt(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Mileage (km)</label>
                                    <input type="number" className={inputClass} value={carForm.mileage} onChange={e => setCarForm({...carForm, mileage: parseInt(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Engine Size</label>
                                    <input type="text" className={inputClass} value={carForm.engineSize} onChange={e => setCarForm({...carForm, engineSize: e.target.value})} placeholder="e.g 2000cc" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Transmission</label>
                                    <select className={inputClass} value={carForm.transmission} onChange={e => setCarForm({...carForm, transmission: e.target.value as Transmission})}>
                                        {Object.values(Transmission).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Fuel Type</label>
                                    <select className={inputClass} value={carForm.fuelType} onChange={e => setCarForm({...carForm, fuelType: e.target.value as FuelType})}>
                                        {Object.values(FuelType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Condition</label>
                                    <select className={inputClass} value={carForm.condition} onChange={e => setCarForm({...carForm, condition: e.target.value as CarCondition})}>
                                        {Object.values(CarCondition).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className={labelClass}>Availability Status</label>
                                <div className="flex gap-4">
                                    {Object.values(CarStatus).map(s => (
                                        <label key={s} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                            <input 
                                                type="radio" 
                                                name="status" 
                                                value={s} 
                                                checked={carForm.status === s} 
                                                onChange={e => setCarForm({...carForm, status: e.target.value as CarStatus})}
                                                className="text-brand-red focus:ring-brand-red"
                                            />
                                            <span className="text-sm font-medium text-slate-700">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                         {/* Description Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Description & Features</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Description</label>
                                    <textarea className={inputClass} rows={4} value={carForm.description} onChange={e => setCarForm({...carForm, description: e.target.value})} required placeholder="Describe the vehicle condition, history, and selling points..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Features (Comma Separated)</label>
                                    <textarea className={inputClass} rows={2} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="Sunroof, Leather Seats, 360 Camera, Alloy Wheels..." />
                                    <p className="text-xs text-gray-400 mt-1">Separate distinct features with commas.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Media */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-20">
                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Media Gallery</h3>
                            
                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className={labelClass}>Vehicle Images</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={e => {
                                            if (e.target.files) setImageFiles(Array.from(e.target.files));
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <i className="fas fa-images text-3xl text-gray-300 group-hover:text-brand-red mb-2 transition-colors"></i>
                                    <p className="text-sm text-gray-500 font-medium">Click to upload photos</p>
                                    <p className="text-xs text-gray-400">{imageFiles.length > 0 ? `${imageFiles.length} new files selected` : 'JPG, PNG formats'}</p>
                                </div>
                                
                                {/* Image Previews */}
                                {(carForm.images?.length > 0 || previewUrls.length > 0) && (
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                         {carForm.images?.map((url, i) => (
                                            <div key={`exist-${i}`} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative group">
                                                <img src={url} className="w-full h-full object-cover" alt="existing" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">Existing</div>
                                            </div>
                                         ))}
                                         {previewUrls.map((url, i) => (
                                             <div key={`new-${i}`} className="aspect-square rounded-lg overflow-hidden border-2 border-green-400 relative">
                                                <img src={url} className="w-full h-full object-cover" alt="new" />
                                                <div className="absolute top-1 right-1 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]"><i className="fas fa-check"></i></div>
                                             </div>
                                         ))}
                                    </div>
                                )}
                            </div>

                            {/* Video Upload */}
                            <div className="mb-6">
                                <label className={labelClass}>Walkaround Video (Optional)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) setVideoFile(e.target.files[0]);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <i className="fas fa-video text-3xl text-gray-300 group-hover:text-brand-red mb-2 transition-colors"></i>
                                    <p className="text-sm text-gray-500 font-medium">Click to upload video</p>
                                    <p className="text-xs text-gray-400">{videoFile ? videoFile.name : 'MP4, MOV formats'}</p>
                                </div>

                                {/* Video Preview */}
                                {(videoPreviewUrl || carForm.videoUrl) && (
                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-black">
                                        <video 
                                            src={videoPreviewUrl || carForm.videoUrl} 
                                            controls 
                                            className="w-full aspect-video"
                                        />
                                        <div className="p-2 bg-gray-900 text-white text-xs text-center">
                                            {videoPreviewUrl ? 'New Video Preview' : 'Current Video'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" checked={carForm.isFeatured} onChange={e => setCarForm({...carForm, isFeatured: e.target.checked})} className="peer h-4 w-4 opacity-0 absolute" />
                                        <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-brand-red transition-colors"></div>
                                        <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 peer-checked:translate-x-5 transition-transform"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Feature on Homepage</span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] ${
                                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-red hover:bg-red-700'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <i className="fas fa-spinner fa-spin"></i> Saving...
                                    </span>
                                ) : (
                                    <span><i className="fas fa-save mr-2"></i> Save Vehicle</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Root Admin Component ---
const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setIsAuthenticated(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-brand-red"><i className="fas fa-circle-notch fa-spin text-4xl"></i></div>;

  return (user || isAuthenticated) ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={() => setIsAuthenticated(true)} />
  );
};

export default Admin;