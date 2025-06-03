import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api/apiClient";

// SubmoduleCard Component
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
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white ml-0.5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function BelajarPage() {
  const navigate = useNavigate();
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isLoadingSubmodules, setIsLoadingSubmodules] = useState(false);
  const [error, setError] = useState(null);

  // Default language ID adalah 1 (Bisindo)
  const languageId = 1;

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const response = await apiClient.get(`/progress/module/${languageId}`);
        setModules(response || []);
      } catch (err) {
        console.error("Gagal mengambil data modul:", err);
        setError("Gagal memuat data modul");
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, [languageId]);

  // Fetch submodules when a module is selected
  useEffect(() => {
    const fetchSubmodules = async () => {
      if (!activeModuleId) return;

      try {
        setIsLoadingSubmodules(true);
        const response = await apiClient.get("/progress/sub");

        // Filter submodules berdasarkan module_id yang aktif
        const filteredSubmodules = response.filter(
          (submodule) => submodule.module_id === parseInt(activeModuleId)
        );

        // Sort by order_index
        filteredSubmodules.sort((a, b) => a.order_index - b.order_index);
        setSubmodules(filteredSubmodules);
      } catch (err) {
        console.error("Gagal mengambil data submodul:", err);
        setError("Gagal memuat data submodul");
      } finally {
        setIsLoadingSubmodules(false);
      }
    };

    fetchSubmodules();
  }, [activeModuleId]);

  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleModuleClick = (moduleId) => {
    setActiveModuleId(moduleId);
  };

  const handleSubmoduleClick = (submodule) => {
    navigate(`/praktek/${submodule.id}`);
  };

  const handleBackToModules = () => {
    setActiveModuleId(null);
    setSubmodules([]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-100">Belajar</span>
          {activeModuleId && (
            <>
              <span className="mx-2">/</span>
              <span className="font-medium text-blue-100">
                Modul {activeModuleId}
              </span>
            </>
          )}
        </div>

        {/* Page Header */}
        <header className="mb-8">
          {activeModuleId ? (
            <div className="flex items-center">
              <button
                onClick={handleBackToModules}
                className="flex items-center text-blue-200 hover:text-white transition-colors mr-6 bg-purple-800/30 px-4 py-2 rounded-lg hover:bg-purple-700/30"
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
              <h1 className="text-3xl font-bold">
                {modules.find((m) => m.module_id === activeModuleId)
                  ?.module_name || `Modul ${activeModuleId}`}
              </h1>
            </div>
          ) : (
            <h1 className="text-4xl font-bold mb-2">Belajar Rangkai Kata</h1>
          )}
          {!activeModuleId && (
            <p className="text-lg text-blue-200">
              Pilih modul dan mulai tantangan!
            </p>
          )}
        </header>

        {/* Main Content Grid */}
        {!activeModuleId ? (
          // Tampilan Modul
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
            {/* Left Section - Module Groups */}
            <div className="lg:col-span-3 bg-blue-800/30 rounded-xl p-6 border border-blue-600/50">
              <h2 className="text-xl font-semibold mb-6">Modul Pembelajaran</h2>

              {isLoadingModules ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
                </div>
              ) : error ? (
                <div className="text-red-300 text-center py-4">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modules.map((module) => (
                    <div
                      key={module.module_id}
                      className={`bg-blue-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-blue-600 ${
                        activeModuleId === module.module_id
                          ? "ring-2 ring-yellow-400"
                          : ""
                      }`}
                      onClick={() => handleModuleClick(module.module_id)}
                    >
                      <h3 className="text-lg font-bold mb-3 text-center">
                        {module.module_name}
                      </h3>
                      <p className="text-sm text-blue-200 mb-3 text-center tracking-wider">
                        {module.description}
                      </p>
                      <div className="bg-blue-600 h-2 rounded-full mb-3">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${getProgressPercentage(
                              module.completed,
                              module.total
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-blue-300 block">
                            Completed
                          </span>
                          <span className="text-lg font-bold">
                            {module.completed}/{module.total}
                          </span>
                        </div>
                        <button className="bg-black hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                          <span className="text-white text-sm">▶</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section - Challenge Section */}
            <div className="bg-blue-800 rounded-xl p-6 border border-blue-600/50 flex flex-col ">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-center">
                    BELAJAR RANGKAI KATA
                  </h3>
                  <p className="text-blue-300 text-center mb-8 text-sm">
                    Rangkai kata dan dapatkan point!
                  </p>
                  <div className="bg-blue-700 h-2 rounded-full mb-4">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full"
                    onClick={() => navigate("/susun-kata")}
                  >
                    Mulai Tantangan!
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tampilan Submodul
          <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-600/50">
            <h2 className="text-xl font-semibold mb-6">
              {modules.find((m) => m.module_id === activeModuleId)
                ?.description || "Huruf-huruf"}
            </h2>

            {isLoadingSubmodules ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
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
        )}
      </main>
    </div>
  );
}
