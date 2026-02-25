import { useState } from 'react';
import { Video, Loader2 } from 'lucide-react';
import { getCallToken } from './services/api';
import { DoctorCallView } from './components/callView/DoctorCallView';

function App() {
  const [calling, setCalling] = useState(false);
  const [callReady, setCallReady] = useState(false);
  const [callData, setCallData] = useState<any>(null);

  const handleStartCall = async () => {
    setCalling(true);
    try {
      // Using call_id 123 to match the Flutter app test
      const response = await getCallToken(123);
      if (response.success) {
        setCallData(response.data);
        // Stay in the loading state while Agora connects in the background.
      } else {
        setCalling(false);
      }
    } catch (error) {
      setCalling(false);
      alert("Failed to connect to the backend server");
      console.error(error);
    }
  };

  const handleLeaveCall = () => {
    setCalling(false);
    setCallReady(false);
    setCallData(null);
  };

  return (
    <>
      {/* Render the CallView as soon as we have callData so it can start connecting.
        However, it will return null (invisible) until it fires onReady(). 
      */}
      {callData && (
        <DoctorCallView 
          appId={callData.app_id}
          channel={callData.channel_name}
          token={callData.token}
          uid={callData.uid}
          onReady={() => setCallReady(true)}
          onLeave={handleLeaveCall}
        />
      )}

      {/* Only show the Home Screen if the call is NOT fully ready */}
      {!callReady && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="text-primary" size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Doctor Portal</h1>
            <p className="text-slate-500 mb-8">Click below to start the test consultation with the mobile app.</p>
            <button 
              onClick={handleStartCall}
              disabled={calling}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {calling ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {callData ? "Connecting to Room..." : "Authenticating..."}
                </>
              ) : (
                "Enter Consultation Room"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;