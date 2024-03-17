import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, Button, message, Radio } from "antd";
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

  const handleDelete = (appointmentId) => {
    // Implement delete functionality here
    console.log("Delete button clicked for appointment:", appointmentId);
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
          <Button onClick={() => handleEdit(record._id)} type="default" style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="default" danger>
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
      </div>
    </Layout>
  );
};

export default CustomerAppointments;