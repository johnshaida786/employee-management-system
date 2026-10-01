import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();


    // =========================
    // HANDLE INPUT
    // =========================

    const handleInput = (event) => {

        const value = event.target.value;
        const name = event.target.name;

        if (name === "email") {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: "" }));
        }

        if (name === "password") {
            setPassword(value);
            setPasswordError(false);
            setMsg("");
            setErrors((prev) => ({ ...prev, password: "" }));
        }
    };


    // =========================
    // VALIDATE FORM
    // =========================

    const validateForm = () => {

        const nextErrors = { email: "", password: "" };
        let valid = true;

        const trimmedEmail = email.trim();

        // --- Email ---
        if (!trimmedEmail) {
            nextErrors.email = "Email is required";
            valid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                nextErrors.email = "Invalid email";
                valid = false;
            }
        }

        // --- Password ---
        if (!password) {
            nextErrors.password = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            nextErrors.password = "Invalid password";
            valid = false;
        }

        setErrors(nextErrors);
        return valid;
    };


    // =========================
    // HANDLE LOGIN
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        // Run validation before hitting the API
        if (!validateForm()) {
            setPasswordError(false);
            setMsg("");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const result = await response.json();

            console.log(result);


            // =========================
            // LOGIN SUCCESS
            // =========================

            if (response.ok) {

                setMsg("");
                setPasswordError(false);

                localStorage.setItem(
                    "user",
                    JSON.stringify(result.user)
                );

                navigate("/home");
            }


            // =========================
            // LOGIN FAILED
            // =========================

            else {

                setMsg("");
                setPasswordError(true);

                setErrors((prev) => ({
                    ...prev,
                    password: "Invalid password"
                }));
            }

        } catch (error) {

            console.log(error);

            setPasswordError(false);

            setMsg("Cannot connect to server.");
        }
    };


    // =========================
    // STYLES
    // =========================

    const styles = {

        page: {
            minHeight: "calc(100vh - 60px)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            boxSizing: "border-box",

            background:
                "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0fdf4 100%)"
        },

        card: {
            width: "430px",
            maxWidth: "100%",
            padding: "42px 40px 38px",
            boxSizing: "border-box",

            background: "rgba(255,255,255,0.96)",

            border: "1px solid #e5e7eb",
            borderRadius: "24px",

            boxShadow:
                "0 25px 60px rgba(15,23,42,0.12), 0 8px 20px rgba(15,23,42,0.05)"
        },

        topLine: {
            width: "70px",
            height: "5px",
            borderRadius: "10px",
            margin: "0 auto 25px",

            background:
                "linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)"
        },

        brand: {
            textAlign: "center",
            color: "#6366f1",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "2px",
            marginBottom: "10px"
        },

        title: {
            margin: "0",
            textAlign: "center",
            color: "#111827",
            fontSize: "30px",
            fontWeight: "750",
            letterSpacing: "-0.5px"
        },

        subtitle: {
            margin: "9px 0 30px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.5"
        },

        inputGroup: {
            position: "relative",
            width: "100%",
            marginBottom: "16px"
        },

        input: {
            width: "100%",
            height: "55px",
            padding: "0 17px",
            boxSizing: "border-box",

            border: "1px solid #dbe2ea",
            borderRadius: "14px",

            background: "#f8fafc",
            color: "#111827",

            fontSize: "15px",
            outline: "none",

            transition: "all 0.2s ease"
        },

        passwordInput: {
            width: "100%",
            height: "55px",
            padding: "0 52px 0 17px",
            boxSizing: "border-box",

            border: passwordError
                ? "1px solid #ef4444"
                : "1px solid #dbe2ea",

            borderRadius: "14px",

            background: passwordError
                ? "#fff7f7"
                : "#f8fafc",

            color: "#111827",

            fontSize: "15px",
            outline: "none",

            transition: "all 0.2s ease"
        },

        eyeButton: {
            position: "absolute",
            right: "12px",
            top: "10px",

            width: "36px",
            height: "36px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            border: "none",
            borderRadius: "10px",

            background: "transparent",
            color: "#64748b",

            cursor: "pointer"
        },

        error: {
            margin: "6px 0 0",
            color: "#dc2626",
            fontSize: "13px",
            textAlign: "left"
        },

        message: {
            margin: "0 0 15px",
            textAlign: "center",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "500"
        },

        signup: {
            margin: "6px 0 0",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px"
        },

        signupLink: {
            color: "#4f46e5",
            fontWeight: "600",
            textDecoration: "none"
        },

        button: {
            width: "100%",
            height: "52px",
            marginTop: "25px",

            border: "none",
            borderRadius: "14px",

            background:
                "linear-gradient(135deg, #10b981, #059669)",

            color: "#ffffff",

            fontSize: "17px",
            fontWeight: "650",

            cursor: "pointer",

            boxShadow:
                "0 10px 22px rgba(16,185,129,0.20)",

            transition: "all 0.2s ease"
        },

        bottomText: {
            margin: "22px 0 0",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "12px"
        }
    };


    return (
        <div>

            <Navbar />

            <div style={styles.page}>

                <form
                    onSubmit={handleSubmit}
                    style={styles.card}
                    noValidate
                >

                    {/* Top decorative line */}
                    <div style={styles.topLine}></div>

                    {/* Brand */}
                    <div style={styles.brand}>
                        PERSONAL PORTAL
                    </div>

                    {/* Heading */}
                    <h1 style={styles.title}>
                        Welcome Back
                    </h1>

                    <p style={styles.subtitle}>
                        Sign in to continue to your account
                    </p>

                    {/* General Message */}
                    {msg && (
                        <p style={styles.message}>
                            {msg}
                        </p>
                    )}

                    {/* Email */}
                    <div style={styles.inputGroup}>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={email}
                            onChange={handleInput}

                            style={{
                                ...styles.input,
                                border: errors.email
                                    ? "1px solid #ef4444"
                                    : "1px solid #dbe2ea",
                                background: errors.email
                                    ? "#fff7f7"
                                    : "#f8fafc"
                            }}

                            onFocus={(e) => {
                                e.target.style.background = "#ffffff";
                                e.target.style.borderColor = "#6366f1";
                                e.target.style.boxShadow =
                                    "0 0 0 4px rgba(99,102,241,0.10)";
                            }}

                            onBlur={(e) => {
                                e.target.style.background = errors.email
                                    ? "#fff7f7"
                                    : "#f8fafc";
                                e.target.style.borderColor = errors.email
                                    ? "#ef4444"
                                    : "#dbe2ea";
                                e.target.style.boxShadow = "none";
                            }}
                        />

                        {errors.email && (
                            <p style={styles.error}>
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div style={styles.inputGroup}>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInput}

                            style={{
                                ...styles.passwordInput,
                                border: errors.password
                                    ? "1px solid #ef4444"
                                    : (passwordError
                                        ? "1px solid #ef4444"
                                        : "1px solid #dbe2ea"),
                                background: errors.password || passwordError
                                    ? "#fff7f7"
                                    : "#f8fafc"
                            }}

                            onFocus={(e) => {
                                e.target.style.background = "#ffffff";
                                e.target.style.borderColor = "#6366f1";
                                e.target.style.boxShadow =
                                    "0 0 0 4px rgba(99,102,241,0.10)";
                            }}

                            onBlur={(e) => {
                                e.target.style.background =
                                    (errors.password || passwordError)
                                        ? "#fff7f7"
                                        : "#f8fafc";

                                e.target.style.borderColor =
                                    (errors.password || passwordError)
                                        ? "#ef4444"
                                        : "#dbe2ea";

                                e.target.style.boxShadow = "none";
                            }}
                        />

                        {/* Password visibility */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword
                                ? <FaEye size={17} />
                                : <FaEyeSlash size={17} />
                            }
                        </button>

                        {errors.password && (
                            <p style={styles.error}>
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Signup link */}
                    <p style={styles.signup}>
                        Don't have an account?{" "}
                        <Link to="/" style={styles.signupLink}>
                            Signup
                        </Link>
                    </p>

                    {/* Login button */}
                    <button
                        type="submit"
                        style={styles.button}

                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                                "0 14px 28px rgba(16,185,129,0.25)";
                        }}

                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                                "0 10px 22px rgba(16,185,129,0.20)";
                        }}
                    >
                        Log In
                    </button>

                    {/* Footer */}
                    <p style={styles.bottomText}>
                        Secure Privacy authentication
                    </p>

                </form>

            </div>

        </div>
    );
};

export default Login;