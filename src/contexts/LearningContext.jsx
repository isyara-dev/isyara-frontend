import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../services/api/apiClient";

// Create the learning context
const LearningContext = createContext();

export const useLearning = () => {
  return useContext(LearningContext);
};

export const LearningProvider = ({ children }) => {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isLoadingSubmodules, setIsLoadingSubmodules] = useState(false);
  const [error, setError] = useState(null);

  // Default language ID adalah 1 (Bisindo)
  const languageId = 1;

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const response = await apiClient.get(`/progress/module/${languageId}`);
        setModules(response || []);
      } catch (err) {
        console.error("Gagal mengambil data modul:", err);
        setError("Gagal memuat data modul");
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, [languageId]);

  // Fetch submodules when a module is selected
  useEffect(() => {
    const fetchSubmodules = async () => {
      if (!activeModuleId) return;

      try {
        setIsLoadingSubmodules(true);
        const response = await apiClient.get("/progress/sub");

        // Filter submodules berdasarkan module_id yang aktif
        const filteredSubmodules = response.filter(
          (submodule) => submodule.module_id === parseInt(activeModuleId)
        );

        // Sort by order_index
        filteredSubmodules.sort((a, b) => a.order_index - b.order_index);
        setSubmodules(filteredSubmodules);
      } catch (err) {
        console.error("Gagal mengambil data submodul:", err);
        setError("Gagal memuat data submodul");
      } finally {
        setIsLoadingSubmodules(false);
      }
    };

    fetchSubmodules();
  }, [activeModuleId]);

  // Utility functions
  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Handle module selection
  const handleModuleClick = (moduleId) => {
    setActiveModuleId(moduleId);
    // Simpan di localStorage untuk persistensi
    localStorage.setItem("activeModuleId", moduleId.toString());
  };

  // Handle back to modules
  const handleBackToModules = () => {
    setActiveModuleId(null);
    setSubmodules([]);
    // Hapus dari localStorage
    localStorage.removeItem("activeModuleId");
  };

  // Restore state from localStorage on initial load
  useEffect(() => {
    const storedModuleId = localStorage.getItem("activeModuleId");
    if (storedModuleId) {
      setActiveModuleId(parseInt(storedModuleId));
    }
  }, []);

  // Value yang akan dishare ke komponen lain
  const value = {
    activeModuleId,
    modules,
    submodules,
    isLoadingModules,
    isLoadingSubmodules,
    error,
    getProgressPercentage,
    handleModuleClick,
    handleBackToModules,
    setActiveModuleId,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
