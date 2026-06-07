"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";

/* ─── भाषा अनुवाद (Localized UI strings for admin login) ─── */
const loginText = {
  fr: {
    heading: "Connexion au tableau de bord",
    subtitle: "Accès sécurisé réservé au personnel autorisé",
    emailLabel: "Adresse e-mail",
    passLabel: "Mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    btnLogin: "Se connecter au tableau de bord",
    btnLoading: "Connexion en cours...",
  },
  en: {
    heading: "Admin Dashboard Login",
    subtitle: "Secure access for authorized personnel only",
    emailLabel: "Email address",
    passLabel: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    btnLogin: "Sign in to Dashboard",
    btnLoading: "Signing in...",
  },
};

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const { lang } = useLanguage();
  const s = loginText[lang as keyof typeof loginText] || loginText.en;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      // Successful login pe redirect karte hain
      router.push(callbackUrl);
      router.refresh(); // Force refresh to update navigation state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#1d1b1a]">
          <span className="text-3xl font-extrabold tracking-widest uppercase" style={{ fontFamily: "var(--font-didot, serif)" }}>AÉRI</span>
        </div>
        <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold text-[#1d1b1a]">
          {s.heading}
        </h2>
        <p className="mt-2 text-center text-sm text-[#4c463e]/60">
          {s.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[#e8e0d8] rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1d1b1a]">
                {s.emailLabel}
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#4c463e]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#e8e0d8] rounded-xl focus:ring-[#675d4e] focus:border-[#675d4e] text-sm bg-[#faf5ef] text-[#1d1b1a]"
                  placeholder="admin@aerisnacks.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1d1b1a]">
                {s.passLabel}
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#4c463e]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#e8e0d8] rounded-xl focus:ring-[#675d4e] focus:border-[#675d4e] text-sm bg-[#faf5ef] text-[#1d1b1a]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#1d1b1a] focus:ring-[#675d4e] border-[#e8e0d8] rounded bg-[#faf5ef]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#4c463e]">
                  {s.remember}
                </label>
              </div>

              <div className="text-sm">
                <a href="/admin/forgot-password" className="font-semibold text-[#675d4e] hover:text-[#1d1b1a] transition-colors">
                  {s.forgot}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-[#fef8f6] bg-[#1d1b1a] hover:bg-[#32302f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d1b1a] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>{s.btnLoading}</span>
                  </>
                ) : (
                  <>
                    <span>{s.btnLogin}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <AdminLoginContent />
    </Suspense>
  );
}
