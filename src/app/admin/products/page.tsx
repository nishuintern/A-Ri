"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

/* Product Type Interface */
interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  status: "Active" | "Draft" | "Archived";
  featured: boolean;
  images: string[];
  productType: string;
  createdAt: string;
}

/* Status badge colors */
const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-amber-50 text-amber-700 border-amber-200",
  Archived: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ProductsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  /* Fetch products from API */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Products fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Delete product */
  const handleDelete = async (id: string) => {
    if (!confirm(isFrench ? "Êtes-vous sûr de vouloir supprimer ce produit ?" : "Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* Filter and search */
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-[#1d1b1a]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Produits" : "Products"}
          </h1>
          <p className="text-sm text-[#4c463e]/60 mt-1">
            {products.length} {isFrench ? "produits au total" : "total products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d1b1a] text-[#fef8f6] rounded-xl text-sm font-semibold hover:bg-[#32302f] transition-colors shadow-sm"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          <Plus size={16} />
          {isFrench ? "Ajouter un produit" : "Add Product"}
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e0d8] shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c463e]/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isFrench ? "Rechercher par nom ou SKU..." : "Search by name or SKU..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          />
        </div>
        <div className="flex gap-2">
          {[{v:"All", l_en:"All", l_fr:"Tous"}, {v:"Active", l_en:"Active", l_fr:"Actif"}, {v:"Draft", l_en:"Draft", l_fr:"Brouillon"}, {v:"Archived", l_en:"Archived", l_fr:"Archivé"}].map((s) => (
            <button
              key={s.v}
              onClick={() => setStatusFilter(s.v)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s.v
                  ? "bg-[#1d1b1a] text-white border-[#1d1b1a]"
                  : "bg-white text-[#4c463e] border-[#e8e0d8] hover:bg-[#f5ede3]"
              }`}
            >
              {isFrench ? s.l_fr : s.l_en}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full">
            <SkeletonLoader type="table" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package size={48} className="mx-auto text-[#4c463e]/20 mb-4" />
            <p className="text-lg font-semibold text-[#1d1b1a] mb-1">
              {isFrench ? "Aucun produit trouvé" : "No products found"}
            </p>
            <p className="text-sm text-[#4c463e]/60 mb-6">
              {products.length === 0
                ? (isFrench ? "Commencez par ajouter votre premier produit." : "Start by adding your first product.")
                : (isFrench ? "Essayez d'ajuster votre recherche ou vos filtres." : "Try adjusting your search or filters.")}
            </p>
            {products.length === 0 && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d1b1a] text-[#fef8f6] rounded-xl text-sm font-semibold hover:bg-[#32302f] transition-colors"
              >
                <Plus size={16} />
                {isFrench ? "Ajouter un produit" : "Add Product"}
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8e0d8]">
                  <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    {isFrench ? "Produit" : "Product"}
                  </th>
                  <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    SKU
                  </th>
                  <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    {isFrench ? "Catégorie" : "Category"}
                  </th>
                  <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    {isFrench ? "Prix" : "Price"}
                  </th>
                  <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    Stock
                  </th>
                  <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    {isFrench ? "Statut" : "Status"}
                  </th>
                  <th className="text-right px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#4c463e]/60 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-[#e8e0d8]/50 hover:bg-[#faf5ef]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f5ede3] overflow-hidden relative shrink-0">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1d1b1a] truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-[#4c463e]/50">
                            {product.productType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c463e] font-mono">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c463e]">
                      {product.category}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-[#1d1b1a]">
                        €{product.price.toFixed(2)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-[#4c463e]/50 line-through ml-2">
                          €{product.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stockQuantity <= 5
                            ? "text-red-500"
                            : product.stockQuantity <= 20
                              ? "text-amber-500"
                              : "text-emerald-600"
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[product.status]}`}
                      >
                        {isFrench ? (product.status === "Active" ? "Actif" : product.status === "Draft" ? "Brouillon" : "Archivé") : product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === product._id ? null : product._id
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-[#f5ede3] transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-[#4c463e]" />
                      </button>
                      {openMenu === product._id && (
                        <div className="absolute right-6 top-12 bg-white border border-[#e8e0d8] rounded-xl shadow-lg z-10 py-1 w-40">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#1d1b1a] hover:bg-[#faf5ef] transition-colors"
                          >
                            <Edit size={14} /> {isFrench ? "Modifier" : "Edit"}
                          </Link>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#1d1b1a] hover:bg-[#faf5ef] transition-colors w-full"
                          >
                            <Copy size={14} /> {isFrench ? "Dupliquer" : "Duplicate"}
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <Trash2 size={14} /> {isFrench ? "Supprimer" : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
