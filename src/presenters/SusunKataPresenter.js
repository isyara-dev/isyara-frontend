import apiClient from "../services/api/apiClient";
import GestureDetectionService from "../services/gesture/GestureDetectionService";

class SusunKataPresenter {
  constructor(susunKataModel, progressModel, updateView) {
    this.susunKataModel = susunKataModel;
    this.progressModel = progressModel;
    this.updateView = updateView;
    this.gestureService = new GestureDetectionService();

    // Refs untuk state tracking
    this.gestureTimerRef = null;
    this.gestureDetectionStartRef = null;
    this.animationTimeoutRef = null;
    this.completedRef = false;
  }

  async fetchUserProfile() {
    try {
      const userData = await apiClient.getUserProfile();
      if (userData && userData.score) {
        console.log("Fetched user best score:", userData.score);
        this.susunKataModel.setBestScore(userData.score);
        this.updateView();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async fetchRandomWord() {
    try {
      console.log("Fetching new random word...");
      this.susunKataModel.setLoading(true);
      this.progressModel.setGameState(this.progressModel.GAME_STATES.IDLE);
      this.completedRef = false;
      this.updateView();

      const response = await apiClient.get("/words/random");
      const wordData = response;

      this.susunKataModel.setWordData(wordData);
      console.log("Fetched new word:", wordData.word);

      this.susunKataModel.setLoading(false);
      this.progressModel.setGameState(this.progressModel.GAME_STATES.DETECTING);
      this.updateView();

      // Fetch initial hint
      await this.fetchHint(this.susunKataModel.letters[0]);
    } catch (error) {
      console.error("Error fetching random word:", error);
      this.susunKataModel.setLoading(false);
      this.progressModel.setGameState(this.progressModel.GAME_STATES.IDLE);
      this.susunKataModel.setIsTransitioningWord(false);
      this.updateView();
    }
  }

  async fetchHint(letter) {
    if (!letter) return;

    try {
      console.log(`Fetching hint for letter: ${letter}`);
      const res = await this.gestureService.fetchHint(letter);
      this.susunKataModel.setHint(res);
      this.updateView();
    } catch (error) {
      console.error(`Error fetching hint for letter ${letter}:`, error);
    }
  }

  handleWordCompletion() {
    console.log("Handling word completion...");
    const { currentWordData } = this.susunKataModel;

    if (currentWordData && !this.completedRef) {
      this.completedRef = true;
      this.susunKataModel.setIsTransitioningWord(true);
      this.updateView();

      // Add points
      this.susunKataModel.addPoints(currentWordData.points);
      console.log(
        `Adding ${currentWordData.points} points. New total: ${this.susunKataModel.points}`
      );

      // Add word ID to completed words
      this.susunKataModel.addCompletedWordId(currentWordData.id);
      console.log(
        "Updated completed word IDs:",
        this.susunKataModel.completedWordIds
      );

      // Show success message
      this.progressModel.setShowSuccessMessage(true);
      this.updateView();

      // Fetch next word after a delay
      setTimeout(() => {
        this.progressModel.setShowSuccessMessage(false);

        // Reset only what's needed for the next word
        this.progressModel.resetGestureDetection();
        this.updateView();

        // Fetch new word without resetting camera
        this.fetchRandomWord();
      }, 2000);
    }
  }

  moveToNextLetter() {
    const nextIndex = this.susunKataModel.currentIndex + 1;

    // Set the current letter as animating
    this.susunKataModel.setAnimatingLetterIndex(
      this.susunKataModel.currentIndex
    );
    this.updateView();

    // Clear any existing animation timeout
    if (this.animationTimeoutRef) {
      clearTimeout(this.animationTimeoutRef);
    }

    // Schedule animation completion
    this.animationTimeoutRef = setTimeout(() => {
      // Animation completed
      if (this.susunKataModel.isTransitioningWord) {
        // Skip further processing if we're already transitioning words
        return;
      }

      this.susunKataModel.setAnimatingLetterIndex(null);
      this.updateView();

      if (nextIndex < this.susunKataModel.letters.length) {
        // Move to next letter
        console.log(
          `Moving to next letter: ${this.susunKataModel.letters[nextIndex]}`
        );
        this.susunKataModel.setCurrentIndex(nextIndex);
        this.updateView();

        // Fetch hint for next letter
        this.fetchHint(this.susunKataModel.letters[nextIndex]);

        // Return to detecting state
        this.progressModel.setGameState(
          this.progressModel.GAME_STATES.DETECTING
        );
        this.progressModel.resetGestureDetection();
        this.updateView();
      } else {
        // Word completed
        console.log("Word completed! All letters done.");
        this.progressModel.setGameState(
          this.progressModel.GAME_STATES.COMPLETED
        );
        this.updateView();

        // Handle word completion
        this.handleWordCompletion();
      }
    }, 800); // Animation duration - longer to ensure visibility
  }

  showCorrectGestureFeedback() {
    this.progressModel.setCorrectGesture(true);
    this.gestureService.playCorrectSound();
    this.updateView();
  }

  showIncorrectGestureFeedback() {
    this.progressModel.setIncorrectGesture(true);
    this.updateView();

    // Reset after animation completes
    setTimeout(() => {
      this.progressModel.setIncorrectGesture(false);
      this.updateView();
    }, 300);
  }

  handleGestureDetected(gesture, confidenceValue) {
    // Don't process gestures if we're in completed state, animating, or transitioning words
    if (
      this.progressModel.gameState ===
        this.progressModel.GAME_STATES.COMPLETED ||
      this.completedRef ||
      this.susunKataModel.animatingLetterIndex !== null ||
      this.susunKataModel.isTransitioningWord
    ) {
      return;
    }

    // If gesture is null, it means hand is not visible
    if (gesture === null) {
      console.log("Null gesture detected, resetting states");

      // Reset detection timer and progress
      if (this.gestureTimerRef) {
        clearInterval(this.gestureTimerRef);
        this.gestureTimerRef = null;
      }

      this.gestureDetectionStartRef = null;
      this.progressModel.resetGestureDetection();
      this.updateView();
      return;
    }

    // Update detected gesture and confidence
    this.progressModel.setDetectedGesture(gesture, confidenceValue);
    this.updateView();

    // Only process if we're in detecting state
    if (
      this.progressModel.gameState === this.progressModel.GAME_STATES.DETECTING
    ) {
      const currentLetter =
        this.susunKataModel.letters[this.susunKataModel.currentIndex];

      // Check if the gesture matches the current letter
      if (gesture === currentLetter) {
        // Set correct gesture state
        this.progressModel.setCorrectGesture(true);
        this.progressModel.setIncorrectGesture(false);
        this.updateView();

        // If this is the first detection of this gesture or continuing detection
        if (!this.gestureDetectionStartRef) {
          console.log("Starting correct gesture detection for:", gesture);

          // Reset any existing timer
          if (this.gestureTimerRef) {
            clearInterval(this.gestureTimerRef);
          }

          // Start a new detection sequence
          this.gestureDetectionStartRef = Date.now();
          this.progressModel.setGestureDetectionProgress(0);
          this.updateView();

          // Start progress timer
          const GESTURE_DETECTION_TIME = 2000; // 2 seconds
          const GESTURE_THRESHOLD = 0.6; // 60% confidence threshold

          this.gestureTimerRef = setInterval(() => {
            const elapsed = Date.now() - this.gestureDetectionStartRef;
            const progress = Math.min(elapsed / GESTURE_DETECTION_TIME, 1);
            this.progressModel.setGestureDetectionProgress(progress);
            this.updateView();

            // If we've reached the time requirement and confidence threshold
            if (progress >= 1 && confidenceValue >= GESTURE_THRESHOLD) {
              console.log("Gesture completed successfully:", gesture);
              clearInterval(this.gestureTimerRef);
              this.gestureTimerRef = null;
              this.gestureDetectionStartRef = null;

              // Show correct gesture feedback animation
              this.showCorrectGestureFeedback();

              // Move to next letter with animation
              this.moveToNextLetter();
            }
          }, 100);
        }
      } else {
        // Set incorrect gesture state
        this.progressModel.setCorrectGesture(false);
        this.progressModel.setIncorrectGesture(true);
        this.updateView();

        // If we were detecting a gesture but got a different one, reset the timer
        if (this.gestureTimerRef) {
          console.log(
            "Incorrect gesture detected:",
            gesture,
            "expected:",
            currentLetter
          );
          clearInterval(this.gestureTimerRef);
          this.gestureTimerRef = null;
          this.gestureDetectionStartRef = null;
          this.progressModel.setGestureDetectionProgress(0);
          this.updateView();

          // Show incorrect feedback animation
          this.showIncorrectGestureFeedback();
        }
      }
    }
  }

  async submitCompletedWords() {
    const { completedWordIds } = this.susunKataModel;

    if (completedWordIds.length === 0) {
      // Don't submit if no words were completed
      return;
    }

    try {
      // Submit session to backend
      await apiClient.post("/words/submit-session", {
        word_ids: completedWordIds,
      });
      console.log("Session submitted successfully");

      // Fetch updated user profile to get latest best score
      await this.fetchUserProfile();
    } catch (error) {
      console.error("Error submitting session:", error);
    }
  }

  cleanup() {
    if (this.gestureTimerRef) {
      clearInterval(this.gestureTimerRef);
    }
    if (this.animationTimeoutRef) {
      clearTimeout(this.animationTimeoutRef);
    }
  }
}

export default SusunKataPresenter;
