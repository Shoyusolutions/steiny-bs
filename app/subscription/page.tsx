"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function SubscriptionPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch("/api/subscription-logout", { method: "POST" });
    router.push("/");
  };

  return (
    <>
      <Script
        async
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/branding/logo-primary.jpeg"
                alt="Steiny B's"
                className="h-10 w-auto"
              />
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Subscription Management
          </h1>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="space-y-8">
              {/* Payment */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Make Payment</h2>
                <p className="text-xl text-gray-600 mb-8">$29/month billed annually</p>
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-8 rounded-lg">
                    {/* @ts-ignore */}
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RqKTtBnHsS9dP8bXNWAqsy3"
                      publishable-key="pk_live_51RCq3MBnHsS9dP8bV6u08lbPPyV0cb1vXCNXex8hLwrsjP8UWgaRk7oqRMJILYolSADOmWJpmXnzXNF4DPKsLBAF00XbusBFx6"
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Click the button above to make a secure payment through Stripe
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
    </>
  );
}