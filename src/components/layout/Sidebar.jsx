import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    { id: "belajar", label: "BELAJAR", path: "/belajar" },
    { id: "peringkat", label: "PAPAN SKOR", path: "/peringkat" },
    { id: "dashboard", label: "DASHBOARD", path: "/dashboard" },
    { id: "pengaturan", label: "PENGATURAN", path: "/profile" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-950 to-purple-900 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 pb-8 border-b border-blue-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
            ISYARA
          </h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col flex-grow p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              text-left py-3 px-4 my-1 rounded-lg transition-all
              ${
                isActive
                  ? "bg-yellow-500 text-blue-900 font-semibold shadow-md"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }
            `}
          >
            {item.label}
          </NavLink>
        ))}

        {/* Tombol Keluar */}
        <button
          onClick={handleLogout}
          className="text-left py-3 px-4 my-1 rounded-lg transition-all text-blue-100 hover:bg-blue-800 hover:text-white"
        >
          KELUAR
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-blue-800 text-xs text-blue-300 flex justify-between items-center">
        <p>ISYARA</p>
        <p className="text-yellow-300">dicoding</p>
      </div>
    </div>
  );
}
