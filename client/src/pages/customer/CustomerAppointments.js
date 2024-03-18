import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, Button, message, Radio, Modal } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment"; // Make sure you've installed moment

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointment", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Format the date and times immediately after fetching
        const formattedAppointments = res.data.data.map((appointment) => ({
          ...appointment,
          date: moment(appointment.date).format("MMMM D, YYYY"),
          starttime: moment(appointment.starttime, "HH:mm").format("hh:mm A"),
          endtime: moment(appointment.endtime, "HH:mm").format("hh:mm A"),
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        message.error("Error fetching appointments");
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleEdit = (appointmentId) => {
    // Implement edit functionality here
    console.log("Edit button clicked for appointment:", appointmentId);
  };

  // const handleEdit = (appointmentId) => {
  //   const appointmentToEdit = appointments.find(appointment => appointment._id === appointmentId);
  //   if (appointmentToEdit) {
  //     setCurrentAppointment(appointmentToEdit);
  //     form.setFieldsValue({
  //       date: moment(appointmentToEdit.date, "MMMM D, YYYY"),
  //       starttime: moment(appointmentToEdit.starttime, "hh:mm A"),
  //       endtime: moment(appointmentToEdit.endtime, "hh:mm A"),
  //       phoneNumber: appointmentToEdit.phoneNumber,
  //       address: appointmentToEdit.address,
  //       specialInstructions: appointmentToEdit.specialInstructions,
  //     });
  //     setIsEditModalVisible(true);
  //   } else {
  //     message.error("Appointment not found");
  //   }
  // };

  const handleDelete = (appointmentId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this appointment?",
      onOk() {
        deleteAppointment(appointmentId);
      },
    });
  };
  
  const deleteAppointment = async (appointmentId) => {
    try {
      // Make DELETE request to delete the appointment
      await axios.delete(`/api/appointment/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // If deletion is successful, update the local state to reflect the changes
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment._id !== appointmentId)
      );
  
      // Show success message to the user
      message.success("Appointment deleted successfully");
    } catch (error) {
      // If there's an error, log it and show an error message to the user
      console.error("Error deleting appointment:", error);
      message.error("Failed to delete appointment");
    }
  };
  
  // const handleUpdateAppointment = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     const updatedAppointmentData = {
  //       date: values.date.format("YYYY-MM-DD"),
  //       starttime: values.starttime.format("HH:mm"),
  //       endtime: values.endtime.format("HH:mm"),
  //       phoneNumber: values.phoneNumber,
  //       address: values.address,
  //       specialInstructions: values.specialInstructions,
  //     };
  //     await axios.put(`/api/appointment/${currentAppointment._id}`, updatedAppointmentData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     setAppointments(appointments.map(appointment => 
  //       appointment._id === currentAppointment._id ? { ...appointment, ...updatedAppointmentData } : appointment
  //     ));

  //     message.success("Appointment updated successfully");
  //     setIsEditModalVisible(false);
  //   } catch (error) {
  //     console.error("Failed to update appointment:", error);
  //     message.error("Failed to update appointment");
  //   }
  // };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date, "MMMM D, YYYY").unix() - moment(b.date, "MMMM D, YYYY").unix(),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
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
          <Button onClick={() => handleEdit(record._id)} type="primary" style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="danger">
            Delete
          </Button>
        </>
      ),
    },
  ];

  const calendarEvents = appointments.map((appointment) => ({
    title: `Appointment with ${appointment.phoneNumber}`,
    start: moment(appointment.date, "MMMM D, YYYY").toISOString(),
    end: moment(appointment.date, "MMMM D, YYYY").toISOString(),
    allDay: true,
  }));

  

  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">My Appointments</h3>
        <Radio.Group
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          style={{ marginBottom: 20 }}
        >
          <Radio.Button value="list">List View</Radio.Button>
          <Radio.Button value="calendar">Calendar View</Radio.Button>
        </Radio.Group>
        {viewMode === 'list' ? (
          <Table dataSource={appointments} columns={columns} rowKey="_id" />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
          
          />
        )}
        {/* <Modal
  title="Edit Appointment"
  visible={isEditModalVisible}
  onOk={handleUpdateAppointment}
  onCancel={() => setIsEditModalVisible(false)}
  okText="Update"
  cancelText="Cancel"
>
  {currentAppointment && (
    <>
      <DatePicker
        format="YYYY-MM-DD"
        value={moment(currentAppointment.date, "MMMM D, YYYY")}
        onChange={(value) => setCurrentAppointment({...currentAppointment, date: value.format("MMMM D, YYYY")})}
      />
      <TimePicker
        format="HH:mm"
        value={moment(currentAppointment.starttime, "hh:mm A")}
        onChange={(value) => setCurrentAppointment({...currentAppointment, starttime: value.format("HH:mm")})}
        style={{ margin: '10px 0' }}
      />
      <TimePicker
        format="HH:mm"
        value={moment(currentAppointment.endtime, "hh:mm A")}
        onChange={(value) => setCurrentAppointment({...currentAppointment, endtime: value.format("HH:mm")})}
        style={{ margin: '10px 0' }}
      />
      <Input
        placeholder="Phone Number"
        value={currentAppointment.phoneNumber}
        onChange={(e) => setCurrentAppointment({...currentAppointment, phoneNumber: e.target.value})}
      />
      <Input
        placeholder="Address"
        value={currentAppointment.address}
        onChange={(e) => setCurrentAppointment({...currentAppointment, address: e.target.value})}
        style={{ margin: '10px 0' }}
      />
      <Input.TextArea
        placeholder="Special Instructions"
        value={currentAppointment.specialInstructions}
        onChange={(e) => setCurrentAppointment({...currentAppointment, specialInstructions: e.target.value})}
        rows={3}
      />
    </>
  )}
</Modal> */}
      </div>
    </Layout>
  );
};

export default CustomerAppointments;