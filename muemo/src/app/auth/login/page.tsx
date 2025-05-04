'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import GoogleSignIn from '@/app/components/auth/GoogleSignIn';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            console.error("Login error:", err);
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    // Convert Firebase error codes to user-friendly messages
    const getFriendlyError = (code: string) => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/too-many-requests':
                return 'Account temporarily locked. Try again later or reset password';
            default:
                return 'Login failed. Please try again';
        }
    };

    return (
        <div className="min-h-screen bg-[#2A3335] text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-[#1E2729] p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Log in to Muemo</h1>
                
                {/* Email/Password Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            className="w-full p-3 rounded bg-gray-200 text-black focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full p-3 rounded bg-gray-200 text-black focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <Link href="/auth/forgot-password" className="text-blue-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded font-bold ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>

                    {error && (
                        <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* Google Sign-In */}
                <GoogleSignIn />

                {/* Sign-up Link */}
                <p className="mt-6 text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="text-blue-400 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}