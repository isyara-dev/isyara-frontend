import React from "react";
import Sidebar from "../../../../common/components/layout/Sidebar";

// SubmoduleCard Component
const SubmoduleCard = ({ letter, status, imageUrl, onClick }) => {
  const isCompleted = status === true;

  return (
    <div
      className="rounded-xl p-4 md:p-6 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-200 hover:transform hover:scale-105 cursor-pointer shadow-lg"
      onClick={onClick}
    >
      {/* Hand Image */}
      <div className="mb-3 md:mb-4 flex justify-center">
        {imageUrl ? (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-green-500 flex items-center justify-center relative overflow-hidden">
            <img
              src={imageUrl}
              alt={`Huruf ${letter}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
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
        <button className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg">
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-white"
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

const SubmoduleView = ({
  moduleTitle,
  submodules,
  isLoading,
  error,
  handleBackClick,
  handleSubmoduleClick,
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      {/* Sidebar - akan otomatis responsif berdasarkan implementasi Sidebar.jsx */}
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pb-16 md:pb-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-4 md:mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-green-200 hover:text-white transition-colors mr-4 md:mr-6 bg-green-800/30 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-green-700/30"
            aria-label="Kembali ke halaman belajar"
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
          </button>
        </div>

        {/* Module Header */}
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
            {moduleTitle}
          </h1>
        </header>

        {/* Module Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-300"></div>
            </div>
          ) : error ? (
            <div className="text-red-300 text-center py-4">{error}</div>
          ) : submodules.length === 0 ? (
            <div className="text-center py-8 text-white">
              Tidak ada submodul yang tersedia
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
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
};

export default SubmoduleView;
