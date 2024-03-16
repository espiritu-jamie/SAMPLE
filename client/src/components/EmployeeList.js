import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeList = ({ employee }) => {
  const navigate = useNavigate();
  const [hoursWorked, setHoursWorked] = useState(0);

  useEffect(() => {
    const getEmployeeAppointments = async () => {
      try {
        const response = await axios.get(
          `api/appointments/${employee._id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (response.data.success) {
          // Calculate total hours worked from appointments
          const appointments = response.data.data;
          let totalHours = 0;
          appointments.forEach(appointment => {
            totalHours += calculateDuration(appointment.startTime, appointment.endTime);
          });
          setHoursWorked(totalHours);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getEmployeeAppointments();
  }, [employee._id]);

  // Function to calculate duration in hours between start and end time
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    return duration;
  };

  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/employee/book-appointment/${employee._id}`)}
      >
        <div
          className="card-header"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          {employee.firstName} {employee.lastName}
        </div>

        <div className="card-body">
          <p>
            <b>Hours Worked:</b> {hoursWorked}
          </p>
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
