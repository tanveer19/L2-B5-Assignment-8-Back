import Stripe from "stripe";
import prisma from "../../config/prisma";
import config from "../../config/env";
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";

const stripe = new Stripe(
  config.STRIPE_SECRET_KEY
  //   , {
  //   apiVersion: '2024-12-18.acacia',
  // }
);
// Plan pricing (in cents)
const PLAN_PRICES = {
  MONTHLY: 999, // $9.99
  YEARLY: 9999, // $99.99 (save ~17%)
};

const createCheckoutSession = async (
  userId: string,
  plan: "MONTHLY" | "YEARLY"
) => {
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user already has active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gt: new Date() },
    },
  });

  if (activeSubscription) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an active subscription"
    );
  }

  // Get or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName || undefined,
      metadata: {
        userId: user.id,
      },
    });
    stripeCustomerId = customer.id;

    // Update user with stripe customer ID
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  // Get price ID based on plan
  const priceId =
    plan === "MONTHLY"
      ? config.STRIPE_MONTHLY_PRICE_ID
      : config.STRIPE_YEARLY_PRICE_ID;

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${config.FRONTEND_URL}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.FRONTEND_URL}/payment/cancel`,
    metadata: {
      userId,
      plan,
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

const verifySession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Session not found");
  }

  return {
    status: session.payment_status,
    customerEmail: session.customer_email,
    amountTotal: session.amount_total,
  };
};

const handleWebhook = async (body: any, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan as "MONTHLY" | "YEARLY";

  if (!userId || !plan) return;

  // Calculate subscription dates
  const startDate = new Date();
  const endDate = new Date();
  if (plan === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Create subscription record
  await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: "ACTIVE",
      startDate,
      endDate,
      stripeSubscriptionId: session.subscription as string,
    },
  });

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      isSubscribed: true,
      subscriptionPlan: plan,
      subscriptionEnd: endDate,
      isVerified: true, // Grant verified badge
    },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      userId,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "usd",
      status: "COMPLETED",
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      plan,
    },
  });
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const stripeSubscriptionId = subscription.id;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: {
      status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
    },
  });
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const stripeSubscriptionId = subscription.id;

  // Update subscription
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: {
      status: "CANCELLED",
    },
  });

  // Update user
  const subscriptionRecord = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  if (subscriptionRecord) {
    await prisma.user.update({
      where: { id: subscriptionRecord.userId },
      data: {
        isSubscribed: false,
        subscriptionPlan: "FREE",
        isVerified: false,
      },
    });
  }
};

const handlePaymentFailed = async (invoice: Stripe.Invoice) => {
  // Stripe Invoice type - subscription can be string, Subscription object, or null
  const subscription = (invoice as any).subscription;

  if (!subscription) {
    console.log("No subscription found in invoice");
    return;
  }

  // Extract subscription ID whether it's a string or object
  const subscriptionId =
    typeof subscription === "string" ? subscription : subscription.id;

  if (!subscriptionId) {
    console.log("No subscription ID found");
    return;
  }

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "PAST_DUE",
    },
  });
};

const getMySubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return null;
  }

  const isActive = subscription.endDate > new Date();

  return {
    ...subscription,
    isActive,
  };
};

const getPaymentHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No active subscription found");
  }

  if (!subscription.stripeSubscriptionId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid subscription");
  }

  // Cancel in Stripe
  await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

  // Update local database
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELLED" },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      isSubscribed: false,
      subscriptionPlan: "FREE",
      isVerified: false,
    },
  });

  return { message: "Subscription cancelled successfully" };
};

export const paymentService = {
  createCheckoutSession,
  verifySession,
  handleWebhook,
  getMySubscription,
  getPaymentHistory,
  cancelSubscription,
};
