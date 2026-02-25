import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface Props {
  micOn: boolean;
  videoOn: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

export const CallControls = ({ micOn, videoOn, onToggleMic, onToggleVideo, onLeave }: Props) => {
  return (
    <div className="flex justify-center items-center gap-6 py-8">
      <button
        onClick={onToggleMic}
        className={`p-4 rounded-full transition-all ${
          micOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white"
        }`}
      >
        {micOn ? <Mic size={24} /> : <MicOff size={24} />}
      </button>

      <button
        onClick={onLeave}
        className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all transform hover:scale-110"
      >
        <PhoneOff size={32} />
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-all ${
          videoOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white"
        }`}
      >
        {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
      </button>
    </div>
  );
};