import React from "react";

function GestureStatusDisplay({
  detectedGesture,
  gestureConfidence,
  isCorrectGesture,
  isIncorrectGesture,
  gestureDetectionProgress,
}) {
  return (
    <div
      className={`absolute top-4 left-4 px-3 py-1 rounded transition-all duration-300
        ${
          detectedGesture
            ? isCorrectGesture
              ? "bg-green-500/70"
              : isIncorrectGesture
              ? "bg-red-500/70"
              : "bg-black/50"
            : "bg-black/50"
        }`}
    >
      {detectedGesture ? (
        <>
          <div className="flex items-center justify-between">
            <span>{`Terdeteksi: ${detectedGesture}`}</span>
            <span className="ml-2">
              {`${Math.round(gestureConfidence * 100)}%`}
            </span>
          </div>
          {isCorrectGesture && (
            <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-100"
                style={{
                  width: `${gestureDetectionProgress * 100}%`,
                }}
              ></div>
            </div>
          )}
        </>
      ) : (
        "Tidak ada gerakan terdeteksi"
      )}
    </div>
  );
}

export default GestureStatusDisplay;
