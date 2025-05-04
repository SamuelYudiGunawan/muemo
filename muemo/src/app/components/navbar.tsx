"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLogout, setShowLogout] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowLogout(false);
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <nav className="bg-[#0A5EB0] p-4 rounded-b-lg shadow-lg px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="h-8 w-24 bg-blue-400 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-blue-400 rounded animate-pulse" />
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-[#0A5EB0] p-4 rounded-b-lg shadow-lg px-4">
            <div className="container mx-auto flex justify-between items-center relative">
                {/* Muemo on the left */}
                <Link href="/" className="text-white text-lg font-semibold">
                    Muemo
                </Link>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6 text-white">
                    <Link href="/" className="hover:opacity-80">Home</Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/preferences" className="hover:opacity-80">Preferences</Link>
                </div>

                <div className="flex items-center space-x-6 text-white">
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={() => setShowLogout(!showLogout)}
                                className="text-white hover:opacity-80 flex items-center"
                            >
                                Welcome, {user.displayName || user.email?.split('@')[0] || "User"}
                            </button>

                            {showLogout && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
