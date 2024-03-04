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
        `/api/notification/${notificationId}`,
        { isRead: markAsRead },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based authentication
          },
        }
      );
      dispatch(hideLoading());
      if (response.status === 200) {
        const action = markAsRead ? 'marked as read' : 'marked as unread';
        message.success(`Notification ${action} successfully`);
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
