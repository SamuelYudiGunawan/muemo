"use client";
import { useState } from "react";
import Camera from "./components/Camera";
import MusicRecommendations from "./components/MusicRecommendations";

export default function Home() {
  const [emotion, setEmotion] = useState("Neutral");
  const [capturingMode, setCapturingMode] = useState("single");
  const [timeInterval, setTimeInterval] = useState(5); // in minutes
  return (
    <div className="bg-[#2A3335] min-h-screen p-6">
      {/* Controls */}
      <div className="flex items-center space-x-4 mb-4 text-white">
        <label className="font-semibold">Capturing Mode:</label>
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={capturingMode}
          onChange={(e) => setCapturingMode(e.target.value)}
        >
          <option value="single">Single Capture</option>
          <option value="average">Average Capture</option>
          <option value="live">Live Capture</option>
        </select>

        {/* Conditionally render the Time input */}
        {capturingMode !== "single" && (
          <>
            <label className="font-semibold">Time (minutes):</label>
            <input
              type="number"
              min={1}
              className="bg-gray-700 text-white p-2 rounded w-24"
              value={timeInterval === 0 ? "" : timeInterval}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setTimeInterval(0); // Temporary "empty" state
                } else {
                  const num = parseInt(val);
                  if (!isNaN(num) && num > 0) {
                    setTimeInterval(num);
                  }
                }
              }}
              onBlur={() => {
                if (timeInterval === 0) {
                  setTimeInterval(5); // Reset to default if left empty
                }
              }}
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Camera Section */}
        <div className="flex-1 p-4 rounded-lg">
          <Camera
            setEmotion={setEmotion}
            mode={capturingMode === "single" ? "Single" : capturingMode === "average" ? "Average" : "Live"}
            intervalTime={timeInterval}
          />
          <p className="text-white font-bold mt-2">Current Emotion: {emotion}</p>
        </div>

        {/* Music Recommendation Section */}
        <div className="w-1/3">
          <MusicRecommendations emotion={emotion} /> {/* Pass emotion to MusicRecommendations */}
        </div>
      </div>
    </div>
  );
}
