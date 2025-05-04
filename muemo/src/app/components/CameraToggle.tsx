import { useState, useRef } from "react";

const CameraToggle = () => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null); // Explicitly define ref type

    const toggleCamera = async () => {
        if (!videoRef.current) return; // Ensure videoRef is not null

        if (isCameraOn) {
            // Stop the camera
            const stream = videoRef.current.srcObject as MediaStream | null;
            if (stream) {
                stream.getTracks().forEach((track: MediaStreamTrack) => track.stop()); // Explicitly define track type
            }
            videoRef.current.srcObject = null;
        } else {
            // Start the camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("Error accessing camera: ", error);
            }
        }

        setIsCameraOn(!isCameraOn);
    };

    return (
        <div className="relative w-[500px] h-[300px] bg-black rounded-lg flex items-center justify-center overflow-hidden">
            {/* Video element (Only shows when camera is on) */}
            <video ref={videoRef} autoPlay className="absolute w-full h-full object-cover" />

            {/* Toggle button in the center */}
            <button
                className="absolute bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                onClick={toggleCamera}
            >
                {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>
        </div>
    );
};

export default CameraToggle;
