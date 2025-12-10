import prisma from "../../config/prisma";

export const AdminService = {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async getDashboardStats() {
    const totalUsers = await prisma.user.count();
    const totalTravelPlans = await prisma.travelPlan.count();
    const totalReviews = await prisma.review.count();

    return { totalUsers, totalTravelPlans, totalReviews };
  },
};
