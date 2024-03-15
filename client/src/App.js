import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import AdminAllAppointments from "./pages/admin/adminAllAppointments";
import Home from "./pages/Home"
import HomePage from "./pages/HomePage";
import BusinessHome from "./pages/BusinessHome";
import Login from "./pages/Login";
import NotificationPage from "./pages/NotificationPage";
import Register from "./pages/Register";
import EmployeeAvailabilities from "./pages/employee/EmployeeAvailabilities";
import AdminEmployeeAvailability from "./pages/admin/adminEmployeeAvailability";
import AdminScheduleManagement from "./pages/admin/adminScheduleManagement";
import EmployeeShiftsPage from "./pages/employee/EmployeeShifts";
import EnterAvailabilityPage from "./pages/employee/EnterAvailability";
import BookingPage from "./pages/customer/BookingPage";
import CustomerAppointments from "./pages/customer/CustomerAppointments";




function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/HomePage"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/enter-availability"
              element={
                <ProtectedRoute>
                  <EnterAvailabilityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-shifts"
              element={
                <ProtectedRoute>
                  <EmployeeShiftsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-availability"
              element={
                <ProtectedRoute>
                  <EmployeeAvailabilities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-employee-availability"
              element={
                <ProtectedRoute>
                  <AdminEmployeeAvailability />
                </ProtectedRoute>
              }
            />    
            <Route
              path="/admin-schedule-management"
              element={
                <ProtectedRoute>
                  <AdminScheduleManagement />
                </ProtectedRoute>
              }
            />     
            
           <Route
              path="/admin-all-appointments"
              element={
                <ProtectedRoute>
                  <AdminAllAppointments />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/notification"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute> // if they are logged in 
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute> // if they are logged in 
              }
            />
            
            <Route
              path="/customer-appointments"
              element={
                <ProtectedRoute>
                  <CustomerAppointments />
                </ProtectedRoute> // if they are logged in 
              }

            />
            <Route
              path="/login"
              element={

                  <Login />

              }
            />
            <Route 
            path="/BusinessHome"
            element={
              <PublicRoute>
                <BusinessHome />
              </PublicRoute>
            }
            />
            <Route
              path="/"
              element={
                  <Home />
              }
              />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
