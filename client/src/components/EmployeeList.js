import React from "react";

const EmployeeList = ({ employee, monthlyHoursWorked, totalHoursWorked, navigate }) => {
    return (
        <div
            className="card m-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/employee/book-appointment/${employee._id}`)}
            key={employee._id}
        >
            <div
                className="card-header"
                style={{ textAlign: "center", fontWeight: "bold" }}
            >
                {employee.name}
            </div>

            <div className="card-body">
                <p>
                    <b>Monthly Hours Worked:</b> {monthlyHoursWorked}
                </p>
                <p>
                    <b>Total Hours Worked:</b> {totalHoursWorked}
                </p>
            </div>
        </div>
    );
};

export default EmployeeList;
