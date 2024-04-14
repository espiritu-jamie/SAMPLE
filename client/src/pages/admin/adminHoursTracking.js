import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const { Option } = Select;

const AdminHoursTracking = () => {
    const [hoursWorked, setHoursWorked] = useState([]);
    const [filter, setFilter] = useState('overall'); 
    const [selectedYear, setSelectedYear] = useState(moment().year()); 
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek());

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
                console.log("response: ", response);
                console.log("response: ", response.data.data);
                console.log("in here");
            } catch (error) {
                console.error('Error fetching hours worked:', error);
                setHoursWorked([]); 
            }
        };
        fetchData();
    }, [filter, selectedYear, selectedMonth, selectedWeek]); 

    const calculateHoursWorked = (appointments) => {
        const now = moment();
        const hoursByEmployee = {};

        console.log(appointments);
    
        appointments.forEach(appointment => {
            const appointmentDate = moment.utc(appointment.date);
            if (appointmentDate.isAfter(now)) {
                return; 
            }
    
            const startTime = moment.utc(appointment.starttime, 'HH:mm');
            const endTime = moment.utc(appointment.endtime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();
    
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
    
                hoursByEmployee[userId].overall += hours;
                hoursByEmployee[userId].byPeriod[periodKey] += hours;
            });
        });

        const transformedData = Object.keys(hoursByEmployee).map(userId => {
            const userHours = hoursByEmployee[userId];
            const currentPeriodKey = getPeriod(selectedYear, selectedMonth, selectedWeek);
    
            const totalHoursForPeriod = userHours.byPeriod[currentPeriodKey]
                ? userHours.byPeriod[currentPeriodKey].toFixed(2)
                : '0.00'; 
    
            return {
                key: userId,
                name: userHours.name,
                overall: userHours.overall.toFixed(2),
                totalHours: totalHoursForPeriod,
            };
        });
    
        setHoursWorked(transformedData); 
    };
    
    const getPeriod = (year, month, week) => {
        if (filter === 'month') {
            return `${moment().month(month).format('MMMM')} ${year}`;
        } else if (filter === 'week') {
            return `Week ${week} of ${year}`;
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