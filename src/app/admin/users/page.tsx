"use client";
import { Shield, MoreVertical, Trash2, Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";


export default function UsersPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Admin", status: "Active" });

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(isFrench ? "Êtes-vous sûr de vouloir supprimer cet administrateur ?" : "Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ name: "", email: "", role: "Admin", status: "Active" });
        fetchUsers();
      } else {
        toast.error(isFrench ? "Échec de l'ajout de l'utilisateur" : "Failed to add user");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <SkeletonLoader type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>{isFrench ? "Utilisateurs administrateurs" : "Admin Users"}</h1>
          <p className="text-sm text-[#4c463e]/60 mt-1">{isFrench ? "Gérer l'accès et les autorisations du tableau de bord" : "Manage dashboard access and permissions"}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1d1b1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#383330] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> {isFrench ? "Ajouter un utilisateur" : "Add User"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d8] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5ede3]/50 border-b border-[#e8e0d8]">
              <th className="px-6 py-4 text-xs font-semibold text-[#4c463e] uppercase tracking-wider">{isFrench ? "Utilisateur" : "User"}</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#4c463e] uppercase tracking-wider">{isFrench ? "Rôle" : "Role"}</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#4c463e] uppercase tracking-wider">{isFrench ? "Statut" : "Status"}</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#4c463e] uppercase tracking-wider">{isFrench ? "Dernière connexion" : "Last Login"}</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#4c463e] uppercase tracking-wider text-right">{isFrench ? "Actions" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d8]">
            {users.length === 0 ? (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-[#4c463e]/60">{isFrench ? "Aucun utilisateur administrateur trouvé." : "No admin users found."}</td>
                </tr>
            ) : users.map((u) => (
              <tr key={u._id} className="hover:bg-[#faf5ef]/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8e0d8] flex items-center justify-center text-[#1d1b1a] font-bold">
                      {u.name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1d1b1a] text-sm">{u.name}</div>
                      <div className="text-xs text-[#4c463e]/60">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#675d4e]">
                    <Shield size={14} className="text-[#675d4e]/50" />
                    {isFrench && u.role === "Admin" ? "Administrateur" : 
                     isFrench && u.role === "Super Admin" ? "Super administrateur" : 
                     isFrench && u.role === "Content Manager" ? "Gestionnaire de contenu" : 
                     isFrench && u.role === "Order Manager" ? "Gestionnaire de commandes" : 
                     u.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${u.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {u.status === "Active" ? (isFrench ? "Actif" : "Active") : u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#4c463e]/60">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : (isFrench ? "Jamais" : "Never")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{isFrench ? "Ajouter un utilisateur administrateur" : "Add Admin User"}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isFrench ? "Nom" : "Name"}</label>
                <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isFrench ? "Rôle" : "Role"}</label>
                <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded-lg">
                  <option value="Admin">{isFrench ? "Administrateur" : "Admin"}</option>
                  <option value="Super Admin">{isFrench ? "Super administrateur" : "Super Admin"}</option>
                  <option value="Content Manager">{isFrench ? "Gestionnaire de contenu" : "Content Manager"}</option>
                  <option value="Order Manager">{isFrench ? "Gestionnaire de commandes" : "Order Manager"}</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-full text-sm">{isFrench ? "Annuler" : "Cancel"}</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-full text-sm">{isFrench ? "Ajouter l'utilisateur" : "Add User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
