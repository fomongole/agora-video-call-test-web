import { LocalVideoTrack } from "agora-rtc-react";
import { VideoOff } from "lucide-react";

interface Props {
  videoTrack: any;
  videoOn: boolean;
}

export const DoctorVideo = ({ videoTrack, videoOn }: Props) => {
  return (
    <div className="relative bg-slate-800 rounded-3xl overflow-hidden border-2 border-primary/30">
      {videoOn && videoTrack ? (
        <LocalVideoTrack track={videoTrack} play className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
          <VideoOff size={32} />
          <span className="text-sm">Your camera is off</span>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
        You
      </div>
    </div>
  );
};