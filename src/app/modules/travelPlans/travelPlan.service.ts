import prisma from "../../config/prisma";

export const TravelPlanService = {
  create: async (ownerId: string, payload: any) => {
    // ensure startDate <= endDate
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    if (start > end) throw new Error("Start date must be before end date");

    return prisma.travelPlan.create({
      data: {
        ownerId,
        destination: payload.destination,
        city: payload.city,
        startDate: start,
        endDate: end,
        minBudget: payload.minBudget ?? null,
        maxBudget: payload.maxBudget ?? null,
        travelType: payload.travelType,
        description: payload.description,
        visibility: payload.visibility ?? "PUBLIC",
      },
    });
  },

  getAllPublic: async (filters: any = {}) => {
    const where: any = { visibility: "PUBLIC" };

    if (filters.destination) {
      where.destination = {
        contains: filters.destination,
        mode: "insensitive",
      };
    }

    if (filters.travelType) where.travelType = filters.travelType;

    if (filters.startDate && filters.endDate) {
      where.AND = [
        { startDate: { lte: new Date(filters.endDate) } },
        { endDate: { gte: new Date(filters.startDate) } },
      ];
    }

    if (filters.interests) {
      // Assuming `interests` is a string array and travelPlan has description
      // Just search description contains interest keywords
      where.description = { contains: filters.interests, mode: "insensitive" };
    }

    return prisma.travelPlan.findMany({
      where,
      include: {
        owner: { select: { id: true, fullName: true, profileImage: true } },
      },
      orderBy: { startDate: "asc" },
    });
  },

  getByOwner: async (ownerId: string) => {
    return prisma.travelPlan.findMany({ where: { ownerId } });
  },

  getById: async (id: string, viewerId?: string) => {
    const plan = await prisma.travelPlan.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, fullName: true, profileImage: true } },
      },
    });
    if (!plan) return null;
    if (plan.visibility === "PRIVATE" && plan.ownerId !== viewerId) return null;
    return plan;
  },

  update: async (id: string, ownerId: string, payload: any) => {
    // ensure owner
    const existing = await prisma.travelPlan.findUnique({ where: { id } });
    if (!existing) throw new Error("Travel plan not found");
    if (existing.ownerId !== ownerId) throw new Error("Not authorized");

    return prisma.travelPlan.update({
      where: { id },
      data: {
        destination: payload.destination,
        city: payload.city,
        startDate: payload.startDate ? new Date(payload.startDate) : undefined,
        endDate: payload.endDate ? new Date(payload.endDate) : undefined,
        minBudget: payload.minBudget ?? undefined,
        maxBudget: payload.maxBudget ?? undefined,
        travelType: payload.travelType,
        description: payload.description,
        visibility: payload.visibility,
      },
    });
  },

  delete: async (id: string, ownerId: string) => {
    const existing = await prisma.travelPlan.findUnique({ where: { id } });
    if (!existing) throw new Error("Travel plan not found");
    if (existing.ownerId !== ownerId) throw new Error("Not authorized");

    return prisma.travelPlan.delete({ where: { id } });
  },
};
