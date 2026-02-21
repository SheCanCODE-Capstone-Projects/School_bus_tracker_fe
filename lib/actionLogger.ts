// Frontend action logger using localStorage

export interface ActionLog {
  id: string;
  action: string;
  description: string;
  entityType: 'driver' | 'bus' | 'student' | 'parent' | 'emergency';
  performedBy: string;
  timestamp: string;
}

const STORAGE_KEY = 'admin_action_logs';
const MAX_LOGS = 100; // Keep only last 100 logs

export const logAction = (
  action: string,
  description: string,
  entityType: 'driver' | 'bus' | 'student' | 'parent' | 'emergency'
) => {
  try {
    const adminName = localStorage.getItem('userName') || 
                     JSON.parse(localStorage.getItem('user') || '{}').name || 
                     'Admin';
    
    const newLog: ActionLog = {
      id: Date.now().toString(),
      action,
      description,
      entityType,
      performedBy: adminName,
      timestamp: new Date().toISOString()
    };

    const existingLogs = getActionLogs();
    
    // Check for exact duplicate within last 1 second only
    const isDuplicate = existingLogs.some(log => {
      const timeDiff = Date.now() - new Date(log.timestamp).getTime();
      return (
        log.action === action &&
        log.description === description &&
        log.entityType === entityType &&
        log.performedBy === adminName &&
        timeDiff < 1000 // 1 second
      );
    });

    if (isDuplicate) {
      return; // Skip logging exact duplicate
    }

    const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_LOGS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};

export const getActionLogs = (): ActionLog[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Failed to get action logs:', error);
    return [];
  }
};

export const clearActionLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};
