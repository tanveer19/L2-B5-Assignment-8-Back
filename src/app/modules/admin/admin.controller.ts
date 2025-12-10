import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export const AdminController = {
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
