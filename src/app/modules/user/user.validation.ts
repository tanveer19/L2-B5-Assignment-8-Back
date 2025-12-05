import { z } from "zod";

export const updateUserValidation = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  currentLocation: z.string().optional(),
  profileImage: z.url().optional(),
  interests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
});
