import './dist/output.css'
import Header from "./shared/Header/Header";
import Footer from "./shared/Footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="mx-auto my-0">
      <div className="my-grid">
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Header />
        </div>
        <div className="col-span-12  md:col-span-9 lg:col-span-10">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
