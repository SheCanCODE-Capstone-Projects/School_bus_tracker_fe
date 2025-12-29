'use client';
import { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineAudio } from 'react-icons/ai';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi';
import { 
  FaWrench, 
  FaCar, 
  FaHeartbeat, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaCloudRain, 
  FaRoad, 
  FaQuestionCircle 
} from 'react-icons/fa';

const emergencyTypes = [
  { id: 'MECHANICAL', label: 'Mechanical Issue', icon: FaWrench, color: 'text-orange-600' },
  { id: 'TRAFFIC', label: 'Traffic Problem', icon: FaCar, color: 'text-blue-600' },
  { id: 'MEDICAL', label: 'Medical Emergency', icon: FaHeartbeat, color: 'text-red-600' },
  { id: 'ACCIDENT', label: 'Accident', icon: FaExclamationTriangle, color: 'text-red-700' },
  { id: 'SAFETY_THREAT', label: 'Safety Threat', icon: FaShieldAlt, color: 'text-purple-600' },
  { id: 'WEATHER', label: 'Weather Issue', icon: FaCloudRain, color: 'text-gray-600' },
  { id: 'ROUTE_OBSTRUCTION', label: 'Route Obstruction', icon: FaRoad, color: 'text-yellow-600' },
  { id: 'OTHER', label: 'Other', icon: FaQuestionCircle, color: 'text-gray-500' }
];

const EmergencyCard = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedEmergencies, setSelectedEmergencies] = useState<string[]>([]);
  const [showEmergencyTypes, setShowEmergencyTypes] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string>('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<number | null>(null);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'requesting' | 'recording' | 'stopped'>('idle');

  const handleReportIssue = () => {
    setShowReportModal(true);
  };



  const startRecording = async (stream: MediaStream) => {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: mimeType });
      setAudioBlob(audioBlob);
      setRecordingState('stopped');
      stream.getTracks().forEach(track => track.stop());
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecordingState('recording');
    setIsRecording(true);
    
    const timer = window.setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    setRecordingTimer(timer);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (recordingTimer) {
      window.clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    setIsRecording(false);
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setRecordingDuration(0);
    setRecordingState('idle');
  };

  const handleStartRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      setRecordingError('');
      setRecordingDuration(0);
      
      // Direct microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      await startRecording(stream);
      setMicrophoneStream(stream);
      
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setRecordingError('Microphone permission required for voice recording');
      } else {
        setRecordingError('Unable to access microphone');
      }
    }
  };

  const handleEmergencyToggle = (emergencyId: string) => {
    setSelectedEmergencies(prev => 
      prev.includes(emergencyId)
        ? prev.filter(id => id !== emergencyId)
        : [...prev, emergencyId]
    );
  };

  const handleSendReport = async () => {
    if (selectedEmergencies.length === 0) {
      return; // Don't proceed if no emergency types selected
    }
    
    if (!showNoteBox) {
      setShowNoteBox(true); // Show note box for details
      return;
    }
    
    // Proceed with sending if note box is shown and details provided
    if (!reportNote.trim() && !audioBlob) {
      return; // Need either text or voice
    }
    
    const reportData = {
      emergencyTypes: selectedEmergencies,
      reportNote: reportNote.trim(),
      audioRecording: audioBlob,
      recordingDuration: recordingDuration,
      timestamp: new Date().toISOString(),
      audioSize: audioBlob ? audioBlob.size : 0
    };
    
    // Professional way to send report data
    const formData = new FormData();
    formData.append('emergencyTypes', JSON.stringify(selectedEmergencies));
    formData.append('reportNote', reportNote.trim());
    formData.append('timestamp', reportData.timestamp);
    
    if (audioBlob) {
      formData.append('audioFile', audioBlob, `emergency_${Date.now()}.webm`);
      formData.append('duration', recordingDuration.toString());
    }
    
    console.log('Emergency report ready to send:', {
      types: selectedEmergencies,
      note: reportNote.trim(),
      hasAudio: !!audioBlob,
      audioSize: audioBlob ? `${(audioBlob.size / 1024).toFixed(2)} KB` : 'No audio'
    });
    
    // Reset all states
    setShowReportModal(false);
    setIsRecording(false);
    setSelectedEmergencies([]);
    setReportNote('');
    setShowNoteBox(false);
    setAudioBlob(null);
    setMediaRecorder(null);
    setRecordingError('');
    setRecordingDuration(0);
    setRecordingState('idle');
    setMicrophoneStream(null);
    if (recordingTimer) {
      window.clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
  };

  const handleCancel = () => {
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    
    // Clean up microphone stream
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
      setMicrophoneStream(null);
    }
    
    if (recordingTimer) {
      window.clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    setShowReportModal(false);
    setIsRecording(false);
    setSelectedEmergencies([]);
    setShowEmergencyTypes(false);
    setReportNote('');
    setShowNoteBox(false);
    setAudioBlob(null);
    setMediaRecorder(null);
    setRecordingError('');
    setRecordingDuration(0);
    setRecordingState('idle');
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 h-96 w-full flex flex-col items-center justify-center">
      {/* Title with red exclamation mark */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Emergency Response</h2>
        </div>
      </div>
      
      {/* Content wrapper with red transparent background and border */}
      <div className="bg-red-50 bg-opacity-50 border border-red-300 rounded-lg p-6 w-full">
        {/* Paragraph */}
        <p className="text-black text-center mb-6">
          Report any issues or emergencies immediately. This will notify the school administration and all parents instantly.
        </p>
        
        {/* Large Red Button */}
        <button 
          onClick={handleReportIssue}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-colors w-full"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-base sm:text-lg font-semibold">REPORT ISSUE</span>
          </div>
        </button>
      </div> 
      
      {/* Warning text outside red border */}
      <p className="text-gray-600 text-center text-xs sm:text-sm mt-6 italic">
        Only use this button for genuine emergencies
      </p>
      
      {/* Emergency Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header with exclamation mark */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h2 className="text-xl font-bold text-black">Report Emergency</h2>
                </div>
                <p className="text-gray-700 text-sm text-center mb-6">
                  Select emergency type(s) and record a voice message to notify all relevant parties.
                </p>
              </div>
              
              {/* Emergency Types Selection */}
              <div className="mb-6">
                <button
                  onClick={() => setShowEmergencyTypes(!showEmergencyTypes)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">Emergency Types</span>
                  {showEmergencyTypes ? 
                    <FaChevronUp className="w-4 h-4 text-gray-600" /> : 
                    <FaChevronDown className="w-4 h-4 text-gray-600" />
                  }
                </button>
                
                {showEmergencyTypes && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {emergencyTypes.map((emergency) => {
                      const IconComponent = emergency.icon;
                      const isSelected = selectedEmergencies.includes(emergency.id);
                      
                      return (
                        <label
                          key={emergency.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleEmergencyToggle(emergency.id)}
                            className="w-4 h-4 text-white bg-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                          />
                          <IconComponent className={`w-5 h-5 ${emergency.color}`} />
                          <span className="text-sm font-medium text-gray-900">{emergency.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              
                {/* Recording Status */}
                {recordingError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{recordingError}</p>
                  </div>
                )}
                
                {audioBlob && recordingState === 'stopped' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-600">✓ Voice message saved ({recordingDuration}s)</p>
                      <button
                        onClick={handleDeleteRecording}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete recording"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              
              {/* Report Details Note - Only show when requested */}
              {showNoteBox && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Details Required
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Describe the emergency situation in detail..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400 transition-colors"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{reportNote.length}/500 characters</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="w-full space-y-3">
                {/* Start/Stop Recording Button */}
                <button 
                  onClick={handleStartRecording}
                  className={`${
                    isRecording 
                      ? 'bg-red-800 hover:bg-red-900' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-bold py-3 rounded-xl shadow-lg transition-colors w-full flex items-center justify-center gap-2`}
                >
                  <AiOutlineAudio className={`text-white text-lg ${
                    isRecording ? 'animate-pulse' : ''
                  }`} />
                  <span>
                    {isRecording ? `Recording... ${recordingDuration}s` : audioBlob ? 'Re-record' : 'Start Recording'}
                  </span>
                </button>
                
                {/* Send Emergency Report Button */}
                <button 
                  onClick={handleSendReport}
                  disabled={selectedEmergencies.length === 0 || (showNoteBox && !reportNote.trim() && !audioBlob)}
                  className={`font-bold py-3 rounded-xl shadow-lg transition-colors w-full flex items-center justify-center gap-2 ${
                    (selectedEmergencies.length > 0 && (!showNoteBox || reportNote.trim() || audioBlob))
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <BsSend className="text-lg" />
                  <span>{showNoteBox ? 'Send Emergency Report' : 'Continue to Details'}</span>
                </button>
                
                {/* Requirement Message */}
                {selectedEmergencies.length === 0 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please select emergency type(s) above
                  </p>
                )}
                
                {showNoteBox && !reportNote.trim() && !audioBlob && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please add details by voice recording or written note
                  </p>
                )}
                
                {/* Cancel Button */}
                <button 
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl shadow-lg transition-colors w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default EmergencyCard;