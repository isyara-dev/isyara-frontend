import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api/apiClient";
import HandGestureDetector from "../../components/gesture/HandGestureDetector";

// State machine constants
const GAME_STATES = {
  IDLE: "idle",
  DETECTING: "detecting",
  TRANSITIONING: "transitioning",
  COMPLETED: "completed",
};

// Simple debounce function implementation
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function SusunKataPage() {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [completedWordIds, setCompletedWordIds] = useState([]);
  const [currentWordData, setCurrentWordData] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [showDebugButtons, setShowDebugButtons] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Refs for tracking state without triggering rerenders
  const currentIndexRef = useRef(0);
  const lettersRef = useRef([]);
  const gameStateRef = useRef(GAME_STATES.IDLE);
  const lastDetectedGestureRef = useRef(null);
  const completedRef = useRef(false);

  // Fetch random word - memoized to prevent recreating on every render
  const fetchRandomWord = useCallback(async () => {
    try {
      console.log("Fetching new random word...");
      setIsLoading(true);
      setGameState(GAME_STATES.IDLE);
      gameStateRef.current = GAME_STATES.IDLE;
      completedRef.current = false;

      const response = await apiClient.get("/words/random");
      const wordData = response;

      setCurrentWordData(wordData);
      const wordStr = wordData.word.toUpperCase();
      console.log("Fetched new word:", wordStr);

      setWord(wordStr);
      setLetters(wordStr.split(""));
      lettersRef.current = wordStr.split("");

      setCurrentIndex(0);
      currentIndexRef.current = 0;

      setIsLoading(false);
      setGameState(GAME_STATES.DETECTING);
      gameStateRef.current = GAME_STATES.DETECTING;

      // Reset last detected gesture
      lastDetectedGestureRef.current = null;

      // Fetch initial hint
      fetchHint(wordStr.split("")[0]);
    } catch (error) {
      console.error("Error fetching random word:", error);
      setIsLoading(false);
      setGameState(GAME_STATES.IDLE);
      gameStateRef.current = GAME_STATES.IDLE;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRandomWord();
  }, [fetchRandomWord]);

  // Fetch hint for a specific letter
  const fetchHint = useCallback(async (letter) => {
    if (!letter) return;

    try {
      console.log(`Fetching hint for letter: ${letter}`);
      const res = await apiClient.get(`/hands/${letter}`);
      setCurrentHint(res);
    } catch (error) {
      console.error(`Error fetching hint for letter ${letter}:`, error);
    }
  }, []);

  // Handle word completion
  const handleWordCompletion = useCallback(() => {
    console.log("Handling word completion...");
    if (currentWordData && !completedRef.current) {
      completedRef.current = true;

      // Add points
      const newPoints = points + currentWordData.points;
      console.log(
        `Adding ${currentWordData.points} points. New total: ${newPoints}`
      );
      setPoints(newPoints);

      // Add word ID to completed words
      setCompletedWordIds((prev) => {
        const newIds = [...prev, currentWordData.id];
        console.log("Updated completed word IDs:", newIds);
        return newIds;
      });

      // Show success message
      setShowSuccessMessage(true);

      // Fetch next word after a delay
      setTimeout(() => {
        setShowSuccessMessage(false);
        fetchRandomWord();
      }, 2000);
    }
  }, [currentWordData, fetchRandomWord, points]);

  // Move to next letter
  const moveToNextLetter = useCallback(() => {
    const nextIndex = currentIndexRef.current + 1;

    if (nextIndex < lettersRef.current.length) {
      // Move to next letter
      console.log(`Moving to next letter: ${lettersRef.current[nextIndex]}`);
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;

      // Fetch hint for next letter
      fetchHint(lettersRef.current[nextIndex]);

      // Return to detecting state immediately
      setGameState(GAME_STATES.DETECTING);
      gameStateRef.current = GAME_STATES.DETECTING;
    } else {
      // Word completed
      console.log("Word completed! All letters done.");
      setGameState(GAME_STATES.COMPLETED);
      gameStateRef.current = GAME_STATES.COMPLETED;

      // Force update current index to ensure UI updates
      setCurrentIndex(nextIndex - 1);

      // Handle word completion
      handleWordCompletion();
    }
  }, [fetchHint, handleWordCompletion]);

  // Handle gesture detection
  const handleGestureDetected = useCallback(
    (gesture) => {
      // Don't process gestures if we're in completed state
      if (
        gameStateRef.current === GAME_STATES.COMPLETED ||
        completedRef.current
      ) {
        return;
      }

      // Prevent processing the same gesture multiple times
      if (gesture === lastDetectedGestureRef.current) {
        return;
      }

      console.log(
        "Gesture detected:",
        gesture,
        "Current state:",
        gameStateRef.current
      );

      // Only process if we're in detecting state and gesture matches current letter
      if (
        gameStateRef.current === GAME_STATES.DETECTING &&
        gesture === lettersRef.current[currentIndexRef.current]
      ) {
        console.log(`Correct gesture detected: ${gesture}`);

        // Save the last detected gesture
        lastDetectedGestureRef.current = gesture;

        // Move to next letter immediately
        moveToNextLetter();
      }
    },
    [moveToNextLetter]
  );

  // Submit completed words to backend
  const submitCompletedWords = useCallback(async () => {
    if (completedWordIds.length === 0) {
      // Don't submit if no words were completed
      return;
    }

    try {
      await apiClient.post("/api/word/submit-session", {
        wordIds: completedWordIds,
      });
      console.log("Session submitted successfully");
    } catch (error) {
      console.error("Error submitting session:", error);
    }
  }, [completedWordIds]);

  // Toggle debug buttons
  const toggleDebugButtons = useCallback(() => {
    setShowDebugButtons((prev) => !prev);
  }, []);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    // Submit completed words before navigating away
    submitCompletedWords();
    navigate("/modul");
  }, [navigate, submitCompletedWords]);

  // Simulate gesture for debugging
  const simulateGesture = useCallback(
    (letter) => {
      handleGestureDetected(letter);
    },
    [handleGestureDetected]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-800 to-blue-700 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-indigo-900">
        <img src="/logo-dicoding.svg" alt="Dicoding" className="h-6" />
        <div className="flex items-center gap-2">
          <div className="text-xs bg-indigo-600 px-2 py-1 rounded">
            State: {gameState}
          </div>
          <button
            onClick={handleBackClick}
            className="text-sm bg-indigo-700 px-3 py-1 rounded flex items-center"
          >
            ← Kembali
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
        {/* Camera (left) */}
        <div className="flex justify-center items-center bg-purple-700 rounded-xl h-[400px] relative">
          {isLoading ? (
            <p>Loading camera...</p>
          ) : (
            <>
              <HandGestureDetector
                onGestureDetected={handleGestureDetected}
                showDebugInfo={false}
                active={!showSuccessMessage} // Disable when showing success
                key="gesture-detector"
              />

              {/* Success message overlay */}
              {showSuccessMessage && (
                <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center z-20">
                  <div className="text-4xl font-bold mb-4">Berhasil!</div>
                  <div className="text-2xl">
                    +{currentWordData?.points || 0} Poin
                  </div>
                </div>
              )}

              {/* Debug button toggle */}
              <button
                onClick={toggleDebugButtons}
                className="absolute top-4 right-4 bg-gray-800/50 p-1 rounded text-xs z-10"
              >
                {showDebugButtons ? "Hide Debug" : "Show Debug"}
              </button>

              {/* Debug buttons - only shown when toggled on */}
              {showDebugButtons && (
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                  {letters.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => simulateGesture(letter)}
                      className={`px-2 py-1 rounded text-xs ${
                        idx === currentIndex
                          ? "bg-green-500"
                          : idx < currentIndex
                          ? "bg-gray-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      console.log({
                        currentIndex,
                        currentIndexRef: currentIndexRef.current,
                        letters,
                        lettersRef: lettersRef.current,
                        gameState,
                        gameStateRef: gameStateRef.current,
                        points,
                        completedWordIds,
                        completedRef: completedRef.current,
                      })
                    }
                    className="px-2 py-1 rounded text-xs bg-yellow-500"
                  >
                    Log State
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hint image (right) */}
        <div className="flex flex-col justify-center items-center bg-blue-700 rounded-xl h-[400px]">
          {isLoading ? (
            <p>Loading hint...</p>
          ) : currentHint ? (
            <>
              <div className="text-sm mb-2 bg-blue-600 px-2 py-1 rounded">
                Huruf: {letters[currentIndex]}
              </div>
              <img
                src={currentHint.image_url}
                alt={currentHint.description}
                className="w-48 mb-4 object-contain"
              />
              <p className="text-lg">{currentHint.description}</p>
            </>
          ) : (
            <p>No hint available</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-800">
        <div className="bg-indigo-500 px-4 py-2 rounded font-bold">
          {points} Pts
        </div>
        <div className="flex gap-2 text-6xl font-bold tracking-widest">
          {letters.map((char, index) => (
            <span
              key={index}
              className={
                index === currentIndex
                  ? "text-white"
                  : index < currentIndex
                  ? "text-green-300"
                  : "text-purple-300"
              }
            >
              {char}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default SusunKataPage;
