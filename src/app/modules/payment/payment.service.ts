import Stripe from "stripe";
import { env } from "../config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const PaymentService = {
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const session = await stripe.checkout.sessions.create({
      customer_email: userId, // or fetch user email from DB
      payment_method_types: ["card"],
      mode: "subscription", // for subscription
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  },

  async createOneTimePayment(
    userId: string,
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // one-time
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Verified Badge" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  },
};
