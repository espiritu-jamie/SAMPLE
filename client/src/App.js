import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import AdminAllAppointments from "./pages/admin/adminAllAppointments";
import Home from "./pages/Home"
import About from "./pages/About"
import HomePage from "./pages/HomePage";
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
import AboutMe from "./pages/About";
import Contact from "./pages/Contact";




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
                <ProtectedRoute allowedRoles={['admin', 'employee', 'general']}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={<About />}
            />
            <Route
              path="/enter-availability"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EnterAvailabilityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-shifts"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeShiftsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-availability"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeAvailabilities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-employee-availability"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEmployeeAvailability />
                </ProtectedRoute>
              }
            />    
            <Route
              path="/admin-schedule-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminScheduleManagement />
                </ProtectedRoute>
              }
            />     
            
           <Route
              path="/admin-all-appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAllAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hours-worked"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHoursTracking />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/notification"
              element={
                <ProtectedRoute allowedRoles={['admin', 'employee', 'general']}>
                  <NotificationPage />
                </ProtectedRoute> // if they are logged in 
              }
            />
            <Route
              path="/book-now"
              element={
                <ProtectedRoute allowedRoles={['general']}>
                  <BookingPage />
                </ProtectedRoute> // if they are logged in 
              }
            />
            
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute allowedRoles={['general']}>
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
              path="/"
              element={
                  <Home />
              }
              />
              <Route
              path="/about"
              element={
                  <AboutMe />
              }
              />
              <Route
              path="/contact"
              element={
                  <Contact />
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
                </ProtectedRoute>
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}
export default App;