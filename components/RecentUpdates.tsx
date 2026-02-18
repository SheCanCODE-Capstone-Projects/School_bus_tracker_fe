'use client';
import { FiActivity } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
}

interface Update {
  time: string;
  message: string;
  icon: string;
}

const RecentUpdates = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/parent/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Get only the latest 3 notifications
        const allNotifications = Array.isArray(data) ? data : [];
        const latestThree = allNotifications.slice(0, 3);
        setNotifications(latestThree);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setLoading(false);
    }
  };

  const updates: Update[] = [
    { time: '2:30 PM', message: 'Bus is on route. Everything is running smoothly.', icon: 'check' },
    { time: '2:00 PM', message: 'All students have been picked up successfully.', icon: 'bell' },
    { time: '1:45 PM', message: 'Bus departed from Lincoln Elementary School.', icon: 'bell' }
  ];

  const displayData = notifications.length > 0 ? notifications : updates;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex items-center mb-6">
        <div className="bg-sky-100 p-3 rounded-lg mr-4">
          <FiActivity className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Recent Updates</h2>
      </div>
      
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between border border-gray-300 p-4 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className={`py-1 px-3 rounded-lg mr-4 min-w-[80px] text-center text-sm ${
                    notification.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-black'
                  }`}>
                    {notification.type}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <p className="text-gray-800 text-sm">{notification.message}</p>
                  </div>
                </div>
                <div className="bg-sky-100 p-2 rounded-full ml-4">
                  {notification.read ? (
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  )}
                </div>
              </div>
            ))
          ) : (
            updates.map((update, index) => (
              <div key={index} className="flex items-center justify-between border border-gray-300 p-4 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className="bg-blue-100 text-black py-1 px-3 rounded-lg mr-4 min-w-[80px] text-center text-sm">
                    {update.time}
                  </div>
                  <p className="text-gray-800 flex-1">{update.message}</p>
                </div>
                <div className="bg-sky-100 p-2 rounded-full ml-4">
                  {update.icon === 'check' ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecentUpdates;