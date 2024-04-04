import React, { useState, useEffect } from "react";
import { Badge, message } from "antd";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LayoutStyles.css";
import { adminMenu, employeeMenu, userMenu } from "./../Data/data";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('/api/notification/get-all-notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (data.success) {
          const currentUserId = localStorage.getItem('userId');
          // Only include notifications that have not been read or dismissed by the current user
          const newNotifications = data.data.filter(notification => 
            !notification.readBy.some(read => read.userId === currentUserId) &&
            !notification.dismissedBy.some(dismissed => dismissed.userId === currentUserId)
          );
          setNotifications(newNotifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        message.error("Unable to load notifications.");
      }
    };

    if (localStorage.getItem("token")) {
      fetchNotifications();
    }
  }, [localStorage.getItem('fetchTrigger')]); // Reacting to changes in local storage to re-fetch notifications

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/");
  };

  // const SidebarMenu = user?.userRole === "admin"
  //   ? adminMenu.filter((menu) => menu.name !== "Profile")
  //   : user?.userRole === "employee"
  //   ? employeeMenu.filter((menu) => menu.name !== "Profile")
  //   : userMenu;

  const SidebarMenu = user?.userRole === "admin"
  ? adminMenu
  : user?.userRole === "employee"
  ? employeeMenu
  : userMenu;


  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
            <img src="/jkl.png" alt="JKL Cleaning Service Logo" style={{ maxWidth: '60%', maxHeight: '220px', margin: '20px auto 0px', display: 'block', borderRadius: '50%' }} />
              <h6>JKL Cleaning Service</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div
                    key={menu.name}
                    className={`menu-item ${isActive && "active"}`}
                  >
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}
              <div className="menu-item" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge count={notifications.length} onClick={() => navigate("/notification")}>
                  <i className="fa-solid fa-bell"></i>
                </Badge>
              </div>
              <div className="user-doctor-admin-name">
                <h5>{user?.name}</h5>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
