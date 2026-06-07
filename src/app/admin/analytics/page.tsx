"use client";
import { BarChart3, Loader2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";


export default function AnalyticsPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#e8e0d8] rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <div className="lg:col-span-2">
            <SkeletonLoader type="card" />
          </div>
        </div>
      </div>
    );
  }

  const monthlyRevenue = data?.monthlyRevenue || [];
  const b2bVsB2c = data?.b2bVsB2c || [];
  const topProducts = data?.topProducts || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>{isFrench ? "Analytique" : "Analytics"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1d1b1a] mb-6">{isFrench ? "Revenu mensuel" : "Monthly Revenue"}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#675d4e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#675d4e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4c463e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#4c463e" }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8e0d8" }} />
              <Area type="monotone" dataKey="revenue" stroke="#675d4e" strokeWidth={2.5} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* B2B vs B2C */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1d1b1a] mb-6">{isFrench ? "Revenu B2B vs B2C" : "B2B vs B2C Revenue"}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={b2bVsB2c} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                {b2bVsB2c.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8e0d8" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {b2bVsB2c.map((item: any) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#4c463e]">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#1d1b1a] mb-6">{isFrench ? "Produits les plus vendus" : "Top Selling Products"}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#4c463e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#4c463e" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8e0d8" }} />
              <Bar dataKey="units" fill="#675d4e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
