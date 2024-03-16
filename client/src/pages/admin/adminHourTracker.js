import React, { useEffect, useState } from "react";
import Layout from '../../components/Layout';
import EmployeeList from '../../components/EmployeeList';
import axios from "axios";
import { Row } from "antd";

const HourTracker = () => {
    const [employees, setEmployees] = useState([]);
    
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

    return (
        <Layout>
            <h3 className="text-center">Hour Tracker</h3>
            <br/>
            <Row>
                {employees.map((employee) => (
                    <EmployeeList key={employee._id} employee={employee} />
                ))}
            </Row>
        </Layout>
    );
};

export default HourTracker;