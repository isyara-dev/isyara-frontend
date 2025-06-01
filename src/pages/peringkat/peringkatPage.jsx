import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../components/layout/Sidebar";
import apiClient from "../../services/api/apiClient";
import { useAuth } from "../../contexts/AuthContext";

const PeringkatPage = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Gunakan useRef untuk mencegah multiple fetching
  const fetchInProgressRef = useRef(false);
  const hasFetchedDataRef = useRef(false);

  // Buat fungsi fetchLeaderboard dengan useCallback untuk memastikan stabilitas referensi
  const fetchLeaderboard = useCallback(async () => {
    // Cek apakah fetch sedang berlangsung atau sudah selesai
    if (fetchInProgressRef.current || hasFetchedDataRef.current) {
      return;
    }

    // Set flag bahwa fetch sedang berlangsung
    fetchInProgressRef.current = true;

    try {
      setLoading(true);
      console.log("Fetching leaderboard data..."); // Log hanya sekali

      const leaderboardData = await apiClient.get("/leaderboard");

      if (leaderboardData && leaderboardData.length > 0) {
        // Ekstrak 3 pengguna teratas
        const top3 = leaderboardData.slice(0, 3).map((user) => ({
          id: user.rank,
          name: user.name || user.username,
          username: `@${user.username}`,
          score: user.best_score,
          avatar:
            user.avatar_url ||
            `https://i.pravatar.cc/150?img=${10 + user.rank}`,
          rank: user.rank,
        }));

        // Pastikan top3 memiliki 3 item
        while (top3.length < 3) {
          top3.push({
            id: top3.length + 1,
            name: "Pemain",
            username: "@pemain",
            score: 0,
            avatar: `https://i.pravatar.cc/150?img=${11 + top3.length}`,
            rank: top3.length + 1,
          });
        }

        setTopUsers(top3);

        // Ekstrak pengguna lainnya (peringkat 4 dan seterusnya)
        const others = leaderboardData.slice(3).map((user, index) => ({
          id: user.rank,
          name: user.name || user.username,
          username: `@${user.username}`,
          score: user.best_score,
          avatar:
            user.avatar_url || `https://i.pravatar.cc/150?img=${14 + index}`,
          rank: user.rank,
          change: index % 2 === 0 ? "up" : "down", // Dummy change status
        }));

        setOtherUsers(others);

        // Cari peringkat pengguna saat ini
        if (currentUser) {
          const userRank = leaderboardData.find(
            (user) =>
              user.username === currentUser.username ||
              user.username === currentUser.email?.split("@")[0]
          );

          if (userRank) {
            setCurrentUserRank(userRank);
          }
        }
      }

      // Tandai bahwa data telah berhasil diambil
      hasFetchedDataRef.current = true;
      console.log("Leaderboard data fetched successfully");
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Gagal memuat data peringkat");
    } finally {
      setLoading(false);
      // Reset flag fetch in progress
      fetchInProgressRef.current = false;
    }
  }, [currentUser]); // Hanya bergantung pada currentUser

  useEffect(() => {
    // Panggil fetchLeaderboard hanya jika belum pernah fetch
    if (!hasFetchedDataRef.current) {
      fetchLeaderboard();
    }

    // Cleanup function untuk menghindari memory leak
    return () => {
      // Reset flag saat komponen unmount
      fetchInProgressRef.current = false;
    };
  }, [fetchLeaderboard]); // Bergantung pada fungsi fetchLeaderboard yang stabil

  // Fungsi untuk menampilkan ikon mahkota
  const CrownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8 text-yellow-400 absolute -top-10 left-1/2 transform -translate-x-1/2"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );

  // Tombol untuk memuat ulang data jika diperlukan
  const handleRefresh = () => {
    hasFetchedDataRef.current = false;
    fetchLeaderboard();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="text-2xl">Memuat peringkat...</div>
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="text-2xl text-red-400">{error}</div>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-100">Papan Skor</span>
        </div>

        {/* Page Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Papan Peringkat</h1>
            <p className="text-lg text-blue-200">
              Lihat peringkat pengguna terbaik dalam belajar bahasa isyarat
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center"
            disabled={loading || fetchInProgressRef.current}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </header>

        {/* Wrapper for Podium Area */}
        <div className="bg-blue-800/40 p-6 md:p-8 rounded-xl mb-10 mt-4 relative">
          {/* Podium Section - Top 3 Users */}
          <div className="flex justify-center items-end">
            {/* Second Place */}
            <div className="flex flex-col items-center mx-4 relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-blue-400 shadow-[0_0_15px_2px_rgba(96,165,250,0.4)] mb-2 relative">
                <img
                  src={topUsers[1]?.avatar}
                  alt={topUsers[1]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{topUsers[1]?.name}</h3>
                <p className="text-blue-300 text-sm">{topUsers[1]?.username}</p>
                <p className="text-blue-400 font-bold text-2xl mt-1">
                  {topUsers[1]?.score}
                </p>
              </div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center mx-4 relative z-10 mb-8">
              <CrownIcon />
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-[0_0_15px_2px_rgba(250,204,21,0.4)] mb-2 relative">
                <img
                  src={topUsers[0]?.avatar}
                  alt={topUsers[0]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-yellow-500 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  1
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl">{topUsers[0]?.name}</h3>
                <p className="text-blue-300 text-sm">{topUsers[0]?.username}</p>
                <p className="text-yellow-400 font-bold text-3xl mt-1">
                  {topUsers[0]?.score}
                </p>
              </div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center mx-4 relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-[0_0_15px_2px_rgba(52,211,153,0.4)] mb-2 relative">
                <img
                  src={topUsers[2]?.avatar}
                  alt={topUsers[2]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{topUsers[2]?.name}</h3>
                <p className="text-blue-300 text-sm">{topUsers[2]?.username}</p>
                <p className="text-green-400 font-bold text-2xl mt-1">
                  {topUsers[2]?.score}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-blue-800/30 rounded-xl border border-blue-700/50 overflow-hidden mb-6">
          <div className="p-4 bg-blue-900/50 border-b border-blue-700/50">
            <h2 className="font-bold text-lg">Peringkat Lainnya</h2>
          </div>

          {otherUsers.length > 0 ? (
            otherUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 border-b border-blue-700/30 hover:bg-blue-700/20 transition-colors"
              >
                <span className="text-sm text-blue-300 w-6 text-center mr-2">
                  {user.rank}.
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-blue-300 text-sm">{user.username}</p>
                </div>

                <div className="flex items-center">
                  <span className="text-xl font-bold mr-2">{user.score}</span>
                  {user.change === "up" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-blue-300">
              Belum ada pemain lain dalam daftar peringkat
            </div>
          )}
        </div>

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="bg-blue-700/50 rounded-xl border border-blue-500/50 overflow-hidden">
            <div className="p-4 bg-blue-600/30 border-b border-blue-500/50">
              <h2 className="font-bold text-lg">Peringkat Anda</h2>
            </div>
            <div className="flex items-center p-4 hover:bg-blue-600/20 transition-colors">
              <span className="text-sm text-blue-300 w-6 text-center mr-2">
                {currentUserRank.rank}.
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400/50 mr-4">
                <img
                  src={
                    currentUserRank.avatar_url ||
                    `https://i.pravatar.cc/150?img=99`
                  }
                  alt={currentUserRank.name || currentUserRank.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold">
                  {currentUserRank.name || currentUserRank.username}
                </h3>
                <p className="text-blue-300 text-sm">
                  @{currentUserRank.username}
                </p>
              </div>

              <div className="flex items-center">
                <span className="text-xl font-bold text-yellow-400">
                  {currentUserRank.best_score}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PeringkatPage;
