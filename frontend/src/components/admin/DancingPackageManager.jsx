import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2, Minus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const dancingPackageSchema = z.object({
  name: z.string().min(1, "Package name is required!"),
  details: z.string().optional(),
});

const DancingPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [performerTypes, setPerformerTypes] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState({}); // id → quantity
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dancingPackageSchema),
    defaultValues: {
      name: "",
      details: "",
    },
  });

  useEffect(() => {
    fetchPackages();
    fetchPerformerTypes();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/api/admin/dancing-package");
      setPackages(res.data || []);
    } catch (err) {
      toastError("Failed to load dancing packages");
    }
  };

  const fetchPerformerTypes = async () => {
    try {
      const res = await api.get("/api/admin/dancing-performer-types");
      setPerformerTypes(res.data || []);
    } catch (err) {
      toastError("Failed to load performer types");
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setValue("name", pkg.name || "");
      setValue("details", pkg.details || "");

      // Pre-fill selected performers from existing package
      const initial = {};
      pkg.includedPerformers?.forEach((p) => {
        initial[p.id] = p.quantity || 1;
      });
      setSelectedPerformers(initial);
    } else {
      setEditingPackage(null);
      reset();
      setSelectedPerformers({});
    }
    setModalOpen(true);
  };

  const togglePerformer = (id) => {
    setSelectedPerformers((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: 1 };
    });
  };

  const changeQuantity = (id, delta) => {
    setSelectedPerformers((prev) => {
      const current = prev[id] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const performers = Object.entries(selectedPerformers)
        .filter(([_, qty]) => qty > 0)
        .map(([id, quantity]) => ({
          performerTypeId: id,
          quantity,
        }));

      if (performers.length === 0) {
        toastError("Please select at least one performer");
        return;
      }

      const payload = {
        name: data.name,
        performers,
      };

      if (editingPackage) {
        await api.put(`/api/admin/dancing-package/${editingPackage.id}`, payload);
        toastSuccess("Package updated successfully");
      } else {
        await api.post("/api/admin/dancing-package", payload);
        toastSuccess("Package created successfully");
      }

      setModalOpen(false);
      setSelectedPerformers({});
      fetchPackages();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to save package");
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
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dancing-package/${id}`);
        toastSuccess("Package deleted");
        fetchPackages();
      } catch (err) {
        toastError("Failed to delete package");
      }
    }
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.keys(selectedPerformers).length;

  const calculatePreviewTotal = () => {
    return Object.entries(selectedPerformers).reduce((sum, [id, qty]) => {
      const type = performerTypes.find((t) => t.id === id);
      return sum + (type ? qty * type.pricePerUnit : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Dancing Group Packages
          </h1>
          <p className="text-gray-600 text-lg">
            Manage Traditional Dance Group Packages for Events
          </p>
          <br />
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 transition-all font-semibold transform hover:scale-105"
            >
              <Plus size={20} /> Add New Package
            </button>

            <button
              onClick={() =>
                (window.location.href = "/admin/dancing-performer-types")
              }
              className="flex items-center gap-3 px-8 py-4   bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 transition-all font-semibold transform hover:scale-105"
            >
              <Edit2 size={20} /> Manage Dancing Performer's Unit Prices
            </button>
          </div>
        </div>
      </div>

      {/* Packages Table */}
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
                  Total Price (LKR)
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
                    className="hover:bg-indigo-50/50 transition-colors"
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
                    <td className="px-8 py-6 text-gray-700 font-semibold">
                      Rs. {pkg.totalPrice?.toLocaleString("en-LK") || "0"}
                    </td>
                    <td className="px-8 py-6 text-gray-600 max-w-xs whitespace-pre-line">
                      {pkg.details || "—"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openModal(pkg)}
                          className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
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

      {/* CREATE/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-8 py-5 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">
                {editingPackage
                  ? "Edit Dancing Package"
                  : "Create New Dancing Package"}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={28} className="text-gray-600 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex. Package 1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Performer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Performers & Set Quantities
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {performerTypes.map((type) => {
                    const qty = selectedPerformers[type.id] || 0;
                    const isSelected = qty > 0;

                    return (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {type.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rs. {type.pricePerUnit.toLocaleString("en-LK")} each
                            • Max: {type.maxAvailable}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          {isSelected ? (
                            <>
                              <button
                                type="button"
                                onClick={() => changeQuantity(type.id, -1)}
                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                                disabled={qty <= 1}
                              >
                                <Minus size={18} />
                              </button>
                              <span className="w-12 text-center font-medium text-lg">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => changeQuantity(type.id, 1)}
                                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                                disabled={qty >= type.maxAvailable}
                              >
                                <Plus size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => togglePerformer(type.id)}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedCount > 0 && (
                  <p className="mt-4 text-sm font-medium text-gray-700">
                    {selectedCount} performer type(s) selected
                  </p>
                )}
              </div>

              {/* Preview Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview (Will Generate Auto)
                </label>
                <div className="p-5 bg-gray-50 rounded-lg border min-h-[140px] whitespace-pre-line text-sm">
                  {selectedCount === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">
                      Select performers to see preview
                    </p>
                  ) : (
                    <>
                      <p className="font-medium mb-3">Package includes:</p>
                      {Object.entries(selectedPerformers).map(([id, qty]) => {
                        const type = performerTypes.find((t) => t.id === id);
                        if (!type) return null;
                        return (
                          <p key={id} className="mb-1">
                            • {qty} × {type.name} (Rs.{" "}
                            {type.pricePerUnit.toLocaleString("en-LK")} each)
                          </p>
                        );
                      })}
                      <p className="mt-4 font-bold text-lg">
                        Total estimated value: Rs.{" "}
                        {calculatePreviewTotal().toLocaleString("en-LK")}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-8 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || selectedCount === 0}
                  className={`px-10 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition ${
                    loading || isSubmitting || selectedCount === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
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


