import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

// ---------------------------------------- Service sub-pages 
import SpecialPackages from "../pages/services/SpecialPackages";
import DancingGroup from "../pages/services/DancingGroup";
import DressItems from "../pages/services/DressItems";

// Booking pages
import SpecialPackageBooking from "../pages/booking/SpecialPackageBooking";
import DancingPackageBooking from "../pages/booking/DancingPackageBooking";
import MyBookings from "../pages/booking/MyBooking";

import ProtectedRoute from "./ProtectedRoutes";
import AdminProtectedRoute from "./AdminProtectedRoute";

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ── Service Sub-pages (matches Header nav links) ── */}
      <Route path="/services/special" element={<SpecialPackages />} />
      <Route path="/services/dancing-group" element={<DancingGroup />} />
      <Route path="/services/dress-items" element={<DressItems />} />

      {/* ── Protected User Routes ── */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/special-packages"
        element={
          <ProtectedRoute>
            <SpecialPackageBooking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* ── Protected Admin Routes ── */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/special-packages"
        element={
          <AdminProtectedRoute>
            <SpecialPackageManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dancing-packages"
        element={
          <AdminProtectedRoute>
            <DancingPackageManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <UserManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminProtectedRoute>
            <CategoryManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dress-items"
        element={
          <AdminProtectedRoute>
            <DressItemsManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dancing-performer-types"
        element={
          <AdminProtectedRoute>
            <DancingPerformerTypeManager />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/special-item-types"
        element={
          <AdminProtectedRoute>
            <SpecialItemTypeManager />
          </AdminProtectedRoute>
        }
      />

      {/* Admin: Booking Special Requests */}
      <Route
        path="/admin/booking-requests"
        element={
          <AdminProtectedRoute>
            <BookingRequestsManager />
          </AdminProtectedRoute>
        }
      />

      {/* Customer: Dancing Package Booking */}
      <Route
        path="/booking/dancing-packages"
        element={
          <ProtectedRoute>
            <DancingPackageBooking />
          </ProtectedRoute>
        }
      />

      {/* Admin: Dancing Package Booking Requests */}
      <Route
        path="/admin/dancing-booking-requests"
        element={
          <AdminProtectedRoute>
            <DancingBookingRequestsManager />
          </AdminProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
