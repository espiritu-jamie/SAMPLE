import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Modal, Button } from "antd";
import Layout from "../../components/Layout"; 
import { DeleteOutlined } from "@ant-design/icons";


const EmployeeAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const sortOrder = "earliest";

  const fetchAvailabilities = async () => {
    try {
      // Include the token in the request headers
      const token = localStorage.getItem("token"); // Get the token from local storage
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
  
  useEffect(() => {
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

  const handleDelete = (availabilityId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this availability?",
      onOk() {
        deleteAvailability(availabilityId);
      },
    });
  };

  const deleteAvailability = async (availabilityId) => {
    try {
      const token = localStorage.getItem("token");
      
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`/api/availability/${availabilityId}`, { headers });

      fetchAvailabilities();
    } catch (error) {
      console.error("Error deleting availability:", error);
      Modal.error({
        title: "An error occurred while deleting the availability",
        content: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <Layout>
      <div>
        <h2>My Availability</h2>
        <ul>
          {availabilities.map((availability) => (
            <Card 
              key={availability._id}>
              Date: {formatDateWithDayOfWeek(availability.date)} <br />
              Start Time: {formatTime(availability.starttime)} <br />
              End Time: {formatTime(availability.endtime)} <br />
              <Button
                type="primary"
                icon={
                  <DeleteOutlined />
                }
                onClick={() => handleDelete(availability._id)}
                danger
                >
                  Delete
              </Button>
            </Card>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default EmployeeAvailabilities;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Modal, Button } from "antd";
// import Layout from "../../components/Layout"; 
// import { DeleteOutlined } from "@ant-design/icons";


// const EmployeeAvailabilities = () => {
//   const [availabilities, setAvailabilities] = useState([]);
//   const sortOrder = "earliest";

//   const fetchAvailabilities = async () => {
//     try {
//       // Include the token in the request headers
//       const token = localStorage.getItem("token"); // Get the token from local storage
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       const response = await axios.get("/api/availability", { headers }); // Adjust the endpoint if needed

//       const sortedAvailabilities = response.data.data.sort((a, b) => {
//         const dateA = new Date(a.date);
//         const dateB = new Date(b.date);
//         const dateComparison = dateA - dateB;

//         if (dateComparison === 0) {
//           if (sortOrder === "earliest") {
//             return a.starttime.localeCompare(b.starttime);
//           } else {
//             return b.starttime.localeCompare(a.starttime);
//           }
//         }

//         return sortOrder === "earliest" ? dateComparison : -dateComparison;

//       });

//       setAvailabilities(sortedAvailabilities);
//     } catch (error) {
//       console.error("Error fetching availabilities:", error);
//     }
//   };
  
//   useEffect(() => {
//     fetchAvailabilities();
//   }, [sortOrder]);

//   const formatTime = (time) => {
//     const options = {
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(time).toLocaleTimeString("en-US", options);
//   };

//   const formatDateWithDayOfWeek = (date) => {
//     const options = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     return new Date(date).toLocaleString("en-US", options);
//   };

//   const handleDelete = (availabilityId) => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this availability?",
//       onOk() {
//         deleteAvailability(availabilityId);
//       },
//     });
//   };

//   const deleteAvailability = async (availabilityId) => {
//     try {
//       const token = localStorage.getItem("token");
      
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       await axios.delete(`/api/availability/${availabilityId}`, { headers });

//       fetchAvailabilities();
//     } catch (error) {
//       console.error("Error deleting availability:", error);
//       Modal.error({
//         title: "An error occurred while deleting the availability",
//         content: "Something went wrong. Please try again later.",
//       });
//     }
//   };

//   return (
//     <Layout>
//       <div>
//         <h2>My Availability</h2>
//         <ul>
//           {availabilities.map((availability) => (
//             <Card 
//               key={availability._id}>
//               Date: {formatDateWithDayOfWeek(availability.date)} <br />
//               Start Time: {formatTime(availability.starttime)} <br />
//               End Time: {formatTime(availability.endtime)} <br />
//               <Button
//                 type="primary"
//                 icon={
//                   <DeleteOutlined />
//                 }
//                 onClick={() => handleDelete(availability._id)}
//                 danger
//                 >
//                   Delete
//               </Button>
//             </Card>
//           ))}
//         </ul>
//       </div>
//     </Layout>
//   );
// };

// export default EmployeeAvailabilities;