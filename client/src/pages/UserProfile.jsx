import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function UserProfile() {
  const { userId } = useParams();
  const { user, setProfile: setGlobalProfile } = useAuth();
  const { theme, toggleTheme, snow, toggleSnow } = useTheme();
  const isOwnProfile = !userId || userId === user?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    location: "",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    if (showSettings && isOwnProfile) loadLeaves();
  }, [showSettings, isOwnProfile]);

  const loadLeaves = async () => {
    try {
      const { data } = await api.get("/leaves/my");
      setLeaves(data);
    } catch {
      toast.error("Failed to load leave history");
    }
  };

  const handleSubmitLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate) {
      toast.error("Pick both a start and end date");
      return;
    }
    if (leaveForm.endDate < leaveForm.startDate) {
      toast.error("End date must be on or after the start date");
      return;
    }
    setSubmittingLeave(true);
    try {
      await api.post("/leaves", leaveForm);
      toast.success("Leave submitted — admin has been notified");
      setLeaveForm({ startDate: "", endDate: "", reason: "" });
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit leave");
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleCancelLeave = async (id) => {
    try {
      await api.delete(`/leaves/${id}`);
      setLeaves((prev) => prev.filter((l) => l.id !== id));
      toast.success("Leave cancelled");
    } catch {
      toast.error("Failed to cancel leave");
    }
  };

  const [mutingNotifs, setMutingNotifs] = useState(false);
  const handleMuteNotifications = async (duration) => {
    setMutingNotifs(true);
    try {
      const { data } = await api.patch("/profile/my/notifications-mute", { duration });
      setProfile((prev) => ({ ...prev, notifyMutedUntil: data.notifyMutedUntil }));
      toast.success(duration === "none" ? "Notifications unmuted" : "Notifications muted");
    } catch {
      toast.error("Failed to update notification settings");
    } finally {
      setMutingNotifs(false);
    }
  };

  const loadProfile = async () => {
    try {
      const endpoint = isOwnProfile ? "/profile/my/profile" : `/profile/${userId}`;
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
      if (isOwnProfile) setGlobalProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploadingAvatar(true);
    try {
      // Uploaded to Cloudinary — only the returned URL is stored in our database,
      // never the image bytes, so profile documents stay small regardless of photo size.
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const { data: uploadData } = await api.post("/uploads/image", uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await api.patch("/profile/my/profile", { avatar_url: uploadData.url });
      setProfile(prev => ({ ...prev, avatar_url: uploadData.url }));
      if (isOwnProfile) setGlobalProfile(prev => ({ ...prev, avatar_url: uploadData.url }));
      toast.success("Photo updated!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to upload photo");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await api.patch("/profile/my/profile", { avatar_url: "" });
      setProfile(prev => ({ ...prev, avatar_url: "" }));
      if (isOwnProfile) setGlobalProfile(prev => ({ ...prev, avatar_url: "" }));
      toast.success("Photo removed");
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.old_password || !pwForm.new_password) {
      toast.error("Fill in both password fields");
      return;
    }
    if (pwForm.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }
    setChangingPw(true);
    try {
      await api.post("/profile/my/change-password", {
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });
      toast.success("Password changed successfully");
      setPwForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setChangingPw(false);
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
            {/* Avatar with upload */}
            <div className="relative group flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {initials}
                </div>
              )}
              {/* Upload-in-progress overlay — always visible while uploading, not
                  just on hover. The hover-only overlay below goes invisible the
                  moment the mouse leaves the avatar (e.g. while the file picker
                  dialog is open), so without this the 3-5s upload looked frozen. */}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
              {isOwnProfile && (
                <>
                  {/* Dark overlay on hover */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
                  >
                    📷
                  </button>
                  {/* Always-visible camera badge at bottom-right */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-500 hover:bg-indigo-400 border-2 border-slate-900 flex items-center justify-center text-[11px] transition-colors"
                    title="Change photo"
                  >
                    📷
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {profile.avatar_url && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      title="Remove photo"
                      className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 border-2 border-slate-900 flex items-center justify-center text-[11px] text-white transition-colors disabled:opacity-50"
                    >
                      ✕
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h1>
              <p className="text-sm text-slate-700 dark:text-slate-400">{profile.role === "admin" ? "👨‍💼 Admin" : profile.role === "sub_admin" ? "👨‍💻 Sub Admin" : "👤 User"}</p>
              {profile.location && <p className="text-sm text-slate-500 dark:text-slate-400">📍 {profile.location}</p>}
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                {showSettings ? "Cancel" : "⚙️ Settings"}
              </button>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
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

      {/* Settings */}
      {showSettings && isOwnProfile && (
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">⚙️ Settings</h2>

          {/* Account info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Account</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                <div className="text-xs text-slate-400">Email</div>
                <div className="text-slate-700 dark:text-slate-200 truncate">{profile.email}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                <div className="text-xs text-slate-400">Member since</div>
                <div className="text-slate-700 dark:text-slate-200">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Appearance</h3>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
              </span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
              <span className="text-sm text-slate-700 dark:text-slate-200">❄️ Snow effect</span>
              <button
                onClick={toggleSnow}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  snow ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {snow ? "On" : "Off"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">🔔 Notifications</h3>
            {profile.notifyMutedUntil && new Date(profile.notifyMutedUntil) > new Date() ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg">
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  🔕 Muted until{" "}
                  {new Date(profile.notifyMutedUntil).getFullYear() > new Date().getFullYear() + 50
                    ? "you turn it back on"
                    : new Date(profile.notifyMutedUntil).toLocaleString()}
                </span>
                <button
                  onClick={() => handleMuteNotifications("none")}
                  disabled={mutingNotifs}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                >
                  Unmute
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg space-y-2">
                <p className="text-xs text-slate-400">
                  Pause all reminders (push + in-app) for a while.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "1d", label: "1 day" },
                    { key: "2d", label: "2 days" },
                    { key: "1w", label: "1 week" },
                    { key: "permanent", label: "Permanently" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleMuteNotifications(opt.key)}
                      disabled={mutingNotifs}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-60 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Change password */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Change Password</h3>
            <input
              type="password"
              value={pwForm.old_password}
              onChange={(e) => setPwForm((f) => ({ ...f, old_password: e.target.value }))}
              placeholder="Current password"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                value={pwForm.new_password}
                onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
                placeholder="New password (min 6 chars)"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={pwForm.confirm_password}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPw}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-60 transition-colors"
            >
              {changingPw ? "Changing…" : "Change Password"}
            </button>
          </div>

          {/* Leave / Holiday */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">🏖️ Leave / Holiday</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mark yourself out for a day or a range. Work Board reminders skip you on those days, and if it's
                your turn to post to Community, admin gets notified to cover for you instead.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">From</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">To</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <input
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Reason (optional)"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmitLeave}
              disabled={submittingLeave}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
            >
              {submittingLeave ? "Submitting…" : "Submit Leave"}
            </button>

            {leaves.length > 0 && (
              <div className="space-y-2 pt-2">
                {leaves.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-lg text-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-slate-700 dark:text-slate-200 font-medium">
                        {l.startDate === l.endDate ? l.startDate : `${l.startDate} → ${l.endDate}`}
                      </p>
                      {l.reason && <p className="text-xs text-slate-400 truncate">{l.reason}</p>}
                    </div>
                    <button
                      onClick={() => handleCancelLeave(l.id)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
