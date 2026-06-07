"use client";

import { useState, useEffect } from "react";
import { Search, Save, AlertTriangle } from "lucide-react";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


type Product = {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  images: string[];
};

export default function InventoryPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updates, setUpdates] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id: string, newStock: string) => {
    const value = parseInt(newStock) || 0;
    setUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const changes = Object.entries(updates).map(([id, stockQuantity]) => ({
      id,
      stockQuantity
    }));

    if (changes.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: changes }),
      });
      
      if (res.ok) {
        toast.success(isFrench ? "Inventaire mis à jour avec succès !" : "Inventory updated successfully!");
        setUpdates({});
        fetchProducts(); // Refresh data
      } else {
        toast.error(isFrench ? "Échec de la mise à jour de l'inventaire." : "Failed to update inventory.");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasChanges = Object.keys(updates).length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1b1a] mb-1" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            {isFrench ? "Inventaire" : "Inventory"}
          </h1>
          <p className="text-sm text-[#4c463e]">{isFrench ? "Mettez à jour rapidement les niveaux de stock sur tous les produits." : "Quickly update stock levels across all products."}</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e0d8] shadow-sm flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50" />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher des produits..." : "Search products..."}
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
              <th className="px-6 py-4 font-medium">{isFrench ? "Produit" : "Product"}</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Catégorie" : "Category"}</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Statut" : "Status"}</th>
              <th className="px-6 py-4 font-medium w-48 text-right">{isFrench ? "Quantité en stock" : "Stock Quantity"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d8]">
            {loading ? (
              <tr><td colSpan={4} className="p-0 border-0"><SkeletonLoader type="table" /></td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-[#4c463e]">{isFrench ? "Aucun produit trouvé." : "No products found."}</td></tr>
            ) : (
              filteredProducts.map((product) => {
                const currentStock = updates[product._id] !== undefined ? updates[product._id] : product.stockQuantity;
                const isLowStock = currentStock < 10;
                
                return (
                  <tr key={product._id} className={`hover:bg-[#faf5ef]/50 transition-colors ${updates[product._id] !== undefined ? 'bg-[#faf5ef]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#faf5ef] border border-[#e8e0d8] shrink-0">
                          {product.images && product.images[0] && (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-[#1d1b1a]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4c463e]">{product.category}</td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle size={12} />
                          {isFrench ? "Stock faible" : "Low Stock"}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {isFrench ? "En stock" : "In Stock"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => handleStockChange(product._id, e.target.value)}
                          className={`w-24 px-3 py-1.5 rounded-lg border text-right outline-none focus:ring-2 focus:ring-[#675d4e]/30 ${
                            updates[product._id] !== undefined ? 'border-[#675d4e] bg-white' : 'border-[#e8e0d8] bg-[#faf5ef]'
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 p-4 bg-white border-t border-[#e8e0d8] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between z-40 transition-transform">
          <div className="text-[#1d1b1a] font-medium">
            {Object.keys(updates).length} {isFrench ? "produit(s) modifié(s)" : "product(s) modified"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setUpdates({})}
              disabled={saving}
              className="px-6 py-2 border border-[#e8e0d8] text-[#1d1b1a] rounded-xl font-medium hover:bg-[#faf5ef] transition-colors"
            >
              {isFrench ? "Annuler les modifications" : "Discard Changes"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#1d1b1a] text-white rounded-xl font-medium hover:bg-[#383330] transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? (isFrench ? "Enregistrement..." : "Saving...") : (isFrench ? "Enregistrer les modifications" : "Save Changes")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
