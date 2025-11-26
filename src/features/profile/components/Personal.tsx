"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AvatarPicker } from "./AvatarPicker";
import "../../../app/profile/Profile.css";

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    phone: string;
    image: string;
}

export const Personal = () => {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        bio: "",
        phone: "",
        image: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/me");
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    bio: data.bio || "",
                    phone: data.phone || "",
                    image: data.image || "/avatars/avatar1.jpg"
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update session with new data
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profile.name,
                        image: profile.image
                    }
                });
                fetchProfile();
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpdate = async (newUrl: string) => {
        setProfile(prev => ({ ...prev, image: newUrl }));
        setShowAvatarPicker(false);

        // Auto-save avatar change
        try {
            await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: newUrl }),
            });

            // Update session immediately
            await update({
                ...session,
                user: {
                    ...session?.user,
                    image: newUrl
                }
            });
        } catch (error) {
            console.error("Failed to update avatar", error);
        }
    };

    if (loading) return <div className="loading-state">Loading profile...</div>;

    return (
        <div className="content-panel">
            <div className="panel-header">
                <h2 className="panel-title">Personal Information</h2>
                <p className="panel-subtitle">Manage your personal details and public profile.</p>
            </div>

            <div className="avatar-section">
                <img src={profile.image} alt="Profile" className="current-avatar" />
                <div className="avatar-controls">
                    <button
                        className="change-avatar-btn"
                        onClick={() => setShowAvatarPicker(true)}
                    >
                        Change Avatar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="profile-form">
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        value={profile.email}
                        className="form-input"
                        disabled
                        title="Email cannot be changed"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Tell us a little about yourself..."
                    />
                </div>

                {message && (
                    <div style={{ color: message.type === 'success' ? '#cae962' : '#ef4444', marginTop: '10px' }}>
                        {message.text}
                    </div>
                )}

                <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Saving..." : "Update Profile"}
                </button>
            </form>

            {showAvatarPicker && (
                <AvatarPicker
                    currentAvatar={profile.image}
                    onSave={handleAvatarUpdate}
                    onClose={() => setShowAvatarPicker(false)}
                />
            )}
        </div>
    );
};
