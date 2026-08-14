import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

export interface AppDataBundle {
  weekly_activities?: string | null;
  weekly_schedule_slots?: string | null;
  game_spinner_categories?: string | null;
  spin_history?: string | null;
  game_wishlist?: string | null;
  watched_movies_hub?: string | null;
  movie_wishlist?: string | null;
  game_spinner_sound_enabled?: string | null;
  theme?: string | null;
}

const STORAGE_KEYS = [
  'weekly_activities',
  'weekly_schedule_slots',
  'game_spinner_categories',
  'spin_history',
  'game_wishlist',
  'watched_movies_hub',
  'movie_wishlist',
  'game_spinner_sound_enabled',
  'theme'
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  syncStatus: 'synced' | 'syncing' | 'idle' | 'error';
  lastSyncedAt: number | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  saveDataToCloud: () => Promise<void>;
  fetchDataFromCloud: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'idle' | 'error'>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const s = localStorage.getItem('app_last_cloud_sync');
    return s ? parseInt(s, 10) : null;
  });

  // Pull data from Cloud Firestore to localStorage and dispatch custom storage event
  const fetchDataFromCloud = useCallback(async (targetUser?: User | null): Promise<boolean> => {
    const currentUser = targetUser !== undefined ? targetUser : user;
    if (!currentUser || !db) return false;

    try {
      setSyncStatus('syncing');
      const docRef = doc(db, 'users', currentUser.uid, 'data', 'hub');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        let changed = false;

        STORAGE_KEYS.forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            localStorage.setItem(key, typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
            changed = true;
          }
        });

        const syncTime = Date.now();
        setLastSyncedAt(syncTime);
        localStorage.setItem('app_last_cloud_sync', syncTime.toString());
        setSyncStatus('synced');

        if (changed) {
          window.dispatchEvent(new Event('app_data_synced'));
        }
        return true;
      } else {
        // No cloud data yet; auto-upload initial local data to cloud
        await saveDataToCloud(currentUser);
        return true;
      }
    } catch (err) {
      console.error('Error fetching data from Firestore:', err);
      setSyncStatus('error');
      return false;
    }
  }, [user]);

  // Save current localStorage data to Cloud Firestore
  const saveDataToCloud = useCallback(async (targetUser?: User | null) => {
    const currentUser = targetUser !== undefined ? targetUser : user;
    if (!currentUser || !db) return;

    try {
      setSyncStatus('syncing');
      const bundle: Record<string, any> = {
        updatedAt: serverTimestamp(),
        updatedAtMillis: Date.now(),
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName
      };

      STORAGE_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) {
          bundle[key] = val;
        }
      });

      // Save user profile
      const userProfileRef = doc(db, 'users', currentUser.uid);
      await setDoc(userProfileRef, {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Save data hub
      const dataRef = doc(db, 'users', currentUser.uid, 'data', 'hub');
      await setDoc(dataRef, bundle, { merge: true });

      const syncTime = Date.now();
      setLastSyncedAt(syncTime);
      localStorage.setItem('app_last_cloud_sync', syncTime.toString());
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error saving data to Firestore:', err);
      setSyncStatus('error');
    }
  }, [user]);

  // Listen to Auth State Changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
        setUser(currUser);
        setLoading(false);

        if (currUser) {
          // Sync cloud data on user login
          await fetchDataFromCloud(currUser);
        } else {
          setSyncStatus('idle');
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Auth state listener error:', err);
      setLoading(false);
    }
  }, [fetchDataFromCloud]);

  // Listen to global app_data_updated events to auto-sync to cloud when logged in
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleLocalDataChange = () => {
      if (!user) return;
      setSyncStatus('syncing');
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        saveDataToCloud();
      }, 1500);
    };

    window.addEventListener('app_data_changed', handleLocalDataChange);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('app_data_changed', handleLocalDataChange);
    };
  }, [user, saveDataToCloud]);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Layanan autentikasi belum siap.');
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchDataFromCloud(result.user);
      }
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error('Layanan autentikasi belum siap.');
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await fetchDataFromCloud(result.user);
      }
    } catch (error: any) {
      console.error('Email Sign-in Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) {
      throw new Error('Layanan autentikasi belum siap.');
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        if (name.trim()) {
          await updateProfile(result.user, { displayName: name.trim() });
        }
        await saveDataToCloud(result.user);
      }
    } catch (error: any) {
      console.error('Email Sign-up Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setSyncStatus('idle');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      syncStatus,
      lastSyncedAt,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      saveDataToCloud,
      fetchDataFromCloud
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
