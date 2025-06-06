import React, { useState } from "react";

// Komponen untuk ikon mahkota/bintang di atas avatar juara 1
const CrownIcon = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    // Edit -top-3.5 untuk mengatur posisi vertikal bintang
    className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.624c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007Z"
      clipRule="evenodd"
    />
  </svg>
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

    let badgeColorClass = "bg-blue-500";
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

  let baseColorClass = "bg-blue-600/90";
  let borderColorClass = "border-blue-400";
  let shadowClass = "shadow-[0_0_15px_2px_rgba(96,165,250,0.4)]";
  let avatarSizeClass = "w-16 h-16 md:w-20 md:h-20";
  let barHeightClass = "h-28 md:h-32";
  let scoreTextSizeClass = "text-2xl md:text-2xl"; // Ukuran font skor default
  let nameTextSizeClass = "text-sm md:text-base";
  let usernameTextSizeClass = "text-xs md:text-sm opacity-80";

  // Edit nilai ini untuk mengatur seberapa banyak avatar "tenggelam" atau "naik"
  const avatarOverlapMargin = "-mb-8 md:-mb-5";
  // Pastikan padding ini cukup untuk avatarOverlapMargin + tinggi badge
  const barTopPadding = "pt-10 md:pt-8";

  if (position === 1) {
    baseColorClass = "bg-yellow-500/90";
    borderColorClass = "border-yellow-400";
    shadowClass = "shadow-[0_0_20px_5px_rgba(250,204,21,0.5)]";
    avatarSizeClass = "w-20 h-20 md:w-24 md:h-24";
    barHeightClass = "h-36 md:h-40";
    nameTextSizeClass = "text-base md:text-lg";
  }

  const scoreString = String(safeUser.score);
  // Logika pengecilan font skor jika jumlah digit terlalu banyak
  if (scoreString.length > 6) {
    scoreTextSizeClass = "text-xl md:text-2xl";
  } else if (scoreString.length > 5) {
    // Untuk 6-7 digit
    scoreTextSizeClass = "text-2xl md:text-3xl";
  }
  // Untuk <= 5 digit, akan menggunakan default awal (text-2xl md:text-3xl)

  return (
    <div className="flex flex-col items-center w-28 md:w-36 mx-1 md:mx-2">
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
                      flex flex-col justify-start items-center text-white p-3 ${barTopPadding} text-center`}
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
        {/* PERBAIKAN: Typo margin bawah diperbaiki. Gunakan nilai kecil seperti mb-2 atau mb-3. */}
        {/* Pastikan leading-normal atau sejenisnya agar teks tidak terlalu rapat vertikal */}
        <p
          className={`${scoreTextSizeClass} font-bold break-all leading-normal mb-2 md:mb-3`}
        >
          {scoreString}
        </p>
      </div>
    </div>
  );
};

// Komponen utama LeaderboardPodium (Tidak diubah sesuai permintaan terakhir Anda)
const LeaderboardPodium = ({ topUsers }) => {
  if (!topUsers || topUsers.length === 0) {
    return (
      <div className="my-10 text-center text-gray-500">
        Podium belum tersedia.
      </div>
    );
  }

  const user1 = topUsers[0];
  const user2 = topUsers[1];
  const user3 = topUsers[2];

  return (
    <div className="my-10">
      <div className="flex justify-center items-end space-x-1 md:space-x-2">
        {user2 && (
          <div className="order-2 md:order-1">
            <PodiumStep user={user2} position={2} />
          </div>
        )}
        {user1 && (
          <div className="order-1 md:order-2">
            <PodiumStep user={user1} position={1} />
          </div>
        )}
        {user3 && user1 && user2 && (
          <div className="order-3 md:order-3">
            <PodiumStep user={user3} position={3} />
          </div>
        )}
        {user3 && user1 && !user2 && (
          <div className="order-3 md:order-3">
            <PodiumStep user={user3} position={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LeaderboardPodium);
