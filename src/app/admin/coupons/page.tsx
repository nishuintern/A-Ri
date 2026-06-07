"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Ticket, Percent } from "lucide-react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


type Coupon = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxUsage?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
};

export default function CouponsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxUsage: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minPurchase: "",
      maxUsage: "",
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase?.toString() || "",
      maxUsage: coupon.maxUsage?.toString() || "",
      validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
      validUntil: new Date(coupon.validUntil).toISOString().slice(0, 16),
      isActive: coupon.isActive,
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
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : undefined,
      };

      const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        fetchCoupons();
        closeModal();
      } else {
        const error = await res.json();
        toast.error(error.error || (isFrench ? "Une erreur s'est produite" : "Something went wrong"));
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isFrench ? "Êtes-vous sûr de vouloir supprimer ce coupon ?" : "Are you sure you want to delete this coupon?")) return;
    
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCoupons();
      } else {
        toast.error(isFrench ? "Échec de la suppression du coupon" : "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1b1a] mb-1" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            {isFrench ? "Coupons" : "Coupons"}
          </h1>
          <p className="text-sm text-[#4c463e]">{isFrench ? "Gérez les codes de réduction et les promotions." : "Manage discount codes and promotions."}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#1d1b1a] text-[#fef8f6] rounded-full text-sm font-medium hover:bg-[#383330] transition-colors"
        >
          <Plus size={16} />
          {isFrench ? "Créer un coupon" : "Create Coupon"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e0d8] shadow-sm">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50" />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher des codes de réduction..." : "Search coupon codes..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30 uppercase"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#faf5ef] border-b border-[#e8e0d8] text-[#4c463e]">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Réduction" : "Discount"}</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Utilisation" : "Usage"}</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Validité" : "Validity"}</th>
              <th className="px-6 py-4 font-medium">{isFrench ? "Statut" : "Status"}</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d8]">
            {loading ? (
              <tr><td colSpan={6} className="p-0 border-0"><SkeletonLoader type="table" /></td></tr>
            ) : filteredCoupons.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-[#4c463e]">{isFrench ? "Aucun coupon trouvé." : "No coupons found."}</td></tr>
            ) : (
              filteredCoupons.map((coupon) => {
                const now = new Date();
                const validUntil = new Date(coupon.validUntil);
                const isExpired = validUntil < now;
                const statusColor = !coupon.isActive ? 'bg-gray-100 text-gray-800' : isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
                
                let statusText = "";
                if (!coupon.isActive) statusText = isFrench ? "Inactif" : "Inactive";
                else if (isExpired) statusText = isFrench ? "Expiré" : "Expired";
                else statusText = isFrench ? "Actif" : "Active";

                return (
                  <tr key={coupon._id} className="hover:bg-[#faf5ef]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#1d1b1a] flex items-center gap-2">
                      <Ticket size={16} className="text-[#4c463e]/50" />
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 text-[#4c463e] font-medium">
                      {coupon.discountType === 'percentage' ? (
                        <span className="flex items-center gap-1"><Percent size={14} />{coupon.discountValue}%</span>
                      ) : (
                        <span>₹{coupon.discountValue}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#4c463e]">
                      {coupon.usedCount} {coupon.maxUsage ? `/ ${coupon.maxUsage}` : (isFrench ? "utilisé(s)" : "used")}
                    </td>
                    <td className="px-6 py-4 text-[#4c463e]">
                      <div className="text-xs">
                        <div>{isFrench ? "De :" : "From:"} {new Date(coupon.validFrom).toLocaleDateString()}</div>
                        <div>{isFrench ? "À :" : "To:"} {validUntil.toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-2 rounded-lg text-[#4c463e] hover:bg-[#e8e0d8] hover:text-[#1d1b1a] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e8e0d8] sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#1d1b1a]">
                {editingId 
                  ? (isFrench ? "Modifier le coupon" : "Edit Coupon")
                  : (isFrench ? "Créer un nouveau coupon" : "Create New Coupon")}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Code du coupon" : "Coupon Code"}</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30 uppercase"
                    placeholder="SUMMER20"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Type de réduction" : "Discount Type"}</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  >
                    <option value="percentage">{isFrench ? "Pourcentage (%)" : "Percentage (%)"}</option>
                    <option value="fixed">{isFrench ? "Montant fixe (₹)" : "Fixed Amount (₹)"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">
                    {isFrench ? "Valeur de la réduction" : "Discount Value"} {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                    placeholder="e.g. 20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Achat min. (₹)" : "Min. Purchase (₹)"}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                    placeholder={isFrench ? "Optionnel" : "Optional"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Valide du" : "Valid From"}</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Valide jusqu'au" : "Valid Until"}</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">{isFrench ? "Limite d'utilisation maximale" : "Maximum Usage Limit"}</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  placeholder={isFrench ? "Laissez vide pour un nombre illimité" : "Leave empty for unlimited"}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1d1b1a] focus:ring-[#1d1b1a] border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-[#1d1b1a] font-medium">
                  {isFrench ? "Le coupon est actif" : "Coupon is Active"}
                </label>
              </div>

              <div className="pt-6 flex gap-3">
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
                  {isFrench ? "Enregistrer le coupon" : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
