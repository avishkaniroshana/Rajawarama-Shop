import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Tags,
  Shirt,
  Footprints,
  Settings,
} from "lucide-react";

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: "Special Packages",
      description: "Manage Wedding & Premium Packages",
      path: "/admin/special-packages",
      icon: <Package size={28} />,
      color: "from-amber-500 to-yellow-600",
      hoverBg: "hover:bg-amber-50/70",
    },
    {
      title: "Dancing Group Packages",
      description: "Manage Traditional Dance Groups",
      path: "/admin/dancing-packages",
      icon: <Footprints size={28} />,
      color: "from-purple-500 to-indigo-600",
      hoverBg: "hover:bg-purple-50/70",
    },
    {
      title: "User Management",
      description: "View, Manage and Control User Accounts",
      path: "/admin/users",
      icon: <Users size={28} />,
      color: "from-blue-500 to-cyan-600",
      hoverBg: "hover:bg-blue-50/70",
    },
    {
      title: "Category Management",
      description: "Create and Manage Dress Categories",
      path: "/admin/categories",
      icon: <Tags size={28} />,
      color: "from-emerald-500 to-teal-600",
      hoverBg: "hover:bg-emerald-50/70",
    },
    {
      title: "Dress Items",
      description: "Add, Update and Manage Dress Items",
      path: "/admin/dress-items",
      icon: <Shirt size={28} />,
      color: "from-red-500 to-pink-600",
      hoverBg: "hover:bg-red-50/70",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-500 to-brown-600 tracking-tight drop-shadow-sm">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-xm text-gray-700 max-w-3xl mx-auto md:mx-0 leading-relaxed">
          Manage your entire platform from one central hub — Packages, Users,
          Categories, Dresses, and more.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {dashboardItems.map((item, index) => (
          <Link
            key={item.title}
            to={item.path}
            className={`group relative bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] ${item.hoverBg}`}
            style={{
              animationDelay: `${index * 80}ms`,
              animation: "fadeInUp 0.7s ease-out forwards",
            }}
          >
            {/* Gradient Top Accent */}
            <div
              className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="p-8">
              {/* Icon with gradient background */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed">
                {item.description}
              </p>

              {/* Subtle arrow on hover */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white shadow-md text-lg font-bold">
                  →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Rajawarama Admin Panel
      </div>
    </div>
  );
};

export default AdminDashboard;
