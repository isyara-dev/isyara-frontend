// src/features/gesture/views/CameraUITestView.jsx
import React, { useState } from "react";
import HandGestureDetector from "../components/HandGestureDetector";
import GestureStatusDisplay from "../components/GestureStatusDisplay";
import SuccessOverlay from "../../../common/components/shared/SuccessOverlay";
import HintView from "../../belajar/core/components/HintView";
import WordDisplayView from "../../tantangan/views/WordDisplayView";
import ScoreView from "../../tantangan/views/ScoreView";
import Button from "../../../common/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";

const DUMMY_LETTERS = ["A", "B", "C", "D"];
const DUMMY_HINT = {
  image_url: "https://placehold.co/100x100?text=Hint",
  description: "Contoh gambar hint",
};

export default function CameraUITestView() {
  // State dummy
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [gestureConfidence, setGestureConfidence] = useState(0);

  // Handler gesture
  const handleGestureDetected = (gesture, confidence) => {
    setDetectedGesture(gesture);
    setGestureConfidence(confidence);
  };

  // Dummy progressModel
  const progressModel = {
    correctGesture: detectedGesture === DUMMY_LETTERS[currentIndex],
    incorrectGesture:
      detectedGesture && detectedGesture !== DUMMY_LETTERS[currentIndex],
    detectedGesture,
    gestureConfidence,
    isCorrectGesture: detectedGesture === DUMMY_LETTERS[currentIndex],
    isIncorrectGesture:
      detectedGesture && detectedGesture !== DUMMY_LETTERS[currentIndex],
    gestureDetectionProgress: gestureConfidence,
    showSuccessMessage: false,
    gameState: "PLAYING",
    GAME_STATES: { PLAYING: "PLAYING" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-accent">
        <Button
          variant="text"
          className="flex items-center gap-2 px-2 py-2 rounded"
          disabled
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>
        <div className="hidden sm:block text-center">
          <div className="text-lg font-bold">Test Kamera UI</div>
        </div>
        <ScoreView currentPoints={10} bestScore={20} showBothOnMobile={true} />
      </header>

      {/* Main content */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden relative">
        {/* Camera */}
        <div className="flex justify-center items-center bg-purple-700 rounded-xl h-full relative transition-all duration-200">
          <HandGestureDetector
            onGestureDetected={handleGestureDetected}
            showDebugInfo={true}
            active={true}
          />
          <GestureStatusDisplay
            detectedGesture={detectedGesture}
            gestureConfidence={gestureConfidence}
            isCorrectGesture={progressModel.isCorrectGesture}
            isIncorrectGesture={progressModel.isIncorrectGesture}
            gestureDetectionProgress={gestureConfidence}
          />
          <SuccessOverlay
            show={false}
            message="Berhasil!"
            subMessage="+10 Poin"
          />
          {/* Floating Hint Panel (top right corner) - MOBILE */}
          <div className="absolute top-4 right-4 max-w-[120px] z-10 md:hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <img
                    src={DUMMY_HINT.image_url}
                    alt={DUMMY_HINT.description}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Hint image (right) - DESKTOP */}
        <div className="hidden md:block">
          <HintView
            isLoading={false}
            currentLetter={DUMMY_LETTERS[currentIndex]}
            currentHint={DUMMY_HINT}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4">
        <div className="sm:hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-2 via-secondary to-purple-2 rounded-xl p-4 shadow-lg">
            <div className="flex justify-center w-full mb-4">
              <WordDisplayView
                letters={DUMMY_LETTERS}
                currentIndex={currentIndex}
                animatingLetterIndex={null}
                isTransitioning={false}
              />
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-background via-primary to-background rounded-lg p-3 shadow-inner">
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-center">+10</div>
                <div className="text-xs opacity-80 text-white font-medium">
                  Poin
                </div>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600">
                <div className="text-2xl font-bold">
                  {DUMMY_LETTERS[currentIndex]}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center group relative hover:cursor-pointer">
                <Save className="h-5 w-5 text-white mb-1" />
                <span className="text-xs text-center font-medium">Akhiri</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block bg-gradient-to-r from-purple-2 via-secondary to-purple-2 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-900/40 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4 border-green-500">
                <div className="text-xs uppercase tracking-wide text-green-400 font-medium">
                  Poin untuk kata ini
                </div>
                <div className="text-2xl font-bold text-white">+10</div>
              </div>
            </div>
            <div className="relative">
              <WordDisplayView
                letters={DUMMY_LETTERS}
                currentIndex={currentIndex}
                animatingLetterIndex={null}
                isTransitioning={false}
              />
            </div>
            <button
              className="flex items-center gap-3 px-6 py-3 rounded-lg text-white font-medium transition-all bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/30 shadow-md hover:shadow-lg"
              title="Akhiri sesi dan simpan poin yang didapat"
              disabled
            >
              <span>Akhiri Sesi</span>
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
