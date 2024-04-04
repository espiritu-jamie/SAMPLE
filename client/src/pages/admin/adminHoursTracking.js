import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const AdminHoursTracking = () => {
    const [hoursWorked, setHoursWorked] = useState([]);
    const [monthsFilter, setMonthsFilter] = useState([]);

    useEffect(() => {
        fetchHoursWorked();
    }, []);

    const fetchHoursWorked = async () => {
        try {
            const response = await axios.get('/api/appointments/confirmed-for-employees'); // Adjust the API endpoint as needed
            const confirmedAppointments = response.data.data; // Assuming the data is structured as { success: true, data: [] }
            calculateHoursWorked(confirmedAppointments);
        } catch (error) {
            console.error('Error fetching confirmed appointments:', error);
            // Handle the error or set confirmedAppointments to an empty array
            calculateHoursWorked([]);
        }
    };
    

    const calculateHoursWorked = (confirmedAppointments) => {
        console.log('Confirmed Appointments:', confirmedAppointments);
        let monthsSet = new Set();
    
        const hoursByEmployee = confirmedAppointments.reduce((acc, current) => {
            const employeeName = current.assignedEmployees[0]?.name || 'Unknown'; // Potential issue here
            const startTime = moment.utc(current.starttime, 'HH:mm');
            const endTime = moment.utc(current.endtime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
            const monthYear = moment(current.date).format('MMMM YYYY');
            monthsSet.add(monthYear);
    
            if (!acc[employeeName]) {
                acc[employeeName] = {
                    totalHours: 0,
                    months: {},
                };
            }
    
            if (!acc[employeeName].months[monthYear]) {
                acc[employeeName].months[monthYear] = {
                    monthYear: monthYear,
                    hoursWorked: 0,
                };
            }
    
            acc[employeeName].totalHours += hours;
            acc[employeeName].months[monthYear].hoursWorked += hours;
    
            return acc;
        }, {});
    
        const monthsFilter = Array.from(monthsSet).map(monthYear => ({
            text: monthYear,
            value: monthYear,
        }));
        setMonthsFilter(monthsFilter);
    
        const transformedData = Object.keys(hoursByEmployee).map(name => ({
            key: name,
            name: name,
            totalHours: hoursByEmployee[name].totalHours.toFixed(2),
            months: Object.values(hoursByEmployee[name].months).map(month => ({
                monthYear: month.monthYear,
                hoursWorked: month.hoursWorked.toFixed(2),
            })),
        }));
    
        setHoursWorked(transformedData);
    };
    

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Total Hours Worked',
            dataIndex: 'totalHours',
            key: 'totalHours',
            filters: monthsFilter,
            onFilter: (value, record) => {
                return record.months.some(month => month.monthYear === value);
            },
        },
    ];

    const expandedRowRender = record => {
        const columns = [
            { title: 'Month', dataIndex: 'monthYear', key: 'monthYear' },
            { title: 'Hours Worked', dataIndex: 'hoursWorked', key: 'hoursWorked' },
        ];

        return <Table columns={columns} dataSource={record.months} pagination={false} />;
    };

    return (
        <Layout>
            <div>
                <h2>Employee Hours Tracker</h2>
                <Table
                    columns={columns}
                    dataSource={hoursWorked}
                    expandable={{
                        expandedRowRender,
                        rowExpandable: record => record.months && record.months.length > 0,
                    }}
                />
            </div>
        </Layout>
    );
};

export default AdminHoursTracking;
