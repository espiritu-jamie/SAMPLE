import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice'; // Adjust paths as necessary
import { message } from 'antd'; // Using Ant Design's message component for feedback

const DeleteAvailabilityButton = ({ availabilityId, onDeletionSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/availability/${availabilityId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based authentication
          },
        }
      );
      dispatch(hideLoading());
      if (response.status === 200) {
        message.success('Availability deleted successfully');
        onDeletionSuccess(); // Callback to refresh the availability list or update UI accordingly
      } else {
        message.error('Failed to delete availability');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Failed to delete availability:', error);
      message.error('Failed to delete availability');
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-danger">Delete Availability</button>
  );
};

export default DeleteAvailabilityButton;
