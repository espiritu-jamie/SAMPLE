import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationItem from './NotificationItem';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notification/get-all-notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  return (
    <div className="notification-list">
      {notifications.map(notification => (
        <NotificationItem key={notification._id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
