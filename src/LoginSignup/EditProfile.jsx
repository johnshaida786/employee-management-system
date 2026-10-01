import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    Save,
    Plus
} from "lucide-react";


const EditProfile = () => {

    const navigate = useNavigate();


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });


    // =====================================================
    // PROFILE PHOTO
    // =====================================================

    const [profilePhoto, setProfilePhoto] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);


    // =====================================================
    // STATES
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // GET EXISTING PROFILE
    // =====================================================

    useEffect(() => {

        const loggedInUser = JSON.parse(
            localStorage.getItem("user")
        );

        if (!loggedInUser || !loggedInUser.id) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/profile/${loggedInUser.id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                return response.json();
            })
            .then((data) => {

                const user = data.user;

                if (!user) {
                    throw new Error("Profile data not found");
                }

                // Text fields
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || ""
                });

                // Normalize photo URL — backend may send relative path
                const rawPhoto =
                    user.profilePhoto || user.profile_photo || "";

                const photoURL = rawPhoto
                    ? (rawPhoto.startsWith("http")
                        ? rawPhoto
                        : `http://localhost:5000/${rawPhoto.replace(/^\/+/, "")}`)
                    : "";

                if (photoURL) {
                    setProfilePhoto(photoURL);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load profile.");
                setLoading(false);
            });

    }, [navigate]);


    // =====================================================
    // HANDLE TEXT INPUT
    // =====================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // =====================================================
    // HANDLE PHOTO
    // =====================================================

    const handlePhotoChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5 MB.");
            return;
        }

        setSelectedPhoto(file);
        setError("");

        const previewURL = URL.createObjectURL(file);
        setProfilePhoto(previewURL);
    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        const loggedInUser = JSON.parse(
            localStorage.getItem("user")
        );

        if (!loggedInUser || !loggedInUser.id) {
            navigate("/login");
            return;
        }

        try {

            // =========================================
            // UPDATE NAME / EMAIL / PHONE
            // =========================================

            const response = await fetch(
                `http://localhost:5000/profile/${loggedInUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update profile"
                );
            }

            // Update localStorage
            const updatedUser = {
                ...loggedInUser,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );


            // =========================================
            // UPLOAD PHOTO
            // =========================================

            if (selectedPhoto) {

                const photoData = new FormData();
                photoData.append("profile_photo", selectedPhoto);

                const photoResponse = await fetch(
                    `http://localhost:5000/profile/${loggedInUser.id}/photo`,
                    {
                        method: "POST",
                        body: photoData
                    }
                );

                const photoResult = await photoResponse.json();

                if (!photoResponse.ok) {
                    throw new Error(
                        photoResult.message ||
                        "Profile updated, but photo upload failed."
                    );
                }

                if (photoResult.profile_photo) {
                    updatedUser.profilePhoto =
                        photoResult.profile_photo;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(updatedUser)
                    );
                }
            }


            // =========================================
            // SUCCESS
            // =========================================

            setMessage("Profile updated successfully!");

            setTimeout(() => {
                navigate("/profile");
            }, 1000);

        } catch (err) {

            console.error(err);
            setError(err.message || "Something went wrong.");

        } finally {
            setSaving(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="edit-profile-page">
                <div className="edit-loading">
                    Loading profile...
                </div>
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="edit-profile-page">

            {/* =========================================
                PAGE HEADER (outside the card)
            ========================================= */}

            <div className="edit-page-header">

                <div className="edit-title">
                    <span></span>
                    <div>
                        <h1>Edit Profile</h1>
                        <p>Update your personal information</p>
                    </div>
                </div>

                <div className="edit-header-buttons">

                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/profile")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="edit-profile-form"
                        className="btn-save"
                        disabled={saving}
                    >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>


            {/* =========================================
                MAIN CARD
            ========================================= */}

            <form
                id="edit-profile-form"
                className="edit-profile-card"
                onSubmit={handleSubmit}
            >

                {/* SUCCESS */}
                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* =====================================
                    PROFILE PHOTO
                ===================================== */}

                <div className="profile-photo-section">

                    <label
                        htmlFor="profilePhoto"
                        className="profile-photo-wrapper"
                    >
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt="Profile"
                                className="profile-photo"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement
                                        .classList.add("no-photo");
                                }}
                            />
                        ) : null}

                        <div className="profile-photo-placeholder">
                            <Plus size={32} strokeWidth={1.5} />
                        </div>

                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            hidden
                        />
                    </label>

                    <p className="photo-text">
                        Click the circle to upload image
                    </p>

                </div>


                {/* =====================================
                    FORM GRID
                ===================================== */}

                <div className="edit-form-grid">

                    {/* FULL NAME */}
                    <div className="form-group">
                        <label>
                            Full Name <span>*</span>
                        </label>
                        <div className="input-wrapper">
                            <User size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>


                    {/* EMAIL */}
                    <div className="form-group">
                        <label>
                            Email <span>*</span>
                        </label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>


                    {/* PHONE */}
                    <div className="form-group">
                        <label>Phone</label>
                        <div className="input-wrapper">
                            <Phone size={18} />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                </div>

            </form>

        </div>
    );
};


export default EditProfile;