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
  const [apiSuccess, setApiSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const handleEmergencyToggle = (emergencyId: string) => {
    setSelectedEmergencies(prev => 
      prev.includes(emergencyId)
        ? prev.filter(id => id !== emergencyId)
        : [...prev, emergencyId]
    );
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
    setApiSuccess('');
    setApiError('');
  };

  const handleStartRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      setRecordingError('');
      setRecordingDuration(0);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      await startRecording(stream);
      setMicrophoneStream(stream);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('NotAllowed')) {
        setRecordingError('Microphone permission required for voice recording');
      } else {
        setRecordingError('Unable to access microphone');
      }
    }
  };

  const getAuthToken = () => {
    // Check for the specific token name used in your app
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('accessToken') || 
                  localStorage.getItem('token');
    
    if (token) {
      return token.replace(/^Bearer\s+/i, '');
    }
    
    return null;
  };

  const getCurrentLocation = (): Promise<{latitude: number, longitude: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Default to Kigali, Rwanda coordinates if geolocation is not available
        resolve({ latitude: -1.9441, longitude: 30.0619 });
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to Kigali, Rwanda coordinates if user denies permission
          resolve({ latitude: -1.9441, longitude: 30.0619 });
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleSendReport = async () => {
    if (selectedEmergencies.length === 0) {
      setApiError('Please select at least one emergency type');
      return;
    }
    
    if (!showNoteBox) {
      setShowNoteBox(true);
      return;
    }
    
    if (!reportNote.trim()) {
      setApiError('Please provide emergency details');
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    setApiSuccess('');
    
    try {
      // Get authentication token
      const token = getAuthToken();
      if (!token) {
        setApiError('Authentication required. Please log in first.');
        setIsSubmitting(false);
        return;
      }
      
      // Get current location
      const location = await getCurrentLocation();
      
      // According to the API documentation, the endpoint expects:
      // POST /api/driver/emergencies
      // Required fields: emergencyType, description, latitude, longitude
      
      const requestData = {
        type: selectedEmergencies[0],
        description: reportNote.trim(),
        latitude: location.latitude,
        longitude: location.longitude
      };
      
      // Debug logging
      console.log('=== SENDING EMERGENCY REPORT ===');
      console.log('Endpoint:', 'https://school-bus-tracker-be.onrender.com/api/driver/emergencies');
      console.log('Token present:', !!token);
      console.log('Token value:', token?.substring(0, 20) + '...');
      console.log('Request headers:', {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.substring(0, 20)}...`,
      });
      console.log('Request data:', JSON.stringify(requestData, null, 2));
      console.log('Request data types:', {
        type: typeof requestData.type,
        description: typeof requestData.description,
        latitude: typeof requestData.latitude,
        longitude: typeof requestData.longitude
      });
      
      const response = await fetch("https://school-bus-tracker-be.onrender.com/api/driver/emergencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to parse response as JSON
      let responseData;
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        responseData = { message: responseText || 'Unknown error' };
      }
      
      if (!response.ok) {
        console.error('API Error:', responseData);
        
        // Extract error message from response
        const errorMessage = responseData.message || 
                            responseData.error || 
                            responseData.details || 
                            `Error ${response.status}: ${response.statusText}`;
        
        // Specific handling for common error codes
        if (response.status === 400) {
          setApiError(`Invalid request: ${errorMessage}. Please check your input.`);
        } else if (response.status === 401) {
          setApiError('Session expired. Please log in again.');
        } else if (response.status === 403) {
          setApiError('You do not have permission to report emergencies.');
        } else if (response.status === 404) {
          setApiError('Emergency reporting service not found.');
        } else if (response.status === 500) {
          setApiError('Server error. Please try again later.');
        } else {
          setApiError(`Failed to send emergency report: ${errorMessage}`);
        }
        
        setIsSubmitting(false);
        return;
      }

      // Success case
      console.log('Success response:', responseData);
      setApiSuccess('Emergency report sent successfully!');
      
      // Reset form and close modal after 3 seconds
      setTimeout(() => {
        setShowReportModal(false);
        setSelectedEmergencies([]);
        setReportNote('');
        setShowNoteBox(false);
        setApiSuccess('');
        setApiError('');
        setIsSubmitting(false);
      }, 3000);
      
    } catch (error: unknown) {
      console.error('Network or other error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unable to connect to server';
      setApiError(`Network error: ${errorMessage}`);
      setIsSubmitting(false);
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
    setSelectedEmergencies([]);
    setShowEmergencyTypes(false);
    setReportNote('');
    setShowNoteBox(false);
    setAudioBlob(null);
    setMediaRecorder(null);
    setRecordingError('');
    setRecordingDuration(0);
    setRecordingState('idle');
    setApiSuccess('');
    setApiError('');
    setIsSubmitting(false);
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
                Select emergency type and provide details to notify all relevant parties.
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
            
            {/* API Success/Error Messages */}
            {apiSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{apiSuccess}</p>
              </div>
            )}
            
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}
            
            {/* Report Details Note - Only show when requested */}
            {showNoteBox && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Details Required *
                </label>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Describe the emergency situation in detail (e.g., location, severity, number of people affected, immediate actions taken)..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400 transition-colors"
                  rows={4}
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">{reportNote.length}/500 characters</p>
              </div>
            )}
            
            {/* Selected Emergencies Display */}
            {selectedEmergencies.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Selected Emergency Types:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmergencies.map(id => {
                    const emergency = emergencyTypes.find(e => e.id === id);
                    return emergency ? (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-blue-300 rounded-md text-xs text-blue-700">
                        <emergency.icon className={`w-3 h-3 ${emergency.color}`} />
                        {emergency.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="w-full space-y-3">
              {/* Send Emergency Report Button */}
              <button 
                onClick={handleSendReport}
                disabled={selectedEmergencies.length === 0 || (showNoteBox && !reportNote.trim()) || isSubmitting}
                className={`font-bold py-3 rounded-xl shadow-lg transition-colors w-full flex items-center justify-center gap-2 ${
                  (selectedEmergencies.length > 0 && (!showNoteBox || reportNote.trim()) && !isSubmitting)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <BsSend className="text-lg" />
                    <span>{showNoteBox ? 'Send Emergency Report' : 'Continue to Details'}</span>
                  </>
                )}
              </button>
              
              {/* Requirement Message */}
              {selectedEmergencies.length === 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Please select at least one emergency type above
                </p>
              )}
              
              {showNoteBox && !reportNote.trim() && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Please provide emergency details before sending
                </p>
              )}
              
              {/* Cancel Button */}
              <button 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl shadow-lg transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
            
            {/* Footer note */}
            <p className="text-xs text-gray-400 text-center mt-6">
              This report will be sent to school administration and parents immediately.
              Only use for genuine emergencies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyCard;