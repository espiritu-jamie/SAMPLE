import { DatePicker, TimePicker, message, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "",
    aptNumber: "",
    postalCode: "",
  });

  const [cleaningFrequency, setCleaningFrequency] = useState(""); 
  const [cleaningType, setCleaningType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  // handleAvailability function
const handleAvailability = async () => {
  try {
    dispatch(showLoading());
    const res = await axios.post(
      "/api/user/booking-availbility",
      {
        doctorId: params.doctorId,
        date,
        time,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch(hideLoading());
    if (res.data.success) {
      setIsAvailable(true);
      console.log(isAvailable);
      message.success(res.data.message);
    } else {
      message.error(res.data.message);
    }
  } catch (error) {
    dispatch(hideLoading());
    console.log(error);
  }
};

  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

const handleSubmit = () => {
  if (!date || !time || !cleaningFrequency || !cleaningType || !firstName || !lastName || !phoneNumber || !email) {
    alert("All fields are required");
  } else {
    handleBooking();
  }
}

  return (
    <Layout>
      <div className="container"></div>
      <h3 className="text-center my-4">View Availability And Book Your Cleaning Now</h3>
      <div 
      className="gray-square"
      style={{
        backgroundColor: "#f0f0f0", 
        padding: "20px",
        margin: "20px 0", 
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
      }}
    >
        <h4>When and where?</h4>
        <h5>Please enter the address of the property to be cleaned:</h5>
        <div className="address-inputs mb-4">
          <Input
            placeholder="Street Address"
            className="mb-2"
            value={address.street}
            onChange={handleAddressChange}
            name="street"
          />
          <Input
            placeholder="City"
            className="mb-2"
            value={address.city}
            onChange={handleAddressChange}
            name="city"
          />
          <Input
            placeholder="Province"
            className="mb-2"
            value={address.province}
            onChange={handleAddressChange}
            name="province"
          />
          <Input
            placeholder="Apartment Number"
            className="mb-2"
            value={address.aptNumber}
            onChange={handleAddressChange}
            name="aptNumber"
          />
          <Input
            placeholder="Postal Code"
            className="mb-2"
            value={address.postalCode}
            onChange={handleAddressChange}
            name="postalCode"
          />
        </div>
        {doctors && (
            <div className="card-body">
              <div className="appoint-card-body">
                <div className="d-flex flex-column w-50 mx-auto">
                                    <DatePicker
                    className="m-2 date-picker"
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      const selectedDate = value
                        ? value.format("DD-MM-YYYY")
                        : "";
                      setDate(selectedDate);
                    }}
                  />
                  <TimePicker
                    format="HH:mm"
                    className="m-2 time-picker"
                    onChange={(time) => setTime(time && time.format("HH:mm"))}
                  />
        <div className="frequency-section" style={{ marginTop: '20px' }}>
        <h4>How often?</h4>
        <p>Save on recurring cleaning</p>
        <div className="frequency-options">
          {["One time", "Weekly", "Biweekly", "Tri-weekly", "Monthly"].map((frequency) => (
            <button
              key={frequency}
              style={{
                margin: '5px',
                padding: '10px 20px',
                border: cleaningFrequency === frequency ? '2px solid blue' : '1px solid grey',
                backgroundColor: cleaningFrequency === frequency ? '#D3D3D3' : 'white',
                borderRadius: '5px',
              }}
              onClick={() => setCleaningFrequency(frequency)}
            >
                        {frequency}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="cleaning-type-section" style={{ marginTop: '20px' }}>
                  <h4>What type of cleaning do you need?</h4>
                  <select
                    value={cleaningType}
                    onChange={(e) => setCleaningType(e.target.value)}
                    className="cleaning-type-dropdown"
                  >
                    <option value="">Select</option>
                    <option value="house-package">House Cleaning - Package</option>
                    <option value="house-hour">House Cleaning - By Hour</option>
                    <option value="office">Office/Business Cleaning</option>
                  </select>
                </div>
                <div className="contact-info-section" style={{ marginTop: '20px' }}>
                <div className="contact-info-section" style={{ marginTop: '20px' }}>
  <h4>Your contact information</h4>
  <p>This information will be used to contact you about your service</p>
  <div className="contact-info-inputs">
    <div className="contact-input">
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </div>
    <div className="contact-input">
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
    <div className="contact-input">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="tel"
        id="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </div>
    <div className="contact-input">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  </div>
  <button onClick={handleSubmit} className="submit-button" style={{ marginTop: '20px' }}>
    Submit Booking
  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};


export default BookingPage;