import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Book, Trophy, LayoutDashboard, Settings, LogOut } from "lucide-react";
import Button from "../ui/Button";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar saat komponen dimuat dan saat resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      id: "belajar",
      label: "BELAJAR",
      path: "/belajar",
      icon: <Book size={isMobile ? 24 : 20} />,
    },
    {
      id: "peringkat",
      label: "PAPAN SKOR",
      path: "/peringkat",
      icon: <Trophy size={isMobile ? 24 : 20} />,
    },
    {
      id: "dashboard",
      label: "DASHBOARD",
      path: "/dashboard",
      icon: <LayoutDashboard size={isMobile ? 24 : 20} />,
    },
    {
      id: "pengaturan",
      label: "PENGATURAN",
      path: "/profile",
      icon: <Settings size={isMobile ? 24 : 20} />,
    },
  ];

  // Versi Mobile (Bottom Navigation)
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-secondary flex justify-around items-center p-2 z-50 shadow-lg">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all
                ${
                  isActive
                    ? "border-2 border-purple bg-primary"
                    : "hover:bg-primary"
                }
              `}
            >
              <div className={isActive ? "text-purple" : "text-text-light"}>
                {item.icon}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-purple" : "text-text-light"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    );
  }

  // Versi Desktop (Sidebar)
  return (
    <div className="w-64 bg-background flex flex-col h-screen sticky top-0 border-r border-secondary shadow-xl">
      {/* Logo Section */}
      <div className="p-6 pb-8 border-b border-secondary">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-text-light">ISYARA</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col flex-grow p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`
                text-left py-3 px-4 my-1 rounded-lg transition-all flex items-center gap-3
                ${
                  isActive
                    ? "border-2 border-purple bg-primary"
                    : "hover:bg-primary"
                }
              `}
            >
              <div className={isActive ? "text-purple" : "text-text-light"}>
                {item.icon}
              </div>
              <span className={isActive ? "text-purple" : "text-text-light"}>
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Tombol Keluar */}
        <Button
          onClick={handleLogout}
          variant="text"
          className="my-1 mt-auto flex items-center gap-3"
        >
          <LogOut size={20} />
          <span>KELUAR</span>
        </Button>
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-secondary text-xs text-text-light flex justify-between items-center">
        <p>ISYARA</p>
        <p className="text-secondary">dicoding</p>
      </div>
    </div>
  );
}
