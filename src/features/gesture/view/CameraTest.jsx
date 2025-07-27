// src/features/gesture/views/CameraUITestView.jsx
import React, { useState } from "react";
import HandGestureDetector from "../components/HandGestureDetector";
import GestureStatusDisplay from "../components/GestureStatusDisplay";
import SuccessOverlay from "../../../common/components/shared/SuccessOverlay";
import HintView from "../../belajar/core/components/HintView";
import Button from "../../../common/components/ui/Button";

// Dummy data untuk testing
const DUMMY_MODULE = {
  id: "test-module",
  name: "Modul Test",
  subModules: [
    { id: "sub1", letter: "A", is_completed: false },
    { id: "sub2", letter: "B", is_completed: false },
    { id: "sub3", letter: "C", is_completed: true },
    { id: "sub4", letter: "D", is_completed: false },
  ],
};

const DUMMY_HINTS = {
  A: {
    image_url: "https://placehold.co/100x100?text=A",
    description: "Huruf A",
  },
  B: {
    image_url: "https://placehold.co/100x100?text=B",
    description: "Huruf B",
  },
  C: {
    image_url: "https://placehold.co/100x100?text=C",
    description: "Huruf C",
  },
  D: {
    image_url: "https://placehold.co/100x100?text=D",
    description: "Huruf D",
  },
};

const GAME_STATES = {
  PLAYING: "PLAYING",
  COMPLETED: "COMPLETED",
};

export default function CameraUITestView() {
  // State untuk simulasi data
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Dummy data berdasarkan current index
  const currentSubModule = DUMMY_MODULE.subModules[currentIndex];
  const currentLetter = currentSubModule?.letter || "A";
  const currentHint = DUMMY_HINTS[currentLetter];

  // Handler gesture
  const handleGestureDetected = (gesture, confidence) => {
    setDetectedGesture(gesture);
    setGestureConfidence(confidence);

    // Simulasi success overlay
    if (gesture === currentLetter && confidence > 0.8) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }
  };

  // Navigation handlers
  const handleBackClick = () => {
    console.log("Back clicked");
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setIsNavigating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDetectedGesture(null);
        setGestureConfidence(0);
        setIsNavigating(false);
      }, 500);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < DUMMY_MODULE.subModules.length - 1) {
      setIsNavigating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDetectedGesture(null);
        setGestureConfidence(0);
        setIsNavigating(false);
      }, 500);
    } else {
      console.log("Navigate to home");
    }
  };

  // Computed values
  const isFirstSubModule = currentIndex === 0;
  const isLastSubModule = currentIndex === DUMMY_MODULE.subModules.length - 1;
  const isCompleted = currentSubModule?.is_completed || false;

  // Gesture model
  const gestureModel = {
    correctGesture: detectedGesture === currentLetter,
    incorrectGesture: detectedGesture && detectedGesture !== currentLetter,
    detectedGesture,
    gestureConfidence,
    isCorrectGesture: detectedGesture === currentLetter,
    isIncorrectGesture: detectedGesture && detectedGesture !== currentLetter,
    gestureDetectionProgress: gestureConfidence,
    showSuccessMessage,
    gameState: GAME_STATES.PLAYING,
    GAME_STATES,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header dengan back button dan status */}
      <header className="flex justify-between items-center p-4 bg-accent">
        {/* Back button (left) */}
        <Button
          onClick={handleBackClick}
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
            <span className="sm:hidden">{DUMMY_MODULE.name}</span>

            {/* Tampilkan nama modul dan submodul di desktop */}
            <span className="hidden sm:inline">
              {DUMMY_MODULE.name}: Huruf {currentLetter}
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
            ${gestureModel.incorrectGesture ? "border-4 border-red-500" : ""}
            ${gestureModel.correctGesture ? "border-4 border-green-500" : ""}`}
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
                onGestureDetected={handleGestureDetected}
                showDebugInfo={false}
                active={!showSuccessMessage}
              />

              <GestureStatusDisplay
                detectedGesture={detectedGesture}
                gestureConfidence={gestureConfidence}
                isCorrectGesture={gestureModel.isCorrectGesture}
                isIncorrectGesture={gestureModel.isIncorrectGesture}
                gestureDetectionProgress={gestureConfidence}
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
                onClick={handlePrevClick}
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
              onClick={handleNextClick}
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
