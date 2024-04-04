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
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/appointment', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            calculateHoursWorked(response.data.data);
        } catch (error) {
            console.error('Error fetching hours worked:', error);
        }
    };

    const calculateHoursWorked = (availabilities) => {
        const now = moment();
        let monthsSet = new Set();
    
        // Generate all months for the current year or a range of years
        const allMonthsOfYear = [];
        const currentYear = now.year();
        for (let month = 0; month < 12; month++) {
            // Format as "Month YYYY"
            const monthYearFormat = moment().month(month).year(currentYear).format('MMMM YYYY');
            allMonthsOfYear.push(monthYearFormat);
        }
    
        const hoursByEmployee = availabilities.reduce((acc, current) => {
            const userId = current.user?._id|| 'Unknown';
            const userName = current.user?.name || 'Unknown'; // Assuming name is within the user object
            console.log('employeeId:', userId);
            console.log(current.assignedEmployees);
            console.log(acc);            
            const startTime = moment.utc(current.starttime, 'HH:mm');
            const endTime = moment.utc(current.endtime, 'HH:mm');
            const appointmentDate = moment.utc(current.date);

            const assignedEmployeeNames = current.assignedEmployees.map(employee => employee.name);
            console.log('Assigned Employee Names:', assignedEmployeeNames);
            console.log('Current assigned: ', current.assignedEmployees);
            
            if (!acc[userId]) {
                acc[userId] = {
                    name: userName, // Store the name
                    totalHours: 0,
                    months: {},
                };
            }

            if (appointmentDate.isAfter(now)) {
                return acc;
            }
            
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
            const monthYear = appointmentDate.format('MMMM YYYY');
            monthsSet.add(monthYear);

            if (!acc[userId]) {
                acc[userId] = {
                    totalHours: 0,
                    months: {},
                };
            }

            if (!acc[userId].months[monthYear]) {
                acc[userId].months[monthYear] = {
                    monthYear: monthYear,
                    hoursWorked: 0,
                };
            }

            acc[userId].totalHours += hours;
            acc[userId].months[monthYear].hoursWorked += hours;

            return acc;
        }, {});

        allMonthsOfYear.forEach(monthYear => monthsSet.add(monthYear));

        const monthsFilter = Array.from(monthsSet).map(monthYear => ({
            text: monthYear,
            value: monthYear,
        }));
        setMonthsFilter(monthsFilter);

        const transformedData = Object.keys(hoursByEmployee).map(userId => ({
            key: userId,
            userId,
            totalHours: hoursByEmployee[userId].totalHours.toFixed(2),
            months: Object.values(hoursByEmployee[userId].months),
        }));

        setHoursWorked(transformedData);
    };

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'userId', // Changed from '_id' to 'userId'
            key: 'userId',
        },
        {
            title: 'Total Hours Worked',
            dataIndex: 'totalHours',
            key: 'totalHours',
            filters: monthsFilter,
            onFilter: (value, record) => record.months.some(month => month.monthYear === value),
        },
    ];

    const expandedRowRender = (record) => {
        const columns = [
            { title: 'Month-Year', dataIndex: 'monthYear', key: 'monthYear' },
            { title: 'Hours Worked', dataIndex: 'hoursWorked', key: 'hoursWorked' },
        ];

        const data = record.months.map(month => ({
            key: month.monthYear,
            monthYear: month.monthYear,
            hoursWorked: month.hoursWorked,
        }));

        return <Table columns={columns} dataSource={data} pagination={false} />;
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