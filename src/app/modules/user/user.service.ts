import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import { AppError } from "../../errorHelpers/AppError";
import { createToken } from "../../utils/jwt";
import env from "../../config/env";
import { IRegisterUser, IUserResponse } from "./user.interface";

const registerUser = async (payload: IRegisterUser) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(400, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    env.BCRYPT_SALT_ROUNDS
  );

  // Create user with "user" role (forced for security)
  const newUser = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: "user", // Always create as regular user
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = createToken({
    userId: newUser.id,
    role: newUser.role,
  });

  return { user: newUser, token };
};

export const userService = {
  registerUser,
};
