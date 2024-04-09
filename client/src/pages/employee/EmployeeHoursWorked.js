import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const { Option } = Select;

const EmployeeHoursWorked = () => {
    // State for storing past appointments, total hours, filter type, and date selections
    const [pastAppointments, setPastAppointments] = useState([]);
    const [totalHours, setTotalHours] = useState('0.00');
    const [filter, setFilter] = useState('overall');
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek());

    // Effect hook to fetch past appointments on component mount and when filter changes
    useEffect(() => {
        fetchPastAppointments();
        return () => {
            setPastAppointments([]);
            setTotalHours('0.00');
        };
    }, [filter, selectedYear, selectedMonth, selectedWeek]);

    // Function to fetch past appointments from the server
    const fetchPastAppointments = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        let apiUrl = '/api/appointment/confirmed-for-employee';
        const params = new URLSearchParams({ userId });
        
        // Append additional parameters to the URL based on the selected filter
        if (filter !== 'overall') {
            params.append('year', selectedYear);
            if (filter === 'month') {
                params.append('month', selectedMonth + 1);
            } // Week filter is handled later
        }
        
        apiUrl += `?${params.toString()}`;
        
        try {
            // Make an HTTP GET request to fetch appointments
            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter out future appointments and further filter based on selected filter
            let appointments = response.data.data.filter(app => moment(app.date).isBefore(moment()));

            // Additional filtering based on the selected filter
            if (filter === 'month') {
                appointments = appointments.filter(app => moment(app.date).month() === selectedMonth && moment(app.date).year() === selectedYear);
            } else if (filter === 'week') {
                appointments = appointments.filter(app => moment(app.date).isoWeek() === selectedWeek && moment(app.date).year() === selectedYear);
            }
            
            // Map appointments to a format suitable for rendering in the table
            const filteredAppointments = appointments.map(app => ({
                key: app._id,
                date: moment(app.date).format('MMM DD, YYYY'),
                starttime: moment(app.starttime, 'HH:mm').format('HH:mm'),
                endtime: moment(app.endtime, 'HH:mm').format('HH:mm'),
                totalHours: calculateTotalHours(app.starttime, app.endtime),
            }));

            // Calculate the total hours from the filtered appointments
            const totalHours = filteredAppointments.length > 0 ? calculateTotalSum(filteredAppointments) : '0.00';
            
            // Update state with the fetched data
            setPastAppointments(filteredAppointments);
            setTotalHours(totalHours);
        } catch (error) {
             // Handle errors and reset total hours if fetching fails
            console.error('Error fetching past appointments:', error);
            setTotalHours('0.00');
        }
    };

    // Function to calculate total hours between start and end times
    const calculateTotalHours = (startTime, endTime) => {
        const start = moment(startTime, 'HH:mm');
        const end = moment(endTime, 'HH:mm');
        const duration = moment.duration(end.diff(start));
        return duration.asHours().toFixed(2); // Ensure the result is in the same format
    };

    // Function to calculate the sum of total hours from all appointments
    const calculateTotalSum = (appointmentsData) => {
        return appointmentsData.reduce((total, appointment) => total + parseFloat(appointment.totalHours), 0).toFixed(2);
    };

    // Handlers for changing filters and triggering a fetch of appointments
    const handleFilterChange = (value) => setFilter(value);
    const handleYearChange = (value) => setSelectedYear(value);
    const handleMonthChange = (value) => {
        // Check if value is not undefined
        if (typeof value !== 'undefined') {
            setSelectedMonth(value);
            // Trigger fetch to update appointments
            fetchPastAppointments();
        }
    }; 
    
    const handleWeekChange = (value) => {
        // Check if value is not undefined
        if (typeof value !== 'undefined') {
            setSelectedWeek(value);
            // Trigger fetch to update appointments
            fetchPastAppointments();
        }
    };

    // Define columns for the antd Table component
    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Start Time', dataIndex: 'starttime', key: 'starttime' },
        { title: 'End Time', dataIndex: 'endtime', key: 'endtime' },
        { title: 'Total Hours Worked', dataIndex: 'totalHours', key: 'totalHours' },
    ];

    // Custom style for the total row in the table
    const totalRowStyle = { fontWeight: 'bold', fontSize: 'larger' };

    // Render the component UI
    return (
        <Layout>
            <div>
                <h2>My Hours</h2>
                <Select defaultValue="overall" style={{ width: 120, marginRight: 16 }} onChange={handleFilterChange}>
                    <Option value="overall">Overall</Option>
                    <Option value="month">Month</Option>
                    <Option value="week">Week</Option>
                </Select>
                {filter === 'month' && (
                    <>
                        <Select defaultValue={selectedYear} style={{ width: 120, marginRight: 16 }} onChange={handleYearChange}>
                        {Array.from({ length: 10 }, (_, index) => moment().year() - index).map(year => (
                            <Option key={year} value={year.toString()}> // Convert year to string if necessary
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
                <Table 
                    columns={columns} 
                    dataSource={pastAppointments} 
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
