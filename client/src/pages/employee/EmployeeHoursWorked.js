import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table } from 'antd';
import Layout from '../../components/Layout';

const EmployeeHoursWorked = () => {
    const [pastAppointments, setPastAppointments] = useState([]);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        fetchPastAppointments();
    }, []);

    const fetchPastAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/appointment/confirmed-for-employee', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Filter appointments for past dates
            const currentDate = moment();
            const pastAppointmentsData = response.data.data.filter(appointment => moment(appointment.date).isBefore(currentDate));
    
            const appointmentsData = pastAppointmentsData.map(appointment => ({
                id: appointment._id,
                date: moment(appointment.date).format('YYYY-MM-DD'),
                starttime: moment(appointment.starttime, 'HH:mm').format('HH:mm'),
                endtime: moment(appointment.endtime, 'HH:mm').format('HH:mm'),
                totalHours: calculateTotalHours(appointment.starttime, appointment.endtime),
            }));
    
            setPastAppointments(appointmentsData);
            setTotalHours(calculateTotalSum(appointmentsData));
        } catch (error) {
            console.error('Error fetching past appointments:', error);
        }
    };
    
    const calculateTotalHours = (startTime, endTime) => {
        const start = moment(startTime, 'HH:mm');
        const end = moment(endTime, 'HH:mm');
        const duration = moment.duration(end.diff(start));
        return duration.asHours();
    };

    const calculateTotalSum = (appointmentsData) => {
        return appointmentsData.reduce((total, appointment) => total + parseFloat(appointment.totalHours), 0).toFixed(2);
    };

    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Start Time', dataIndex: 'starttime', key: 'starttime' },
        { title: 'End Time', dataIndex: 'endtime', key: 'endtime' },
        { title: 'Total Hours Worked', dataIndex: 'totalHours', key: 'totalHours' },
    ];

    const totalRowStyle = { fontWeight: 'bold', fontSize: 'larger' };

    return (
        <Layout>
            <div>
                <h2>My Hours</h2>
                <Table 
                    columns={columns} 
                    dataSource={pastAppointments} 
                    rowClassName={(record) => record.totalHours !== undefined ? 'total-row' : ''} 
                    style={{ marginBottom: '20px' }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={3} style={totalRowStyle}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} style={totalRowStyle}>{totalHours}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </Layout>
    );
};

export default EmployeeHoursWorked;
