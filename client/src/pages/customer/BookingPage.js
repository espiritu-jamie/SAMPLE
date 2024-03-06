// import { DatePicker, TimePicker, message, Input } from "antd";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import Layout from "../../components/Layout";
// import { hideLoading, showLoading } from "../../redux/features/alertSlice";

// const BookingPage = () => {
//   const { user } = useSelector((state) => state.user);
//   const params = useParams();
//   const [doctors, setDoctors] = useState([]);
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [isAvailable, setIsAvailable] = useState();
//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     province: "",
//     aptNumber: "",
//     postalCode: "",
//   });

//   const [cleaningFrequency, setCleaningFrequency] = useState(""); 
//   const [cleaningType, setCleaningType] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");

//   const dispatch = useDispatch();

//   // login user data
//   const getUserData = async () => {
//     try {
//       const res = await axios.post(
//         "/api/doctor/getDoctorById",
//         { doctorId: params.doctorId },
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };



//   // handleAvailability function
// const handleAvailability = async () => {
//   try {
//     dispatch(showLoading());
//     const res = await axios.post(
//       "/api/user/booking-availbility",
//       {
//         doctorId: params.doctorId,
//         date,
//         time,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     dispatch(hideLoading());
//     if (res.data.success) {
//       setIsAvailable(true);
//       console.log(isAvailable);
//       message.success(res.data.message);
//     } else {
//       message.error(res.data.message);
//     }
//   } catch (error) {
//     dispatch(hideLoading());
//     console.log(error);
//   }
// };

//   // =============== booking func
//   const handleBooking = async () => {
//     try {
//       setIsAvailable(true);
//       if (!date || !time) {
//         return alert("Date & Time Required");
//       }
//       dispatch(showLoading());
//       const res = await axios.post(
//         "/api/user/book-appointment",
//         {
//           doctorId: params.doctorId,
//           userId: user._id,
//           doctorInfo: doctors,
//           userInfo: user,
//           date: date,
//           time: time,
//           cleaningFrequency: cleaningFrequency,
//           cleaningType: cleaningType,
//           firstName: firstName,
//           lastName: lastName,
//           phoneNumber: phoneNumber,
//           email: email,
//           address: address, // Assuming you want to include the address
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       dispatch(hideLoading());
//       if (res.data.success) {
//         message.success(res.data.message);
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       console.log(error);
//     }
//   };
  
//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddress((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     getUserData();
//     //eslint-disable-next-line
//   }, []);

// const handleSubmit = () => {
//   if (!date || !time || !cleaningFrequency || !cleaningType || !firstName || !lastName || !phoneNumber || !email) {
//     alert("All fields are required");
//   } else {
//     handleBooking();
//   }
// }

// //sumbit appointment controller

// // const submitAppointmentController = async (req, res) => {
// //   const { date, starttime, endtime, phoneNumber, address, specialInstructions } = req.body;
// //   const userId = req.user._id; 

// //   try {
// //     const newAppointment = new Appointment({
// //       userId,
// //       date: moment(date, "YYYY-MM-DD").toDate(),
// //       starttime,
// //       endtime,
// //       phoneNumber,
// //       address,
// //       specialInstructions,
// //     });
// //     await newAppointment.save();

// //     return res.status(201).json({
// //       success: true,
// //       message: "Appointment submitted successfully",
// //       data: newAppointment,
// //     });
// //   } catch (error) {
// //     console.error("Error submitting appointment:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: `Error submitting appointment: ${error.message}`,
// //     });
// //   }
// // };

//   return (
//     <Layout>
//       <div className="container"></div>
//       <h3 className="text-center my-4">View Availability And Book Your Cleaning Now</h3>
//       <div 
//       className="gray-square"
//       style={{
//         backgroundColor: "#f0f0f0", 
//         padding: "20px",
//         margin: "20px 0", 
//         borderRadius: "8px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
//       }}
//     >
//         <h4>When and where?</h4>
//         <h5>Please enter the address of the property to be cleaned:</h5>
//         <div className="address-inputs mb-4">
//           <Input
//             placeholder="Street Address"
//             className="mb-2"
//             value={address.street}
//             onChange={handleAddressChange}
//             name="street"
//           />
//           <Input
//             placeholder="City"
//             className="mb-2"
//             value={address.city}
//             onChange={handleAddressChange}
//             name="city"
//           />
//           <Input
//             placeholder="Province"
//             className="mb-2"
//             value={address.province}
//             onChange={handleAddressChange}
//             name="province"
//           />
//           <Input
//             placeholder="Apartment Number"
//             className="mb-2"
//             value={address.aptNumber}
//             onChange={handleAddressChange}
//             name="aptNumber"
//           />
//           <Input
//             placeholder="Postal Code"
//             className="mb-2"
//             value={address.postalCode}
//             onChange={handleAddressChange}
//             name="postalCode"
//           />
//         </div>
//         {doctors && (
//             <div className="card-body">
//               <div className="appoint-card-body">
//                 <div className="d-flex flex-column w-50 mx-auto">
//                                     <DatePicker
//                     className="m-2 date-picker"
//                     format="DD-MM-YYYY"
//                     onChange={(value) => {
//                       const selectedDate = value
//                         ? value.format("DD-MM-YYYY")
//                         : "";
//                       setDate(selectedDate);
//                     }}
//                   />
//                   <TimePicker
//                     format="HH:mm"
//                     className="m-2 time-picker"
//                     onChange={(time) => setTime(time && time.format("HH:mm"))}
//                   />
//         <div className="frequency-section" style={{ marginTop: '20px' }}>
//         <h4>How often?</h4>
//         <p>Save on recurring cleaning</p>
//         <div className="frequency-options">
//           {["One time", "Weekly", "Biweekly", "Tri-weekly", "Monthly"].map((frequency) => (
//             <button
//               key={frequency}
//               style={{
//                 margin: '5px',
//                 padding: '10px 20px',
//                 border: cleaningFrequency === frequency ? '2px solid blue' : '1px solid grey',
//                 backgroundColor: cleaningFrequency === frequency ? '#D3D3D3' : 'white',
//                 borderRadius: '5px',
//               }}
//               onClick={() => setCleaningFrequency(frequency)}
//             >
//                         {frequency}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="cleaning-type-section" style={{ marginTop: '20px' }}>
//                   <h4>What type of cleaning do you need?</h4>
//                   <select
//                     value={cleaningType}
//                     onChange={(e) => setCleaningType(e.target.value)}
//                     className="cleaning-type-dropdown"
//                   >
//                     <option value="">Select</option>
//                     <option value="house-package">House Cleaning - Package</option>
//                     <option value="house-hour">House Cleaning - By Hour</option>
//                     <option value="office">Office/Business Cleaning</option>
//                   </select>
//                 </div>
//                 <div className="contact-info-section" style={{ marginTop: '20px' }}>
//                 <div className="contact-info-section" style={{ marginTop: '20px' }}>
//   <h4>Your contact information</h4>
//   <p>This information will be used to contact you about your service</p>
//   <div className="contact-info-inputs">
//     <div className="contact-input">
//       <label htmlFor="firstName">First Name</label>
//       <input
//         type="text"
//         id="firstName"
//         value={firstName}
//         onChange={(e) => setFirstName(e.target.value)}
//       />
//     </div>
//     <div className="contact-input">
//       <label htmlFor="lastName">Last Name</label>
//       <input
//         type="text"
//         id="lastName"
//         value={lastName}
//         onChange={(e) => setLastName(e.target.value)}
//       />
//     </div>
//     <div className="contact-input">
//       <label htmlFor="phoneNumber">Phone Number</label>
//       <input
//         type="tel"
//         id="phoneNumber"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//       />
//     </div>
//     <div className="contact-input">
//       <label htmlFor="email">Email</label>
//       <input
//         type="email"
//         id="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//     </div>
//     <div className="frequency-options">
//     <h4>Payment</h4>
//           {["Cheque", "E-transfer"].map((frequency) => (
//             <button
//               key={frequency}
//               style={{
//                 margin: '5px',
//                 padding: '10px 20px',
//                 border: cleaningFrequency === frequency ? '2px solid blue' : '1px solid grey',
//                 backgroundColor: cleaningFrequency === frequency ? '#D3D3D3' : 'white',
//                 borderRadius: '5px',
//               }}
//               onClick={() => setCleaningFrequency(frequency)}
//             >
//                         {frequency}
//                       </button>
//                     ))}
//                   </div>

              
//                   </div>
//                     <button onClick={handleSubmit} className="submit-button" style={{ marginTop: '20px' }}>
//                     Submit Booking
//                   </button>
                  
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };


// export default BookingPage;

// BookingPage.js

import { DatePicker, TimePicker, message, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import Layout from "../../components/Layout";

const BookingPage = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleSubmit = async () => {
    try {
      if (!date || !startTime || !endTime) {
        message.error("Please select date, start time, and end time");
        return;
      }

      const res = await axios.post(
        "/api/appointment/",
        {
          date,
          startTime,
          endTime,
          phoneNumber,
          address,
          specialInstructions
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header with token
          },
        }
      );


      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      message.error("Failed to submit appointment. Please try again.");
    }
  };
  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">Book Your Appointment</h3>
        <div className="gray-square">
          <h4>When and where?</h4>
          <div className="address-inputs mb-4">
            <Input
              placeholder="Phone Number"
              className="mb-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
              placeholder="Address"
              className="mb-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input.TextArea
              placeholder="Special Instructions (optional)"
              rows={4}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
          <DatePicker
            className="m-2 date-picker"
            format="YYYY-MM-DD"
            onChange={(value) => setDate(value.format("YYYY-MM-DD"))}
          />
          <TimePicker
            format="HH:mm"
            className="m-2 time-picker"
            onChange={(value) => setStartTime(value.format("HH:mm"))}
          />
          <TimePicker
            format="HH:mm"
            className="m-2 time-picker"
            onChange={(value) => setEndTime(value.format("HH:mm"))}
          />
          <button onClick={handleSubmit} className="submit-button">
            Submit Appointment
          </button>
        </div>
      
      
      </div>
    </Layout>
  );
};


export default BookingPage;
