import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LearningModel from "../../core/models/LearningModel";
import BelajarView from "../view/BelajarView";

const BelajarPresenter = () => {
  const navigate = useNavigate();
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isLoadingSubmodules, setIsLoadingSubmodules] = useState(false);
  const [error, setError] = useState(null);

  // Ref untuk model
  const modelRef = useRef(null);

  // Inisialisasi model hanya sekali
  if (!modelRef.current) {
    modelRef.current = new LearningModel();
  }

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const data = await modelRef.current.fetchModules();
        setModules(data || []);
      } catch (err) {
        console.error("Gagal mengambil data modul:", err);
        setError("Gagal memuat data modul");
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  // Fetch submodules when a module is selected
  useEffect(() => {
    const fetchSubmodules = async () => {
      if (!activeModuleId) return;

      try {
        setIsLoadingSubmodules(true);
        const data = await modelRef.current.fetchSubmodules(activeModuleId);
        setSubmodules(data);
      } catch (err) {
        console.error("Gagal mengambil data submodul:", err);
        setError("Gagal memuat data submodul");
      } finally {
        setIsLoadingSubmodules(false);
      }
    };

    fetchSubmodules();
  }, [activeModuleId]);

  // Restore state from localStorage on initial load
  useEffect(() => {
    const storedModuleId = localStorage.getItem("activeModuleId");
    if (storedModuleId) {
      setActiveModuleId(parseInt(storedModuleId));
    }
  }, []);

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

  // Handle submodule click
  const handleSubmoduleClick = (submodule) => {
    // Simpan moduleId di localStorage sebelum navigasi
    localStorage.setItem("lastModuleId", submodule.module_id.toString());
    navigate(`/praktek/${submodule.id}`);
  };

  // Handle challenge click
  const handleChallengeClick = () => {
    navigate("/susun-kata");
  };

  // Calculate progress percentage
  const getProgressPercentage = (completed, total) => {
    return modelRef.current.getProgressPercentage(completed, total);
  };

  return (
    <BelajarView
      activeModuleId={activeModuleId}
      modules={modules}
      submodules={submodules}
      isLoadingModules={isLoadingModules}
      isLoadingSubmodules={isLoadingSubmodules}
      error={error}
      getProgressPercentage={getProgressPercentage}
      handleModuleClick={handleModuleClick}
      handleBackToModules={handleBackToModules}
      handleSubmoduleClick={handleSubmoduleClick}
      handleChallengeClick={handleChallengeClick}
    />
  );
};

export default BelajarPresenter;
