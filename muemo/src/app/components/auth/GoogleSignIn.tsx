"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GoogleSignIn({ isSignUp = false }: { isSignUp?: boolean }) {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/");
        } catch (error) {
            console.error("Google sign-in failed:", error);
        }
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
            <Image
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={20}
                height={20}
            />
            Sign {isSignUp ? "up" : "in"} with Google
        </button>
    );
}
