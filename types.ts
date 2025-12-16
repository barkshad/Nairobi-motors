export enum Transmission {
  Automatic = 'Automatic',
  Manual = 'Manual',
}

export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Hybrid = 'Hybrid',
  Electric = 'Electric',
}

export enum CarCondition {
  New = 'New',
  Used = 'Used',
  ForeignUsed = 'Foreign Used',
  LocallyUsed = 'Locally Used'
}

export enum CarStatus {
  Available = 'Available',
  Sold = 'Sold',
  Reserved = 'Reserved'
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: Transmission;
  fuelType: FuelType;
  condition: CarCondition;
  status: CarStatus;
  images: string[];
  videoUrl?: string; // New field for video
  description: string;
  color: string;
  engineSize: string; // e.g., "2500cc"
  features: string[];
  isFeatured: boolean;
  createdAt: number;
}

export interface Inquiry {
  id: string;
  carId?: string; // Optional, general inquiry if null
  carName?: string;
  name: string;
  phone: string;
  message: string;
  date: string;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  make: string;
  condition: string;
}