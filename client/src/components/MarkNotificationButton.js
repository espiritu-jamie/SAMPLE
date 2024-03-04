import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { message } from 'antd';

const MarkNotificationButton = ({ notificationId, markAsRead, onMarkSuccess }) => {
  const dispatch = useDispatch();

  const handleMark = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/notification/${markAsRead ? 'mark-notification-as-read' : 'mark-notification-as-unread'}/${notificationId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.status === 200) {
        message.success(`Notification ${markAsRead ? 'marked as read' : 'marked as unread'} successfully`);
        onMarkSuccess(); // Callback to refresh the notification list or update UI accordingly
      } else {
        message.error('Failed to mark notification');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Failed to mark notification:', error);
      message.error('Failed to mark notification');
    }
  };

  return (
    <button onClick={handleMark} className="btn btn-primary">
      {markAsRead ? 'Mark as Read' : 'Mark as Unread'}
    </button>
  );
};

export default MarkNotificationButton;
