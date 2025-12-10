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

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    await AdminService.deleteUser(id);

    res.json({
      success: true,
      message: "User deleted successfully",
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
