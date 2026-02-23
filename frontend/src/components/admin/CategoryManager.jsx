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

// Zod schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  // Search & Pagination states
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data || []);
      setCurrentPage(1); // Reset to page 1 after reload
      setSearchCategory(""); // Clear search when refreshing list
    } catch (err) {
      toastError("Failed to load categories");
    }
  };

  // Filter categories by name (before pagination)
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase()),
  );

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setValue("name", category.name || "");
      setValue("description", category.description || "");
    } else {
      setEditingCategory(null);
      reset();
    }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await api.put(
          `/api/admin/categories/${editingCategory.categoryId}`,
          data,
        );
        toastSuccess("Category updated successfully");
      } else {
        await api.post("/api/admin/categories", data);
        toastSuccess("Category created successfully");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this category!",
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
        await api.delete(`/api/admin/categories/${categoryId}`);
        toastSuccess("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        toastError("Delete failed");
      }
    }
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pagination logic (uses filtered list)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Category Management
          </h1>
          <p className="text-gray-600 mt-3 text-xm">
            Create, update and organize your dress categories
          </p>
          <br />
          <button
            onClick={() => openModal()}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
          >
            <Plus size={20} /> Add New Category
          </button>
        </div>
      </div>

      {/* Search Filter (added here) */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h3 className="text-2xl font-bold text-gray-900">Categories List</h3>

        <input
          type="text"
          placeholder="Search by category name..."
          className="px-6 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none bg-white/80 shadow-sm w-64 md:w-80"
          value={searchCategory}
          onChange={(e) => {
            setSearchCategory(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
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
                  Description
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentPageCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    {filteredCategories.length === 0
                      ? "No categories found matching your search."
                      : "No categories on this page."}
                  </td>
                </tr>
              ) : (
                currentPageCategories.map((cat) => (
                  <tr
                    key={cat.categoryId}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    <td className="px-8 py-6 text-gray-600 font-mono text-sm">
                      {!visibleIds[cat.categoryId] ? (
                        <button
                          onClick={() => toggleIdVisibility(cat.categoryId)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                        >
                          Show ID
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleIdVisibility(cat.categoryId)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                          >
                            Hide ID
                          </button>
                          <div className="mt-2 break-all text-gray-500 text-xs">
                            {cat.categoryId}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-8 py-6 text-gray-600 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm">
                      {new Date(cat.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal(cat)}
                          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                          title="Edit Category"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.categoryId)}
                          className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                          title="Delete Category"
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

      {/* Pagination Controls */}
      {categories.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Previous
          </button>

          <span className="text-lg font-medium text-gray-700">
            Page {currentPage} of{" "}
            {Math.ceil(filteredCategories.length / itemsPerPage)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredCategories.length / itemsPerPage),
                ),
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredCategories.length / itemsPerPage)
            }
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal (unchanged) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingCategory ? (
                  <>
                    <Edit2 size={24} className="text-indigo-600" /> Edit
                    Category
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-indigo-600" /> Add New
                    Category
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                  placeholder="e.g. Mul-Adum"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all resize-none"
                  placeholder="Describe the category (optional)..."
                />
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
                      : editingCategory
                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 hover:shadow-2xl"
                        : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:shadow-2xl"
                  }`}
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
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

export default CategoryManager;
