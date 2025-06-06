import React, { useState } from "react";

const UserRank = ({ userRank, isOutsideTopRanks = false }) => {
  const [imgError, setImgError] = useState(false);

  // Jika userRank tidak valid, return null
  if (!userRank) return null;

  // Pastikan best_score ada dan bukan 0 jika ini bukan data dummy
  const score = userRank.best_score || userRank.score || 0;

  // Gunakan avatar default jika terjadi error
  const avatarUrl = imgError
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userRank.name || userRank.username
      )}&background=random`
    : userRank.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userRank.username
      )}`;

  return (
    <div className="bg-blue-700/50 rounded-xl border border-blue-500/50 overflow-hidden backdrop-blur-sm shadow-lg mb-6">
      <div className="p-4 bg-blue-600/30 border-b border-blue-500/50 flex justify-between items-center">
        <h2 className="font-bold text-lg">Peringkat Anda</h2>
        {isOutsideTopRanks && (
          <span className="text-xs bg-blue-800/70 text-blue-300 px-2 py-1 rounded">
            Di luar peringkat teratas
          </span>
        )}
      </div>
      <div className="flex items-center p-4 hover:bg-blue-600/20 transition-colors">
        <span className="text-sm text-blue-300 w-6 text-center mr-2">
          {isOutsideTopRanks
            ? (userRank.rank ? userRank.rank : ">10") + "."
            : userRank.rank + "."}
        </span>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400/50 mr-4">
          <img
            src={avatarUrl}
            alt={userRank.name || userRank.username}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold">{userRank.name || userRank.username}</h3>
          <p className="text-blue-300 text-sm">@{userRank.username}</p>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-yellow-400">{score}</span>
          <span className="text-xs text-blue-300">
            {isOutsideTopRanks ? "Terus berlatih!" : "Bagus!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserRank);
