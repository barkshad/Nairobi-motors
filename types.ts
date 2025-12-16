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
  videoUrl?: string; 
  description: string;
  color: string;
  engineSize: string; 
  features: string[];
  isFeatured: boolean;
  createdAt: number;
}

export interface Inquiry {
  id: string;
  carId?: string; 
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

// --- CMS Content Types ---

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  whyChooseUsTitle: string;
  whyChooseUsText: string;
  heroBackgroundImage?: string;
  heroBackgroundVideo?: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  story: string;
  mission: string;
  valuesIntegrity: string;
  valuesQuality: string;
  valuesCustomer: string;
}

export interface ShowroomContent {
  title: string;
  description: string;
  experienceTitle: string;
  experienceText: string;
}

export interface ContactContent {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
}

export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
  showroom: ShowroomContent;
  contact: ContactContent;
}