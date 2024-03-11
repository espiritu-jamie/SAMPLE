import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

const MyCalendar = ({ events }) => {
  const handleEventClick = ({ event, el }) => {
    // Handle click on event
    console.log("Event clicked:", event);
  };

  const handleDateClick = (arg) => {
    // Handle click on a date
    console.log("Date clicked:", arg);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      eventClick={handleEventClick}
      dateClick={handleDateClick}
      selectable={true}
    />
  );
};

export default MyCalendar;
