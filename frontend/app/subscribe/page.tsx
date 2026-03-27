"use client";
import useRazorpay from "@/components/scriptLoader";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { payment_service, useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import Loading from "@/components/loading";

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
      key: process.env.Key, // Replace with your Razorpay key_id
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
  return <div>SubscriptionPage</div>;
};

export default SubscriptionPage;
