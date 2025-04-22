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
    fetch("/api/profile", { credentials: "include" })
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
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-xl bg-neutral-900 rounded-2xl p-10 shadow-xl border border-neutral-800 space-y-6">
        <h1 className="text-4xl font-semibold text-center text-white mb-6">
          Profile
        </h1>

        <input
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <input
          name="headline"
          placeholder="Headline"
          value={profile.headline}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        ></textarea>

        <input
          name="photoUrl"
          placeholder="Profile Image URL"
          value={profile.photoUrl}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <input
          name="interests"
          placeholder="Interests (comma-separated)"
          value={profile.interests}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};
