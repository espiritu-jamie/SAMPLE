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
        console.log(availabilities); 
        const now = moment();
        let monthsSet = new Set();
    
        // Generate all months for the current year or a range of years
        const allMonthsOfYear = [];
        const currentYear = now.year();
        for (let month = 0; month < 12; month++) {
            const monthYearFormat = moment().month(month).year(currentYear).format('MMMM YYYY');
            allMonthsOfYear.push(monthYearFormat);
        }
    
        // Object to hold the accumulated hours worked by each employee per month
        const hoursByEmployee = availabilities.reduce((acc, current) => {
            const userId = current.user?._id || 'Unknown';
            const userName = current.user?.name || 'Unknown';
    
            const startTime = moment.utc(current.starttime, 'HH:mm');
            const endTime = moment.utc(current.endtime, 'HH:mm');
            const appointmentDate = moment.utc(current.date);
            const monthYear = appointmentDate.format('MMMM YYYY');
            monthsSet.add(monthYear);
    
            // Get the names of the assigned employees for this appointment
            const assignedEmployeeNames = current.assignedEmployees.map(employee => employee.name);
    
            // Ensure that the month and year are represented in the data structure
            if (!acc[monthYear]) {
                acc[monthYear] = {};
            }
    
            // Iterate over each assigned employee
            assignedEmployeeNames.forEach(name => {
                if (!acc[monthYear][name]) {
                    acc[monthYear][name] = { totalHours: 0, details: [] };
                }
    
                if (appointmentDate.isBefore(now)) {
                    const duration = moment.duration(endTime.diff(startTime));
                    const hours = duration.asHours();
                    acc[monthYear][name].totalHours += hours;
                    // Store appointment details for expanded row display
                    acc[monthYear][name].details.push({
                        date: appointmentDate.format('YYYY-MM-DD'),
                        hoursWorked: hours,
                        employeeId: userId, // Or any other identifier you wish to use
                    });
                }
            });
    
            return acc;
        }, {});
    
        // Add all possible months to the months filter
        allMonthsOfYear.forEach(monthYear => monthsSet.add(monthYear));
    
        // Create a filter for the months
        const monthsFilter = Array.from(monthsSet).map(monthYear => ({
            text: monthYear,
            value: monthYear,
        }));
    
        // Set the months filter state
        setMonthsFilter(monthsFilter);
    
        // Transform the accumulated hours into a structure suitable for the table display
        const transformedData = Object.entries(hoursByEmployee).flatMap(([monthYear, employees]) => {
            return Object.entries(employees).map(([name, data]) => {
                if (!name || !data) {
                    console.error('Invalid data structure:', name, data);
                    return; // Skip this entry
                }
                return {
                    key: `${monthYear}-${name}`,
                    name,
                    totalHours: data.totalHours.toFixed(2),
                    months: [{ monthYear, ...data }],
                };
            }).filter(Boolean); // Filter out any undefined entries
        });
        
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