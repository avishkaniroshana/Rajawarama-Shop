import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import RoleBasedProfileLayout from "../layouts/RoleBasedProfileLayout";

// Pages
import Home from "../pages/Home";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

// Service sub-pages
import SpecialPackages from "../pages/services/SpecialPackages";
import DancingGroup from "../pages/services/DancingGroup";
import DressItems from "../pages/services/DressItems";

// Booking pages
import SpecialPackageBooking from "../pages/booking/SpecialPackageBooking";
import DancingPackageBooking from "../pages/booking/DancingPackageBooking";
import MyBookings from "../pages/booking/MyBooking";
import DressOnlyBookingPage from "../pages/booking/DressOnlyBookingPage";

// Admin pages
import AdminDashboard from "../pages/AdminDashboard";
import SpecialPackageManager from "../components/admin/SpecialPackageManager";
import DancingPackageManager from "../components/admin/DancingPackageManager";
import UserManager from "../components/admin/UserManager";
import CategoryManager from "../components/admin/CategoryManager";
import DressItemsManager from "../components/admin/DressItemsManager";
import DancingPerformerTypeManager from "../components/admin/DancingPerformerTypeManager";
import SpecialItemTypeManager from "../components/admin/SpecialItemTypeManager";
import BookingRequestsManager from "../components/admin/BookingRequestsManager";
import DancingBookingRequestsManager from "../components/admin/DancingBookingRequestsManager";
import DressOnlyBookingManager from "../components/admin/DressOnlyBookingManager";
import AdminReportsPage from "../components/admin/AdminReports";


import ProtectedRoute from "./ProtectedRoutes";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ------------------------ Public Routes  */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/services"
        element={
          <MainLayout>
            <Services />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        }
      />
      <Route
        path="/services/special"
        element={
          <MainLayout>
            <SpecialPackages />
          </MainLayout>
        }
      />
      <Route
        path="/services/dancing-group"
        element={
          <MainLayout>
            <DancingGroup />
          </MainLayout>
        }
      />
      <Route
        path="/services/dress-items"
        element={
          <MainLayout>
            <DressItems />
          </MainLayout>
        }
      />

      {/* ------------------------ Auth Routes  */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ------------------------- Protected: Profile (layout depends on role)  */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <RoleBasedProfileLayout>
              <Profile />
            </RoleBasedProfileLayout>
          </ProtectedRoute>
        }
      />

      {/* ------------------------- Protected: Customer Bookings  */}
      <Route
        path="/booking/special-packages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SpecialPackageBooking />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/dancing-packages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DancingPackageBooking />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/dress-only"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DressOnlyBookingPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyBookings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* -------------------------------- Admin Routes  */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <UserManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <CategoryManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dress-items"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <DressItemsManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dancing-performer-types"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <DancingPerformerTypeManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/special-item-types"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <SpecialItemTypeManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dancing-packages"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <DancingPackageManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/special-packages"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <SpecialPackageManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/booking-requests"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <BookingRequestsManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dancing-booking-requests"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <DancingBookingRequestsManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dress-only-bookings"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <DressOnlyBookingManager />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminReportsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/*Catch-all for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
