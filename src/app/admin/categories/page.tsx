"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
};

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        fetchCategories();
        closeModal();
      } else {
        const error = await res.json();
        toast.error(error.error || (isFrench ? "Une erreur s'est produite" : "Something went wrong"));
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isFrench ? "Êtes-vous sûr de vouloir supprimer cette catégorie ?" : "Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        toast.error(isFrench ? "Échec de la suppression de la catégorie" : "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1b1a] mb-1" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            {isFrench ? "Catégories" : "Categories"}
          </h1>
          <p className="text-sm text-[#4c463e]">{isFrench ? "Gérez les catégories de produits et les collections." : "Manage product categories and collections."}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#1d1b1a] text-[#fef8f6] rounded-full text-sm font-medium hover:bg-[#383330] transition-colors"
        >
          <Plus size={16} />
          {isFrench ? "Ajouter une catégorie" : "Add Category"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e0d8] shadow-sm">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50" />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher des catégories..." : "Search categories..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#faf5ef] border-b border-[#e8e0d8] text-[#4c463e]">
            <tr>
              <th className="px-6 py-4 font-medium">{isFrench ? "Nom" : "Name"}</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Statut" : "Status"}</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d8]">
            {loading ? (
              <tr><td colSpan={4} className="p-0 border-0"><SkeletonLoader type="table" /></td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-[#4c463e]">{isFrench ? "Aucune catégorie trouvée." : "No categories found."}</td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-[#faf5ef]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1d1b1a]">{category.name}</td>
                  <td className="px-6 py-4 text-[#4c463e]">{category.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {category.isActive ? (isFrench ? "Actif" : "Active") : (isFrench ? "Inactif" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 rounded-lg text-[#4c463e] hover:bg-[#e8e0d8] hover:text-[#1d1b1a] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#e8e0d8]">
              <h2 className="text-xl font-bold text-[#1d1b1a]">
                {editingId 
                  ? (isFrench ? "Modifier la catégorie" : "Edit Category") 
                  : (isFrench ? "Ajouter une nouvelle catégorie" : "Add New Category")}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Nom" : "Name"}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  placeholder={isFrench ? "ex. Nettoyants" : "e.g. Cleansers"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  placeholder={isFrench ? "Laissez vide pour générer automatiquement" : "Leave empty to auto-generate"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Description" : "Description"}</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1d1b1a] focus:ring-[#1d1b1a] border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-[#1d1b1a] font-medium">
                  {isFrench ? "Actif" : "Active"}
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-[#e8e0d8] text-[#1d1b1a] rounded-xl font-medium hover:bg-[#faf5ef] transition-colors"
                >
                  {isFrench ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1d1b1a] text-white rounded-xl font-medium hover:bg-[#383330] transition-colors"
                >
                  {isFrench ? "Enregistrer" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
