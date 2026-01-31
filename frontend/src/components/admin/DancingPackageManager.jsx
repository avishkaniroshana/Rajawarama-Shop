import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2 } from "lucide-react";
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
  const [editingId, setEditingId] = useState(null);

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

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/api/admin/dancing-package/${editingId}`, data);
        toastSuccess("Dancing package updated successfully");
      } else {
        await api.post("/api/admin/dancing-package", data);
        toastSuccess("Dancing package created successfully");
      }
      fetchPackages();
      resetForm();
    } catch (err) {
      console.error("Operation failed:", err);
      toastError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setValue("name", pkg.name || "");
    setValue("details", pkg.details || "");
    setValue("price", pkg.price || 0);
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

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Dancing Group Packages
      </h2>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-12">
        <div className="px-8 py-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">
            {editingId ? "Edit Dancing Package" : "Create Dancing Package"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the package details carefully before saving
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border px-4 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. Traditional Kandyan Dance Package"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (LKR) *
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="45000"
              step="1000"
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details *
            </label>
            <textarea
              {...register("details")}
              rows={4}
              className="w-full rounded-lg border px-4 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Including 4 Kandian Dancers, 2 Drummers, 4 Jayamangala Gatha girls & Ashtaka..."
            />
            {errors.details && (
              <p className="text-red-500 text-xs mt-1">
                {errors.details.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="md:col-span-3 flex justify-end gap-4 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            >
              {editingId ? "Update Package" : "Create Package"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {packages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No dancing packages found.</p>
          <p className="text-sm text-gray-500 mt-2">
            Create your first package above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Price (LKR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pkg.name}</td>
                  <td className="px-6 py-4">
                    Rs.{" "}
                    {pkg.price?.toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 max-w-xl">
                    <div className="overflow-x-auto">{pkg.details}</div>
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Package"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Package"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DancingPackageManager;

