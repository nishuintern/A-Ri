"use client";
import { FileText, Edit, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


export default function ContentPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", type: "Page Content", status: "Draft" });

  const fetchContent = () => {
    setLoading(true);
    fetch("/api/admin/content")
      .then(res => res.json())
      .then(data => {
        setContents(data.contents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ title: "", type: "Page Content", status: "Draft" });
        fetchContent();
      } else {
        toast.error(isFrench ? "Échec de l'ajout du bloc de contenu" : "Failed to add content block");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-[#e8e0d8] rounded animate-pulse" />
          <div className="h-10 w-32 bg-[#e8e0d8] rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>{isFrench ? "Contenu du site" : "Website Content"}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1d1b1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#383330] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> {isFrench ? "Nouveau bloc de contenu" : "New Content Block"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#4c463e]/60 bg-white rounded-2xl border border-[#e8e0d8]">
                {isFrench ? "Aucun bloc de contenu trouvé." : "No content blocks found."}
            </div>
        ) : contents.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ede3] flex items-center justify-center">
                {s.type === "Banner" || s.type === "Hero Section" ? <ImageIcon size={18} className="text-[#675d4e]" /> : <FileText size={18} className="text-[#675d4e]" />}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{s.status}</span>
            </div>
            <h3 className="text-base font-semibold text-[#1d1b1a] mb-1">{s.title}</h3>
            <p className="text-xs text-[#4c463e]/60 mb-4">{s.type} · {isFrench ? "Mis à jour le" : "Updated"} {new Date(s.updatedAt).toLocaleDateString()}</p>
            <button className="inline-flex items-center gap-1.5 text-sm text-[#675d4e] font-medium hover:text-[#1d1b1a] transition-colors">
              <Edit size={14} /> {isFrench ? "Modifier le contenu" : "Edit Content"}
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{isFrench ? "Créer un bloc de contenu" : "Create Content Block"}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isFrench ? "Titre" : "Title"}</label>
                <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isFrench ? "Type" : "Type"}</label>
                <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded-lg">
                  <option>Hero Section</option>
                  <option>Page Content</option>
                  <option>FAQ</option>
                  <option>Banner</option>
                  <option>Blog Article</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isFrench ? "Statut" : "Status"}</label>
                <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full border p-2 rounded-lg">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-full text-sm">{isFrench ? "Annuler" : "Cancel"}</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-full text-sm">{isFrench ? "Créer" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
