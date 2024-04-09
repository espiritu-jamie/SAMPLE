import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const { Option } = Select;

const EmployeeHoursWorked = () => {
    const [pastAppointments, setPastAppointments] = useState([]);
    const [totalHours, setTotalHours] = useState('0.00');
    const [filter, setFilter] = useState('overall');
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek());

    useEffect(() => {
        fetchPastAppointments();
        // Added cleanup function to reset state on unmount
        return () => {
            setPastAppointments([]);
            setTotalHours('0.00');
        };
    }, [filter, selectedYear, selectedMonth, selectedWeek]);

    const fetchPastAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            let apiUrl = '/api/appointment/confirmed-for-employee';
            const params = new URLSearchParams();

            if (filter === 'month' || filter === 'week') {
                params.append('year', selectedYear);
            }
            
            if (filter === 'month') {
                params.append('month', selectedMonth + 1);
            } else if (filter === 'week') {
                params.append('week', selectedWeek);
            }

            if (params.toString()) {
                apiUrl += `?${params.toString()}&userId=${userId}`;
            } else {
                apiUrl += `?userId=${userId}`;
            }

            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const appointmentsData = response.data.data
                .filter(appointment => moment(appointment.date).isBefore(moment()))
                .map(appointment => ({
                    key: appointment._id,
                    date: moment(appointment.date).format('MMM DD, YYYY'),
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

    const handleFilterChange = (value) => setFilter(value);
    const handleYearChange = (value) => setSelectedYear(value);
    const handleMonthChange = (value) => setSelectedMonth(value);
    const handleWeekChange = (value) => setSelectedWeek(value);

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
                <Select defaultValue="overall" style={{ width: 120, marginRight: 16 }} onChange={handleFilterChange}>
                    <Option value="overall">Overall</Option>
                    <Option value="month">Month</Option>
                    <Option value="week">Week</Option>
                </Select>
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
