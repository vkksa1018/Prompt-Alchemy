import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import Footer from "../components/Footer/footer";

export default function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
