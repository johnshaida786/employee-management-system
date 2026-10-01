import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    User,
    Pencil,
    Lock,
    Eye,
} from "lucide-react";


const Profile = () => {

    const navigate = useNavigate();


    // =================================================
    // USER DATA
    // =================================================

    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        status: "Active",
        createdAt: null,
        profilePhoto: "",
    });


    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] = useState(true);


    // =================================================
    // PROFILE ERROR
    // =================================================

    const [profileError, setProfileError] = useState("");


    // =================================================
    // PASSWORD DATA
    // =================================================

    const [passwordData, setPasswordData] = useState({
        current: "",
        next: "",
        confirm: "",
    });


    const [passwordError, setPasswordError] = useState("");

    const [isUpdatingPassword, setIsUpdatingPassword] =
        useState(false);


    // =================================================
    // GET PROFILE FROM BACKEND
    // =================================================

    useEffect(() => {

        const getProfile = async () => {

            try {

                // Get logged-in user
                const savedUser =
                    localStorage.getItem("user");

                console.log("Saved user:", savedUser);

                // No user session
                if (!savedUser) {

                    setProfileError(
                        "User session not found. Please login again."
                    );

                    setLoading(false);

                    return;
                }


                // Parse user
                const loggedInUser =
                    JSON.parse(savedUser);

                console.log("Logged in user:", loggedInUser);


                // Check user ID
                if (!loggedInUser.id) {

                    setProfileError(
                        "User ID not found. Please login again."
                    );

                    setLoading(false);

                    return;
                }


                // ============================================
                // FETCH PROFILE
                // ============================================

                const response = await fetch(
                    `http://localhost:5000/profile/${loggedInUser.id}`
                );


                const result =
                    await response.json();

                console.log("Profile response:", result);


                // Check response
                if (!response.ok) {

                    setProfileError(
                        result.message ||
                        "Failed to load profile."
                    );

                    setLoading(false);

                    return;
                }


                // ============================================
                // SET PROFILE DATA
                // ============================================

                const profile = result.user;


                // Backend may return either camelCase or snake_case.
                const rawPhoto =
                    profile.profilePhoto ||
                    profile.profile_photo ||
                    "";


                // Build full URL if it's a relative path.
                const photoURL = rawPhoto
                    ? (rawPhoto.startsWith("http")
                        ? rawPhoto
                        : `http://localhost:5000/${rawPhoto.replace(/^\/+/, "")}`)
                    : "";

                console.log("Photo URL:", photoURL);


                setUser({
                    id: profile.id || loggedInUser.id,

                    name:
                        profile.name || "",

                    email:
                        profile.email || "",

                    phone:
                        profile.phone || "",

                    status:
                        profile.status || "Active",

                    createdAt:
                        profile.createdAt || null,

                    profilePhoto:
                        photoURL,
                });


                // Keep localStorage in sync (optional but useful)
                const updatedSession = {
                    ...loggedInUser,
                    name: profile.name || loggedInUser.name,
                    email: profile.email || loggedInUser.email,
                    phone: profile.phone || loggedInUser.phone,
                    profilePhoto: photoURL,
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedSession)
                );


                setLoading(false);

            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );


                setProfileError(
                    "Cannot connect to server."
                );


                setLoading(false);
            }
        };


        getProfile();

    }, []);


    // =================================================
    // PASSWORD INPUT
    // =================================================

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPasswordData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        setPasswordError("");
    };


    // =================================================
    // CHANGE PASSWORD
    // =================================================

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();


        setPasswordError("");


        // ============================================
        // VALIDATION
        // ============================================

        if (
            !passwordData.current ||
            !passwordData.next ||
            !passwordData.confirm
        ) {

            setPasswordError(
                "Please enter all password details."
            );

            return;
        }


        // ============================================
        // CONFIRM PASSWORD
        // ============================================

        if (
            passwordData.next !==
            passwordData.confirm
        ) {

            setPasswordError(
                "New password and confirm password do not match."
            );

            return;
        }


        // ============================================
        // PASSWORD LENGTH
        // ============================================

        if (
            passwordData.next.length < 6
        ) {

            setPasswordError(
                "New password must be at least 6 characters."
            );

            return;
        }


        // ============================================
        // GET LOGGED-IN USER
        // ============================================

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            setPasswordError(
                "User session not found. Please login again."
            );

            return;
        }


        let loggedInUser;


        try {

            loggedInUser =
                JSON.parse(savedUser);

        } catch (error) {

            console.error(error);

            setPasswordError(
                "Invalid user session."
            );

            return;
        }


        // ============================================
        // UPDATE PASSWORD
        // ============================================

        try {

            setIsUpdatingPassword(true);


            const response = await fetch(
                "http://localhost:5000/change-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({

                        email:
                            loggedInUser.email,

                        currentPassword:
                            passwordData.current,

                        newPassword:
                            passwordData.next,

                    }),
                }
            );


            const result =
                await response.json();


            // ============================================
            // ERROR RESPONSE
            // ============================================

            if (!response.ok) {

                setPasswordError(
                    result.message ||
                    "Password update failed."
                );

                return;
            }


            // ============================================
            // SUCCESS
            // ============================================

            alert(
                "Password updated successfully!"
            );


            setPasswordData({
                current: "",
                next: "",
                confirm: "",
            });

        } catch (error) {

            console.error(
                "Password update error:",
                error
            );


            setPasswordError(
                "Cannot connect to server."
            );

        } finally {

            setIsUpdatingPassword(false);

        }
    };


    // =================================================
    // LOADING SCREEN
    // =================================================

    if (loading) {

        return (

            <div className="profile-page">

                <div className="profile-loading">

                    Loading profile...

                </div>

            </div>

        );
    }


    // =================================================
    // PROFILE PAGE
    // =================================================

    return (

        <div className="profile-page">


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <section className="profile-header card">


                {/* PROFILE AVATAR */}

                <div className="profile-avatar">

                    {user.profilePhoto ? (

                        <img
                            src={user.profilePhoto}
                            alt={user.name || "Profile"}
                            className="profile-avatar-img"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement.classList.add(
                                    "show-fallback"
                                );
                            }}
                        />

                    ) : (

                        <User size={36} />

                    )}

                </div>


                {/* PROFILE DETAILS */}

                <div className="profile-header-info">

                    <h1 className="profile-name">

                        {user.name ||
                            "Unnamed User"}

                    </h1>


                    <p className="profile-email">

                        {user.email ||
                            "Not available"}

                    </p>


                    <span className="badge badge-success">

                        {user.status ||
                            "Active"}

                    </span>

                </div>


                {/* EDIT PROFILE BUTTON */}

                <button
                    type="button"
                    className="btn btn-primary edit-profile-button"
                    onClick={() =>
                        navigate("/edit-profile")
                    }
                >

                    <Pencil size={16} />

                    Edit Profile

                </button>


            </section>



            {/* =================================================
                PROFILE ERROR
            ================================================= */}

            {profileError && (

                <p className="profile-password-error">

                    {profileError}

                </p>

            )}



            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <section className="section-block">


                <h2 className="section-title">

                    Account Information

                </h2>


                <div className="account-table-card">


                    <div className="account-table-wrapper">


                        <table className="account-table">


                            {/* ====================================
                                TABLE HEADER
                            ==================================== */}

                            <thead>

                                <tr>

                                    <th>
                                        FULL NAME
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        PHONE
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>



                            {/* ====================================
                                TABLE BODY
                            ==================================== */}

                            <tbody>

                                <tr>


                                    {/* FULL NAME */}

                                    <td>

                                        <div className="account-user">


                                            <div className="account-user-avatar">

                                                {user.profilePhoto ? (

                                                    <img
                                                        src={user.profilePhoto}
                                                        alt={user.name || "Profile"}
                                                        className="account-user-avatar-img"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />

                                                ) : (

                                                    <User size={22} />

                                                )}

                                            </div>


                                            <span>

                                                {user.name ||
                                                    "Not available"}

                                            </span>


                                        </div>

                                    </td>



                                    {/* EMAIL */}

                                    <td>

                                        {user.email ||
                                            "Not available"}

                                    </td>



                                    {/* PHONE */}

                                    <td>

                                        {user.phone ||
                                            "Not available"}

                                    </td>



                                    {/* STATUS */}

                                    <td>

                                        <span className="account-status">

                                            {user.status ||
                                                "Active"}

                                        </span>

                                    </td>



                                    {/* ACTIONS */}

                                    <td>

                                        <div className="account-actions">


                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                className="table-action view-action"
                                                title="View Profile"
                                                onClick={() =>
                                                    navigate(
                                                        "/profile"
                                                    )
                                                }
                                            >

                                                <Eye size={17} />

                                            </button>



                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="table-action edit-action"
                                                title="Edit Profile"
                                                onClick={() =>
                                                    navigate(
                                                        "/edit-profile"
                                                    )
                                                }
                                            >

                                                <Pencil size={17} />

                                            </button>


                                        </div>

                                    </td>


                                </tr>

                            </tbody>


                        </table>

                    </div>

                </div>


            </section>



            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            <section className="section-block">


                <h2 className="section-title">

                    Change Password

                </h2>


                <form
                    className="card password-card"
                    onSubmit={
                        handlePasswordSubmit
                    }
                >


                    {/* PASSWORD ERROR */}

                    {passwordError && (

                        <p className="profile-password-error">

                            {passwordError}

                        </p>

                    )}



                    <div className="password-form-grid">


                        {/* CURRENT PASSWORD */}

                        <div className="form-field">


                            <label htmlFor="current">

                                Current Password

                            </label>


                            <input
                                id="current"
                                name="current"
                                type="password"
                                value={
                                    passwordData.current
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Enter current password"
                                autoComplete="current-password"
                            />


                        </div>



                        {/* NEW PASSWORD */}

                        <div className="form-field">


                            <label htmlFor="next">

                                New Password

                            </label>


                            <input
                                id="next"
                                name="next"
                                type="password"
                                value={
                                    passwordData.next
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />


                        </div>



                        {/* CONFIRM PASSWORD */}

                        <div className="form-field">


                            <label htmlFor="confirm">

                                Confirm New Password

                            </label>


                            <input
                                id="confirm"
                                name="confirm"
                                type="password"
                                value={
                                    passwordData.confirm
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />


                        </div>

                    </div>



                    {/* PASSWORD BUTTON */}

                    <div className="form-actions">


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                isUpdatingPassword
                            }
                        >

                            <Lock size={16} />


                            {isUpdatingPassword
                                ? "Updating..."
                                : "Update Password"}


                        </button>


                    </div>


                </form>


            </section>


        </div>

    );
};


export default Profile;