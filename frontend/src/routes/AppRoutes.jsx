import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Packages from "../pages/Packages";
import Booking from "../pages/Booking";
import Contact from "../pages/Contact";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoutes";
import AdminProtectedRoute from "./AdminProtectedRoute";

import AdminDashboard from "../pages/AdminDashboard";
import SpecialPackageManager from "../components/admin/SpecialPackageManager";
import DancingPackageManager from "../components/admin/DancingPackageManager";
import UserManager from "../components/admin/UserManager";
import CategoryManager from "../components/admin/CategoryManager";
import DressItemsManager from "../components/admin/DressItemsManager";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected User Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

//11111111111111111111111111111111111111111111111111111111111111111111

// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import Services from "../pages/Services";
// import Packages from "../pages/Packages";
// import Booking from "../pages/Booking";
// import Contact from "../pages/Contact";
// import SignIn from "../pages/SignIn";
// import SignUp from "../pages/SignUp";
// import Profile from "../pages/Profile";
// import NotFound from "../pages/NotFound";

// import ProtectedRoute from "./ProtectedRoutes";
// import AdminProtectedRoute from "./AdminProtectedRoute";

// import AdminDashboard from "../pages/AdminDashboard";
// import SpecialPackageManager from "../components/admin/SpecialPackageManager";
// import DancingPackageManager from "../components/admin/DancingPackageManager";
// import UserManager from "../components/admin/UserManager";
// import CategoryManager from "../components/admin/CategoryManager";
// import DressItemsManager from "../components/admin/DressItemsManager";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/packages" element={<Packages />} />
//       <Route path="/booking" element={<Booking />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       {/* ADMIN */}
//       <Route
//         path="/admin/dashboard"
//         element={
//           <AdminProtectedRoute>
//             <AdminDashboard />
//           </AdminProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/special-packages"
//         element={
//           <AdminProtectedRoute>
//             <SpecialPackageManager />
//           </AdminProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/dancing-packages"
//         element={
//           <AdminProtectedRoute>
//             <DancingPackageManager />
//           </AdminProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/users"
//         element={
//           <AdminProtectedRoute>
//             <UserManager />
//           </AdminProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/categories"
//         element={
//           <AdminProtectedRoute>
//             <CategoryManager />
//           </AdminProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/dress-items"
//         element={
//           <AdminProtectedRoute>
//             <DressItemsManager />
//           </AdminProtectedRoute>
//         }
//       />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;
