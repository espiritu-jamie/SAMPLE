import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import AdminAllAppointments from "./pages/admin/adminAllAppointments";
import Front from "./pages/Front"
import HomePage from "./pages/HomePage";
import BusinessHome from "./pages/BusinessHome";
import Login from "./pages/Login";
import NotificationPage from "./pages/NotificationPage";
import Register from "./pages/Register";
import EmployeeAvailabilities from "./pages/employee/EmployeeAvailabilities";
import AdminEmployeeAvailability from "./pages/admin/adminEmployeeAvailability";



import EnterAvailabilityPage from "./pages/employee/EnterAvailability";
import Profile from "./pages/employee/Profile";



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
              path="/"
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
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
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
              path="/Front"
              element={
                <ProtectedRoute>
                  <Front />
                </ProtectedRoute>
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
              <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
