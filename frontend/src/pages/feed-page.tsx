// src/pages/FeedPage.tsx
import { useEffect, useState } from "react";

export const FeedPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("Failed to load feed", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-8">
        Public Feed
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-700"
            >
              {profile.photoUrl && (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{profile.headline}</p>
              <p className="text-sm mb-3">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 text-sm text-blue-400">
                {profile.interests?.map((interest: any) => (
                  <span
                    key={interest.id}
                    className="bg-blue-900 px-2 py-1 rounded-full"
                  >
                    {interest.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
