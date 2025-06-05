import apiClient from "../services/api/apiClient";

export default class LeaderboardModel {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null,
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 menit
    this.FETCH_TIMEOUT = 10000; // 10 detik
  }

  isCacheValid() {
    return (
      this.cache.data &&
      this.cache.timestamp &&
      Date.now() - this.cache.timestamp < this.CACHE_DURATION
    );
  }

  async fetchLeaderboard() {
    console.log("LeaderboardModel: Mencoba fetch data");

    if (this.isCacheValid()) {
      console.log("LeaderboardModel: Menggunakan data cache");
      return this.cache.data;
    }

    try {
      console.log("LeaderboardModel: Melakukan fetch ke API");

      // Gunakan Promise.race dengan timeout untuk mencegah hanging request
      const fetchPromise = apiClient.get("/leaderboard");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timeout")),
          this.FETCH_TIMEOUT
        )
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      console.log("LeaderboardModel: Data berhasil diambil", data);

      if (data && Array.isArray(data) && data.length > 0) {
        this.cache.data = data;
        this.cache.timestamp = Date.now();
        return data;
      } else {
        // Jika data kosong atau bukan array, gunakan data dummy
        console.log("LeaderboardModel: Data tidak valid, menggunakan dummy");
        const dummyData = this.generateDummyData();
        this.cache.data = dummyData;
        this.cache.timestamp = Date.now();
        return dummyData;
      }
    } catch (error) {
      console.error("LeaderboardModel: Error saat fetch", error);
      // Jika terjadi error, gunakan dummy data
      console.log("LeaderboardModel: Menggunakan dummy data karena error");
      const dummyData = this.generateDummyData();
      return dummyData;
    }
  }

  generateDummyData() {
    const dummyUsers = [];

    // Top 10 users
    for (let i = 1; i <= 10; i++) {
      dummyUsers.push({
        rank: i,
        name: `Pengguna ${i}`,
        username: `pengguna${i}`,
        best_score: 1000 - i * 50,
        avatar_url: `https://i.pravatar.cc/150?img=${10 + i}`,
      });
    }

    return dummyUsers;
  }

  clearCache() {
    this.cache = {
      data: null,
      timestamp: null,
    };
  }
}
