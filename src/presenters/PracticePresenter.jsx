import apiClient from "../services/api/apiClient";
import GestureDetectionService from "../services/gesture/GestureDetectionService";

class PracticePresenter {
  constructor(practiceModel, gestureModel, updateView) {
    this.practiceModel = practiceModel;
    this.gestureModel = gestureModel;
    this.updateView = updateView;
    this.gestureService = new GestureDetectionService();

    // Refs untuk state tracking
    this.gestureTimerRef = null;
    this.gestureDetectionStartRef = null;
    this.completedRef = false;
  }

  async fetchSubModuleData(subModuleId) {
    try {
      this.practiceModel.setLoading(true);
      this.updateView();

      // Fetch all submodules
      const allSubModulesData = await apiClient.get("/progress/sub");

      // Find the current submodule
      const currentSub = allSubModulesData.find(
        (sub) => sub.id === parseInt(subModuleId)
      );

      if (!currentSub) {
        throw new Error("Submodul tidak ditemukan");
      }

      // Filter all submodules in the same module
      const sameModuleSubModules = allSubModulesData.filter(
        (sub) => sub.module_id === currentSub.module_id
      );

      // Sort by order_index
      sameModuleSubModules.sort((a, b) => a.order_index - b.order_index);

      // Update model
      this.practiceModel.setSubModuleData(currentSub, sameModuleSubModules);

      // Store moduleId in localStorage for navigation back
      localStorage.setItem("activeModuleId", currentSub.module_id.toString());

      // Fetch hint for the current letter
      await this.fetchHint(currentSub.name);

      // Fetch module data untuk mendapatkan nama modul
      try {
        const modules = await apiClient.get("/progress/modules");
        const moduleData = modules.find(
          (m) => m.module_id === currentSub.module_id
        );
        if (moduleData) {
          this.practiceModel.moduleName = moduleData.module_name;
        }
      } catch (moduleError) {
        console.error("Error fetching module name:", moduleError);
        this.practiceModel.moduleName = `Modul ${currentSub.module_id}`;
      }

      this.practiceModel.setLoading(false);
      this.gestureModel.setGameState(this.gestureModel.GAME_STATES.DETECTING);
      this.updateView();
    } catch (error) {
      console.error("Error fetching submodule data:", error);
      this.practiceModel.setLoading(false);
      this.updateView();
    }
  }

  async fetchHint(letter) {
    if (!letter) return;

    const hint = await this.gestureService.fetchHint(letter);
    this.practiceModel.setHint(hint);
    this.updateView();
  }

  async updateProgress() {
    const { currentSubModule } = this.practiceModel;
    if (
      !currentSubModule ||
      currentSubModule.is_completed ||
      this.practiceModel.progressUpdated
    ) {
      return;
    }

    try {
      console.log("Updating progress for submodule:", currentSubModule.id);
      const response = await apiClient.post("/progress", {
        sub_module_id: currentSubModule.id,
        is_completed: true,
      });

      console.log("Progress updated:", response);
      this.practiceModel.markAsCompleted();
      this.updateView();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }

  handleLetterCompletion() {
    console.log("Handling letter completion...");
    if (!this.completedRef) {
      this.completedRef = true;

      // Update progress to API if not completed yet
      this.updateProgress();

      // Show success message
      this.gestureModel.setShowSuccessMessage(true);
      this.updateView();

      // Hide success message after a shorter delay
      setTimeout(() => {
        this.gestureModel.setShowSuccessMessage(false);
        this.gestureModel.setCorrectGesture(false);
        this.gestureModel.setGameState(this.gestureModel.GAME_STATES.DETECTING);
        this.completedRef = false;
        this.gestureModel.resetGestureDetection();
        this.updateView();
      }, 1000);
    }
  }

  showCorrectGestureFeedback() {
    this.gestureModel.setCorrectGesture(true);
    this.gestureService.playCorrectSound();
    this.updateView();
  }

  showIncorrectGestureFeedback() {
    this.gestureModel.setIncorrectGesture(true);
    this.updateView();

    // Reset after animation completes
    setTimeout(() => {
      this.gestureModel.setIncorrectGesture(false);
      this.updateView();
    }, 300);
  }

  handleGestureDetected(gesture, confidenceValue) {
    // Don't process gestures if we're in completed state
    if (
      this.gestureModel.gameState === this.gestureModel.GAME_STATES.COMPLETED ||
      this.completedRef
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
      this.gestureModel.resetGestureDetection();
      this.updateView();
      return;
    }

    // Update detected gesture and confidence
    this.gestureModel.setDetectedGesture(gesture, confidenceValue);
    this.updateView();

    // Only process if we're in detecting state
    if (
      this.gestureModel.gameState === this.gestureModel.GAME_STATES.DETECTING
    ) {
      // Check if the gesture matches the current letter
      if (gesture === this.practiceModel.currentLetter) {
        // Set correct gesture state
        this.gestureModel.setCorrectGesture(true);
        this.gestureModel.setIncorrectGesture(false);
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
          this.gestureModel.setGestureDetectionProgress(0);
          this.updateView();

          // Start progress timer
          this.gestureTimerRef = setInterval(() => {
            const elapsed = Date.now() - this.gestureDetectionStartRef;
            const progress = Math.min(
              elapsed / this.gestureModel.detectionTime,
              1
            );
            this.gestureModel.setGestureDetectionProgress(progress);
            this.updateView();

            // If we've reached the time requirement and confidence threshold
            if (
              progress >= 1 &&
              confidenceValue >= this.gestureModel.threshold
            ) {
              console.log("Gesture completed successfully:", gesture);
              clearInterval(this.gestureTimerRef);
              this.gestureTimerRef = null;
              this.gestureDetectionStartRef = null;

              // Show correct gesture feedback animation
              this.showCorrectGestureFeedback();

              // Mark as completed
              this.gestureModel.setGameState(
                this.gestureModel.GAME_STATES.COMPLETED
              );
              this.handleLetterCompletion();
            }
          }, 100);
        }
      } else {
        // Set incorrect gesture state
        this.gestureModel.setCorrectGesture(false);
        this.gestureModel.setIncorrectGesture(true);
        this.updateView();

        // If we were detecting a gesture but got a different one, reset the timer
        if (this.gestureTimerRef) {
          console.log(
            "Incorrect gesture detected:",
            gesture,
            "expected:",
            this.practiceModel.currentLetter
          );
          clearInterval(this.gestureTimerRef);
          this.gestureTimerRef = null;
          this.gestureDetectionStartRef = null;
          this.gestureModel.setGestureDetectionProgress(0);
          this.updateView();

          // Show incorrect feedback animation
          this.showIncorrectGestureFeedback();
        }
      }
    }
  }

  cleanup() {
    if (this.gestureTimerRef) {
      clearInterval(this.gestureTimerRef);
    }
  }

  // Tambahkan method untuk memuat submodul baru tanpa refresh kamera
  async loadNewSubmodule(subModuleId) {
    try {
      // Set navigating state ke true
      this.practiceModel.setNavigating(true);
      this.updateView();

      // Simpan state gesture detection
      const previousGameState = this.gestureModel.gameState;

      // Fetch all submodules
      const allSubModulesData = await apiClient.get("/progress/sub");

      // Find the current submodule
      const currentSub = allSubModulesData.find(
        (sub) => sub.id === parseInt(subModuleId)
      );

      if (!currentSub) {
        throw new Error("Submodul tidak ditemukan");
      }

      // Filter all submodules in the same module
      const sameModuleSubModules = allSubModulesData.filter(
        (sub) => sub.module_id === currentSub.module_id
      );

      // Sort by order_index
      sameModuleSubModules.sort((a, b) => a.order_index - b.order_index);

      // Update model tanpa mengubah loading state
      this.practiceModel.updateSubModuleData(currentSub, sameModuleSubModules);

      // Store moduleId in localStorage for navigation back
      localStorage.setItem("activeModuleId", currentSub.module_id.toString());

      // Fetch hint for the current letter
      await this.fetchHint(currentSub.name);

      // Fetch module data untuk mendapatkan nama modul
      try {
        const modules = await apiClient.get("/progress/modules");
        const moduleData = modules.find(
          (m) => m.module_id === currentSub.module_id
        );
        if (moduleData) {
          this.practiceModel.moduleName = moduleData.module_name;
        }
      } catch (moduleError) {
        console.error("Error fetching module name:", moduleError);
        this.practiceModel.moduleName = `Modul ${currentSub.module_id}`;
      }

      // Kembalikan state gesture detection
      this.gestureModel.setGameState(previousGameState);

      // Set navigating state ke false
      this.practiceModel.setNavigating(false);
      this.updateView();
    } catch (error) {
      console.error("Error loading new submodule:", error);
      // Pastikan navigating state diatur ke false bahkan jika terjadi error
      this.practiceModel.setNavigating(false);
      this.updateView();
    }
  }
}

export default PracticePresenter;
