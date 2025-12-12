'use client';
import { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineAudio } from 'react-icons/ai';

const EmergencyCard = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSendReport = () => {
    // Send emergency report functionality
    alert('Emergency report sent!');
    setShowReportModal(false);
    setIsRecording(false);
  };

  const handleCancel = () => {
    setShowReportModal(false);
    setIsRecording(false);
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 w-full max-w-md sm:max-w-lg h-96 flex flex-col items-center justify-center">
              {/* Header with exclamation mark */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h2 className="text-xl font-bold text-black">Report Emergency</h2>
                </div>
                <p className="text-gray-700 text-sm text-center mb-6">
                  Record a voice message or send an immediate emergency alert to notify all relevant parties.
                </p>
              </div>
              
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
                  <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                </button>
                
                {/* Send Emergency Report Button */}
                <button 
                  onClick={handleSendReport}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors w-full flex items-center justify-center gap-2"
                >
                  <BsSend className="text-white text-lg" />
                  <span>Send Emergency Report</span>
                </button>
                
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