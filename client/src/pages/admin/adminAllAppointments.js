import React from 'react';
import ViewAppointments from '../../components/ViewAppointments'; // Adjust the import path as needed

const AdminAllAppointments = () => {
  
  return (
    <div>

      <ViewAppointments isAdminView={true} /> 
    </div>
  );
};

export default AdminAllAppointments;
