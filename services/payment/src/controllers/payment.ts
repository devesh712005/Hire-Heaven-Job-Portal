import { instance } from "../index.js";
import { AuthenticatedRequest } from "../middlewares/auth";
import { sql } from "../utils/db";
import ErrorHandler from "../utils/errorHandler";
import { TryCatch } from "../utils/TryCatch";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const checkOut = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    throw new ErrorHandler(401, "No Valid User");
  }
  const userId = req.user.user_id;

  const [user] = await sql`SELECT * FROM users WHERE user_id = ${userId}`;
  const subTime = user?.subscription
    ? new Date(user.subscription).getTime()
    : 0;
  const now = Date.now();
  const isSubscribed = subTime > now;
  if (isSubscribed) {
    throw new ErrorHandler(400, "You Already have an subscription");
  }

  const option = {
    amount: Number(119 * 100),
    currency: "INR",
    notes: {
      user_id: userId.toString(),
    },
  };
  const order = await instance.orders.create(option);
  res.status(201).json({
    order,
  });
});

export const paymentVerification = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_Secret as string)
      .update(body)
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      const now = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      const expiryDate = new Date(now.getTime() + thirtyDays);
      const [updatedUser] = await sql`UPDATE users 
        SET subscription = ${expiryDate} WHERE user_id = ${user?.user_id} RETURNING *`;
      res.json({
        message: "Subscription Purchased Successfully",
        updatedUser,
      });
    } else {
      res.status(400).json({
        message: "Payment failed",
      });
    }
  },
);
