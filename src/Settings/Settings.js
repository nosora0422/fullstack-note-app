import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import {
  clearAppMode,
  clearGuestData,
  getAppMode,
  getGuestStorageKey,
} from "../utils/storage";
import { deleteAllUserItems, deleteUserItems } from "../services/firestoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Footer from "../shared/Footer/Footer";
import ConfirmationModal from "../Components/ConfirmationModal/ConfirmationModal";

const DATA_TYPES = [
  { label: "Notes", type: "notes" },
  { label: "To-do lists", type: "todos" },
  { label: "Images", type: "images" },
];

export default function Settings() {
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [pendingClearAction, setPendingClearAction] = useState(null);
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

  const clearDataType = async (dataType) => {
    if (isGuest) {
      localStorage.removeItem(getGuestStorageKey(dataType));
      window.location.reload();
      return;
    }

    await deleteUserItems(user.uid, dataType);
    window.location.reload();
  };

  const clearAllCurrentData = async () => {
    if (isGuest) {
      clearGuestData();
      window.location.reload();
      return;
    }

    await deleteAllUserItems(user.uid, DATA_TYPES.map(({ type }) => type));
    window.location.reload();
  };

  const confirmClearData = async () => {
    if (!pendingClearAction) {
      return;
    }

    if (pendingClearAction.type === "all") {
      await clearAllCurrentData();
      return;
    }

    await clearDataType(pendingClearAction.type);
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
                onClick={() => setPendingClearAction({ type, label })}
              >
                Clear {label}
              </button>
            ))}
            <button
              type="button"
              className="button button-primary w-full"
              onClick={() => setPendingClearAction({ type: "all", label: "all saved data" })}
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
      <ConfirmationModal
        isOpen={Boolean(pendingClearAction)}
        title="Clear Data"
        message={`Are you sure you want to clear ${pendingClearAction?.label || "this data"}? This cannot be undone.`}
        confirmLabel="Clear"
        onConfirm={confirmClearData}
        onCancel={() => setPendingClearAction(null)}
      />
      <Footer />
    </div>
  );
}
