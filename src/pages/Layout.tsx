import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Layout = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/admin";

  return (
    <div className="min-h-screen">
      <Outlet />
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default Layout;
