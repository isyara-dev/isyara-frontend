import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import LeaderboardModel from "../models/LeaderboardModel";
import LeaderboardView from "../views/LeaderboardView";

const LeaderboardPresenter = React.memo(() => {
  const [topUsers, setTopUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummyData, setUseDummyData] = useState(false);
  const [isUserOutsideTopRanks, setIsUserOutsideTopRanks] = useState(false);
  const { currentUser } = useAuth();

  // Refs untuk state management
  const isMountedRef = useRef(true);
  const fetchInProgressRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRY_COUNT = 3;
  const modelRef = useRef(null);

  // Inisialisasi model hanya sekali
  if (!modelRef.current) {
    modelRef.current = new LeaderboardModel();
  }

  const processLeaderboardData = useCallback(
    (leaderboardData) => {
      if (!leaderboardData)
        return {
          top3: [],
          others: [],
          userRankData: null,
          userOutsideTopRanks: false,
        };

      // Ekstrak 3 pengguna teratas
      const top3 = leaderboardData.slice(0, 3).map((user) => ({
        id: user.rank,
        name: user.name || user.username,
        username: `@${user.username}`,
        score: user.best_score,
        avatar:
          user.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.username
          )}`,
        rank: user.rank,
      }));

      // Pastikan top3 memiliki 3 item
      while (top3.length < 3) {
        top3.push({
          id: top3.length + 1,
          name: "Pemain",
          username: "@pemain",
          score: 0,
          avatar: `https://ui-avatars.com/api/?name=Pemain${top3.length + 1}`,
          rank: top3.length + 1,
        });
      }

      // Ekstrak pengguna lainnya (rank 4-10)
      const others = leaderboardData.slice(3).map((user, index) => ({
        id: user.rank,
        name: user.name || user.username,
        username: `@${user.username}`,
        score: user.best_score,
        avatar:
          user.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.username
          )}`,
        rank: user.rank,
        change: index % 2 === 0 ? "up" : "down",
      }));

      // Cari peringkat pengguna saat ini
      let userRankData = null;
      let userOutsideTopRanks = false;

      if (currentUser && (currentUser.username || currentUser.email)) {
        // Cari user dalam data leaderboard (cari di semua data, tidak hanya top 10)
        const userRank = leaderboardData.find(
          (user) =>
            user.username === currentUser.username ||
            user.username === currentUser.email?.split("@")[0]
        );

        if (userRank) {
          // Jika user ditemukan dalam data leaderboard, gunakan data tersebut
          userRankData = { ...userRank }; // Membuat salinan untuk menghindari mutasi objek asli

          // Cek apakah user berada di luar top 10
          const userRankIndex = leaderboardData.findIndex(
            (user) =>
              user.username === currentUser.username ||
              user.username === currentUser.email?.split("@")[0]
          );

          // Jika index >= 10, berarti di luar top 10
          userOutsideTopRanks = userRankIndex >= 10;

          // Log untuk debugging
          console.log(
            `User rank data found at position ${userRankIndex + 1}:`,
            userRank
          );
        } else {
          console.log("User tidak ditemukan dalam data leaderboard");

          // Jika backend tidak mengembalikan data user yang tidak masuk ranking,
          // kita anggap user berada di luar top ranking
          userOutsideTopRanks = true;

          // CATATAN: Ini tidak ideal karena kita tidak tahu peringkat sebenarnya.
          // Idealnya, backend harus mengembalikan peringkat user saat ini.
        }
      }

      return { top3, others, userRankData, userOutsideTopRanks };
    },
    [currentUser]
  );

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current || fetchInProgressRef.current) {
      return;
    }

    fetchInProgressRef.current = true;

    try {
      setLoading(true);
      const data = await modelRef.current.fetchLeaderboard();

      if (!isMountedRef.current) return;

      const { top3, others, userRankData, userOutsideTopRanks } =
        processLeaderboardData(data);

      setTopUsers(top3);
      setOtherUsers(others);
      if (userRankData) setCurrentUserRank(userRankData);
      setIsUserOutsideTopRanks(userOutsideTopRanks);

      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      if (!isMountedRef.current) return;

      if (retryCountRef.current < MAX_RETRY_COUNT) {
        const retryDelay = Math.pow(2, retryCountRef.current) * 1000;
        retryCountRef.current += 1;

        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

        retryTimeoutRef.current = setTimeout(() => {
          fetchInProgressRef.current = false;
          fetchData();
        }, retryDelay);
      } else {
        setError("Gagal memuat data peringkat");
        setUseDummyData(true);
        retryCountRef.current = 0;
        fetchInProgressRef.current = false;
      }
    } finally {
      if (isMountedRef.current && retryCountRef.current === 0) {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    }
  }, [processLeaderboardData]);

  // Effect untuk menggunakan data dummy jika API gagal
  useEffect(() => {
    if (useDummyData && isMountedRef.current) {
      const dummyData = modelRef.current.generateDummyData();
      const { top3, others, userRankData, userOutsideTopRanks } =
        processLeaderboardData(dummyData);
      setTopUsers(top3);
      setOtherUsers(others);
      if (userRankData) setCurrentUserRank(userRankData);
      setIsUserOutsideTopRanks(userOutsideTopRanks);
      setError("Menggunakan data contoh karena API tidak tersedia");
      setLoading(false);
    }
  }, [useDummyData, processLeaderboardData]);

  // Hanya fetch data sekali saat mount
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []); // Hapus fetchData dari dependencies untuk mencegah re-fetch

  const handleRefresh = useCallback(() => {
    modelRef.current.clearCache();
    setError(null);
    setUseDummyData(false);
    retryCountRef.current = 0;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    fetchInProgressRef.current = false;
    fetchData();
  }, [fetchData]);

  return (
    <LeaderboardView
      topUsers={topUsers}
      otherUsers={otherUsers}
      currentUserRank={currentUserRank}
      loading={loading && !useDummyData}
      error={error}
      onRefresh={handleRefresh}
      isUserOutsideTopRanks={isUserOutsideTopRanks}
      currentUser={currentUser}
    />
  );
});

export default LeaderboardPresenter;
