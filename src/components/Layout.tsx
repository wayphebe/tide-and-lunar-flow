
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
