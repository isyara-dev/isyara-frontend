import React from "react";

function HintView({ isLoading, currentLetter, currentHint }) {
  return (
    <div className="flex flex-col justify-center items-center rounded-xl h-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
          <p>Memuat petunjuk...</p>
        </div>
      ) : currentHint ? (
        <>
          <div className="text-sm mb-4 bg-blue-600 px-3 py-1.5 rounded-full font-medium">
            Huruf: {currentLetter}
          </div>

          {/* Lingkaran dengan gradient dan shadow */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-500/40 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-6">
            <img
              src={currentHint.image_url}
              alt={currentHint.description}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            />
          </div>

          <div className="bg-blue-800/50 backdrop-blur-sm px-6 py-3 rounded-xl max-w-xs">
            <p className="text-lg text-center">{currentHint.description}</p>
          </div>
        </>
      ) : (
        <p>Petunjuk tidak tersedia</p>
      )}
    </div>
  );
}

export default HintView;
