import { useState, useEffect } from 'react';
import { SiteSettings, Course, StaffProfile, Notice, GalleryImage, Student, Quiz, AdmissionSubmission, ContactMessage } from '../../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_COURSES,
  DEFAULT_STAFF,
  DEFAULT_NOTICES,
  DEFAULT_GALLERY,
  DEFAULT_STUDENTS,
  DEFAULT_QUIZZES
} from '../data/initialData';

const KEYS = {
  SETTINGS: 'sia_site_settings',
  COURSES: 'sia_courses',
  STAFF: 'sia_staff',
  NOTICES: 'sia_notices',
  GALLERY: 'sia_gallery',
  STUDENTS: 'sia_students_db',
  QUIZZES: 'sia_quizzes',
  ADMISSIONS: 'sia_admissions',
  MESSAGES: 'sia_contact_messages',
  LAST_SYNC: 'sia_last_sync'
};

export const initStorageIfEmpty = () => {
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  } else {
    // Merge new fields if existing settings are from old version
    try {
      const existing = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
      const merged = { ...DEFAULT_SETTINGS, ...existing };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(merged));
    } catch {}
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
  }
  if (!localStorage.getItem(KEYS.STAFF)) {
    localStorage.setItem(KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
  }
  if (!localStorage.getItem(KEYS.NOTICES)) {
    localStorage.setItem(KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
  }
  if (!localStorage.getItem(KEYS.GALLERY)) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
  }
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.QUIZZES)) {
    localStorage.setItem(KEYS.QUIZZES, JSON.stringify(DEFAULT_QUIZZES));
  }
  if (!localStorage.getItem(KEYS.ADMISSIONS)) {
    localStorage.setItem(KEYS.ADMISSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.MESSAGES)) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify([]));
  }
};

export const notifyDataUpdated = () => {
  window.dispatchEvent(new Event('sia_data_updated'));
};

export const getSiteSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSiteSettings = (settings: SiteSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  notifyDataUpdated();
};

export const useSchoolSettings = (): [SiteSettings, (newSettings: SiteSettings) => void] => {
  const [settings, setSettings] = useState<SiteSettings>(() => getSiteSettings());

  useEffect(() => {
    const handler = () => {
      setSettings(getSiteSettings());
    };
    window.addEventListener('sia_data_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('sia_data_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const update = (newSettings: SiteSettings) => {
    saveSiteSettings(newSettings);
    setSettings(newSettings);
  };

  return [settings, update];
};

export const useCollection = <T,>(key: string, defaultValue: T[]): [T[], (items: T[]) => void] => {
  const [data, setData] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(key);
        setData(raw ? JSON.parse(raw) : defaultValue);
      } catch {
        setData(defaultValue);
      }
    };
    window.addEventListener('sia_data_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('sia_data_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [key]);

  const update = (items: T[]) => {
    localStorage.setItem(key, JSON.stringify(items));
    setData(items);
    notifyDataUpdated();
  };

  return [data, update];
};

export { KEYS };
