import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Tags,
  Shirt,
  Footprints,
  Music2,
  ClipboardList,
  Crown,
} from "lucide-react";

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: "Special Packages Management",
      description: "Premium wedding & ceremonial bundles",
      path: "/admin/special-packages",
      icon: <Package size={32} />,
      color: "from-amber-500 via-yellow-500 to-orange-600",
      accent: "amber",
    },
    {
      title: "Dancing Group Packages Management",
      description: "Traditional Kandyan & cultural dance troupes",
      path: "/admin/dancing-packages",
      icon: <Footprints size={32} />,
      color: "from-purple-600 via-violet-600 to-indigo-700",
      accent: "purple",
    },
    {
      title: "User Management",
      description: "Control all customer and admin accounts",
      path: "/admin/users",
      icon: <Users size={32} />,
      color: "from-blue-600 to-cyan-600",
      accent: "blue",
    },
    {
      title: "Category Management",
      description: "Organize dress and service categories",
      path: "/admin/categories",
      icon: <Tags size={32} />,
      color: "from-emerald-500 to-teal-600",
      accent: "emerald",
    },
    {
      title: "Dress Items Management",
      description: "Manage traditional attire inventory",
      path: "/admin/dress-items",
      icon: <Shirt size={32} />,
      color: "from-rose-500 to-pink-600",
      accent: "rose",
    },
    {
      title: "Special-Packages Bookings Management",
      description: "Review and process special package requests",
      path: "/admin/booking-requests",
      icon: <ClipboardList size={32} />,
      color: "from-red-600 to-rose-700",
      accent: "red",
    },
    {
      title: "Dancing-Group Bookings Management",
      description: "Manage dance group booking requests",
      path: "/admin/dancing-booking-requests",
      icon: <Music2 size={32} />,
      color: "from-violet-600 to-purple-700",
      accent: "violet",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-['DM_Sans']">
      {/* Elegant Header */}
      <div className="relative bg-gradient-to-br from-[#1C1008] via-[#2C1A10] to-[#1C1008] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(201,168,76,0.12)_0%,transparent_50%)]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Crown className="text-[#C9A84C]" size={28} />
            <span className="uppercase tracking-[4px] text-xs font-medium text-amber-300">
              Admin Pannel
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-none mb-4">
            Welcome back, <span className="text-[#C9A84C]">Admin</span>
          </h1>
          
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.path}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-white/60 overflow-hidden transition-all duration-500 hover:-translate-y-3"
              style={{
                animationDelay: `${index * 60}ms`,
              }}
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${item.color}`} />

              <div className="p-8 pb-10">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-[#1C1008] mb-3 group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </h3>

                <p className="text-[#7A6555] leading-relaxed text-[15.5px] mb-8">
                  {item.description}
                </p>

                {/* Action Button Style */}
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A84C] group-hover:gap-3 transition-all">
                  Manage Now
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>

              {/* Subtle Bottom Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[#C4B5A8] tracking-widest">
            RAJAWARAMA • TRADITIONAL WEDDING SERVICES •{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
