import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation } from "react-router-dom";

// Your Agora App ID (make sure auth mode is set to App ID only)
const APP_ID = "2d04b4d5c1e24bc5b60eb02d2dbea516"; // Don't change
const TOKEN = null; // ← No token needed for development
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoCall = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const channel = query.get("channel");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localTracks, setLocalTracks] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Join channel with no token
        await client.join(APP_ID, channel, TOKEN, null);

        // Create local tracks
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks([microphoneTrack, cameraTrack]);

        // Play local camera video
        cameraTrack.play(localVideoRef.current);

        // Publish local tracks to the channel
        await client.publish([microphoneTrack, cameraTrack]);

        // Listen for remote users
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });
      } catch (error) {
        console.error("Agora init error:", error);
      }
    };

    init();

    return () => {
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, [channel]);

  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
      <div>
        <h3>Local</h3>
        <div ref={localVideoRef} style={{ width: 300, height: 300, background: "#000" }} />
      </div>
      <div>
        <h3>Remote</h3>
        <div ref={remoteVideoRef} style={{ width: 300, height: 300, background: "#000" }} />
      </div>
    </div>
  );
};

export default VideoCall;
