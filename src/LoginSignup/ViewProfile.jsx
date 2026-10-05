import React, { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
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
        const getProfile = async () => {
            try {
                const savedUser = localStorage.getItem("user");

                if (!savedUser) {
                    navigate("/login");
                    return;
                }

                const loggedInUser = JSON.parse(savedUser);

                if (!loggedInUser.id) {
                    navigate("/login");
                    return;
                }

               const response = await fetch(
    `http://localhost:5000/profile/${loggedInUser.id}`
);

const result = await response.json();

if (!response.ok) {
    setError(result.message || "Failed to load profile");
    return;
}

const profile = result.user;

// Get profile photo from backend
const rawPhoto =
    profile.profilePhoto ||
    profile.profile_photo ||
    "";

// Create correct image URL
const photoURL = rawPhoto
    ? (
        rawPhoto.startsWith("http")
            ? rawPhoto
            : `http://localhost:5000/${rawPhoto.replace(/^\/+/, "")}`
      )
    : "";

// Store backend data
setUser({
    id: profile.id || loggedInUser.id,
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    status: profile.status || "Active",
    createdAt: profile.createdAt || null,
    profilePhoto: photoURL
});


            } catch (error) {
                console.error("View profile error:", error);
                setError("Cannot connect to server.");
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

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
                        View your personal account information
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
                            src={
                                user.profilePhoto.startsWith("http")
                                    ? user.profilePhoto
                                    : `http://localhost:5000${user.profilePhoto}`
                            }
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

                    {/* NAME */}
                    <div className="view-profile-field">
                        <label>Full Name</label>

                        <div className="view-profile-input">
                            <User size={19} />

                            <span>
                                {user.name || "Not available"}
                            </span>
                        </div>
                    </div>


                    {/* EMAIL */}
                    <div className="view-profile-field">
                        <label>Email</label>

                        <div className="view-profile-input">
                            <Mail size={19} />

                            <span>
                                {user.email || "Not available"}
                            </span>
                        </div>
                    </div>


                    {/* PHONE */}
                    <div className="view-profile-field">
                        <label>Phone Number</label>

                        <div className="view-profile-input">
                            <Phone size={19} />

                            <span>
                                {user.phone || "Not available"}
                            </span>
                        </div>
                    </div>


                    {/* STATUS */}
                    <div className="view-profile-field">
                        <label>Account Status</label>

                        <div className="view-profile-input">
                            <ShieldCheck size={19} />

                            <span className="status-active">
                                {user.status || "Active"}
                            </span>
                        </div>
                    </div>


                    {/* CREATED DATE */}
                    <div className="view-profile-field">
                        <label>Account Created</label>

                        <div className="view-profile-input">
                            <Calendar size={19} />

                            <span>
                                {user.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString(
                                          "en-IN",
                                          {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric"
                                          }
                                      )
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