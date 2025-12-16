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
        heroTitle: "Kiambu's Premier Auto Hub.",
        heroSubtitle: "Top-quality vehicles and authentic spares, serving the Kiambu region with integrity.",
        heroButtonText: "View Vehicles",
        whyChooseUsTitle: "The Kiambu Standard",
        whyChooseUsText: "We have built a reputation in Kiambu for honest pricing and mechanical excellence. Your trusted partner on the road.",
        heroBackgroundImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80",
        heroBackgroundVideo: ""
      },
      about: {
        title: "About Kiambu Autospares",
        subtitle: "Serving Our Community Since 2018",
        story: "Kiambu Autospares Showroom started with a simple mission: to bring reliable cars and parts closer to home...",
        mission: "To be the most trusted automotive partner in Kiambu County.",
        valuesIntegrity: "Genuine parts, genuine mileage, genuine people.",
        valuesQuality: "We rigorously test every vehicle and spare part we sell.",
        valuesCustomer: "Your satisfaction drives our business forward."
      },
      showroom: {
        title: "Visit Our Showroom",
        description: "See our collection at our Kiambu Road location.",
        experienceTitle: "Convenience & Quality",
        experienceText: "Located conveniently along Kiambu Road, we offer a hassle-free environment to inspect our stock."
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
        const data = docSnap.data();
        return {
           ...defaults, 
           ...data,
           home: { ...defaults.home, ...data.home },
           about: { ...defaults.about, ...data.about },
           showroom: { ...defaults.showroom, ...data.showroom },
           contact: { ...defaults.contact, ...data.contact }
        } as SiteContent;
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