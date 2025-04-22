// src/pages/public-profile-page.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfileById } from "../api/profile";
import { Profile } from "../types/profile";

export const PublicProfilePage = () => {
  const { id } = useParams(); // access :id from route
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProfileById(id)
      .then(setProfile)
      .catch(() => setError("Failed to load profile"));
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-gray-400">Loading profile...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">{profile.name}</h1>
      <p className="text-gray-400">{profile.headline}</p>
      <p className="mt-2 text-gray-300">{profile.bio}</p>
    </div>
  );
};
