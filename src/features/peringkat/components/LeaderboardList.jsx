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
      className={`flex items-center p-4 border-b bg-secondary/50 border-third hover:bg-secondary/40 transition-colors ${
        isHighlighted ? "bg-primary/30" : ""
      }`}
    >
      <span className="text-sm text-white w-6 text-center mr-2">
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

      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate">{user.name}</h3>
        <p className="text-white/70 text-sm truncate">{user.username}</p>
      </div>

      <div className="flex items-center justify-center w-16 sm:w-24 flex-shrink-0 ml-2">
        <span className="text-lg sm:text-xl font-bold">{user.score}</span>
      </div>
    </div>
  );
});

const EmptyList = React.memo(() => (
  <div className="p-8 text-center text-third">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mx-auto mb-2 text-third"
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

const LeaderboardList = ({ otherUsers, currentUser, onRefresh }) => {
  return (
    <div className="bg-secondary/50 rounded-xl border border-primary overflow-hidden mb-6 backdrop-blur-sm shadow-lg min-w-[320px]">
      <div className="p-4 bg-primary border-b border-third flex justify-between items-center">
        <h2 className="font-bold text-lg">Peringkat Top 10</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-secondary hover:bg-primary px-3 py-1 rounded-lg text-sm flex items-center transition-all"
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
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {otherUsers && otherUsers.length > 0 ? (
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
    </div>
  );
};

export default React.memo(LeaderboardList);
