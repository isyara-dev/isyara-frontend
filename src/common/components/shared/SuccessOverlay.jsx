import React from "react";

function SuccessOverlay({ show, message, subMessage }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center z-20">
      <div className="text-4xl font-bold mb-4">Berhasil!</div>
      {message && <div className="text-2xl">{message}</div>}
      {subMessage && <div className="text-xl mt-2">{subMessage}</div>}
    </div>
  );
}

export default SuccessOverlay;
