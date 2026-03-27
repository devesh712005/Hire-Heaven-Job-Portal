"use client";
import useRazorpay from "@/components/scriptLoader";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { payment_service, useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, Crown } from "lucide-react";

const SubscriptionPage = () => {
  const razorpayLoaded = useRazorpay();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppData();
  const handleSubscribe = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const {
      data: { order },
    } = await axios.post(
      `${payment_service}/api/payment/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Replace with your Razorpay key_id
      amount: order.id, // Amount is in currency subunits.
      currency: "INR",
      name: "Hire Heaven",
      description: "Finf job easily",
      order_id: order.id, // This is the order_id created in the backend
      handler: async function (response: any) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;
        try {
          const { data } = await axios.post(
            `${payment_service}/api/payment/verify`,
            { razorpay_order_id, razorpay_payment_id, razorpay_signature },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(data.message);
          setUser(data.updateUser);
          router.push(`/payment/success/${razorpay_payment_id}`);
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          toast.error(error.response.data.message);
        }
      },
      theme: {
        color: "#F37254",
      },
    };
    if (!razorpayLoaded) console.log("Something went wrong with script");
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  if (loading) return <Loading />;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-2 rounded-2xl">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <Crown size={32} className="text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Premium Subscription</h1>

        {/* Subtitle */}
        <p className="text-sm opacity-70 mb-6">Boost your job search</p>

        {/* Price */}
        <div className="mb-6">
          <p className="text-5xl font-bold text-blue-600">₹119</p>
          <p className="text-sm opacity-60 mt-1">Per month</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm">
              Your application will be shown first to recruiters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm">Priority support</p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubscribe}
          className="w-full h-12 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Subscribe Now
        </button>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
