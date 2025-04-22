// src/pages/profile-page.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMyProfile, fetchProfileById } from "../api/profile";
import { Profile } from "../types/profile";

export const ProfilePage = () => {
  const { id } = useParams(); // optional userId param (e.g. /profile/:id)

  const [profile, setProfile] = useState<Profile | null>({
    id: "",
    userId: "",
    name: "",
    bio: "",
    headline: "",
    photoUrl: "",
    interests: [],
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = id ? await fetchProfileById(id) : await fetchMyProfile();
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          interests:
            typeof profile.interests === "string"
              ? profile.interests.split(",").map((s) => s.trim())
              : profile.interests,
        }),
      });
      setEditing(false);
      setProfileNotFound(false);
    } catch (err) {
      console.error("Profile save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  if (profileNotFound && id) {
    return (
      <div className="text-white text-center p-6">
        <p className="text-lg">This user hasn’t created a profile yet.</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex justify-center">
      <div className="w-full max-w-4xl">
        {!editing ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-md">
            <img
              src={profile.photoUrl || "/placeholder-avatar.png"}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border border-neutral-700"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                {!id && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-5 py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <p className="text-base text-gray-400">{profile.headline}</p>
              <p className="text-sm text-gray-300 mt-2">{profile.bio}</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={profile.photoUrl || "/placeholder-avatar.png"}
                alt="Avatar"
                className="h-14 w-14 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <p className="text-sm text-gray-400">{profile.headline}</p>
              </div>
            </div>

            <textarea
              name="bio"
              placeholder="Bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 rounded text-white border border-neutral-700"
            />

            <input
              name="photoUrl"
              placeholder="Profile Image URL"
              value={profile.photoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 rounded text-white border border-neutral-700"
            />

            <input
              name="interests"
              placeholder="Interests (comma-separated)"
              value={
                typeof profile.interests === "string"
                  ? profile.interests
                  : profile.interests.map((i) => i.label).join(", ")
              }
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 rounded text-white border border-neutral-700"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
