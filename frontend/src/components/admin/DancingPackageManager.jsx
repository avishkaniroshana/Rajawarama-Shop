import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const dancingPackageSchema = z.object({
  name: z.string().min(1, "Package name is required!"),
  details: z.string().min(1, "Package details are required!"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),
});

const DancingPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dancingPackageSchema),
    defaultValues: {
      name: "",
      details: "",
      price: 0,
    },
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/api/admin/dancing-package");
      setPackages(res.data || []);
    } catch (err) {
      console.error("Failed to load dancing packages:", err);
      toastError("Failed to load dancing packages");
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setValue("name", pkg.name || "");
      setValue("details", pkg.details || "");
      setValue("price", pkg.price || 0);
    } else {
      setEditingPackage(null);
      reset();
    }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingPackage) {
        await api.put(`/api/admin/dancing-package/${editingPackage.id}`, data);
        toastSuccess("Dancing package updated successfully");
      } else {
        await api.post("/api/admin/dancing-package", data);
        toastSuccess("Dancing package created successfully");
      }
      setModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error("Operation failed:", err);
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dancing-package/${id}`);
        toastSuccess("Dancing package deleted successfully!");
        fetchPackages();
      } catch (err) {
        console.error("Delete failed:", err);
        toastError("Failed to delete package");
      }
    }
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Dancing Group Packages
          </h1>
          <p className="text-gray-600 mt-3 text-xm">
            Manage Traditional Dance Group Packages for Events
          </p>
          <br />
          <button
            onClick={() => openModal()}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
          >
            <Plus size={20} /> Add New Package
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Price (LKR)
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Details
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    No dancing packages found. Add your first package above.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    <td className="px-8 py-6 text-gray-600 font-mono text-sm">
                      {!visibleIds[pkg.id] ? (
                        <button
                          onClick={() => toggleIdVisibility(pkg.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                        >
                          Show ID
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleIdVisibility(pkg.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                          >
                            Hide ID
                          </button>
                          <div className="mt-2 break-all text-gray-500 text-xs">
                            {pkg.id}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-900">
                      {pkg.name}
                    </td>
                    <td className="px-8 py-6 text-gray-700">
                      Rs. {pkg.price?.toLocaleString("en-LK") || "0"}
                    </td>
                    <td className="px-8 py-6 text-gray-600 max-w-xs truncate">
                      {pkg.details || "—"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal(pkg)}
                          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                          title="Edit Package"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                          title="Delete Package"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================== MODAL ======================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingPackage ? (
                  <>
                    <Edit2 size={24} className="text-indigo-600" /> Edit Dancing
                    Package
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-indigo-600" /> Add New
                    Dancing Package
                  </>
                )}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-8 py-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="e.g. Traditional Kandyan Dance Package"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="45000"
                    step="1000"
                    min="0"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("details")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all resize-none"
                  placeholder="Including 4 Kandyan Dancers, 2 Drummers, 4 Jayamangala Gatha girls & Ashtaka..."
                />
                {errors.details && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.details.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-5 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-10 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium shadow-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className={`px-12 py-3.5 rounded-xl font-semibold text-white shadow-xl flex items-center gap-3 transition-all ${
                    loading || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : editingPackage
                        ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 hover:shadow-2xl"
                        : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:shadow-2xl"
                  }`}
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : editingPackage ? (
                    "Update Package"
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DancingPackageManager;

