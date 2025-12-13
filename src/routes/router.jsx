import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import UserLayout from "../layout/UserLayout";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import ClientDashboard from "../features/client/pages/ClientDashboard";
import ClientBookings from "../features/client/pages/ClientBookings";
import EditProfile from "../features/client/pages/EditProfile";
import ServiceList from "../features/services/pages/ServiceList";
import BookService from "../features/services/pages/BookService";
import ServiceDetails from "../features/services/pages/ServiceDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import ProviderDashboard from "../features/provider/pages/ProviderDashboard";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import Unauthorized from "../pages/Unauthorized";
import PendingApproval from "../features/admin/pages/PendingApproval";
import About from "../pages/About";
import Contact from "../pages/Contact";
import EditService from "../features/services/pages/EditService";
import AdminInbox from "../features/admin/pages/AdminInbox";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import VerifyOTP from "../features/auth/pages/VerifyOTP";

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
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
       {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
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
            <ServiceList />
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
        path: "/pending-approval",
        element: <PendingApproval />,
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
        path: "/admin/services/edit/:id",
        element: (
          <ProtectedRoutes allowedRoles={["admin","provider"]}>
            <EditService />
          </ProtectedRoutes>
        ),
      },
        {
        path: "/admin/contact-messages",
        element: (
          <ProtectedRoutes >
            <AdminInbox />
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
