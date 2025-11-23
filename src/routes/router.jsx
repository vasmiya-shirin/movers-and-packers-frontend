import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import UserLayout from "../layout/UserLayout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import ClientDashboard from "../pages/ClientDashboard";
import ClientBookings from "../pages/ClientBookings";
import EditProfile from "../pages/EditProfile";
import ServicesList from "../pages/ServiceList";
import BookService from "../pages/BookService";
import ServiceDetails from "../pages/ServiceDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import ProviderDashboard from "../pages/ProviderDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Unauthorized from "../pages/Unauthorized";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <h1>Error page</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/client-dashboard",
        element: (
          <ProtectedRoutes allowedRoles={["client"]}>
            <ClientDashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-bookings",
        element: (
          <ProtectedRoutes>
            <ClientBookings />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/services",
        element: (
          <ProtectedRoutes>
            <ServicesList />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/services/:id",
        element: (
          <ProtectedRoutes>
            <ServiceDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/book/:serviceId",
        element: (
          <ProtectedRoutes>
            <BookService />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <ProtectedRoutes>
            <PaymentSuccess />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/provider-dashboard",
        element: (
          <ProtectedRoutes allowedRoles={["provider"]}>
            <ProviderDashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoutes allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);
