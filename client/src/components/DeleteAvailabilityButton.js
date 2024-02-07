import React from 'react';
import axios from 'axios'; // Make sure to install axios for making HTTP requests

const DeleteAvailabilityButton = ({ availabilityId, onDeletionSuccess }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/availability/${availabilityId}`);
      if (response.status === 200) {
        alert('Availability deleted successfully');
        onDeletionSuccess(); // Callback to refresh the availability list or update UI accordingly
      }
    } catch (error) {
      console.error('Failed to delete availability:', error);
      alert('Failed to delete availability');
    }
  };

  return <button onClick={handleDelete}>Delete Availability</button>;
};

export default DeleteAvailabilityButton;