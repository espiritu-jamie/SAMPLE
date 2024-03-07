import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Tabs, Select, Button } from 'antd';
import Layout from '../../components/Layout';
import MyCalendar from '../../components/MyCalendar';

const { Option } = Select;

const AdminEmployeeAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [sortOrder, setSortOrder] = useState('earliest');
  const [sortMode, setSortMode] = useState('byEmployee'); // Default sort mode
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('/api/availability', { headers });
        setAvailabilities(response.data.data);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
      }
    };

    fetchAvailabilities();
  }, []);

  const getSortedAvailabilities = () => {
    // Sort availabilities based on the selected sort order and mode
    return availabilities.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      const dateStringA = dateA.toISOString().split('T')[0];
      const dateStringB = dateB.toISOString().split('T')[0];

      if (dateStringA === dateStringB) {
        const timeA = a.starttime;
        const timeB = b.starttime;

        return sortOrder === 'earliest' ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA);
      } else {
        return sortOrder === 'earliest' ? dateA - dateB : dateB - dateA;
      }
    });
  };
  const formatTime = (time) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(time).toLocaleTimeString('en-US', options);
  };

  const formatDateWithDayOfWeek = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };


  const tabsItems = () => {
    const items = [];
    if (sortMode === 'byEmployee') {
      // Organize by employee
      const byEmployee = getSortedAvailabilities().reduce((acc, availability) => {
        const name = availability.user?.name || 'Unknown';
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(availability);
        return acc;
      }, {});
  
      Object.entries(byEmployee)
        .sort(([name1], [name2]) => name1.localeCompare(name2))
        .forEach(([name, availabilities]) => {
  
        items.push({
          label: name,
          key: name,
          children: availabilities.map((availability, index) => (
            <Card key={index}>
              Date: {formatDateWithDayOfWeek(availability.date)} <br />
              Start Time: {formatTime(availability.starttime)} <br />
              End Time: {formatTime(availability.endtime)} <br />
            </Card>
          )),
        });
      });
    } else {
      // Unified list for sorting by date/time
      items.push({
        label: 'All Availabilities',
        key: 'all',
        children: getSortedAvailabilities().map((availability, index) => (
          <Card key={index}>
            Employee: {availability.user?.name || 'Unknown'} <br />
            Date: {formatDateWithDayOfWeek(availability.date)} <br />
            Start Time: {formatTime(availability.starttime)} <br />
            End Time: {formatTime(availability.endtime)} <br />
          </Card>
        )),
      });
    }
    return items;
  };
  

  return (
    <Layout>
      <div>
        <h2>Employee Availabilities</h2>
        <Select defaultValue="byEmployee" style={{ width: 200, marginRight: 20 }} onChange={setSortMode}>
          <Option value="byEmployee">Sort by Employee</Option>
          <Option value="byDate">Sort by Date</Option>
        </Select>
        <Select defaultValue="earliest" style={{ width: 200 }} onChange={value => setSortOrder(value)}>
          <Option value="earliest">Earliest First</Option>
          <Option value="latest">Latest First</Option>
        </Select>
        <MyCalendar events={calendarEvents}/>
        <Tabs items={tabsItems()} />
      </div>
    </Layout>
  );
};

export default AdminEmployeeAvailability;
