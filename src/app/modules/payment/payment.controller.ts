import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export const PaymentController = {
  async createSubscriptionSession(req: Request, res: Response) {
    const { priceId } = req.body;
    const userId = req.user.id;

    const session = await PaymentService.createCheckoutSession(
      userId,
      priceId,
      `${process.env.CLIENT_URL}/payment-success`,
      `${process.env.CLIENT_URL}/payment-cancel`
    );

    res.json({ url: session.url });
  },

  async createOneTimeSession(req: Request, res: Response) {
    const { amount } = req.body;
    const userId = req.user.id;

    const session = await PaymentService.createOneTimePayment(
      userId,
      amount,
      "usd",
      `${process.env.CLIENT_URL}/payment-success`,
      `${process.env.CLIENT_URL}/payment-cancel`
    );

    res.json({ url: session.url });
  },
};
