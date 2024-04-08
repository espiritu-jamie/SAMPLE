import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

/**
 * AdminHoursTracking is a React component that fetches and displays the hours worked by employees.
 * It utilizes the Ant Design Table component to render the data in a user-friendly manner.
 * The component fetches employee availability data from an API, calculates the total hours worked
 * by each employee, and provides filters for viewing total hours worked by month.
 */
const AdminHoursTracking = () => {
    // State to store the processed hours worked data for display
    const [hoursWorked, setHoursWorked] = useState([]);
    // State to store the filter options for months
    const [monthsFilter, setMonthsFilter] = useState([]);

    useEffect(() => {
        fetchHoursWorked();
    }, []);

    
    /**
     * fetchHoursWorked makes an API call to fetch employee availability data.
     * It then processes this data to calculate hours worked using calculateHoursWorked function.
     */
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
                // Skip future appointments
                return acc;
            }
            
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
            // Format monthYear to full month name and year
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
            text: monthYear, // Already in "Month YYYY" format
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
            onFilter: (value, record) => {
                return record.months.some(month => month.monthYear === value);
            },
        },
    ];

    const expandedRowRender = record => {
        const columns = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Hours Worked', dataIndex: 'hoursWorked', key: 'hoursWorked' },
        ];

        return <Table columns={columns} dataSource={record.children} pagination={false} />;
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
                        rowExpandable: record => record.children && record.children.length > 0,
                    }}
                />
            </div>
        </Layout>
    );
};

export default AdminHoursTracking;
