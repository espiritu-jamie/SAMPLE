import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const { Option } = Select;

const AdminHoursTracking = () => {
    const [hoursWorked, setHoursWorked] = useState([]);
    const [filter, setFilter] = useState('overall'); // Set 'overall' as the default filter
    const [selectedYear, setSelectedYear] = useState(moment().year()); // Default to current year
    const [selectedMonth, setSelectedMonth] = useState(moment().month()); // Default to current month
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek()); // Default to current ISO week

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
            sorter: (a, b) => {
                if (filter === 'overall') {
                    return a.overall - b.overall;
                } else {
                    return a.totalHours - b.totalHours;
                }
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            let apiUrl = `/api/appointment/confirmed-appointments`;
            if (filter !== 'overall') {
                const params = new URLSearchParams();
        
                params.append('year', selectedYear);
        
                if (filter === 'month') {
                    params.append('month', selectedMonth + 1);
                } else if (filter === 'week') {
                    params.append('week', selectedWeek);
                }
        
                apiUrl += `?${params.toString()}`;
            }
        
            try {
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                calculateHoursWorked(response.data.data);
            } catch (error) {
                console.error('Error fetching hours worked:', error);
                setHoursWorked([]);
            }
        };
        fetchData();
    }, [filter, selectedYear, selectedMonth, selectedWeek]);

    const calculateHoursWorked = (appointments) => {
        const now = moment();
        const hoursByEmployee = appointments.reduce((acc, appointment) => {
            const appointmentDate = moment.utc(appointment.date);
            if (appointmentDate.isAfter(now)) {
                return acc;
            }

            const startTime = moment.utc(appointment.starttime, 'HH:mm');
            const endTime = moment.utc(appointment.endtime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();

            const period = getPeriod(appointmentDate);

            appointment.assignedEmployees.forEach(employee => {
                const userId = employee._id.toString();
                const userName = employee.name;

                if (!acc[userId]) {
                    acc[userId] = {
                        name: userName,
                        totalHours: 0,
                        periods: {
                            month: {},
                            week: {},
                            overall: { hoursWorked: 0 },
                        },
                    };
                }

                acc[userId].totalHours += hours;
                acc[userId].periods[period].hoursWorked += hours;
            });

            return acc;
        }, {});

        const transformedData = Object.keys(hoursByEmployee).map(userId => ({
            key: userId,
            name: hoursByEmployee[userId].name,
            totalHours: hoursByEmployee[userId].totalHours.toFixed(2),
            months: hoursByEmployee[userId].periods.month,
            weeks: hoursByEmployee[userId].periods.week,
            overall: hoursByEmployee[userId].periods.overall.hoursWorked.toFixed(2),
        }));

        setHoursWorked(transformedData);
    };

    const getPeriod = (date) => {
        if (filter === 'month') {
            return date.format('MMMM YYYY');
        } else if (filter === 'week') {
            return date.startOf('week').format('MMMM DD, YYYY') + ' - ' + date.endOf('week').format('MMMM DD, YYYY');
        } else {
            return 'overall';
        }
    };

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

    return (
        <Layout>
            <div>
                <h2>Employee Hours Tracker</h2>
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
                <Table columns={columns} dataSource={hoursWorked} />
            </div>
        </Layout>
    );
};

export default AdminHoursTracking;
