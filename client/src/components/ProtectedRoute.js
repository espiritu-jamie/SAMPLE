import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children, allowedRoles }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        dispatch(showLoading());
        const { data } = await axios.post(
          "/api/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());

        if (data.success) {
          dispatch(setUser(data.data));
          navigate("/HomePage");

          if (!allowedRoles.includes(data.data.userRole)) {
            console.log("User role not allowed:", data.data.userRole);
            navigate("/HomePage"); 
            return; 
          }
        } else {
          throw new Error("Fetching user data was not successful.");
        }
      } catch (error) {
        console.error(error);
        localStorage.clear();
        dispatch(hideLoading());
        navigate("/login");
      }
    };

    if (!user) {
      getUser();
    }
  }, [user, dispatch, navigate, allowedRoles]);

  return user && allowedRoles.includes(user.userRole) ? children : <Navigate to="/login" />;
}
