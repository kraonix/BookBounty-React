import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials?.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (user.provider !== "credentials") {
                    throw new Error("Please sign in with Google");
                }

                const isValid = await bcrypt.compare(credentials!.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && session.user.email) {
                try {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: session.user.email });
                    console.log("Session Callback - Email:", session.user.email);
                    console.log("Session Callback - DB User Role:", dbUser?.role);
                    if (dbUser) {
                        session.user.role = dbUser.role;
                    }
                } catch (error) {
                    console.error("Error fetching user role in session:", error);
                    // Fallback to token role if DB fails
                    session.user.role = token.role as string;
                }
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: "google",
                            role: "user", // Default role
                        });
                        await newUser.save();
                    }
                    return true;
                } catch (error) {
                    console.log("Error saving user", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
};
