import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, Button, message, Radio, Input, Modal, Rate, Select } from "antd";
import moment from "moment";
import "../../styles/CustomerAppointmentsStyles.css";

const { Option } = Select;

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState(0);
  const [existingComment, setExistingComment] = useState("");

  const handleFilterChange = value => {
    setFilter(value);
  };

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
  
  const handleComment = async (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setHasRated(false);
    setExistingRating(0);
    setExistingComment(""); 
  
    try {
      const res = await axios.get(`/api/rating/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data && res.data.data && res.data.data.length > 0) {
        const ratingData = res.data.data[0];
        setHasRated(true);
        setExistingRating(ratingData.rating);
        setExistingComment(ratingData.comment);
      }
    } catch (error) {
      console.error("Error fetching existing rating:", error);
      message.error("Failed to fetch existing rating. Please try again.");
    }
  
  
    setCommentModalVisible(true);
  };  

  const handleCommentSubmit = async () => {
    if (hasRated) {
      message.info("You've already rated this appointment.");
      return;
    }

    try {
      const res = await axios.post(
        '/api/rating/submit', 
        {
          appointmentId: selectedAppointmentId,
          rating: rating,
          comment: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (res.status === 200 || res.status === 201) {
        message.success("Rating submitted successfully");
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      message.error("Failed to submit rating. Please try again.");
    } finally {
      setCommentModalVisible(false);
      setRating(0);
      setCommentText("");
    }
  };
  

  const handleCancelComment = () => {
    setCommentText("");
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
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Cancellation Reason',
      dataIndex: 'cancellationReason',
      key: 'cancellationReason',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
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
        disabled={record.status === "cancelled"} 
        style={{ 
          marginRight: 8,
          color: record.status === "cancelled" ? "#ccc" : undefined, 
          borderColor: record.status === "cancelled" ? "#ccc" : undefined 
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
      render: (_, record) => {
        const appointmentDate = moment(record.date, "MMMM D, YYYY");
        const currentDate = moment().startOf('day');

        console.log("appointmentDate", appointmentDate);
        console.log("currentDate", currentDate);
        
        const isPastAppointment = appointmentDate.isBefore(currentDate);
    
        return (
          <>
            <Button 
              onClick={() => handleComment(record._id)}
              type="primary"
              disabled={!isPastAppointment || record.status === "cancelled"}
              style={{ 
                color: (!isPastAppointment || record.status === "cancelled") ? "#ccc" : undefined,
                borderColor: (!isPastAppointment || record.status === "cancelled") ? "#ccc" : undefined
              }}
            >
              Rate
            </Button>
          </>
        );
      },
    },
    
  ];


  const calendarEvents = appointments.map((appointment) => ({
    id: appointment._id,
    title: `Appointment: ${appointment.phoneNumber} - ${appointment.status.toUpperCase()}`,
    start: moment(appointment.date, "MMMM D, YYYY").format('YYYY-MM-DD') + 'T' + appointment.starttime,
    end: moment(appointment.date, "MMMM D, YYYY").format('YYYY-MM-DD') + 'T' + appointment.endtime,
    allDay: false,
    extendedProps: {
      ...appointment
    },
    color: appointment.status === 'confirmed' ? '#33CC33' : appointment.status === 'cancelled' ? 'red' : 'blue', 
    textColor: 'white',
  }));

  console.log("calendarEvents", calendarEvents);
  

  const getFilteredAppointments = () => {
    const now = moment();
    return appointments.filter(appointment => {
      const appointmentDate = moment(appointment.date, "MMMM D, YYYY");
      if (filter === "past") {
        return appointmentDate.isBefore(now);
      } else if (filter === "upcoming") {
        return appointmentDate.isSameOrAfter(now);
      }
      return true; 
    });
  };
  

  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">My Appointments</h3>
          <Select defaultValue="all" style={{ width: 200, marginBottom: 20 }} onChange={handleFilterChange}>
            <Option value="all">All</Option>
            <Option value="upcoming">Upcoming</Option>
            <Option value="past">Past</Option>
          </Select>
          <Table 
            dataSource={getFilteredAppointments()}
            columns={columns}
            rowKey="_id"
            rowClassName={(record) => record.status === "cancelled" ? 'greyed-out' : ''}
            scroll={{ x: 'max-content' }}

        
          />
  
          <Modal
  title="Rate Appointment"
  visible={commentModalVisible}
  onOk={handleCommentSubmit}
  onCancel={handleCancelComment}
  okText="Submit Comment"
  cancelText="Cancel"
  okButtonProps={{ disabled: hasRated }} 
>
  <Rate
    value={hasRated ? existingRating : rating} 
    onChange={(value) => setRating(value)}
    style={{ marginBottom: 16 }}
    disabled={hasRated} 
  />
  <Input.TextArea
    value={hasRated ? existingComment : commentText} 
    onChange={(e) => setCommentText(e.target.value)}
    rows={4}
    placeholder="Enter your comment"
    disabled={hasRated} 
  />
</Modal>
  
        <Modal
          title="Cancel Appointment"
          visible={cancelModalVisible}
          onOk={handleCancelAppointment}
          onCancel={() => {
            setCancelModalVisible(false);
            setCancellationReason(""); 
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