import React from 'react';
import ViewAppointments from '../../components/ViewAppointments'; 

const AdminAllAppointments = () => {
  
  return (
    <div>

      <ViewAppointments isAdminView={true} /> 
    </div>
  );
};

export default AdminAllAppointments;
