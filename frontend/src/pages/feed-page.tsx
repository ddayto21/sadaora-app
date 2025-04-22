// src/pages/FeedPage.tsx
import { useEffect, useState } from "react";
import { fetchPublicFeed } from "../api/feed";
import { Profile } from "../types/profile";
import { useNavigate, useParams } from "react-router-dom";

export const FeedPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigateToProfile = (profileId: string) => {
    // Navigate to a specific user profile, based on a `userId` or `profileId`
    // This function should be implemented to handle navigation
    // For example, using React Router:
    navigate(`/profile/${profileId}`);
  };

  useEffect(() => {
    fetchPublicFeed()
      .then(setProfiles)
      .catch(() => setError("Failed to load profiles"));
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 text-center tracking-tight">
        Explore
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="w-full bg-[#121212] border border-[#262626] rounded-xl p-4 flex gap-4 items-start transition-all duration-200 ease-in-out hover:bg-[#1a1a1a] cursor-pointer"
            onClick={() => navigateToProfile(profile.id)}
          >
            <img
              src={profile.photoUrl || "/placeholder-avatar.png"}
              alt={profile.name}
              className="h-10 w-10 rounded-full object-cover bg-neutral-700 border border-[#2e2e2e]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  {profile.name}
                </h2>
                <span className="text-sm text-gray-400">
                  {profile.headline}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2 leading-snug text-left">
                {profile.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
