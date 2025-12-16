import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { storeService } from '../services/store';
import { Car, CarCondition, CarStatus, FuelType, Transmission, Inquiry } from '../types';
import { CAR_MAKES } from '../constants';
import { formatPrice } from '../components/CarComponents';

// --- Login Component (Firebase) ---
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your Firebase Auth settings.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 w-full border border-gray-300 rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="mt-1 w-full border border-gray-300 rounded p-2"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-brand-dark text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

// --- Main Admin Dashboard ---
const AdminDashboard: React.FC = () => {
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
    description: '',
    color: '',
    engineSize: '',
    features: [],
    isFeatured: false,
  };
  const [carForm, setCarForm] = useState(initialFormState);
  
  // Handling file uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  const handleDeleteCar = async (id: string) => {
    if (window.confirm('Delete this car? This action cannot be undone.')) {
      await storeService.deleteCar(id);
      refreshData();
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarForm(car);
    setImageFiles([]); // Clear new file input
    setView('add-car');
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingCar) {
        // Updating existing car
        await storeService.updateCar(editingCar.id, carForm, imageFiles);
      } else {
        // Adding new car
        await storeService.addCar(carForm as Omit<Car, "id" | "createdAt" | "images">, imageFiles);
      }
      
      setEditingCar(null);
      setCarForm(initialFormState);
      setImageFiles([]);
      setView('cars');
      refreshData();
    } catch (err) {
      alert("Failed to save car. Check console.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Admin Nav */}
      <div className="bg-brand-dark text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-xl">Nairobi Premium CMS</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => setView('cars')} className={`hover:text-gray-300 ${view === 'cars' ? 'text-brand-red font-bold' : ''}`}>Inventory</button>
          <button onClick={() => setView('inquiries')} className={`hover:text-gray-300 ${view === 'inquiries' ? 'text-brand-red font-bold' : ''}`}>Inquiries</button>
          <button onClick={() => { setEditingCar(null); setCarForm(initialFormState); setView('add-car'); }} className={`hover:text-gray-300 ${view === 'add-car' ? 'text-brand-red font-bold' : ''}`}>Add Car</button>
          <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-white ml-4 border-l pl-4 border-gray-600">Logout</button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full">
        {view === 'cars' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Image</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Details</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Price & Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {car.images[0] && <img src={car.images[0]} className="w-16 h-12 object-cover rounded" alt="thumb" />}
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{car.make} {car.model}</div>
                        <div className="text-xs text-gray-500">{car.year} | {car.transmission} | {car.condition}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{formatPrice(car.price)}</div>
                        <span className={`text-xs px-2 py-1 rounded ${car.status === CarStatus.Available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <button onClick={() => handleEditCar(car)} className="text-blue-600 hover:underline text-sm">Edit</button>
                        <button onClick={() => handleDeleteCar(car.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'inquiries' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="p-4 font-bold border-b">Customer Messages ({inquiries.length})</h3>
            <ul>
              {inquiries.length === 0 && <li className="p-4 text-gray-500">No inquiries yet.</li>}
              {inquiries.map((inq) => (
                <li key={inq.id} className="p-4 border-b hover:bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">{inq.name}</span>
                    <span className="text-sm text-gray-500">{new Date(inq.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-blue-600 mb-1">Re: {inq.carName || 'General Inquiry'}</div>
                  <div className="text-sm text-gray-600 mb-2">{inq.message}</div>
                  <div className="text-sm font-medium">
                     <i className="fas fa-phone mr-1"></i> <a href={`tel:${inq.phone}`} className="hover:underline">{inq.phone}</a>
                     <a href={`https://wa.me/${inq.phone}`} target="_blank" rel="noreferrer" className="ml-4 text-green-600 hover:underline"><i className="fab fa-whatsapp"></i> Chat</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === 'add-car' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6">{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSaveCar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Make</label>
                        <select className="w-full border p-2 rounded" value={carForm.make} onChange={e => setCarForm({...carForm, make: e.target.value})}>
                            {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Model</label>
                        <input type="text" className="w-full border p-2 rounded" value={carForm.model} onChange={e => setCarForm({...carForm, model: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Year</label>
                            <input type="number" className="w-full border p-2 rounded" value={carForm.year} onChange={e => setCarForm({...carForm, year: parseInt(e.target.value)})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Price (KSh)</label>
                            <input type="number" className="w-full border p-2 rounded" value={carForm.price} onChange={e => setCarForm({...carForm, price: parseInt(e.target.value)})} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mileage (km)</label>
                        <input type="number" className="w-full border p-2 rounded" value={carForm.mileage} onChange={e => setCarForm({...carForm, mileage: parseInt(e.target.value)})} required />
                    </div>
                </div>

                {/* Technical */}
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Transmission</label>
                            <select className="w-full border p-2 rounded" value={carForm.transmission} onChange={e => setCarForm({...carForm, transmission: e.target.value as Transmission})}>
                                {Object.values(Transmission).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fuel</label>
                            <select className="w-full border p-2 rounded" value={carForm.fuelType} onChange={e => setCarForm({...carForm, fuelType: e.target.value as FuelType})}>
                                {Object.values(FuelType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Condition</label>
                        <select className="w-full border p-2 rounded" value={carForm.condition} onChange={e => setCarForm({...carForm, condition: e.target.value as CarCondition})}>
                            {Object.values(CarCondition).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                         <select className="w-full border p-2 rounded" value={carForm.status} onChange={e => setCarForm({...carForm, status: e.target.value as CarStatus})}>
                            {Object.values(CarStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Full Width Inputs */}
                <div className="md:col-span-2 space-y-4">
                     <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea className="w-full border p-2 rounded" rows={3} value={carForm.description} onChange={e => setCarForm({...carForm, description: e.target.value})} required />
                    </div>

                    <div className="bg-gray-50 p-4 rounded border border-dashed border-gray-300">
                        <label className="block text-sm font-medium mb-2">Upload Images</label>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={e => {
                                if (e.target.files) {
                                    setImageFiles(Array.from(e.target.files));
                                }
                            }}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-red file:text-white
                                hover:file:bg-red-700
                            "
                        />
                        {/* Previews */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                             {/* Existing Images */}
                             {carForm.images?.map((url, i) => (
                                <img key={`exist-${i}`} src={url} className="h-20 w-20 object-cover rounded border border-gray-200" alt="existing" />
                             ))}
                             {/* New Previews */}
                             {previewUrls.map((url, i) => (
                                 <img key={`new-${i}`} src={url} className="h-20 w-20 object-cover rounded border border-green-300" alt="new" />
                             ))}
                        </div>
                    </div>

                     <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={carForm.isFeatured} onChange={e => setCarForm({...carForm, isFeatured: e.target.checked})} />
                            <span className="text-sm font-medium">Feature this car on Homepage</span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                         <button type="button" onClick={() => setView('cars')} className="mr-4 px-6 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-brand-red text-white rounded font-bold hover:bg-red-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
                         </button>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return user ? (
    <AdminDashboard />
  ) : (
    <Login />
  );
};

export default Admin;