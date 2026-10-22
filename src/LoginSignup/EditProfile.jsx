import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // ---------- Load profile ----------
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

        if (!loggedInUser?.id) {
          navigate("/login");
          return;
        }

       const targetId = profileId || loggedInUser.id;

        const token=localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/getProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: targetId,
          }),
        });
        

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const user = data.user;
        if (!user) {
          throw new Error("Profile data not found");
        }

        if (!cancelled) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            currentPassword: "",
            password: "",
          });

          const rawPhoto = user.profilePhoto || user.profile_photo || "";
          if (rawPhoto) {
            setProfilePhoto(
              rawPhoto.startsWith("http")
                ? rawPhoto
                : `${API_URL}/${rawPhoto.replace(/^\/+/, "")}`
            );
          }
        }
      } catch (err) {
        console.error("Load profile error:", err);
        if (!cancelled) setError(err.message || "Unable to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate, profileId]);

  // ---------- Handlers ----------
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Phone: only digits, max 10
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

      setFormData((previous) => ({ ...previous, phone: digitsOnly }));

      // Live error feedback
      if (digitsOnly.length === 0) {
        setPhoneError("Phone number is required.");
      } else if (digitsOnly.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
      return;
    }

    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
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
    setProfilePhoto(URL.createObjectURL(file));
  };

  // ---------- Submit ----------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    setPhoneError("");

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedInUser?.id) {
      setSaving(false);
      navigate("/login");
      return;
    }

    const targetUserId = profileId || loggedInUser.id;
    const wantsPasswordChange = formData.password.length > 0;

    // ---------- Phone validation ----------
    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      setPhoneError("Phone number is required.");
      setError("Please fix the highlighted fields.");
      setSaving(false);
      return;
    }
    if (!/^\d{10}$/.test(trimmedPhone)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      setError("Please fix the highlighted fields.");
      setSaving(false);
      return;
    }

    // ---------- Password validation ----------
    if (wantsPasswordChange && !formData.currentPassword) {
      setError("Please enter your current password.");
      setSaving(false);
      return;
    }
    if (wantsPasswordChange && formData.password.length < 6) {
      setError("New password must be at least 6 characters.");
      setSaving(false);
      return;
    }

    try {
      const token=localStorage.getItem("token");
      
      const profileResponse = await fetch(
        `${API_URL}/profile/updateProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: targetUserId,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: trimmedPhone,
          }),
        }
      );

      
      const profileResult = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileResult.message || "Failed to update profile");
      }

      const updatedUser = {
        ...loggedInUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: trimmedPhone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 2. Change password if provided
      if (wantsPasswordChange) {
        const passwordResponse = await fetch(`${API_URL}/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
            Authorization:`Bearer ${token}`,
           },
          body: JSON.stringify({
            email: loggedInUser.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.password,
          }),
        });

        const passwordResult = await passwordResponse.json();
        if (!passwordResponse.ok) {
          throw new Error(
            passwordResult.message || "Failed to change password"
          );
        }
      }

      // 3. Upload photo if selected
      if (selectedPhoto) {
        const photoData = new FormData();
        photoData.append("profile_photo", selectedPhoto);
        photoData.append("userId", String(targetUserId));

        const photoResponse = await fetch(
          `${API_URL}/profile/uploadPhoto`,
          {
            method: "POST",
            headers:{
              Authorization:`Bearer ${token}`,
            },
            body: photoData,
          }
        );


        const photoResult = await photoResponse.json();
        if (!photoResponse.ok) {
          throw new Error(
            photoResult.message || "Profile updated, but photo upload failed"
          );
        }

        if (photoResult.profile_photo) {
          updatedUser.profilePhoto = photoResult.profile_photo;
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="edit-loading">Loading profile...</div>
      </div>
    );
  }

  const isPhoneValid = /^\d{10}$/.test(formData.phone);

  return (
    <div className="edit-profile-page">
      <div className="edit-page-header">
        <div className="edit-title">
          <span />
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
            Back
          </button>

          <button
            type="submit"
            form="edit-profile-form"
            className="btn-save"
            disabled={saving || !isPhoneValid}
          >
            <Save size={16} />
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      <form
        id="edit-profile-form"
        className="edit-profile-card"
        onSubmit={handleSubmit}
      >
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-photo-section">
          <label
            htmlFor="profilePhoto"
            className={`profile-photo-wrapper ${profilePhoto ? "" : "no-photo"
              }`}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="profile-photo"
                onError={() => setProfilePhoto("")}
              />
            ) : (
              <div className="profile-photo-placeholder">
                <Plus size={32} strokeWidth={1.5} />
              </div>
            )}

            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
          <p className="photo-text">Click the circle to upload image</p>
        </div>

        <div className="edit-form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Admin Name <span>*</span>
            </label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter admin name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowCurrentPassword((shown) => !shown)}
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter updated password"
                autoComplete="new-password"
                minLength={6}
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={
                  showPassword ? "Hide new password" : "Show new password"
                }
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span>*</span>
            </label>
            <div
              className={`input-wrapper ${phoneError ? "input-wrapper-error" : ""
                }`}
            >
              <Phone size={18} />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                inputMode="numeric"
                maxLength={10}
                pattern="\d{10}"
                required
              />
            </div>
            {phoneError && (
              <p className="field-error-message">{phoneError}</p>
            )}
            {!phoneError && formData.phone.length > 0 && (
              <p className="field-hint">
                {formData.phone.length}/10 digits
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;