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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.picture = user.image;
            }

            // Handle session update trigger
            if (trigger === "update" && session) {
                if (session.user.image) token.picture = session.user.image;
                if (session.user.name) token.name = session.user.name;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && session.user.email) {
                // Use token data for immediate updates
                if (token.picture) session.user.image = token.picture;
                if (token.name) session.user.name = token.name;

                try {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: session.user.email });
                    if (dbUser) {
                        session.user.role = dbUser.role;
                        // Ensure DB is source of truth if available, but token takes precedence for immediate UI updates
                        // actually, let's trust the DB for role, but token for image/name if recently updated
                    }
                } catch (error) {
                    console.error("Error fetching user role in session:", error);
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
