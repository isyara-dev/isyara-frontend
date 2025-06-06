import React from "react";

// SubmoduleCard Component
const SubmoduleCard = ({ letter, status, imageUrl, onClick }) => {
  const isCompleted = status === true;

  return (
    <div
      className="rounded-xl p-4 md:p-6 shadow-md bg-secondary cursor-pointer"
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

const SubmoduleList = ({
  moduleTitle,
  submodules,
  isLoading,
  error,
  onSubmoduleClick,
}) => {
  return (
    <div className="rounded-xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white">
        {moduleTitle || "Huruf-huruf"}
      </h2>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {submodules.map((submodule) => (
            <SubmoduleCard
              key={submodule.id}
              letter={submodule.name}
              status={submodule.is_completed}
              imageUrl={submodule.image_url}
              onClick={() => onSubmoduleClick(submodule)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmoduleList;
export { SubmoduleCard }; // Export juga komponen card agar bisa digunakan di tempat lain jika diperlukan
