import prisma from "../../config/prisma";

export const AdminService = {
  // Get all travel plans
  async getAllTravelPlans() {
    return prisma.travelPlan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, fullName: true, email: true } },
      },
    });
  },

  // Delete a travel plan
  async deleteTravelPlan(id: string) {
    return prisma.travelPlan.delete({
      where: { id },
    });
  },

  // Optional: update a travel plan (e.g., approve/visibility)
  async updateTravelPlan(id: string, data: any) {
    return prisma.travelPlan.update({
      where: { id },
      data,
    });
  },
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
