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

const specialPackageSchema = z.object({
  name: z.string().min(1, "Package name is required!"),

  description: z.string().min(1, "Description is required!"),

  freeOfChargeItems: z.string().optional(),

  price: z
    .number({ invalid_type_error: "Price is required in numbers!" })
    .positive("Price must be greater than 0!"),

  discountPercentage: z
    .number({ invalid_type_error: "Discount is required in numbers!" })
    .min(0, "Discount cannot be negative!")
    .max(100, "Discount cannot exceed 100!"),
});


const SpecialPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [visibleIds, setVisibleIds] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(specialPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      freeOfChargeItems: "",
      price: 0,
      discountPercentage: 0,
    },
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/api/admin/special-package");
      setPackages(res.data);
    } catch {
      toastError("Failed to load packages");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/api/admin/special-package/${editingId}`, data);
        toastSuccess("Package updated");
      } else {
        await api.post("/api/admin/special-package", data);
        toastSuccess("Package created");
      }
      fetchPackages();
      resetForm();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
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
      await api.delete(`/api/admin/special-package/${id}`);
      toastSuccess("Package deleted successfully!");
      fetchPackages();
    } catch (err) {
      toastError("Delete failed");
    }
  }
};


  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setValue("name", pkg.name || "");
    setValue("description", pkg.description || "");
    setValue("freeOfChargeItems", pkg.freeOfChargeItems || "");
    setValue("price", pkg.price || 0);
    setValue("discountPercentage", pkg.discountPercentage || 0);
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Special Packages
      </h2>

      {/* Modern Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-12">
        {/* Header */}
        <div className="px-8 py-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">
            {editingId ? "Edit Special Package" : "Create Special Package"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the package details carefully before saving
          </p>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border px-4 py-2.5  border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Kandyan Wedding Premium"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Free Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free of Charge Items
            </label>
            <input
              type="text"
              {...register("freeOfChargeItems")}
              className="w-full rounded-lg border px-4 py-2.5  border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Kandyan cap, Flower set"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rs.) *
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-2.5  border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="250000"
              step="1000"
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%) *
            </label>
            <input
              type="number"
              {...register("discountPercentage", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-2.5  border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
              step="0.5"
              min="0"
            />
            {errors.discountPercentage && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discountPercentage.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              {...register("description")}
              className="w-full rounded-lg border px-4 py-3  border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Describe what is included in this special package..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-4 pt-4">
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
      <div className="bg-white shadow-lg rounded-xl overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Free Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Price (Rs.)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Price without Transport
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">
                  <button
                    onClick={() => toggleIdVisibility(pkg.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {visibleIds[pkg.id] ? "Hide ID" : "Show ID"}
                  </button>
                  {visibleIds[pkg.id] && (
                    <div className="mt-2 break-all text-gray-600 text-xs">
                      {pkg.id}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{pkg.name}</td>
                <td className="px-6 py-4">{pkg.description}</td>
                <td className="px-6 py-4">{pkg.freeOfChargeItems || "-"}</td>
                <td className="px-6 py-4">
                  Rs.{" "}
                  {pkg.price?.toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4">
                  {pkg.discount ?? pkg.discountPercentage}%
                </td>
                <td className="px-6 py-4">
                  Rs.{" "}
                  {pkg.priceWithoutTransport?.toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "-"}
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
            {packages.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecialPackageManager;
