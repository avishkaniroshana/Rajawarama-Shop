import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

// Zod schema
const specialPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  discountPercent: z
    .number({ invalid_type_error: "Discount is required" })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
  weddingCoordinationIncluded: z.boolean().optional().default(false),
  weddingPackagingIncluded: z.boolean().optional().default(false),
  linkedDancingPackageId: z.string().uuid().nullable().optional(),
});

const SpecialPackageManager = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [specialItemTypes, setSpecialItemTypes] = useState([]);
  const [dancingPackages, setDancingPackages] = useState([]);
  const [dancingPerformerTypes, setDancingPerformerTypes] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  // Controlled state
  const [selectedItems, setSelectedItems] = useState([]); // { specialItemTypeId, quantity }
  const [freeCustomItems, setFreeCustomItems] = useState([]); // string[]
  const [freeDancingPerformerIds, setFreeDancingPerformerIds] = useState([]); // UUID[]

  // Preview totals (for modal)
  const [previewTotal, setPreviewTotal] = useState(0);
  const [previewDiscounted, setPreviewDiscounted] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(specialPackageSchema),
    defaultValues: {
      name: "",
      discountPercent: 0,
      weddingCoordinationIncluded: false,
      weddingPackagingIncluded: false,
      linkedDancingPackageId: null,
    },
  });

  // Watch values for preview
  const discountPercent = watch("discountPercent") || 0;
  const weddingCoordinationIncluded = watch("weddingCoordinationIncluded");
  const weddingPackagingIncluded = watch("weddingPackagingIncluded");
  const linkedDancingPackageId = watch("linkedDancingPackageId");

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync coordination & packaging checkboxes
  useEffect(() => {
    const coordinationType = specialItemTypes.find(
      (t) => t.name.toLowerCase().includes("wedding coordination")
    );
    const packagingType = specialItemTypes.find(
      (t) => t.name.toLowerCase().includes("wedding packaging")
    );

    let newSelectedItems = [...selectedItems];

    if (weddingCoordinationIncluded && coordinationType) {
      if (!newSelectedItems.some((i) => i.specialItemTypeId === coordinationType.id)) {
        newSelectedItems.push({
          specialItemTypeId: coordinationType.id,
          quantity: 1,
        });
      }
    } else if (!weddingCoordinationIncluded && coordinationType) {
      newSelectedItems = newSelectedItems.filter(
        (i) => i.specialItemTypeId !== coordinationType.id
      );
    }

    if (weddingPackagingIncluded && packagingType) {
      if (!newSelectedItems.some((i) => i.specialItemTypeId === packagingType.id)) {
        newSelectedItems.push({
          specialItemTypeId: packagingType.id,
          quantity: 1,
        });
      }
    } else if (!weddingPackagingIncluded && packagingType) {
      newSelectedItems = newSelectedItems.filter(
        (i) => i.specialItemTypeId !== packagingType.id
      );
    }

    setSelectedItems(newSelectedItems);
  }, [weddingCoordinationIncluded, weddingPackagingIncluded, specialItemTypes]);

  // Real-time preview in modal
  useEffect(() => {
    let total = 0;

    selectedItems.forEach((item) => {
      const type = specialItemTypes.find((t) => t.id === item.specialItemTypeId);
      if (type) {
        total += item.quantity * type.pricePerUnit;
      }
    });

    const selectedDancePkg = dancingPackages.find((dp) => dp.id === linkedDancingPackageId);
    if (selectedDancePkg && selectedDancePkg.totalPrice) {
      total += selectedDancePkg.totalPrice;
    }

    setPreviewTotal(total);
    setPreviewDiscounted(total * (1 - discountPercent / 100));
  }, [
    selectedItems,
    discountPercent,
    linkedDancingPackageId,
    specialItemTypes,
    dancingPackages,
  ]);

  const fetchAllData = async () => {
    try {
      const [pkgRes, itemRes, dancePkgRes, perfRes] = await Promise.all([
        api.get("/api/admin/special-packages"),
        api.get("/api/admin/special-item-types"),
        api.get("/api/admin/dancing-package"),
        api.get("/api/admin/dancing-performer-types"),
      ]);

      setPackages(pkgRes.data || []);
      setSpecialItemTypes(itemRes.data || []);
      setDancingPackages(dancePkgRes.data || []);
      setDancingPerformerTypes(perfRes.data || []);
    } catch (err) {
      toastError("Failed to load required data");
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setValue("name", pkg.name);
      setValue("discountPercent", pkg.discountPercent || 0);
      setValue("weddingCoordinationIncluded", pkg.weddingCoordinationIncluded || false);
      setValue("weddingPackagingIncluded", pkg.weddingPackagingIncluded || false);
      setValue("linkedDancingPackageId", pkg.linkedDancingPackageId || null);

      setSelectedItems(
        pkg.items
          ?.filter((i) => {
            const type = specialItemTypes.find((t) => t.id === i.specialItemTypeId);
            return (
              type &&
              !type.name.toLowerCase().includes("wedding coordination") &&
              !type.name.toLowerCase().includes("wedding packaging")
            );
          })
          ?.map((i) => ({
            specialItemTypeId: i.specialItemTypeId,
            quantity: i.quantity,
          })) || []
      );

      setFreeCustomItems(
        pkg.freeItems?.filter((name) => {
          return !dancingPerformerTypes.some((p) => p.name === name);
        }) || []
      );

      const freePerfIds = [];
      pkg.freeItems?.forEach((freeName) => {
        const match = dancingPerformerTypes.find((p) => p.name === freeName);
        if (match) freePerfIds.push(match.id);
      });
      setFreeDancingPerformerIds(freePerfIds);
    } else {
      setEditingPackage(null);
      reset();
      setSelectedItems([]);
      setFreeCustomItems([]);
      setFreeDancingPerformerIds([]);
    }
    setModalOpen(true);
  };

  const addPricedItem = () => {
    setSelectedItems([...selectedItems, { specialItemTypeId: "", quantity: 1 }]);
  };

  const updatePricedItem = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = field === "quantity" ? Number(value) : value;
    setSelectedItems(newItems);
  };

  const removePricedItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const addFreeCustom = () => setFreeCustomItems([...freeCustomItems, ""]);
  const updateFreeCustom = (index, value) => {
    const newList = [...freeCustomItems];
    newList[index] = value;
    setFreeCustomItems(newList);
  };
  const removeFreeCustom = (index) =>
    setFreeCustomItems(freeCustomItems.filter((_, i) => i !== index));

  const toggleFreePerformer = (id) => {
    setFreeDancingPerformerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);

    if (selectedItems.length === 0) {
      toastError("At least one priced item is required");
      setLoading(false);
      return;
    }

    if (selectedItems.some((i) => !i.specialItemTypeId)) {
      toastError("All priced items must have a type selected");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: data.name.trim(),
        discountPercent: Number(data.discountPercent) || 0,
        weddingCoordinationIncluded: data.weddingCoordinationIncluded,
        weddingPackagingIncluded: data.weddingPackagingIncluded,
        linkedDancingPackageId: data.linkedDancingPackageId || null,
        items: selectedItems.map((i) => ({
          specialItemTypeId: i.specialItemTypeId,
          quantity: i.quantity,
        })),
        freeItems: freeCustomItems.filter((s) => s.trim() !== ""),
        freeDancingPerformerTypeIds: freeDancingPerformerIds,
      };

      if (editingPackage) {
        await api.put(`/api/admin/special-packages/${editingPackage.id}`, payload);
        toastSuccess("Special package updated");
      } else {
        await api.post("/api/admin/special-packages", payload);
        toastSuccess("Special package created");
      }

      setModalOpen(false);
      fetchAllData();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Package?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/special-packages/${id}`);
        toastSuccess("Package deleted");
        fetchAllData();
      } catch (err) {
        toastError("Delete failed");
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Special Packages
          </h1>
          <p className="text-gray-600 text-lg">
            Create premium bundles with discounts, free items & coordination
          </p>
          <br />
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all font-semibold transform hover:scale-105"
            >
              <Plus size={20} /> Add New Special Package
            </button>

            <button
              onClick={() => navigate("/admin/special-item-types")}
              className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all font-semibold transform hover:scale-105"
            >
              <Edit2 size={20} /> Manage Special Item Types
            </button>
          </div>
        </div>
      </div>

      {/* Table – with all requested columns */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {/* ID - narrow */}
                <th className="w-32 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Special Package Id
                </th>

                {/* Name - wider */}
                <th className="w-64 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Name
                </th>

                {/* Description - widest */}
                <th className="w-96 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Description
                </th>

                {/* Price without discount - narrow */}
                <th className="w-40 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Price
                </th>

                {/* Discount Percentage - very narrow */}
                <th className="w-32 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Discount %
                </th>

                {/* Total Price with discount - narrow */}
                <th className="w-40 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Discounted Price
                </th>

                {/* Actions - fixed narrow */}
                <th className="w-32 px-6 py-5 text-left text-sm font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    No special packages found.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => {
                  // Calculate price without discount (reverse from finalPrice + discount)
                  const priceWithoutDiscount =
                    pkg.finalPrice && pkg.discountPercent
                      ? pkg.finalPrice / (1 - pkg.discountPercent / 100)
                      : pkg.finalPrice || 0;

                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-indigo-50/50 transition-colors"
                    >
                      {/* ID column */}
                      <td className="px-6 py-6 text-gray-600 font-mono text-sm">
                        {!visibleIds[pkg.id] ? (
                          <button
                            onClick={() => toggleIdVisibility(pkg.id)}
                            className="text-indigo-600 hover:text-indigo-800 underline text-sm"
                          >
                            Show ID
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleIdVisibility(pkg.id)}
                              className="text-indigo-600 hover:text-indigo-800 underline text-sm"
                            >
                              Hide ID
                            </button>
                            <div className="mt-2 break-all text-gray-500 text-xs">
                              {pkg.id}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Name - wider */}
                      <td className="px-6 py-6 font-medium text-gray-900">
                        {pkg.name}
                      </td>

                      {/* Description - widest */}
                      <td className="px-6 py-6 text-gray-600 whitespace-pre-line text-sm leading-relaxed w-96">
                        {pkg.description
                          ? pkg.description.split("\n").map((line, i) => {
                              const trimmed = line.trim();
                              const isBold =
                                trimmed === "Includes:" ||
                                trimmed === "Free items:" ||
                                trimmed.startsWith("Total estimated value:");

                              return (
                                <div
                                  key={i}
                                  className={
                                    isBold ? "font-semibold text-gray-900" : ""
                                  }
                                >
                                  {trimmed.startsWith("•") ? (
                                    <span className="inline-block ml-2">
                                      {line}
                                    </span>
                                  ) : (
                                    line
                                  )}
                                </div>
                              );
                            })
                          : "—"}
                      </td>

                      {/* Price without discount - narrow */}
                      <td className="px-6 py-6 text-gray-700 font-semibold whitespace-nowrap">
                        Rs. {priceWithoutDiscount.toLocaleString("en-LK")}
                      </td>

                      {/* Discount Percentage - narrow */}
                      <td className="px-6 py-6 text-gray-700 whitespace-nowrap">
                        {pkg.discountPercent}%
                      </td>

                      {/* Total Price with discount - narrow */}
                      <td className="px-6 py-6 text-gray-700 font-semibold whitespace-nowrap">
                        Rs. {pkg.finalPrice?.toLocaleString("en-LK") || "—"}
                      </td>

                      {/* Actions - narrow */}
                      <td className="px-6 py-6">
                        <div className="flex gap-4">
                          <button
                            onClick={() => openModal(pkg)}
                            className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal – with live preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-5xl max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingPackage ? (
                  <>
                    <Edit2 size={24} className="text-indigo-600" /> Edit Special
                    Package
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-indigo-600" /> Create
                    Special Package
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
              onSubmit={handleSubmit(onSubmit)}
              className="px-8 py-8 space-y-8"
            >
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="Enter special package name here"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("discountPercent", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="0 - 100"
                  />
                  {errors.discountPercent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discountPercent.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("weddingCoordinationIncluded")}
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Wedding Coordination Included
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("weddingPackagingIncluded")}
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Wedding Packaging Included
                  </span>
                </label>
              </div>

              {/* Linked Dancing Package */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Link to Dancing Package (optional)
                </label>
                <select
                  {...register("linkedDancingPackageId")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all bg-white"
                >
                  <option value="">— None —</option>
                  {dancingPackages.map((dp) => (
                    <option key={dp.id} value={dp.id}>
                      {dp.name} (Rs.{" "}
                      {dp.totalPrice?.toLocaleString("en-LK") || "—"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priced Items */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Priced Items *
                  </h3>
                  <button
                    type="button"
                    onClick={addPricedItem}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    <Plus size={18} /> Add Item
                  </button>
                </div>

                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-6">
                    Add at least one priced item - (Press "Add Item" button)
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedItems.map((item, index) => {
                      const type = specialItemTypes.find(
                        (t) => t.id === item.specialItemTypeId,
                      );
                      if (
                        type?.name
                          .toLowerCase()
                          .includes("wedding coordination") ||
                        type?.name.toLowerCase().includes("wedding packaging")
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border"
                        >
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1.5">
                              Item Type
                            </label>
                            <select
                              value={item.specialItemTypeId}
                              onChange={(e) =>
                                updatePricedItem(
                                  index,
                                  "specialItemTypeId",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                            >
                              <option value="">Select item type...</option>
                              {specialItemTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} – Rs.{" "}
                                  {t.pricePerUnit?.toLocaleString("en-LK")}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-32">
                            <label className="block text-sm text-gray-700 mb-1.5">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updatePricedItem(
                                  index,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-center"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removePricedItem(index)}
                            className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-base font-semibold text-gray-800 mb-3">
                  Live Preview (before save)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600">
                      Price (Without Discount)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rs. {previewTotal.toLocaleString("en-LK")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600">
                      Total Price (With {discountPercent}% Discount)
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                      Rs. {previewDiscounted.toLocaleString("en-LK")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Items */}
              <div className="border-t pt-6 space-y-8">
                <h3 className="text-lg font-semibold text-gray-800">
                  Free Items (Optional)
                </h3>

                {/* Custom Free Items */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Free Items (If you want to add free items that are
                      not in the priced item list or dancing performers)
                    </label>
                    <button
                      type="button"
                      onClick={addFreeCustom}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Plus size={16} /> Add Custom
                    </button>
                  </div>

                  {freeCustomItems.length > 0 && (
                    <div className="space-y-3">
                      {freeCustomItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateFreeCustom(idx, e.target.value)
                            }
                            placeholder="e.g. Traditional oil lamp"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeFreeCustom(idx)}
                            className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Free Dancing Performers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Free Dancing Performer Types
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                    {dancingPerformerTypes.map((perf) => (
                      <label
                        key={perf.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          freeDancingPerformerIds.includes(perf.id)
                            ? "bg-indigo-50 border-indigo-400"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={freeDancingPerformerIds.includes(perf.id)}
                          onChange={() => toggleFreePerformer(perf.id)}
                          className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-medium">{perf.name}</div>
                          <div className="text-sm text-gray-600">
                            Rs. {perf.pricePerUnit?.toLocaleString("en-LK")} •
                            Max: {perf.maxAvailable}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-5 pt-6 border-t border-gray-200 mt-6">
                
                  {/* Cancel – closes modal */}
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-10 py-3.5 rounded-xl border border-gray-500 text-gray-700 hover:bg-gray-200 transition font-medium shadow-sm"
                  >
                    Cancel
                  </button>

                  {/* Clear button – resets form but keeps modal open */}
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setSelectedItems([]);
                      setFreeCustomItems([]);
                      setFreeDancingPerformerIds([]);
                      setValue("name", "");
                      setValue("discountPercent", 0);
                      setValue("weddingCoordinationIncluded", false);
                      setValue("weddingPackagingIncluded", false);
                      setValue("linkedDancingPackageId", null);
                    }}
                    className="px-10 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium shadow-sm"
                  >
                    Clear
                  </button>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className={`px-12 py-3.5 rounded-xl font-semibold text-white shadow-xl flex items-center gap-3 transition-all ${
                      loading || isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
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

export default SpecialPackageManager;

