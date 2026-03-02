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

  // Initializing tracks as true to prevent republishing race conditions
  const { localMicrophoneTrack, isLoading: micLoading } = useLocalMicrophoneTrack(true);
  const { localCameraTrack, isLoading: camLoading } = useLocalCameraTrack(true);

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setMuted(!micOn);
    }
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setMuted(!videoOn);
    }
  }, [videoOn, localCameraTrack]);

  //Network and connection states
  const connectionState = useConnectionState();
  useJoin({ appid: appId, channel: channel, token: token, uid: uid });
  
  // Publish tracks
  usePublish([localMicrophoneTrack, localCameraTrack].filter(Boolean) as any[]);
  const remoteUsers = useRemoteUsers();

  // Graceful Cleanup strictly on user action
  const handleLeaveCall = () => {
    localCameraTrack?.stop();
    localCameraTrack?.close();
    localMicrophoneTrack?.stop();
    localMicrophoneTrack?.close();
    
    onLeave();
  };

  // Communicates readiness
  const isHardwareLoading = micLoading || camLoading;
  const isNetworkReady = connectionState === "CONNECTED";

  useEffect(() => {
    if (!isHardwareLoading && isNetworkReady) {
      onReady();
    }
  }, [isHardwareLoading, isNetworkReady, onReady]);

  if (isHardwareLoading || !isNetworkReady) {
    return null;
  }

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