import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SiteSettings, Notice, Course, StaffProfile, GalleryImage, Student, Quiz, AdmissionSubmission, ContactMessage } from '../../types';
import { KEYS, notifyDataUpdated, getSiteSettings } from './storage';

// Fetch all collections from Firestore and synchronize to local state
export async function syncFromFirestore(): Promise<boolean> {
  try {
    // 1. Settings
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'default'));
      if (settingsSnap.exists()) {
        const remoteSettings = settingsSnap.data() as SiteSettings;
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(remoteSettings));
      }
    } catch (err) {
      console.warn('Firestore settings fetch error:', err);
    }

    // Helper to fetch collection
    const fetchColl = async (collName: string, localKey: string) => {
      try {
        const snap = await getDocs(collection(db, collName));
        if (!snap.empty) {
          const items = snap.docs.map(d => d.data());
          localStorage.setItem(localKey, JSON.stringify(items));
        }
      } catch (err) {
        console.warn(`Firestore ${collName} fetch notice:`, err);
      }
    };

    await Promise.all([
      fetchColl('notices', KEYS.NOTICES),
      fetchColl('courses', KEYS.COURSES),
      fetchColl('staff', KEYS.STAFF),
      fetchColl('gallery', KEYS.GALLERY),
      fetchColl('students', KEYS.STUDENTS),
      fetchColl('quizzes', KEYS.QUIZZES),
      fetchColl('admissions', KEYS.ADMISSIONS),
      fetchColl('messages', KEYS.MESSAGES)
    ]);

    notifyDataUpdated();
    console.log('☁️ Synced successfully with Firebase Firestore.');
    return true;
  } catch (error) {
    console.warn('Firestore initial sync skipped or offline:', error);
    return false;
  }
}

// Push all local data to Firestore (Admin Cloud Sync)
export async function syncAllToFirestore(allData: {
  settings: SiteSettings;
  students: Student[];
  staff: StaffProfile[];
  notices: Notice[];
  admissions: AdmissionSubmission[];
  courses: Course[];
  gallery: GalleryImage[];
  quizzes: Quiz[];
  messages: ContactMessage[];
}): Promise<void> {
  const path = 'syncAll';
  try {
    // 1. Settings
    await setDoc(doc(db, 'settings', 'default'), allData.settings, { merge: true });

    // 2. Batch for other collections
    const syncCollection = async (name: string, items: any[]) => {
      for (const item of items) {
        if (item && item.id) {
          await setDoc(doc(db, name, String(item.id)), item, { merge: true });
        }
      }
    };

    await Promise.all([
      syncCollection('notices', allData.notices || []),
      syncCollection('courses', allData.courses || []),
      syncCollection('staff', allData.staff || []),
      syncCollection('gallery', allData.gallery || []),
      syncCollection('students', allData.students || []),
      syncCollection('quizzes', allData.quizzes || []),
      syncCollection('admissions', allData.admissions || []),
      syncCollection('messages', allData.messages || [])
    ]);

    console.log('✅ Successfully backed up all school data to Firebase Firestore!');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save single Admission submission directly to Firestore
export async function saveAdmissionToFirestore(admission: AdmissionSubmission): Promise<void> {
  const path = `admissions/${admission.id}`;
  try {
    await setDoc(doc(db, 'admissions', admission.id), admission);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Save single Contact message directly to Firestore
export async function saveContactMessageToFirestore(message: ContactMessage): Promise<void> {
  const path = `messages/${message.id}`;
  try {
    await setDoc(doc(db, 'messages', message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
