"use client";
import { Settings, Save, Loader2, CreditCard, Truck, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


export default function SettingsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state for forms
  const [general, setGeneral] = useState({ storeName: "", contactEmail: "", currency: "EUR" });
  const [payment, setPayment] = useState({ paypalClientId: "", taxRate: "0" });
  const [shipping, setShipping] = useState({ freeShippingThreshold: "0", standardRate: "0" });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        const s = data.settings || [];
        setSettings(s);
        
        // Map back to local state
        s.forEach((item: any) => {
            if (item.key === "storeName") setGeneral(prev => ({ ...prev, storeName: item.value }));
            if (item.key === "contactEmail") setGeneral(prev => ({ ...prev, contactEmail: item.value }));
            if (item.key === "currency") setGeneral(prev => ({ ...prev, currency: item.value }));
            if (item.key === "paypalClientId") setPayment(prev => ({ ...prev, paypalClientId: item.value }));
            if (item.key === "taxRate") setPayment(prev => ({ ...prev, taxRate: item.value }));
            if (item.key === "freeShippingThreshold") setShipping(prev => ({ ...prev, freeShippingThreshold: item.value }));
            if (item.key === "standardRate") setShipping(prev => ({ ...prev, standardRate: item.value }));
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = [
        { key: "storeName", value: general.storeName, category: "General" },
        { key: "contactEmail", value: general.contactEmail, category: "General" },
        { key: "currency", value: general.currency, category: "General" },
        { key: "paypalClientId", value: payment.paypalClientId, category: "Payment" },
        { key: "taxRate", value: payment.taxRate, category: "Payment" },
        { key: "freeShippingThreshold", value: shipping.freeShippingThreshold, category: "Shipping" },
        { key: "standardRate", value: shipping.standardRate, category: "Shipping" },
    ];

    try {
        await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ settings: payload })
        });
        toast.success(isFrench ? "Paramètres enregistrés avec succès !" : "Settings saved successfully!");
    } catch (e) {
        console.error(e);
        toast.error(isFrench ? "Échec de l'enregistrement des paramètres" : "Failed to save settings");
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <SkeletonLoader type="form" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>{isFrench ? "Paramètres de la boutique" : "Store Settings"}</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1d1b1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#383330] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {saving ? (isFrench ? "Enregistrement..." : "Saving...") : (isFrench ? "Enregistrer les modifications" : "Save Changes")}
        </button>
      </div>

      <div className="grid gap-6">
        {/* General */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e0d8]">
            <div className="w-10 h-10 rounded-xl bg-[#f5ede3] flex items-center justify-center">
              <Settings className="text-[#675d4e]" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d1b1a]">{isFrench ? "Configuration générale" : "General Configuration"}</h2>
              <p className="text-xs text-[#4c463e]/60">{isFrench ? "Informations de base sur la boutique et localisation" : "Basic store information and localization"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Nom de la boutique" : "Store Name"}</label>
              <input type="text" value={general.storeName} onChange={e=>setGeneral({...general, storeName: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Email de contact" : "Contact Email"}</label>
              <input type="email" value={general.contactEmail} onChange={e=>setGeneral({...general, contactEmail: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Devise de base" : "Base Currency"}</label>
              <select value={general.currency} onChange={e=>setGeneral({...general, currency: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e0d8]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CreditCard className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d1b1a]">{isFrench ? "Passerelles de paiement" : "Payment Gateways"}</h2>
              <p className="text-xs text-[#4c463e]/60">{isFrench ? "Configurer les clés Stripe et PayPal" : "Configure Stripe and PayPal keys"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "ID client PayPal" : "PayPal Client ID"}</label>
              <input type="text" value={payment.paypalClientId} onChange={e=>setPayment({...payment, paypalClientId: e.target.value})} placeholder="sb-xxxxxx..." className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Taux de taxe par défaut (%)" : "Default Tax Rate (%)"}</label>
              <input type="number" value={payment.taxRate} onChange={e=>setPayment({...payment, taxRate: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e0d8]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Truck className="text-emerald-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d1b1a]">{isFrench ? "Règles d'expédition" : "Shipping Rules"}</h2>
              <p className="text-xs text-[#4c463e]/60">{isFrench ? "Gérer les tarifs d'expédition et les seuils" : "Manage shipping rates and thresholds"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Tarif d'expédition standard (€)" : "Standard Shipping Rate (€)"}</label>
              <input type="number" value={shipping.standardRate} onChange={e=>setShipping({...shipping, standardRate: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4c463e] uppercase tracking-wider mb-2">{isFrench ? "Seuil de livraison gratuite (€)" : "Free Shipping Threshold (€)"}</label>
              <input type="number" value={shipping.freeShippingThreshold} onChange={e=>setShipping({...shipping, freeShippingThreshold: e.target.value})} className="w-full bg-[#faf5ef] border border-[#e8e0d8] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#675d4e]/30 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
