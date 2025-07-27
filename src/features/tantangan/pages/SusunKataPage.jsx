// features/susunkata/SusunKataPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import SusunKataModel from "../models/SusunKataModel";
import WordProgressModel from "../models/WordProgressModel";
import SusunKataPresenter from "../presenters/SusunKataPresenter";
import SusunKataView from "../views/SusunKataView";

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

    // Fetch random word dengan delay untuk memastikan kamera sudah siap
    setTimeout(() => {
      presenterRef.current.fetchRandomWord();
    }, 500);

    // Cleanup
    return () => {
      console.log("SusunKataPage: UNMOUNTING, cleanup should run now!");
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
  const handleFinishClick = useCallback(async () => {
    if (presenterRef.current && susunKataModel.points > 0) {
      // Submit completed words before navigating away
      presenterRef.current.submitCompletedWords();
    }
    navigate("/belajar");
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
