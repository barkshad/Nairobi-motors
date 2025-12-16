import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Car, Inquiry } from "../types";
import { uploadToCloudinary } from "./cloudinary";

const CARS_COLLECTION = "cars";
const INQUIRIES_COLLECTION = "inquiries";

// Map Firestore doc to Car type
const mapDocToCar = (doc: any): Car => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Handle Firestore Timestamps or numbers
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now()
  };
};

export const storeService = {
  // --- CARS ---
  getCars: async (): Promise<Car[]> => {
    try {
      const q = query(collection(db, CARS_COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDocToCar);
    } catch (error) {
      console.error("Error fetching cars:", error);
      return [];
    }
  },

  getCarById: async (id: string): Promise<Car | undefined> => {
    try {
      const docRef = doc(db, CARS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToCar(docSnap);
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching car:", error);
      return undefined;
    }
  },

  addCar: async (carData: Omit<Car, "id" | "createdAt" | "images">, imageFiles: File[]): Promise<void> => {
    // 1. Upload Images to Cloudinary
    const imageUrls: string[] = [];
    
    // Upload sequentially to maintain order, or Promise.all for speed
    for (const file of imageFiles) {
      try {
        const result = await uploadToCloudinary(file);
        imageUrls.push(result.secure_url);
      } catch (err) {
        console.error("Failed to upload image", file.name, err);
        // Continue or throw? Let's continue best effort
      }
    }

    // 2. Save to Firestore
    await addDoc(collection(db, CARS_COLLECTION), {
      ...carData,
      images: imageUrls,
      createdAt: Timestamp.now(), // Use Server Timestamp
    });
  },

  updateCar: async (id: string, updates: Partial<Car>, newImages?: File[]): Promise<void> => {
    const docRef = doc(db, CARS_COLLECTION, id);
    let finalUpdates = { ...updates };

    // If new images provided, upload and append (or replace logic depending on requirement)
    // For simplicity: Append new images to existing list
    if (newImages && newImages.length > 0) {
       const uploadedUrls = await Promise.all(newImages.map(f => uploadToCloudinary(f).then(res => res.secure_url)));
       const currentImages = updates.images || [];
       finalUpdates.images = [...currentImages, ...uploadedUrls];
    }

    await updateDoc(docRef, finalUpdates);
  },

  deleteCar: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, CARS_COLLECTION, id));
  },

  // --- INQUIRIES ---
  addInquiry: async (inquiry: Omit<Inquiry, "id" | "date">): Promise<void> => {
    await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiry,
      date: new Date().toISOString(), // Store string as per type, or use Timestamp
      createdAt: Timestamp.now()
    });
  },

  getInquiries: async (): Promise<Inquiry[]> => {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Inquiry));
  }
};