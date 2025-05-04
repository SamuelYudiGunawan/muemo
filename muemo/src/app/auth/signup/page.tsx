'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import GoogleSignIn from '@/app/components/auth/GoogleSignIn';
import Link from 'next/link';

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            router.push('/');
        } catch (err) {
            if (err instanceof FirebaseError) {
                console.error("Signup error:", err);
                setError(getFriendlyError(err.code));
            } else {
                console.error("Unknown signup error:", err);
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getFriendlyError = (code: string) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters';
            default:
                return 'Signup failed. Please try again';
        }
    };

    return (
        <div className="min-h-screen bg-[#2A3335] text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-[#1E2729] p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up to Muemo</h1>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <InputField
                        id="username"
                        label="Username"
                        value={username}
                        onChange={setUsername}
                        type="text"
                        placeholder="Your username"
                    />
                    <InputField
                        id="email"
                        label="Email Address"
                        value={email}
                        onChange={setEmail}
                        type="email"
                        placeholder="your@email.com"
                    />
                    <InputField
                        id="password"
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        type="password"
                        placeholder="••••••••"
                    />
                    <InputField
                        id="confirmPassword"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        type="password"
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded font-bold transition-colors ${
                            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    {error && (
                        <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <GoogleSignIn isSignUp={true} />

                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-400 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

type InputFieldProps = {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
};

function InputField({ id, label, type, placeholder, value, onChange }: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="w-full p-3 rounded bg-gray-200 text-black focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
        </div>
    );
}
