import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div
          className="card-header"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          {doctor.firstName} {doctor.lastName}
        </div>

        <div className="card-body">
          <p>
            <b>Hours Worked:</b> 
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;
