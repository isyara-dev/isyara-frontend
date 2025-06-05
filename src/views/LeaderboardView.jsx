import React from "react";
import Sidebar from "../components/layout/Sidebar";
import LeaderboardPodium from "../components/leaderboard/LeaderboardPodium";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import UserRank from "../components/leaderboard/UserRank";

// Gunakan React.memo untuk komponen yang tidak perlu re-render
const Header = React.memo(({ error, onRefresh }) => (
  <>
    <div className="flex items-center text-sm text-blue-200 mb-6">
      <span>Beranda</span>
      <span className="mx-2">/</span>
      <span className="font-medium text-blue-100">Papan Skor</span>
    </div>

    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">Papan Peringkat</h1>
        <p className="text-lg text-blue-200">
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
      <button
        onClick={onRefresh}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center transition-all"
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
  </>
));

const Loading = React.memo(() => (
  <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
    <Sidebar />
    <main className="flex-1 p-8 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
        <div className="text-2xl">Memuat peringkat...</div>
      </div>
    </main>
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
    // Hapus log yang berlebihan
    if (loading) {
      return <Loading />;
    }

    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col">
          <Header error={error} onRefresh={onRefresh} />
          <LeaderboardPodium topUsers={topUsers} />
          <LeaderboardList otherUsers={otherUsers} currentUser={currentUser} />
          {currentUserRank && (
            <UserRank
              userRank={currentUserRank}
              isOutsideTopRanks={isUserOutsideTopRanks}
            />
          )}
        </main>
      </div>
    );
  }
);

export default LeaderboardView;
