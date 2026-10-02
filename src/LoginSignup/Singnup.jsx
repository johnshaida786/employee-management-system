import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Singnup = () => {

    const userDetail = {
        name: "",
        email: "",
        password: ""
    };

    const [data, setData] = useState(userDetail);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Modal state
    const [modal, setModal] = useState({
        show: false,
        type: "success", // "success" or "error"
        title: "",
        message: ""
    });

    const navigate = useNavigate();


    // =========================
    // HANDLE INPUT
    // =========================
    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData({ ...data, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };


    // =========================
    // VALIDATION
    // =========================
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!data.name.trim()) {
            newErrors.name = "Full name is required";
            isValid = false;
        }

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Invalid email";
            isValid = false;
        }

        if (!data.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (data.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    // =========================
    // MODAL HELPERS
    // =========================
    const showModal = (type, title, message) => {
        setModal({ show: true, type, title, message });
    };

    const closeModal = () => {
        setModal({ ...modal, show: false });

        // Navigate only if it was a success modal
        if (modal.type === "success") {
            navigate("/login");
        }
    };


    // =========================
    // HANDLE SIGNUP
    // =========================
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showModal(
                    "success",
                    "Account Created!",
                    "Your account has been created successfully. You can now log in."
                );
            } else {
                showModal(
                    "error",
                    "Signup Failed",
                    result.message || "Something went wrong. Please try again."
                );
            }

        } catch (error) {
            console.log(error);
            showModal(
                "error",
                "Connection Error",
                "Cannot connect to the server. Please try again later."
            );
        }
    };


    return (
        <div>

            <Navbar />

            <div
                style={{
                    minHeight: "calc(100vh - 60px)",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "35px 20px",
                    boxSizing: "border-box",
                    background:
                        "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0fdf4 100%)"
                }}
            >

                <form
                    onSubmit={handleSubmit}
                    style={{
                        width: "430px",
                        maxWidth: "100%",
                        margin: "0 auto",
                        padding: "40px 40px 35px",
                        boxSizing: "border-box",
                        background: "rgba(255,255,255,0.96)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "24px",
                        boxShadow:
                            "0 25px 60px rgba(15,23,42,0.12), 0 8px 20px rgba(15,23,42,0.05)"
                    }}
                >

                    <div
                        style={{
                            width: "70px",
                            height: "5px",
                            margin: "0 auto 23px",
                            borderRadius: "10px",
                            background:
                                "linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)"
                        }}
                    />

                    <h1
                        style={{
                            margin: "0",
                            textAlign: "center",
                            color: "#111827",
                            fontSize: "30px",
                            fontWeight: "750",
                            letterSpacing: "-0.5px"
                        }}
                    >
                        Create Account
                    </h1>

                    <p style={{ margin: "9px 0 28px" }}></p>

                    {/* ========= NAME ========= */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={data.name}
                        onChange={handleInput}
                        style={{
                            width: "100%",
                            height: "55px",
                            margin: "0 0 5px",
                            padding: "0 17px",
                            boxSizing: "border-box",
                            border: errors.name ? "1px solid #ef4444" : "1px solid #dbe2ea",
                            borderRadius: "14px",
                            background: errors.name ? "#fef2f2" : "#f8fafc",
                            color: "#111827",
                            fontSize: "15px",
                            outline: "none",
                            transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                            if (!errors.name) {
                                e.target.style.background = "#ffffff";
                                e.target.style.borderColor = "#6366f1";
                                e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.10)";
                            }
                        }}
                        onBlur={(e) => {
                            if (!errors.name) {
                                e.target.style.background = "#f8fafc";
                                e.target.style.borderColor = "#dbe2ea";
                                e.target.style.boxShadow = "none";
                            }
                        }}
                    />
                    {errors.name ? (
                        <p style={{ color: "#ef4444", fontSize: "12px", margin: "0 0 16px 4px" }}>
                            {errors.name}
                        </p>
                    ) : <div style={{ margin: "0 0 11px" }} />}


                    {/* ========= EMAIL ========= */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={data.email}
                        onChange={handleInput}
                        style={{
                            width: "100%",
                            height: "55px",
                            margin: "0 0 5px",
                            padding: "0 17px",
                            boxSizing: "border-box",
                            border: errors.email ? "1px solid #ef4444" : "1px solid #dbe2ea",
                            borderRadius: "14px",
                            background: errors.email ? "#fef2f2" : "#f8fafc",
                            color: "#111827",
                            fontSize: "15px",
                            outline: "none",
                            transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                            if (!errors.email) {
                                e.target.style.background = "#ffffff";
                                e.target.style.borderColor = "#6366f1";
                                e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.10)";
                            }
                        }}
                        onBlur={(e) => {
                            if (!errors.email) {
                                e.target.style.background = "#f8fafc";
                                e.target.style.borderColor = "#dbe2ea";
                                e.target.style.boxShadow = "none";
                            }
                        }}
                    />
                    {errors.email ? (
                        <p style={{ color: "#ef4444", fontSize: "12px", margin: "0 0 16px 4px" }}>
                            {errors.email}
                        </p>
                    ) : <div style={{ margin: "0 0 11px" }} />}


                    {/* ========= PASSWORD ========= */}
                    <div style={{ position: "relative", width: "100%", margin: "0" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={handleInput}
                            style={{
                                width: "100%",
                                height: "55px",
                                margin: "0 0 5px",
                                padding: "0 52px 0 17px",
                                boxSizing: "border-box",
                                border: errors.password ? "1px solid #ef4444" : "1px solid #dbe2ea",
                                borderRadius: "14px",
                                background: errors.password ? "#fef2f2" : "#f8fafc",
                                color: "#111827",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                if (!errors.password) {
                                    e.target.style.background = "#ffffff";
                                    e.target.style.borderColor = "#6366f1";
                                    e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.10)";
                                }
                            }}
                            onBlur={(e) => {
                                if (!errors.password) {
                                    e.target.style.background = "#f8fafc";
                                    e.target.style.borderColor = "#dbe2ea";
                                    e.target.style.boxShadow = "none";
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "9px",
                                top: "25px",
                                transform: "translateY(-50%)",
                                width: "36px",
                                height: "36px",
                                padding: "0",
                                margin: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                borderRadius: "10px",
                                background: "transparent",
                                color: "#64748b",
                                cursor: "pointer",
                                lineHeight: "0",
                                fontSize: "16px",
                                boxSizing: "border-box"
                            }}
                        >
                            {showPassword ? <FaEye size={17} /> : <FaEyeSlash size={17} />}
                        </button>
                    </div>
                    {errors.password ? (
                        <p style={{ color: "#ef4444", fontSize: "12px", margin: "0 0 16px 4px" }}>
                            {errors.password}
                        </p>
                    ) : <div style={{ margin: "0 0 11px" }} />}


                    {/* ========= LOGIN LINK ========= */}
                    <p
                        style={{
                            margin: "18px 0 0",
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        Already have an account?{" "}
                        <a
                            href="/login"
                            style={{
                                color: "#4f46e5",
                                fontWeight: "600",
                                textDecoration: "none",
                                cursor: "pointer"
                            }}
                        >
                            Login
                        </a>
                    </p>


                    {/* ========= SUBMIT BUTTON ========= */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            height: "52px",
                            margin: "25px 0 0",
                            border: "none",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "#ffffff",
                            fontSize: "17px",
                            fontWeight: "650",
                            cursor: "pointer",
                            boxShadow: "0 10px 22px rgba(16,185,129,0.20)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 14px 28px rgba(16,185,129,0.25)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 10px 22px rgba(16,185,129,0.20)";
                        }}
                    >
                        Create Account
                    </button>

                    <p
                        style={{
                            margin: "20px 0 0",
                            textAlign: "center",
                            color: "#94a3b8",
                            fontSize: "12px"
                        }}
                    >
                        Secure Privacy registration
                    </p>

                </form>

            </div>


            {/* =========================
                CUSTOM MODAL
            ========================= */}
            {modal.show && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15, 23, 42, 0.55)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                        animation: "fadeIn 0.2s ease"
                    }}
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "380px",
                            maxWidth: "100%",
                            background: "#ffffff",
                            borderRadius: "20px",
                            padding: "32px 28px 24px",
                            boxSizing: "border-box",
                            textAlign: "center",
                            boxShadow: "0 25px 60px rgba(15,23,42,0.25)",
                            animation: "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        }}
                    >

                        {/* Icon */}
                        <div
                            style={{
                                width: "70px",
                                height: "70px",
                                margin: "0 auto 18px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    modal.type === "success"
                                        ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                                        : "linear-gradient(135deg, #fee2e2, #fecaca)",
                                color:
                                    modal.type === "success"
                                        ? "#059669"
                                        : "#dc2626"
                            }}
                        >
                            {modal.type === "success" ? (
                                <FaCheckCircle size={34} />
                            ) : (
                                <FaTimesCircle size={34} />
                            )}
                        </div>

                        {/* Title */}
                        <h2
                            style={{
                                margin: "0 0 8px",
                                fontSize: "21px",
                                fontWeight: "700",
                                color: "#111827"
                            }}
                        >
                            {modal.title}
                        </h2>

                        {/* Message */}
                        <p
                            style={{
                                margin: "0 0 24px",
                                fontSize: "14.5px",
                                lineHeight: "1.55",
                                color: "#64748b"
                            }}
                        >
                            {modal.message}
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={closeModal}
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "none",
                                borderRadius: "12px",
                                background:
                                    modal.type === "success"
                                        ? "linear-gradient(135deg, #10b981, #059669)"
                                        : "linear-gradient(135deg, #ef4444, #dc2626)",
                                color: "#ffffff",
                                fontSize: "15.5px",
                                fontWeight: "600",
                                cursor: "pointer",
                                boxShadow:
                                    modal.type === "success"
                                        ? "0 8px 18px rgba(16,185,129,0.25)"
                                        : "0 8px 18px rgba(239,68,68,0.25)",
                                transition: "transform 0.15s ease"
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.transform = "translateY(-1px)")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.transform = "translateY(0)")
                            }
                        >
                            {modal.type === "success" ? "Continue" : "Try Again"}
                        </button>
                    </div>

                    {/* Animations */}
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes popIn {
                            0% { opacity: 0; transform: scale(0.85); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}

        </div>
    );
};

export default Singnup;