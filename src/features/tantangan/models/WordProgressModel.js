class WordProgressModel {
  constructor() {
    this.GAME_STATES = {
      IDLE: "idle",
      DETECTING: "detecting",
      TRANSITIONING: "transitioning",
      COMPLETED: "completed",
    };

    this.gameState = this.GAME_STATES.IDLE;
    this.detectedGesture = null;
    this.gestureConfidence = 0;
    this.gestureDetectionProgress = 0;
    this.isCorrectGesture = false;
    this.isIncorrectGesture = false;
    this.correctGesture = false;
    this.incorrectGesture = false;
    this.showSuccessMessage = false;
  }

  setGameState(state) {
    this.gameState = state;
  }

  setDetectedGesture(gesture, confidence) {
    this.detectedGesture = gesture;
    this.gestureConfidence = confidence;
  }

  setGestureDetectionProgress(progress) {
    this.gestureDetectionProgress = progress;
  }

  setCorrectGesture(isCorrect) {
    this.isCorrectGesture = isCorrect;
    this.correctGesture = isCorrect;
  }

  setIncorrectGesture(isIncorrect) {
    this.isIncorrectGesture = isIncorrect;
    this.incorrectGesture = isIncorrect;
  }

  resetGestureDetection() {
    this.detectedGesture = null;
    this.gestureConfidence = 0;
    this.gestureDetectionProgress = 0;
    this.isCorrectGesture = false;
    this.isIncorrectGesture = false;
    this.correctGesture = false;
    this.incorrectGesture = false;
  }

  setShowSuccessMessage(show) {
    this.showSuccessMessage = show;
  }
}

export default WordProgressModel;
