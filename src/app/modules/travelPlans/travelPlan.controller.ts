import { Request, Response, NextFunction } from "express";
import { TravelPlanService } from "./travelPlan.service";
import { sendResponse } from "../../utils/sendResponse";

export const TravelPlanController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = (req as any).user.id;
      const plan = await TravelPlanService.create(ownerId, req.body);
      sendResponse(res, {
        success: true,
        message: "Created",
        data: plan,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  listPublic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await TravelPlanService.getAllPublic(req.query);
      sendResponse(res, {
        success: true,
        data: plans,
        statusCode: 0,
      });
    } catch (err) {
      next(err);
    }
  },

  myPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const ownerId = user?.id || user?.userId; // <-- safer
      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const plans = await TravelPlanService.getByOwner(ownerId);

      sendResponse(res, {
        success: true,
        data: plans,
        statusCode: 200,
      });
    } catch (err) {
      console.error("Error fetching my plans:", err);
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const viewerId = (req as any).user?.id;
      const plan = await TravelPlanService.getById(req.params.id, viewerId);
      if (!plan)
        return res
          .status(404)
          .json({ success: false, message: "Not found or not visible" });
      sendResponse(res, {
        success: true,
        data: plan,
        statusCode: 0,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = (req as any).user.id;
      const plan = await TravelPlanService.update(
        req.params.id,
        ownerId,
        req.body
      );
      sendResponse(res, {
        success: true,
        data: plan,
        statusCode: 0,
      });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = (req as any).user.id;
      await TravelPlanService.delete(req.params.id, ownerId);
      sendResponse(res, {
        success: true,
        message: "Deleted",
        statusCode: 0,
      });
    } catch (err) {
      next(err);
    }
  },
};
