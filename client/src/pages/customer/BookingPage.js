import { DatePicker, TimePicker, message, Input, InputNumber } from "antd";
import axios from "axios";
import React, { useState } from "react";
import Layout from "../../components/Layout";


const BookingPage = () => {
  const [date, setDate] = useState("");
  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [multipliedOption, setMultipliedOption] = useState("");

  const handleSubmit = async () => {
    try {
      if (!date || !starttime || !endtime) {
        message.error("Please select date, start time, and end time");
        return;
      }
      const multipliedOption = selectedOption * 0.10;
      setMultipliedOption(multipliedOption);

      const res = await axios.post(
        "/api/appointment/",
        {
          date,
          starttime,
          endtime,
          phoneNumber,
          address,
          specialInstructions,
          setSelectedOption: multipliedOption 
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
          <div className="address-inputs mb-5">
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
              className="mb-2"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            /><p>Enter the Area you want to get cleaned (in sqft)</p>
            <InputNumber
            placeholder="Enter a number"
            className="mb-2"
            min={1} // You can adjust min and max values as needed
            onChange={(value) => setSelectedOption(value)}
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
            onChange={(value) => setStarttime(value.format("HH:mm"))}
          />
          <TimePicker
            format="HH:mm"
            className="m-2 time-picker"
            onChange={(value) => setEndtime(value.format("HH:mm"))}
          />
          <button onClick={handleSubmit} className="submit-button mb-2 bg-slate-300 rounded">
            Submit Appointment
          </button>
          <div>
          {multipliedOption && (
            <button className="multiplied-button rounded ">
              Approx Cost for Cleaning: ${multipliedOption}
            </button>
          )}
          </div>
        </div>
      
      
      </div>
    </Layout>
  );
};


export default BookingPage;