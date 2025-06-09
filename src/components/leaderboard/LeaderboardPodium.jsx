import React, { useState } from "react";
import { Crown } from "lucide-react";

// Komponen untuk ikon mahkota/bintang di atas avatar juara 1
const CrownIcon = React.memo(() => (
  <Crown
    size={24}
    className="text-yellow-400 absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
    fill="currentColor"
  />
));

// Komponen untuk menampilkan avatar pengguna beserta badge peringkat
const AvatarDisplay = React.memo(
  ({ user, position, borderColorClass, shadowClass, sizeClass }) => {
    const [imgError, setImgError] = useState(false);
    const safeUser = user || { name: "User", avatar: null };

    const avatarUrl =
      imgError || !safeUser.avatar
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
            safeUser.name
          )}&background=random&color=fff`
        : safeUser.avatar;

    let badgeColorClass = "bg-third";
    if (position === 1) badgeColorClass = "bg-yellow-500";
    else if (position === 3) badgeColorClass = "bg-green-500";

    return (
      <div
        className={`${sizeClass} rounded-full overflow-visible border-4 ${borderColorClass} ${shadowClass} relative flex-shrink-0`}
      >
        {position === 1 && <CrownIcon />}
        <img
          src={avatarUrl}
          alt={safeUser.name || "Avatar Pengguna"}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
        <div
          className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${badgeColorClass} w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm border-2 border-white z-10 shadow-sm`}
        >
          {position}
        </div>
      </div>
    );
  }
);

// Komponen untuk satu langkah podium (avatar + bar informasi)
const PodiumStep = ({ user, position }) => {
  const safeUser = user || { name: "Pengguna", username: "pengguna", score: 0 };

  let baseColorClass = "bg-secondary/90";
  let borderColorClass = "border-third";
  let shadowClass = "shadow-[0_0_15px_2px_rgba(96,165,250,0.4)]";
  let avatarSizeClass = "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20";
  let barHeightClass = "h-24 sm:h-28 md:h-32";
  let scoreTextSizeClass = "text-xl sm:text-2xl md:text-2xl";
  let nameTextSizeClass = "text-xs sm:text-sm md:text-base";
  let usernameTextSizeClass = "text-xs opacity-80";
  let contentColorClass = "text-white";

  const avatarOverlapMargin = "-mb-8 md:-mb-5";
  const barTopPadding = "pt-10 md:pt-8";

  if (position === 1) {
    borderColorClass = "border-yellow-400";
    contentColorClass = "text-yellow-400";
    shadowClass = "shadow-[0_0_20px_5px_rgba(250,204,21,0.5)]";
    avatarSizeClass = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24";
    barHeightClass = "h-28 sm:h-36 md:h-40";
    nameTextSizeClass = "text-sm sm:text-base md:text-lg";
  } else if (position === 3) {
    borderColorClass = "border-green-500";
    shadowClass = "shadow-[0_0_15px_2px_rgba(74,222,128,0.5)]";
  }

  const scoreString = String(safeUser.score);
  if (scoreString.length > 6) {
    scoreTextSizeClass = "text-lg sm:text-xl md:text-2xl";
  } else if (scoreString.length > 5) {
    scoreTextSizeClass = "text-xl sm:text-2xl md:text-3xl";
  }

  return (
    <div className="flex flex-col items-center w-24 sm:w-28 md:w-36 mx-1 md:mx-2">
      <div className={`relative z-10 ${avatarOverlapMargin}`}>
        <AvatarDisplay
          user={safeUser}
          position={position}
          borderColorClass={borderColorClass}
          shadowClass={shadowClass}
          sizeClass={avatarSizeClass}
        />
      </div>
      <div
        className={`w-full ${barHeightClass} ${baseColorClass} rounded-t-lg shadow-md flex-shrink-0 
                      flex flex-col justify-start items-center ${contentColorClass} p-2 sm:p-3 ${barTopPadding} text-center`}
      >
        <div className="flex flex-col items-center w-full">
          <h3
            className={`font-bold ${nameTextSizeClass} leading-tight truncate w-full`}
            title={safeUser.name}
          >
            {safeUser.name}
          </h3>
          <p
            className={`${usernameTextSizeClass} leading-tight truncate w-full mb-1`}
            title={`${safeUser.username}`}
          >
            {safeUser.username}
          </p>
        </div>
        <p
          className={`${scoreTextSizeClass} font-bold break-all leading-normal mb-1 sm:mb-2 md:mb-3`}
        >
          {scoreString}
        </p>
      </div>
    </div>
  );
};

// Komponen utama LeaderboardPodium
const LeaderboardPodium = ({ topUsers }) => {
  if (!topUsers || topUsers.length === 0) {
    return (
      <div className="my-10 text-center text-third">Podium belum tersedia.</div>
    );
  }

  const user1 = topUsers[0];
  const user2 = topUsers[1];
  const user3 = topUsers[2];

  return (
    <div className="my-6 sm:my-10 min-w-[320px]">
      <div className="flex flex-row justify-center items-end md:space-x-2">
        {/* Untuk mobile, gunakan flex-row dengan order yang berbeda dan pastikan rank 1 di tengah */}
        {user2 && (
          <div className="order-1 md:order-1 flex-shrink-0">
            <PodiumStep user={user2} position={2} />
          </div>
        )}
        {user1 && (
          <div className="order-2 md:order-2 flex-shrink-0 z-10">
            <PodiumStep user={user1} position={1} />
          </div>
        )}
        {user3 && (
          <div className="order-3 md:order-3 flex-shrink-0">
            <PodiumStep user={user3} position={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LeaderboardPodium);
