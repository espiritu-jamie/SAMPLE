import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

const CustomerAppointments = () => {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header with token
          },
        });
        // Assuming appointments is an array and you want to display the first one
        if (res.data.length > 0) {
          setAppointment(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleEdit = () => {
    // Implement edit functionality here
    console.log("Edit button clicked");
  };

  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Delete button clicked");
  };

  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">Appointments</h3>
        {appointment && (
          <div className="appointment-item">
            <h4>Date: {appointment.date}</h4>
            <p>Start Time: {appointment.starttime}</p>
            <p>End Time: {appointment.endtime}</p>
            <p>Phone Number: {appointment.phoneNumber}</p>
            <p>Address: {appointment.address}</p>
            {appointment.specialInstructions && (
              <p>Special Instructions: {appointment.specialInstructions}</p>
            )}
            <div>
              <button onClick={handleEdit} className="btn btn-primary mr-2">
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerAppointments;
