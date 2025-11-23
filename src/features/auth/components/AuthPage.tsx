"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../auth.css";

export const AuthPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Signup State
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert(result.error);
        } else {
            router.push("/");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword,
                }),
            });

            if (res.ok) {
                alert("Signup successful! Please login.");
                setIsFlipped(false); // Switch to login
            } else {
                const data = await res.json();
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            alert("An error occurred during signup");
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="auth-container">
            <div className={`flip-container ${isFlipped ? "flipped" : ""}`}>
                {/* Cover (Flip Part) */}
                <div className="cover">
                    <div className="front">
                        <Image
                            src="/loginFront.png"
                            alt="Front Cover"
                            fill
                            className="cover-img"
                            unoptimized
                        />
                        <div className="text">
                            <span className="text-1">Turn the page for mystery <br /> Let's get lost in a story</span>
                            <span className="text-2">Read. Explore. Dream.</span>
                        </div>
                    </div>
                    <div className="back">
                        <Image
                            src="/loginBack.png"
                            alt="Back Cover"
                            fill
                            className="cover-img"
                            unoptimized
                        />
                        <div className="text">
                            <span className="text-1">Complete miles of journey <br /> with one step</span>
                            <span className="text-2">Let's get started</span>
                        </div>
                    </div>
                </div>

                {/* Forms */}
                <div className="forms-container">
                    <div className="form-content">
                        {/* Login Form */}
                        <div className="login-form">
                            <div className="title">Login</div>
                            <form onSubmit={handleLogin}>
                                <div className="input-box">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="input-box">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="button-box">
                                    <button type="submit" className="submit-btn">Submit</button>
                                </div>

                                <div className="google-btn-container" style={{ marginTop: '20px' }}>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="submit-btn"
                                        style={{ background: '#db4437', color: 'white' }}
                                    >
                                        Sign in with Google
                                    </button>
                                </div>

                                <div className="switch-text">
                                    Don't have an account?
                                    <span className="switch-link" onClick={() => setIsFlipped(true)}>Signup now</span>
                                </div>
                            </form>
                        </div>

                        {/* Signup Form */}
                        <div className="signup-form">
                            <div className="title">Signup</div>
                            <form onSubmit={handleSignup}>
                                <div className="input-box">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                    />
                                </div>
                                <div className="input-box">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        required
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                    />
                                </div>
                                <div className="input-box">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                    />
                                </div>
                                <div className="button-box">
                                    <button type="submit" className="submit-btn">Submit</button>
                                </div>
                                <div className="switch-text">
                                    Already have an account?
                                    <span className="switch-link" onClick={() => setIsFlipped(false)}>Login now</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
