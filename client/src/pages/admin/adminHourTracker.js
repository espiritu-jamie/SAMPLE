import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from '../../components/Layout';
import { Row } from "antd";
import EmployeeList from "../../components/EmployeeList";

const HourTracker = () => {
    const [employees, setEmployees] = useState([]);
    const [monthlyHoursWorked, setMonthlyHoursWorked] = useState({});
    const [totalHoursWorked, setTotalHoursWorked] = useState({});

    const getAllEmployees = async () => {
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

    const calculateTotalHours = async () => {
        employees.forEach(async employee => {
            try {
                const totalHoursResponse = await axios.get(
                    `api/hour-tracker/calculateHoursWorked/${employee._id}`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                const monthlyHoursResponse = await axios.get(
                    `api/hour-tracker/calculateMonthlyHoursWorked/${employee._id}`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                if (totalHoursResponse.data.success && monthlyHoursResponse.data.success) {
                    setTotalHoursWorked(prevState => ({
                        ...prevState,
                        [employee._id]: totalHoursResponse.data.totalHours,
                    }));
                    setMonthlyHoursWorked(prevState => ({
                        ...prevState,
                        [employee._id]: monthlyHoursResponse.data.monthlyHours,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        });
    };

    useEffect(() => {
        getAllEmployees();
    }, []);

    useEffect(() => {
        calculateTotalHours();
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
                    />
                ))}
            </Row>
        </Layout>
    );
};

export default HourTracker;