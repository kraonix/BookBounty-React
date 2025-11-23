"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock } from "lucide-react";
import "../auth.css";

export const AuthPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);

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
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="input-box">
                                    <Mail className="input-icon" size={18} />
                                    <input type="text" placeholder="Enter your email" required />
                                </div>
                                <div className="input-box">
                                    <Lock className="input-icon" size={18} />
                                    <input type="password" placeholder="Enter your password" required />
                                </div>
                                <div className="button-box">
                                    <button type="submit" className="submit-btn">Submit</button>
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
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="input-box">
                                    <User className="input-icon" size={18} />
                                    <input type="text" placeholder="Enter your name" required />
                                </div>
                                <div className="input-box">
                                    <Mail className="input-icon" size={18} />
                                    <input type="text" placeholder="Enter your email" required />
                                </div>
                                <div className="input-box">
                                    <Lock className="input-icon" size={18} />
                                    <input type="password" placeholder="Enter your password" required />
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
