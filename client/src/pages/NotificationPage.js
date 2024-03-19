// client\src\pages\NotificationPage.js
import { message, Tabs } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  hideLoading,
  showLoading
} from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import Layout from "./../components/Layout";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("0"); // Initialize active tab to "New"
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [selectedReadNotifications, setSelectedReadNotifications] = useState(new Set());

  useEffect(() => {
    if (refreshNotifications) {
      setActiveTab("1"); // Switch to "Read" tab after refreshing notifications
    }
  }, [refreshNotifications]);

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(notificationId)) {
        newSelected.delete(notificationId);
      } else {
        newSelected.add(notificationId);
      }
      return newSelected;
    });
  };

  const toggleReadNotificationSelection = (notificationId) => {
    setSelectedReadNotifications((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(notificationId)) {
        newSelected.delete(notificationId);
      } else {
        newSelected.add(notificationId);
      }
      return newSelected;
    });
  };  

  // handle read notification
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.put(
        "/api/notification/mark-all-notification-as-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("All notifications marked as read.");
        const updatedUser = {
          ...user,
          seennotification: [...user.seennotification, ...user.notification],
          notification: [],
        };
        dispatch(setUser(updatedUser));
        setRefreshNotifications((prevState) => !prevState);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error making notifications as read: ", error);
      message.error("Something went wrong while marking notifications as read.");
    }
  };

  // When the user decides to mark selected as read
const handleMarkSelectedAsRead = async () => {
  try {
    dispatch(showLoading());
    
    for (const notificationId of selectedNotifications) {
      await axios.put(
        `/api/notification/mark-as-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }

    dispatch(hideLoading());
    message.success("Selected notifications marked as read.");
    
    // Update your notifications state accordingly
    // Reset the selected notifications
    setSelectedNotifications(new Set());
    setRefreshNotifications((prevState) => !prevState);
    
  } catch (error) {
    dispatch(hideLoading());
    console.error("Error marking selected notifications as read:", error);
    message.error("Something went wrong while marking selected notifications as read.");
  }
};


  // handle delete all read notifications
const handleDeleteAllRead = async () => {
  try {
    dispatch(showLoading());
    const res = await axios.delete(
      "/api/notification/delete-all-notifications", // Update endpoint
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch(hideLoading());
    if (res.data.success) {
      const updatedUser = {
        ...user,
        notification: res.data.data.notification, // Update notifications with the response
        seennotification: [],
      };
      dispatch(setUser(updatedUser));
      setRefreshNotifications((prevState) => !prevState);
      message.success(res.data.message);
    } else {
      message.error(res.data.message);
    }
  } catch (error) {
    dispatch(hideLoading());
    console.error("Error deleting read notifications: ", error);
    message.error("Something went wrong while deleting read notifications.");
  }
};

return (
  <Layout>
    <h3 className="p-3 text-center">Notifications</h3>
    <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
      <Tabs.TabPane tab="New" key="0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-warning"
            onClick={handleMarkAllRead}
          >
            Mark All Read
          </button>
          <button
            className="btn btn-primary"
            onClick={handleMarkSelectedAsRead}
            disabled={selectedNotifications.size === 0}
          >
            Mark Selected as Read
          </button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          {user && user.notification && user.notification.length > 0 ? (
            user.notification.map((notification) => (
              <div key={notification._id} className="card">
                <div className="card-body">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedNotifications.has(notification._id)}
                      onChange={() => toggleNotificationSelection(notification._id)}
                      id={`checkbox-${notification._id}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${notification._id}`} style={{ marginLeft: '10px' }}>
                      {notification.message}
                    </label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>You have no new notifications.</p>
          )}
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Read" key="1">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <button className="btn btn-danger" onClick={handleDeleteAllRead}>
      Delete All Read
    </button>
    <button
      className="btn btn-danger"
      onClick={handleDeleteAllRead}
      disabled={selectedReadNotifications.size === 0}
    >
      Delete Selected Read
    </button>
  </div>
  <div style={{ marginBottom: '10px' }}>
    {user && user.seennotification && user.seennotification.length > 0 ? (
      user.seennotification.map((notification) => (
        <div key={notification._id} className="card">
          <div className="card-body d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              checked={selectedReadNotifications.has(notification._id)}
              onChange={() => toggleReadNotificationSelection(notification._id)}
              id={`checkbox-read-${notification._id}`}
            />
            <label className="form-check-label flex-grow-1" htmlFor={`checkbox-read-${notification._id}`}>
              {notification.message}
            </label>
          </div>
        </div>
      ))
    ) : (
      <p>You have no read notifications.</p>
          )}
        </div>
      </Tabs.TabPane>
    </Tabs>
  </Layout>
);

};

export default NotificationPage;
