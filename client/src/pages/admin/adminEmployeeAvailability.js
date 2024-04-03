import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Radio } from 'antd';
import Layout from '../../components/Layout';
import MyCalendar from '../../components/MyCalendar';
import moment from 'moment';

const AdminEmployeeAvailability = () => {
    const [availabilities, setAvailabilities] = useState([]);
    const [sortMode, setSortMode] = useState('byEmployee');

    useEffect(() => {
        fetchAvailabilities();
    }, [sortMode]);

    const fetchAvailabilities = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/availability', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvailabilities(response.data.data);
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        }
    };

    const getSortedAvailabilitiesByEmployee = () => {
        const groupedByEmployee = availabilities.reduce((acc, current) => {
            const employeeName = current.user?.name || 'Unknown';
            if (!acc[employeeName]) {
                acc[employeeName] = [];
            }
            acc[employeeName].push(current);
            return acc;
        }, {});

        const sortedEmployeeNames = Object.keys(groupedByEmployee).sort();

        return sortedEmployeeNames.map(name => ({
            key: name,
            name: name,
            children: groupedByEmployee[name].map((availability, index) => ({
                key: `${name}_${index}`,
                date: moment.utc(availability.date).format('LL'),
                starttime: moment(availability.starttime, 'HH:mm').format('hh:mm A'),
                endtime: moment(availability.endtime, 'HH:mm').format('hh:mm A'),
            })),
        }));
    };

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
            // Sort dates using moment.js by converting them to UNIX timestamps
        },
        {
            title: 'Start Time',
            dataIndex: 'starttime',
            key: 'starttime',
        },
        {
            title: 'End Time',
            dataIndex: 'endtime',
            key: 'endtime',
        },
    ];

    return (
        <Layout>
            <div>
                <h2>Employee Availabilities</h2>
                <Radio.Group defaultValue="byEmployee" style={{ marginBottom: 20 }} onChange={e => setSortMode(e.target.value)}>
                    <Radio.Button value="byEmployee">List</Radio.Button>
                    <Radio.Button value="byDate">Calendar</Radio.Button>
                </Radio.Group>
                {sortMode === 'byDate' ? (
                    <MyCalendar events={availabilities.map(availability => {
                        // Directly use moment.utc to handle the date in UTC
                        const eventDateStart = moment.utc(availability.date);
                        const eventDateEnd = moment.utc(availability.date);

                        // Adjust the time part using UTC methods
                        const start = eventDateStart.add(moment.duration(availability.starttime)).toISOString();
                        const end = eventDateEnd.add(moment.duration(availability.endtime)).toISOString();

                        return {
                            title: `${availability.user?.name}: ${moment.utc(availability.starttime, 'HH:mm').format('hh:mm A')} - ${moment.utc(availability.endtime, 'HH:mm').format('hh:mm A')}`,
                            start: start,
                            end: end,
                            allDay: false,
                        };
                    })} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={getSortedAvailabilitiesByEmployee()}
                        expandable={{
                            rowExpandable: record => record.children && record.children.length > 0,
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default AdminEmployeeAvailability;