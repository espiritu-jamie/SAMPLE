import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, Button, message, Radio, Input, Modal } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import "../../styles/CustomerAppointmentsStyles.css";

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const promptCancelAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCancelModalVisible(true);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointmentId || !cancellationReason.trim()) {
      message.error("A cancellation reason is required.");
      return;
    }

    try {
      const res = await axios.patch(`/api/appointment/cancel-appointment/${selectedAppointmentId}`, {
        cancellationReason,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200 || res.status === 204) {
        message.success("Appointment cancelled successfully");
        fetchAppointments();
        setCancelModalVisible(false);
        setSelectedAppointmentId(null);
        setCancellationReason("");
      } else {
        message.error("Failed to cancel the appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      message.error("An error occurred while cancelling the appointment. Please try again.");
    }
  };
  
  const handleComment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCommentModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    try {
      // You should replace this with actual backend API calls
      console.log("Submitting comment:", commentText);
      message.success("Comment submitted successfully");
      setCommentModalVisible(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to submit comment. Please try again.");
    }
  };

  const handleCancelComment = () => {
    setCommentText(""); // Reset the comment text
    setCommentModalVisible(false);
  };

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
      <Button 
        onClick={() => promptCancelAppointment(record._id)} 
        type="primary"
        danger
        disabled={record.status === "cancelled"} // Disable the button if the appointment is canceled
        style={{ 
          marginRight: 8,
          color: record.status === "cancelled" ? "#ccc" : undefined, // Optional: grey out text color
          borderColor: record.status === "cancelled" ? "#ccc" : undefined // Optional: grey out border color
        }}
      >
        Cancel Appointment
      </Button>
    </>
      ),
    },
    {
      title: 'Comments',
      key: 'comments',
      render: (_, record) => (
        <>
        <Button 
          onClick={() => handleComment(record._id)}
          type="primary"
          disabled={record.status === "cancelled"} // Disable the button if the appointment is canceled
          style={{ 
            color: record.status === "cancelled" ? "#ccc" : undefined, // Grey out text color if canceled
            borderColor: record.status === "cancelled" ? "#ccc" : undefined // Grey out border if canceled
          }}
      >
        Rate
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
    color: appointment.status === "cancelled" ? "#cccccc" : "#378006",
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
          <Table 
            dataSource={appointments}
            columns={columns}
            rowKey="_id"
            rowClassName={(record) => record.status === "cancelled" ? 'greyed-out' : ''}
        
          />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
          />
        )}
  
        <Modal
          title="Add Comment"
          visible={commentModalVisible}
          onOk={handleCommentSubmit}
          onCancel={() => setCommentModalVisible(false)}
          okText="Submit Comment"
          cancelText="Cancel"
        >
          <Input.TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            placeholder="Enter your comment"
          />
        </Modal>
  
        <Modal
          title="Cancel Appointment"
          visible={cancelModalVisible}
          onOk={handleCancelAppointment}
          onCancel={() => {
            setCancelModalVisible(false);
            setCancellationReason(""); // Reset the cancellation reason if the modal is cancelled
          }}
          okText="Confirm Cancellation"
          cancelText="Go Back"
        >
          <Input.TextArea
            rows={4}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Please provide a reason for cancellation."
          />
        </Modal>
      </div>
    </Layout>
  );
};
  


export default CustomerAppointments;