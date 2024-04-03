import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';

const AdminHoursTracking = () => {
    const [hoursWorked, setHoursWorked] = useState([]);

    useEffect(() => {
        fetchHoursWorked();
    }, []);

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

    const calculateHoursWorked = (availabilities) => {
        const hoursByEmployee = availabilities.reduce((acc, current) => {
            const employeeName = current.user?.name || 'Unknown';
            const startTime = moment.utc(current.starttime, 'HH:mm');
            const endTime = moment.utc(current.endtime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = duration.asHours();

            if (!acc[employeeName]) {
                acc[employeeName] = {
                    totalHours: 0,
                    entries: [],
                };
            }

            acc[employeeName].totalHours += hours;
            acc[employeeName].entries.push({
                date: moment.utc(current.date).format('LL'),
                hoursWorked: hours.toFixed(2),
            });

            return acc;
        }, {});

        setHoursWorked(Object.keys(hoursByEmployee).map(name => ({
            key: name,
            name: name,
            totalHours: hoursByEmployee[name].totalHours.toFixed(2),
            children: hoursByEmployee[name].entries.map((entry, index) => ({
                key: `${name}_${index}`,
                date: entry.date,
                hoursWorked: entry.hoursWorked,
            })),
        })));
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
                <h2>Employee Hours Worked</h2>
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
