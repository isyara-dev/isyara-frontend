import React from "react";

function ScoreView({ currentPoints, bestScore, showBothOnMobile = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500  font-bold px-3 py-1.5 rounded-lg shadow-lg text-center">
        <div className="text-xs opacity-80">Skor</div>
        <div className="text-sm sm:text-base font-bold">{currentPoints}</div>
      </div>

      <div
        className={`${
          showBothOnMobile ? "" : "hidden sm:block"
        } bg-gradient-to-r from-purple-2 to-green-500 font-bold px-3 py-1.5 rounded-lg shadow-lg text-center`}
      >
        <div className="text-xs opacity-80">Terbaik</div>
        <div className="text-sm sm:text-base font-bold">{bestScore}</div>
      </div>
    </div>
  );
}

export default ScoreView;
