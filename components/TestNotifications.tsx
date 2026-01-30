'use client';

import React from 'react';
import { notificationService } from '@/lib/notification-service';

const TestNotifications = () => {
  const handleTestStatusChange = () => {
    notificationService.reportStatusChange(
      1,
      'active',
      'resolved',
      'David Brown',
      'Bus 03'
    );
  };

  const handleTestNewEmergency = () => {
    notificationService.reportNewEmergency(
      4,
      'Medical Emergency',
      'Sarah Williams',
      'Bus 02'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Test Notifications</h3>
      <div className="space-y-2">
        <button
          onClick={handleTestStatusChange}
          className="block w-full text-left px-3 py-2 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
        >
          Test Status Change
        </button>
        <button
          onClick={handleTestNewEmergency}
          className="block w-full text-left px-3 py-2 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          Test New Emergency
        </button>
      </div>
    </div>
  );
};

export default TestNotifications;