import { Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AdminLayout from "../layouts/adminLayout";
import Dashboard from "../pages/admin/dashboard";
import AdminNotFound from "../pages/admin/notFound";

const adminRoutes = {
  path: "/admin",
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <Navigate to="/admin/index/dashboard" replace={true} />,
    },
    {
      path: "index",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/index/dashboard" replace={true} />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "*",
      element: <AdminNotFound />,
    },
  ],
};

export default adminRoutes;
