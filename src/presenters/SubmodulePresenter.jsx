import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearningModel from "../models/LearningModel";
import SubmoduleView from "../views/SubmoduleView";
import apiClient from "../services/api/apiClient";

const SubmodulePresenter = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [submodules, setSubmodules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");

  // Ref untuk model
  const modelRef = useRef(null);

  // Inisialisasi model hanya sekali
  if (!modelRef.current) {
    modelRef.current = new LearningModel();
  }

  useEffect(() => {
    const fetchSubmodules = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/progress/sub");

        // Filter submodules berdasarkan module_id dari parameter URL
        const filteredSubmodules = response.filter(
          (submodule) => submodule.module_id === parseInt(moduleId)
        );

        setSubmodules(filteredSubmodules);

        // Set judul modul berdasarkan data pertama (jika ada)
        if (filteredSubmodules.length > 0) {
          setModuleTitle(
            `Modul ${moduleId}: ${filteredSubmodules
              .map((s) => s.name)
              .join(", ")}`
          );
        } else {
          setModuleTitle(`Modul ${moduleId}`);
        }
      } catch (err) {
        console.error("Gagal mengambil data submodul:", err);
        setError("Gagal memuat data submodul");
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      fetchSubmodules();
    }
  }, [moduleId]);

  const handleBackClick = () => {
    navigate("/belajar");
  };

  const handleSubmoduleClick = (submodule) => {
    // Simpan moduleId di localStorage sebelum navigasi
    localStorage.setItem("activeModuleId", moduleId);
    navigate(`/praktek/${submodule.id}`);
  };

  return (
    <SubmoduleView
      moduleTitle={moduleTitle}
      submodules={submodules}
      isLoading={isLoading}
      error={error}
      handleBackClick={handleBackClick}
      handleSubmoduleClick={handleSubmoduleClick}
    />
  );
};

export default SubmodulePresenter;
