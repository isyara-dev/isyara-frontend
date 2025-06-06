import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import SubmoduleList from "../components/learning/SubmoduleList";

// SubmoduleCard Component
const SubmoduleCard = ({ letter, status, imageUrl, onClick }) => {
  const isCompleted = status === true;

  return (
    <div
      className="rounded-xl p-4 md:p-6 shadow-md bg-primary cursor-pointer"
      onClick={onClick}
    >
      {/* Hand Image */}
      <div className="mb-3 md:mb-4 flex justify-center">
        {imageUrl ? (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-gradient-to-br from-cyan-400 to-green-500 flex items-center justify-center relative overflow-hidden">
            <img
              src={imageUrl}
              alt={`Huruf ${letter}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-12 md:h-12">
              <path
                d="M30 70 L30 45 Q30 40 35 40 Q40 40 40 45 L40 35 Q40 30 45 30 Q50 30 50 35 L50 25 Q50 20 55 20 Q60 20 60 25 L60 30 L65 30 Q70 30 70 35 L70 60 Q70 75 55 75 L35 75 Q30 75 30 70 Z"
                fill="#4ade80"
                className="drop-shadow-sm"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-2 md:mb-3">
        <div className="w-full bg-green-900/20 rounded-full h-1.5 md:h-2">
          <div
            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-500 w-full"
                : "bg-gradient-to-r from-green-300 to-green-400 w-1/4"
            }`}
          />
        </div>
      </div>

      {/* Status and Letter */}
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <span
          className={`text-xs md:text-sm font-medium ${
            isCompleted ? "text-green-300" : "text-green-200/70"
          }`}
        >
          {isCompleted ? "Selesai" : "Belum Selesai"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl md:text-2xl font-bold text-white">
          {letter}
        </span>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5"
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

const BelajarView = ({
  activeModuleId,
  modules,
  submodules,
  isLoadingModules,
  isLoadingSubmodules,
  error,
  getProgressPercentage,
  handleModuleClick,
  handleBackToModules,
  handleSubmoduleClick,
  handleChallengeClick,
}) => {
  // Dapatkan judul modul aktif jika ada
  const activeModuleTitle =
    modules.find((m) => m.module_id === activeModuleId)?.description ||
    "Huruf-huruf";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      {/* Sidebar - akan otomatis responsif berdasarkan implementasi Sidebar.jsx */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col pb-16 md:pb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-xs md:text-sm text-green-200 mb-4 md:mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-green-100">Belajar</span>
          {activeModuleId && (
            <>
              <span className="mx-2">/</span>
              <span className="font-medium text-green-100">
                Modul {activeModuleId}
              </span>
            </>
          )}
        </div>

        {/* Page Header */}
        <header className="mb-6 md:mb-8">
          {activeModuleId ? (
            <div className="flex flex-col items-start">
              <Button
                variant="text"
                onClick={handleBackToModules}
                className="mr-3 md:mr-4 items-center hover:cursor-pointer py-2 px-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2"
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
              </Button>
              <h1 className="text-xl md:text-2xl px-3 font-bold text-white">
                {modules.find((m) => m.module_id === activeModuleId)
                  ?.module_name || `Modul ${activeModuleId}`}
              </h1>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-white">
                Belajar Rangkai Kata
              </h1>
              <p className="text-base md:text-lg text-green-200">
                Pilih modul dan mulai tantangan!
              </p>
            </>
          )}
        </header>

        {/* Main Content Grid */}
        {!activeModuleId ? (
          // Tampilan Modul
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 flex-grow">
            {/* Left Section - Module Groups */}
            <div className="lg:col-span-3 rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white">
                Modul Pembelajaran
              </h2>

              {isLoadingModules ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-300"></div>
                </div>
              ) : error ? (
                <div className="text-red-300 text-center py-4">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {modules.map((module) => (
                    <div
                      key={module.module_id}
                      className={`rounded-lg p-3 md:p-4 cursor-pointer shadow-md bg-secondary ${
                        activeModuleId === module.module_id
                          ? "ring-2 ring-green-400"
                          : ""
                      }`}
                      onClick={() => handleModuleClick(module.module_id)}
                    >
                      <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center text-white">
                        {module.module_name}
                      </h3>
                      <p className="text-xs md:text-sm text-green-200 mb-2 md:mb-3 text-center tracking-wider">
                        {module.description}
                      </p>
                      <div className="bg-green-900/20 h-1.5 md:h-2 rounded-full mb-2 md:mb-3">
                        <div
                          className="bg-green-500 h-1.5 md:h-2 rounded-full"
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
                          <span className="text-xs text-green-300 block">
                            Completed
                          </span>
                          <span className="text-base md:text-lg font-bold text-white">
                            {module.completed}/{module.total}
                          </span>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-colors">
                          <span className="text-white text-xs md:text-sm">
                            ▶
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section - Challenge Section */}
            <div className="rounded-xl p-4 md:p-6 shadow-md bg-primary flex flex-col">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center text-white">
                    BELAJAR RANGKAI KATA
                  </h3>
                  <p className="text-green-300 text-center mb-6 md:mb-8 text-xs md:text-sm">
                    Rangkai kata dan dapatkan point!
                  </p>
                  <div className="bg-green-900/20 h-1.5 md:h-2 rounded-full mb-3 md:mb-4">
                    <div
                      className="bg-green-500 h-1.5 md:h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="play"
                    fullWidth
                    onClick={handleChallengeClick}
                  >
                    Mulai Tantangan!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tampilan Submodul - menggunakan komponen SubmoduleList
          <SubmoduleList
            moduleTitle={activeModuleTitle}
            submodules={submodules}
            isLoading={isLoadingSubmodules}
            error={error}
            onSubmoduleClick={handleSubmoduleClick}
          />
        )}
      </main>
    </div>
  );
};

export default BelajarView;
