import React from "react";

function ScoreView({ currentPoints, bestScore }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-blue-600/80 px-4 py-2 rounded font-bold">
        <div className="text-xs opacity-80">Current</div>
        <div className="text-lg font-bold">{currentPoints} pts</div>
      </div>

      <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        Best Score: {bestScore}
      </div>
    </div>
  );
}

export default ScoreView;
