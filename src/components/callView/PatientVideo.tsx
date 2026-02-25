import { RemoteUser } from "agora-rtc-react";

interface Props {
  remoteUsers: any[];
}

export const PatientVideo = ({ remoteUsers }: Props) => {
  return (
    <div className="relative bg-slate-800 rounded-3xl overflow-hidden border-2 border-slate-700">
      {remoteUsers.length > 0 ? (
        remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} className="w-full h-full object-cover" />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
          <div className="w-10 h-10 border-4 border-slate-600 border-t-primary rounded-full animate-spin"></div>
          <p>Waiting for the other party to join...</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
        Remote Person
      </div>
    </div>
  );
};