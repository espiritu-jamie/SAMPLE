import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from '../../components/Layout';
import { Row } from "antd";
import { startOfMonth, endOfMonth } from "date-fns";
import EmployeeList from '../../components/EmployeeList'; // Import EmployeeList component

const HourTracker = () => {
    const [employees, setEmployees] = useState([]);
    const [monthlyHoursWorked, setMonthlyHoursWorked] = useState({});
    const [totalHoursWorked, setTotalHoursWorked] = useState({});
    
    const getEmployeeData = async () => {
        try {
            const response = await axios.get(
                "api/user/getAllEmployees",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEmployeeData();
    }, []);

    const navigate = useNavigate();

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
        return duration;
    };

    useEffect(() => {
        const getEmployeeAppointments = async (employee) => {
            try {
                const response = await axios.get(
                    "api/appointments",
                    {
                        params: {
                            employeeId: employee._id,
                            startDate: startOfMonth(new Date()),
                            endDate: endOfMonth(new Date()),
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                if (response.data.success) {
                    const appointments = response.data.data;
                    let totalHours = 0;
                    let monthlyHours = 0;
                    appointments.forEach(appointment => {
                        totalHours += calculateDuration(appointment.startTime, appointment.endTime);
                        if (new Date(appointment.startTime) >= startOfMonth(new Date()) &&
                            new Date(appointment.endTime) <= endOfMonth(new Date())) {
                            monthlyHours += calculateDuration(appointment.startTime, appointment.endTime);
                        }
                    });
                    setMonthlyHoursWorked(prevState => ({
                        ...prevState,
                        [employee._id]: monthlyHours,
                    }));
                    setTotalHoursWorked(prevState => ({
                        ...prevState,
                        [employee._id]: totalHours,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        employees.forEach(employee => {
            getEmployeeAppointments(employee);
        });
    }, [employees]);

    return (
        <Layout>
            <h3 className="text-center">Hour Tracker</h3>
            <br/>
            <Row>
                {employees.map((employee) => (
                    <EmployeeList
                        key={employee._id}
                        employee={employee}
                        monthlyHoursWorked={monthlyHoursWorked[employee._id] || 0}
                        totalHoursWorked={totalHoursWorked[employee._id] || 0}
                        navigate={navigate}
                    />
                ))}
            </Row>
        </Layout>
    );
};

export default HourTracker;