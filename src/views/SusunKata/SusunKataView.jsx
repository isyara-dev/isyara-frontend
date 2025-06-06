import React from "react";
import HandGestureDetector from "../../components/gesture/HandGestureDetector";
import GestureStatusDisplay from "../../components/gesture/GestureStatusDisplay";
import SuccessOverlay from "../../components/common/SuccessOverlay";
import HintView from "../../views/HintView";
import WordDisplayView from "./WordDisplayView";
import ScoreView from "./ScoreView";

function SusunKataView({
  susunKataModel,
  progressModel,
  onGestureDetected,
  onFinishClick,
}) {
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
  } = progressModel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-800 to-blue-700 text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-center items-center p-4 bg-indigo-900">
        <ScoreView currentPoints={points} bestScore={bestScore} />
      </header>

      {/* Main content - made responsive with flex-1 to take available space */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden">
        {/* Camera (left) */}
        <div
          className={`flex justify-center items-center bg-purple-700 rounded-xl h-full relative transition-all duration-200
            ${incorrectGesture ? "border-4 border-red-500" : ""}
            ${correctGesture ? "border-4 border-green-500" : ""}`}
        >
          {isLoading ? (
            <p>Loading camera...</p>
          ) : (
            <>
              <HandGestureDetector
                key="persistent-gesture-detector"
                onGestureDetected={onGestureDetected}
                showDebugInfo={false}
                active={!showSuccessMessage && !isTransitioningWord}
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
                subMessage={`+${currentWordData?.points || 0} Poin`}
              />
            </>
          )}
        </div>

        {/* Hint image (right) */}
        <HintView
          isLoading={isLoading}
          currentLetter={letters[currentIndex]}
          currentHint={currentHint}
        />
      </main>

      {/* Footer with word display and scores */}
      <footer className="p-4">
        {/* Word display with background card and scores */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Potential points (left) */}
            <div className="bg-green-600/80 px-3 py-1 rounded-lg shadow-lg">
              <div className="text-xs opacity-80">Potential</div>
              <div className="text-lg font-bold">
                +{currentWordData?.points || 0}
              </div>
            </div>

            {/* Letters (center) */}
            <WordDisplayView
              letters={letters}
              currentIndex={currentIndex}
              animatingLetterIndex={animatingLetterIndex}
            />

            {/* Finish button (right) */}
            <button
              onClick={onFinishClick}
              className="text-sm bg-indigo-700 px-3 py-1 rounded"
            >
              Selesai
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SusunKataView;
