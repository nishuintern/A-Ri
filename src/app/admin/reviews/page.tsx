"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, Search, Filter } from "lucide-react";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


type Review = {
  _id: string;
  product: { _id: string; name: string; images: string[] } | null;
  user: { _id: string; name: string; email: string } | null;
  rating: number;
  title: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function ReviewsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        fetchReviews(); // Refresh to get updated data
      } else {
        toast.error(isFrench ? "Échec de la mise à jour du statut de l'avis" : "Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isFrench ? "Êtes-vous sûr de vouloir supprimer cet avis ?" : "Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchReviews();
      } else {
        toast.error(isFrench ? "Échec de la suppression de l'avis" : "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) || 
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (r.product?.name || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1b1a] mb-1" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            {isFrench ? "Avis" : "Reviews"}
          </h1>
          <p className="text-sm text-[#4c463e]">{isFrench ? "Modérez les avis des clients sur les produits." : "Moderate customer product reviews."}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e0d8] shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50" />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher des avis ou des produits..." : "Search reviews or products..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#4c463e]/50" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
          >
            <option value="all">{isFrench ? "Tous les statuts" : "All Statuses"}</option>
            <option value="pending">{isFrench ? "En attente" : "Pending"}</option>
            <option value="approved">{isFrench ? "Approuvé" : "Approved"}</option>
            <option value="rejected">{isFrench ? "Rejeté" : "Rejected"}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <SkeletonLoader type="card" />
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#e8e0d8] text-center text-[#4c463e]">
            {isFrench ? "Aucun avis ne correspond à vos filtres." : "No reviews found matching your filters."}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-2xl border border-[#e8e0d8] shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Product Info */}
                <div className="w-full lg:w-64 shrink-0 flex items-start gap-4 lg:border-r lg:border-[#e8e0d8] lg:pr-6">
                  {review.product?.images?.[0] ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#faf5ef] shrink-0 border border-[#e8e0d8]">
                      <Image src={review.product.images[0]} alt={review.product.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#e8e0d8] shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-[#1d1b1a] text-sm line-clamp-2 mb-1">
                      {review.product?.name || (isFrench ? "Produit supprimé" : "Deleted Product")}
                    </h4>
                    <p className="text-xs text-[#4c463e]">
                      {review.user?.name || (isFrench ? "Utilisateur anonyme" : "Anonymous User")}
                    </p>
                    <p className="text-xs text-[#4c463e]/70 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 1.5} className={i >= review.rating ? "text-gray-300" : ""} />
                      ))}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status === 'approved' ? (isFrench ? 'Approuvé' : 'Approved') : 
                       review.status === 'rejected' ? (isFrench ? 'Rejeté' : 'Rejected') : 
                       (isFrench ? 'En attente' : 'Pending')}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1d1b1a] text-lg mb-2">{review.title}</h3>
                  <p className="text-sm text-[#4c463e] leading-relaxed">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col justify-end lg:justify-start items-center lg:items-stretch gap-2 lg:border-l lg:border-[#e8e0d8] lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#e8e0d8]">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(review._id, 'approved')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-medium transition-colors w-full"
                    >
                      <CheckCircle size={16} />
                      {isFrench ? "Approuver" : "Approve"}
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(review._id, 'rejected')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-xl text-sm font-medium transition-colors w-full"
                    >
                      <XCircle size={16} />
                      {isFrench ? "Rejeter" : "Reject"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors w-full lg:mt-auto"
                  >
                    <Trash2 size={16} />
                    {isFrench ? "Supprimer" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
