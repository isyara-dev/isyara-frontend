import React, { useState } from "react";

const UserRank = ({ userRank, isOutsideTopRanks = false }) => {
  const [imgError, setImgError] = useState(false);

  // Jika userRank tidak valid, return null
  if (!userRank) return null;

  // Pastikan pengambilan skor yang benar
  // Prioritaskan score langsung dari userRank, kemudian best_score jika ada
  const score = userRank.score || userRank.best_score || 0;

  // Gunakan avatar default jika terjadi error
  const avatarUrl = imgError
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userRank.name || userRank.username
      )}&background=random`
    : userRank.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userRank.username
      )}`;

  // Tampilkan rank sebagai "-" jika user tidak masuk top 10
  const displayRank = isOutsideTopRanks ? "-" : `${userRank.rank}.`;

  return (
    <div className="bg-secondary/80 rounded-xl border border-third/50 overflow-hidden backdrop-blur-sm shadow-lg mb-6">
      <div className="p-4 bg-secondary/50 border-b border-third/50 flex justify-between items-center">
        <h2 className="font-bold text-lg">Peringkat Anda</h2>
        {isOutsideTopRanks && (
          <span className="text-xs text-third px-2 py-1">
            Di luar peringkat teratas
          </span>
        )}
      </div>
      <div className="flex items-center p-4 hover:bg-secondary/20 transition-colors">
        <span className="text-sm text-white w-6 text-center mr-2">
          {displayRank}
        </span>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
          <img
            src={avatarUrl}
            alt={userRank.name || userRank.username}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold">{userRank.name || userRank.username}</h3>
          <p className="text-white/70 text-sm">@{userRank.username}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-24">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserRank);
