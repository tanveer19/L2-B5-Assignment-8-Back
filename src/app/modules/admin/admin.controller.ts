import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export const AdminController = {
  async getTravelPlans(req: Request, res: Response) {
    const plans = await AdminService.getAllTravelPlans();
    res.json({ success: true, data: plans });
  },

  async deleteTravelPlan(req: Request, res: Response) {
    const { id } = req.params;
    await AdminService.deleteTravelPlan(id);
    res.json({ success: true, message: "Travel plan deleted successfully" });
  },

  async updateTravelPlan(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await AdminService.updateTravelPlan(id, req.body);
    res.json({ success: true, data: updated });
  },
  async getUsers(req: Request, res: Response) {
    const users = await AdminService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  },

  // New block/unblock controller
  async blockUnblockUser(req: Request, res: Response) {
    const { id } = req.params;
    const { block } = req.body as { block: boolean };

    const user = await AdminService.blockUnblockUser(id, block);

    res.json({
      success: true,
      message: `User has been ${block ? "blocked" : "unblocked"} successfully`,
      data: user,
    });
  },

  async getStats(req: Request, res: Response) {
    const stats = await AdminService.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  },
};
