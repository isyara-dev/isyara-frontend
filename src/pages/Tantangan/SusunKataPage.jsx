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
  const [bestScore, setBestScore] = useState(100); // Example best score
  const [isLoading, setIsLoading] = useState(true);
  const [completedWordIds, setCompletedWordIds] = useState([]);
  const [currentWordData, setCurrentWordData] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [correctGesture, setCorrectGesture] = useState(false);
  const [incorrectGesture, setIncorrectGesture] = useState(false);

  // Refs for tracking state without triggering rerenders
  const currentIndexRef = useRef(0);
  const lettersRef = useRef([]);
  const gameStateRef = useRef(GAME_STATES.IDLE);
  const lastDetectedGestureRef = useRef(null);
  const completedRef = useRef(false);
  const cameraBoxRef = useRef(null);

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

  // Play sound effect for correct gesture
  const playCorrectSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/correct.mp3"); // Make sure you have this sound file
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.error("Error playing sound:", error);
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

  // Show correct gesture feedback
  const showCorrectGestureFeedback = useCallback(() => {
    setCorrectGesture(true);
    playCorrectSound();

    // Reset after animation completes
    setTimeout(() => {
      setCorrectGesture(false);
    }, 500);
  }, [playCorrectSound]);

  // Show incorrect gesture feedback
  const showIncorrectGestureFeedback = useCallback(() => {
    setIncorrectGesture(true);

    // Reset after animation completes
    setTimeout(() => {
      setIncorrectGesture(false);
    }, 300);
  }, []);

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

        // Show correct gesture feedback
        showCorrectGestureFeedback();

        // Move to next letter immediately
        moveToNextLetter();
      } else if (
        gameStateRef.current === GAME_STATES.DETECTING &&
        gesture !== lettersRef.current[currentIndexRef.current] &&
        gesture !== lastDetectedGestureRef.current
      ) {
        // Incorrect gesture detected
        console.log(`Incorrect gesture detected: ${gesture}`);

        // Show incorrect gesture feedback
        showIncorrectGestureFeedback();

        // Update last detected gesture to prevent spam
        lastDetectedGestureRef.current = gesture;

        // Reset after a short delay
        setTimeout(() => {
          lastDetectedGestureRef.current = null;
        }, 1000);
      }
    },
    [moveToNextLetter, showCorrectGestureFeedback, showIncorrectGestureFeedback]
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

  // Handle finish button click
  const handleFinishClick = useCallback(() => {
    // Submit completed words before navigating away
    submitCompletedWords();
    navigate("/modul");
  }, [navigate, submitCompletedWords]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-800 to-blue-700 text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-indigo-900">
        {/* Finish button (left) */}
        <button
          onClick={handleFinishClick}
          className="text-sm bg-indigo-700 px-3 py-1 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Selesai
        </button>

        {/* Best Score display (right) */}
        <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded font-bold">
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          Best Score: {bestScore}
        </div>
      </header>

      {/* Main content - made responsive with flex-1 to take available space */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden">
        {/* Camera (left) */}
        <div
          ref={cameraBoxRef}
          className={`flex justify-center items-center bg-purple-700 rounded-xl h-full relative transition-all duration-200
            ${incorrectGesture ? "border-4 border-red-500" : ""}`}
        >
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
            </>
          )}
        </div>

        {/* Hint image (right) */}
        <div className="flex flex-col justify-center items-center bg-blue-700 rounded-xl h-full">
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

      {/* Footer with word display and scores */}
      <footer className="p-4">
        {/* Word display with background card and scores */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Current score (left) */}
            <div className="bg-blue-600/80 px-3 py-1 rounded-lg shadow-lg">
              <div className="text-xs opacity-80">Current</div>
              <div className="text-lg font-bold">{points} pts</div>
            </div>

            {/* Letters (center) */}
            <div className="flex gap-2 text-4xl md:text-5xl font-bold tracking-widest px-2">
              {letters.map((char, index) => (
                <span
                  key={index}
                  className={`transition-all duration-300 transform
                    ${
                      index === currentIndex
                        ? "text-white"
                        : index < currentIndex
                        ? "text-green-300"
                        : "text-purple-300"
                    }
                    ${
                      correctGesture && index === currentIndex - 1
                        ? "scale-125 text-green-400"
                        : "scale-100"
                    }
                  `}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Potential points (right) */}
            <div className="bg-green-600/80 px-3 py-1 rounded-lg shadow-lg">
              <div className="text-xs opacity-80">Potential</div>
              <div className="text-lg font-bold">
                +{currentWordData?.points || 0}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SusunKataPage;
