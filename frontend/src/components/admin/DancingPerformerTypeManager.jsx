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

// Zod schema for performer type
const performerTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pricePerUnit: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),
  maxAvailable: z
    .number({ invalid_type_error: "Max available is required" })
    .int("Must be a whole number")
    .nonnegative("Cannot be negative"),
});

const DancingPerformerTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(performerTypeSchema),
    defaultValues: {
      name: "",
      pricePerUnit: 0,
      maxAvailable: 0,
    },
  });

  useEffect(() => {
    fetchPerformerTypes();
  }, []);

  const fetchPerformerTypes = async () => {
    try {
      const res = await api.get("/api/admin/dancing-performer-types");
      setTypes(res.data || []);
    } catch (err) {
      toastError("Failed to load performer types");
    }
  };

  const openModal = (type = null) => {
    if (type) {
      setEditingType(type);
      setValue("name", type.name || "");
      setValue("pricePerUnit", type.pricePerUnit || 0);
      setValue("maxAvailable", type.maxAvailable || 0);
    } else {
      setEditingType(null);
      reset();
    }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingType) {
        await api.put(
          `/api/admin/dancing-performer-types/${editingType.id}`,
          data,
        );
        toastSuccess("Performer type updated successfully");
      } else {
        await api.post("/api/admin/dancing-performer-types", data);
        toastSuccess("Performer type created successfully");
      }
      setModalOpen(false);
      fetchPerformerTypes();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this performer type!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dancing-performer-types/${id}`);
        toastSuccess("Performer type deleted successfully");
        fetchPerformerTypes();
      } catch (err) {
        toastError("Failed to delete performer type");
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
            Manage Dancing Group Units WithPrices
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Define performer types, their unit prices, and maximum availability
          </p>
          <br />
          <button
            onClick={() => openModal()}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
          >
            <Plus size={20} /> Add New Dancing Group Performer
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
                  Price per Unit (LKR)
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Max Available
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {types.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    No performer types found. Add one above.
                  </td>
                </tr>
              ) : (
                types.map((type) => (
                  <tr
                    key={type.id}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    <td className="px-8 py-6 text-gray-600 font-mono text-sm">
                      {!visibleIds[type.id] ? (
                        <button
                          onClick={() => toggleIdVisibility(type.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                        >
                          Show ID
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleIdVisibility(type.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                          >
                            Hide ID
                          </button>
                          <div className="mt-2 break-all text-gray-500 text-xs">
                            {type.id}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-900">
                      {type.name}
                    </td>
                    <td className="px-8 py-6 text-gray-700 font-semibold">
                      Rs. {type.pricePerUnit?.toLocaleString("en-LK") || "0"}
                    </td>
                    <td className="px-8 py-6 text-gray-700">
                      {type.maxAvailable}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal(type)}
                          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                          title="Delete"
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingType ? (
                  <>
                    <Edit2 size={24} className="text-indigo-600" /> Edit
                    Performer Type
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-indigo-600" /> Add New
                    Performer Type
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Performer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                  placeholder="e.g. Kandian Dancer"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price per Unit (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="100"
                  {...register("pricePerUnit", { valueAsNumber: true })}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                  placeholder="12000"
                />
                {errors.pricePerUnit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pricePerUnit.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Max Available <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("maxAvailable", { valueAsNumber: true })}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                  placeholder="8"
                />
                {errors.maxAvailable && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxAvailable.message}
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
                      : editingType
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 hover:shadow-2xl"
                        : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:shadow-2xl"
                  }`}
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : editingType ? (
                    "Update Type"
                  ) : (
                    "Create Type"
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

export default DancingPerformerTypeManager;
