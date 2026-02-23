import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Edit2, Trash2, Plus, Upload, X, Loader2 } from "lucide-react";

const MySwal = withReactContent(Swal);

const DressItemsManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [visibleIds, setVisibleIds] = useState({});

  const [formData, setFormData] = useState({
    dressName: "",
    description: "",
    quantityAdult: "",
    quantityPageBoys: "",
    categoryId: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/admin/dress-items");
      setItems(res.data || []);
      setCurrentPage(1); // Reset to page 1 when items reload
    } catch (err) {
      toastError("Failed to load dress items");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data || []);
    } catch (err) {
      toastError("Failed to load categories");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        dressName: item.dressItemName || "",
        description: item.description || "",
        quantityAdult: item.quantityAdult || "",
        quantityPageBoys: item.quantityPageBoys || "",
        categoryId: item.categoryId || "",
      });
      setImagePreview(item.imagePath || null);
    } else {
      setEditingItem(null);
      setFormData({
        dressName: "",
        description: "",
        quantityAdult: "",
        quantityPageBoys: "",
        categoryId: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dressName.trim() || !formData.categoryId) {
      toastError("Dress name and category are required");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      const requestJson = {
        dressItemName: formData.dressName,
        description: formData.description || "",
        quantityAdult: formData.quantityAdult
          ? Number(formData.quantityAdult)
          : 0,
        quantityPageBoys: formData.quantityPageBoys
          ? Number(formData.quantityPageBoys)
          : 0,
        categoryId: formData.categoryId,
      };

      payload.append(
        "request",
        new Blob([JSON.stringify(requestJson)], { type: "application/json" }),
      );

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingItem) {
        await api.put(
          `/api/admin/dress-items/${editingItem.dressItemId}`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        toastSuccess("Dress item updated successfully");
      } else {
        await api.post("/api/admin/dress-items", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toastSuccess("Dress item created successfully");
      }

      setModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toastError(err.response?.data?.message || "Failed to save dress item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Dress Item?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dress-items/${id}`);
        toastSuccess("Dress item deleted successfully");
        fetchItems();
      } catch (err) {
        toastError("Delete failed");
      }
    }
  };

  const filteredItems = filterCategory
    ? items.filter((item) => item.categoryId === filterCategory)
    : items;

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageItems = filteredItems.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Dress Items Management
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Add, Update, Delete and organize your traditional Dress-Items
            Collection
          </p>
          <br />
          <div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
            >
              <Plus size={20} /> Add New Dress Item
            </button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h3 className="text-2xl font-bold text-gray-900">Dress Items List</h3>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-6 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none bg-white/80 shadow-sm min-w-[240px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>
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
                  Image
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Dress Name
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Adults
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Page Boys
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    {filteredItems.length === 0
                      ? "No dress items found. Add your first item above."
                      : "No items on this page."}
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item) => (
                  <tr
                    key={item.dressItemId}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    <td className="px-8 py-6 font-mono text-sm">
                      <button
                        onClick={() => toggleIdVisibility(item.dressItemId)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {visibleIds[item.dressItemId] ? "Hide ID" : "Show ID"}
                      </button>

                      {visibleIds[item.dressItemId] && (
                        <div className="mt-2 break-all text-gray-600 text-xs">
                          {item.dressItemId}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      {item.imagePath ? (
                        <img
                          src={item.imagePath}
                          alt={item.dressItemName}
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                          onError={(e) => {
                            e.target.src = "/placeholder-dress.jpg";
                            console.error("Image load failed:", item.imagePath);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-900">
                      {item.dressItemName}
                    </td>
                    <td className="px-8 py-6 text-gray-600 max-w-xs truncate">
                      {item.description || "—"}
                    </td>
                    <td className="px-8 py-6 text-center text-gray-700">
                      {item.quantityAdult || 0}
                    </td>
                    <td className="px-8 py-6 text-center text-gray-700">
                      {item.quantityPageBoys || 0}
                    </td>
                    <td className="px-8 py-6 text-gray-600">
                      {item.categoryName || "Uncategorized"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal(item)}
                          className="p-3 rounded-full bg-indigo-100 text-blue-700 hover:bg-blue-200 transition shadow-sm"
                          title="Edit Item"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.dressItemId)}
                          className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                          title="Delete Item"
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
      {filteredItems.length > 0 && (
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
            {Math.ceil(filteredItems.length / itemsPerPage)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredItems.length / itemsPerPage),
                ),
              )
            }
            disabled={
              currentPage === Math.ceil(filteredItems.length / itemsPerPage)
            }
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal - Create / Update (unchanged) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30
             w-full max-w-5xl max-h-[100vh] overflow-y-auto
             scrollbar-thin scrollbar-thumb-gradient-to-b scrollbar-thumb-from-indigo-500 scrollbar-thumb-to-purple-600
             scrollbar-track-gray-950/50 hover:scrollbar-thumb-from-black-600 hover:scrollbar-thumb-to-purple-700
             scrollbar-rounded-full transition-all duration-300"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-2 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingItem ? (
                  <>
                    <Edit2 size={24} className="text-blue-600" /> Edit Dress
                    Item
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-blue-600" /> Add New Dress
                    Item
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

            <form
              onSubmit={handleSubmit}
              className="px-6 md:px-12 py-6 space-y-2"
            >
              {/* Row 1: Dress Name + Category (side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dress Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Dress Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dressName}
                    onChange={(e) =>
                      setFormData({ ...formData, dressName: e.target.value })
                    }
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base shadow-sm"
                    placeholder="e.g. Kandyan Royal Bridal Saree"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base shadow-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Description (full width) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all resize-none text-base shadow-sm"
                  placeholder="Detailed description of the dress..."
                />
              </div>

              {/* Row 3: Quantities (side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Quantity (Adults)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityAdult}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityAdult: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base shadow-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Quantity (Page Boys)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityPageBoys}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityPageBoys: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base shadow-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Row 4: Image (left) + Buttons (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Image Upload - Left half */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dress Image <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/70 hover:bg-blue-50/50 transition-all overflow-hidden shadow-inner">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <Upload
                            size={20}
                            className="mx-auto text-gray-400 group-hover:text-blue-600 transition"
                          />
                          <p className="mt-3 text-sm font-medium text-gray-600">
                            Click or drag image
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, WEBP (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-3 right-3 bg-red-500/90 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Buttons - Right half, aligned at bottom */}
                <div className="flex flex-col justify-end gap-5 h-full pt-10 md:pt-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full md:w-auto px-12 py-3.5 rounded-xl font-semibold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : editingItem
                          ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                          : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:shadow-2xl"
                    }`}
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading
                      ? "Saving..."
                      : editingItem
                        ? "Update Dress Item"
                        : "Create Dress Item"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full md:w-auto px-10 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DressItemsManager;
