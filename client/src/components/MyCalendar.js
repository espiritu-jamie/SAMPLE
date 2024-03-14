import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from 'antd';
import { useState } from 'react';
import moment from 'moment';

const MyCalendar = ({ events }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = ({ event, el }) => {
    setSelectedEvent({
      title: event.title,
      date: moment(event.start).format('dddd, MMMM D YYYY'), // Correctly formatted date
      startTime: moment(event.start).format('h:mm A'),
      endTime: event.end ? moment(event.end).format('h:mm A') : '',
    });
    setIsModalVisible(true);
  };
  
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <FullCalendar
          aspectRatio={1.5} // Adjust the width to height ratio
          contentHeight="auto" // or you can use a specific height like '600px'
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        timeZone='UTC'
        headerToolbar={{
          right: 'today prev,next',
          left: 'title',
        }}
        events={events}
        eventClick={handleEventClick}
        selectable={true}
      />
<Modal
  title="Availability Details"
  open={isModalVisible}
  onOk={handleModalClose}
  onCancel={handleModalClose}
  footer={null} // Remove default buttons
>
  {selectedEvent && (
    <div style={{ padding: '20px' }}>
      <p style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>{selectedEvent.title}</p>
      <p style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Date: <span style={{ fontWeight: 'normal' }}>{selectedEvent.date}</span></p>
    </div>
  )}
</Modal>
    </>
  );
};

export default MyCalendar;