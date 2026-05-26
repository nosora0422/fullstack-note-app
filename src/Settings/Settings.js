import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import {
  clearAppMode,
  clearGuestData,
  clearStorageKeys,
  getAppMode,
  getGuestStorageKey,
  getUserStorageKey,
} from "../utils/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Footer from "../shared/Footer/Footer";

const DATA_TYPES = [
  { label: "Notes", type: "notes" },
  { label: "To-do lists", type: "todos" },
  { label: "Images", type: "images" },
];

export default function Settings() {
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();
  const appMode = getAppMode();
  const isGuest = appMode === "guest";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isGuest && !isAuthReady) {
    return null;
  }

  if (!isGuest && !user) {
    return <Navigate to="/login" replace />;
  }

  const getCurrentKey = (dataType) => {
    if (isGuest) {
      return getGuestStorageKey(dataType);
    }

    return getUserStorageKey(user.uid, dataType);
  };

  const clearDataType = (dataType) => {
    localStorage.removeItem(getCurrentKey(dataType));
    window.location.reload();
  };

  const clearAllCurrentData = () => {
    const keys = DATA_TYPES.map(({ type }) => getCurrentKey(type));
    clearStorageKeys(keys);
    window.location.reload();
  };

  const logout = async () => {
    if (isGuest) {
      clearGuestData();
      clearAppMode();
      navigate("/login");
      return;
    }

    await signOut(auth);
    clearAppMode();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="w-full mx-auto mt-8 lg:mt-11">
        <h1 className="text-3xl my-4">Settings</h1>
        <div className="w-full rounded-md">
          <div className="mb-8">
            <p>{isGuest ? "Guest mode" : user.email}</p>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-3">
            {DATA_TYPES.map(({ label, type }) => (
              <button
                type="button"
                className="button button-secondary w-full"
                key={type}
                onClick={() => clearDataType(type)}
              >
                Clear {label}
              </button>
            ))}
            <button
              type="button"
              className="button button-primary w-full"
              onClick={clearAllCurrentData}
            >
              Clear All Saved Data
            </button>
            <button
              type="button"
              className="button button-tertiary w-full"
              onClick={logout}
            >
              <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
