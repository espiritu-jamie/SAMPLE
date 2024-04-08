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
            const response = await axios.get('/api/availability', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            calculateHoursWorked(response.data.data);
        } catch (error) {
            console.error('Error fetching hours worked:', error);
        }
    };

    /**
     * calculateHoursWorked processes the fetched availability data to calculate the total hours worked
     * by each employee and organizes the data for rendering.
     * @param {Array} availabilities - The fetched availability data from the API.
     */
    const calculateHoursWorked = (availabilities) => {
        const now = moment(); // Current time to filter past confirmed appointments
        let monthsSet = new Set();
    
    
        // Generate all months for the current year or a range of years
        const allMonthsOfYear = [];
        const currentYear = now.year();
        for (let month = 0; month < 12; month++) {
            // Format as "Month YYYY"
            // Format as "Month YYYY"
            const monthYearFormat = moment().month(month).year(currentYear).format('MMMM YYYY');
            allMonthsOfYear.push(monthYearFormat);
        }
    
        const hoursByEmployee = availabilities.reduce((acc, current) => {
            const employeeName = current.user?.name || 'Unknown';
            const startTime = moment.utc(current.starttime, 'HH:mm');
            const endTime = moment.utc(current.endtime, 'HH:mm');
            const appointmentDate = moment.utc(current.date);
            
            if (appointmentDate.isAfter(now)) {
                // Skip future appointments
                return acc;
            }
    
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
            // Format monthYear to full month name and year
            const monthYear = appointmentDate.format('MMMM YYYY');
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
        allMonthsOfYear.forEach(monthYear => monthsSet.add(monthYear));
        
    
        // Transform monthsSet into filters for the table
        const monthsFilter = Array.from(monthsSet).map(monthYear => ({
            text: monthYear, // Already in "Month YYYY" format
            value: monthYear,
        }));
        setMonthsFilter(monthsFilter);
    
        // Transform the data structure into a format suitable for rendering
        const transformedData = Object.keys(hoursByEmployee).map(name => ({
            key: name,
            name: name,
            totalHours: hoursByEmployee[name].totalHours.toFixed(2),
            months: Object.values(hoursByEmployee[name].months).map(month => ({
                monthYear: month.monthYear, // Already in "Month YYYY" format
                hoursWorked: month.hoursWorked.toFixed(2),
            })),
        }));

        setHoursWorked(transformedData);
    };
    // Columns configuration for the Ant Design Table
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
