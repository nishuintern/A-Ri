"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, ArrowLeft, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

/* ─── भाषा अनुवाद (Localized UI strings for forgot-password flow) ─── */
const pageText = {
  fr: {
    heading1: "Réinitialiser votre mot de passe",
    heading2: "Entrez le code de vérification",
    heading3: "Créer un nouveau mot de passe",
    sub1: "Entrez votre adresse e-mail et nous vous enverrons un OTP à 6 chiffres.",
    sub2: (email: string) => `Entrez le code OTP à 6 chiffres envoyé à ${email}.`,
    sub3: "Veuillez entrer votre nouveau mot de passe pour sécuriser votre compte.",
    emailLabel: "Adresse e-mail",
    otpLabel: "OTP à 6 chiffres",
    newPassLabel: "Nouveau mot de passe",
    confirmPassLabel: "Confirmer le nouveau mot de passe",
    btnSend: "Envoyer le code OTP",
    btnVerify: "Vérifier le code",
    btnReset: "Créer le nouveau mot de passe",
    loadingSend: "Envoi en cours...",
    loadingVerify: "Vérification...",
    loadingReset: "Réinitialisation...",
    backEmail: "Changer d'adresse e-mail",
    backOtp: "Retour à la saisie du code",
    backLogin: "Retour à la connexion",
    successOtp: "Un OTP a été envoyé à votre adresse e-mail. Il expirera dans 10 minutes.",
    successVerify: "Format OTP accepté. Veuillez créer votre nouveau mot de passe.",
    successReset: "Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion...",
    errMatch: "Les mots de passe ne correspondent pas.",
    errLength: "Le mot de passe doit comporter au moins 6 caractères.",
    errOtp: "Veuillez entrer un OTP valide à 6 chiffres.",
    stepEmail: "E-mail",
    stepOtp: "Code OTP",
    stepPass: "Mot de passe",
  },
  en: {
    heading1: "Reset your password",
    heading2: "Enter verification code",
    heading3: "Create new password",
    sub1: "Enter your email address and we will send you a 6-digit OTP.",
    sub2: (email: string) => `Enter the 6-digit OTP sent to ${email}.`,
    sub3: "Please enter your new password to secure your account.",
    emailLabel: "Email address",
    otpLabel: "6-Digit OTP",
    newPassLabel: "New Password",
    confirmPassLabel: "Confirm New Password",
    btnSend: "Send Reset OTP",
    btnVerify: "Verify OTP",
    btnReset: "Create New Password",
    loadingSend: "Sending OTP...",
    loadingVerify: "Verifying...",
    loadingReset: "Resetting...",
    backEmail: "Change email address",
    backOtp: "Back to OTP input",
    backLogin: "Back to login",
    successOtp: "An OTP has been sent to your email address. It will expire in 10 minutes.",
    successVerify: "OTP format accepted. Please create your new password.",
    successReset: "Your password has been successfully reset. Redirecting to login...",
    errMatch: "Passwords do not match.",
    errLength: "Password must be at least 6 characters long.",
    errOtp: "Please enter a valid 6-digit OTP.",
    stepEmail: "Email",
    stepOtp: "OTP",
    stepPass: "Password",
  },
};

export default function ForgotPassword() {
  const router = useRouter();
  const { lang } = useLanguage();
  const s = pageText[lang as keyof typeof pageText] || pageText.en;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP email");
      }

      setSuccess(s.successOtp);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError(s.errOtp);
      return;
    }

    setSuccess(s.successVerify);
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(s.errMatch);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(s.errLength);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Invalid OTP" || data.error?.includes("expired")) {
          setStep(2);
        }
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(s.successReset);

      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHeading = () => {
    if (step === 1) return s.heading1;
    if (step === 2) return s.heading2;
    return s.heading3;
  };

  const getSubtext = () => {
    if (step === 1) return s.sub1;
    if (step === 2) return s.sub2(email);
    return s.sub3;
  };

  /* ─── स्टेप लेबल्स (Step labels for progress bar) ─── */
  const stepLabels = [s.stepEmail, s.stepOtp, s.stepPass];

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#1d1b1a]">
          <span className="text-3xl font-extrabold tracking-widest uppercase" style={{ fontFamily: "var(--font-didot, serif)" }}>AÉRI</span>
        </div>
        <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold text-[#1d1b1a]">
          {getHeading()}
        </h2>
        <p className="mt-2 text-center text-sm text-[#4c463e]/60 px-4">
          {getSubtext()}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[#e8e0d8] rounded-2xl sm:px-10">

          {/* Progress Indicator — रिस्पॉन्सिव स्टेपर */}
          <div className="flex items-center justify-center mb-8 gap-1">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step >= stepNum;
              return (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-[#1d1b1a] text-white' : 'bg-[#e8e0d8] text-[#4c463e]'} font-bold text-sm transition-colors`}>
                      {stepNum}
                    </div>
                    <span className="text-[10px] mt-1 text-[#4c463e]/60 font-medium hidden sm:block">{label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-8 sm:w-12 h-1 mx-1 rounded-full ${step > stepNum ? 'bg-[#1d1b1a]' : 'bg-[#e8e0d8]'} transition-colors`} />
                  )}
                </div>
              );
            })}
          </div>

          <form
            className="space-y-6"
            onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {step === 1 && (
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
            )}

            {step === 2 && (
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-[#1d1b1a]">
                  {s.otpLabel}
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-[#4c463e]/40" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#e8e0d8] rounded-xl focus:ring-[#675d4e] focus:border-[#675d4e] text-sm bg-[#faf5ef] text-[#1d1b1a] tracking-widest text-center font-semibold text-lg"
                    placeholder="123456"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1d1b1a]">
                    {s.newPassLabel}
                  </label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#4c463e]/40" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#e8e0d8] rounded-xl focus:ring-[#675d4e] focus:border-[#675d4e] text-sm bg-[#faf5ef] text-[#1d1b1a]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1d1b1a]">
                    {s.confirmPassLabel}
                  </label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#4c463e]/40" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#e8e0d8] rounded-xl focus:ring-[#675d4e] focus:border-[#675d4e] text-sm bg-[#faf5ef] text-[#1d1b1a]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-[#fef8f6] bg-[#1d1b1a] hover:bg-[#32302f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d1b1a] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>{step === 1 ? s.loadingSend : step === 2 ? s.loadingVerify : s.loadingReset}</span>
                  </>
                ) : (
                  <>
                    <span>{step === 1 ? s.btnSend : step === 2 ? s.btnVerify : s.btnReset}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setStep((prev) => (prev - 1) as 1 | 2); setSuccess(""); setError(""); }}
                  className="inline-flex items-center text-sm font-semibold text-[#675d4e] hover:text-[#1d1b1a] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {step === 2 ? s.backEmail : s.backOtp}
                </button>
              ) : (
                <Link href="/admin/login" className="inline-flex items-center text-sm font-semibold text-[#675d4e] hover:text-[#1d1b1a] transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {s.backLogin}
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
