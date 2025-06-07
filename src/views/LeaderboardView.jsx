import React from "react";
import Sidebar from "../components/layout/Sidebar";
import LeaderboardPodium from "../components/leaderboard/LeaderboardPodium";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import UserRank from "../components/leaderboard/UserRank";

// Gunakan React.memo untuk komponen yang tidak perlu re-render
const Header = React.memo(({ error }) => (
  <>
    <div className="flex items-center text-sm text-third mb-6">
      <span>Beranda</span>
      <span className="mx-2">/</span>
      <span className="font-medium text-text-light">Papan Skor</span>
    </div>

    <header className="mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Papan Peringkat</h1>
        <p className="text-lg text-white">
          Lihat peringkat pengguna terbaik dalam belajar bahasa isyarat
        </p>
        {error && (
          <div className="mt-2 text-sm text-yellow-300 bg-yellow-900/30 px-3 py-1 rounded-md inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </header>
  </>
));

// Komponen skeleton untuk podium
const PodiumSkeleton = React.memo(() => (
  <div className="my-10">
    <div className="flex justify-center items-end space-x-2">
      {/* Rank 2 */}
      <div className="flex flex-col items-center w-28 md:w-36 mx-1 md:mx-2 animate-pulse">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary/60 mb-2"></div>
        <div className="w-full h-28 md:h-32 bg-secondary/50 rounded-t-lg"></div>
      </div>

      {/* Rank 1 */}
      <div className="flex flex-col items-center w-28 md:w-36 mx-1 md:mx-2 animate-pulse">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary/60 mb-2"></div>
        <div className="w-full h-36 md:h-40 bg-secondary/50 rounded-t-lg"></div>
      </div>

      {/* Rank 3 */}
      <div className="flex flex-col items-center w-28 md:w-36 mx-1 md:mx-2 animate-pulse">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary/60 mb-2"></div>
        <div className="w-full h-28 md:h-32 bg-secondary/50 rounded-t-lg"></div>
      </div>
    </div>
  </div>
));

// Komponen skeleton untuk list
const ListSkeleton = React.memo(() => (
  <div className="bg-secondary/50 rounded-xl border border-primary overflow-hidden mb-6 backdrop-blur-sm shadow-lg">
    <div className="p-4 bg-primary border-b border-third flex justify-between items-center">
      <div className="h-6 w-32 bg-secondary/60 rounded animate-pulse"></div>
    </div>

    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="flex items-center p-4 border-b border-third animate-pulse bg-secondary/50"
      >
        <div className="h-5 w-5 bg-secondary/60 rounded mr-2"></div>
        <div className="w-10 h-10 rounded-full bg-secondary/60 mr-4"></div>
        <div className="flex-1">
          <div className="h-5 w-32 bg-secondary/60 rounded mb-2"></div>
          <div className="h-4 w-24 bg-secondary/60 rounded"></div>
        </div>
        <div className="h-6 w-12 bg-secondary/60 rounded"></div>
      </div>
    ))}
  </div>
));

// Komponen skeleton untuk user rank
const UserRankSkeleton = React.memo(() => (
  <div className="bg-secondary/50 rounded-xl border border-third/50 overflow-hidden mb-6 backdrop-blur-sm shadow-lg animate-pulse">
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
));

// Komponen untuk menampilkan pesan error
const ErrorMessage = React.memo(({ message, onRefresh }) => (
  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-6 mb-6 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mx-auto mb-4 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 className="text-xl font-bold mb-2">Gagal memuat data peringkat</h3>
    <p className="text-red-200 mb-4">
      {message || "Terjadi kesalahan pada server. Silakan coba lagi nanti."}
    </p>
    <button
      onClick={onRefresh}
      className="bg-secondary hover:bg-primary px-4 py-2 rounded-lg text-sm flex items-center transition-all mx-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
      Coba Lagi
    </button>
  </div>
));

const LeaderboardView = React.memo(
  ({
    topUsers,
    otherUsers,
    currentUserRank,
    loading,
    error,
    onRefresh,
    isUserOutsideTopRanks = false,
    currentUser,
  }) => {
    // Pastikan currentUserRank memiliki data yang benar
    const userRankData = currentUserRank || {
      name: currentUser?.name || "Anda",
      username: currentUser?.username || "user",
      score: currentUser?.score || 60, // Gunakan skor default 60 jika tidak ada
    };

    // Format error message untuk ditampilkan
    const formatErrorMessage = (error) => {
      if (typeof error === "string") return error;

      if (error?.message) {
        if (error.message.includes("network"))
          return "Koneksi internet terputus. Periksa koneksi Anda dan coba lagi.";
        if (error.message.includes("timeout"))
          return "Server tidak merespons. Silakan coba lagi nanti.";
        return error.message;
      }

      return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
    };

    return (
      <div className="flex min-h-screen bg-gradient-to-br from-background via-primary to-background text-text-light">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col pb-24 md:pb-8">
          <Header error={error ? formatErrorMessage(error) : null} />

          {error ? (
            <ErrorMessage
              message={formatErrorMessage(error)}
              onRefresh={onRefresh}
            />
          ) : (
            <>
              {loading ? (
                <PodiumSkeleton />
              ) : (
                <LeaderboardPodium topUsers={topUsers} />
              )}
              {loading ? (
                <ListSkeleton />
              ) : (
                <LeaderboardList
                  otherUsers={otherUsers}
                  currentUser={currentUser}
                  onRefresh={onRefresh}
                />
              )}
              {loading ? (
                <UserRankSkeleton />
              ) : (
                <UserRank
                  userRank={userRankData}
                  isOutsideTopRanks={isUserOutsideTopRanks || !currentUserRank}
                />
              )}
            </>
          )}
        </main>
      </div>
    );
  }
);

export default LeaderboardView;
