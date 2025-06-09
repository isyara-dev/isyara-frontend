import React from "react";
import HandGestureDetector from "../components/gesture/HandGestureDetector";
import GestureStatusDisplay from "../components/gesture/GestureStatusDisplay";
import SuccessOverlay from "../components/common/SuccessOverlay";
import HintView from "./HintView";
import Button from "../components/ui/Button";

function PracticeView({
  practiceModel,
  gestureModel,
  onGestureDetected,
  onBackClick,
  onNextClick,
  onPrevClick,
}) {
  const {
    currentSubModule,
    currentLetter,
    currentHint,
    isLoading,
    moduleId,
    allSubModules,
    moduleName,
    isNavigating,
  } = practiceModel;

  const {
    correctGesture,
    incorrectGesture,
    detectedGesture,
    gestureConfidence,
    isCorrectGesture,
    isIncorrectGesture,
    gestureDetectionProgress,
    showSuccessMessage,
    gameState,
    GAME_STATES,
  } = gestureModel;

  // Cek apakah ini submodul pertama
  const isFirstSubModule =
    currentSubModule && allSubModules?.length > 0
      ? currentSubModule.id === allSubModules[0].id
      : true;

  // Cek apakah ini submodul terakhir
  const isLastSubModule =
    currentSubModule && allSubModules?.length > 0
      ? currentSubModule.id === allSubModules[allSubModules.length - 1].id
      : false;

  // Status selesai
  const isCompleted =
    gameState === GAME_STATES.COMPLETED || currentSubModule?.is_completed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header dengan back button dan status */}
      <header className="flex justify-between items-center p-4 bg-accent">
        {/* Back button (left) */}
        <Button
          onClick={onBackClick}
          variant="text"
          className="flex items-center gap-2 px-3 py-2 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline">Kembali</span>
        </Button>

        {/* Title (center) - Diubah menjadi Nama Modul : Nama Submodul */}
        <div className="text-center">
          <div className="text-lg font-bold sm:text-xl">
            {/* Tampilkan nama modul saja di mobile */}
            <span className="sm:hidden">{moduleName || "Modul"}</span>

            {/* Tampilkan nama modul dan submodul di desktop */}
            <span className="hidden sm:inline">
              {moduleName || "Modul"}: Huruf {currentLetter}
            </span>
          </div>
        </div>

        {/* Status (right) - Pindah dari footer */}
        <div
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium 
          ${
            isCompleted
              ? "border-2 border-green-600"
              : "border-2 border-purple-2"
          }`}
        >
          {isCompleted ? "Selesai" : "Belum Selesai"}
        </div>
      </header>

      {/* Main content - responsive layout */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden relative">
        {/* Camera (left) */}
        <div
          className={`flex justify-center items-center bg-purple-700 rounded-xl h-full relative transition-all duration-200
            ${incorrectGesture ? "border-4 border-red-500" : ""}
            ${correctGesture ? "border-4 border-green-500" : ""}`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300 mb-4"></div>
              <p>Memuat kamera...</p>
            </div>
          ) : (
            <>
              <HandGestureDetector
                key="persistent-gesture-detector"
                onGestureDetected={onGestureDetected}
                showDebugInfo={false}
                active={!showSuccessMessage}
              />

              <GestureStatusDisplay
                detectedGesture={detectedGesture}
                gestureConfidence={gestureConfidence}
                isCorrectGesture={isCorrectGesture}
                isIncorrectGesture={isIncorrectGesture}
                gestureDetectionProgress={gestureDetectionProgress}
              />

              <SuccessOverlay
                show={showSuccessMessage}
                message={`Huruf ${currentLetter} dikuasai`}
              />
            </>
          )}

          {/* Floating Hint Panel (top right corner) - HANYA UNTUK MOBILE */}
          {!isLoading && currentHint && (
            <div className="absolute top-4 right-4 max-w-[120px] z-10 md:hidden">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
                {/* Background lingkaran dengan gradient untuk gambar */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    {isNavigating ? (
                      <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <img
                        src={currentHint.image_url}
                        alt={currentHint.description}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hint image (right) - HANYA UNTUK DESKTOP */}
        <div className="hidden md:block">
          {isNavigating ? (
            <div className="flex flex-col justify-center items-center rounded-xl h-full">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
                <p>Memuat petunjuk...</p>
              </div>
            </div>
          ) : (
            <HintView
              isLoading={isLoading}
              currentLetter={currentLetter}
              currentHint={currentHint}
            />
          )}
        </div>
      </main>

      {/* Footer dengan tombol navigasi */}
      <footer className="p-4">
        <div className="bg-gradient-to-r from-purple-2 via-dark-purple to-purple-2 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Tombol Sebelumnya (kiri) - sembunyikan jika submodul pertama */}
            {!isFirstSubModule ? (
              <button
                onClick={onPrevClick}
                disabled={isNavigating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors bg-green-600 hover:bg-green-500 disabled:opacity-70"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>
            ) : (
              <div className="w-10 sm:w-32"></div>
            )}

            {/* Current letter (center) */}
            <div className="text-4xl font-bold relative">
              {isNavigating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              ) : null}
              <span className={isNavigating ? "opacity-30" : ""}>
                {currentLetter}
              </span>
            </div>

            {/* Tombol Lanjut/Home (kanan) */}
            <button
              onClick={onNextClick}
              disabled={isNavigating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors bg-green-600 hover:bg-green-500 disabled:opacity-70"
            >
              {isLastSubModule ? (
                <>
                  <span className="hidden sm:inline">Beranda</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Lanjut</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PracticeView;
