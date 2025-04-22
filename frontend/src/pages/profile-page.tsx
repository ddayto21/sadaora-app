// src/pages/profile-page.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    headline: "",
    photoUrl: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            ...data,
            interests: data.interests.map((i: any) => i.label).join(", "),
          });
        }
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          interests: profile.interests.split(",").map((s) => s.trim()),
        }),
      });
      navigate("/feed");
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center items-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          My Profile
        </h1>

        <input
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <input
          name="headline"
          placeholder="Headline"
          value={profile.headline}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        ></textarea>

        <input
          name="photoUrl"
          placeholder="Photo URL"
          value={profile.photoUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <input
          name="interests"
          placeholder="Interests (comma-separated)"
          value={profile.interests}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};
