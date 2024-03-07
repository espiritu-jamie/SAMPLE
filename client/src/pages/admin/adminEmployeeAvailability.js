import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Tabs, Select } from 'antd';
import Layout from '../../components/Layout';
import MyCalendar from '../../components/MyCalendar';
import moment from 'moment';

const { Option } = Select;

const AdminEmployeeAvailability = () => {
    const [availabilities, setAvailabilities] = useState([]);
    const [sortOrder, setSortOrder] = useState('earliest');
    const [sortMode, setSortMode] = useState('byEmployee');
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        fetchAvailabilities();
    }, [sortMode, sortOrder]);

    useEffect(() => {
        if (sortMode === 'byDate') {
            const events = availabilities.map(availability => ({
                title: `${availability.user?.name}: ${moment(availability.starttime, 'HH:mm').format('hh:mm A')} - ${moment(availability.endtime, 'HH:mm').format('hh:mm A')}`,
                start: new Date(availability.date).toISOString(),
                end: new Date(availability.date).toISOString(),
                allDay: false,
            }));
            setCalendarEvents(events);
        }
    }, [availabilities, sortMode]);

    const fetchAvailabilities = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/availability', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvailabilities(response.data.data);
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        }
    };

    const getSortedAvailabilitiesByEmployee = () => {
        const groupedByEmployee = availabilities.reduce((acc, current) => {
            const employeeName = current.user?.name || 'Unknown';
            if (!acc[employeeName]) {
                acc[employeeName] = [];
            }
            acc[employeeName].push(current);
            return acc;
        }, {});

        // Sort the keys (employee names) alphabetically
        const sortedEmployeeNames = Object.keys(groupedByEmployee).sort();

        // Map the sorted names to tabs items
        return sortedEmployeeNames.map(name => ({
            label: name,
            key: name,
            children: groupedByEmployee[name].sort((a, b) => {
                // Sort by date and then by start time within each employee's availabilities
                return sortOrder === 'earliest' ?
                    new Date(a.date) - new Date(b.date) || a.starttime.localeCompare(b.starttime) :
                    new Date(b.date) - new Date(a.date) || b.starttime.localeCompare(a.starttime);
            }).map((availability, index) => (
                <Card key={index}>
                    Date: {new Date(availability.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} <br />
                    Start Time: {moment(availability.starttime, 'HH:mm').format('hh:mm A')} <br /> 
                    End Time: {moment(availability.endtime, 'HH:mm').format('hh:mm A')} <br /> 
                </Card>
            )),
        }));
    };

    return (
        <Layout>
            <div>
                <h2>Employee Availabilities</h2>
                <Select defaultValue="byEmployee" style={{ width: 200, marginRight: 20 }} onChange={setSortMode}>
                    <Option value="byEmployee">Sort by Employee</Option>
                    <Option value="byDate">Sort by Date</Option>
                </Select>
                {sortMode === 'byEmployee' && (
                    <Select defaultValue="earliest" style={{ width: 200 }} onChange={setSortOrder}>
                        <Option value="earliest">Earliest First</Option>
                        <Option value="latest">Latest First</Option>
                    </Select>
                )}
                {sortMode === 'byDate' ? (
                    <MyCalendar events={calendarEvents} />
                ) : (
                    <Tabs defaultActiveKey="1" items={getSortedAvailabilitiesByEmployee()} />
                )}
            </div>
        </Layout>
    );
};

export default AdminEmployeeAvailability;
