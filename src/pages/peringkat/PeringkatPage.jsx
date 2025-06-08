import React from "react";
import LeaderboardPresenter from "../../presenters/LeaderboardPresenter";
import ErrorBoundary from "../../components/common/ErrorBoundary";

const PeringkatPage = () => {
  console.log("PeringkatPage: Rendering LeaderboardPresenter");
  return (
    <ErrorBoundary>
      <LeaderboardPresenter />
    </ErrorBoundary>
  );
};

export default PeringkatPage;
