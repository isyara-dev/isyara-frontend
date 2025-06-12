import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PracticeModel from "../model/PracticeModel";
import GestureDetectionModel from "../../../gesture/models/GestureDetectionModel";
import PracticePresenter from "../presenter/PracticePresenter";
import PracticeView from "../view/PracticeView";

function PracticePage() {
  const navigate = useNavigate();
  const { subModuleId } = useParams();

  // Buat model dan state untuk memaksa re-render
  const [, setRenderTrigger] = useState({});
  const practiceModel = useRef(new PracticeModel()).current;
  const gestureModel = useRef(new GestureDetectionModel()).current;

  // Buat presenter dengan fungsi update view
  const presenterRef = useRef(null);

  // Inisialisasi presenter
  useEffect(() => {
    const updateView = () => {
      setRenderTrigger({});
    };

    presenterRef.current = new PracticePresenter(
      practiceModel,
      gestureModel,
      updateView
    );

    // Fetch data
    presenterRef.current.fetchSubModuleData(subModuleId);

    // Cleanup
    return () => {
      presenterRef.current.cleanup();
    };
  }, [practiceModel, gestureModel, subModuleId]);

  // Handler untuk gesture detection
  const handleGestureDetected = useCallback((gesture, confidence) => {
    if (presenterRef.current) {
      presenterRef.current.handleGestureDetected(gesture, confidence);
    }
  }, []);

  // Handler untuk back button
  const handleBackClick = useCallback(() => {
    const { moduleId } = practiceModel;
    if (moduleId) {
      localStorage.setItem("activeModuleId", moduleId.toString());
      navigate(`/belajar`);
    } else {
      navigate("/belajar");
      console.warn(
        "moduleId tidak ditemukan, kembali ke halaman belajar utama."
      );
    }
  }, [navigate, practiceModel]);

  // Handler untuk next button
  const handleNextClick = useCallback(() => {
    const { currentSubModule, allSubModules, moduleId } = practiceModel;
    if (!currentSubModule || !allSubModules.length) return;

    // Find current index in allSubModules
    const currentIndex = allSubModules.findIndex(
      (sub) => sub.id === currentSubModule.id
    );

    // Check if we have a next submodule in our list
    if (currentIndex < allSubModules.length - 1) {
      const nextSubModule = allSubModules[currentIndex + 1];

      // Gunakan loadNewSubmodule untuk mencegah refresh kamera
      presenterRef.current.loadNewSubmodule(nextSubModule.id);

      // Update URL tanpa refresh halaman
      window.history.pushState({}, "", `/praktek/${nextSubModule.id}`);
    } else {
      // If we've reached the end of the submodules, go back to the module page
      if (moduleId) {
        localStorage.setItem("activeModuleId", moduleId.toString());
      }
      navigate(`/belajar`);
    }
  }, [navigate, practiceModel]);

  // Handler untuk tombol sebelumnya
  const handlePrevClick = useCallback(() => {
    const { currentSubModule, allSubModules, moduleId } = practiceModel;
    if (!currentSubModule || !allSubModules.length) return;

    // Find current index in allSubModules
    const currentIndex = allSubModules.findIndex(
      (sub) => sub.id === currentSubModule.id
    );

    // Check if we have a previous submodule
    if (currentIndex > 0) {
      const prevSubModule = allSubModules[currentIndex - 1];

      // Gunakan loadNewSubmodule untuk mencegah refresh kamera
      presenterRef.current.loadNewSubmodule(prevSubModule.id);

      // Update URL tanpa refresh halaman
      window.history.pushState({}, "", `/praktek/${prevSubModule.id}`);
    }
  }, [practiceModel]);

  return (
    <PracticeView
      practiceModel={practiceModel}
      gestureModel={gestureModel}
      onGestureDetected={handleGestureDetected}
      onBackClick={handleBackClick}
      onNextClick={handleNextClick}
      onPrevClick={handlePrevClick}
    />
  );
}

export default PracticePage;
