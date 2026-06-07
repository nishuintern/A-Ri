"use client";

import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";

import {
  Package,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* KPI Card Component */
function KPICard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType | any;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p
        className="text-2xl font-bold text-[#1d1b1a] mb-1"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {value}
      </p>
      <p className="text-xs text-[#4c463e]/60 uppercase tracking-wider font-medium">
        {title}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, leadsRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/leads")
        ]);
        
        const prodData = await prodRes.json();
        const leadsData = await leadsRes.json();
        
        setProducts(prodData.products || []);
        setLeads(leadsData.leads || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Compute stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "Active").length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5).length;
  
  const totalLeads = leads.length;
  const b2bLeads = leads.filter(l => l.businessType !== "Retail").length;
  
  // Charts Data
  const productStatusData = [
    { name: isFrench ? "Actif" : "Active", value: activeProducts, color: "#10b981" },
    { name: isFrench ? "Brouillon" : "Draft", value: products.filter(p => p.status === "Draft").length, color: "#f59e0b" },
    { name: isFrench ? "Archivé" : "Archived", value: products.filter(p => p.status === "Archived").length, color: "#675d4e" },
  ];

  // Stock distribution
  const stockData = products.slice(0, 5).map(p => ({
    name: p.name.substring(0, 15) + (p.name.length > 15 ? "..." : ""),
    stock: p.stockQuantity
  }));

  // Recent leads
  const recentLeads = leads.slice(0, 5).map(l => ({
    type: "lead",
    message: `${l.businessType || 'Retail'} inquiry from ${l.firstName} ${l.lastName}`,
    time: new Date(l.createdAt).toLocaleDateString(),
    color: l.status === "New" ? "#3b82f6" : "#10b981",
  }));

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Page Title stays visible while loading */}
        <div>
          <h1
            className="text-3xl font-bold text-[#1d1b1a]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Aperçu du tableau de bord" : "Dashboard Overview"}
          </h1>
          <p className="text-sm text-[#4c463e]/60 mt-1">
            {isFrench ? "Chargement des données de votre tableau de bord..." : "Loading your dashboard data..."}
          </p>
        </div>

        {/* 2 KPI Cards Skeleton (Single row on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm animate-pulse h-[360px]">
               <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
               <div className="w-full h-full bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm animate-pulse h-[360px]">
               <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
               <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mt-8" />
            </div>
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm animate-pulse h-[250px]">
             <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
             <div className="space-y-4">
               <div className="h-10 bg-gray-100 rounded w-full" />
               <div className="h-10 bg-gray-100 rounded w-full" />
               <div className="h-10 bg-gray-100 rounded w-full" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1
          className="text-3xl font-bold text-[#1d1b1a]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          {isFrench ? "Aperçu du tableau de bord" : "Dashboard Overview"}
        </h1>
        <p className="text-sm text-[#4c463e]/60 mt-1">
          {isFrench ? "Bon retour ! Voici ce qui se passe avec AÉRI aujourd'hui." : "Welcome back! Here's what's happening with AÉRI today."}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title={isFrench ? "Total des produits" : "Total Products"}
          value={totalProducts}
          icon={Package}
          color="#3b82f6"
        />
        <KPICard
          title={isFrench ? "Produits actifs" : "Active Products"}
          value={activeProducts}
          icon={CheckCircle}
          color="#10b981"
        />
        <KPICard
          title={isFrench ? "Articles en rupture" : "Low Stock Items"}
          value={lowStockProducts}
          icon={AlertTriangle}
          color="#f97316"
        />
        <KPICard
          title={isFrench ? "Valeur totale du catalogue" : "Total Catalog Value"}
          value={`€${products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0).toLocaleString()}`}
          icon={Activity}
          color="#06b6d4"
        />
        <KPICard
          title={isFrench ? "Total des prospects" : "Total Leads"}
          value={totalLeads}
          icon={Users}
          color="#8b5cf6"
        />
        <KPICard
          title={isFrench ? "Demandes B2B" : "B2B Inquiries"}
          value={b2bLeads}
          icon={Briefcase}
          color="#f59e0b"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Stock Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h3
            className="text-lg font-semibold text-[#1d1b1a] mb-6"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Inventaire des meilleurs produits" : "Top Products Inventory"}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#4c463e" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#4c463e" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e8e0d8",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="stock" fill="#675d4e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Status Pie */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h3
            className="text-lg font-semibold text-[#1d1b1a] mb-6"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Statut du produit" : "Product Status"}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={productStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {productStatusData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e8e0d8",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {productStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-[#4c463e]">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h3
            className="text-lg font-semibold text-[#1d1b1a] mb-6"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Activité récente des prospects" : "Recent Leads Activity"}
          </h3>
          <div className="space-y-4">
            {recentLeads.length > 0 ? recentLeads.map((item) => (
              <div key={item.message + item.time} className="flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1d1b1a] truncate">
                    {item.message}
                  </p>
                  <p className="text-[11px] text-[#4c463e]/50 mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#4c463e]/50">{isFrench ? "Aucun prospect récent trouvé." : "No recent leads found."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
