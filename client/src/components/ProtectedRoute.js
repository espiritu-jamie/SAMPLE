// import axios from "axios";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import { hideLoading, showLoading } from "../redux/features/alertSlice";
// import { setUser } from "../redux/features/userSlice";


// export default function ProtectedRoute({ children }) {
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.user);
  
//     useEffect(() => {
//       const getUser = async () => {
//         try {
//           dispatch(showLoading());
//           const {data} = await axios.post(
//             "/api/user/getUserData",
//             { token: localStorage.getItem("token") },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           dispatch(hideLoading());
//           if (data.success) {
//             dispatch(setUser(data.data));
//           } else {
//             localStorage.clear();
//             <Navigate to="/login" />;
//           }
//         } catch (error) {
//           localStorage.clear();
//           dispatch(hideLoading());
//           console.log(error);
//         }
//       };
      
//       if (!user) {
//         getUser();
//       }
//     }, [user, dispatch]);
  
//     if (localStorage.getItem("token")) {
//       return children;
//     } else {
//       return <Navigate to="/login" />;
//     }
//   }
  
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
        return; // Exit early if no token is found
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

          // If user's role is not allowed, navigate away
          if (!allowedRoles.includes(data.data.userRole)) {
            console.log("User role not allowed:", data.data.userRole);
            navigate("/HomePage"); // Consider redirecting to a more appropriate page
            return; // Exit early
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

    // Fetch user data if not already available in the state
    if (!user) {
      getUser();
    }
  }, [user, dispatch, navigate, allowedRoles]);

  // Render children if the user's role is authorized, otherwise navigate to login
  return user && allowedRoles.includes(user.userRole) ? children : <Navigate to="/login" />;
}
