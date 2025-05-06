"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Video, VideoOff, Camera as CameraIcon } from "lucide-react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/lib/firebaseConfig";

interface CameraProps {
    setEmotion: (emotion: string) => void;
    mode: "Single" | "Average" | "Live";
    intervalTime: number; // in minutes
}

const Camera: React.FC<CameraProps> = ({ setEmotion, mode, intervalTime }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const averageSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const emotionBufferRef = useRef<string[]>([]);
    const db = getFirestore(app);

    const captureFrame = useCallback(async (): Promise<string | null> => {
        if (!videoRef.current) return null;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve) => {
            canvas.toBlob(async (blob) => {
                if (!blob) return resolve(null);
                const formData = new FormData();
                formData.append("image", blob);

                try {
                    const response = await fetch("https://muemo-backend-950251872768.us-central1.run.app/api/detect_emotion", {
                        method: "POST",
                        body: formData,
                    });

                    console.log("Response status:", response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Backend error:", errorData);
                        throw new Error(errorData.error || 'Request failed');
                    }

                    const data = await response.json();
                    console.log("Full response data:", data);

                    if (data.emotion) {
                        setEmotion(data.emotion);
                        resolve(data.emotion);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error("Error detecting emotion:", error);
                    resolve(null);
                }
            }, "image/jpeg");
        });
    }, [setEmotion]);

    const captureAndBuffer = useCallback(async () => {
        const emotion = await captureFrame();
        if (emotion) {
            emotionBufferRef.current.push(emotion);
        }
    }, [captureFrame]);

    const saveAverageEmotion = useCallback(async () => {
        const buffer = emotionBufferRef.current;
        if (buffer.length === 0) return;

        const frequency: Record<string, number> = {};
        for (const e of buffer) {
            frequency[e] = (frequency[e] || 0) + 1;
        }
        const mostFrequent = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];

        try {
            await addDoc(collection(db, "average_emotions"), {
                emotion: mostFrequent,
                timestamp: new Date(),
            });
            console.log("Saved average emotion:", mostFrequent);
        } catch (error) {
            console.error("Error saving to Firestore:", error);
        }

        emotionBufferRef.current = [];
    }, [db]);

    const startCapturing = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            if (mode === "Live") {
                captureIntervalRef.current = setInterval(captureFrame, intervalTime * 60 * 1000);
            } else if (mode === "Average") {
                captureIntervalRef.current = setInterval(captureAndBuffer, 15000);
                averageSaveIntervalRef.current = setInterval(saveAverageEmotion, intervalTime * 60 * 1000);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }, [mode, intervalTime, captureFrame, captureAndBuffer, saveAverageEmotion]);

    const stopCapturing = () => {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        if (stream) stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
        if (averageSaveIntervalRef.current) clearInterval(averageSaveIntervalRef.current);
        emotionBufferRef.current = [];
    };

    useEffect(() => {
        if (isCameraOn) {
            startCapturing();
        } else {
            stopCapturing();
        }
        return () => stopCapturing();
    }, [isCameraOn, startCapturing]);

    const toggleCamera = () => {
        setIsCameraOn((prev) => !prev);
    };

    const toggleVideoPause = () => {
        if (videoRef.current) {
            if (isVideoPaused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
            setIsVideoPaused((prev) => !prev);
        }
    };

    return (
        <div className="relative w-full h-[700px] bg-black rounded-lg flex items-center justify-center overflow-hidden group">
            <video ref={videoRef} autoPlay className="absolute w-full h-full object-cover" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isCameraOn && mode === "Single" && (
                    <button
                        onClick={() => {
                            captureFrame();
                            toggleVideoPause();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
                    >
                        <CameraIcon size={18} />
                        Capture Emotion
                    </button>
                )}
                <button
                    onClick={toggleCamera}
                    className="p-3 bg-gray-800 text-white rounded-full"
                >
                    {isCameraOn ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
            </div>
        </div>
    );
};

export default Camera;
