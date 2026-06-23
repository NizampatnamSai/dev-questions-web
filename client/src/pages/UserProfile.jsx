import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !userId || userId === user?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const endpoint = isOwnProfile ? "/profile/my/profile" : `/profile/profile/${userId}`;
      const { data } = await api.get(endpoint);
      setProfile(data);
      if (isOwnProfile) {
        setFormData({ name: data.name, bio: data.bio || "", website: data.website || "", location: data.location || "" });
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch("/profile/my/profile", formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Profile not found</p>
      </div>
    );
  }

  const initials = profile.name?.split(" ").map(p => p[0]).join("").toUpperCase();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Profile Header */}
      <div className="glass-card p-8 space-y-6">
        <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
          <div className="flex items-start gap-6 flex-col sm:flex-row sm:items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h1>
              <p className="text-sm text-slate-700 dark:text-slate-400">{profile.role === "admin" ? "👨‍💼 Admin" : profile.role === "sub_admin" ? "👨‍💻 Sub Admin" : "👤 User"}</p>
              {profile.location && <p className="text-sm text-slate-500 dark:text-slate-400">📍 {profile.location}</p>}
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{profile.level}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Level</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{profile.points}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Points</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{profile.badges?.length || 0}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Badges</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{profile.stats?.challenges_completed || 0}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Challenges</div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && isOwnProfile && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Bio (optional)"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Website (optional)"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Location (optional)"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Bio */}
        {profile.bio && !editing && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300">{profile.bio}</p>
          </div>
        )}
      </div>

      {/* Badges */}
      {profile.badges && profile.badges.length > 0 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">🏆 Badges ({profile.badges.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.badges.map((badge) => (
              <div key={badge} className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">
                  {{
                    first_post: "📝",
                    community_star: "⭐",
                    helpful: "🤝",
                    level_5: "🎯",
                    level_10: "🏆",
                  }[badge] || "🎖️"}
                </div>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">{badge.replace(/_/g, " ").toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
