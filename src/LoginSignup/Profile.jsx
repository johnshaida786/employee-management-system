import React, { useEffect, useState } from 'react';

import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Pencil,
  Lock,
  Save,
  X,
} from 'lucide-react';


const Profile = () => {

  // =================================================
  // EDIT MODE
  // =================================================

  const [isEditing, setIsEditing] = useState(false);


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
  });


  // =================================================
  // EDIT FORM
  // =================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });


  // =================================================
  // LOADING
  // =================================================

  const [loading, setLoading] = useState(true);


  // =================================================
  // PROFILE MESSAGE
  // =================================================

  const [profileError, setProfileError] = useState("");

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);


  // =================================================
  // PASSWORD
  // =================================================

  const [passwordData, setPasswordData] = useState({
    current: "",
    next: "",
    confirm: "",
  });


  const [passwordError, setPasswordError] =
    useState("");


  const [isUpdatingPassword, setIsUpdatingPassword] =
    useState(false);


  // =================================================
  // GET PROFILE FROM BACKEND
  // =================================================

  useEffect(() => {

    const getProfile = async () => {

      try {

        const savedUser =
          localStorage.getItem("user");


        console.log(
          "Saved user:",
          savedUser
        );


        if (!savedUser) {

          setProfileError(
            "User session not found. Please login again."
          );

          setLoading(false);

          return;
        }


        const loggedInUser =
          JSON.parse(savedUser);


        console.log(
          "Logged in user:",
          loggedInUser
        );


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


        console.log(
          "Profile response:",
          result
        );


        if (!response.ok) {

          setProfileError(
            result.message ||
            "Failed to load profile"
          );

          setLoading(false);

          return;
        }


        // ============================================
        // SET USER
        // ============================================

        const profile =
          result.user;


        setUser(profile);


        setFormData({

          name:
            profile.name || "",

          email:
            profile.email || "",

          phone:
            profile.phone || ""

        });


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
  // HANDLE PROFILE INPUT
  // =================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );


    setProfileError("");

  };


  // =================================================
  // HANDLE PASSWORD INPUT
  // =================================================

  const handlePasswordChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setPasswordData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );


    setPasswordError("");

  };


  // =================================================
  // SAVE PROFILE TO BACKEND
  // =================================================

  const handleSave = async (e) => {

    e.preventDefault();

    setProfileError("");


    // Validate
    if (!formData.name.trim()) {

      setProfileError(
        "Please enter your name."
      );

      return;
    }


    if (!formData.email.trim()) {

      setProfileError(
        "Please enter your email."
      );

      return;
    }


    // Get logged-in user
    const savedUser =
      localStorage.getItem("user");


    if (!savedUser) {

      setProfileError(
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

      setProfileError(
        "Invalid user session."
      );

      return;
    }


    if (!loggedInUser.id) {

      setProfileError(
        "User ID not found."
      );

      return;
    }


    try {

      setIsSavingProfile(true);


      console.log(
        "Sending profile update:",
        {
          id: loggedInUser.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      );


      // ============================================
      // SEND UPDATE TO BACKEND
      // ============================================

      const response = await fetch(
        `http://localhost:5000/profile/${loggedInUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name:
              formData.name.trim(),

            email:
              formData.email.trim(),

            phone:
              formData.phone.trim()

          })
        }
      );


      const result =
        await response.json();


      console.log(
        "Update response:",
        result
      );


      if (!response.ok) {

        setProfileError(
          result.message ||
          "Failed to update profile."
        );

        return;
      }


      // ============================================
      // UPDATE SCREEN
      // ============================================

      setUser(
        (previous) => ({

          ...previous,

          name:
            result.user?.name ||
            formData.name.trim(),

          email:
            result.user?.email ||
            formData.email.trim(),

          phone:
            result.user?.phone ||
            formData.phone.trim()

        })
      );


      // ============================================
      // UPDATE LOCAL STORAGE
      // ============================================

      const updatedLocalUser = {

        ...loggedInUser,

        name:
          result.user?.name ||
          formData.name.trim(),

        email:
          result.user?.email ||
          formData.email.trim()

      };


      localStorage.setItem(
        "user",
        JSON.stringify(updatedLocalUser)
      );


      // Close editor
      setIsEditing(false);


      // Success alert
      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );


      setProfileError(
        "Cannot connect to server."
      );

    } finally {

      setIsSavingProfile(false);

    }

  };


  // =================================================
  // CANCEL EDIT
  // =================================================

  const handleCancel = () => {

    setFormData({

      name:
        user.name || "",

      email:
        user.email || "",

      phone:
        user.phone || ""

    });


    setProfileError("");

    setIsEditing(false);

  };


  // =================================================
  // CHANGE PASSWORD
  // =================================================

  const handlePasswordSubmit = async (e) => {

    e.preventDefault();

    setPasswordError("");


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


    if (
      passwordData.next !==
      passwordData.confirm
    ) {

      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }


    if (
      passwordData.next.length < 6
    ) {

      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;
    }


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

      setPasswordError(
        "Invalid user session."
      );

      return;
    }


    try {

      setIsUpdatingPassword(true);


      const response = await fetch(
        "http://localhost:5000/change-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            email:
              loggedInUser.email,

            currentPassword:
              passwordData.current,

            newPassword:
              passwordData.next

          })
        }
      );


      const result =
        await response.json();


      if (!response.ok) {

        setPasswordError(
          result.message ||
          "Password update failed."
        );

        return;
      }


      alert(
        "Password updated successfully!"
      );


      setPasswordData({

        current: "",
        next: "",
        confirm: ""

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
  // LOADING
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


  return (

    <div className="profile-page">


      {/* ==========================================
          PROFILE HEADER
      ========================================== */}

      <section className="profile-header card">

        <div className="profile-avatar">
          <User size={36} />
        </div>


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


        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setIsEditing(!isEditing)
          }
        >

          <Pencil size={16} />

          {isEditing
            ? "Close Editor"
            : "Edit Profile"}

        </button>

      </section>


      {/* ==========================================
          PROFILE MESSAGE
      ========================================== */}

      {profileError && (

        <p className="profile-password-error">
          {profileError}
        </p>

      )}


      {/* ==========================================
          ACCOUNT INFORMATION
      ========================================== */}

      <section className="section-block">

        <h2 className="section-title">
          Account Information
        </h2>


        <div className="card">

          <div className="info-row">

            <span className="info-row-icon">
              <User size={18} />
            </span>

            <div>

              <p className="info-row-label">
                Full Name
              </p>

              <p className="info-row-value">
                {user.name ||
                  "Not available"}
              </p>

            </div>

          </div>


          <div className="info-row">

            <span className="info-row-icon">
              <Mail size={18} />
            </span>

            <div>

              <p className="info-row-label">
                Email Address
              </p>

              <p className="info-row-value">
                {user.email ||
                  "Not available"}
              </p>

            </div>

          </div>


          <div className="info-row">

            <span className="info-row-icon">
              <Phone size={18} />
            </span>

            <div>

              <p className="info-row-label">
                Phone Number
              </p>

              <p className="info-row-value">
                {user.phone ||
                  "Not available"}
              </p>

            </div>

          </div>


          <div className="info-row">

            <span className="info-row-icon">
              <ShieldCheck size={18} />
            </span>

            <div>

              <p className="info-row-label">
                Account Status
              </p>

              <p className="info-row-value">
                {user.status ||
                  "Active"}
              </p>

            </div>

          </div>


          <div className="info-row">

            <span className="info-row-icon">
              <Calendar size={18} />
            </span>

            <div>

              <p className="info-row-label">
                Account Created
              </p>

              <p className="info-row-value">

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

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          EDIT PROFILE
      ========================================== */}

      {isEditing && (

        <section className="section-block">

          <h2 className="section-title">
            Edit Profile
          </h2>


          <form
            className="card form-grid"
            onSubmit={handleSave}
          >

            <div className="form-field">

              <label htmlFor="name">
                Name
              </label>


              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

            </div>


            <div className="form-field">

              <label htmlFor="email">
                Email
              </label>


              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

            </div>


            <div className="form-field">

              <label htmlFor="phone">
                Phone Number
              </label>


              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingProfile}
              >

                <Save size={16} />

                {isSavingProfile
                  ? "Saving..."
                  : "Save Changes"}

              </button>


              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancel}
              >

                <X size={16} />

                Cancel

              </button>

            </div>

          </form>

        </section>

      )}


      {/* ==========================================
          CHANGE PASSWORD
      ========================================== */}

      <section className="section-block">

        <h2 className="section-title">
          Change Password
        </h2>


        <form
          className="card form-grid"
          onSubmit={handlePasswordSubmit}
        >

          {passwordError && (

            <p className="profile-password-error">
              {passwordError}
            </p>

          )}


          <div className="form-field">

            <label htmlFor="current">
              Current Password
            </label>


            <input
              id="current"
              name="current"
              type="password"
              value={passwordData.current}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

          </div>


          <div className="form-field">

            <label htmlFor="next">
              New Password
            </label>


            <input
              id="next"
              name="next"
              type="password"
              value={passwordData.next}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              autoComplete="new-password"
            />

          </div>


          <div className="form-field">

            <label htmlFor="confirm">
              Confirm New Password
            </label>


            <input
              id="confirm"
              name="confirm"
              type="password"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdatingPassword}
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