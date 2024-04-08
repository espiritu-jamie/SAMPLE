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
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(3);

  // Calculate the current announcements
const indexOfLastAnnouncement = currentPage * announcementsPerPage;
const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Calculate the total number of pages
const pageNumbers = [];
for (let i = 1; i <= Math.ceil(announcements.length / announcementsPerPage); i++) {
  pageNumbers.push(i);
}

const renderPagination = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {currentPage > 1 && (
        <a onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} style={{ cursor: 'pointer', marginRight: '15px' }}>
          &larr;
        </a>
      )}
      {currentPage < pageNumbers.length && (
        <a onClick={() => setCurrentPage((prev) => Math.min(pageNumbers.length, prev + 1))} style={{ cursor: 'pointer', marginLeft: '15px' }}>
          &rarr;
        </a>
      )}
    </div>
  );
};




  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`/api/announcement/${user?.userRole || 'general'}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          const sortedAnnouncements = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAnnouncements(sortedAnnouncements);
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
      {currentAnnouncements.map((announcement) => (
        <Card
          key={announcement._id}
          style={{ marginBottom: '10px', marginLeft: '6px', position: 'relative' }} // Add position relative to the card
        >
          <CloseOutlined
            onClick={() => dismissAnnouncement(announcement._id)}
            style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }} // Position the close icon
          />
          <h4 style={{ color: '#2b4159',}}>{announcement.title}</h4>
          <p style={{ color: '#2b4159' }}>{announcement.content}</p>
          <p style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.45)' }}>Sent on: {formatDate(announcement.createdAt)}</p>
        </Card>
      ))}
      {renderPagination()}

    </div>
  );
};

export default Announcements;