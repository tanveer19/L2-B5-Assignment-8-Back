import prisma from "../../config/prisma";

export const AdminService = {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async blockUnblockUser(id: string, block: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isBlocked: block },
    });
  },

  async getDashboardStats() {
    const totalUsers = await prisma.user.count();
    const totalTravelPlans = await prisma.travelPlan.count();
    const totalReviews = await prisma.review.count();

    return { totalUsers, totalTravelPlans, totalReviews };
  },
};
