"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Mail, Phone, MapPin, Building2, User } from "lucide-react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";


type Lead = {
  _id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  quantity: string;
  status: "New" | "In Progress" | "Qualified" | "Closed";
  notes?: string;
  createdAt: string;
};

export default function LeadsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus as Lead["status"] });
        }
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.company.toLowerCase().includes(search.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left List */}
      <div className="w-1/3 flex flex-col gap-4">
        {/* Header & Search */}
        <div>
          <h1
            className="text-2xl font-bold text-[#1d1b1a] mb-1"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Prospects B2B" : "B2B Leads"}
          </h1>
          <p className="text-sm text-[#4c463e] mb-4">{isFrench ? "Gérez les demandes de vente en gros." : "Manage wholesale inquiries."}</p>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50" />
            <input
              type="text"
              placeholder={isFrench ? "Rechercher des prospects..." : "Search leads..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30 shadow-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-y-auto p-2 space-y-1">
          {loading ? (
            <SkeletonLoader type="card" />
          ) : filteredLeads.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#4c463e]">{isFrench ? "Aucun prospect trouvé." : "No leads found."}</div>
          ) : (
            filteredLeads.map((lead) => (
              <button
                key={lead._id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left p-4 rounded-xl transition-colors ${
                  selectedLead?._id === lead._id ? "bg-[#faf5ef] border-[#675d4e] border" : "hover:bg-[#faf5ef]/50 border border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-[#1d1b1a] truncate pr-2">{lead.company}</span>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                    {isFrench ? (lead.status === "New" ? "Nouveau" : lead.status === "In Progress" ? "En cours" : lead.status === "Qualified" ? "Qualifié" : "Fermé") : lead.status}
                  </span>
                </div>
                <div className="text-sm text-[#4c463e] truncate">{lead.contactName}</div>
                <div className="text-xs text-[#4c463e]/70 mt-2">
                  {new Date(lead.createdAt).toLocaleDateString()} • {lead.country}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Details */}
      <div className="w-2/3 bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-y-auto">
        {selectedLead ? (
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-start border-b border-[#e8e0d8] pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1d1b1a] mb-2">{selectedLead.company}</h2>
                <div className="flex items-center gap-2 text-[#4c463e]">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                    {isFrench ? (selectedLead.status === "New" ? "Nouveau" : selectedLead.status === "In Progress" ? "En cours" : selectedLead.status === "Qualified" ? "Qualifié" : "Fermé") : selectedLead.status}
                  </span>
                  <span>•</span>
                  <span className="text-sm">{isFrench ? "Soumis le" : "Submitted on"} {new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedLead.status}
                  onChange={(e) => updateLeadStatus(selectedLead._id, e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                >
                  <option value="New">{isFrench ? "Nouveau" : "New"}</option>
                  <option value="In Progress">{isFrench ? "En cours" : "In Progress"}</option>
                  <option value="Qualified">{isFrench ? "Qualifié" : "Qualified"}</option>
                  <option value="Closed">{isFrench ? "Fermé" : "Closed"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#4c463e] uppercase tracking-wider mb-3">{isFrench ? "Coordonnées" : "Contact Info"}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#1d1b1a]">
                      <User size={18} className="text-[#675d4e]" />
                      <span>{selectedLead.contactName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#1d1b1a]">
                      <Mail size={18} className="text-[#675d4e]" />
                      <a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-3 text-[#1d1b1a]">
                        <Phone size={18} className="text-[#675d4e]" />
                        <a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#4c463e] uppercase tracking-wider mb-3">{isFrench ? "Détails de l'entreprise" : "Company Details"}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#1d1b1a]">
                      <Building2 size={18} className="text-[#675d4e]" />
                      <span>{selectedLead.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#1d1b1a]">
                      <MapPin size={18} className="text-[#675d4e]" />
                      <span>{selectedLead.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#4c463e] uppercase tracking-wider mb-3">{isFrench ? "Intérêt de commande" : "Order Interest"}</h3>
                  <div className="bg-[#faf5ef] p-4 rounded-xl border border-[#e8e0d8]">
                    <div className="text-sm text-[#4c463e] mb-1">{isFrench ? "Quantité estimée" : "Estimated Quantity"}</div>
                    <div className="text-xl font-bold text-[#1d1b1a]">{selectedLead.quantity} {isFrench ? "unités" : "units"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#4c463e] uppercase tracking-wider mb-3">{isFrench ? "Notes supplémentaires" : "Additional Notes"}</h3>
                  <div className="bg-[#faf5ef] p-4 rounded-xl border border-[#e8e0d8] min-h-[100px] text-[#1d1b1a] whitespace-pre-wrap">
                    {selectedLead.notes || <span className="text-[#4c463e]/50 italic">{isFrench ? "Aucune note supplémentaire fournie." : "No additional notes provided."}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#4c463e] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#faf5ef] border border-[#e8e0d8] flex items-center justify-center">
              <Mail size={24} className="text-[#675d4e]" />
            </div>
            <p>{isFrench ? "Sélectionnez un prospect dans la liste pour voir les détails." : "Select a lead from the list to view details."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
