export interface EmergencyNotification {
  id: string;
  emergencyId: number;
  type: 'status_change' | 'new_emergency' | 'resolution';
  message: string;
  driverName: string;
  busNumber: string;
  timestamp: Date;
  read: boolean;
  previousStatus?: string;
  newStatus: string;
}

class NotificationService {
  private listeners: ((notification: EmergencyNotification) => void)[] = [];
  private notifications: EmergencyNotification[] = [];

  // Subscribe to notifications
  subscribe(callback: (notification: EmergencyNotification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Send notification to all subscribers
  private notify(notification: EmergencyNotification) {
    this.notifications.unshift(notification);
    this.listeners.forEach(listener => listener(notification));
  }

  // Driver reports emergency status change
  reportStatusChange(emergencyId: number, previousStatus: string, newStatus: string, driverName: string, busNumber: string) {
    const notification: EmergencyNotification = {
      id: `${Date.now()}-${Math.random()}`,
      emergencyId,
      type: 'status_change',
      message: `${driverName} changed emergency status from "${previousStatus}" to "${newStatus}" on ${busNumber}`,
      driverName,
      busNumber,
      timestamp: new Date(),
      read: false,
      previousStatus,
      newStatus
    };
    
    this.notify(notification);
  }

  // Driver reports new emergency
  reportNewEmergency(emergencyId: number, emergencyType: string, driverName: string, busNumber: string) {
    const notification: EmergencyNotification = {
      id: `${Date.now()}-${Math.random()}`,
      emergencyId,
      type: 'new_emergency',
      message: `${driverName} reported new emergency: ${emergencyType} on ${busNumber}`,
      driverName,
      busNumber,
      timestamp: new Date(),
      read: false,
      newStatus: 'active'
    };
    
    this.notify(notification);
  }

  // Get all notifications
  getNotifications(): EmergencyNotification[] {
    return this.notifications;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}

export const notificationService = new NotificationService();