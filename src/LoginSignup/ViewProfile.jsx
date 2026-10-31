import React, { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Calendar,
    ArrowLeft
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the ID of the account selected in Profile.jsx
    const profileId = location.state?.profileId;

    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        status: "Active",
        createdAt: null,
        profilePhoto: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const getProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const savedUser = localStorage.getItem("user");

                if (!savedUser) {
                    navigate("/login");
                    return;
                }

                const loggedInUser = JSON.parse(savedUser);

                if (!loggedInUser?.id) {
                    navigate("/login");
                    return;
                }

               const targetId=profileId||loggedInUser.id;

                // IMPORTANT: Fetch the selected account, not the logged-in account
                 
                const token=localStorage.getItem("token");

                const response = await fetch(
                    "https://backend-beta-tan-14.vercel.app/profile/getProfile",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:`Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userId: targetId,
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load profile"
                    );
                }

                const profile = result.user;

                if (!profile) {
                    throw new Error("Profile information was not returned.");
                }

                const rawPhoto =
                    profile.profilePhoto ||
                    profile.profile_photo ||
                    "";

                const photoURL = rawPhoto
                    ? rawPhoto.startsWith("http")
                        ? rawPhoto
                        : `https://backend-beta-tan-14.vercel.app/${rawPhoto.replace(/^\/+/, "")}`
                    : "";

                if (!cancelled) {
                    setUser({
                        id: profile.id || profileId,
                        name: profile.name || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        status: profile.status || "Active",
                        createdAt:
                            profile.createdAt ||
                            profile.created_at ||
                            null,
                        profilePhoto: photoURL
                    });
                }
            } catch (error) {
                console.error("View profile error:", error);

                if (!cancelled) {
                    setError(
                        error.message || "Cannot connect to server."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        getProfile();

        return () => {
            cancelled = true;
        };
    }, [navigate, profileId]);

    if (loading) {
        return (
            <div className="view-profile-page">
                <div className="view-profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-profile-page">
                <div className="view-profile-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="view-profile-page">

            {/* HEADER */}
            <div className="view-profile-header">
                <div>
                    <h1>
                        <span></span>
                        View Profile
                    </h1>

                    <p>
                        View account information
                    </p>
                </div>

                <button
                    type="button"
                    className="view-back-btn"
                    onClick={() => navigate("/profile")}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* PROFILE CARD */}
            <div className="view-profile-card">

                {/* PROFILE IMAGE */}
                <div className="view-profile-photo-section">
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="view-profile-photo"
                        />
                    ) : (
                        <div className="view-profile-photo-placeholder">
                            <User size={55} />
                        </div>
                    )}

                    <p>Profile Image</p>
                </div>

                {/* INFORMATION */}
                <div className="view-profile-grid">

                    <div className="view-profile-field">
                        <label>Full Name</label>
                        <div className="view-profile-input">
                            <User size={19} />
                            <span>{user.name || "Not available"}</span>
                        </div>
                    </div>

                    <div className="view-profile-field">
                        <label>Email</label>
                        <div className="view-profile-input">
                            <Mail size={19} />
                            <span>{user.email || "Not available"}</span>
                        </div>
                    </div>

                    <div className="view-profile-field">
                        <label>Phone Number</label>
                        <div className="view-profile-input">
                            <Phone size={19} />
                            <span>{user.phone || "Not available"}</span>
                        </div>
                    </div>

                    <div className="view-profile-field">
                        <label>Account Status</label>
                        <div className="view-profile-input">
                            <ShieldCheck size={19} />
                            <span className="status-active">
                                {user.status || "Active"}
                            </span>
                        </div>
                    </div>

                    <div className="view-profile-field">
                        <label>Account Created</label>
                        <div className="view-profile-input">
                            <Calendar size={19} />
                            <span>
                                {user.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                    : "Not available"}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
