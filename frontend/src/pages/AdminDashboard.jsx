import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/special-packages"
          className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold">Special Packages</h2>
          <p className="text-gray-600 mt-2">
            Manage wedding & premium packages
          </p>
        </Link>

        <Link
          to="/admin/dancing-packages"
          className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold">Dancing Group Packages</h2>
          <p className="text-gray-600 mt-2">Manage traditional dance groups</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
