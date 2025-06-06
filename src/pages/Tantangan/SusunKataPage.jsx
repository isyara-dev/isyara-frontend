// import { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient from "../../services/api/apiClient";
// import HandGestureDetector from "../../components/gesture/HandGestureDetector";
// import { useAuth } from "../../contexts/AuthContext";

// // State machine constants
// const GAME_STATES = {
//   IDLE: "idle",
//   DETECTING: "detecting",
//   TRANSITIONING: "transitioning",
//   COMPLETED: "completed",
// };

// // Simple debounce function implementation
// function debounce(func, wait) {
//   let timeout;
//   return function (...args) {
//     const context = this;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(context, args), wait);
//   };
// }

// function SusunKataPage() {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const [word, setWord] = useState("");
//   const [letters, setLetters] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentHint, setCurrentHint] = useState(null);
//   const [points, setPoints] = useState(0);
//   const [bestScore, setBestScore] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [completedWordIds, setCompletedWordIds] = useState([]);
//   const [currentWordData, setCurrentWordData] = useState(null);
//   const [gameState, setGameState] = useState(GAME_STATES.IDLE);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [correctGesture, setCorrectGesture] = useState(false);
//   const [incorrectGesture, setIncorrectGesture] = useState(false);

//   // Refs for tracking state without triggering rerenders
//   const currentIndexRef = useRef(0);
//   const lettersRef = useRef([]);
//   const gameStateRef = useRef(GAME_STATES.IDLE);
//   const lastDetectedGestureRef = useRef(null);
//   const completedRef = useRef(false);
//   const cameraBoxRef = useRef(null);

//   // Update state variables for gesture detection
//   const [detectedGesture, setDetectedGesture] = useState(null);
//   const [gestureConfidence, setGestureConfidence] = useState(0);
//   const [gestureDetectionProgress, setGestureDetectionProgress] = useState(0);
//   const [isCorrectGesture, setIsCorrectGesture] = useState(false);
//   const [isIncorrectGesture, setIsIncorrectGesture] = useState(false);
//   const gestureTimerRef = useRef(null);
//   const gestureDetectionStartRef = useRef(null);
//   const GESTURE_THRESHOLD = 0.6; // 60% confidence threshold
//   const GESTURE_DETECTION_TIME = 2000; // 2 seconds

//   // Add a state to track the letter being animated
//   const [animatingLetterIndex, setAnimatingLetterIndex] = useState(null);
//   const animationTimeoutRef = useRef(null);

//   // Add a state to track if we're transitioning to a new word
//   const [isTransitioningWord, setIsTransitioningWord] = useState(false);

//   // Fetch user profile to get best score
//   const fetchUserProfile = useCallback(async () => {
//     try {
//       const userData = await apiClient.getUserProfile();
//       if (userData && userData.score) {
//         console.log("Fetched user best score:", userData.score);
//         setBestScore(userData.score);
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   }, []);

//   // Initial load - fetch user profile and best score
//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   // Update best score when currentUser changes
//   useEffect(() => {
//     if (currentUser && currentUser.score) {
//       setBestScore(currentUser.score);
//     }
//   }, [currentUser]);

//   // Fetch random word - memoized to prevent recreating on every render
//   const fetchRandomWord = useCallback(async () => {
//     try {
//       console.log("Fetching new random word...");
//       setIsLoading(true);
//       setGameState(GAME_STATES.IDLE);
//       gameStateRef.current = GAME_STATES.IDLE;
//       completedRef.current = false;

//       const response = await apiClient.get("/words/random");
//       const wordData = response;

//       setCurrentWordData(wordData);
//       const wordStr = wordData.word.toUpperCase();
//       console.log("Fetched new word:", wordStr);

//       setWord(wordStr);
//       setLetters(wordStr.split(""));
//       lettersRef.current = wordStr.split("");

//       setCurrentIndex(0);
//       currentIndexRef.current = 0;

//       setIsLoading(false);
//       setGameState(GAME_STATES.DETECTING);
//       gameStateRef.current = GAME_STATES.DETECTING;

//       // Reset last detected gesture
//       lastDetectedGestureRef.current = null;

//       // Reset animation state
//       setAnimatingLetterIndex(null);
//       setIsTransitioningWord(false);

//       // Fetch initial hint
//       fetchHint(wordStr.split("")[0]);
//     } catch (error) {
//       console.error("Error fetching random word:", error);
//       setIsLoading(false);
//       setGameState(GAME_STATES.IDLE);
//       gameStateRef.current = GAME_STATES.IDLE;
//       setIsTransitioningWord(false);
//     }
//   }, []);

//   // Initial load
//   useEffect(() => {
//     fetchRandomWord();
//   }, [fetchRandomWord]);

//   // Fetch hint for a specific letter
//   const fetchHint = useCallback(async (letter) => {
//     if (!letter) return;

//     try {
//       console.log(`Fetching hint for letter: ${letter}`);
//       const res = await apiClient.get(`/hands/${letter}`);
//       setCurrentHint(res);
//     } catch (error) {
//       console.error(`Error fetching hint for letter ${letter}:`, error);
//     }
//   }, []);

//   // Play sound effect for correct gesture
//   const playCorrectSound = useCallback(() => {
//     try {
//       const audio = new Audio("/sounds/correct.mp3"); // Make sure you have this sound file
//       audio.play().catch((e) => console.log("Audio play failed:", e));
//     } catch (error) {
//       console.error("Error playing sound:", error);
//     }
//   }, []);

//   // Handle word completion
//   const handleWordCompletion = useCallback(() => {
//     console.log("Handling word completion...");
//     if (currentWordData && !completedRef.current) {
//       completedRef.current = true;
//       setIsTransitioningWord(true);

//       // Add points
//       const newPoints = points + currentWordData.points;
//       console.log(
//         `Adding ${currentWordData.points} points. New total: ${newPoints}`
//       );
//       setPoints(newPoints);

//       // Update best score if current score is higher
//       if (newPoints > bestScore) {
//         setBestScore(newPoints);
//       }

//       // Add word ID to completed words
//       setCompletedWordIds((prev) => {
//         const newIds = [...prev, currentWordData.id];
//         console.log("Updated completed word IDs:", newIds);
//         return newIds;
//       });

//       // Show success message
//       setShowSuccessMessage(true);

//       // Fetch next word after a delay
//       setTimeout(() => {
//         setShowSuccessMessage(false);

//         // Reset only what's needed for the next word
//         setDetectedGesture(null);
//         setGestureConfidence(0);
//         setGestureDetectionProgress(0);
//         setIsCorrectGesture(false);
//         setIsIncorrectGesture(false);
//         setCorrectGesture(false);
//         setIncorrectGesture(false);

//         // Fetch new word without resetting camera
//         fetchRandomWord();
//       }, 2000);
//     }
//   }, [currentWordData, fetchRandomWord, points, bestScore]);

//   // Move to next letter with improved animation
//   const moveToNextLetter = useCallback(() => {
//     const nextIndex = currentIndexRef.current + 1;

//     // Set the current letter as animating
//     setAnimatingLetterIndex(currentIndexRef.current);

//     // Clear any existing animation timeout
//     if (animationTimeoutRef.current) {
//       clearTimeout(animationTimeoutRef.current);
//     }

//     // Schedule animation completion
//     animationTimeoutRef.current = setTimeout(() => {
//       // Animation completed
//       if (isTransitioningWord) {
//         // Skip further processing if we're already transitioning words
//         return;
//       }

//       setAnimatingLetterIndex(null);

//       if (nextIndex < lettersRef.current.length) {
//         // Move to next letter
//         console.log(`Moving to next letter: ${lettersRef.current[nextIndex]}`);
//         setCurrentIndex(nextIndex);
//         currentIndexRef.current = nextIndex;

//         // Fetch hint for next letter
//         fetchHint(lettersRef.current[nextIndex]);

//         // Return to detecting state
//         setGameState(GAME_STATES.DETECTING);
//         gameStateRef.current = GAME_STATES.DETECTING;

//         // Reset gesture states for next letter
//         setDetectedGesture(null);
//         setGestureConfidence(0);
//         setGestureDetectionProgress(0);
//         setIsCorrectGesture(false);
//         setIsIncorrectGesture(false);
//         setCorrectGesture(false);
//         setIncorrectGesture(false);
//       } else {
//         // Word completed
//         console.log("Word completed! All letters done.");
//         setGameState(GAME_STATES.COMPLETED);
//         gameStateRef.current = GAME_STATES.COMPLETED;

//         // Handle word completion
//         handleWordCompletion();
//       }
//     }, 800); // Animation duration - longer to ensure visibility
//   }, [fetchHint, handleWordCompletion, isTransitioningWord]);

//   // Show correct gesture feedback
//   const showCorrectGestureFeedback = useCallback(() => {
//     setCorrectGesture(true);
//     playCorrectSound();

//     // Don't reset the green border - it will be reset when moving to next letter
//   }, [playCorrectSound]);

//   // Show incorrect gesture feedback
//   const showIncorrectGestureFeedback = useCallback(() => {
//     setIncorrectGesture(true);

//     // Reset after animation completes
//     setTimeout(() => {
//       setIncorrectGesture(false);
//     }, 300);
//   }, []);

//   // Handle gesture detection
//   const handleGestureDetected = useCallback(
//     (gesture, confidenceValue) => {
//       // Don't process gestures if we're in completed state, animating, or transitioning words
//       if (
//         gameStateRef.current === GAME_STATES.COMPLETED ||
//         completedRef.current ||
//         animatingLetterIndex !== null ||
//         isTransitioningWord
//       ) {
//         return;
//       }

//       // If gesture is null, it means hand is not visible
//       if (gesture === null) {
//         console.log("Null gesture detected, resetting states");

//         // Reset detection timer and progress
//         if (gestureTimerRef.current) {
//           clearInterval(gestureTimerRef.current);
//           gestureTimerRef.current = null;
//         }

//         gestureDetectionStartRef.current = null;

//         // Reset gesture state
//         setDetectedGesture(null);
//         setGestureConfidence(0);
//         setGestureDetectionProgress(0);
//         setIsCorrectGesture(false);
//         setIsIncorrectGesture(false);

//         // Reset border feedback
//         setCorrectGesture(false);
//         setIncorrectGesture(false);

//         return;
//       }

//       // Update detected gesture and confidence
//       setDetectedGesture(gesture);
//       setGestureConfidence(confidenceValue);

//       // Only process if we're in detecting state
//       if (gameStateRef.current === GAME_STATES.DETECTING) {
//         const currentLetter = lettersRef.current[currentIndexRef.current];

//         // Check if the gesture matches the current letter
//         if (gesture === currentLetter) {
//           // Set correct gesture state
//           setIsCorrectGesture(true);
//           setIsIncorrectGesture(false);

//           // Show correct border feedback immediately
//           setCorrectGesture(true);
//           setIncorrectGesture(false);

//           // If this is the first detection of this gesture or continuing detection
//           if (!gestureDetectionStartRef.current) {
//             console.log("Starting correct gesture detection for:", gesture);

//             // Reset any existing timer
//             if (gestureTimerRef.current) {
//               clearInterval(gestureTimerRef.current);
//             }

//             // Start a new detection sequence
//             gestureDetectionStartRef.current = Date.now();
//             setGestureDetectionProgress(0);

//             // Start progress timer
//             gestureTimerRef.current = setInterval(() => {
//               const elapsed = Date.now() - gestureDetectionStartRef.current;
//               const progress = Math.min(elapsed / GESTURE_DETECTION_TIME, 1);
//               setGestureDetectionProgress(progress);

//               // If we've reached the time requirement and confidence threshold
//               if (progress >= 1 && confidenceValue >= GESTURE_THRESHOLD) {
//                 console.log("Gesture completed successfully:", gesture);
//                 clearInterval(gestureTimerRef.current);
//                 gestureTimerRef.current = null;
//                 gestureDetectionStartRef.current = null;

//                 // Show correct gesture feedback animation
//                 showCorrectGestureFeedback();

//                 // Move to next letter with animation
//                 moveToNextLetter();
//               }
//             }, 100);
//           }
//         } else {
//           // Set incorrect gesture state
//           setIsCorrectGesture(false);
//           setIsIncorrectGesture(true);

//           // Show incorrect border feedback immediately
//           setCorrectGesture(false);
//           setIncorrectGesture(true);

//           // If we were detecting a gesture but got a different one, reset the timer
//           if (gestureTimerRef.current) {
//             console.log(
//               "Incorrect gesture detected:",
//               gesture,
//               "expected:",
//               currentLetter
//             );
//             clearInterval(gestureTimerRef.current);
//             gestureTimerRef.current = null;
//             gestureDetectionStartRef.current = null;
//             setGestureDetectionProgress(0);

//             // Show incorrect feedback animation
//             showIncorrectGestureFeedback();
//           }
//         }
//       }
//     },
//     [
//       moveToNextLetter,
//       showCorrectGestureFeedback,
//       showIncorrectGestureFeedback,
//       isTransitioningWord,
//     ]
//   );

//   // Clean up all timers on component unmount
//   useEffect(() => {
//     return () => {
//       if (gestureTimerRef.current) {
//         clearInterval(gestureTimerRef.current);
//       }
//       if (animationTimeoutRef.current) {
//         clearTimeout(animationTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Submit completed words to backend and update user profile
//   const submitCompletedWords = useCallback(async () => {
//     if (completedWordIds.length === 0) {
//       // Don't submit if no words were completed
//       return;
//     }

//     try {
//       // Submit session to backend
//       await apiClient.post("/words/submit-session", {
//         word_ids: completedWordIds,
//       });
//       console.log("Session submitted successfully");

//       // Fetch updated user profile to get latest best score
//       await fetchUserProfile();
//     } catch (error) {
//       console.error("Error submitting session:", error);
//     }
//   }, [completedWordIds, fetchUserProfile]);

//   // Handle finish button click
//   const handleFinishClick = useCallback(() => {
//     // Only submit if user has earned points
//     if (points > 0) {
//       // Submit completed words before navigating away
//       submitCompletedWords();
//     }
//     navigate("/modul");
//   }, [navigate, submitCompletedWords, points]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-800 to-blue-700 text-white flex flex-col max-h-screen overflow-hidden">
//       {/* Header */}
//       <header className="flex justify-center items-center p-4 bg-indigo-900">
//         {/* Current and Best Score display (center) */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-blue-600/80 px-4 py-2 rounded font-bold">
//             <div className="text-xs opacity-80">Current</div>
//             <div className="text-lg font-bold">{points} pts</div>
//           </div>

//           <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded font-bold">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//               />
//             </svg>
//             Best Score: {bestScore}
//           </div>
//         </div>
//       </header>

//       {/* Main content - made responsive with flex-1 to take available space */}
//       <main className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-4 md:gap-8 flex-1 overflow-hidden">
//         {/* Camera (left) */}
//         <div
//           ref={cameraBoxRef}
//           className={`flex justify-center items-center bg-purple-700 rounded-xl h-full relative transition-all duration-200
//             ${incorrectGesture ? "border-4 border-red-500" : ""}
//             ${correctGesture ? "border-4 border-green-500" : ""}`}
//         >
//           {isLoading ? (
//             <p>Loading camera...</p>
//           ) : (
//             <>
//               <HandGestureDetector
//                 key="persistent-gesture-detector"
//                 onGestureDetected={handleGestureDetected}
//                 showDebugInfo={false}
//                 active={!showSuccessMessage && !isTransitioningWord}
//               />

//               {/* Detection status display */}
//               <div
//                 className={`absolute top-4 left-4 px-3 py-1 rounded transition-all duration-300
//                   ${
//                     detectedGesture
//                       ? isCorrectGesture
//                         ? "bg-green-500/70"
//                         : isIncorrectGesture
//                         ? "bg-red-500/70"
//                         : "bg-black/50"
//                       : "bg-black/50"
//                   }`}
//               >
//                 {detectedGesture ? (
//                   <>
//                     <div className="flex items-center justify-between">
//                       <span>{`Detected: ${detectedGesture}`}</span>
//                       <span className="ml-2">
//                         {`${Math.round(gestureConfidence * 100)}%`}
//                       </span>
//                     </div>
//                     {isCorrectGesture && (
//                       <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-green-400 transition-all duration-100"
//                           style={{
//                             width: `${gestureDetectionProgress * 100}%`,
//                           }}
//                         ></div>
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   "No gesture detected"
//                 )}
//               </div>

//               {/* Success message overlay */}
//               {showSuccessMessage && (
//                 <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center z-20">
//                   <div className="text-4xl font-bold mb-4">Berhasil!</div>
//                   <div className="text-2xl">
//                     +{currentWordData?.points || 0} Poin
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Hint image (right) */}
//         <div className="flex flex-col justify-center items-center bg-blue-700 rounded-xl h-full">
//           {isLoading ? (
//             <p>Loading hint...</p>
//           ) : currentHint ? (
//             <>
//               <div className="text-sm mb-2 bg-blue-600 px-2 py-1 rounded">
//                 Huruf: {letters[currentIndex]}
//               </div>
//               <img
//                 src={currentHint.image_url}
//                 alt={currentHint.description}
//                 className="w-48 mb-4 object-contain"
//               />
//               <p className="text-lg">{currentHint.description}</p>
//             </>
//           ) : (
//             <p>No hint available</p>
//           )}
//         </div>
//       </main>

//       {/* Footer with word display and scores */}
//       <footer className="p-4">
//         {/* Word display with background card and scores */}
//         <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             {/* Potential points (left) */}
//             <div className="bg-green-600/80 px-3 py-1 rounded-lg shadow-lg">
//               <div className="text-xs opacity-80">Potential</div>
//               <div className="text-lg font-bold">
//                 +{currentWordData?.points || 0}
//               </div>
//             </div>

//             {/* Letters (center) */}
//             <div className="flex gap-2 text-4xl md:text-5xl font-bold tracking-widest px-2">
//               {letters.map((char, index) => (
//                 <span
//                   key={index}
//                   className={`transition-all duration-500 transform
//                     ${
//                       index === currentIndex
//                         ? "text-white"
//                         : index < currentIndex
//                         ? "text-green-300"
//                         : "text-purple-300"
//                     }
//                     ${
//                       animatingLetterIndex === index
//                         ? "scale-150 text-green-400"
//                         : "scale-100"
//                     }
//                   `}
//                 >
//                   {char}
//                 </span>
//               ))}
//             </div>

//             {/* Finish button (right) */}
//             <button
//               onClick={handleFinishClick}
//               className="text-sm bg-indigo-700 px-3 py-1 rounded"
//             >
//               Selesai
//             </button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default SusunKataPage;

// features/susunkata/SusunKataPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SusunKataModel from "../../models/susunkata/SusunKataModel";
import WordProgressModel from "../../models/susunkata/WordProgressModel";
import SusunKataPresenter from "../../presenters/SusunKataPresenter";
import SusunKataView from "../../views/SusunKata/SusunKataView";

function SusunKataPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Buat model dan state untuk memaksa re-render
  const [, setRenderTrigger] = useState({});
  const susunKataModel = useRef(new SusunKataModel()).current;
  const progressModel = useRef(new WordProgressModel()).current;

  // Buat presenter dengan fungsi update view
  const presenterRef = useRef(null);

  // Inisialisasi presenter
  useEffect(() => {
    const updateView = () => {
      setRenderTrigger({});
    };

    presenterRef.current = new SusunKataPresenter(
      susunKataModel,
      progressModel,
      updateView
    );

    // Fetch user profile untuk mendapatkan best score
    presenterRef.current.fetchUserProfile();

    // Fetch random word
    presenterRef.current.fetchRandomWord();

    // Cleanup
    return () => {
      presenterRef.current.cleanup();
    };
  }, [susunKataModel, progressModel]);

  // Update best score when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.score) {
      susunKataModel.setBestScore(currentUser.score);
      setRenderTrigger({});
    }
  }, [currentUser, susunKataModel]);

  // Handler untuk gesture detection
  const handleGestureDetected = useCallback((gesture, confidence) => {
    if (presenterRef.current) {
      presenterRef.current.handleGestureDetected(gesture, confidence);
    }
  }, []);

  // Handler untuk finish button
  const handleFinishClick = useCallback(() => {
    if (presenterRef.current && susunKataModel.points > 0) {
      // Submit completed words before navigating away
      presenterRef.current.submitCompletedWords();
    }
    navigate("/modul");
  }, [navigate, susunKataModel.points]);

  return (
    <SusunKataView
      susunKataModel={susunKataModel}
      progressModel={progressModel}
      onGestureDetected={handleGestureDetected}
      onFinishClick={handleFinishClick}
    />
  );
}

export default SusunKataPage;
