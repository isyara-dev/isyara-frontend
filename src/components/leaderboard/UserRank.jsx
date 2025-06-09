import React, { useState, useEffect } from "react";
import apiClient from "../../services/api/apiClient";

const UserRank = ({ userRank, isOutsideTopRanks = false }) => {
  const [imgError, setImgError] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    score: 0,
    avatar_url: null,
    rank: "-",
  });
  const [loading, setLoading] = useState(true);

  // Effect untuk mengambil data user dari API auth/me dan mencocokkannya dengan leaderboard
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 1. Mengambil data user dari API auth/me
        const userResponse = await apiClient.get("/auth/me");
        console.log("UserRank - Data dari API auth/me:", userResponse);

        if (userResponse) {
          // 2. Ambil data profil dari API auth/me
          const name = userResponse.name || "User";
          const username = userResponse.username || "user";
          const score = userResponse.score || 0;
          const avatar_url = userResponse.avatar_url || null;

          // 3. Cari data rank dari leaderboard
          let rank = "-";
          let foundInLeaderboard = false;

          // 3a. Ambil data leaderboard langsung dari API
          try {
            const leaderboardData = await apiClient.get("/leaderboard");
            console.log("UserRank - Data leaderboard:", leaderboardData);

            if (leaderboardData && Array.isArray(leaderboardData)) {
              // Cari user dengan username yang sama
              const userInLeaderboard = leaderboardData.find(
                (user) => user.username === username
              );

              if (userInLeaderboard) {
                rank = userInLeaderboard.rank;
                foundInLeaderboard = true;
                console.log(
                  `UserRank - User '${username}' ditemukan di leaderboard dengan rank ${rank}`
                );
              } else {
                console.log(
                  `UserRank - User '${username}' tidak ditemukan di leaderboard`
                );
              }
            }
          } catch (leaderboardError) {
            console.error("Error fetching leaderboard data:", leaderboardError);
          }

          // 3b. Jika tidak ditemukan di leaderboard API, cek dari props userRank
          if (!foundInLeaderboard && userRank && userRank.rank) {
            rank = userRank.rank;
            console.log(
              "UserRank - Menggunakan rank dari props userRank:",
              rank
            );
          }
          // 3c. Jika masih tidak ada dan isOutsideTopRanks true, gunakan "-"
          else if (!foundInLeaderboard && isOutsideTopRanks) {
            rank = "-";
            console.log("UserRank - User di luar peringkat teratas");
          }
          // 3d. Jika tidak ada informasi sama sekali, gunakan "?"
          else if (!foundInLeaderboard) {
            rank = "?";
            console.log("UserRank - Tidak ada informasi rank");
          }

          // 4. Gabungkan data
          const combinedData = {
            name,
            username,
            score,
            avatar_url,
            rank,
          };

          console.log("UserRank - Data yang akan ditampilkan:", combinedData);
          setUserData(combinedData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userRank, isOutsideTopRanks]);

  // Jika masih loading, tampilkan skeleton
  if (loading) {
    return (
      <div className="bg-secondary/50 rounded-xl border border-third/50 overflow-hidden mb-6 backdrop-blur-sm shadow-lg animate-pulse min-w-[320px]">
        <div className="p-4 bg-secondary/30 border-b border-third/50 flex justify-between items-center">
          <div className="h-6 w-32 bg-third/40 rounded"></div>
          <div className="h-4 w-24 bg-third/40 rounded"></div>
        </div>
        <div className="flex items-center p-4">
          <div className="h-5 w-5 bg-third/40 rounded mr-2"></div>
          <div className="w-10 h-10 rounded-full bg-third/40 mr-4"></div>
          <div className="flex-1">
            <div className="h-5 w-32 bg-third/40 rounded mb-2"></div>
            <div className="h-4 w-24 bg-third/40 rounded"></div>
          </div>
          <div className="h-6 w-12 bg-third/40 rounded"></div>
        </div>
      </div>
    );
  }

  // Gunakan avatar default jika terjadi error atau tidak ada avatar
  const avatarUrl =
    imgError || !userData.avatar_url
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&background=random`
      : userData.avatar_url;

  return (
    <div className="bg-secondary/80 rounded-xl border border-third/50 overflow-hidden backdrop-blur-sm shadow-lg mb-6 min-w-[320px]">
      <div className="p-4 bg-secondary/50 border-b border-third/50 flex justify-between items-center">
        <h2 className="font-bold text-lg">Peringkat Anda</h2>
        {userData.rank === "-" && (
          <span className="text-xs text-third px-2 py-1">
            Di luar peringkat teratas
          </span>
        )}
      </div>
      <div className="flex items-center p-4 hover:bg-secondary/20 transition-colors">
        <span className="text-sm text-white w-6 text-center mr-2">
          {userData.rank}
        </span>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
          <img
            src={avatarUrl}
            alt={userData.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate">{userData.name}</h3>
          <p className="text-white/70 text-sm truncate">@{userData.username}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-16 sm:w-24 flex-shrink-0 ml-2">
          <span className="text-lg sm:text-xl font-bold text-white">
            {userData.score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserRank);
