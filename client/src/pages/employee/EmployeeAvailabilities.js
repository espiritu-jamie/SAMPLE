import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "antd/es/card/Card";
import Layout from "../../components/Layout"; 


const EmployeeAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const sortOrder = "earliest";

  useEffect(() => {
    // Fetch the employee's availabilities here
    const fetchAvailabilities = async () => {
      try {
        // Include the token in the request headers
        const token = localStorage.getItem("token"); // Assuming you store the token in local storage
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get("/api/availability", { headers }); // Adjust the endpoint if needed

        const sortedAvailabilities = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const dateComparison = dateA - dateB;

          if (dateComparison === 0) {
            if (sortOrder === "earliest") {
              return a.starttime.localeCompare(b.starttime);
            } else {
              return b.starttime.localeCompare(a.starttime);
            }
          }

          return sortOrder === "earliest" ? dateComparison : -dateComparison;

        });

        setAvailabilities(sortedAvailabilities);
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      }
    };

    fetchAvailabilities();
  }, [sortOrder]);

  const formatTime = (time) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(time).toLocaleTimeString("en-US", options);
  };

  const formatDateWithDayOfWeek = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  return (
    <Layout>
      <div>
        <h2>My Availability</h2>
        <ul>
          {availabilities.map((availability) => (
            <Card key={availability._id}>
              Date: {formatDateWithDayOfWeek(availability.date)} <br />
              Start Time: {formatTime(availability.starttime)} <br />
              End Time: {formatTime(availability.endtime)} <br />
            </Card>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default EmployeeAvailabilities;
