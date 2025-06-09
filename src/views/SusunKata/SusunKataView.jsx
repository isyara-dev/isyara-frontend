import React, { useState } from "react";
import HandGestureDetector from "../../components/gesture/HandGestureDetector";
import GestureStatusDisplay from "../../components/gesture/GestureStatusDisplay";
import SuccessOverlay from "../../components/common/SuccessOverlay";
import HintView from "../../views/HintView";
import WordDisplayView from "./WordDisplayView";
import ScoreView from "./ScoreView";
import Button from "../../components/ui/Button";
import { ArrowLeft, X, Check, Save } from "lucide-react";

function SusunKataView({
  susunKataModel,
  progressModel,
  onGestureDetected,
  onFinishClick,
}) {
  // State untuk konfirmasi modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const {
    letters,
    currentIndex,
    currentHint,
    isLoading,
    points,
    bestScore,
    currentWordData,
    animatingLetterIndex,
    isTransitioningWord,
  } = susunKataModel;

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
  } = progressModel;

  // Cek apakah kamera harus aktif
  const isCameraActive =
    !showConfirmation &&
    !showSuccessMessage &&
    !isTransitioningWord &&
    gameState !== GAME_STATES.TRANSITIONING;

  // Handler untuk tombol kembali/akhiri
  const handleBackButtonClick = () => {
    if (points > 0) {
      setConfirmationMessage(
        "Jika kembali, sesi akan diakhiri dan poin tertinggi akan disimpan. Lanjutkan?"
      );
      setShowConfirmation(true);
    } else {
      // Langsung navigasi tanpa konfirmasi jika tidak ada poin
      onFinishClick();
    }
  };

  // Handler untuk tombol akhiri sesi
  const handleEndSessionClick = () => {
    if (points > 0) {
      setConfirmationMessage(
        "Sesi akan diakhiri dan poin tertinggi akan disimpan. Lanjutkan?"
      );
      setShowConfirmation(true);
    } else {
      setConfirmationMessage(
        "Kamu belum mendapatkan poin. Yakin ingin mengakhiri sesi?"
      );
      setShowConfirmation(true);
    }
  };

  // Handler untuk konfirmasi
  const handleConfirm = () => {
    setShowConfirmation(false);
    onFinishClick();
  };

  // Handler untuk batal
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header with score - DIPERBARUI */}
      <header className="flex justify-between items-center p-4 bg-accent">
        {/* Back button (left) */}
        <Button
          onClick={handleBackButtonClick}
          variant="text"
          className="flex items-center gap-2 px-2 py-2 rounded"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>

        {/* Title (center) - Hanya di desktop */}
        <div className="hidden sm:block text-center">
          <div className="text-lg font-bold">Tantangan Rangkai Kata</div>
        </div>

        {/* Score (right) - Diperbarui untuk mobile */}
        <ScoreView
          currentPoints={points}
          bestScore={bestScore}
          showBothOnMobile={true}
        />
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
                onGestureDetected={onGestureDetected}
                showDebugInfo={false}
                active={isCameraActive}
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
                message="Berhasil!"
                subMessage={`+${currentWordData?.points || 0} Poin`}
              />

              {/* Overlay saat transisi kata */}
              {isTransitioningWord && (
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300 mb-4"></div>
                  <p>Memuat kata baru...</p>
                </div>
              )}
            </>
          )}

          {/* Floating Hint Panel (top right corner) - HANYA UNTUK MOBILE */}
          {!isLoading && currentHint && currentIndex < letters.length && (
            <div className="absolute top-4 right-4 max-w-[120px] z-10 md:hidden">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
                {/* Background lingkaran dengan gradient untuk gambar */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    {isTransitioningWord ? (
                      <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <img
                        src={currentHint?.image_url}
                        alt={currentHint?.description}
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
          {isTransitioningWord ? (
            <div className="flex flex-col justify-center items-center bg-blue-700 rounded-xl h-full">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
                <p>Memuat petunjuk...</p>
              </div>
            </div>
          ) : (
            <HintView
              isLoading={isLoading}
              currentLetter={letters[currentIndex]}
              currentHint={currentHint}
            />
          )}
        </div>
      </main>

      {/* Footer dengan word display dan scores - UI DIPERBAIKI UNTUK MOBILE */}
      <footer className="p-4">
        {/* UI MOBILE - VERTICAL LAYOUT WITH TAB BAR */}
        <div className="sm:hidden flex flex-col">
          {/* Container dengan gradient background */}
          <div className="bg-gradient-to-r from-purple-2 via-secondary to-purple-2 rounded-xl p-4 shadow-lg">
            {/* Word Display (center) - DIPERBAIKI POSISINYA */}
            <div className="flex justify-center w-full mb-4">
              {isTransitioningWord && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
              <WordDisplayView
                letters={letters}
                currentIndex={currentIndex}
                animatingLetterIndex={animatingLetterIndex}
                isTransitioning={isTransitioningWord}
              />
            </div>

            {/* Tab-like bar at bottom - dengan warna ungu yang selaras */}
            <div className="flex items-center justify-between bg-gradient-to-r from-background via-primary to-background rounded-lg p-3 shadow-inner">
              {/* Points with icon (left) */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-center">
                  +{currentWordData?.points || 0}
                </div>
                <div className="text-xs opacity-80 text-white font-medium">
                  Poin
                </div>
              </div>

              {/* Current letter with feedback (center) */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isCorrectGesture
                    ? "bg-green-500 scale-110"
                    : isIncorrectGesture
                    ? "bg-red-500 scale-110"
                    : "bg-indigo-600"
                }`}
              >
                <div className="text-2xl font-bold">
                  {letters[currentIndex] || "?"}
                </div>

                {/* Progress indicator */}
                {gestureDetectionProgress > 0 &&
                  gestureDetectionProgress < 1 && (
                    <svg
                      className="absolute inset-0"
                      width="56"
                      height="56"
                      viewBox="0 0 56 56"
                    >
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        strokeWidth="4"
                        stroke="rgba(255,255,255,0.3)"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        strokeWidth="4"
                        stroke="white"
                        strokeDasharray={`${
                          2 * Math.PI * 26 * gestureDetectionProgress
                        } ${2 * Math.PI * 26 * (1 - gestureDetectionProgress)}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                  )}
              </div>

              {/* End session button with tooltip (right) */}
              <div
                className="flex flex-col items-center justify-center group relative hover:cursor-pointer"
                onClick={handleEndSessionClick}
              >
                <Save className="h-5 w-5 text-white mb-1" />
                <span className="text-xs text-center font-medium">Akhiri</span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 w-40 bg-black/80 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Akhiri sesi dan simpan poin yang didapat
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UI DESKTOP - DIPERBARUI DENGAN TAMPILAN YANG LEBIH SELARAS */}
        <div className="hidden sm:block bg-gradient-to-r from-purple-2 via-secondary to-purple-2 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Potential points (left) - REDESAIN */}
            <div className="flex items-center">
              <div className="bg-purple-900/40 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4 border-green-500">
                <div className="text-xs uppercase tracking-wide text-green-400 font-medium">
                  Poin untuk kata ini
                </div>
                <div className="text-2xl font-bold text-white">
                  +{currentWordData?.points || 0}
                </div>
              </div>
            </div>

            {/* Word Display (center) */}
            <div className="relative">
              {isTransitioningWord && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
              <WordDisplayView
                letters={letters}
                currentIndex={currentIndex}
                animatingLetterIndex={animatingLetterIndex}
                isTransitioning={isTransitioningWord}
              />
            </div>

            {/* End session button (right) - REDESAIN */}
            <button
              onClick={handleEndSessionClick}
              className="flex items-center gap-3 px-6 py-3 rounded-lg text-white font-medium transition-all bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/30 shadow-md hover:shadow-lg"
              title="Akhiri sesi dan simpan poin yang didapat"
            >
              <span>Akhiri Sesi</span>
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Konfirmasi - Responsive untuk mobile dan desktop */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl max-w-md w-full p-5 shadow-2xl border border-purple-500/30 animate-fade-in">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-800/50 rounded-full mx-auto flex items-center justify-center mb-4">
                <Save className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Konfirmasi</h3>
              <p className="text-gray-200">{confirmationMessage}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                <span>Batal</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                <span>Ya, Akhiri</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SusunKataView;
