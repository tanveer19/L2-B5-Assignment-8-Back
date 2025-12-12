import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { plan } = req.body;

    const result = await paymentService.createCheckoutSession(userId, plan);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Checkout session created successfully",
      data: result,
    });
  }
);

const verifySession = catchAsync(async (req: AuthRequest, res: Response) => {
  const { session_id } = req.query;
  const result = await paymentService.verifySession(session_id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Session verified successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: any, res: Response) => {
  const signature = req.headers["stripe-signature"];
  await paymentService.handleWebhook(req.body, signature);

  res.json({ received: true });
});

const getMySubscription = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const result = await paymentService.getMySubscription(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription retrieved successfully",
      data: result,
    });
  }
);

const getPaymentHistory = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const result = await paymentService.getPaymentHistory(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment history retrieved successfully",
      data: result,
    });
  }
);

const cancelSubscription = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const result = await paymentService.cancelSubscription(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription cancelled successfully",
      data: result,
    });
  }
);

export const paymentController = {
  createCheckoutSession,
  verifySession,
  handleWebhook,
  getMySubscription,
  getPaymentHistory,
  cancelSubscription,
};
