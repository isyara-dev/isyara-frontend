import apiClient from "../services/api/apiClient";

export default class LearningModel {
  constructor() {
    this.cache = {
      modules: null,
      submodules: null,
      timestamp: null,
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 menit
    this.FETCH_TIMEOUT = 10000; // 10 detik
    this.languageId = 1; // Default language ID adalah 1 (Bisindo)
  }

  isCacheValid() {
    return (
      this.cache.modules &&
      this.cache.timestamp &&
      Date.now() - this.cache.timestamp < this.CACHE_DURATION
    );
  }

  async fetchModules() {
    if (this.isCacheValid()) {
      console.log("LearningModel: Menggunakan data cache untuk modules");
      return this.cache.modules;
    }

    try {
      console.log("LearningModel: Melakukan fetch modules ke API");

      const fetchPromise = apiClient.get(`/progress/module/${this.languageId}`);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timeout")),
          this.FETCH_TIMEOUT
        )
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      if (data && Array.isArray(data)) {
        this.cache.modules = data;
        this.cache.timestamp = Date.now();
        return data;
      } else {
        throw new Error("Data modules tidak valid");
      }
    } catch (error) {
      console.error("LearningModel: Error saat fetch modules:", error);
      throw error;
    }
  }

  async fetchSubmodules(moduleId) {
    try {
      console.log(
        `LearningModel: Melakukan fetch submodules untuk modul ${moduleId}`
      );

      const fetchPromise = apiClient.get("/progress/sub");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timeout")),
          this.FETCH_TIMEOUT
        )
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      if (data && Array.isArray(data)) {
        // Filter submodules berdasarkan module_id yang aktif
        const filteredSubmodules = data.filter(
          (submodule) => submodule.module_id === parseInt(moduleId)
        );

        // Sort by order_index
        filteredSubmodules.sort((a, b) => a.order_index - b.order_index);

        this.cache.submodules = filteredSubmodules;
        return filteredSubmodules;
      } else {
        throw new Error("Data submodules tidak valid");
      }
    } catch (error) {
      console.error(
        `LearningModel: Error saat fetch submodules untuk modul ${moduleId}:`,
        error
      );
      throw error;
    }
  }

  getProgressPercentage(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  clearCache() {
    this.cache = {
      modules: null,
      submodules: null,
      timestamp: null,
    };
  }
}
