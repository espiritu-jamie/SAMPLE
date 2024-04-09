// Import necessary React, Ant Design, and utility libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

// Destructure the Option component from the Select component of Ant Design for dropdown options
const { Option } = Select;

// Define the AdminHoursTracking component
const AdminHoursTracking = () => {
    // State for storing the hours worked data
    const [hoursWorked, setHoursWorked] = useState([]);
    // State for the current filter type (overall, month, week)
    const [filter, setFilter] = useState('overall'); // Set 'overall' as the default filter
    // State for the selected year, month, and week for filtering
    const [selectedYear, setSelectedYear] = useState(moment().year()); // Default to current year
    const [selectedMonth, setSelectedMonth] = useState(moment().month()); // Default to current month
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek()); // Default to current ISO week

    // Columns for the Ant Design Table component
    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Total Hours Worked',
            dataIndex: filter === 'overall' ? 'overall' : 'totalHours',
            key: filter === 'overall' ? 'overall' : 'totalHours',
            // Custom sorter based on the current filter
            sorter: (a, b) => {
                if (filter === 'overall') {
                    return a.overall - b.overall;
                } else {
                    return a.totalHours - b.totalHours;
                }
            },
        },
    ];

    // Effect hook to fetch and process data when filter or date changes
    useEffect(() => {
        // Async function to fetch hours worked data
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Get auth token from local storage
            let apiUrl = `/api/appointment/confirmed-appointments`; // Base API URL
            // Append year, month, or week to the URL based on the current filter
            if (filter !== 'overall') {
                const params = new URLSearchParams();
        
                params.append('year', selectedYear);
        
                if (filter === 'month') {
                    params.append('month', selectedMonth + 1); // Add 1 since moment.js months are 0-indexed
                } else if (filter === 'week') {
                    params.append('week', selectedWeek);
                }
        
                apiUrl += `?${params.toString()}`; // Append query parameters to the API URL
            }
        
            try {
                // Make GET request to the API and process response
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` }, // Set authorization header
                });
                calculateHoursWorked(response.data.data); // Process data
            } catch (error) {
                console.error('Error fetching hours worked:', error);
                setHoursWorked([]); // Reset hours worked on error
            }
        };
        fetchData();
    }, [filter, selectedYear, selectedMonth, selectedWeek]); // Re-run effect when these dependencies change

    // Function to process and calculate hours worked from appointment data
    const calculateHoursWorked = (appointments) => {
        const now = moment();
        const hoursByEmployee = {};
    
        appointments.forEach(appointment => {
            const appointmentDate = moment.utc(appointment.date);
            if (appointmentDate.isAfter(now)) {
                return; // Skip future appointments
            }
    
            const startTime = moment.utc(appointment.starttime, 'HH:mm');
            const endTime = moment.utc(appointment.endtime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
    
            // Use the getPeriod function to get the key for each appointment date
            const periodKey = getPeriod(appointmentDate.year(), appointmentDate.month(), appointmentDate.isoWeek());
    
            appointment.assignedEmployees.forEach(employee => {
                const userId = employee._id.toString();
                const userName = employee.name;
    
                if (!hoursByEmployee[userId]) {
                    hoursByEmployee[userId] = {
                        name: userName,
                        overall: 0,
                        byPeriod: {}
                    };
                }
    
                if (!hoursByEmployee[userId].byPeriod[periodKey]) {
                    hoursByEmployee[userId].byPeriod[periodKey] = 0;
                }
    
                // Accumulate total hours and hours for the specific period
                hoursByEmployee[userId].overall += hours;
                hoursByEmployee[userId].byPeriod[periodKey] += hours;
            });
        });
    
        // Transform data to array format expected by Ant Design Table
        const transformedData = Object.keys(hoursByEmployee).map(userId => {
            const userHours = hoursByEmployee[userId];
            // Use the current filter settings to determine the period key for totals
            const currentPeriodKey = getPeriod(selectedYear, selectedMonth, selectedWeek);
    
            const totalHoursForPeriod = userHours.byPeriod[currentPeriodKey]
                ? userHours.byPeriod[currentPeriodKey].toFixed(2)
                : '0.00'; // Provide a default value of '0.00' if no hours exist for the period
    
            return {
                key: userId,
                name: userHours.name,
                overall: userHours.overall.toFixed(2),
                totalHours: totalHoursForPeriod,
            };
        });
    
        setHoursWorked(transformedData); // Update state with processed data
    };
    
    // Function to return a string representing the period based on the selected filter
    const getPeriod = (year, month, week) => {
        if (filter === 'month') {
            return `${moment().month(month).format('MMMM')} ${year}`;
        } else if (filter === 'week') {
            return `Week ${week} of ${year}`;
        } else {
            return 'overall';
        }
    };

    // Handlers to update state when the user changes filter options
    const handleFilterChange = (value) => {
        setHoursWorked([]);
        setFilter(value);
    };

    const handleYearChange = (value) => {
        setHoursWorked([]);
        setSelectedYear(value);
    };

    const handleMonthChange = (value) => {
        setHoursWorked([]);
        setSelectedMonth(value);
    };

    const handleWeekChange = (value) => {
        setHoursWorked([]);
        setSelectedWeek(value);
    };

    // Render the component UI
    return (
        <Layout>
            <div>
                <h2>Employee Hours Tracker</h2>
                <Select defaultValue="overall" style={{ width: 120, marginRight: 16 }} onChange={handleFilterChange}>
                    <Option value="overall">Overall</Option>
                    <Option value="month">Month</Option>
                    <Option value="week">Week</Option>
                </Select>
                {/* Conditionally render year, month, and week selectors based on the current filter */}
                {filter === 'month' && (
                    <>
                        <Select defaultValue={moment().year()} style={{ width: 120, marginRight: 16 }} onChange={handleYearChange}>
                            {Array.from({ length: 10 }, (_, index) => moment().year() - index).map(year => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    
                        <Select defaultValue={moment().month()} style={{ width: 120, marginRight: 16 }} onChange={handleMonthChange}>
                            {moment.months().map((month, index) => (
                                <Option key={index} value={index}>
                                    {moment().month(index).format('MMM')}
                                </Option>
                            ))}
                        </Select>
                    </>
                )}
                {filter === 'week' && (
                    <>
                        <Select defaultValue={moment().year()} style={{ width: 120, marginRight: 16 }} onChange={handleYearChange}>
                            {Array.from({ length: 10 }, (_, index) => moment().year() - index).map(year => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                        <Select defaultValue={moment().isoWeek()} style={{ width: 120 }} onChange={handleWeekChange}>
                            {Array.from({ length: moment().isoWeeksInYear() }, (_, index) => index + 1).map(week => (
                                <Option key={week} value={week}>
                                    Week {week}
                                </Option>
                            ))}
                        </Select>
                    </>
                )}
                <Table columns={columns} dataSource={hoursWorked} />
            </div>
        </Layout>
    );
};

// Export the component for use in other parts of the application
export default AdminHoursTracking;