import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const AdminHoursTracking = () => {
    const [trackedHours, setTrackedHours] = useState([]);

    useEffect(() => {
        fetchHoursTracking();
    }, []);

    const fetchHoursTracking = async () => {
        const token = localStorage.getItem('token');
        try {
            const [availabilitiesResponse, appointmentsResponse] = await Promise.all([
                axios.get('/api/admin-employee-availability', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('/api/admin-all-appointments', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const availabilities = availabilitiesResponse.data.data;
            const appointments = appointmentsResponse.data.data;

            const hoursWorked = calculateHoursWorked(availabilities, appointments);
            setTrackedHours(hoursWorked);
        } catch (error) {
            console.error('Error fetching tracked hours:', error);
        }
    };

    const calculateHoursWorked = (availabilities, appointments) => {
        let employeeHours = {};
        
        appointments.forEach(appointment => {
            const { userId, date, starttime, endtime } = appointment;
            const appointmentDuration = moment.duration(moment(endtime, "HH:mm").diff(moment(starttime, "HH:mm"))).asHours();
            
            // Find if the appointment is within the employee's availability
            const isAvailable = availabilities.some(availability => 
                availability.user._id === userId._id && 
                moment(availability.date).isSame(date, 'day') &&
                moment(starttime, "HH:mm").isSameOrAfter(moment(availability.starttime, "HH:mm")) && 
                moment(endtime, "HH:mm").isSameOrBefore(moment(availability.endtime, "HH:mm"))
            );
            
            if (isAvailable) {
                if (!employeeHours[userId.name]) {
                    employeeHours[userId.name] = 0;
                }
                employeeHours[userId.name] += appointmentDuration;
            }
        });
        
        return Object.entries(employeeHours).map(([name, hours]) => ({
            name,
            hours: hours.toFixed(2) // Convert to a string with 2 decimal places
        }));
    };

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Total Hours Worked',
            dataIndex: 'hours',
            key: 'hours',
            sorter: (a, b) => a.hours - b.hours,
        },
    ];

    return (
        <Layout>
            <h2>Hours Tracking</h2>
            <Table dataSource={trackedHours} columns={columns} rowKey="name" />
        </Layout>
    );
};

export default AdminHoursTracking;
