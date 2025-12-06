import { z } from "zod";

export const createTravelPlanSchema = z.object({
  body: z.object({
    destination: z.string().min(1),
    city: z.string().optional(),
    startDate: z
      .string()
      .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
    endDate: z
      .string()
      .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
    minBudget: z.number().int().nonnegative().optional(),
    maxBudget: z.number().int().nonnegative().optional(),
    travelType: z.enum(["SOLO", "FAMILY", "FRIENDS"]),
    description: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  }),
});

export const updateTravelPlanSchema = z.object({
  body: createTravelPlanSchema.shape.body.partial(),
});
