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

  useEffect(() => {
    if (refreshNotifications) {
      setActiveTab("1"); // Switch to "Read" tab after refreshing notifications
    }
  }, [refreshNotifications]);

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
          <div className="d-flex justify-content-end">
            <button
              className="p-1 btn btn-warning"
              style={{ cursor: "pointer" }}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </button>
          </div>
          {user && user.notification && user.notification.length > 0 ? (
            user.notification.map((notificationMgs) => (
              <div
                className="card"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id}
              >
                <div
                  className="card-text"
                  onClick={() => {
                    navigate(notificationMgs.onClickPath);
                  }}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>You have no new notifications.</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="1">
          <div className="d-flex justify-content-end">
            <button
              className="p-1 btn btn-danger"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead} // Update active tab to "New" after deleting all read notifications
            >
              Delete All Read
            </button>
          </div>
          {user && user.seennotification && user.seennotification.length > 0 ? (
            user.seennotification.map((notificationMgs) => (
              <div
                className="card"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id}
              >
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMgs.onClickPath)}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>You have no read notifications</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
