// Replace with your Google Apps Script Web App URL after deployment
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKtuepeuh4C0B9AlYisAMhYjENe0v42qnX_FS9wlOMVsbU5KVrcQUlgR9ukpFnTujFxg/exec';

// Mock Database for local testing if no URL is provided
const MOCK_DB = {
  users: [
    { mobile: '1234567890', password: 'password', name: 'John Doe' }
  ],
  logs: []
};

export const api = {
  async login(mobile, password) {
    if (!APPS_SCRIPT_URL) {
      console.log('Using Mock API for Login');
      return new Promise(resolve => setTimeout(() => {
        const user = MOCK_DB.users.find(u => u.mobile === mobile && u.password === password);
        if (user) {
          resolve({ success: true, message: 'Login successful', user: { name: user.name, mobile: user.mobile } });
        } else {
          resolve({ success: false, message: 'Invalid mobile number or password' });
        }
      }, 800));
    }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'login', mobile, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },

  async getStatus(mobile) {
    if (!APPS_SCRIPT_URL) {
      return new Promise(resolve => setTimeout(() => {
        const userLogs = MOCK_DB.logs.filter(l => l.mobile === mobile);
        const lastAction = userLogs.length > 0 ? userLogs[userLogs.length - 1].action : 'Out';
        const recentLogs = [...userLogs].reverse().slice(0, 10);
        resolve({ success: true, lastAction, recentLogs });
      }, 500));
    }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getStatus', mobile })
      });
      return await response.json();
    } catch (error) {
      console.error('Get Status Error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },

  async logAttendance(mobile, attendanceAction = 'Auto') {
    if (!APPS_SCRIPT_URL) {
      console.log('Using Mock API for Attendance');
      return new Promise(async resolve => {
        let actionToLog = attendanceAction;
        if (attendanceAction === 'Auto') {
          const statusRes = await this.getStatus(mobile);
          actionToLog = statusRes.lastAction === 'In' ? 'Out' : 'In';
        }

        const newLog = {
          timestamp: new Date().toISOString(),
          mobile,
          action: actionToLog
        };
        MOCK_DB.logs.push(newLog);

        setTimeout(() => {
          resolve({
            success: true,
            message: 'Attendance logged successfully',
            action: actionToLog,
            timestamp: newLog.timestamp
          });
        }, 800);
      });
    }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'logAttendance', mobile, attendanceAction })
      });
      return await response.json();
    } catch (error) {
      console.error('Attendance Error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },

  async updateProfile(oldMobile, password, newMobile, newPassword) {
    if (!APPS_SCRIPT_URL) {
      return new Promise(resolve => setTimeout(() => {
        resolve({ success: true, message: 'Profile updated successfully (Mock)', user: { name: 'John Doe', mobile: newMobile } });
      }, 800));
    }

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateProfile', oldMobile, password, newMobile, newPassword })
      });
      return await response.json();
    } catch (error) {
      console.error('Update Profile Error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }
};
