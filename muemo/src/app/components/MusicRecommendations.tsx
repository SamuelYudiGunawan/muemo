'use client';
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";

// Fallback queries
const emotionPlaylists: Record<string, string> = {
    happy: "happy upbeat music playlist",
    sad: "sad emotional music playlist",
    angry: "angry rock metal playlist",
    surprised: "surprise party music playlist",
    neutral: "general music playlist",
    energetic: "energetic electronic music playlist",
    relaxed: "relaxing chill music playlist"
};

type Playlist = {
    id: string;
    title: string;
    thumbnail: string;
};

type MusicRecommendationsProps = {
    emotion: string;
};

interface YouTubePlaylistItem {
    id: {
        playlistId: string;
    };
    snippet: {
        title: string;
        thumbnails: {
            default: {
                url: string;
            };
        };
    };
}

const MusicRecommendations = ({ emotion }: MusicRecommendationsProps) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("english");
    const [genre, setGenre] = useState("pop");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Timeout-based fetch
    const fetchWithTimeout = (url: string, timeout = 8000): Promise<Response> => {
        return Promise.race([
            fetch(url),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            )
        ]) as Promise<Response>;
    };

    // Fetch user preferences
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
            if (!authUser) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "preferences", authUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const normalizedEmotion = emotion.toLowerCase();

                    const genreFromData = data.emotions?.[normalizedEmotion]?.genres?.[0] ?? "pop";
                    const languageFromData = data.languages?.[0] ?? "english";

                    if (genreFromData !== genre) setGenre(genreFromData);
                    if (languageFromData !== language) setLanguage(languageFromData);
                }
            } catch (err) {
                console.error("Error loading user preferences:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [emotion, genre, language]);

    // Fetch YouTube playlists with debounce
    useEffect(() => {
        if (!emotion || !genre || !language) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const fetchPlaylist = async () => {
                setLoading(true);
            
                const fallback = emotionPlaylists[emotion.toLowerCase()] || "music playlist";
                const query = `${fallback} ${genre} ${language}`;
                const API_KEY = "AIzaSyBlQz_N1bPfXWfD_Bi5SBDYF8UKEPv_Qz8";
                const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
            
                const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=playlist&maxResults=5&key=${API_KEY}`;
            
                try {
                    const response = await fetchWithTimeout(url);
            
                    if (!(response instanceof Response)) {
                        throw new Error("Unexpected response type");
                    }
            
                    const data = await response.json();
            
                    if (data.items) {
                        const fetchedPlaylists: Playlist[] = data.items.map((item: YouTubePlaylistItem) => ({
                            id: item.id.playlistId,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails?.default?.url || "/default-music-thumbnail.jpg"
                        }));
            
                        setPlaylists(fetchedPlaylists);
                    }
                } catch (error) {
                    console.error("Error fetching playlist:", error);
                } finally {
                    setLoading(false);
                }
            };            

            fetchPlaylist();
        }, 1500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [emotion, genre, language]);

    return (
        <div className="w-full text-white">
            <h2 className="text-xl font-bold mb-4 capitalize">
                Music for {emotion || 'your'} mood
            </h2>

            {loading ? (
                <p>Loading playlists...</p>
            ) : (
                <>
                    {playlists.length === 0 ? (
                        <p>No playlists found. Try another emotion.</p>
                    ) : (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 capitalize">
                                {language} - {genre}
                            </h3>
                            <div className="flex flex-col gap-3">
                                {playlists.map((playlist) => (
                                    <a
                                        key={playlist.id}
                                        href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center bg-blue-600 p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                                    >
                                        <Image
                                            src={playlist.thumbnail}
                                            alt={playlist.title}
                                            width={48}
                                            height={48}
                                            className="rounded-md mr-3"
                                        />
                                        <div className="overflow-hidden">
                                            <h4 className="font-semibold truncate w-full">{playlist.title}</h4>
                                            <p className="text-sm opacity-80">Click to open playlist</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MusicRecommendations;
