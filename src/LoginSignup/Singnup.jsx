import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Singnup = () => {

    const userDetail = {
        name: "",
        email: "",
        password: ""
    };

    const [data, setData] = useState(userDetail);

    // Password show/hide state
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    // =========================
    // HANDLE INPUT
    // =========================

    const handleInput = (event) => {

        const name = event.target.name;
        const value = event.target.value;

        setData({
            ...data,
            [name]: value
        });
    };


    // =========================
    // HANDLE SIGNUP
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        // Check empty fields
        if (
            data.name === "" ||
            data.email === "" ||
            data.password === ""
        ) {
            alert("Please Enter Detail!");
            return;
        }

        try {

            // Send data to Node.js backend
            const response = await fetch(
                "http://localhost:5000/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Signup Successful!");

                // Go to Login page
                navigate("/login");

            } else {

                alert(result.message);
            }

        } catch (error) {

            console.log(error);

            alert("Cannot connect to server");
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

                    {/* Decorative line */}
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


                    {/* Brand */}
                    <div
                        style={{
                            textAlign: "center",
                            color: "#6366f1",
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "2px",
                            marginBottom: "10px"
                        }}
                    >
                
                    </div>


                    {/* Heading */}
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


                    {/* Subtitle */}
                    <p
                        style={{
                            margin: "9px 0 28px",
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}
                    >
                    
                    </p>


                    {/* =========================
                        NAME
                    ========================= */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={data.name}
                        onChange={handleInput}

                        style={{
                            width: "100%",
                            height: "55px",
                            margin: "0 0 16px",
                            padding: "0 17px",
                            boxSizing: "border-box",

                            border: "1px solid #dbe2ea",
                            borderRadius: "14px",

                            background: "#f8fafc",
                            color: "#111827",

                            fontSize: "15px",
                            outline: "none",

                            transition: "all 0.2s ease"
                        }}

                        onFocus={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.borderColor = "#6366f1";
                            e.target.style.boxShadow =
                                "0 0 0 4px rgba(99,102,241,0.10)";
                        }}

                        onBlur={(e) => {
                            e.target.style.background = "#f8fafc";
                            e.target.style.borderColor = "#dbe2ea";
                            e.target.style.boxShadow = "none";
                        }}
                    />


                    {/* =========================
                        EMAIL
                    ========================= */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={data.email}
                        onChange={handleInput}

                        style={{
                            width: "100%",
                            height: "55px",
                            margin: "0 0 16px",
                            padding: "0 17px",
                            boxSizing: "border-box",

                            border: "1px solid #dbe2ea",
                            borderRadius: "14px",

                            background: "#f8fafc",
                            color: "#111827",

                            fontSize: "15px",
                            outline: "none",

                            transition: "all 0.2s ease"
                        }}

                        onFocus={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.borderColor = "#6366f1";
                            e.target.style.boxShadow =
                                "0 0 0 4px rgba(99,102,241,0.10)";
                        }}

                        onBlur={(e) => {
                            e.target.style.background = "#f8fafc";
                            e.target.style.borderColor = "#dbe2ea";
                            e.target.style.boxShadow = "none";
                        }}
                    />


                    {/* =========================
                        PASSWORD
                    ========================= */}

                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            margin: "0"
                        }}
                    >

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            name="password"

                            placeholder="Password"

                            value={data.password}

                            onChange={handleInput}

                            style={{
                                width: "100%",
                                height: "55px",
                                margin: "0",
                                padding: "0 52px 0 17px",
                                boxSizing: "border-box",

                                border: "1px solid #dbe2ea",
                                borderRadius: "14px",

                                background: "#f8fafc",
                                color: "#111827",

                                fontSize: "15px",
                                outline: "none",

                                transition: "all 0.2s ease"
                            }}

                            onFocus={(e) => {
                                e.target.style.background = "#ffffff";
                                e.target.style.borderColor = "#6366f1";
                                e.target.style.boxShadow =
                                    "0 0 0 4px rgba(99,102,241,0.10)";
                            }}

                            onBlur={(e) => {
                                e.target.style.background = "#f8fafc";
                                e.target.style.borderColor = "#dbe2ea";
                                e.target.style.boxShadow = "none";
                            }}
                        />


                        {/* Password visibility button */}

                        <button
                            type="button"

                            onClick={() =>
                                setShowPassword(!showPassword)
                            }

                            style={{
                                position: "absolute",

                                right: "9px",
                                top: "50%",

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

                            {showPassword
                                ? <FaEye size={17} />
                                : <FaEyeSlash size={17} />
                            }

                        </button>

                    </div>


                    {/* =========================
                        LOGIN LINK
                    ========================= */}

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


                    {/* =========================
                        SIGNUP BUTTON
                    ========================= */}

                    <button
                        type="submit"

                        style={{
                            width: "100%",
                            height: "52px",

                            margin: "25px 0 0",

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
                        }}

                        onMouseEnter={(e) => {
                            e.target.style.transform =
                                "translateY(-2px)";

                            e.target.style.boxShadow =
                                "0 14px 28px rgba(16,185,129,0.25)";
                        }}

                        onMouseLeave={(e) => {
                            e.target.style.transform =
                                "translateY(0)";

                            e.target.style.boxShadow =
                                "0 10px 22px rgba(16,185,129,0.20)";
                        }}
                    >
                        Create Account
                    </button>


                    {/* =========================
                        FOOTER
                    ========================= */}

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

        </div>
    );
};

export default Singnup;