import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Car, Inquiry, SiteContent } from "../types";
import { uploadToCloudinary } from "./cloudinary";
import { COMPANY_INFO } from "../constants";

const CARS_COLLECTION = "cars";
const INQUIRIES_COLLECTION = "inquiries";
const CONTENT_COLLECTION = "site_content";

// Map Firestore doc to Car type
const mapDocToCar = (doc: any): Car => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
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

  addCar: async (carData: Omit<Car, "id" | "createdAt" | "images" | "videoUrl">, imageFiles: File[], videoFile?: File): Promise<void> => {
    const imageUrls: string[] = [];
    let videoUrl = "";
    
    for (const file of imageFiles) {
      try {
        const result = await uploadToCloudinary(file);
        imageUrls.push(result.secure_url);
      } catch (err) {
        console.error("Failed to upload image", file.name, err);
      }
    }

    if (videoFile) {
      try {
        const result = await uploadToCloudinary(videoFile);
        videoUrl = result.secure_url;
      } catch (err) {
        console.error("Failed to upload video", videoFile.name, err);
      }
    }

    await addDoc(collection(db, CARS_COLLECTION), {
      ...carData,
      images: imageUrls,
      videoUrl: videoUrl || null,
      createdAt: Timestamp.now(), 
    });
  },

  updateCar: async (id: string, updates: Partial<Car>, newImages?: File[], newVideo?: File): Promise<void> => {
    const docRef = doc(db, CARS_COLLECTION, id);
    let finalUpdates = { ...updates };

    if (newImages && newImages.length > 0) {
       const uploadedUrls = await Promise.all(newImages.map(f => uploadToCloudinary(f).then(res => res.secure_url)));
       const currentImages = updates.images || [];
       finalUpdates.images = [...currentImages, ...uploadedUrls];
    }

    if (newVideo) {
      try {
        const result = await uploadToCloudinary(newVideo);
        finalUpdates.videoUrl = result.secure_url;
      } catch (err) {
         console.error("Failed to upload new video", err);
      }
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
      date: new Date().toISOString(),
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
  },

  // --- SITE CONTENT ---
  getSiteContent: async (): Promise<SiteContent> => {
    // Default fallback content if DB is empty
    const defaults: SiteContent = {
      home: {
        heroTitle: "Drive the Exceptional.",
        heroSubtitle: "Curating Kenya's finest selection of foreign used and locally maintained vehicles.",
        heroButtonText: "View Inventory",
        whyChooseUsTitle: "The Premium Standard",
        whyChooseUsText: "We don't just sell cars; we sell confidence. Experience the difference of a dealership built on integrity and quality."
      },
      about: {
        title: "About Nairobi Premium Motors",
        subtitle: "Driving Kenya Forward Since 2015",
        story: "Founded in 2015, Nairobi Premium Motors has come a long way...",
        mission: "To provide Kenyan car buyers with transparent, safe, and high-quality vehicle options.",
        valuesIntegrity: "We do not tamper with mileages. We sell cars as they are.",
        valuesQuality: "We only stock Grade 4 and above for imports.",
        valuesCustomer: "We walk with you from selection to after-sales service."
      },
      showroom: {
        title: "Visit Our Showroom",
        description: "Experience our premium collection in person.",
        experienceTitle: "A Premium Buying Experience",
        experienceText: "Located conveniently along Ngong Road, our state-of-the-art showroom allows you to view our vehicles in comfort."
      },
      contact: {
        phone: COMPANY_INFO.phone,
        whatsapp: COMPANY_INFO.whatsapp,
        email: COMPANY_INFO.email,
        address: COMPANY_INFO.address,
        openingHours: COMPANY_INFO.openingHours
      }
    };

    try {
      const docRef = doc(db, CONTENT_COLLECTION, "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...defaults, ...docSnap.data() } as SiteContent;
      }
      return defaults;
    } catch (error) {
      console.error("Error getting content:", error);
      return defaults;
    }
  },

  updateSiteContent: async (content: Partial<SiteContent>): Promise<void> => {
    const docRef = doc(db, CONTENT_COLLECTION, "main");
    // Merge true allows us to update only specific sections
    await setDoc(docRef, content, { merge: true });
  }
};