import { useState, useEffect } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useConnectionState,
} from "agora-rtc-react";

import { CallHeader } from "./CallHeader";
import { CallControls } from "./CallControls";
import { DoctorVideo } from "./DoctorVideo";
import { PatientVideo } from "./PatientVideo";

interface Props {
  appId: string;
  channel: string;
  token: string;
  uid: number;
  onReady: () => void;
  onLeave: () => void;
}

export const DoctorCallView = ({ appId, channel, token, uid, onReady, onLeave }: Props) => {
  const [micOn, setMic] = useState(true);
  const [videoOn, setVideo] = useState(true);

  // 1. Initialize tracks as true to prevent republishing race conditions
  const { localMicrophoneTrack, isLoading: micLoading } = useLocalMicrophoneTrack(true);
  const { localCameraTrack, isLoading: camLoading } = useLocalCameraTrack(true);

  // 2. Properly mute/unmute tracks so the remote patient sees the changes!
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn);
    }
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(videoOn);
    }
  }, [videoOn, localCameraTrack]);

  // 3. Network and connection states
  const connectionState = useConnectionState();
  useJoin({ appid: appId, channel: channel, token: token, uid: uid });
  
  // Publish tracks
  usePublish([localMicrophoneTrack, localCameraTrack].filter(Boolean) as any[]);
  const remoteUsers = useRemoteUsers();

  // 4. Graceful Cleanup
  useEffect(() => {
    // This return function acts as React's unmount lifecycle hook.
    // It guarantees the hardware is released when the component is destroyed.
    return () => {
      localCameraTrack?.stop();
      localCameraTrack?.close();
      localMicrophoneTrack?.stop();
      localMicrophoneTrack?.close();
    };
  }, [localCameraTrack, localMicrophoneTrack]);

  const handleLeaveCall = () => {
    // Explicitly kill the tracks
    localCameraTrack?.stop();
    localCameraTrack?.close();
    localMicrophoneTrack?.stop();
    localMicrophoneTrack?.close();
    
    // navigate away
    onLeave();
  };

  // 5. Communicate readiness back to App.tsx
  const isHardwareLoading = micLoading || camLoading;
  const isNetworkReady = connectionState === "CONNECTED";

  useEffect(() => {
    // Only tells the App.tsx to flip the screen once BOTH hardware and network are fully ready
    if (!isHardwareLoading && isNetworkReady) {
      onReady();
    }
  }, [isHardwareLoading, isNetworkReady, onReady]);

  // Return null (render nothing) until fully ready. 
  // App.tsx handles the loading UI on the button.
  if (isHardwareLoading || !isNetworkReady) {
    return null;
  }

  // Once ready, this renders and App.tsx hides the Home screen!
  return (
    <div className="flex flex-col h-screen bg-secondary p-4">
      <CallHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <DoctorVideo videoTrack={localCameraTrack} videoOn={videoOn} />
        <PatientVideo remoteUsers={remoteUsers} />
      </div>

      <CallControls
        micOn={micOn}
        videoOn={videoOn}
        onToggleMic={() => setMic((prev) => !prev)}
        onToggleVideo={() => setVideo((prev) => !prev)}
        onLeave={handleLeaveCall}
      />
    </div>
  );
};