import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setAppMode } from "../utils/storage";

export default function GuestRoute() {
  useEffect(() => {
    setAppMode("guest");
  }, []);

  return <Outlet />;
}
