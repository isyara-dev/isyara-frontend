class PracticeModel {
  constructor() {
    this.currentSubModule = null;
    this.allSubModules = [];
    this.moduleId = null;
    this.moduleName = "";
    this.currentLetter = "";
    this.currentHint = null;
    this.isLoading = true;
    this.progressUpdated = false;
    this.isNavigating = false;
  }

  setSubModuleData(currentSub, allSubs) {
    this.currentSubModule = currentSub;
    this.currentLetter = currentSub.name;
    this.moduleId = currentSub.module_id;
    this.allSubModules = allSubs;
  }

  updateSubModuleData(currentSub, allSubs) {
    this.currentSubModule = currentSub;
    this.currentLetter = currentSub.name;
    this.moduleId = currentSub.module_id;
    this.allSubModules = allSubs;
  }

  setHint(hint) {
    this.currentHint = hint;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  markAsCompleted() {
    this.currentSubModule = {
      ...this.currentSubModule,
      is_completed: true,
    };
    this.progressUpdated = true;
  }

  getNextSubModule() {
    if (!this.currentSubModule || !this.allSubModules.length) return null;

    const currentIndex = this.allSubModules.findIndex(
      (sub) => sub.id === this.currentSubModule.id
    );

    if (currentIndex < this.allSubModules.length - 1) {
      return this.allSubModules[currentIndex + 1];
    }

    return null;
  }

  getPrevSubModule() {
    if (!this.currentSubModule || !this.allSubModules.length) return null;

    const currentIndex = this.allSubModules.findIndex(
      (sub) => sub.id === this.currentSubModule.id
    );

    if (currentIndex > 0) {
      return this.allSubModules[currentIndex - 1];
    }

    return null;
  }

  setNavigating(isNavigating) {
    this.isNavigating = isNavigating;
  }
}

export default PracticeModel;
