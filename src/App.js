import './dist/output.css'
import { useEffect } from "react";
import Header from "./shared/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import { clearGuestData, getAppMode } from "./utils/storage";

function App() {
  const location = useLocation();

  useEffect(() => {
    const isGuest = location.pathname.startsWith("/guest") || getAppMode() === "guest";

    if (!isGuest) {
      return undefined;
    }

    const clearGuestDataOnExit = () => {
      clearGuestData();
    };

    window.addEventListener("beforeunload", clearGuestDataOnExit);

    return () => {
      window.removeEventListener("beforeunload", clearGuestDataOnExit);
    };
  }, [location.pathname]);

  return (
    <div className="mx-auto my-0">
      <div className="my-grid">
        <div className="col-span-12 md:col-span-3 lg:col-span-2 z-10">
          <Header />
        </div>
        <div className="col-span-12  md:col-span-9 lg:col-span-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
