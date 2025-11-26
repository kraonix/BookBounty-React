"use client";

import { useState } from "react";
import "../../../app/profile/Profile.css";

interface AvatarPickerProps {
    currentAvatar: string;
    onSave: (url: string) => void;
    onClose: () => void;
}

const AVATAR_OPTIONS = [
    "/avatars/avatar1.jpg",
    "/avatars/avatar2.jpg",
    "/avatars/avatar3.jpg",
    "/avatars/avatar4.jpg"
];

export const AvatarPicker = ({ currentAvatar, onSave, onClose }: AvatarPickerProps) => {
    const [selected, setSelected] = useState(currentAvatar);

    return (
        <div className="avatar-popup-overlay" onClick={onClose}>
            <div className="avatar-popup" onClick={e => e.stopPropagation()}>
                <h3 className="popup-title">Choose an Avatar</h3>

                <div className="avatar-grid">
                    {AVATAR_OPTIONS.map((url, index) => (
                        <div
                            key={index}
                            className={`avatar-option ${selected === url ? "selected" : ""}`}
                            onClick={() => setSelected(url)}
                        >
                            <img src={url} alt={`Avatar ${index + 1}`} className="avatar-img" />
                        </div>
                    ))}
                </div>

                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className="confirm-btn"
                        onClick={() => onSave(selected)}
                    >
                        Save Avatar
                    </button>
                </div>
            </div>
        </div>
    );
};
