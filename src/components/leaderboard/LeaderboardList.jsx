import React, { useState } from "react";

const UserListItem = React.memo(({ user, isHighlighted = false }) => {
  const [imgError, setImgError] = useState(false);

  // Gunakan avatar default jika terjadi error
  const avatarUrl = imgError
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || "User"
      )}&background=random`
    : user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || "User"
      )}`;

  return (
    <div
      className={`flex items-center p-4 border-b border-blue-700/30 hover:bg-blue-700/20 transition-colors ${
        isHighlighted ? "bg-blue-700/30" : ""
      }`}
    >
      <span className="text-sm text-blue-300 w-6 text-center mr-2">
        {user.rank}.
      </span>
      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
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
  );
});

const EmptyList = React.memo(() => (
  <div className="p-8 text-center text-blue-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mx-auto mb-2 text-blue-400/70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    Belum ada pemain lain dalam daftar peringkat
  </div>
));

const LeaderboardList = ({ otherUsers, currentUser }) => {
  return (
    <div className="bg-blue-800/30 rounded-xl border border-blue-700/50 overflow-hidden mb-6 backdrop-blur-sm shadow-lg">
      <div className="p-4 bg-blue-900/50 border-b border-blue-700/50 flex justify-between items-center">
        <h2 className="font-bold text-lg">Peringkat Lainnya</h2>

        {/* Informasi jumlah data */}
        {otherUsers && otherUsers.length > 0 && (
          <div className="text-xs text-blue-300">
            Menampilkan peringkat 4-{otherUsers?.length + 3 || 0}
          </div>
        )}
      </div>

      {otherUsers && otherUsers.length > 0 ? (
        // Menghapus div dengan max-height dan overflow-y
        <div>
          {otherUsers.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isHighlighted={
                currentUser && user.username === `@${currentUser.username}`
              }
            />
          ))}
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
};

export default React.memo(LeaderboardList);
