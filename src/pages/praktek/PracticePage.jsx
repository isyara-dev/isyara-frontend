import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api/apiClient";
import HandGestureDetector from "../../components/gesture/HandGestureDetector";

// State machine constants
const GAME_STATES = {
  IDLE: "idle",
  DETECTING: "detecting",
  TRANSITIONING: "transitioning",
  COMPLETED: "completed",
};

function PracticePage() {
  const navigate = useNavigate();
  const { letterIndex = 0 } = useParams(); // Get the letter index from URL params
  const currentLetterIdx = parseInt(letterIndex);

  // Alphabet array - all available letters
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [currentLetter, setCurrentLetter] = useState(
    allLetters[currentLetterIdx]
  );
  const [currentHint, setCurrentHint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [correctGesture, setCorrectGesture] = useState(false);
  const [incorrectGesture, setIncorrectGesture] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Refs for tracking state without triggering rerenders
  const gameStateRef = useRef(GAME_STATES.IDLE);
  const lastDetectedGestureRef = useRef(null);
  const completedRef = useRef(false);
  const cameraBoxRef = useRef(null);

  // Update state variables for gesture detection
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [gestureDetectionProgress, setGestureDetectionProgress] = useState(0);
  const [isCorrectGesture, setIsCorrectGesture] = useState(false);
  const [isIncorrectGesture, setIsIncorrectGesture] = useState(false);
  const gestureTimerRef = useRef(null);
  const gestureDetectionStartRef = useRef(null);
  const GESTURE_THRESHOLD = 0.6; // 60% confidence threshold
  const GESTURE_DETECTION_TIME = 2000; // 2 seconds

  // Add a state to track the letter being animated
  const [animatingLetter, setAnimatingLetter] = useState(false);
  const animationTimeoutRef = useRef(null);

  // Initialize letter and fetch hint
  const initializeLetter = useCallback(async () => {
    try {
      console.log(`Initializing letter: ${currentLetter}`);
      setIsLoading(true);
      setGameState(GAME_STATES.IDLE);
      gameStateRef.current = GAME_STATES.IDLE;
      completedRef.current = false;

      // Reset last detected gesture
      lastDetectedGestureRef.current = null;

      // Reset animation state
      setAnimatingLetter(false);

      // Fetch hint for the current letter
      await fetchHint(currentLetter);

      setIsLoading(false);
      setGameState(GAME_STATES.DETECTING);
      gameStateRef.current = GAME_STATES.DETECTING;
    } catch (error) {
      console.error("Error initializing letter:", error);
      setIsLoading(false);
      setGameState(GAME_STATES.IDLE);
      gameStateRef.current = GAME_STATES.IDLE;
    }
  }, [currentLetter]);

  // Initial load
  useEffect(() => {
    initializeLetter();
  }, [initializeLetter]);

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

  // Handle letter completion
  const handleLetterCompletion = useCallback(() => {
    console.log("Handling letter completion...");
    if (!completedRef.current) {
      completedRef.current = true;

      // Show success message
      setShowSuccessMessage(true);

      // Hide success message after a shorter delay (reduced from 2000ms to 1000ms)
      setTimeout(() => {
        setShowSuccessMessage(false);

        // Reset feedback states to allow continued practice
        setCorrectGesture(false);
        setGameState(GAME_STATES.DETECTING);
        gameStateRef.current = GAME_STATES.DETECTING;
        completedRef.current = false;

        // Reset gesture detection states
        setDetectedGesture(null);
        setGestureConfidence(0);
        setGestureDetectionProgress(0);
        setIsCorrectGesture(false);
        setIsIncorrectGesture(false);
      }, 1000); // Reduced delay from 2000ms to 1000ms
    }
  }, []);

  // Show correct gesture feedback
  const showCorrectGestureFeedback = useCallback(() => {
    setCorrectGesture(true);
    playCorrectSound();

    // Don't reset the green border - it will be reset when moving to next letter
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
    (gesture, confidenceValue) => {
      // Don't process gestures if we're in completed state or animating
      if (
        gameStateRef.current === GAME_STATES.COMPLETED ||
        completedRef.current ||
        animatingLetter
      ) {
        return;
      }

      // If gesture is null, it means hand is not visible
      if (gesture === null) {
        console.log("Null gesture detected, resetting states");

        // Reset detection timer and progress
        if (gestureTimerRef.current) {
          clearInterval(gestureTimerRef.current);
          gestureTimerRef.current = null;
        }

        gestureDetectionStartRef.current = null;

        // Reset gesture state
        setDetectedGesture(null);
        setGestureConfidence(0);
        setGestureDetectionProgress(0);
        setIsCorrectGesture(false);
        setIsIncorrectGesture(false);

        // Reset border feedback
        setCorrectGesture(false);
        setIncorrectGesture(false);

        return;
      }

      // Update detected gesture and confidence
      setDetectedGesture(gesture);
      setGestureConfidence(confidenceValue);

      // Only process if we're in detecting state
      if (gameStateRef.current === GAME_STATES.DETECTING) {
        // Check if the gesture matches the current letter
        if (gesture === currentLetter) {
          // Set correct gesture state
          setIsCorrectGesture(true);
          setIsIncorrectGesture(false);

          // Show correct border feedback immediately
          setCorrectGesture(true);
          setIncorrectGesture(false);

          // If this is the first detection of this gesture or continuing detection
          if (!gestureDetectionStartRef.current) {
            console.log("Starting correct gesture detection for:", gesture);

            // Reset any existing timer
            if (gestureTimerRef.current) {
              clearInterval(gestureTimerRef.current);
            }

            // Start a new detection sequence
            gestureDetectionStartRef.current = Date.now();
            setGestureDetectionProgress(0);

            // Start progress timer
            gestureTimerRef.current = setInterval(() => {
              const elapsed = Date.now() - gestureDetectionStartRef.current;
              const progress = Math.min(elapsed / GESTURE_DETECTION_TIME, 1);
              setGestureDetectionProgress(progress);

              // If we've reached the time requirement and confidence threshold
              if (progress >= 1 && confidenceValue >= GESTURE_THRESHOLD) {
                console.log("Gesture completed successfully:", gesture);
                clearInterval(gestureTimerRef.current);
                gestureTimerRef.current = null;
                gestureDetectionStartRef.current = null;

                // Show correct gesture feedback animation
                showCorrectGestureFeedback();

                // Mark as completed
                setGameState(GAME_STATES.COMPLETED);
                gameStateRef.current = GAME_STATES.COMPLETED;
                handleLetterCompletion();
              }
            }, 100);
          }
        } else {
          // Set incorrect gesture state
          setIsCorrectGesture(false);
          setIsIncorrectGesture(true);

          // Show incorrect border feedback immediately
          setCorrectGesture(false);
          setIncorrectGesture(true);

          // If we were detecting a gesture but got a different one, reset the timer
          if (gestureTimerRef.current) {
            console.log(
              "Incorrect gesture detected:",
              gesture,
              "expected:",
              currentLetter
            );
            clearInterval(gestureTimerRef.current);
            gestureTimerRef.current = null;
            gestureDetectionStartRef.current = null;
            setGestureDetectionProgress(0);

            // Show incorrect feedback animation
            showIncorrectGestureFeedback();
          }
        }
      }
    },
    [
      currentLetter,
      handleLetterCompletion,
      showCorrectGestureFeedback,
      showIncorrectGestureFeedback,
    ]
  );

  // Clean up all timers on component unmount
  useEffect(() => {
    return () => {
      if (gestureTimerRef.current) {
        clearInterval(gestureTimerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    navigate("/belajar");
  }, [navigate]);

  // Handle next button click
  const handleNextClick = useCallback(() => {
    const nextLetterIdx = currentLetterIdx + 1;
    // Check if we have a next letter in our alphabet
    if (nextLetterIdx < allLetters.length) {
      const nextLetter = allLetters[nextLetterIdx];

      // Update current letter first
      setCurrentLetter(nextLetter);

      // Show loading while fetching new hint
      setIsLoading(true);

      // Reset gesture states
      setDetectedGesture(null);
      setGestureConfidence(0);
      setGestureDetectionProgress(0);
      setIsCorrectGesture(false);
      setIsIncorrectGesture(false);
      setCorrectGesture(false);
      setIncorrectGesture(false);

      // Reset game state
      setGameState(GAME_STATES.IDLE);
      gameStateRef.current = GAME_STATES.IDLE;
      completedRef.current = false;

      // Fetch hint for next letter
      apiClient
        .get(`/hands/${nextLetter}`)
        .then((res) => {
          setCurrentHint(res);
          setIsLoading(false);
          setGameState(GAME_STATES.DETECTING);
          gameStateRef.current = GAME_STATES.DETECTING;
        })
        .catch((error) => {
          console.error(`Error fetching hint for letter ${nextLetter}:`, error);
          setIsLoading(false);
        });

      // Update URL without full navigation
      window.history.pushState({}, "", `/praktek-huruf/${nextLetterIdx}`);
    } else {
      // If we've reached the end of the alphabet, go back to the module page
      navigate("/modul");
    }
  }, [navigate, currentLetterIdx, allLetters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-800 to-blue-700 text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header with back button on the left */}
      <header className="flex justify-between items-center p-4 bg-indigo-900">
        {/* Back button (left) */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-indigo-700 px-3 py-2 rounded hover:bg-indigo-600 transition-colors"
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
          <span>Kembali</span>
        </button>

        {/* Title (center) */}
        <div className="text-xl font-bold">Praktek Huruf {currentLetter}</div>

        {/* Empty div to balance the layout */}
        <div className="w-24"></div>
      </header>

      {/* Main content - made responsive with flex-1 to take available space */}
      <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden">
        {/* Camera (left) */}
        <div
          ref={cameraBoxRef}
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
                onGestureDetected={handleGestureDetected}
                showDebugInfo={false}
                active={!showSuccessMessage}
              />

              {/* Detection status display */}
              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded transition-all duration-300
                  ${
                    detectedGesture
                      ? isCorrectGesture
                        ? "bg-green-500/70"
                        : isIncorrectGesture
                        ? "bg-red-500/70"
                        : "bg-black/50"
                      : "bg-black/50"
                  }`}
              >
                {detectedGesture ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>{`Detected: ${detectedGesture}`}</span>
                      <span className="ml-2">
                        {`${Math.round(gestureConfidence * 100)}%`}
                      </span>
                    </div>
                    {isCorrectGesture && (
                      <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 transition-all duration-100"
                          style={{
                            width: `${gestureDetectionProgress * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </>
                ) : (
                  "No gesture detected"
                )}
              </div>

              {/* Success message overlay */}
              {showSuccessMessage && (
                <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center z-20">
                  <div className="text-4xl font-bold mb-4">Berhasil!</div>
                  <div className="text-2xl">Huruf {currentLetter} dikuasai</div>
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
                Huruf: {currentLetter}
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

      {/* Footer with next button on the right */}
      <footer className="p-4">
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Status (left) */}
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium 
              ${
                gameState === GAME_STATES.COMPLETED
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {gameState === GAME_STATES.COMPLETED
                ? "Selesai"
                : "Belum Selesai"}
            </div>

            {/* Current letter (center) */}
            <div className="text-4xl font-bold">{currentLetter}</div>

            {/* Next button (right) */}
            <button
              onClick={handleNextClick}
              className={`flex items-center gap-2 px-4 py-2 rounded text-white font-medium transition-colors
                ${
                  gameState === GAME_STATES.COMPLETED
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-indigo-700 hover:bg-indigo-600"
                }`}
              disabled={
                gameState !== GAME_STATES.COMPLETED && !showSuccessMessage
              }
            >
              <span>Lanjut</span>
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
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PracticePage;
