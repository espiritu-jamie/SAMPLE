import React, { useState, useEffect } from 'react';
import { Table, Button, message, Title, Radio, Input, Modal, Rate, Select } from "antd";
import axios from 'axios';
import Layout from '../../components/Layout';
import moment from 'moment';

const Additional = () => {
    const [appointments, setAppointments] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/appointment", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const formattedAppointments = res.data.data.map((appointment) => ({
        ...appointment,
        date: moment(appointment.date).format("MMMM D, YYYY"),
        starttime: moment(appointment.starttime, "HH:mm").format("hh:mm A"),
        endtime: moment(appointment.endtime, "HH:mm").format("hh:mm A"),
        status: appointment.status
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      message.error("Error fetching appointments");
      console.error("Error fetching appointments:", error);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Special Instructions',
      dataIndex: 'specialInstructions',
      key: 'specialInstructions',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <>
        <Button 
          onClick={() => editInstructions(record._id)} 
          type="primary"
          danger
          disabled={record.status === "cancelled"} // Disable the button if the appointment is canceled
          style={{ 
            marginRight: 8,
            color: record.status === "cancelled" ? "#ccc" : undefined, // Optional: grey out text color
            borderColor: record.status === "cancelled" ? "#ccc" : undefined // Optional: grey out border color
          }}
        >
            Edit Instructions
        </Button>
      </>
        ),
      },    
  ];
  const editInstructions=()=>{
    setModalVisible(true)
  }
  useEffect(() => {
    fetchAppointments();
  }, []);
  const getFilteredAppointments = () => {
    const now = moment();
    return appointments.filter(appointment => {
      const appointmentDate = moment(appointment.date, "MMMM D, YYYY");
      return appointmentDate.isSameOrAfter(now);
    });
  };
  

  return (
    <Layout>
      <div className="container" style={{ maxWidth: '600px', margin: 'auto', padding: '24px' }}>
        <h1>Edit Instructions</h1>
        <Table 
            dataSource={getFilteredAppointments()}
            columns={columns}
            rowKey="_id"
            rowClassName={(record) => record.status === "cancelled" ? 'greyed-out' : ''}
            scroll={{ x: 'max-content' }}

        
          />
          <Modal
          
  visible={modalVisible}
          >

            <Input.TextArea
            value={instructions} // Bind value to state
            rows={4}
            placeholder="Enter your New Address"
  />
</Modal>
          
      </div>
    </Layout>
  );
};

export default Additional;