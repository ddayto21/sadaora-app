// src/pages/FeedPage.tsx
import { useEffect, useState } from "react";
import { fetchPublicFeed } from "../api/feed";
import { Profile } from "../types/profile";

export const FeedPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicFeed()
      .then(setProfiles)
      .catch(() => setError("Failed to load profiles"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Public Feed</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-neutral-900 p-4 rounded-lg shadow-md border border-neutral-800"
          >
            <h2 className="text-xl font-medium">{profile.name}</h2>
            <p className="text-gray-400">{profile.headline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
