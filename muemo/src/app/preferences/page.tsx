'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type EmotionPreference = {
    genres: string[];
};

type UserPreferences = {
    emotions: Record<string, EmotionPreference>;
    languages: string[];
};

const DEFAULT_EMOTION_PREFERENCES: Record<string, EmotionPreference> = {
    happy: { genres: ['upbeat'] },
    sad: { genres: ['emotional'] },
    angry: { genres: ['rock'] },
    energetic: { genres: ['electronic'] },
    relaxed: { genres: ['chill'] },
    neutral: { genres: ['general'] }
};

const DEFAULT_PREFERENCES: UserPreferences = {
    emotions: DEFAULT_EMOTION_PREFERENCES,
    languages: ['english']
};

const MUSIC_GENRES = [
    'Pop',
    'Rock',
    'Hip Hop',
    'Jazz',
    'R&B',
    'Metal'
];

const LANGUAGES = [
    'English',
    'Japanese',
    'Korean',
    'Chinese',
    'Indonesia'
];

const EMOTIONS = ['Happy', 'Sad', 'Angry', 'Fear', 'Disgust', 'Neutral', 'Surprise'];

const PreferencesPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [saving, setSaving] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState<string>('happy');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUser(user);
            await loadPreferences(user.uid);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loadPreferences = async (userId: string) => {
        try {
            const docRef = doc(db, 'preferences', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserPreferences;
                setPreferences({
                    emotions: { ...DEFAULT_EMOTION_PREFERENCES, ...data.emotions },
                    languages: data.languages
                });
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const savePreferences = async () => {
        if (!user) return;

        setSaving(true);
        try {
            await setDoc(doc(db, 'preferences', user.uid), preferences);
            alert('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Failed to save preferences');
        }
        setSaving(false);
    };

    const handleEmotionChange = (emotion: string) => {
        setCurrentEmotion(emotion.toLowerCase());
    };

    const selectGenreForEmotion = (genre: string) => {
        setPreferences(prev => ({
            ...prev,
            emotions: {
                ...prev.emotions,
                [currentEmotion]: {
                    genres: [genre.toLowerCase()]
                }
            }
        }));
    };

    const selectLanguage = (lang: string) => {
        setPreferences(prev => ({
            ...prev,
            languages: [lang.toLowerCase()]
        }));
    };

    if (loading) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#2A3335] text-white p-6">
            <div className="max-w-2xl mx-auto bg-[#1E2729] rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Customize Music Preferences</h1>

                <div className="space-y-8">
                    {/* Emotion Selection */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Select Emotion to Customize</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {EMOTIONS.map((emotion) => (
                                <button
                                    key={emotion}
                                    className={`py-2 px-4 rounded-lg transition ${currentEmotion === emotion.toLowerCase()
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    onClick={() => handleEmotionChange(emotion)}
                                >
                                    {emotion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Emotion Customization */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">
                            Customize {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)} Mood
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Select Genre</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {MUSIC_GENRES.map((genre) => {
                                    const selected = preferences.emotions[currentEmotion]?.genres[0] === genre.toLowerCase();
                                    return (
                                        <button
                                            key={genre}
                                            className={`py-2 px-4 rounded-lg transition ${selected
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            onClick={() => selectGenreForEmotion(genre)}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Only one genre can be selected per emotion.
                            </p>
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Preferred Language</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    className={`py-2 px-4 rounded-lg transition ${preferences.languages[0] === lang.toLowerCase()
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    onClick={() => selectLanguage(lang)}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Only one language can be selected.
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={savePreferences}
                        disabled={saving}
                        className={`w-full py-3 px-4 rounded font-bold ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } transition-colors mt-6`}
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesPage;
