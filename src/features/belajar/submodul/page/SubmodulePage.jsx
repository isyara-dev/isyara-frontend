import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../../common/components/layout/Sidebar";
import apiClient from "../../../../services/api/apiClient";

// Sidebar Component (Fallback jika import gagal)
const SidebarFallback = () => {
  return (
    <aside className="w-48 bg-purple-800/50 backdrop-blur-sm border-r border-purple-600/30 p-4 hidden lg:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">dicoding</h2>
      </div>
      <nav className="space-y-2">
        <div className="px-4 py-2 bg-purple-700/50 rounded-lg">
          <span className="text-white font-medium">BELAJAR</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PAPAN SKOR</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PROFILE</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PENGATURAN</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">KELUAR</span>
        </div>
      </nav>
    </aside>
  );
};

// Module Card Component
const SubmoduleCard = ({ letter, status, imageUrl, onClick }) => {
  const isCompleted = status === true;

  return (
    <div
      className="bg-gradient-to-br from-purple-600/40 to-purple-800/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {/* Hand Image */}
      <div className="mb-4 flex justify-center">
        {imageUrl ? (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center relative overflow-hidden">
            <img
              src={imageUrl}
              alt={`Huruf ${letter}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <path
                d="M30 70 L30 45 Q30 40 35 40 Q40 40 40 45 L40 35 Q40 30 45 30 Q50 30 50 35 L50 25 Q50 20 55 20 Q60 20 60 25 L60 30 L65 30 Q70 30 70 35 L70 60 Q70 75 55 75 L35 75 Q30 75 30 70 Z"
                fill="#ff9a9e"
                className="drop-shadow-sm"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-purple-900/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-500 w-full"
                : "bg-gradient-to-r from-purple-400 to-purple-500 w-1/4"
            }`}
          />
        </div>
      </div>

      {/* Status and Letter */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm font-medium ${
            isCompleted ? "text-green-300" : "text-purple-300"
          }`}
        >
          {isCompleted ? "Selesai" : "Belum Selesai"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{letter}</span>
        <button className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function SubmodulePage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [submodules, setSubmodules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");

  useEffect(() => {
    const fetchSubmodules = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/progress/sub");

        // Filter submodules berdasarkan module_id dari parameter URL
        const filteredSubmodules = response.filter(
          (submodule) => submodule.module_id === parseInt(moduleId)
        );

        setSubmodules(filteredSubmodules);

        // Set judul modul berdasarkan data pertama (jika ada)
        if (filteredSubmodules.length > 0) {
          setModuleTitle(
            `Modul ${moduleId}: ${filteredSubmodules
              .map((s) => s.name)
              .join(", ")}`
          );
        } else {
          setModuleTitle(`Modul ${moduleId}`);
        }
      } catch (err) {
        console.error("Gagal mengambil data submodul:", err);
        setError("Gagal memuat data submodul");
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      fetchSubmodules();
    }
  }, [moduleId]);

  const handleBackClick = () => {
    navigate("/belajar");
  };

  const handleSubmoduleClick = (submodule) => {
    // Simpan moduleId di localStorage sebelum navigasi
    localStorage.setItem("activeModuleId", moduleId);
    navigate(`/praktek/${submodule.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-200 hover:text-white transition-colors mr-6 bg-purple-800/30 px-4 py-2 rounded-lg hover:bg-purple-700/30"
            aria-label="Kembali ke halaman belajar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali
          </button>
        </div>

        {/* Module Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {moduleTitle}
          </h1>
        </header>

        {/* Module Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300"></div>
            </div>
          ) : error ? (
            <div className="text-red-300 text-center py-4">{error}</div>
          ) : submodules.length === 0 ? (
            <div className="text-center py-8">
              Tidak ada submodul yang tersedia
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {submodules.map((submodule) => (
                <SubmoduleCard
                  key={submodule.id}
                  letter={submodule.name}
                  status={submodule.is_completed}
                  imageUrl={submodule.image_url}
                  onClick={() => handleSubmoduleClick(submodule)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
