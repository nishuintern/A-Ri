"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const { lang } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const isFrench = lang === "fr";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!formData.firstName || !formData.email || !formData.address) {
      toast(isFrench ? "Veuillez remplir toutes les informations de livraison requises." : "Please fill in all required shipping details.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error(isFrench ? "Échec du chargement du SDK Razorpay. Êtes-vous connecté à Internet ?" : "Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderData = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      }).then((t) => t.json());

      if (orderData.error) {
        toast.error(orderData.error);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "AÉRI Snacks",
        description: "Premium Snacks Checkout",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderDetails: {
              customer: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
                country: formData.country,
              },
              items: items,
              subtotal: cartTotal,
              shipping: 0,
              total: cartTotal,
            }
          };

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then((t) => t.json());

          if (verifyRes.success) {
            toast.success(isFrench ? `Commande ${verifyRes.orderNumber} passée avec succès via Razorpay !` : `Order ${verifyRes.orderNumber} placed successfully via Razorpay!`);
            router.push("/");
          } else {
            toast.error(isFrench ? "Échec de la vérification du paiement. Veuillez contacter le support." : "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: "#1C1C1C",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(isFrench ? "Échec de l'initiation du paiement Razorpay." : "Failed to initiate Razorpay payment.");
    }
  };

  // Check if cart is empty to redirect back
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-[#F5E6D3] pt-32 px-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-[#1C1C1C] mb-4" style={{ fontFamily: "var(--font-didot), serif" }}>
          {isFrench ? "Votre panier est vide" : "Your cart is empty"}
        </h1>
        <button
          onClick={() => router.push("/products")}
          className="px-8 py-3 bg-[#1C1C1C] text-[#F5E6D3] rounded-xl font-medium tracking-wide hover:bg-[#333] transition-colors"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {isFrench ? "Continuer vos achats" : "Continue Shopping"}
        </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F5E6D3]">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-[#1C1C1C]"
          style={{ fontFamily: "var(--font-didot), serif" }}
        >
          {isFrench ? "Paiement sécurisé" : "Secure Checkout"}
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-8"
          >
            <div className="bg-white/50 p-8 rounded-2xl border border-[#cec5bb] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-[#1C1C1C]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {isFrench ? "Détails de livraison" : "Shipping Details"}
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                <div>
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Prénom" : "First Name"}*</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Nom" : "Last Name"}*</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "E-mail" : "Email"}*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Adresse" : "Address"}*</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Ville" : "City"}*</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Code Postal" : "Zip Code"}*</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#4c463e] mb-1">{isFrench ? "Pays" : "Country"}*</label>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-[#cec5bb] bg-white focus:ring-2 focus:ring-[#1C1C1C] outline-none" />
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Order Summary & PayPal */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[400px] flex flex-col gap-8"
          >
            <div className="bg-white/50 p-8 rounded-2xl border border-[#cec5bb] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-[#1C1C1C]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {isFrench ? "Résumé de la commande" : "Order Summary"}
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-[#F5E6D3] rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      <h4 className="text-sm font-semibold text-[#1C1C1C]">{item.name}</h4>
                      <p className="text-xs text-[#4c463e]">{isFrench ? "Qté" : "Qty"}: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-[#1C1C1C]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#cec5bb] pt-4 mb-6" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                <div className="flex justify-between items-center text-sm text-[#4c463e] mb-2">
                  <span>{isFrench ? "Sous-total" : "Subtotal"}</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[#4c463e] mb-4">
                  <span>{isFrench ? "Livraison" : "Shipping"}</span>
                  <span>{isFrench ? "Gratuit" : "Free"}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-[#1C1C1C]">
                  <span>Total</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Razorpay Integration */}
              <div className="mt-8 z-0 relative">
                <button
                  onClick={handleRazorpayPayment}
                  className="w-full py-3 px-4 bg-[#1C1C1C] text-white rounded-xl font-medium tracking-wide hover:bg-[#333] transition-colors mb-4 flex justify-center items-center gap-2"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isFrench ? "Payer avec Razorpay" : "Pay with Razorpay"}
                </button>
                
                <div className="relative flex py-4 items-center mb-4">
                  <div className="flex-grow border-t border-[#cec5bb]"></div>
                  <span className="flex-shrink-0 mx-4 text-[#4c463e] text-xs uppercase" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{isFrench ? "OU" : "OR"}</span>
                  <div className="flex-grow border-t border-[#cec5bb]"></div>
                </div>

              {/* PayPal Integration using placeholder client ID 'test' */}
              <div className="z-0 relative">
                <PayPalScriptProvider options={{ clientId: "test", currency: "EUR" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "black" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "EUR",
                              value: cartTotal.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        try {
                          const payload = {
                            customer: {
                              name: `${formData.firstName} ${formData.lastName}`,
                              email: formData.email,
                              address: formData.address,
                              city: formData.city,
                              zipCode: formData.zipCode,
                              country: formData.country,
                            },
                            items: items,
                            subtotal: cartTotal,
                            shipping: 0,
                            total: cartTotal,
                            paymentMethod: "PayPal",
                          };

                          const res = await fetch("/api/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          });
                          
                          const result = await res.json();
                          if (result.success) {
                            toast.success(isFrench ? `Commande ${result.orderNumber} passée avec succès ! Merci, ${details?.payer?.name?.given_name}` : `Order ${result.orderNumber} placed successfully! Thank you, ${details?.payer?.name?.given_name}`);
                            // Optional: clear cart here if you have a clearCart method in useCart
                            // clearCart();
                            router.push("/");
                          } else {
                            toast.error(isFrench ? "Le paiement a réussi mais la création de la commande a échoué. Veuillez contacter le support." : "Payment succeeded but order creation failed. Please contact support.");
                          }
                        } catch (err) {
                          console.error("Checkout error:", err);
                          toast.error(isFrench ? "Une erreur est survenue. Veuillez contacter le support." : "An error occurred. Please contact support.");
                        }
                      }
                    }}
                  />
                </PayPalScriptProvider>
                <p className="text-xs text-center mt-3 text-[#4c463e]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {isFrench ? "Paiement sécurisé par PayPal" : "Secure payment via PayPal"}
                </p>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}
