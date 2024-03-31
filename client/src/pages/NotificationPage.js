import React, { useState, useEffect } from 'react';
import { message, Tabs, Button, Tooltip } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';
import Layout from './../components/Layout';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/notification/get-all-notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        const currentUserId = localStorage.getItem('userId');
        // Filter out dismissed notifications for the current user
        const filteredNotifications = data.data.filter(notification => 
          !notification.dismissedBy.some(user => user.userId === currentUserId)
        );
        setNotifications(filteredNotifications);
      } else {
        message.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      message.error('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
};

const handleDismissNotification = async (notificationId) => {
    try {
      await axios.put(`/api/notification/dismiss-notification/${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Immediately remove the notification from state to update UI
      const currentUserId = localStorage.getItem('userId');
      
      setNotifications(currentNotifications => 
        currentNotifications.filter(notification => 
          notification._id !== notificationId || 
          notification.dismissedBy.some(user => user.userId === currentUserId)
        )
      );

      message.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error dismissing the notification:', error);
      message.error('Something went wrong while dismissing the notification.');
    }
};


  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notification/mark-as-read/${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Optimistically update the UI to reflect the read status
      setNotifications(notifications.map(notification => {
        if (notification._id === notificationId) {
          // Assuming your backend correctly updates the notification object
          // to include the current user in readBy upon marking as read
          window.location.reload();
          return { ...notification, readBy: [...notification.readBy, { userId: 'currentUserId' }] }; // Adjust 'currentUserId' as necessary
        }

        return notification;
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      message.error('Something went wrong while marking the notification as read.');
    }
  };



  
  const renderNotificationAction = (notification) => {
    const currentUserId = localStorage.getItem('userId');
    const isReadByCurrentUser = notification.readBy.some(user => user.userId === currentUserId);
  
    return (
      <div style={{ float: 'right' }}>
        {!isReadByCurrentUser && (
          <Tooltip title="Mark as Read">
            <CheckCircleOutlined onClick={() => handleMarkAsRead(notification._id)} style={{ color: 'green', marginRight: 16, cursor: 'pointer' }} />
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <DeleteOutlined onClick={() => handleDismissNotification(notification._id)} style={{ color: 'red', marginRight: 16, cursor: 'pointer' }} />
        </Tooltip>
        {isReadByCurrentUser && (
          <Tooltip title="Mark as Unread">
            <UndoOutlined onClick={() => handleMarkAsUnread(notification._id)} style={{ color: 'blue', cursor: 'pointer' }} />
          </Tooltip>
        )}
      </div>
    );
  };
  
  

  const renderNotifications = (read) => {
    return notifications
      .filter(notification => read ? notification.readBy.length > 0 : notification.readBy.length === 0)
      .map((notification) => (
        <div key={notification._id} className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <p>{notification.message}</p>
            {renderNotificationAction(notification)}
          </div>
        </div>
      ));
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notification/mark-all-as-read', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('All notifications marked as read');
      fetchNotifications(); 
      window.location.reload();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      message.error('Something went wrong.');
    }
  };
  
  const dismissAllNotifications = async () => {
    try {
      await axios.put('/api/notification/dismiss-all-notifications', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('All notifications deleted');
      fetchNotifications(); 
      window.location.reload();
    } catch (error) {
      console.error('Error dismissing all notifications:', error);
      message.error('Something went wrong.');
    }
  };
  
  const markAllAsUnread = async () => {
    // Assuming you have an endpoint '/api/notification/mark-all-as-unread'
    try {
      await axios.put('/api/notification/mark-all-as-unread', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('All notifications marked as unread');
      fetchNotifications(); // Refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Error marking all notifications as unread:', error);
      message.error('Something went wrong.');
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      await axios.put(`/api/notification/mark-as-unread/${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Update the UI accordingly
      window.location.reload();
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      message.error('Something went wrong while marking the notification as unread.');
    }
  };
  

  if (loading) return <Layout>Loading...</Layout>;

  const anyReadNotifications = notifications.some(notification => notification.readBy.length > 0);

  return (
    <Layout>
      <h3 className="p-3 text-center">Notifications</h3>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="New" key="1">
          {renderNotifications(false)}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="2">
          {renderNotifications(true)}
        </Tabs.TabPane>
      </Tabs>
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Button type="primary" onClick={markAllAsRead} disabled={notifications.length === 0} style={{ marginRight: 8 }}>
          Mark All as Read
        </Button>
        <Button danger onClick={dismissAllNotifications} disabled={notifications.length === 0} style={{ marginRight: 8 }}>
          Delete All
        </Button>
        <Button onClick={markAllAsUnread} disabled={!anyReadNotifications}>
          Mark All as Unread
        </Button>
      </div>
    </Layout>
  );
};

export default NotificationPage;