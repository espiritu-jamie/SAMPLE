import React from 'react';
import MarkNotificationButton from './MarkNotificationButton';

const NotificationItem = ({ notification }) => {
  const handleMarkSuccess = () => {
    // Implement logic to update the notification list UI after marking the notification as read/unread
    // For example, refetch the notifications or update the notification state
  };

  return (
    <div className="notification-item">
      <h3>{notification.message}</h3>
      <p>{notification.createdAt}</p>
      <MarkNotificationButton
        notificationId={notification._id}
        markAsRead={!notification.isRead}
        onMarkSuccess={handleMarkSuccess}
      />
    </div>
  );
};

export default NotificationItem;
