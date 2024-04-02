import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card, Modal, Tooltip } from "antd";
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AdminAnnouncementForm from "./modal/AdminAnnouncementForm";

const Announcements = () => {
  const { user } = useSelector((state) => state.user);
  const [announcements, setAnnouncements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`/api/announcement/${user?.userRole || 'general'}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setAnnouncements(response.data.data);
        } else {
          console.error("Expected announcements data to be an array, but got:", typeof response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  const dismissAnnouncement = async (id) => {
    try {
      await axios.post(`/api/announcement/dismiss`, { announcementId: id }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setAnnouncements(announcements.filter(announcement => announcement._id !== id));
    } catch (error) {
      console.error("Failed to dismiss announcement:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <div style={{ width: '300px' }}> 
      <h3 style={{ marginBottom: '16px' }}>
        Announcements
        {user?.userRole === 'admin' && (
          <Tooltip title="Create Announcement">
            <PlusCircleOutlined onClick={showModal} style={{ cursor: 'pointer', marginLeft: '8px' }} />
          </Tooltip>
        )}
      </h3>
      <Modal title="Create Announcement" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <AdminAnnouncementForm onFormSubmit={handleCancel} />
      </Modal>
      {announcements.map((announcement) => (
        <Card
          key={announcement._id}
          style={{ marginBottom: '10px', marginLeft: '6px', position: 'relative' }} // Add position relative to the card
        >
          <CloseOutlined
            onClick={() => dismissAnnouncement(announcement._id)}
            style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }} // Position the close icon
          />
          <h4>{announcement.title}</h4>
          <p>{announcement.content}</p>
          <p style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.45)' }}>Sent on: {formatDate(announcement.createdAt)}</p>
        </Card>
      ))}

    </div>
  );
};

export default Announcements;
