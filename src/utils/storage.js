import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";

export const APP_MODE_KEY = "note_app_mode";

const DATA_KEY_PREFIX = "note_app";
const GUEST_SCOPE = "guest";
const DATA_TYPES = ["notes", "todos", "images"];

export const setAppMode = (mode) => {
  localStorage.setItem(APP_MODE_KEY, mode);
};

export const getAppMode = () => {
  return localStorage.getItem(APP_MODE_KEY);
};

export const clearAppMode = () => {
  localStorage.removeItem(APP_MODE_KEY);
};

export const getGuestStorageKey = (dataType) => {
  return `${DATA_KEY_PREFIX}_${GUEST_SCOPE}_${dataType}`;
};

export const getUserStorageKey = (uid, dataType) => {
  return `${DATA_KEY_PREFIX}_user_${uid}_${dataType}`;
};

export const getLegacyStorageKey = (dataType) => {
  const legacyKeys = {
    notes: "note_data",
    todos: "todolist_data",
    images: "image_data",
  };

  return legacyKeys[dataType];
};

export const clearGuestData = () => {
  DATA_TYPES.forEach((dataType) => {
    localStorage.removeItem(getGuestStorageKey(dataType));
  });
};

export const clearStorageKeys = (keys) => {
  keys.forEach((key) => localStorage.removeItem(key));
};

export const readStorageItems = (key) => {
  const storedData = localStorage.getItem(key);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData);
  } catch {
    return [];
  }
};

export const migrateLegacyData = (legacyKey, scopedKey) => {
  const legacyData = localStorage.getItem(legacyKey);
  const scopedData = localStorage.getItem(scopedKey);

  if (legacyData && !scopedData) {
    localStorage.setItem(scopedKey, legacyData);
  }
};

export const useScopedStorageKey = (dataType) => {
  const location = useLocation();
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const isGuestRoute = location.pathname.startsWith("/guest");

  return useMemo(() => {
    if (isGuestRoute) {
      return {
        key: getGuestStorageKey(dataType),
        isReady: true,
        mode: "guest",
        user: null,
      };
    }

    if (!isAuthReady) {
      return {
        key: null,
        isReady: false,
        mode: "user",
        user: null,
      };
    }

    if (!user) {
      return {
        key: null,
        isReady: false,
        mode: "user",
        user: null,
      };
    }

    return {
      key: getUserStorageKey(user.uid, dataType),
      isReady: true,
      mode: "user",
      user,
    };
  }, [dataType, isAuthReady, isGuestRoute, user]);
};
