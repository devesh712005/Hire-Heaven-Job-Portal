"use client";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PaymentVerification = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-2 rounded-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful 🎉</h1>

        <p className="text-sm opacity-70 mb-6">
          Your subscription is now active.
          <br />
          Transaction ID:
          <span className="font-semibold block mt-1">{id}</span>
        </p>

        <Link
          href="/account"
          className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go to account page
        </Link>
      </Card>
    </div>
  );
};

export default PaymentVerification;
