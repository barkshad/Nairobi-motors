import { Car, Inquiry } from "../types";
import { INITIAL_CARS } from "../constants";

const CARS_KEY = "kas_cars_v1";
const INQUIRIES_KEY = "kas_inquiries_v1";
const ADMIN_TOKEN_KEY = "kas_admin_token";

export const mockService = {
  // --- CARS ---
  getCars: (): Car[] => {
    const stored = localStorage.getItem(CARS_KEY);
    if (!stored) {
      localStorage.setItem(CARS_KEY, JSON.stringify(INITIAL_CARS));
      return INITIAL_CARS;
    }
    return JSON.parse(stored);
  },

  getCarById: (id: string): Car | undefined => {
    const cars = mockService.getCars();
    return cars.find((c) => c.id === id);
  },

  addCar: (car: Omit<Car, "id" | "createdAt">): Car => {
    const cars = mockService.getCars();
    const newCar: Car = {
      ...car,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    cars.unshift(newCar); // Add to top
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return newCar;
  },

  updateCar: (id: string, updates: Partial<Car>): Car | null => {
    const cars = mockService.getCars();
    const index = cars.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    cars[index] = { ...cars[index], ...updates };
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return cars[index];
  },

  deleteCar: (id: string): void => {
    const cars = mockService.getCars();
    const filtered = cars.filter((c) => c.id !== id);
    localStorage.setItem(CARS_KEY, JSON.stringify(filtered));
  },

  // --- INQUIRIES ---
  addInquiry: (inquiry: Omit<Inquiry, "id" | "date">) => {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    const inquiries: Inquiry[] = stored ? JSON.parse(stored) : [];
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  },

  getInquiries: (): Inquiry[] => {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // --- AUTH (Simple Mock) ---
  login: (password: string): boolean => {
    if (password === "admin123") {
      localStorage.setItem(ADMIN_TOKEN_KEY, "valid-token");
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  }
};