import apiClient from "../api/apiClient";

class GestureDetectionService {
  constructor(threshold = 0.6, detectionTime = 2000) {
    this.threshold = threshold;
    this.detectionTime = detectionTime;
  }

  async fetchHint(letter) {
    try {
      const res = await apiClient.get(`/hands/${letter}`);
      return res;
    } catch (error) {
      console.error(`Error fetching hint for letter ${letter}:`, error);
      return null;
    }
  }

  isCorrectGesture(detectedGesture, expectedGesture) {
    return detectedGesture === expectedGesture;
  }

  playCorrectSound() {
    // try {
    //   const audio = new Audio("/sounds/correct.mp3");
    //   audio.play().catch((e) => console.log("Audio play failed:", e));
    // } catch (error) {
    //   console.error("Error playing sound:", error);
    // }
  }
}

export default GestureDetectionService;
